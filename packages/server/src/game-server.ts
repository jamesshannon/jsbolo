/**
 * Game server - WebSocket server managing game sessions
 */

import {WebSocketServer, type RawData, type WebSocket} from 'ws';
import {listBuiltInBotProfiles} from '@jsbolo/bots';
import {GameSession, type SessionBotSummary} from './game-session.js';
import {decodeClientMessage, type ClientMessage} from '@jsbolo/shared';
import type {IncomingMessage} from 'node:http';

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
  allowedOrigins?: string[];
}

/** Security: max WebSocket message size (16 KB) */
const MAX_PAYLOAD_BYTES = 16_384;
/** Security: disconnect after this many consecutive decode errors */
const MAX_CONSECUTIVE_ERRORS = 5;
/** Security: max messages per rate-limit window */
const RATE_LIMIT_MAX_MESSAGES = 100;
/** Security: rate-limit window duration in ms */
const RATE_LIMIT_WINDOW_MS = 1_000;

interface ConnectionState {
  consecutiveErrors: number;
  rateTokens: number;
  lastRateRefillMs: number;
}

export class GameServer {
  private readonly wss: WebSocketServerLike;
  private readonly session: GameSession; // Single session for Phase 2
  private readonly connections = new Map<WebSocket, PlayerConnection>();
  private readonly connectionState = new Map<WebSocket, ConnectionState>();
  private readonly allowBotOnlySimulation: boolean;
  private readonly allowedOrigins: Set<string>;

  constructor(port: number, mapPathOrOptions?: string | GameServerOptions, maybeOptions?: GameServerOptions) {
    const options = typeof mapPathOrOptions === 'string'
      ? maybeOptions
      : mapPathOrOptions;
    const mapPath = typeof mapPathOrOptions === 'string'
      ? mapPathOrOptions
      : options?.mapPath;

    this.wss = options?.createWebSocketServer
      ? options.createWebSocketServer(port)
      : new WebSocketServer({port, maxPayload: MAX_PAYLOAD_BYTES});
    this.session = options?.session ?? new GameSession(mapPath);
    this.allowBotOnlySimulation = options?.allowBotOnlySimulation ?? false;
    this.allowedOrigins = new Set(
      (options?.allowedOrigins ?? [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ]).map(origin => this.normalizeOrigin(origin))
    );

    this.setupEventHandlers();
    console.log(`WebSocket server listening on port ${port}`);
  }

  private setupEventHandlers(): void {
    this.wss.on('connection', (ws: WebSocket, request?: IncomingMessage) => {
      const originHeader = request?.headers.origin;
      if (!this.isOriginAllowed(originHeader)) {
        const origin = this.getOriginHeaderValue(originHeader);
        console.warn(`Rejecting WebSocket connection from disallowed origin: ${origin ?? '<missing>'}`);
        ws.close(1008, 'Origin not allowed');
        return;
      }

      console.log('New WebSocket connection');

      // Add player to session
      const playerId = this.session.addPlayer(ws);
      if (playerId < 0) {
        // Session rejected this connection (for example MAX_PLAYERS reached).
        // Do not track a failed connection in server state maps.
        return;
      }
      this.connections.set(ws, {playerId, session: this.session});
      this.connectionState.set(ws, {
        consecutiveErrors: 0,
        rateTokens: RATE_LIMIT_MAX_MESSAGES,
        lastRateRefillMs: Date.now(),
      });

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

    // Rate limiting: drop messages exceeding threshold
    const state = this.connectionState.get(ws);
    if (state) {
      const now = Date.now();
      this.refillRateLimitTokens(state, now);
      if (state.rateTokens < 1) {
        // Drop excessive messages silently
        return;
      }
      state.rateTokens -= 1;
    }

    try {
      const payload = Array.isArray(data) ? Buffer.concat(data) : data;
      const message: ClientMessage = decodeClientMessage(payload as Uint8Array);

      // Reset error counter on successful decode
      if (state) {
        state.consecutiveErrors = 0;
      }

      if (message.type === 'input' && message.input) {
        if (message.input.accelerating || message.input.braking) {
          console.log(`Player ${conn.playerId} input:`, message.input);
        }
        conn.session.handlePlayerInput(conn.playerId, message.input);
      } else if (message.type === 'chat') {
        conn.session.handlePlayerChat(conn.playerId, message.chat.text, {
          allianceOnly: message.chat.allianceOnly,
          ...(message.chat.recipientPlayerIds !== undefined && {
            recipientPlayerIds: message.chat.recipientPlayerIds,
          }),
        });
      } else if (message.type === 'remote_view') {
        conn.session.handleRemoteView(
          conn.playerId,
          message.remoteView.pillboxId ?? null
        );
      }
    } catch (error) {
      console.error('Error decoding message:', error);
      // Track consecutive errors; disconnect after threshold
      if (state) {
        state.consecutiveErrors++;
        if (state.consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          console.warn(`Disconnecting player ${conn.playerId} after ${MAX_CONSECUTIVE_ERRORS} consecutive decode errors`);
          ws.close(1008, 'Too many invalid messages');
        }
      }
    }
  }

  /**
   * Return the origin header as a single string (or null when missing/invalid).
   */
  private getOriginHeaderValue(header: string | string[] | undefined): string | null {
    if (typeof header === 'string') {
      return header;
    }
    if (Array.isArray(header)) {
      return header[0] ?? null;
    }
    return null;
  }

  /**
   * Normalize origins to a canonical form so allowlist checks are stable.
   */
  private normalizeOrigin(origin: string): string {
    return origin.trim().replace(/\/+$/, '');
  }

  /**
   * Validate browser Origin for WebSocket handshake.
   *
   * Note: non-browser WebSocket clients may omit Origin. We allow missing Origin
   * for compatibility, but reject explicit origins outside the allowlist.
   */
  private isOriginAllowed(header: string | string[] | undefined): boolean {
    const origin = this.getOriginHeaderValue(header);
    if (!origin) {
      return true;
    }
    return this.allowedOrigins.has(this.normalizeOrigin(origin));
  }

  /**
   * Token bucket refill: bounded memory O(1) limiter.
   */
  private refillRateLimitTokens(state: ConnectionState, nowMs: number): void {
    const elapsedMs = Math.max(0, nowMs - state.lastRateRefillMs);
    if (elapsedMs === 0) {
      return;
    }
    const refillPerMs = RATE_LIMIT_MAX_MESSAGES / RATE_LIMIT_WINDOW_MS;
    state.rateTokens = Math.min(
      RATE_LIMIT_MAX_MESSAGES,
      state.rateTokens + elapsedMs * refillPerMs
    );
    state.lastRateRefillMs = nowMs;
  }

  private handleDisconnect(ws: WebSocket): void {
    const conn = this.connections.get(ws);
    if (conn) {
      conn.session.removePlayer(conn.playerId);
      this.connections.delete(ws);
      this.connectionState.delete(ws);
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
