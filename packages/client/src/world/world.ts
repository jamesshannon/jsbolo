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
   * Get terrain types of 8-directional neighbors for auto-tiling.
   * Returns null for out-of-bounds neighbors.
   *
   * Order: [N, NE, E, SE, S, SW, W, NW]
   */
  getNeighbors(tileX: number, tileY: number): (TerrainType | null)[] {
    const offsets = [
      [0, -1],  // North
      [1, -1],  // Northeast
      [1, 0],   // East
      [1, 1],   // Southeast
      [0, 1],   // South
      [-1, 1],  // Southwest
      [-1, 0],  // West
      [-1, -1], // Northwest
    ];

    return offsets.map(([dx, dy]) => {
      const nx = tileX + dx;
      const ny = tileY + dy;

      if (nx < 0 || nx >= MAP_SIZE_TILES || ny < 0 || ny >= MAP_SIZE_TILES) {
        return null; // Out of bounds
      }

      return this.map[ny]![nx]!.terrain;
    });
  }

  /**
   * Get 4-cardinal neighbors (N, E, S, W) for simpler auto-tiling.
   */
  getCardinalNeighbors(tileX: number, tileY: number): (TerrainType | null)[] {
    const neighbors = this.getNeighbors(tileX, tileY);
    return [neighbors[0], neighbors[2], neighbors[4], neighbors[6]]; // N, E, S, W
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
