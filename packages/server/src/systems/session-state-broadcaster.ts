import {
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

interface PreviousBroadcastState {
  tanks: Map<number, string>;
  shells: Set<number>;
  builders: Map<number, string>;
  pillboxes: Map<number, string>;
  bases: Map<number, string>;
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
  private previousState: PreviousBroadcastState = {
    tanks: new Map<number, string>(),
    shells: new Set<number>(),
    builders: new Map<number, string>(),
    pillboxes: new Map<number, string>(),
    bases: new Map<number, string>(),
  };
  private previousAllianceHash = '';

  constructor(
    private readonly log: (message: string) => void = console.log
  ) {}

  broadcastState(context: SessionBroadcastContext): SessionBroadcastResult {
    // Materialize players once so we can iterate for diffing and sending.
    // `Map#values()` is a one-shot iterator and would otherwise be exhausted.
    const players = Array.from(context.players);

    const tanks = [];
    const builders = [];
    const currentTankIds = new Set<number>();
    const currentBuilderIds = new Set<number>();

    for (const player of players) {
      const tank = player.tank;
      currentTankIds.add(tank.id);
      const currentHash = this.getTankStateHash(tank);
      const previousHash = this.previousState.tanks.get(tank.id);

      if (currentHash !== previousHash) {
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
          allianceId: tank.team,
          onBoat: tank.onBoat,
          reload: tank.reload,
          firingRange: tank.firingRange,
          carriedPillbox: tank.carriedPillbox?.id ?? null,
        });
        this.previousState.tanks.set(tank.id, currentHash);
      }

      const builder = tank.builder;
      currentBuilderIds.add(builder.id);
      const builderHash = this.getBuilderStateHash(builder);
      const previousBuilderHash = this.previousState.builders.get(builder.id);

      if (builderHash !== previousBuilderHash) {
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
        this.previousState.builders.set(builder.id, builderHash);
      }
    }

    const removedTankIds: number[] = [];
    for (const previousTankId of this.previousState.tanks.keys()) {
      if (!currentTankIds.has(previousTankId)) {
        removedTankIds.push(previousTankId);
        this.previousState.tanks.delete(previousTankId);
      }
    }

    const removedBuilderIds: number[] = [];
    for (const previousBuilderId of this.previousState.builders.keys()) {
      if (!currentBuilderIds.has(previousBuilderId)) {
        removedBuilderIds.push(previousBuilderId);
        this.previousState.builders.delete(previousBuilderId);
      }
    }

    // Shells are always included when broadcasting to ensure client can clear dead shells.
    const shells = [];
    const currentShellIds = new Set<number>();
    for (const shell of context.shells) {
      shells.push({
        id: shell.id,
        x: Math.round(shell.x),
        y: Math.round(shell.y),
        direction: shell.direction,
        ownerTankId: shell.ownerTankId,
      });
      currentShellIds.add(shell.id);
    }
    this.previousState.shells = currentShellIds;

    const pillboxes = [];
    const currentPillboxIds = new Set<number>();
    for (const pillbox of context.pillboxes) {
      currentPillboxIds.add(pillbox.id);
      const currentHash = this.getPillboxStateHash(pillbox);
      const previousHash = this.previousState.pillboxes.get(pillbox.id);

      if (currentHash !== previousHash) {
        pillboxes.push({
          id: pillbox.id,
          tileX: pillbox.tileX,
          tileY: pillbox.tileY,
          armor: pillbox.armor,
          ownerTeam: pillbox.ownerTeam,
          inTank: pillbox.inTank,
        });
        this.previousState.pillboxes.set(pillbox.id, currentHash);
      }
    }
    const removedPillboxIds: number[] = [];
    for (const previousPillboxId of this.previousState.pillboxes.keys()) {
      if (!currentPillboxIds.has(previousPillboxId)) {
        removedPillboxIds.push(previousPillboxId);
        this.previousState.pillboxes.delete(previousPillboxId);
      }
    }

    const bases = [];
    const currentBaseIds = new Set<number>();
    for (const base of context.bases) {
      currentBaseIds.add(base.id);
      const currentHash = this.getBaseStateHash(base);
      const previousHash = this.previousState.bases.get(base.id);

      if (currentHash !== previousHash) {
        bases.push({
          id: base.id,
          tileX: base.tileX,
          tileY: base.tileY,
          armor: base.armor,
          shells: base.shells,
          mines: base.mines,
          ownerTeam: base.ownerTeam,
        });
        this.previousState.bases.set(base.id, currentHash);
      }
    }
    const removedBaseIds: number[] = [];
    for (const previousBaseId of this.previousState.bases.keys()) {
      if (!currentBaseIds.has(previousBaseId)) {
        removedBaseIds.push(previousBaseId);
        this.previousState.bases.delete(previousBaseId);
      }
    }

    const terrainUpdates: TerrainUpdate[] = [];
    const mapData = context.world.getMapData();
    for (const key of context.terrainChanges) {
      const [xStr, yStr] = key.split(',');
      const x = Number(xStr);
      const y = Number(yStr);
      const cell = mapData[y]![x]!;

      this.log(
        `[DEBUG] Broadcasting terrain update: (${x}, ${y}) terrain=${cell.terrain} (was potentially road)`
      );

      terrainUpdates.push({
        x,
        y,
        terrain: cell.terrain,
        terrainLife: cell.terrainLife,
        ...(cell.direction !== undefined && {direction: cell.direction}),
      });
    }
    context.terrainChanges.clear();

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
      ...(context.soundEvents.length > 0 && {soundEvents: context.soundEvents}),
      ...(context.getAllianceSnapshots && {
        alliances: context.getAllianceSnapshots(),
      }),
      ...(context.matchEnded &&
        !context.matchEndAnnounced && {
          matchEnded: context.matchEnded,
          winningTeams: context.winningTeams,
        }),
    };
    const allianceHash = JSON.stringify(update.alliances ?? []);
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
    const hasHudChanges = Array.from(hudByPlayerId.values()).some(
      messages => messages.length > 0
    );

    const hasChanges =
      tanks.length > 0 ||
      shells.length > 0 ||
      builders.length > 0 ||
      pillboxes.length > 0 ||
      bases.length > 0 ||
      removedTankIds.length > 0 ||
      removedBuilderIds.length > 0 ||
      removedPillboxIds.length > 0 ||
      removedBaseIds.length > 0 ||
      terrainUpdates.length > 0 ||
      context.soundEvents.length > 0 ||
      hasAllianceChanges ||
      (context.matchEnded && !context.matchEndAnnounced) ||
      hasHudChanges;

    if (!hasChanges) {
      return {
        didBroadcast: false,
        matchEndAnnounced: context.matchEndAnnounced,
      };
    }

    for (const player of players) {
      if (player.ws.readyState === 1) {
        const hudMessages = hudByPlayerId.get(player.id) ?? [];
        const message = encodeServerMessage({
          ...update,
          ...(hudMessages.length > 0 && {hudMessages}),
        });
        player.ws.send(message);
      }
    }

    return {
      didBroadcast: true,
      matchEndAnnounced: context.matchEnded ? true : context.matchEndAnnounced,
    };
  }

  private getTankStateHash(tank: ServerTank): string {
    return `${Math.round(tank.x)},${Math.round(tank.y)},${tank.direction},${tank.speed},${tank.armor},${tank.shells},${tank.mines},${tank.trees},${tank.onBoat},${tank.reload},${tank.firingRange},${tank.carriedPillbox?.id ?? 'null'}`;
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
