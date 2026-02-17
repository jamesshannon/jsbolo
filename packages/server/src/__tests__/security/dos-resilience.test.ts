/**
 * Security Audit — DoS Resilience Tests
 *
 * Covers: S1 (message size limit), S4 (malformed message handling),
 * D1-D5 (resource exhaustion), G1 (input rate limiting), G5 (mine chain cap).
 */

import {describe, it, expect, vi} from 'vitest';
import {GameServer} from '../../game-server.js';
import {GameSession} from '../../game-session.js';
import {ServerWorld} from '../../simulation/world.js';
import {
  MAX_PLAYERS,
  TerrainType,
  encodeClientMessage,
  decodeServerMessage,
} from '@jsbolo/shared';
import type {WebSocket, WebSocketServer} from 'ws';
import {EventEmitter} from 'events';

const createMockWebSocket = () => {
  const emitter = new EventEmitter();
  return Object.assign(emitter, {
    send: vi.fn(),
    readyState: 1,
    close: vi.fn(),
  }) as unknown as WebSocket;
};

function createConnectionRequest(options?: {
  origin?: string;
  remoteAddress?: string;
}): any {
  return {
    headers: {origin: options?.origin ?? 'http://localhost:3000'},
    socket: {remoteAddress: options?.remoteAddress ?? '127.0.0.1'},
  };
}

describe('Security: DoS Resilience', () => {
  describe('S1/D1: WebSocket maxPayload', () => {
    it('should configure maxPayload on WebSocketServer', () => {
      const mockWss = new EventEmitter();
      Object.assign(mockWss, {close: vi.fn()});
      let capturedMaxPayload = 0;

      const server = new GameServer(0, {
        createWebSocketServer: (_port: number, options: {maxPayload: number}) => {
          capturedMaxPayload = options.maxPayload;
          return mockWss as any;
        },
      });

      expect(capturedMaxPayload).toBe(16_384);
      server.close();
    });
  });

  describe('S4: Malformed message error counting', () => {
    it('should handle decode errors without crashing', () => {
      const mockWss = new EventEmitter();
      Object.assign(mockWss, {close: vi.fn()});

      const server = new GameServer(0, {
        createWebSocketServer: () => mockWss as any,
      });

      const ws = createMockWebSocket();
      mockWss.emit('connection', ws, createConnectionRequest());

      // Send garbage data — should not crash
      const garbageData = Buffer.from([0xff, 0xfe, 0xfd, 0xfc]);
      ws.emit('message', garbageData);
      ws.emit('message', garbageData);
      ws.emit('message', garbageData);
      ws.emit('message', garbageData);

      // Connection should still be open after 4 errors (threshold is 5)
      expect(ws.close).not.toHaveBeenCalled();

      // 5th error should trigger disconnect
      ws.emit('message', garbageData);
      expect(ws.close).toHaveBeenCalledWith(1008, 'Too many invalid messages');

      server.close();
    });

    it('should reset error counter on valid message', () => {
      const mockWss = new EventEmitter();
      Object.assign(mockWss, {close: vi.fn()});

      const server = new GameServer(0, {
        createWebSocketServer: () => mockWss as any,
      });

      const ws = createMockWebSocket();
      mockWss.emit('connection', ws, createConnectionRequest());

      const garbageData = Buffer.from([0xff, 0xfe, 0xfd, 0xfc]);

      // Send 4 bad messages
      for (let i = 0; i < 4; i++) {
        ws.emit('message', garbageData);
      }
      expect(ws.close).not.toHaveBeenCalled();

      // Send a valid message to reset counter
      const validMessage = encodeClientMessage({
        type: 'input',
        input: {
          sequence: 1,
          tick: 1,
          accelerating: false,
          braking: false,
          turningClockwise: false,
          turningCounterClockwise: false,
          shooting: false,
          rangeAdjustment: 0,
        },
      });
      ws.emit('message', validMessage);

      // Now send 4 more bad messages — should not disconnect (counter reset)
      for (let i = 0; i < 4; i++) {
        ws.emit('message', garbageData);
      }
      expect(ws.close).not.toHaveBeenCalled();

      server.close();
    });
  });

  describe('G1/D3: Input rate limiting', () => {
    it('should drop messages exceeding rate limit', () => {
      const mockWss = new EventEmitter();
      Object.assign(mockWss, {close: vi.fn()});

      const server = new GameServer(0, {
        createWebSocketServer: () => mockWss as any,
      });

      const ws = createMockWebSocket();
      mockWss.emit('connection', ws, createConnectionRequest());

      const validMessage = encodeClientMessage({
        type: 'input',
        input: {
          sequence: 1,
          tick: 1,
          accelerating: true,
          braking: false,
          turningClockwise: false,
          turningCounterClockwise: false,
          shooting: false,
          rangeAdjustment: 0,
        },
      });

      // Send 150 messages rapidly — should not crash; excess are dropped
      const start = Date.now();
      for (let i = 0; i < 150; i++) {
        ws.emit('message', validMessage);
      }
      const elapsed = Date.now() - start;

      // Should complete quickly without hanging
      expect(elapsed).toBeLessThan(1000);

      // Connection should NOT be closed (rate limiting drops, doesn't disconnect)
      expect(ws.close).not.toHaveBeenCalled();
      const state = (server as any).connectionState.get(ws);
      expect(state).toBeDefined();
      expect(state.rateTokens).toBeGreaterThanOrEqual(0);
      expect(state.rateTokens).toBeLessThanOrEqual(100);
      expect((state as any).messageTimestamps).toBeUndefined();

      server.close();
    });

    it('should reject WebSocket connections from disallowed origins', () => {
      const mockWss = new EventEmitter();
      Object.assign(mockWss, {close: vi.fn()});
      const server = new GameServer(0, {
        createWebSocketServer: () => mockWss as any,
      });

      const ws = createMockWebSocket();
      mockWss.emit('connection', ws, createConnectionRequest({origin: 'https://evil.example'}));

      expect(ws.close).toHaveBeenCalledWith(1008, 'Origin not allowed');
      expect((server as any).connections.has(ws)).toBe(false);
      expect((server as any).connectionState.has(ws)).toBe(false);

      server.close();
    });
  });

  describe('D4: MAX_PLAYERS enforcement', () => {
    it('should reject connections when server is full', () => {
      const session = new GameSession();
      session.start();

      const sockets: WebSocket[] = [];

      // Fill to MAX_PLAYERS
      for (let i = 0; i < MAX_PLAYERS; i++) {
        const ws = {
          send: vi.fn(),
          readyState: 1,
          on: vi.fn(),
          close: vi.fn(),
        } as unknown as WebSocket;
        session.addPlayer(ws);
        sockets.push(ws);
      }

      // 17th player should be rejected
      const rejectedWs = {
        send: vi.fn(),
        readyState: 1,
        on: vi.fn(),
        close: vi.fn(),
      } as unknown as WebSocket;

      const result = session.addPlayer(rejectedWs);
      expect(result).toBe(-1);
      expect(rejectedWs.close).toHaveBeenCalledWith(1013, 'Server full');

      session.stop();
    });

    it('should not track rejected full-server connections in GameServer maps', () => {
      const session = new GameSession();
      session.start();
      for (let i = 0; i < MAX_PLAYERS; i++) {
        const ws = createMockWebSocket();
        session.addPlayer(ws);
      }

      const mockWss = new EventEmitter();
      Object.assign(mockWss, {close: vi.fn()});
      const server = new GameServer(0, {
        session,
        createWebSocketServer: () => mockWss as any,
      });

      const rejectedWs = createMockWebSocket();
      mockWss.emit('connection', rejectedWs, createConnectionRequest());

      expect(rejectedWs.close).toHaveBeenCalledWith(1013, 'Server full');
      expect((server as any).connections.has(rejectedWs)).toBe(false);
      expect((server as any).connectionState.has(rejectedWs)).toBe(false);

      server.close();
      session.stop();
    });
  });

  describe('D2: Connection rate limiting', () => {
    it('should reject rapid connection bursts from the same source', () => {
      const mockWss = new EventEmitter();
      Object.assign(mockWss, {close: vi.fn()});
      const server = new GameServer(0, {
        createWebSocketServer: () => mockWss as any,
      });

      const sockets = Array.from({length: 25}, () => createMockWebSocket());
      for (const ws of sockets) {
        mockWss.emit(
          'connection',
          ws,
          createConnectionRequest({remoteAddress: '10.0.0.1'})
        );
      }

      const rejected = sockets.filter(ws =>
        (ws.close as unknown as ReturnType<typeof vi.fn>).mock.calls.some(
          call => call[0] === 1013 && call[1] === 'Connection rate limit exceeded'
        )
      );
      expect(rejected.length).toBeGreaterThan(0);

      server.close();
    });
  });

  describe('G5/D5: Mine chain reaction cap', () => {
    it('should cap chain detonations at MAX_CHAIN_DETONATIONS', () => {
      const world = new ServerWorld();

      // Place a very long line of mines (> 256)
      for (let x = 30; x < 230; x++) {
        // Place mines on 3 parallel rows for density
        world.setMineAt(x, 100, true);
        world.setMineAt(x, 101, true);
        world.setMineAt(x, 102, true);
      }

      // Trigger chain reaction
      const result = world.triggerMineExplosion(30, 100, 1);

      // Should be capped at 256
      expect(result.explodedMines.length).toBeLessThanOrEqual(
        ServerWorld.MAX_CHAIN_DETONATIONS
      );
      expect(result.explodedMines.length).toBeGreaterThan(0);
    });

    it('should process small mine groups without hitting cap', () => {
      const world = new ServerWorld();

      // Place a small cluster of 5 mines
      world.setMineAt(100, 100, true);
      world.setMineAt(101, 100, true);
      world.setMineAt(102, 100, true);
      world.setMineAt(100, 101, true);
      world.setMineAt(101, 101, true);

      const result = world.triggerMineExplosion(100, 100, 1);
      expect(result.explodedMines.length).toBe(5);
    });
  });
});
