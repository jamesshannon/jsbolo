/**
 * Auto-tiling system for neighbor-aware sprite selection.
 * Based on Orona's implementation (map.coffee lines 100-360).
 *
 * Coordinates verified against actual Orona source code.
 */

import {TerrainType} from '@shared';

export interface TileCoord {
  x: number;
  y: number;
}

export class AutoTiler {
  private static isWater(terrain: TerrainType | null | undefined): boolean {
    return (
      terrain === TerrainType.RIVER ||
      terrain === TerrainType.DEEP_SEA ||
      terrain === TerrainType.BOAT
    );
  }

  private static categorizeRoadNeighbor(terrain: TerrainType | null | undefined): 'r' | 'w' | 'l' {
    if (terrain === TerrainType.ROAD) return 'r';
    if (this.isWater(terrain)) return 'w';
    return 'l';
  }

  private static categorizeRiverNeighbor(terrain: TerrainType | null | undefined): 'r' | 'w' | 'l' {
    if (terrain === TerrainType.ROAD) return 'r';
    if (this.isWater(terrain)) return 'w';
    return 'l';
  }

  private static categorizeDeepSeaNeighbor(terrain: TerrainType | null | undefined): 'd' | 'w' | 'l' {
    if (terrain === TerrainType.DEEP_SEA) return 'd';
    if (terrain === TerrainType.RIVER || terrain === TerrainType.BOAT) return 'w';
    return 'l';
  }

  private static categorizeBuildingNeighbor(terrain: TerrainType | null | undefined): 'b' | 'o' {
    return terrain === TerrainType.BUILDING || terrain === TerrainType.SHOT_BUILDING ? 'b' : 'o';
  }

  /**
   * Get sprite coordinates for a forest tile based on neighbors.
   * Only checks 4-cardinal directions (no diagonals).
   *
   * Orona logic (map.coffee lines 321-337):
   * - Corners (2 adjacent filled): (9-12, 9)
   * - Single edges (only 1 filled): (13-16, 9)
   * - Isolated (none filled): (8, 9)
   * - Everything else (3 or 4 filled): (3, 1)
   */
  static getForestTile(neighbors: (TerrainType | null)[]): TileCoord {
    const [northNeighbor, , eastNeighbor, , southNeighbor, , westNeighbor] = neighbors;

    // Check only cardinal directions (ignore diagonals)
    const north = northNeighbor === TerrainType.FOREST;
    const east = eastNeighbor === TerrainType.FOREST;
    const south = southNeighbor === TerrainType.FOREST;
    const west = westNeighbor === TerrainType.FOREST;

    // Corners (2 adjacent filled) - Orona lines 328-331
    if (!north && !west && east && south) {
      return {x: 9, y: 9}; // NW quadrant open
    }
    if (!north && west && !east && south) {
      return {x: 10, y: 9}; // NE quadrant open
    }
    if (north && west && !east && !south) {
      return {x: 11, y: 9}; // SE quadrant open
    }
    if (north && !west && east && !south) {
      return {x: 12, y: 9}; // SW quadrant open
    }

    // Single edges (only 1 filled) - Orona lines 332-335
    if (north && !west && !east && !south) {
      return {x: 16, y: 9}; // Only north filled
    }
    if (!north && !west && !east && south) {
      return {x: 15, y: 9}; // Only south filled
    }
    if (!north && west && !east && !south) {
      return {x: 14, y: 9}; // Only west filled
    }
    if (!north && !west && east && !south) {
      return {x: 13, y: 9}; // Only east filled
    }

    // Isolated (none filled) - Orona line 336
    if (!north && !west && !east && !south) {
      return {x: 8, y: 9};
    }

    // Default: dense forest (3 or 4 filled, or 2 opposite) - Orona line 337
    return {x: 3, y: 1};
  }

  /**
   * Get sprite coordinates for a road tile based on neighbors.
   * Checks cardinal directions and categorizes neighbors as:
   * - 'r': Road (connected)
   * - 'w': Water (RIVER, DEEP_SEA, BOAT)
   * - 'l': Land (everything else)
   *
   * Orona logic (map.coffee lines 263-319):
   * - 4-way intersection: (10, 0)
   * - T-junctions: (12-15, 0)
   * - Corners with diagonals: (6-9, 0)
   * - Corners without diagonals: (2-5, 0)
   * - Straights: (0, 1) horizontal, (1, 1) vertical
   * - Water crossings: (16-30, 0)
   */
  static getRoadTile(neighbors: (TerrainType | null)[]): TileCoord {
    const [N, NE, E, SE, S, SW, W, NW] = neighbors;

    const north = this.categorizeRoadNeighbor(N);
    const northEast = this.categorizeRoadNeighbor(NE);
    const east = this.categorizeRoadNeighbor(E);
    const southEast = this.categorizeRoadNeighbor(SE);
    const south = this.categorizeRoadNeighbor(S);
    const southWest = this.categorizeRoadNeighbor(SW);
    const west = this.categorizeRoadNeighbor(W);
    const northWest = this.categorizeRoadNeighbor(NW);

    // Special pattern: cross with all diagonals non-road (Orona line 280)
    if (northWest !== 'r' && north === 'r' && northEast !== 'r' &&
        west === 'r' && east === 'r' &&
        southWest !== 'r' && south === 'r' && southEast !== 'r') {
      return {x: 11, y: 0};
    }

    // 4-way intersection (Orona line 282)
    if (north === 'r' && east === 'r' && south === 'r' && west === 'r') {
      return {x: 10, y: 0};
    }

    // Water crossings (Orona lines 283-294)
    if (west === 'w' && east === 'w' && north === 'w' && south === 'w') {
      return {x: 26, y: 0}; // Surrounded by water
    }
    if (east === 'r' && south === 'r' && west === 'w' && north === 'w') {
      return {x: 20, y: 0};
    }
    if (west === 'r' && south === 'r' && east === 'w' && north === 'w') {
      return {x: 21, y: 0};
    }
    if (north === 'r' && west === 'r' && south === 'w' && east === 'w') {
      return {x: 22, y: 0};
    }
    if (east === 'r' && north === 'r' && west === 'w' && south === 'w') {
      return {x: 23, y: 0};
    }
    if (north === 'w' && south === 'w') {
      return {x: 24, y: 0}; // Water above and below
    }
    if (west === 'w' && east === 'w') {
      return {x: 25, y: 0}; // Water left and right
    }
    if (north === 'w' && south === 'r') {
      return {x: 16, y: 0};
    }
    if (east === 'w' && west === 'r') {
      return {x: 17, y: 0};
    }
    if (south === 'w' && north === 'r') {
      return {x: 18, y: 0};
    }
    if (west === 'w' && east === 'r') {
      return {x: 19, y: 0};
    }

    // T-junctions with diagonal enhancements (Orona lines 296-299)
    if (east === 'r' && south === 'r' && north === 'r' && (northEast === 'r' || southEast === 'r')) {
      return {x: 27, y: 0};
    }
    if (west === 'r' && east === 'r' && south === 'r' && (southWest === 'r' || southEast === 'r')) {
      return {x: 28, y: 0};
    }
    if (west === 'r' && north === 'r' && south === 'r' && (southWest === 'r' || northWest === 'r')) {
      return {x: 29, y: 0};
    }
    if (west === 'r' && east === 'r' && north === 'r' && (northEast === 'r' || northWest === 'r')) {
      return {x: 30, y: 0};
    }

    // T-junctions (Orona lines 301-304)
    if (west === 'r' && east === 'r' && south === 'r') {
      return {x: 12, y: 0}; // T pointing up (no north)
    }
    if (west === 'r' && north === 'r' && south === 'r') {
      return {x: 13, y: 0}; // T pointing right (no east)
    }
    if (west === 'r' && east === 'r' && north === 'r') {
      return {x: 14, y: 0}; // T pointing down (no south)
    }
    if (east === 'r' && north === 'r' && south === 'r') {
      return {x: 15, y: 0}; // T pointing left (no west)
    }

    // Corners with diagonals (Orona lines 306-309)
    if (south === 'r' && east === 'r' && southEast === 'r') {
      return {x: 6, y: 0}; // SE corner with diagonal
    }
    if (south === 'r' && west === 'r' && southWest === 'r') {
      return {x: 7, y: 0}; // SW corner with diagonal
    }
    if (north === 'r' && west === 'r' && northWest === 'r') {
      return {x: 8, y: 0}; // NW corner with diagonal
    }
    if (north === 'r' && east === 'r' && northEast === 'r') {
      return {x: 9, y: 0}; // NE corner with diagonal
    }

    // Corners without diagonals (Orona lines 311-314)
    if (south === 'r' && east === 'r') {
      return {x: 2, y: 0}; // SE corner
    }
    if (south === 'r' && west === 'r') {
      return {x: 3, y: 0}; // SW corner
    }
    if (north === 'r' && west === 'r') {
      return {x: 4, y: 0}; // NW corner
    }
    if (north === 'r' && east === 'r') {
      return {x: 5, y: 0}; // NE corner
    }

    // Straights (Orona lines 316-317)
    if (east === 'r' || west === 'r') {
      return {x: 0, y: 1}; // Horizontal
    }
    if (north === 'r' || south === 'r') {
      return {x: 1, y: 1}; // Vertical
    }

    // Isolated road (Orona line 319)
    return {x: 10, y: 0};
  }

  /**
   * Get sprite coordinates for building/wall tiles.
   * Mirrors Orona retileBuilding() rules.
   */
  static getBuildingTile(neighbors: (TerrainType | null)[]): TileCoord {
    const [N, NE, E, SE, S, SW, W, NW] = neighbors;
    const north = this.categorizeBuildingNeighbor(N);
    const northEast = this.categorizeBuildingNeighbor(NE);
    const east = this.categorizeBuildingNeighbor(E);
    const southEast = this.categorizeBuildingNeighbor(SE);
    const south = this.categorizeBuildingNeighbor(S);
    const southWest = this.categorizeBuildingNeighbor(SW);
    const west = this.categorizeBuildingNeighbor(W);
    const northWest = this.categorizeBuildingNeighbor(NW);

    if (northWest === 'b' && north === 'b' && northEast === 'b' && west === 'b' && east === 'b' && southWest === 'b' && south === 'b' && southEast === 'b') return {x: 17, y: 1};
    if (east === 'b' && north === 'b' && south === 'b' && west === 'b' && northEast !== 'b' && northWest !== 'b' && southEast !== 'b' && southWest !== 'b') return {x: 30, y: 1};
    if (east === 'b' && north === 'b' && south === 'b' && west === 'b' && northEast !== 'b' && northWest !== 'b' && southEast !== 'b' && southWest === 'b') return {x: 22, y: 2};
    if (east === 'b' && north === 'b' && south === 'b' && west === 'b' && northEast !== 'b' && northWest === 'b' && southEast !== 'b' && southWest !== 'b') return {x: 23, y: 2};
    if (east === 'b' && north === 'b' && south === 'b' && west === 'b' && northEast !== 'b' && northWest !== 'b' && southEast === 'b' && southWest !== 'b') return {x: 24, y: 2};
    if (east === 'b' && north === 'b' && south === 'b' && west === 'b' && northEast === 'b' && northWest !== 'b' && southEast !== 'b' && southWest !== 'b') return {x: 25, y: 2};

    if (northWest === 'b' && north === 'b' && west === 'b' && east === 'b' && southWest === 'b' && south === 'b' && southEast === 'b') return {x: 16, y: 2};
    if (north === 'b' && northEast === 'b' && west === 'b' && east === 'b' && southWest === 'b' && south === 'b' && southEast === 'b') return {x: 17, y: 2};
    if (northWest === 'b' && north === 'b' && northEast === 'b' && west === 'b' && east === 'b' && southWest === 'b' && south === 'b') return {x: 18, y: 2};
    if (northWest === 'b' && north === 'b' && northEast === 'b' && west === 'b' && east === 'b' && south === 'b' && southEast === 'b') return {x: 19, y: 2};

    if (west === 'b' && east === 'b' && north === 'b' && south === 'b' && northEast === 'b' && southWest === 'b' && northWest !== 'b' && southEast !== 'b') return {x: 20, y: 2};
    if (west === 'b' && east === 'b' && north === 'b' && south === 'b' && southEast === 'b' && northWest === 'b' && northEast !== 'b' && southWest !== 'b') return {x: 21, y: 2};

    if (north === 'b' && west === 'b' && east === 'b' && south === 'b' && southEast === 'b' && northEast === 'b') return {x: 8, y: 2};
    if (north === 'b' && west === 'b' && east === 'b' && south === 'b' && southWest === 'b' && northWest === 'b') return {x: 9, y: 2};
    if (north === 'b' && west === 'b' && east === 'b' && south === 'b' && southWest === 'b' && southEast === 'b') return {x: 10, y: 2};
    if (north === 'b' && west === 'b' && east === 'b' && south === 'b' && northWest === 'b' && northEast === 'b') return {x: 11, y: 2};

    if (north === 'b' && south === 'b' && west === 'b' && east !== 'b' && southWest === 'b' && northWest !== 'b') return {x: 12, y: 2};
    if (north === 'b' && south === 'b' && east === 'b' && southEast === 'b' && west !== 'b' && northEast !== 'b') return {x: 13, y: 2};
    if (north === 'b' && south === 'b' && east === 'b' && northEast === 'b' && southEast !== 'b') return {x: 14, y: 2};
    if (north === 'b' && south === 'b' && west === 'b' && northWest === 'b' && southWest !== 'b') return {x: 15, y: 2};

    if (east === 'b' && north === 'b' && west === 'b' && south !== 'b' && northWest !== 'b' && northEast !== 'b') return {x: 26, y: 1};
    if (east === 'b' && south === 'b' && west === 'b' && southWest !== 'b' && southEast !== 'b') return {x: 27, y: 1};
    if (east === 'b' && north === 'b' && south === 'b' && northEast !== 'b' && southEast !== 'b') return {x: 28, y: 1};
    if (south === 'b' && north === 'b' && west === 'b' && northWest !== 'b' && southWest !== 'b') return {x: 29, y: 1};

    if (west === 'b' && east === 'b' && north === 'b' && northEast === 'b' && northWest !== 'b') return {x: 4, y: 2};
    if (west === 'b' && east === 'b' && north === 'b' && northWest === 'b' && northEast !== 'b') return {x: 5, y: 2};
    if (west === 'b' && east === 'b' && south === 'b' && southWest === 'b' && southEast !== 'b') return {x: 6, y: 2};
    if (west === 'b' && east === 'b' && south === 'b' && north !== 'b' && southEast === 'b' && southWest !== 'b') return {x: 7, y: 2};

    if (east === 'b' && north === 'b' && south === 'b') return {x: 0, y: 2};
    if (west === 'b' && north === 'b' && south === 'b') return {x: 1, y: 2};
    if (east === 'b' && west === 'b' && south === 'b') return {x: 2, y: 2};
    if (east === 'b' && north === 'b' && west === 'b') return {x: 3, y: 2};
    if (east === 'b' && south === 'b' && southEast === 'b') return {x: 18, y: 1};
    if (west === 'b' && south === 'b' && southWest === 'b') return {x: 19, y: 1};
    if (east === 'b' && north === 'b' && northEast === 'b') return {x: 20, y: 1};
    if (west === 'b' && north === 'b' && northWest === 'b') return {x: 21, y: 1};

    if (east === 'b' && south === 'b') return {x: 22, y: 1};
    if (west === 'b' && south === 'b') return {x: 23, y: 1};
    if (east === 'b' && north === 'b') return {x: 24, y: 1};
    if (west === 'b' && north === 'b') return {x: 25, y: 1};
    if (west === 'b' && east === 'b') return {x: 11, y: 1};
    if (north === 'b' && south === 'b') return {x: 12, y: 1};

    if (east === 'b') return {x: 13, y: 1};
    if (west === 'b') return {x: 14, y: 1};
    if (south === 'b') return {x: 15, y: 1};
    if (north === 'b') return {x: 16, y: 1};

    return {x: 6, y: 1};
  }

  /**
   * Get sprite coordinates for river tiles (shoreline edges and transitions).
   * Mirrors Orona retileRiver() rules.
   */
  static getRiverTile(neighbors: (TerrainType | null)[]): TileCoord {
    const [N, , E, , S, , W] = neighbors;
    const north = this.categorizeRiverNeighbor(N);
    const east = this.categorizeRiverNeighbor(E);
    const south = this.categorizeRiverNeighbor(S);
    const west = this.categorizeRiverNeighbor(W);

    if (north === 'l' && south === 'l' && east === 'l' && west === 'l') return {x: 30, y: 2};
    if (north === 'l' && south === 'l' && east === 'w' && west === 'l') return {x: 26, y: 2};
    if (north === 'l' && south === 'l' && east === 'l' && west === 'w') return {x: 27, y: 2};
    if (north === 'l' && south === 'w' && east === 'l' && west === 'l') return {x: 28, y: 2};
    if (north === 'w' && south === 'l' && east === 'l' && west === 'l') return {x: 29, y: 2};

    if (north === 'l' && west === 'l') return {x: 6, y: 3};
    if (north === 'l' && east === 'l') return {x: 7, y: 3};
    if (south === 'l' && west === 'l') return {x: 8, y: 3};
    if (south === 'l' && east === 'l') return {x: 9, y: 3};
    if (south === 'l' && north === 'l') return {x: 0, y: 3};
    if (west === 'l' && east === 'l') return {x: 1, y: 3};

    if (west === 'l') return {x: 2, y: 3};
    if (south === 'l') return {x: 3, y: 3};
    if (east === 'l') return {x: 4, y: 3};
    if (north === 'l') return {x: 5, y: 3};

    return {x: 1, y: 0};
  }

  /**
   * Get sprite coordinates for deep-sea tiles (ocean/shore transitions).
   * Mirrors Orona retileDeepSea() rules.
   */
  static getDeepSeaTile(neighbors: (TerrainType | null)[]): TileCoord {
    const [N, NE, E, SE, S, SW, W, NW] = neighbors;
    const north = this.categorizeDeepSeaNeighbor(N);
    const northEast = this.categorizeDeepSeaNeighbor(NE);
    const east = this.categorizeDeepSeaNeighbor(E);
    const southEast = this.categorizeDeepSeaNeighbor(SE);
    const south = this.categorizeDeepSeaNeighbor(S);
    const southWest = this.categorizeDeepSeaNeighbor(SW);
    const west = this.categorizeDeepSeaNeighbor(W);
    const northWest = this.categorizeDeepSeaNeighbor(NW);

    if (northWest !== 'd' && north !== 'd' && west !== 'd' && east === 'd' && south === 'd') return {x: 10, y: 3};
    if (northEast !== 'd' && north !== 'd' && east !== 'd' && west === 'd' && south === 'd') return {x: 11, y: 3};
    if (southEast !== 'd' && south !== 'd' && east !== 'd' && west === 'd' && north === 'd') return {x: 13, y: 3};
    if (southWest !== 'd' && south !== 'd' && west !== 'd' && east === 'd' && north === 'd') return {x: 12, y: 3};

    if (west === 'w' && east === 'd') return {x: 14, y: 3};
    if (south === 'w' && north === 'd') return {x: 15, y: 3};
    if (north === 'w' && south === 'd') return {x: 16, y: 3};
    if (east === 'w' && west === 'd') return {x: 17, y: 3};

    return {x: 0, y: 0};
  }

  /**
   * Get sprite coordinates for a directional boat tile.
   * Boats face the opposite direction from which the tank disembarked,
   * so the stern (back) is against the land for easy re-boarding.
   *
   * Direction ranges: 0=north, 64=east, 128=south, 192=west (0-255)
   * Sprite mappings (Orona base.png row 6, 0-indexed):
   * - (12, 6): boat facing north
   * - (10, 6): boat facing east
   * - (13, 6): boat facing south
   * - (11, 6): boat facing west
   *
   * @param direction The direction the boat is facing (0-255)
   * @returns Sprite coordinates for the directional boat
   */
  static getBoatTile(direction: number): TileCoord {
    if (direction >= 32 && direction < 96) {
      // Boat faces EAST (64 ± 32)
      return {x: 10, y: 6};
    } else if (direction >= 96 && direction < 160) {
      // Boat faces SOUTH (128 ± 32)
      return {x: 13, y: 6};
    } else if (direction >= 160 && direction < 224) {
      // Boat faces WEST (192 ± 32)
      return {x: 11, y: 6};
    } else {
      // Boat faces NORTH (0 ± 32 or 224-256)
      return {x: 12, y: 6};
    }
  }
}
