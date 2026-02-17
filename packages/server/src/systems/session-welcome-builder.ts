import type {AllianceSnapshot, WelcomeMessage} from '@jsbolo/shared';
import type {ServerBase} from '../simulation/base.js';
import type {ServerPillbox} from '../simulation/pillbox.js';
import type {ServerTank} from '../simulation/tank.js';
import type {ServerWorld} from '../simulation/world.js';

interface WelcomePlayer {
  tank: ServerTank;
}

export interface SessionWelcomeContext {
  playerId: number;
  assignedTeam: number;
  currentTick: number;
  world: ServerWorld;
  players: Iterable<WelcomePlayer>;
  pillboxes: Iterable<ServerPillbox>;
  bases: Iterable<ServerBase>;
  matchEnded: boolean;
  winningTeams: number[];
  getAllianceSnapshots?: () => AllianceSnapshot[];
}

/**
 * Builds welcome payloads for newly connected players.
 *
 * WHY THIS EXISTS:
 * - Isolates expensive map/entity serialization from `GameSession`.
 * - Makes initial-state payload behavior easy to unit test in isolation.
 * - Keeps welcome payload format aligned as networking evolves.
 */
export class SessionWelcomeBuilder {
  private readonly debugWelcomeTerrainLogs = process.env['DEBUG_WELCOME_TERRAIN'] === 'true';

  constructor(
    private readonly log: (message: string, ...args: unknown[]) => void = console.log
  ) {}

  buildWelcome(context: SessionWelcomeContext): WelcomeMessage {
    const mapData = context.world.getMapData();
    const height = mapData.length;
    const width = mapData[0]?.length ?? 0;

    // Pack terrain data as flat arrays for transport efficiency.
    const terrain: number[] = [];
    const terrainLife: number[] = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = mapData[y]![x]!;
        terrain.push(cell.terrain);
        terrainLife.push(cell.terrainLife);
      }
    }

    if (this.debugWelcomeTerrainLogs) {
      // Keep these diagnostics available during deep map-transfer debugging without
      // emitting high-volume logs in normal operation.
      const terrainHistogram = new Map<number, number>();
      for (const terrainId of terrain) {
        terrainHistogram.set(terrainId, (terrainHistogram.get(terrainId) || 0) + 1);
      }
      this.log('Sending terrain histogram:', Object.fromEntries(terrainHistogram));
      this.log('Sample terrain at row 102:', terrain.slice(102 * width, 102 * width + 10));
      this.log('Sample terrain at row 241:', terrain.slice(241 * width, 241 * width + 10));
    }

    const tanks = Array.from(context.players, p => {
      const isSelf = p.tank.id === context.playerId;
      return {
        id: p.tank.id,
        team: p.tank.team,
        allianceId: p.tank.team,
        x: p.tank.x,
        y: p.tank.y,
        direction: p.tank.direction,
        speed: p.tank.speed,
        armor: p.tank.armor,
        // Only reveal resource counts to the tank's own player
        shells: isSelf ? p.tank.shells : 0,
        mines: isSelf ? p.tank.mines : 0,
        trees: isSelf ? p.tank.trees : 0,
        onBoat: p.tank.onBoat,
        reload: isSelf ? p.tank.reload : 0,
        firingRange: isSelf ? p.tank.firingRange : 0,
        carriedPillbox: p.tank.carriedPillbox?.id ?? null,
      };
    });

    const pillboxes = Array.from(context.pillboxes, pillbox => ({
      id: pillbox.id,
      tileX: pillbox.tileX,
      tileY: pillbox.tileY,
      armor: pillbox.armor,
      ownerTeam: pillbox.ownerTeam,
      inTank: pillbox.inTank,
    }));

    const bases = Array.from(context.bases, base => ({
      id: base.id,
      tileX: base.tileX,
      tileY: base.tileY,
      armor: base.armor,
      shells: base.shells,
      mines: base.mines,
      ownerTeam: base.ownerTeam,
    }));

    return {
      type: 'welcome',
      playerId: context.playerId,
      assignedTeam: context.assignedTeam,
      currentTick: context.currentTick,
      mapName: context.world.getMapName(),
      map: {
        width,
        height,
        terrain,
        terrainLife,
      },
      tanks,
      pillboxes,
      bases,
      ...(context.getAllianceSnapshots && {
        alliances: context.getAllianceSnapshots(),
      }),
      ...(context.matchEnded && {
        matchEnded: context.matchEnded,
        winningTeams: context.winningTeams,
      }),
    };
  }
}
