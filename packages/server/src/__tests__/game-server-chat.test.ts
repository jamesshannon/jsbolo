import {describe, expect, it, vi} from 'vitest';
import {encodeClientMessage} from '@jsbolo/shared';
import {GameServer} from '../game-server.js';
import {GameSession} from '../game-session.js';

function createMockWss() {
  return {
    on: vi.fn(),
    close: vi.fn(),
  };
}

describe('GameServer chat dispatch', () => {
  it('routes decoded chat messages to session chat handler', () => {
    const session = new GameSession();
    const server = new GameServer(0, {
      session,
      createWebSocketServer: () => createMockWss() as any,
    });
    const ws = {} as any;
    const chatSpy = vi.spyOn(session, 'handlePlayerChat');

    (server as any).connections.set(ws, {playerId: 77, session});
    (server as any).handleMessage(
      ws,
      encodeClientMessage({
        type: 'chat',
        chat: {
          text: 'hello',
          allianceOnly: true,
        },
      }) as any
    );

    expect(chatSpy).toHaveBeenCalledWith(77, 'hello', {allianceOnly: true});
  });
});
