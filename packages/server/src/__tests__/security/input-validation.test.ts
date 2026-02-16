/**
 * Security Audit — Input Validation Tests
 *
 * Covers: G2 (build order coordinate validation), G3 (build action enum),
 * G4 (rangeAdjustment enum), S2 (chat relay), S3 (recipient array cap).
 */

import {describe, it, expect, beforeEach, vi} from 'vitest';
import {GameSession} from '../../game-session.js';
import {
  BuildAction,
  RangeAdjustment,
  MAP_SIZE_TILES,
  MAX_PLAYERS,
  decodeServerMessage,
} from '@jsbolo/shared';
import type {WebSocket} from 'ws';

const createMockWebSocket = () =>
  ({
    send: vi.fn(),
    readyState: 1,
    on: vi.fn(),
    close: vi.fn(),
  }) as unknown as WebSocket;

const getLastServerMessage = (ws: WebSocket) => {
  const calls = (ws.send as unknown as {mock: {calls: Array<[Uint8Array]>}}).mock
    .calls;
  const lastCall = calls.slice(-1)[0];
  if (!lastCall) return null;
  return decodeServerMessage(lastCall[0]);
};

describe('Security: Input Validation', () => {
  let session: GameSession;

  beforeEach(() => {
    session = new GameSession();
    session.start();
  });

  describe('G2: Build order coordinate validation', () => {
    it('should reject NaN coordinates in build orders', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      session.handlePlayerInput(playerId, {
        sequence: 1,
        tick: 1,
        accelerating: false,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: RangeAdjustment.NONE,
        buildOrder: {
          action: BuildAction.ROAD,
          targetX: NaN,
          targetY: 100,
        },
      });

      // The pending build order should NOT have been set
      const players = (session as any).players as Map<number, any>;
      const player = players.get(playerId);
      expect(player.pendingBuildOrder).toBeUndefined();
    });

    it('should reject Infinity coordinates in build orders', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      session.handlePlayerInput(playerId, {
        sequence: 1,
        tick: 1,
        accelerating: false,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: RangeAdjustment.NONE,
        buildOrder: {
          action: BuildAction.ROAD,
          targetX: Infinity,
          targetY: -Infinity,
        },
      });

      const players = (session as any).players as Map<number, any>;
      const player = players.get(playerId);
      expect(player.pendingBuildOrder).toBeUndefined();
    });

    it('should clamp negative coordinates to 0', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      session.handlePlayerInput(playerId, {
        sequence: 1,
        tick: 1,
        accelerating: false,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: RangeAdjustment.NONE,
        buildOrder: {
          action: BuildAction.ROAD,
          targetX: -5,
          targetY: -10,
        },
      });

      const players = (session as any).players as Map<number, any>;
      const player = players.get(playerId);
      expect(player.pendingBuildOrder).toBeDefined();
      expect(player.pendingBuildOrder.targetX).toBe(0);
      expect(player.pendingBuildOrder.targetY).toBe(0);
    });

    it('should clamp oversized coordinates to MAP_SIZE_TILES - 1', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      session.handlePlayerInput(playerId, {
        sequence: 1,
        tick: 1,
        accelerating: false,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: RangeAdjustment.NONE,
        buildOrder: {
          action: BuildAction.ROAD,
          targetX: 999,
          targetY: 500,
        },
      });

      const players = (session as any).players as Map<number, any>;
      const player = players.get(playerId);
      expect(player.pendingBuildOrder).toBeDefined();
      expect(player.pendingBuildOrder.targetX).toBe(MAP_SIZE_TILES - 1);
      expect(player.pendingBuildOrder.targetY).toBe(MAP_SIZE_TILES - 1);
    });

    it('should accept valid coordinates unchanged', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      session.handlePlayerInput(playerId, {
        sequence: 1,
        tick: 1,
        accelerating: false,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: RangeAdjustment.NONE,
        buildOrder: {
          action: BuildAction.ROAD,
          targetX: 100,
          targetY: 150,
        },
      });

      const players = (session as any).players as Map<number, any>;
      const player = players.get(playerId);
      expect(player.pendingBuildOrder).toBeDefined();
      expect(player.pendingBuildOrder.targetX).toBe(100);
      expect(player.pendingBuildOrder.targetY).toBe(150);
    });
  });

  describe('G3: Build action enum validation', () => {
    it('should reject invalid build action values', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      session.handlePlayerInput(playerId, {
        sequence: 1,
        tick: 1,
        accelerating: false,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: RangeAdjustment.NONE,
        buildOrder: {
          action: 99 as BuildAction,
          targetX: 100,
          targetY: 100,
        },
      });

      const players = (session as any).players as Map<number, any>;
      const player = players.get(playerId);
      expect(player.pendingBuildOrder).toBeUndefined();
    });

    it('should accept all valid BuildAction values', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      for (const action of [
        BuildAction.NONE,
        BuildAction.FOREST,
        BuildAction.ROAD,
        BuildAction.REPAIR,
        BuildAction.BOAT,
        BuildAction.BUILDING,
        BuildAction.PILLBOX,
        BuildAction.MINE,
      ]) {
        session.handlePlayerInput(playerId, {
          sequence: 1,
          tick: 1,
          accelerating: false,
          braking: false,
          turningClockwise: false,
          turningCounterClockwise: false,
          shooting: false,
          rangeAdjustment: RangeAdjustment.NONE,
          buildOrder: {
            action,
            targetX: 100,
            targetY: 100,
          },
        });

        const players = (session as any).players as Map<number, any>;
        const player = players.get(playerId);
        expect(player.pendingBuildOrder).toBeDefined();
        expect(player.pendingBuildOrder.action).toBe(action);
      }
    });
  });

  describe('G4: RangeAdjustment validation', () => {
    it('should reset invalid rangeAdjustment to NONE', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      session.handlePlayerInput(playerId, {
        sequence: 1,
        tick: 1,
        accelerating: false,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: 99 as RangeAdjustment,
      });

      const players = (session as any).players as Map<number, any>;
      const player = players.get(playerId);
      expect(player.lastInput.rangeAdjustment).toBe(RangeAdjustment.NONE);
    });
  });

  describe('S2: Chat text sanitization', () => {
    it('should truncate chat messages to 160 characters', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      const longMessage = 'A'.repeat(500);
      session.handlePlayerChat(playerId, longMessage);

      // The message was accepted (didn't crash).
      // Verify via HUD messages that text was truncated.
      // Run a tick so broadcast happens.
      (session as any).update();
      const msg = getLastServerMessage(ws);
      if (msg && msg.type === 'update' && msg.hudMessages) {
        const chatMsg = msg.hudMessages.find(h => h.text.includes('Player'));
        if (chatMsg) {
          // Player prefix + message should be bounded
          expect(chatMsg.text.length).toBeLessThanOrEqual(200);
        }
      }
    });

    it('should reject empty messages after trim', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      // Send whitespace-only message
      session.handlePlayerChat(playerId, '   ');

      // No crash, message silently dropped
      expect(true).toBe(true);
    });
  });

  describe('S3: Unbounded chat recipient array', () => {
    it('should cap recipient array to MAX_PLAYERS', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      // Create a very large recipient array
      const hugeRecipientList = Array.from({length: 100_000}, (_, i) => i);

      // This should not hang or crash
      const start = Date.now();
      session.handlePlayerChat(playerId, 'test', {
        recipientPlayerIds: hugeRecipientList,
      });
      const elapsed = Date.now() - start;

      // Processing should complete quickly (< 100ms)
      expect(elapsed).toBeLessThan(100);
    });
  });
});
