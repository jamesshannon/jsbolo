import {
  FOREST_REGROWTH_TICKS,
  TILE_SIZE_WORLD,
  TerrainType,
} from '@jsbolo/shared';

interface TerrainEffectsWorldView {
  getTerrainAt(tileX: number, tileY: number): TerrainType;
  setTerrainAt(tileX: number, tileY: number, terrain: TerrainType): void;
  checkCraterFlooding(): Array<{x: number; y: number}>;
}

export interface TerrainEffectsTickResult {
  terrainChanges: string[];
  bubbleSoundPositions: Array<{x: number; y: number}>;
}

export class TerrainEffectsSystem {
  private readonly forestRegrowthTimers = new Map<string, number>();

  trackForestRegrowth(tileKey: string): void {
    this.forestRegrowthTimers.set(tileKey, FOREST_REGROWTH_TICKS);
  }

  update(tick: number, world: TerrainEffectsWorldView): TerrainEffectsTickResult {
    const terrainChanges: string[] = [];
    const bubbleSoundPositions: Array<{x: number; y: number}> = [];

    if (tick % 10 === 0) {
      const floodedCraters = world.checkCraterFlooding();
      for (const crater of floodedCraters) {
        terrainChanges.push(`${crater.x},${crater.y}`);
        bubbleSoundPositions.push({
          x: (crater.x + 0.5) * TILE_SIZE_WORLD,
          y: (crater.y + 0.5) * TILE_SIZE_WORLD,
        });
      }
    }

    const tilesToRegrow: string[] = [];
    for (const [tileKey, remainingTicks] of this.forestRegrowthTimers) {
      const newRemainingTicks = remainingTicks - 1;
      if (newRemainingTicks <= 0) {
        tilesToRegrow.push(tileKey);
      } else {
        this.forestRegrowthTimers.set(tileKey, newRemainingTicks);
      }
    }

    for (const tileKey of tilesToRegrow) {
      const [xStr, yStr] = tileKey.split(',');
      const x = Number(xStr);
      const y = Number(yStr);
      const terrain = world.getTerrainAt(x, y);

      if (terrain === TerrainType.GRASS || terrain === TerrainType.CRATER) {
        world.setTerrainAt(x, y, TerrainType.FOREST);
        terrainChanges.push(tileKey);
      }

      this.forestRegrowthTimers.delete(tileKey);
    }

    return {terrainChanges, bubbleSoundPositions};
  }

  getRegrowthTimersForDebug(): Map<string, number> {
    return this.forestRegrowthTimers;
  }
}
