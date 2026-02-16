/**
 * Security Audit — Information Disclosure Tests
 *
 * Covers: I1 (full map terrain), I2 (enemy tank stats in welcome),
 * I3 (pillbox/base global), I4 (enemy tank stats in updates),
 * I5 (sound event scoping).
 */

import {describe, it, expect, beforeEach, vi} from 'vitest';
import {GameSession} from '../../game-session.js';
import {decodeServerMessage} from '@jsbolo/shared';
import type {WelcomeMessage, UpdateMessage} from '@jsbolo/shared';
import type {WebSocket} from 'ws';

const createMockWebSocket = () =>
  ({
    send: vi.fn(),
    readyState: 1,
    on: vi.fn(),
    close: vi.fn(),
  }) as unknown as WebSocket;

const getWelcomeMessage = (ws: WebSocket): WelcomeMessage | null => {
  const calls = (ws.send as unknown as {mock: {calls: Array<[Uint8Array]>}}).mock
    .calls;
  for (const call of calls) {
    const msg = decodeServerMessage(call[0]);
    if (msg.type === 'welcome') return msg;
  }
  return null;
};

const getUpdateMessages = (ws: WebSocket): UpdateMessage[] => {
  const calls = (ws.send as unknown as {mock: {calls: Array<[Uint8Array]>}}).mock
    .calls;
  const updates: UpdateMessage[] = [];
  for (const call of calls) {
    try {
      const msg = decodeServerMessage(call[0]);
      if (msg.type === 'update') updates.push(msg);
    } catch {
      // skip non-decodable
    }
  }
  return updates;
};

describe('Security: Information Disclosure', () => {
  let session: GameSession;

  beforeEach(() => {
    session = new GameSession();
    session.start();
  });

  describe('I2: Enemy tank stats in welcome message', () => {
    it('should not reveal enemy resource counts in welcome', () => {
      const ws1 = createMockWebSocket();
      const player1Id = session.addPlayer(ws1);

      const ws2 = createMockWebSocket();
      const player2Id = session.addPlayer(ws2);

      const welcome = getWelcomeMessage(ws2);
      expect(welcome).not.toBeNull();

      // Find the enemy tank (player 1's tank as seen by player 2)
      const enemyTank = welcome!.tanks.find(t => t.id === player1Id);
      expect(enemyTank).toBeDefined();

      // Enemy resource counts should be hidden (zeroed)
      expect(enemyTank!.shells).toBe(0);
      expect(enemyTank!.mines).toBe(0);
      expect(enemyTank!.trees).toBe(0);
      expect(enemyTank!.reload).toBe(0);
      expect(enemyTank!.firingRange).toBe(0);

      // Own tank should have real values
      const selfTank = welcome!.tanks.find(t => t.id === player2Id);
      expect(selfTank).toBeDefined();
      expect(selfTank!.shells).toBeGreaterThan(0);
    });
  });

  describe('I4: Enemy tank stats in updates', () => {
    it('should not reveal enemy resource counts in state updates', () => {
      const ws1 = createMockWebSocket();
      const player1Id = session.addPlayer(ws1);

      const ws2 = createMockWebSocket();
      const player2Id = session.addPlayer(ws2);

      // Run several ticks to generate updates
      for (let i = 0; i < 10; i++) {
        (session as any).update();
      }

      const updates = getUpdateMessages(ws2);
      for (const update of updates) {
        if (!update.tanks) continue;

        for (const tank of update.tanks) {
          if (tank.id === player1Id) {
            // Enemy tank should have zeroed resources
            expect(tank.shells).toBe(0);
            expect(tank.mines).toBe(0);
            expect(tank.trees).toBe(0);
            expect(tank.reload).toBe(0);
            expect(tank.firingRange).toBe(0);
          }
          if (tank.id === player2Id) {
            // Own tank should have real resources
            expect(tank.shells).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  describe('I1: Full map terrain in welcome (gap vs viewport-scoped updates)', () => {
    it('sends full 256x256 terrain in welcome despite viewport-scoped update delivery', () => {
      const ws = createMockWebSocket();
      session.addPlayer(ws);

      const welcome = getWelcomeMessage(ws);
      expect(welcome).not.toBeNull();

      // The welcome builder sends full 256x256 terrain, bypassing the viewport
      // scoping enforced by SessionStateBroadcaster for ongoing updates.
      // Whether this is acceptable depends on whether viewport scoping is intended
      // as a gameplay fog-of-war mechanic or purely a bandwidth optimization.
      // Note: mine positions are NOT in the terrain array (separate system).
      expect(welcome!.map.terrain.length).toBe(256 * 256);
      expect(welcome!.map.width).toBe(256);
      expect(welcome!.map.height).toBe(256);
    });
  });

  describe('I3: Pillbox/base global broadcast (explicit HUD trade-off)', () => {
    it('broadcasts all pillbox/base state to all players regardless of viewport', () => {
      // This is an explicit design choice made during the visibility streaming
      // implementation: pillboxes and bases are kept global so the HUD status
      // panes can show all structure ownership at all times.
      // Trade-off: players know the position and ownership of every structure
      // even before visiting it. If structure-discovery fog-of-war is added
      // later, this would need viewport filtering and "unknown" HUD states.
      const ws = createMockWebSocket();
      session.addPlayer(ws);

      const welcome = getWelcomeMessage(ws);
      expect(welcome).not.toBeNull();

      // Pillboxes and bases are globally visible (explicit design decision)
      expect(welcome!.pillboxes).toBeDefined();
      expect(welcome!.bases).toBeDefined();
    });
  });
});
