import {describe, expect, it, vi} from 'vitest';
import {GameServer} from '../game-server.js';
import {GameSession} from '../game-session.js';

function createMockWss() {
  return {
    on: vi.fn(),
    close: vi.fn(),
  };
}

describe('GameServer bot admin surface', () => {
  it('lists available built-in bot profiles', () => {
    const server = new GameServer(0, {
      session: new GameSession(),
      createWebSocketServer: () => createMockWss() as any,
    });

    expect(server.listAvailableBotProfiles()).toEqual(['idle', 'patrol']);
  });

  it('adds and lists bots through server API', () => {
    const session = new GameSession();
    const startSpy = vi.spyOn(session, 'start');
    const server = new GameServer(0, {
      session,
      createWebSocketServer: () => createMockWss() as any,
    });

    const addResult = server.addBot('idle');

    expect(addResult.ok).toBe(true);
    expect(startSpy).toHaveBeenCalledTimes(1);
    expect(server.listBots()).toHaveLength(1);
    expect(server.listBots()[0]?.profile).toBe('idle');
  });

  it('rejects invalid bot profile names', () => {
    const server = new GameServer(0, {
      session: new GameSession(),
      createWebSocketServer: () => createMockWss() as any,
    });

    const addResult = server.addBot('bad-profile');

    expect(addResult.ok).toBe(false);
    if (!addResult.ok) {
      expect(addResult.reason).toContain('Unknown bot profile');
    }
  });

  it('removes a bot by player id', () => {
    const server = new GameServer(0, {
      session: new GameSession(),
      createWebSocketServer: () => createMockWss() as any,
    });

    const addResult = server.addBot('idle');
    expect(addResult.ok).toBe(true);

    if (!addResult.ok) {
      throw new Error('Expected bot add to succeed');
    }

    const removed = server.removeBot(addResult.playerId);

    expect(removed).toBe(true);
    expect(server.listBots()).toEqual([]);
  });
});
