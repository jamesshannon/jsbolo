/**
 * Game server - WebSocket server managing game sessions
 */

import {WebSocketServer, type RawData, type WebSocket} from 'ws';
import {listBuiltInBotProfiles} from '@jsbolo/bots';
import {GameSession, type SessionBotSummary} from './game-session.js';
import {decodeClientMessage, type ClientMessage} from '@jsbolo/shared';

interface PlayerConnection {
  playerId: number;
  session: GameSession;
}

type WebSocketServerLike = Pick<WebSocketServer, 'on' | 'close'>;

interface GameServerOptions {
  mapPath?: string;
  session?: GameSession;
  createWebSocketServer?: (port: number) => WebSocketServerLike;
  allowBotOnlySimulation?: boolean;
}

export class GameServer {
  private readonly wss: WebSocketServerLike;
  private readonly session: GameSession; // Single session for Phase 2
  private readonly connections = new Map<WebSocket, PlayerConnection>();
  private readonly allowBotOnlySimulation: boolean;

  constructor(port: number, mapPathOrOptions?: string | GameServerOptions, maybeOptions?: GameServerOptions) {
    const options = typeof mapPathOrOptions === 'string'
      ? maybeOptions
      : mapPathOrOptions;
    const mapPath = typeof mapPathOrOptions === 'string'
      ? mapPathOrOptions
      : options?.mapPath;

    this.wss = options?.createWebSocketServer
      ? options.createWebSocketServer(port)
      : new WebSocketServer({port});
    this.session = options?.session ?? new GameSession(mapPath);
    this.allowBotOnlySimulation = options?.allowBotOnlySimulation ?? false;

    this.setupEventHandlers();
    console.log(`WebSocket server listening on port ${port}`);
  }

  private setupEventHandlers(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New WebSocket connection');

      // Add player to session
      const playerId = this.session.addPlayer(ws);
      this.connections.set(ws, {playerId, session: this.session});

      // Start or resume on first active human connection.
      if (this.connections.size === 1) {
        this.session.start();
      }

      ws.on('message', (data: RawData) => {
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

  private handleMessage(ws: WebSocket, data: RawData): void {
    const conn = this.connections.get(ws);
    if (!conn) {
      return;
    }

    try {
      const payload = Array.isArray(data) ? Buffer.concat(data) : data;
      const message: ClientMessage = decodeClientMessage(payload as Uint8Array);

      if (message.type === 'input' && message.input) {
        if (message.input.accelerating || message.input.braking) {
          console.log(`Player ${conn.playerId} input:`, message.input);
        }
        conn.session.handlePlayerInput(conn.playerId, message.input);
      } else if (message.type === 'chat') {
        conn.session.handlePlayerChat(conn.playerId, message.chat.text, {
          allianceOnly: message.chat.allianceOnly,
          recipientPlayerIds: message.chat.recipientPlayerIds,
        });
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
      if (
        this.connections.size === 0 &&
        conn.session.getPlayerCount() > 0 &&
        !this.allowBotOnlySimulation
      ) {
        conn.session.pause();
      }
    }
    console.log('WebSocket disconnected');
  }

  close(): void {
    this.session.stop();
    this.wss.close();
  }

  /**
   * List built-in server bot profiles available for runtime spawning.
   */
  listAvailableBotProfiles(): string[] {
    return listBuiltInBotProfiles();
  }

  /**
   * Add a bot-controlled player to the active session.
   */
  addBot(profile: string): {ok: true; playerId: number} | {ok: false; reason: string} {
    if (!this.listAvailableBotProfiles().includes(profile)) {
      return {ok: false, reason: `Unknown bot profile: ${profile}`};
    }

    const botPlayerId = this.session.addBot(profile);
    if (botPlayerId === null) {
      return {ok: false, reason: 'Bot policy rejected add request (allowBots/maxBots).'};
    }

    if (this.allowBotOnlySimulation && this.session.getPlayerCount() === 1) {
      this.session.start();
    }

    return {ok: true, playerId: botPlayerId};
  }

  /**
   * Remove a bot-controlled player from the active session.
   */
  removeBot(botPlayerId: number): boolean {
    return this.session.removeBot(botPlayerId);
  }

  /**
   * Return currently connected bot players.
   */
  listBots(): SessionBotSummary[] {
    return this.session.listBots();
  }
}
