/**
 * Game world - manages map and entities
 */

import {
  MAP_SIZE_TILES,
  TerrainType,
  TERRAIN_TANK_SPEED,
  type MapCell,
} from '@shared';

export class World {
  private readonly map: MapCell[][];

  constructor() {
    this.map = this.generateTestMap();
  }

  /**
   * Generate a simple test map for Phase 1
   */
  private generateTestMap(): MapCell[][] {
    const map: MapCell[][] = [];

    for (let y = 0; y < MAP_SIZE_TILES; y++) {
      map[y] = [];
      for (let x = 0; x < MAP_SIZE_TILES; x++) {
        // Create a simple test pattern
        let terrain: TerrainType;

        // Edges are deep sea
        if (x < 20 || x >= MAP_SIZE_TILES - 20 || y < 20 || y >= MAP_SIZE_TILES - 20) {
          terrain = TerrainType.DEEP_SEA;
        }
        // Create some variety
        else if ((x + y) % 20 === 0) {
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
          terrainLife: 0, // Will be synced from server
        };
      }
    }

    return map;
  }

  /**
   * Get terrain at tile position
   */
  getTerrainAt(tileX: number, tileY: number): TerrainType {
    if (
      tileX < 0 ||
      tileX >= MAP_SIZE_TILES ||
      tileY < 0 ||
      tileY >= MAP_SIZE_TILES
    ) {
      return TerrainType.DEEP_SEA;
    }
    return this.map[tileY]![tileX]!.terrain;
  }

  /**
   * Get map cell at tile position
   */
  getCellAt(tileX: number, tileY: number): MapCell | null {
    if (
      tileX < 0 ||
      tileX >= MAP_SIZE_TILES ||
      tileY < 0 ||
      tileY >= MAP_SIZE_TILES
    ) {
      return null;
    }
    return this.map[tileY]![tileX]!;
  }

  /**
   * Get tank speed multiplier at tile position
   */
  getTankSpeedAt(tileX: number, tileY: number): number {
    const terrain = this.getTerrainAt(tileX, tileY);
    return TERRAIN_TANK_SPEED[terrain] ?? 0;
  }

  /**
   * Update a cell from server data
   */
  updateCell(tileX: number, tileY: number, cell: Partial<MapCell>): void {
    if (
      tileX < 0 ||
      tileX >= MAP_SIZE_TILES ||
      tileY < 0 ||
      tileY >= MAP_SIZE_TILES
    ) {
      return;
    }
    Object.assign(this.map[tileY]![tileX]!, cell);
  }

  /**
   * Iterate over visible tiles
   */
  forEachVisibleTile(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    callback: (cell: MapCell, tileX: number, tileY: number) => void
  ): void {
    for (let y = Math.max(0, startY); y < Math.min(MAP_SIZE_TILES, endY); y++) {
      for (let x = Math.max(0, startX); x < Math.min(MAP_SIZE_TILES, endX); x++) {
        const cell = this.map[y]![x];
        if (cell) {
          callback(cell, x, y);
        }
      }
    }
  }
}
