/**
 * Server-side world simulation
 */

import {
  MAP_SIZE_TILES,
  TerrainType,
  TERRAIN_TANK_SPEED,
  type MapCell,
} from '@jsbolo/shared';

export class ServerWorld {
  private readonly map: MapCell[][];

  constructor() {
    this.map = this.generateTestMap();
  }

  private generateTestMap(): MapCell[][] {
    const map: MapCell[][] = [];

    for (let y = 0; y < MAP_SIZE_TILES; y++) {
      map[y] = [];
      for (let x = 0; x < MAP_SIZE_TILES; x++) {
        let terrain: TerrainType;

        if (x < 20 || x >= MAP_SIZE_TILES - 20 || y < 20 || y >= MAP_SIZE_TILES - 20) {
          terrain = TerrainType.DEEP_SEA;
        } else if ((x + y) % 20 === 0) {
          terrain = TerrainType.FOREST;
        } else if (x % 30 === 0 || y % 30 === 0) {
          terrain = TerrainType.ROAD;
        } else if ((x % 15 === 0 && y % 15 === 0)) {
          terrain = TerrainType.SWAMP;
        } else if ((x - 50) ** 2 + (y - 50) ** 2 < 100) {
          terrain = TerrainType.RIVER;
        } else {
          terrain = TerrainType.GRASS;
        }

        map[y]![x] = {
          terrain,
          hasMine: false,
        };
      }
    }

    return map;
  }

  getTankSpeedAt(tileX: number, tileY: number): number {
    if (
      tileX < 0 ||
      tileX >= MAP_SIZE_TILES ||
      tileY < 0 ||
      tileY >= MAP_SIZE_TILES
    ) {
      return 0;
    }
    const terrain = this.map[tileY]![tileX]!.terrain;
    return TERRAIN_TANK_SPEED[terrain] ?? 0;
  }

  getMapData(): MapCell[][] {
    return this.map;
  }
}
