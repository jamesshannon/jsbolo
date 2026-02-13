import {ServerBase} from '../simulation/base.js';
import type {BaseSpawnData, PillboxSpawnData} from '../simulation/map-loader.js';
import {ServerPillbox} from '../simulation/pillbox.js';

interface BootstrapWorldView {
  getPillboxSpawns(): PillboxSpawnData[];
  getBaseSpawns(): BaseSpawnData[];
}

export interface SessionBootstrapResult {
  pillboxes: Map<number, ServerPillbox>;
  bases: Map<number, ServerBase>;
}

/**
 * Builds initial structure state for a session from map data or deterministic fallback sets.
 *
 * WHY THIS EXISTS:
 * - Removes map/bootstrap responsibility from `GameSession`.
 * - Keeps startup behavior testable independently from networking/simulation.
 */
export class SessionWorldBootstrap {
  constructor(
    private readonly log: (message: string) => void = console.log
  ) {}

  initialize(world: BootstrapWorldView): SessionBootstrapResult {
    const pillboxes = this.spawnPillboxes(world.getPillboxSpawns());
    const bases = this.spawnBases(world.getBaseSpawns());
    return {pillboxes, bases};
  }

  private spawnPillboxes(spawns: PillboxSpawnData[]): Map<number, ServerPillbox> {
    const pillboxes = new Map<number, ServerPillbox>();

    if (spawns.length > 0) {
      for (const spawn of spawns) {
        const pillbox = new ServerPillbox(spawn.tileX, spawn.tileY, spawn.ownerTeam);
        pillbox.armor = spawn.armor;
        // Preserve map-authored pillbox cadence (6..100 ticks between shots).
        // Invalid values are clamped by `setAttackSpeed`.
        pillbox.setAttackSpeed(spawn.speed);
        pillboxes.set(pillbox.id, pillbox);
      }
      this.log(`  Spawned ${spawns.length} pillboxes from map`);
      return pillboxes;
    }

    const fallback = [
      {x: 100, y: 100},
      {x: 150, y: 100},
      {x: 100, y: 150},
      {x: 150, y: 150},
      {x: 125, y: 75},
      {x: 175, y: 125},
    ];
    for (const loc of fallback) {
      const pillbox = new ServerPillbox(loc.x, loc.y, 255);
      pillboxes.set(pillbox.id, pillbox);
    }
    return pillboxes;
  }

  private spawnBases(spawns: BaseSpawnData[]): Map<number, ServerBase> {
    const bases = new Map<number, ServerBase>();

    if (spawns.length > 0) {
      for (const spawn of spawns) {
        const base = new ServerBase(spawn.tileX, spawn.tileY, spawn.ownerTeam);
        base.armor = spawn.armor;
        base.shells = spawn.shells;
        base.mines = spawn.mines;
        bases.set(base.id, base);
      }
      this.log(`  Spawned ${spawns.length} bases from map`);
      return bases;
    }

    const fallback = [
      {x: 80, y: 80},
      {x: 170, y: 80},
      {x: 80, y: 170},
      {x: 170, y: 170},
    ];
    for (const loc of fallback) {
      const base = new ServerBase(loc.x, loc.y, 255);
      bases.set(base.id, base);
    }
    return bases;
  }
}
