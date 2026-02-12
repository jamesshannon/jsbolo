/**
 * Game session - manages a single game instance
 */

import {
  TICK_LENGTH_MS,
  TANK_RESPAWN_TICKS,
  type PlayerInput,
  encodeServerMessage,
  type WelcomeMessage,
  type SoundEvent,
} from '@jsbolo/shared';
import {ServerTank} from './simulation/tank.js';
import {ServerWorld} from './simulation/world.js';
import {ServerShell} from './simulation/shell.js';
import {ServerPillbox} from './simulation/pillbox.js';
import {ServerBase} from './simulation/base.js';
import {RespawnSystem} from './systems/respawn-system.js';
import {
  SessionPlayerManager,
  type SessionPlayer,
} from './systems/session-player-manager.js';
import {SessionUpdatePipeline} from './systems/session-update-pipeline.js';
import {SessionStateBroadcaster} from './systems/session-state-broadcaster.js';
import {SessionWelcomeBuilder} from './systems/session-welcome-builder.js';
import type {WebSocket} from 'ws';

export class GameSession {
  private readonly world: ServerWorld;
  private readonly playerManager: SessionPlayerManager;
  private readonly players: Map<number, SessionPlayer>;
  private readonly shells = new Map<number, ServerShell>();
  private readonly pillboxes = new Map<number, ServerPillbox>();
  private readonly bases = new Map<number, ServerBase>();
  private readonly terrainChanges = new Set<string>(); // Track terrain changes as "x,y"
  private readonly soundEvents: SoundEvent[] = [];
  private readonly respawnSystem = new RespawnSystem();
  private readonly updatePipeline = new SessionUpdatePipeline();
  private readonly broadcaster = new SessionStateBroadcaster();
  private readonly welcomeBuilder = new SessionWelcomeBuilder();
  private readonly matchState = this.updatePipeline.getMatchState();
  private tick = 0;
  private running = false;
  private tickInterval?: NodeJS.Timeout;
  private matchEndAnnounced = false;

  // Network optimization: throttle broadcasts and track state changes
  private readonly broadcastInterval = 2; // Broadcast every 2 ticks (25 Hz instead of 50 Hz)
  /**
   * Create a new game session, optionally loading a map file.
   *
   * WHY OPTIONAL MAP PATH:
   * - Backwards compatibility with existing code
   * - Allows testing without map files
   * - Graceful fallback if map loading fails
   *
   * MAP LOADING FLOW:
   * 1. ServerWorld loads map and terrain data
   * 2. We extract pillbox/base spawn data from world
   * 3. Spawn entities from map data OR use hardcoded fallback
   *
   * @param mapPath Optional path to .map file
   */
  constructor(mapPath?: string) {
    this.world = new ServerWorld(mapPath);
    this.playerManager = new SessionPlayerManager(
      this.world,
      player => this.sendWelcome(player)
    );
    this.players = this.playerManager.getPlayers();

    // Use map spawn data if available, otherwise fall back to hardcoded spawns
    const pillboxSpawns = this.world.getPillboxSpawns();
    if (pillboxSpawns.length > 0) {
      this.spawnPillboxesFromMap(pillboxSpawns);
      console.log(`  Spawned ${pillboxSpawns.length} pillboxes from map`);
    } else {
      this.spawnInitialPillboxes();  // Hardcoded fallback
    }

    const baseSpawns = this.world.getBaseSpawns();
    if (baseSpawns.length > 0) {
      this.spawnBasesFromMap(baseSpawns);
      console.log(`  Spawned ${baseSpawns.length} bases from map`);
    } else {
      this.spawnInitialBases();  // Hardcoded fallback
    }

    console.log(`Map ready: ${this.world.getMapName()}`);
  }

  private spawnInitialPillboxes(): void {
    // Spawn some neutral pillboxes around the map
    const pillboxLocations = [
      {x: 100, y: 100},
      {x: 150, y: 100},
      {x: 100, y: 150},
      {x: 150, y: 150},
      {x: 125, y: 75},
      {x: 175, y: 125},
    ];

    for (const loc of pillboxLocations) {
      const pillbox = new ServerPillbox(loc.x, loc.y, 255); // Neutral
      this.pillboxes.set(pillbox.id, pillbox);
    }
  }

  private spawnInitialBases(): void {
    // Spawn some neutral bases around the map
    const baseLocations = [
      {x: 80, y: 80},
      {x: 170, y: 80},
      {x: 80, y: 170},
      {x: 170, y: 170},
    ];

    for (const loc of baseLocations) {
      const base = new ServerBase(loc.x, loc.y, 255); // Neutral
      this.bases.set(base.id, base);
    }
  }

  /**
   * Spawn pillboxes from loaded map data.
   *
   * WHY RESTORE MAP STATE:
   * - Map files include pillbox health, team ownership, reload speed
   * - Preserves map designer's intended difficulty/balance
   * - Some maps have damaged or team-owned pillboxes for strategic gameplay
   *
   * @param spawns Pillbox spawn data from map file
   */
  private spawnPillboxesFromMap(spawns: import('./simulation/map-loader.js').PillboxSpawnData[]): void {
    for (const spawn of spawns) {
      const pillbox = new ServerPillbox(spawn.tileX, spawn.tileY, spawn.ownerTeam);
      pillbox.armor = spawn.armor;
      // Note: ServerPillbox already implements variable reload speed system
      // The 'speed' value from map is stored but our implementation
      // uses dynamic speed adjustment (aggravation mechanics)
      this.pillboxes.set(pillbox.id, pillbox);
    }
  }

  /**
   * Spawn bases from loaded map data.
   *
   * WHY RESTORE RESOURCES:
   * - Map files include base stockpiles (shells, mines)
   * - Different maps have different resource availability
   * - Affects gameplay balance (resource-rich vs resource-scarce maps)
   *
   * @param spawns Base spawn data from map file
   */
  private spawnBasesFromMap(spawns: import('./simulation/map-loader.js').BaseSpawnData[]): void {
    for (const spawn of spawns) {
      const base = new ServerBase(spawn.tileX, spawn.tileY, spawn.ownerTeam);
      base.armor = spawn.armor;
      base.shells = spawn.shells;
      base.mines = spawn.mines;
      this.bases.set(base.id, base);
    }
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

  addPlayer(ws: WebSocket, _legacyUnusedTeamOverride?: number): number {
    // NOTE: optional second arg is accepted for legacy test compatibility.
    return this.playerManager.addPlayer(ws);
  }

  removePlayer(playerId: number): void {
    const result = this.playerManager.removePlayer(playerId);
    if (result.isEmpty) {
      this.stop();
    }
  }

  handlePlayerInput(playerId: number, input: PlayerInput): void {
    const player = this.players.get(playerId);
    if (player) {
      // Build orders are one-shot commands from the client (e.g. click-to-place).
      // Queue them so a subsequent movement packet in the same server tick
      // does not clobber the command before simulation consumes it.
      if (input.buildOrder) {
        player.pendingBuildOrder = input.buildOrder;
      }

      // Keep latest movement/fire/range state, but do not persist buildOrder here.
      const {buildOrder: _ignoredBuildOrder, ...movementInput} = input;
      player.lastInput = movementInput;
    }
  }

  private update(): void {
    this.tick++;
    this.soundEvents.length = 0; // Clear sound events from previous tick

    this.updatePipeline.runTick(
      {
        tick: this.tick,
        world: this.world,
        players: this.players,
        shells: this.shells,
        pillboxes: this.pillboxes,
        bases: this.bases,
        terrainChanges: this.terrainChanges,
      },
      {
        tryRespawnTank: (player) => this.tryRespawnTank(player),
        emitSound: (soundId, x, y) => this.emitSound(soundId, x, y),
        scheduleTankRespawn: (tankId) => this.scheduleTankRespawn(tankId),
        placeMineForTeam: (team, tileX, tileY) =>
          this.placeMineForTeam(team, tileX, tileY),
        clearMineVisibilityAt: (tileX, tileY) =>
          this.matchState.clearMineVisibilityAt(tileX, tileY),
        areTeamsAllied: (teamA, teamB) => this.areTeamsAllied(teamA, teamB),
        spawnShell: (tank) => this.spawnShell(tank),
        spawnShellFromPillbox: (pillboxId, x, y, direction) =>
          this.spawnShellFromPillbox(pillboxId, x, y, direction),
        onMatchEnded: () => {
          this.matchEndAnnounced = false;
        },
      }
    );

    // Broadcast state to all players (throttled to reduce CPU usage)
    if (this.tick % this.broadcastInterval === 0) {
      this.broadcastState();
    }
  }

  private spawnShell(tank: ServerTank): void {
    const shell = new ServerShell(
      tank.id,
      tank.x,
      tank.y,
      tank.direction,
      tank.firingRange
    );
    this.shells.set(shell.id, shell);
  }

  private spawnShellFromPillbox(
    pillboxId: number,
    x: number,
    y: number,
    direction: number
  ): void {
    const shell = new ServerShell(
      -pillboxId, // Negative ID for pillbox shells
      x,
      y,
      direction,
      7 // Default range
    );
    this.shells.set(shell.id, shell);
  }

  private sendWelcome(player: SessionPlayer): void {
    const welcome: WelcomeMessage = this.welcomeBuilder.buildWelcome({
      playerId: player.id,
      assignedTeam: player.tank.team,
      currentTick: this.tick,
      world: this.world,
      players: this.players.values(),
      pillboxes: this.pillboxes.values(),
      bases: this.bases.values(),
      matchEnded: this.matchState.isMatchEnded(),
      winningTeams: this.matchState.getWinningTeams(),
    });

    const message = encodeServerMessage(welcome);
    player.ws.send(message);
  }

  private broadcastState(): void {
    const result = this.broadcaster.broadcastState({
      tick: this.tick,
      players: this.players.values(),
      shells: this.shells.values(),
      pillboxes: this.pillboxes.values(),
      bases: this.bases.values(),
      world: this.world,
      terrainChanges: this.terrainChanges,
      soundEvents: this.soundEvents,
      matchEnded: this.matchState.isMatchEnded(),
      winningTeams: this.matchState.getWinningTeams(),
      matchEndAnnounced: this.matchEndAnnounced,
    });
    this.matchEndAnnounced = result.matchEndAnnounced;
  }

  private emitSound(soundId: number, x: number, y: number): void {
    this.soundEvents.push({soundId, x, y});
  }

  private scheduleTankRespawn(tankId: number): void {
    this.respawnSystem.schedule(tankId, this.tick, TANK_RESPAWN_TICKS);
  }

  private tryRespawnTank(player: Pick<SessionPlayer, 'id' | 'tank'>): void {
    if (!this.respawnSystem.shouldRespawn(player.id, this.tick)) {
      return;
    }

    // ASSUMPTION: respawns use a simple randomized center-area spawn bucket.
    // This preserves existing behavior until spawn-point rules are fully specified.
    const spawnX = 128 + Math.floor(Math.random() * 20);
    const spawnY = 128 + Math.floor(Math.random() * 20);
    player.tank.respawn(spawnX, spawnY);
    this.respawnSystem.clear(player.id);
  }

  public requestAlliance(fromTeam: number, toTeam: number): boolean {
    return this.matchState.requestAlliance(fromTeam, toTeam);
  }

  public acceptAlliance(toTeam: number, fromTeam: number): boolean {
    return this.matchState.acceptAlliance(toTeam, fromTeam);
  }

  public createAlliance(teamA: number, teamB: number): void {
    this.matchState.createAlliance(teamA, teamB);
  }

  public breakAlliance(teamA: number, teamB: number): void {
    this.matchState.breakAlliance(teamA, teamB);
  }

  public leaveAlliance(team: number): void {
    this.matchState.leaveAlliance(team);
  }

  public areTeamsAllied(teamA: number, teamB: number): boolean {
    return this.matchState.areTeamsAllied(teamA, teamB);
  }

  public getVisibleMineTilesForPlayer(playerId: number): Array<{x: number; y: number}> {
    const player = this.players.get(playerId);
    if (!player) {
      return [];
    }

    return this.matchState.getVisibleMineTilesForTeam(player.tank.team, this.world);
  }

  public placeMineForTeam(team: number, tileX: number, tileY: number): boolean {
    return this.matchState.placeMineForTeam(team, tileX, tileY, this.world);
  }

  public isMatchEnded(): boolean {
    return this.matchState.isMatchEnded();
  }

  public getWinningTeams(): number[] {
    return this.matchState.getWinningTeams();
  }

  /**
   * Test-only hook for regrowth scenarios that directly mutate terrain state.
   */
  public trackForestRegrowth(tileKey: string): void {
    this.updatePipeline.trackForestRegrowth(tileKey);
  }

  getPlayerCount(): number {
    return this.playerManager.getPlayerCount();
  }
}
