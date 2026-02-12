import {TerrainType, type PlayerInput} from '@jsbolo/shared';
import type {ServerTank} from '../simulation/tank.js';
import type {ServerWorld} from '../simulation/world.js';
import {ServerTank as Tank} from '../simulation/tank.js';
import type {WebSocket} from 'ws';

export interface SessionPlayer {
  id: number;
  ws: WebSocket;
  tank: ServerTank;
  lastInput: PlayerInput;
  controlType: 'human' | 'bot';
  botProfile?: string;
  botRuntimeId?: string;
  pendingBuildOrder?: NonNullable<PlayerInput['buildOrder']>;
}

/**
 * Owns player lifecycle for a game session (join/spawn/leave bookkeeping).
 *
 * WHY THIS EXISTS:
 * - Keeps `GameSession` focused on simulation/network orchestration.
 * - Makes spawn/team/disconnect behavior unit-testable in isolation.
 */
export class SessionPlayerManager {
  private readonly players = new Map<number, SessionPlayer>();
  private nextPlayerId = 1;

  constructor(
    private readonly world: ServerWorld,
    private readonly onPlayerJoined: (player: SessionPlayer) => void,
    private readonly log: (message: string) => void = console.log
  ) {}

  addPlayer(ws: WebSocket): number {
    const playerId = this.nextPlayerId++;
    const team = (playerId - 1) % 16;

    const startPositions = this.world.getStartPositions();
    let spawnX: number;
    let spawnY: number;

    if (startPositions.length > 0) {
      const startPos = startPositions[(playerId - 1) % startPositions.length]!;
      spawnX = startPos.tileX;
      spawnY = startPos.tileY;
      const terrain = this.world.getTerrainAt(spawnX, spawnY);
      this.log(
        `Player ${playerId} spawning at start position (${spawnX}, ${spawnY}) - terrain: ${terrain}`
      );
    } else {
      spawnX = 128 + (playerId * 5);
      spawnY = 128 + (playerId * 5);
      this.log(`Player ${playerId} spawning at fallback position (${spawnX}, ${spawnY})`);
    }

    const tank = new Tank(playerId, team, spawnX, spawnY);
    const terrain = this.world.getTerrainAt(spawnX, spawnY);

    // ASSUMPTION: boat is carried by the tank while in water; we do not place BOAT tile at spawn.
    if (terrain === TerrainType.DEEP_SEA || terrain === TerrainType.RIVER) {
      tank.onBoat = true;
      this.log(
        `  -> Tank spawned on boat in water at (${spawnX}, ${spawnY}), no BOAT tile created`
      );
    }

    const player: SessionPlayer = {
      id: playerId,
      ws,
      tank,
      lastInput: {
        sequence: 0,
        tick: 0,
        accelerating: false,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: 0,
      },
      controlType: 'human',
    };

    this.players.set(playerId, player);
    this.onPlayerJoined(player);
    this.log(`Player ${playerId} joined (total: ${this.players.size})`);
    return playerId;
  }

  removePlayer(playerId: number): {removed: boolean; isEmpty: boolean} {
    const removed = this.players.delete(playerId);
    if (removed) {
      this.log(`Player ${playerId} left (remaining: ${this.players.size})`);
    }
    return {removed, isEmpty: this.players.size === 0};
  }

  getPlayer(playerId: number): SessionPlayer | undefined {
    return this.players.get(playerId);
  }

  getPlayers(): Map<number, SessionPlayer> {
    return this.players;
  }

  getPlayerCount(): number {
    return this.players.size;
  }
}
