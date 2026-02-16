import {describe, expect, it, vi} from 'vitest';
import {decodeServerMessage, encodeClientMessage} from '@jsbolo/shared';
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
          recipientPlayerIds: [12, 99],
        },
      }) as any
    );

    expect(chatSpy).toHaveBeenCalledWith(77, 'hello', {
      allianceOnly: true,
      recipientPlayerIds: [12, 99],
    });
  });

  it('routes decoded remote-view messages to session remote-view handler', () => {
    const session = new GameSession();
    const server = new GameServer(0, {
      session,
      createWebSocketServer: () => createMockWss() as any,
    });
    const ws = {} as any;
    const remoteViewSpy = vi.spyOn(session, 'handleRemoteView');

    (server as any).connections.set(ws, {playerId: 88, session});
    (server as any).handleMessage(
      ws,
      encodeClientMessage({
        type: 'remote_view',
        remoteView: {pillboxId: 7},
      }) as any
    );
    (server as any).handleMessage(
      ws,
      encodeClientMessage({
        type: 'remote_view',
        remoteView: {},
      }) as any
    );

    expect(remoteViewSpy).toHaveBeenNthCalledWith(1, 88, 7);
    expect(remoteViewSpy).toHaveBeenNthCalledWith(2, 88, null);
  });

  it('smoke: decodes client chat and broadcasts scoped hud messages to recipients', () => {
    const session = new GameSession();
    const server = new GameServer(0, {
      session,
      createWebSocketServer: () => createMockWss() as any,
    });

    const ws1 = {send: vi.fn(), readyState: 1} as any;
    const ws2 = {send: vi.fn(), readyState: 1} as any;
    const ws3 = {send: vi.fn(), readyState: 1} as any;
    const p1 = session.addPlayer(ws1);
    const p2 = session.addPlayer(ws2);
    session.addPlayer(ws3);

    // Route only sender socket through GameServer message decoder path.
    (server as any).connections.set(ws1, {playerId: p1, session});

    (session as any).broadcastState();
    ws1.send.mockClear();
    ws2.send.mockClear();
    ws3.send.mockClear();

    (server as any).handleMessage(
      ws1,
      encodeClientMessage({
        type: 'chat',
        chat: {
          text: 'global smoke',
          allianceOnly: false,
        },
      }) as any
    );
    (session as any).broadcastState();

    const global1 = decodeServerMessage(ws1.send.mock.calls.slice(-1)[0][0]);
    const global2 = decodeServerMessage(ws2.send.mock.calls.slice(-1)[0][0]);
    const global3 = decodeServerMessage(ws3.send.mock.calls.slice(-1)[0][0]);
    expect(global1.hudMessages?.some(m => m.class === 'chat_global' && m.text.includes('global smoke'))).toBe(true);
    expect(global2.hudMessages?.some(m => m.class === 'chat_global' && m.text.includes('global smoke'))).toBe(true);
    expect(global3.hudMessages?.some(m => m.class === 'chat_global' && m.text.includes('global smoke'))).toBe(true);

    const players = (session as any).players;
    const team1 = players.get(p1).tank.team;
    const team2 = players.get(p2).tank.team;
    expect(session.requestAlliance(team1, team2)).toBe(true);
    expect(session.acceptAlliance(team2, team1)).toBe(true);
    (session as any).broadcastState();
    ws1.send.mockClear();
    ws2.send.mockClear();
    ws3.send.mockClear();

    (server as any).handleMessage(
      ws1,
      encodeClientMessage({
        type: 'chat',
        chat: {
          text: 'alliance smoke',
          allianceOnly: true,
        },
      }) as any
    );
    (session as any).broadcastState();

    const alliance1 = decodeServerMessage(ws1.send.mock.calls.slice(-1)[0][0]);
    const alliance2 = decodeServerMessage(ws2.send.mock.calls.slice(-1)[0][0]);
    const alliance3 = decodeServerMessage(ws3.send.mock.calls.slice(-1)[0][0]);
    expect(alliance1.hudMessages?.some(m => m.class === 'chat_alliance' && m.text.includes('alliance smoke'))).toBe(true);
    expect(alliance2.hudMessages?.some(m => m.class === 'chat_alliance' && m.text.includes('alliance smoke'))).toBe(true);
    expect(alliance3.hudMessages).toBeUndefined();

    ws1.send.mockClear();
    ws2.send.mockClear();
    ws3.send.mockClear();

    (server as any).handleMessage(
      ws1,
      encodeClientMessage({
        type: 'chat',
        chat: {
          text: 'direct smoke',
          allianceOnly: false,
          recipientPlayerIds: [p2],
        },
      }) as any
    );
    (session as any).broadcastState();

    const direct1 = decodeServerMessage(ws1.send.mock.calls.slice(-1)[0][0]);
    const direct2 = decodeServerMessage(ws2.send.mock.calls.slice(-1)[0][0]);
    const direct3 = decodeServerMessage(ws3.send.mock.calls.slice(-1)[0][0]);
    expect(direct1.hudMessages?.some(m => m.class === 'chat_alliance' && m.text.includes('to Players'))).toBe(true);
    expect(direct2.hudMessages?.some(m => m.class === 'chat_alliance' && m.text.includes('direct smoke'))).toBe(true);
    expect(direct3.hudMessages).toBeUndefined();
  });
});
