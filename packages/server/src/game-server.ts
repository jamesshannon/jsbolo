/**
 * Game server - WebSocket server managing game sessions
 */

import {WebSocketServer, type WebSocket} from 'ws';
import {GameSession} from './game-session.js';
import {decodeClientMessage, type ClientMessage} from '@jsbolo/shared';

interface PlayerConnection {
  playerId: number;
  session: GameSession;
}

export class GameServer {
  private readonly wss: WebSocketServer;
  private readonly session: GameSession; // Single session for Phase 2
  private readonly connections = new Map<WebSocket, PlayerConnection>();

  constructor(port: number) {
    this.wss = new WebSocketServer({port});
    this.session = new GameSession();

    this.setupEventHandlers();
    console.log(`WebSocket server listening on port ${port}`);
  }

  private setupEventHandlers(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection');

      // Add player to session
      const playerId = this.session.addPlayer(ws);
      this.connections.set(ws, {playerId, session: this.session});

      // Start session if first player
      if (this.session.getPlayerCount() === 1) {
        this.session.start();
      }

      ws.on('message', (data: Buffer) => {
        this.handleMessage(ws, data);
      });

      ws.on('close', () => {
        this.handleDisconnect(ws);
      });

      ws.on('error', (error: Error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  private handleMessage(ws: WebSocket, data: Buffer): void {
    const conn = this.connections.get(ws);
    if (!conn) {
      return;
    }

    try {
      const message: ClientMessage = decodeClientMessage(data.toString());

      if (message.type === 'input' && message.input) {
        conn.session.handlePlayerInput(conn.playerId, message.input);
      }
    } catch (error) {
      console.error('Error decoding message:', error);
    }
  }

  private handleDisconnect(ws: WebSocket): void {
    const conn = this.connections.get(ws);
    if (conn) {
      conn.session.removePlayer(conn.playerId);
      this.connections.delete(ws);
    }
    console.log('WebSocket disconnected');
  }

  close(): void {
    this.session.stop();
    this.wss.close();
  }
}
