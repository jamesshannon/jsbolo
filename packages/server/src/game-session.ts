/**
 * Game session - manages a single game instance
 */

import {
  TICK_LENGTH_MS,
  type PlayerInput,
  encodeServerMessage,
  type WelcomeMessage,
  type UpdateMessage,
} from '@jsbolo/shared';
import {ServerTank} from './simulation/tank.js';
import {ServerWorld} from './simulation/world.js';
import type {WebSocket} from 'ws';

interface Player {
  id: number;
  ws: WebSocket;
  tank: ServerTank;
  lastInput: PlayerInput;
}

export class GameSession {
  private readonly world: ServerWorld;
  private readonly players = new Map<number, Player>();
  private nextPlayerId = 1;
  private tick = 0;
  private running = false;
  private tickInterval?: NodeJS.Timeout;

  constructor() {
    this.world = new ServerWorld();
  }

  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    this.tickInterval = setInterval(() => {
      this.update();
    }, TICK_LENGTH_MS);

    console.log('Game session started');
  }

  stop(): void {
    this.running = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
    console.log('Game session stopped');
  }

  addPlayer(ws: WebSocket): number {
    const playerId = this.nextPlayerId++;
    const team = (playerId - 1) % 16; // Simple team assignment

    // Spawn tank near center with some offset
    const spawnX = 128 + (playerId * 5);
    const spawnY = 128 + (playerId * 5);
    const tank = new ServerTank(playerId, team, spawnX, spawnY);

    const player: Player = {
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
        rangeAdjustment: 0, // NONE
      },
    };

    this.players.set(playerId, player);

    // Send welcome message
    this.sendWelcome(player);

    console.log(`Player ${playerId} joined (total: ${this.players.size})`);
    return playerId;
  }

  removePlayer(playerId: number): void {
    this.players.delete(playerId);
    console.log(`Player ${playerId} left (remaining: ${this.players.size})`);

    // Stop session if no players
    if (this.players.size === 0) {
      this.stop();
    }
  }

  handlePlayerInput(playerId: number, input: PlayerInput): void {
    const player = this.players.get(playerId);
    if (player) {
      player.lastInput = input;
    }
  }

  private update(): void {
    this.tick++;

    // Update all tanks
    for (const player of this.players.values()) {
      const tilePos = player.tank.getTilePosition();
      const terrainSpeed = this.world.getTankSpeedAt(tilePos.x, tilePos.y);
      player.tank.update(player.lastInput, terrainSpeed);
    }

    // Broadcast state to all players
    this.broadcastState();
  }

  private sendWelcome(player: Player): void {
    const mapData = this.world.getMapData();

    // Pack terrain data as flat array
    const terrain: number[] = [];
    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const cell = mapData[y]![x]!;
        terrain.push(cell.terrain);
      }
    }

    const welcome: WelcomeMessage = {
      type: 'welcome',
      playerId: player.id,
      assignedTeam: player.tank.team,
      currentTick: this.tick,
      map: {
        width: 256,
        height: 256,
        terrain,
      },
    };

    const message = encodeServerMessage(welcome);
    player.ws.send(message);
  }

  private broadcastState(): void {
    const tanks = [];

    for (const player of this.players.values()) {
      const tank = player.tank;
      tanks.push({
        id: tank.id,
        x: Math.round(tank.x),
        y: Math.round(tank.y),
        direction: tank.direction,
        speed: tank.speed,
        armor: tank.armor,
        shells: tank.shells,
        mines: tank.mines,
        trees: tank.trees,
        team: tank.team,
        onBoat: tank.onBoat,
        reload: tank.reload,
        firingRange: tank.firingRange,
      });
    }

    const update: UpdateMessage = {
      type: 'update',
      tick: this.tick,
      tanks,
    };

    const message = encodeServerMessage(update);

    // Send to all players
    for (const player of this.players.values()) {
      if (player.ws.readyState === 1) { // OPEN
        player.ws.send(message);
      }
    }
  }

  getPlayerCount(): number {
    return this.players.size;
  }
}
