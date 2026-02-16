/**
 * Game session - manages a single game instance
 */

import {
  TICK_LENGTH_MS,
  TANK_RESPAWN_TICKS,
  NEUTRAL_TEAM,
  TILE_SIZE_WORLD,
  type AllianceSnapshot,
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
const MAX_CHAT_MESSAGE_LENGTH = 160;
const NEARBY_CHAT_RADIUS_TILES = 12;
const QUICK_MINE_VISIBILITY_RADIUS_TILES = 24;

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
  private readonly remoteViewPillboxByPlayer = new Map<number, number>();
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
    this.hudMessages.seedPlayerFromRecentGlobal(playerId, this.tick);
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
    this.remoteViewPillboxByPlayer.delete(playerId);
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

  /**
   * Update server-authoritative remote pillbox view target for a player.
   *
   * `null` resets to normal tank-centered view.
   */
  public handleRemoteView(playerId: number, pillboxId: number | null): void {
    const player = this.players.get(playerId);
    if (!player) {
      return;
    }

    if (pillboxId === null) {
      this.remoteViewPillboxByPlayer.delete(playerId);
      return;
    }

    const pillbox = this.pillboxes.get(pillboxId);
    if (!pillbox || !this.canUseRemoteViewPillbox(player, pillbox)) {
      this.remoteViewPillboxByPlayer.delete(playerId);
      this.hudMessages.publishPersonal({
        tick: this.tick,
        playerId,
        text: 'Pillbox view unavailable: invalid remote pillbox target.',
        class: 'personal_notification',
      });
      return;
    }

    this.remoteViewPillboxByPlayer.set(playerId, pillboxId);
  }

  public handlePlayerChat(
    playerId: number,
    text: string,
    options?: {allianceOnly?: boolean; recipientPlayerIds?: number[]}
  ): void {
    const player = this.players.get(playerId);
    if (!player) {
      return;
    }

    const sanitized = text.trim().slice(0, MAX_CHAT_MESSAGE_LENGTH);
    if (!sanitized) {
      return;
    }

    const whisperMatch = sanitized.match(/^\/w\s+(\d+)\s+(.+)$/i);
    if (whisperMatch) {
      const recipientId = Number(whisperMatch[1]);
      const whisperText = (whisperMatch[2] ?? '').trim().slice(0, MAX_CHAT_MESSAGE_LENGTH);
      if (!Number.isFinite(recipientId) || !whisperText) {
        return;
      }
      this.publishWhisperChat(playerId, recipientId, whisperText);
      return;
    }

    const nearbyMatch = sanitized.match(/^\/n\s+(.+)$/i);
    if (nearbyMatch) {
      const nearbyText = (nearbyMatch[1] ?? '').trim().slice(0, MAX_CHAT_MESSAGE_LENGTH);
      if (!nearbyText) {
        return;
      }
      this.publishNearbyChat(playerId, nearbyText);
      return;
    }

    if ((options?.recipientPlayerIds?.length ?? 0) > 0) {
      this.publishDirectedChat(playerId, sanitized, options?.recipientPlayerIds ?? []);
      return;
    }

    const messageText = `Player ${playerId}: ${sanitized}`;
    if (options?.allianceOnly || /^\/a\s+/i.test(sanitized)) {
      const allianceText = /^\/a\s+/i.test(sanitized)
        ? sanitized.replace(/^\/a\s+/i, '').trim().slice(0, MAX_CHAT_MESSAGE_LENGTH)
        : sanitized;
      if (!allianceText) {
        return;
      }
      this.hudMessages.publishAlliance({
        tick: this.tick,
        sourceTeam: player.tank.team,
        text: `Player ${playerId}: ${allianceText}`,
        players: this.players.values(),
        areTeamsAllied: (teamA, teamB) => this.areTeamsAllied(teamA, teamB),
        class: 'chat_alliance',
      });
      return;
    }

    this.hudMessages.publishGlobal({
      tick: this.tick,
      text: messageText,
      players: this.players.values(),
      class: 'chat_global',
    });
  }

  private publishNearbyChat(senderPlayerId: number, text: string): void {
    const sender = this.players.get(senderPlayerId);
    if (!sender) {
      return;
    }

    const radiusWorldUnits = NEARBY_CHAT_RADIUS_TILES * TILE_SIZE_WORLD;
    const radiusSquared = radiusWorldUnits * radiusWorldUnits;
    const senderX = sender.tank.x;
    const senderY = sender.tank.y;
    const messageText = `Player ${senderPlayerId} (nearby): ${text}`;

    for (const recipient of this.players.values()) {
      const dx = recipient.tank.x - senderX;
      const dy = recipient.tank.y - senderY;
      const distanceSquared = (dx * dx) + (dy * dy);
      if (distanceSquared > radiusSquared) {
        continue;
      }
      this.hudMessages.publishPersonal({
        tick: this.tick,
        playerId: recipient.id,
        text: messageText,
        class: 'chat_global',
      });
    }
  }

  private publishWhisperChat(
    senderPlayerId: number,
    recipientPlayerId: number,
    text: string
  ): void {
    const sender = this.players.get(senderPlayerId);
    const recipient = this.players.get(recipientPlayerId);
    if (!sender || !recipient) {
      return;
    }

    this.hudMessages.publishPersonal({
      tick: this.tick,
      playerId: senderPlayerId,
      text: `to Player ${recipientPlayerId} (whisper): ${text}`,
      class: 'chat_alliance',
    });
    if (recipientPlayerId !== senderPlayerId) {
      this.hudMessages.publishPersonal({
        tick: this.tick,
        playerId: recipientPlayerId,
        text: `Player ${senderPlayerId} (whisper): ${text}`,
        class: 'chat_alliance',
      });
    }
  }

  /**
   * Send a chat message to a client-selected subset of players.
   *
   * Server-side recipient filtering is authoritative. Invalid/unknown IDs are dropped.
   */
  private publishDirectedChat(
    senderPlayerId: number,
    text: string,
    recipientPlayerIds: number[]
  ): void {
    const sender = this.players.get(senderPlayerId);
    if (!sender) {
      return;
    }

    const uniqueRecipientIds = Array.from(new Set(recipientPlayerIds))
      .filter(id => Number.isFinite(id))
      .filter(id => id !== senderPlayerId)
      .filter(id => this.players.has(id));

    if (uniqueRecipientIds.length === 0) {
      return;
    }

    const recipientList = uniqueRecipientIds.join(', ');
    this.hudMessages.publishPersonal({
      tick: this.tick,
      playerId: senderPlayerId,
      text: `to Players ${recipientList}: ${text}`,
      class: 'chat_alliance',
    });

    for (const recipientId of uniqueRecipientIds) {
      this.hudMessages.publishPersonal({
        tick: this.tick,
        playerId: recipientId,
        text: `Player ${senderPlayerId}: ${text}`,
        class: 'chat_alliance',
      });
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
          this.publishMatchEndHudMessage();
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
        onBuilderActionRejected: event => {
          this.hudMessages.publishPersonal({
            tick: this.tick,
            playerId: event.tankId,
            text: event.text,
            class: 'personal_notification',
          });
        },
        onBuilderKilled: event => {
          this.hudMessages.publishPersonal({
            tick: this.tick,
            playerId: event.tankId,
            text: 'You just lost builder',
            class: 'personal_notification',
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
      getAllianceSnapshots: () => this.buildAllianceSnapshots(),
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
      getAllianceSnapshots: () => this.buildAllianceSnapshots(),
      getPlayerViewCenterTile: playerId => this.getPlayerViewCenterTile(playerId),
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
    const accepted = this.matchState.requestAlliance(fromTeam, toTeam);
    if (!accepted) {
      return false;
    }

    // Before acceptance, notify source and target teams separately.
    this.publishAllianceHudMessage({
      sourceTeam: fromTeam,
      text: `Alliance ${fromTeam} requested alliance with Alliance ${toTeam}`,
    });
    this.publishAllianceHudMessage({
      sourceTeam: toTeam,
      text: `Alliance ${toTeam} received alliance request from Alliance ${fromTeam}`,
    });
    return true;
  }

  public acceptAlliance(toTeam: number, fromTeam: number): boolean {
    const accepted = this.matchState.acceptAlliance(toTeam, fromTeam);
    if (!accepted) {
      return false;
    }

    // Emit after acceptance so both newly allied teams receive it in one publish.
    this.publishAllianceHudMessage({
      sourceTeam: toTeam,
      text: `Alliance ${toTeam} accepted alliance with Alliance ${fromTeam}`,
    });
    return true;
  }

  public cancelAllianceRequest(fromTeam: number, toTeam: number): boolean {
    const canceled = this.matchState.cancelAllianceRequest(fromTeam, toTeam);
    if (!canceled) {
      return false;
    }

    this.publishAllianceHudMessage({
      sourceTeam: fromTeam,
      text: `Alliance ${fromTeam} canceled alliance request to Alliance ${toTeam}`,
    });
    this.publishAllianceHudMessage({
      sourceTeam: toTeam,
      text: `Alliance ${toTeam} alliance request from Alliance ${fromTeam} was canceled`,
    });
    return true;
  }

  public createAlliance(teamA: number, teamB: number): void {
    this.matchState.createAlliance(teamA, teamB);
  }

  public breakAlliance(teamA: number, teamB: number): void {
    // Emit before break so both currently allied teams still receive the notice.
    this.publishAllianceHudMessage({
      sourceTeam: teamA,
      text: `Alliance ${teamA} broke alliance with Alliance ${teamB}`,
    });
    this.matchState.breakAlliance(teamA, teamB);
  }

  public leaveAlliance(team: number): void {
    // Emit before leave so allied recipients still receive the departure notice.
    this.publishAllianceHudMessage({
      sourceTeam: team,
      text: `Alliance ${team} left all alliances`,
    });
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
        : `Player ${args.byTankId} just stole ${args.structure.toLowerCase()} from Alliance ${args.previousOwnerTeam}`;

    this.hudMessages.publishGlobal({
      tick: this.tick,
      text,
      players: this.players.values(),
      class: 'global_notification',
      // Ownership swings are high-signal events and should survive queue pressure.
      priority: 'high',
    });
  }

  private publishAllianceHudMessage(args: {sourceTeam: number; text: string}): void {
    this.hudMessages.publishAlliance({
      tick: this.tick,
      sourceTeam: args.sourceTeam,
      text: args.text,
      players: this.players.values(),
      areTeamsAllied: (teamA, teamB) => this.areTeamsAllied(teamA, teamB),
      class: 'alliance_notification',
    });
  }

  /**
   * Emit a one-time global match result ticker when win condition is reached.
   */
  private publishMatchEndHudMessage(): void {
    const winners = this.matchState.getWinningTeams();
    if (winners.length === 0) {
      return;
    }

    const text = winners.length === 1
      ? `Alliance ${winners[0]} won the match`
      : `Alliances ${winners.join(', ')} won the match`;

    this.hudMessages.publishGlobal({
      tick: this.tick,
      text,
      players: this.players.values(),
      class: 'global_notification',
      priority: 'high',
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

  /**
   * Drop a "quick mine" at the tank's current tile.
   *
   * Manual behavior: nearby tanks can see quick mines. We model this as a
   * snapshot of nearby team visibility at placement time.
   */
  public dropQuickMine(playerId: number): boolean {
    const player = this.players.get(playerId);
    if (!player || player.tank.isDead()) {
      return false;
    }

    const tank = player.tank;
    if (tank.mines <= 0) {
      return false;
    }

    const tile = tank.getTilePosition();
    const radiusWorldUnits = QUICK_MINE_VISIBILITY_RADIUS_TILES * TILE_SIZE_WORLD;
    const radiusSquared = radiusWorldUnits * radiusWorldUnits;
    const visibleTeams = new Set<number>([tank.team]);

    for (const other of this.players.values()) {
      const dx = other.tank.x - tank.x;
      const dy = other.tank.y - tank.y;
      const distanceSquared = (dx * dx) + (dy * dy);
      if (distanceSquared <= radiusSquared) {
        visibleTeams.add(other.tank.team);
      }
    }

    const placed = this.matchState.placeMineForTeam(
      tank.team,
      tile.x,
      tile.y,
      this.world,
      visibleTeams
    );
    if (!placed) {
      return false;
    }

    tank.mines = Math.max(0, tank.mines - 1);
    return true;
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

  /**
   * Build a compact alliance graph snapshot for client-side relation rendering.
   */
  private buildAllianceSnapshots(): AllianceSnapshot[] {
    const allianceIds = new Set<number>();
    for (const player of this.players.values()) {
      allianceIds.add(player.tank.team);
    }
    for (const pillbox of this.pillboxes.values()) {
      if (pillbox.ownerTeam !== NEUTRAL_TEAM) {
        allianceIds.add(pillbox.ownerTeam);
      }
    }
    for (const base of this.bases.values()) {
      if (base.ownerTeam !== NEUTRAL_TEAM) {
        allianceIds.add(base.ownerTeam);
      }
    }

    const orderedIds = Array.from(allianceIds).sort((a, b) => a - b);
    return orderedIds.map(allianceId => ({
      allianceId,
      alliedAllianceIds: orderedIds.filter(
        otherAllianceId =>
          otherAllianceId !== allianceId &&
          this.areTeamsAllied(allianceId, otherAllianceId)
      ),
    }));
  }

  private getPlayerViewCenterTile(playerId: number): {tileX: number; tileY: number} | null {
    const player = this.players.get(playerId);
    if (!player) {
      return null;
    }

    const requestedRemoteViewId = this.remoteViewPillboxByPlayer.get(playerId);
    if (requestedRemoteViewId === undefined) {
      return player.tank.getTilePosition();
    }

    const pillbox = this.pillboxes.get(requestedRemoteViewId);
    if (!pillbox || !this.canUseRemoteViewPillbox(player, pillbox)) {
      this.remoteViewPillboxByPlayer.delete(playerId);
      return player.tank.getTilePosition();
    }

    return {
      tileX: pillbox.tileX,
      tileY: pillbox.tileY,
    };
  }

  /**
   * Remote camera targets are limited to own/allied active pillboxes.
   */
  private canUseRemoteViewPillbox(
    player: Pick<SessionPlayer, 'tank'>,
    pillbox: Pick<ServerPillbox, 'inTank' | 'ownerTeam'>
  ): boolean {
    if (pillbox.inTank || pillbox.ownerTeam === NEUTRAL_TEAM) {
      return false;
    }
    return (
      pillbox.ownerTeam === player.tank.team ||
      this.areTeamsAllied(player.tank.team, pillbox.ownerTeam)
    );
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
