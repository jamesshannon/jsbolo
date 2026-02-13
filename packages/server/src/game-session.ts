/**
 * Game session - manages a single game instance
 */

import {
  TICK_LENGTH_MS,
  TANK_RESPAWN_TICKS,
  NEUTRAL_TEAM,
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
import {SessionWorldBootstrap} from './systems/session-world-bootstrap.js';
import {BotInputSystem} from './systems/bot-input-system.js';
import {InProcessBotRuntimeAdapter} from './systems/in-process-bot-runtime-adapter.js';
import {HudMessageService} from './systems/hud-message-service.js';
import type {WebSocket} from 'ws';

export interface BotPolicyOptions {
  allowBots: boolean;
  maxBots: number;
  botAllianceMode: 'none' | 'all-bots';
}

export interface GameSessionOptions {
  botPolicy?: Partial<BotPolicyOptions>;
}

export interface SessionBotSummary {
  playerId: number;
  profile: string;
  team: number;
}

const DEFAULT_BOT_POLICY: BotPolicyOptions = {
  allowBots: true,
  maxBots: 4,
  botAllianceMode: 'all-bots',
};

export class GameSession {
  private readonly world: ServerWorld;
  private readonly playerManager: SessionPlayerManager;
  private readonly players: Map<number, SessionPlayer>;
  private readonly shells = new Map<number, ServerShell>();
  private pillboxes: Map<number, ServerPillbox>;
  private bases: Map<number, ServerBase>;
  private readonly terrainChanges = new Set<string>(); // Track terrain changes as "x,y"
  private readonly soundEvents: SoundEvent[] = [];
  private readonly respawnSystem = new RespawnSystem();
  private readonly updatePipeline = new SessionUpdatePipeline();
  private readonly broadcaster = new SessionStateBroadcaster();
  private readonly welcomeBuilder = new SessionWelcomeBuilder();
  private readonly worldBootstrap = new SessionWorldBootstrap();
  private readonly botInputSystem = new BotInputSystem(new InProcessBotRuntimeAdapter());
  private readonly hudMessages = new HudMessageService();
  private readonly matchState = this.updatePipeline.getMatchState();
  private readonly botPolicy: BotPolicyOptions;
  private readonly botPlayerIds = new Set<number>();
  private botAllianceTeam: number | null = null;
  private tick = 0;
  private running = false;
  private tickInterval: NodeJS.Timeout | undefined;
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
   * @param options Session options (including bot policy)
   */
  constructor(mapPath?: string, options?: GameSessionOptions) {
    this.world = new ServerWorld(mapPath);
    this.botPolicy = {
      ...DEFAULT_BOT_POLICY,
      ...(options?.botPolicy ?? {}),
    };
    this.playerManager = new SessionPlayerManager(
      this.world,
      player => this.sendWelcome(player)
    );
    this.players = this.playerManager.getPlayers();
    const bootstrap = this.worldBootstrap.initialize(this.world);
    this.pillboxes = bootstrap.pillboxes;
    this.bases = bootstrap.bases;

    console.log(`Map ready: ${this.world.getMapName()}`);
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

  /**
   * Pause ticking without tearing down bot runtime/session state.
   * Used when no humans are connected but bots remain in the session.
   */
  pause(): void {
    if (!this.running) {
      return;
    }

    this.running = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = undefined;
    }
    console.log('Game session paused');
  }

  stop(): void {
    this.running = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = undefined;
    }
    this.botInputSystem.shutdown();
    console.log('Game session stopped');
  }

  addPlayer(ws: WebSocket, _legacyUnusedTeamOverride?: number): number {
    // NOTE: optional second arg is accepted for legacy test compatibility.
    const playerId = this.playerManager.addPlayer(ws);
    this.hudMessages.publishGlobal({
      tick: this.tick,
      text: `Player ${playerId} joined game`,
      players: this.players.values(),
      class: 'global_notification',
    });
    return playerId;
  }

  removePlayer(playerId: number): void {
    const player = this.players.get(playerId);
    if (player?.controlType === 'bot') {
      this.botInputSystem.disableBotForPlayer(player);
      this.botPlayerIds.delete(playerId);
      if (this.botPlayerIds.size === 0) {
        this.botAllianceTeam = null;
      }
    }

    const result = this.playerManager.removePlayer(playerId);
    if (result.removed) {
      this.hudMessages.publishGlobal({
        tick: this.tick,
        text: `Player ${playerId} has quit game`,
        players: this.players.values(),
        class: 'global_notification',
      });
    }
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
    this.botInputSystem.injectBotInputs({
      tick: this.tick,
      players: this.players,
      shells: this.shells,
      pillboxes: this.pillboxes,
      bases: this.bases,
      areTeamsAllied: (teamA, teamB) => this.areTeamsAllied(teamA, teamB),
    });

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
        onBaseCaptured: event => {
          this.publishStructureCaptureHudMessage({
            structure: 'Base',
            previousOwnerTeam: event.previousOwnerTeam,
            newOwnerTeam: event.newOwnerTeam,
            byTankId: event.capturingTankId,
          });
        },
        onPillboxPickedUp: event => {
          this.publishStructureCaptureHudMessage({
            structure: 'Pillbox',
            previousOwnerTeam: event.previousOwnerTeam,
            newOwnerTeam: event.newOwnerTeam,
            byTankId: event.byTankId,
          });
        },
      }
    );

    // Broadcast state to all players (throttled to reduce CPU usage)
    if (this.tick % this.broadcastInterval === 0) {
      this.broadcastState();
    }
  }

  /**
   * Enable server-authoritative bot control for an existing player tank.
   */
  public enableBotControl(playerId: number, profile: string): boolean {
    const player = this.players.get(playerId);
    if (!player) {
      return false;
    }

    this.botInputSystem.enableBotForPlayer(player, profile);
    return true;
  }

  /**
   * Disable bot control and return player to human input mode.
   */
  public disableBotControl(playerId: number): boolean {
    const player = this.players.get(playerId);
    if (!player) {
      return false;
    }

    this.botInputSystem.disableBotForPlayer(player);
    this.botPlayerIds.delete(playerId);
    return true;
  }

  /**
   * Create a bot-controlled player in this session.
   *
   * The bot uses a no-op in-memory socket sink because authoritative simulation
   * does not require a network transport for server-side controllers.
   */
  public addBot(profile: string): number | null {
    if (!this.botPolicy.allowBots) {
      return null;
    }

    if (this.botPlayerIds.size >= this.botPolicy.maxBots) {
      return null;
    }

    const allianceTeam =
      this.botPolicy.botAllianceMode === 'all-bots'
        ? this.getOrCreateBotAllianceTeam()
        : null;
    if (this.botPolicy.botAllianceMode === 'all-bots' && allianceTeam === null) {
      return null;
    }

    const botPlayerId = this.addPlayer(this.createBotSocket());
    if (this.botPolicy.botAllianceMode === 'all-bots' && allianceTeam !== null) {
      const botPlayer = this.players.get(botPlayerId);
      if (botPlayer) {
        botPlayer.tank.team = allianceTeam;
      }
    }

    const enabled = this.enableBotControl(botPlayerId, profile);
    if (!enabled) {
      this.removePlayer(botPlayerId);
      return null;
    }

    this.botPlayerIds.add(botPlayerId);
    return botPlayerId;
  }

  /**
   * Return the number of currently connected bot-controlled players.
   */
  public getBotCount(): number {
    return this.botPlayerIds.size;
  }

  /**
   * Remove a bot-controlled player by id.
   */
  public removeBot(botPlayerId: number): boolean {
    const player = this.players.get(botPlayerId);
    if (!player || player.controlType !== 'bot') {
      return false;
    }

    this.removePlayer(botPlayerId);
    if (this.botPlayerIds.size === 0) {
      this.botAllianceTeam = null;
    }
    return true;
  }

  /**
   * List connected bot-controlled players.
   */
  public listBots(): SessionBotSummary[] {
    const bots: SessionBotSummary[] = [];

    for (const botPlayerId of this.botPlayerIds) {
      const player = this.players.get(botPlayerId);
      if (!player || player.controlType !== 'bot' || !player.botProfile) {
        continue;
      }
      bots.push({
        playerId: botPlayerId,
        profile: player.botProfile,
        team: player.tank.team,
      });
    }

    return bots.sort((a, b) => a.playerId - b.playerId);
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
      getHudMessagesForPlayer: playerId => this.hudMessages.drainForPlayer(playerId),
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

  /**
   * Emit classic-style global structure ownership ticker messages.
   */
  private publishStructureCaptureHudMessage(args: {
    structure: 'Base' | 'Pillbox';
    previousOwnerTeam: number;
    newOwnerTeam: number;
    byTankId: number;
  }): void {
    if (args.previousOwnerTeam === args.newOwnerTeam) {
      return;
    }

    const text =
      args.previousOwnerTeam === NEUTRAL_TEAM
        ? `Player ${args.byTankId} captured a Neutral ${args.structure}`
        : `Player ${args.byTankId} just stole ${args.structure.toLowerCase()} from Team ${args.previousOwnerTeam}`;

    this.hudMessages.publishGlobal({
      tick: this.tick,
      text,
      players: this.players.values(),
      class: 'global_notification',
    });
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

  /**
   * Pick one stable team id for all bots in this session when `all-bots` mode is enabled.
   *
   * ASSUMPTION: prefer a currently-unused human team to avoid silently allying bots
   * with an existing human. If all 16 teams are occupied by humans, reject bot spawn.
   */
  private getOrCreateBotAllianceTeam(): number | null {
    if (this.botAllianceTeam !== null) {
      return this.botAllianceTeam;
    }

    const humanTeams = new Set<number>();
    for (const player of this.players.values()) {
      if (player.controlType !== 'bot') {
        humanTeams.add(player.tank.team);
      }
    }

    for (let team = 15; team >= 0; team--) {
      if (!humanTeams.has(team)) {
        this.botAllianceTeam = team;
        return team;
      }
    }

    return null;
  }

  private createBotSocket(): WebSocket {
    return {
      send: () => {},
      readyState: 1,
      on: () => {},
      close: () => {},
    } as unknown as WebSocket;
  }
}
