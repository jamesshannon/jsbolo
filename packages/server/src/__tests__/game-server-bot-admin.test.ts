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

    expect(server.listAvailableBotProfiles()).toEqual(['idle', 'patrol', 'tactical']);
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
    expect(startSpy).toHaveBeenCalledTimes(0);
    expect(server.listBots()).toHaveLength(1);
    expect(server.listBots()[0]?.profile).toBe('idle');
  });

  it('can run bot-only simulation when explicitly enabled', () => {
    const session = new GameSession();
    const startSpy = vi.spyOn(session, 'start');
    const server = new GameServer(0, {
      session,
      createWebSocketServer: () => createMockWss() as any,
      allowBotOnlySimulation: true,
    });

    const addResult = server.addBot('idle');

    expect(addResult.ok).toBe(true);
    expect(startSpy).toHaveBeenCalledTimes(1);
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

  it('pauses simulation when last human disconnects but bots remain', () => {
    const session = new GameSession();
    const pauseSpy = vi.spyOn(session, 'pause');
    const server = new GameServer(0, {
      session,
      createWebSocketServer: () => createMockWss() as any,
      allowBotOnlySimulation: false,
    });

    const humanWs = {
      send: vi.fn(),
      readyState: 1,
    } as any;
    const humanId = session.addPlayer(humanWs);
    (server as any).connections.set(humanWs, {playerId: humanId, session});
    session.start();
    session.addBot('idle');

    (server as any).handleDisconnect(humanWs);

    expect(pauseSpy).toHaveBeenCalledTimes(1);
  });
});
