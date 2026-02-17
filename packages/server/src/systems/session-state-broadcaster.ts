import {
  TILE_SIZE_WORLD,
  type AllianceSnapshot,
  encodeServerMessage,
  type HudMessage,
  type SoundEvent,
  type TerrainUpdate,
  type UpdateMessage,
} from '@jsbolo/shared';
import type {ServerBase} from '../simulation/base.js';
import type {ServerBuilder} from '../simulation/builder.js';
import type {ServerPillbox} from '../simulation/pillbox.js';
import type {ServerShell} from '../simulation/shell.js';
import type {ServerTank} from '../simulation/tank.js';
import type {ServerWorld} from '../simulation/world.js';
import type {WebSocket} from 'ws';

interface BroadcastPlayer {
  id: number;
  ws: WebSocket;
  tank: ServerTank;
}

interface ViewCenterTile {
  tileX: number;
  tileY: number;
}

interface ViewWindow {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface PlayerBroadcastState {
  tanks: Map<number, string>;
  shells: Set<number>;
  builders: Map<number, string>;
  pillboxes: Map<number, string>;
  bases: Map<number, string>;
  terrainWindow: ViewWindow | null;
}

export interface SessionBroadcastContext {
  tick: number;
  players: Iterable<BroadcastPlayer>;
  shells: Iterable<ServerShell>;
  pillboxes: Iterable<ServerPillbox>;
  bases: Iterable<ServerBase>;
  world: ServerWorld;
  terrainChanges: Set<string>;
  soundEvents: SoundEvent[];
  matchEnded: boolean;
  winningTeams: number[];
  matchEndAnnounced: boolean;
  getHudMessagesForPlayer?: (playerId: number) => HudMessage[];
  getAllianceSnapshots?: () => AllianceSnapshot[];
  getPlayerViewCenterTile?: (playerId: number) => ViewCenterTile | null;
}

export interface SessionBroadcastResult {
  didBroadcast: boolean;
  matchEndAnnounced: boolean;
}

/**
 * Builds and broadcasts delta-compressed session updates.
 *
 * WHY THIS EXISTS:
 * - Isolates network delta encoding concerns from simulation orchestration.
 * - Keeps per-entity hash/diff logic in one testable component.
 */
export class SessionStateBroadcaster {
  /**
   * Client canvas is currently fixed at 640x480 with 32px tiles => 20x15 tiles.
   * Visibility windows mirror that viewport from server-side simulation coordinates.
   */
  private static readonly VIEWPORT_WIDTH_TILES = 20;
  private static readonly VIEWPORT_HEIGHT_TILES = 15;
  private static readonly TERRAIN_PREFETCH_TILES = 1;
  private readonly debugTerrainUpdateLogs = process.env['DEBUG_TERRAIN_UPDATES'] === 'true';

  private readonly previousStateByPlayerId = new Map<number, PlayerBroadcastState>();
  private previousAllianceHash = '';

  constructor(
    private readonly log: (message: string) => void = console.log
  ) {}

  broadcastState(context: SessionBroadcastContext): SessionBroadcastResult {
    // Materialize players once so we can iterate for diffing and sending.
    // `Map#values()` is a one-shot iterator and would otherwise be exhausted.
    const players = Array.from(context.players);
    const playerIds = new Set(players.map(player => player.id));
    for (const cachedPlayerId of this.previousStateByPlayerId.keys()) {
      if (!playerIds.has(cachedPlayerId)) {
        this.previousStateByPlayerId.delete(cachedPlayerId);
      }
    }

    const mapData = context.world.getMapData();
    const mapHeight = mapData.length;
    const mapWidth = mapData[0]?.length ?? 0;

    const changedTerrainEntries: TerrainUpdate[] = [];
    for (const key of context.terrainChanges) {
      const [xStr, yStr] = key.split(',');
      const x = Number(xStr);
      const y = Number(yStr);
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        continue;
      }
      if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) {
        continue;
      }
      const cell = mapData[y]![x]!;

      if (this.debugTerrainUpdateLogs) {
        this.log(
          `[DEBUG] Broadcasting terrain update: (${x}, ${y}) terrain=${cell.terrain} (was potentially road)`
        );
      }

      changedTerrainEntries.push(this.toTerrainUpdate(x, y, cell));
    }

    const allianceSnapshots = context.getAllianceSnapshots?.();
    const allianceHash = JSON.stringify(allianceSnapshots ?? []);
    const hasAllianceChanges = allianceHash !== this.previousAllianceHash;
    if (hasAllianceChanges) {
      this.previousAllianceHash = allianceHash;
    }

    // Drain per-player HUD streams once so we can both:
    // 1) include HUD-only ticks in broadcast decisions, and
    // 2) avoid double-draining during payload assembly.
    const hudByPlayerId = new Map<number, UpdateMessage['hudMessages']>();
    for (const player of players) {
      const hudMessages = context.getHudMessagesForPlayer?.(player.id) ?? [];
      hudByPlayerId.set(player.id, hudMessages);
    }

    let didBroadcast = false;
    for (const player of players) {
      const state = this.getOrCreatePlayerState(player.id);
      const centerTile = context.getPlayerViewCenterTile?.(player.id) ?? {
        tileX: Math.floor(player.tank.x / TILE_SIZE_WORLD),
        tileY: Math.floor(player.tank.y / TILE_SIZE_WORLD),
      };
      const dynamicWindow = this.getViewWindow(centerTile, 0, mapWidth, mapHeight);
      const terrainWindow = this.getViewWindow(
        centerTile,
        SessionStateBroadcaster.TERRAIN_PREFETCH_TILES,
        mapWidth,
        mapHeight
      );

      const tanks: NonNullable<UpdateMessage['tanks']> = [];
      const currentTankIds = new Set<number>();
      for (const candidate of players) {
        const shouldInclude =
          candidate.id === player.id ||
          this.isWorldPositionInWindow(candidate.tank.x, candidate.tank.y, dynamicWindow);
        if (!shouldInclude) {
          continue;
        }

        currentTankIds.add(candidate.tank.id);
        const isSelf = candidate.id === player.id;
        const currentHash = this.getTankStateHash(candidate.tank, isSelf);
        if (state.tanks.get(candidate.tank.id) !== currentHash) {
          tanks.push({
            id: candidate.tank.id,
            x: Math.round(candidate.tank.x),
            y: Math.round(candidate.tank.y),
            direction: candidate.tank.direction,
            speed: candidate.tank.speed,
            armor: candidate.tank.armor,
            // Only reveal resource counts to the tank's own player
            shells: isSelf ? candidate.tank.shells : 0,
            mines: isSelf ? candidate.tank.mines : 0,
            trees: isSelf ? candidate.tank.trees : 0,
            team: candidate.tank.team,
            allianceId: candidate.tank.team,
            onBoat: candidate.tank.onBoat,
            reload: isSelf ? candidate.tank.reload : 0,
            firingRange: isSelf ? candidate.tank.firingRange : 0,
            carriedPillbox: candidate.tank.carriedPillbox?.id ?? null,
          });
          state.tanks.set(candidate.tank.id, currentHash);
        }
      }

      const removedTankIds: number[] = [];
      for (const previousTankId of state.tanks.keys()) {
        if (!currentTankIds.has(previousTankId)) {
          removedTankIds.push(previousTankId);
          state.tanks.delete(previousTankId);
        }
      }

      const builders: NonNullable<UpdateMessage['builders']> = [];
      const currentBuilderIds = new Set<number>();
      for (const candidate of players) {
        const builder = candidate.tank.builder;
        const shouldInclude =
          builder.ownerTankId === player.id ||
          this.isWorldPositionInWindow(builder.x, builder.y, dynamicWindow);
        if (!shouldInclude) {
          continue;
        }

        currentBuilderIds.add(builder.id);
        const currentHash = this.getBuilderStateHash(builder);
        if (state.builders.get(builder.id) !== currentHash) {
          builders.push({
            id: builder.id,
            ownerTankId: builder.ownerTankId,
            x: Math.round(builder.x),
            y: Math.round(builder.y),
            targetX: Math.round(builder.targetX),
            targetY: Math.round(builder.targetY),
            order: builder.order,
            trees: builder.trees,
            hasMine: builder.hasMine,
            hasPillbox: builder.hasPillbox,
            team: builder.team,
            allianceId: builder.team,
            respawnCounter: builder.respawnCounter,
          });
          state.builders.set(builder.id, currentHash);
        }
      }

      const removedBuilderIds: number[] = [];
      for (const previousBuilderId of state.builders.keys()) {
        if (!currentBuilderIds.has(previousBuilderId)) {
          removedBuilderIds.push(previousBuilderId);
          state.builders.delete(previousBuilderId);
        }
      }

      // Shells are always included whenever an update is sent to keep client shell
      // lifecycle deterministic without explicit shell removal ids.
      const shells: NonNullable<UpdateMessage['shells']> = [];
      const currentShellIds = new Set<number>();
      for (const shell of context.shells) {
        if (!this.isWorldPositionInWindow(shell.x, shell.y, dynamicWindow)) {
          continue;
        }
        shells.push({
          id: shell.id,
          x: Math.round(shell.x),
          y: Math.round(shell.y),
          direction: shell.direction,
          ownerTankId: shell.ownerTankId,
        });
        currentShellIds.add(shell.id);
      }
      const hasShellChanges =
        shells.length > 0 || !this.areIdSetsEqual(currentShellIds, state.shells);
      state.shells = currentShellIds;

      // Pillboxes and bases are global strategic structures shown in HUD status
      // panes regardless of current viewport source, so keep these streams global.
      const pillboxes: NonNullable<UpdateMessage['pillboxes']> = [];
      const currentPillboxIds = new Set<number>();
      for (const pillbox of context.pillboxes) {
        currentPillboxIds.add(pillbox.id);
        const currentHash = this.getPillboxStateHash(pillbox);
        if (state.pillboxes.get(pillbox.id) !== currentHash) {
          pillboxes.push({
            id: pillbox.id,
            tileX: pillbox.tileX,
            tileY: pillbox.tileY,
            armor: pillbox.armor,
            ownerTeam: pillbox.ownerTeam,
            inTank: pillbox.inTank,
          });
          state.pillboxes.set(pillbox.id, currentHash);
        }
      }
      const removedPillboxIds: number[] = [];
      for (const previousPillboxId of state.pillboxes.keys()) {
        if (!currentPillboxIds.has(previousPillboxId)) {
          removedPillboxIds.push(previousPillboxId);
          state.pillboxes.delete(previousPillboxId);
        }
      }

      const bases: NonNullable<UpdateMessage['bases']> = [];
      const currentBaseIds = new Set<number>();
      for (const base of context.bases) {
        currentBaseIds.add(base.id);
        const currentHash = this.getBaseStateHash(base);
        if (state.bases.get(base.id) !== currentHash) {
          bases.push({
            id: base.id,
            tileX: base.tileX,
            tileY: base.tileY,
            armor: base.armor,
            shells: base.shells,
            mines: base.mines,
            ownerTeam: base.ownerTeam,
          });
          state.bases.set(base.id, currentHash);
        }
      }
      const removedBaseIds: number[] = [];
      for (const previousBaseId of state.bases.keys()) {
        if (!currentBaseIds.has(previousBaseId)) {
          removedBaseIds.push(previousBaseId);
          state.bases.delete(previousBaseId);
        }
      }

      const terrainUpdateByKey = new Map<string, TerrainUpdate>();
      for (const changed of changedTerrainEntries) {
        if (this.isTileInWindow(changed.x, changed.y, terrainWindow)) {
          terrainUpdateByKey.set(`${changed.x},${changed.y}`, changed);
        }
      }

      for (let y = terrainWindow.minY; y <= terrainWindow.maxY; y++) {
        for (let x = terrainWindow.minX; x <= terrainWindow.maxX; x++) {
          if (state.terrainWindow && this.isTileInWindow(x, y, state.terrainWindow)) {
            continue;
          }
          const cell = mapData[y]![x]!;
          terrainUpdateByKey.set(`${x},${y}`, this.toTerrainUpdate(x, y, cell));
        }
      }
      state.terrainWindow = terrainWindow;
      const terrainUpdates = Array.from(terrainUpdateByKey.values());

      const soundEvents = context.soundEvents;
      const hudMessages = hudByPlayerId.get(player.id) ?? [];

      const hasEntityChanges =
        tanks.length > 0 ||
        builders.length > 0 ||
        pillboxes.length > 0 ||
        bases.length > 0 ||
        removedTankIds.length > 0 ||
        removedBuilderIds.length > 0 ||
        removedPillboxIds.length > 0 ||
        removedBaseIds.length > 0;
      const hasTerrainChanges = terrainUpdates.length > 0;
      const hasPlayerChanges =
        hasEntityChanges ||
        hasShellChanges ||
        hasTerrainChanges ||
        soundEvents.length > 0 ||
        hudMessages.length > 0 ||
        hasAllianceChanges ||
        (context.matchEnded && !context.matchEndAnnounced);

      if (!hasPlayerChanges || player.ws.readyState !== 1) {
        continue;
      }

      const update: UpdateMessage = {
        type: 'update',
        tick: context.tick,
        shells,
        ...(tanks.length > 0 && {tanks}),
        ...(builders.length > 0 && {builders}),
        ...(pillboxes.length > 0 && {pillboxes}),
        ...(bases.length > 0 && {bases}),
        ...(removedTankIds.length > 0 && {removedTankIds}),
        ...(removedBuilderIds.length > 0 && {removedBuilderIds}),
        ...(removedPillboxIds.length > 0 && {removedPillboxIds}),
        ...(removedBaseIds.length > 0 && {removedBaseIds}),
        ...(terrainUpdates.length > 0 && {terrainUpdates}),
        ...(soundEvents.length > 0 && {soundEvents}),
        ...(allianceSnapshots !== undefined && {alliances: allianceSnapshots}),
        ...(context.matchEnded &&
          !context.matchEndAnnounced && {
            matchEnded: context.matchEnded,
            winningTeams: context.winningTeams,
          }),
        ...(hudMessages.length > 0 && {hudMessages}),
      };
      player.ws.send(encodeServerMessage(update));
      didBroadcast = true;
    }

    context.terrainChanges.clear();

    return {
      didBroadcast,
      matchEndAnnounced: context.matchEnded ? true : context.matchEndAnnounced,
    };
  }

  private getOrCreatePlayerState(playerId: number): PlayerBroadcastState {
    const existing = this.previousStateByPlayerId.get(playerId);
    if (existing) {
      return existing;
    }

    const created: PlayerBroadcastState = {
      tanks: new Map<number, string>(),
      shells: new Set<number>(),
      builders: new Map<number, string>(),
      pillboxes: new Map<number, string>(),
      bases: new Map<number, string>(),
      terrainWindow: null,
    };
    this.previousStateByPlayerId.set(playerId, created);
    return created;
  }

  private getViewWindow(
    centerTile: ViewCenterTile,
    prefetchTiles: number,
    mapWidth: number,
    mapHeight: number
  ): ViewWindow {
    const halfWidth = Math.ceil(SessionStateBroadcaster.VIEWPORT_WIDTH_TILES / 2) + prefetchTiles;
    const halfHeight = Math.ceil(SessionStateBroadcaster.VIEWPORT_HEIGHT_TILES / 2) + prefetchTiles;
    return {
      minX: Math.max(0, centerTile.tileX - halfWidth),
      maxX: Math.min(mapWidth - 1, centerTile.tileX + halfWidth),
      minY: Math.max(0, centerTile.tileY - halfHeight),
      maxY: Math.min(mapHeight - 1, centerTile.tileY + halfHeight),
    };
  }

  private isWorldPositionInWindow(
    worldX: number,
    worldY: number,
    window: ViewWindow
  ): boolean {
    const tileX = Math.floor(worldX / TILE_SIZE_WORLD);
    const tileY = Math.floor(worldY / TILE_SIZE_WORLD);
    return this.isTileInWindow(tileX, tileY, window);
  }

  private isTileInWindow(tileX: number, tileY: number, window: ViewWindow): boolean {
    return (
      tileX >= window.minX &&
      tileX <= window.maxX &&
      tileY >= window.minY &&
      tileY <= window.maxY
    );
  }

  private areIdSetsEqual(a: ReadonlySet<number>, b: ReadonlySet<number>): boolean {
    if (a.size !== b.size) {
      return false;
    }
    for (const id of a) {
      if (!b.has(id)) {
        return false;
      }
    }
    return true;
  }

  private toTerrainUpdate(
    x: number,
    y: number,
    cell: {terrain: number; terrainLife: number; direction?: number}
  ): TerrainUpdate {
    return {
      x,
      y,
      terrain: cell.terrain,
      terrainLife: cell.terrainLife,
      ...(cell.direction !== undefined && {direction: cell.direction}),
    };
  }

  private getTankStateHash(tank: ServerTank, isSelf: boolean): string {
    if (isSelf) {
      return `${Math.round(tank.x)},${Math.round(tank.y)},${tank.direction},${tank.speed},${tank.armor},${tank.shells},${tank.mines},${tank.trees},${tank.onBoat},${tank.reload},${tank.firingRange},${tank.carriedPillbox?.id ?? 'null'}`;
    }
    // Enemy tanks: only hash visible fields (resources are always 0)
    return `${Math.round(tank.x)},${Math.round(tank.y)},${tank.direction},${tank.speed},${tank.armor},0,0,0,${tank.onBoat},0,0,${tank.carriedPillbox?.id ?? 'null'}`;
  }

  private getBuilderStateHash(builder: ServerBuilder): string {
    return `${Math.round(builder.x)},${Math.round(builder.y)},${Math.round(builder.targetX)},${Math.round(builder.targetY)},${builder.order},${builder.trees},${builder.hasMine},${builder.hasPillbox},${builder.respawnCounter}`;
  }

  private getPillboxStateHash(pillbox: ServerPillbox): string {
    return `${pillbox.armor},${pillbox.ownerTeam},${pillbox.inTank}`;
  }

  private getBaseStateHash(base: ServerBase): string {
    return `${base.armor},${base.shells},${base.mines},${base.ownerTeam}`;
  }
}
