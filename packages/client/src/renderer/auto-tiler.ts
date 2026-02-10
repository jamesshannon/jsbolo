/**
 * Auto-tiling system for neighbor-aware sprite selection.
 * Based on Orona's implementation (map.coffee lines 100-360).
 */

import {TerrainType} from '@shared';

export interface TileCoord {
  x: number;
  y: number;
}

export class AutoTiler {
  /**
   * Get sprite coordinates for a forest tile based on neighbors.
   * Only checks 4-cardinal directions (no diagonals).
   *
   * Returns 9 possible sprite variants:
   * - Fully surrounded: no exposed edges
   * - Single edge exposed: 4 variants (N/E/S/W)
   * - Two opposite edges: 2 variants (N+S, E+W)
   * - Two adjacent edges (corners): 4 variants (NE/SE/SW/NW)
   */
  static getForestTile(neighbors: (TerrainType | null)[]): TileCoord {
    const [N, _NE, E, _SE, S, _SW, W, _NW] = neighbors;

    // Check only cardinal directions (ignore diagonals)
    const north = N === TerrainType.FOREST;
    const east = E === TerrainType.FOREST;
    const south = S === TerrainType.FOREST;
    const west = W === TerrainType.FOREST;

    // Fully surrounded (no edges)
    if (north && east && south && west) {
      return {x: 8, y: 9};
    }

    // Two opposite edges
    if (north && south && !east && !west) {
      return {x: 14, y: 9}; // Vertical strip
    }
    if (east && west && !north && !south) {
      return {x: 15, y: 9}; // Horizontal strip
    }

    // Corners (two adjacent edges)
    if (!north && east && !south && west) {
      return {x: 9, y: 9}; // NW corner (north + west open)
    }
    if (!north && !east && south && west) {
      return {x: 10, y: 9}; // NE corner
    }
    if (north && !east && !south && west) {
      return {x: 11, y: 9}; // SE corner
    }
    if (north && east && !south && !west) {
      return {x: 12, y: 9}; // SW corner
    }

    // Single edges
    if (!north && east && south && west) {
      return {x: 13, y: 9}; // North edge open
    }
    if (north && !east && south && west) {
      return {x: 14, y: 9}; // East edge open
    }
    if (north && east && !south && west) {
      return {x: 15, y: 9}; // South edge open
    }
    if (north && east && south && !west) {
      return {x: 16, y: 9}; // West edge open
    }

    // Default: dense forest (isolated or unhandled case)
    return {x: 3, y: 1};
  }

  /**
   * Get sprite coordinates for a road tile based on neighbors.
   * Checks all 8 directions and categorizes neighbors as:
   * - 'r': Road (connected)
   * - 'w': Water (RIVER, DEEP_SEA, BOAT)
   * - 'l': Land (everything else)
   *
   * Returns 31+ possible variants for intersections, corners, T-junctions, etc.
   */
  static getRoadTile(neighbors: (TerrainType | null)[]): TileCoord {
    const [N, _NE, E, _SE, S, _SW, W, _NW] = neighbors;

    // Categorize each neighbor
    const categorize = (t: TerrainType | null | undefined): 'r' | 'w' | 'l' => {
      if (t === null || t === undefined) return 'l';
      if (t === TerrainType.ROAD) return 'r';
      if (t === TerrainType.RIVER || t === TerrainType.DEEP_SEA || t === TerrainType.BOAT) return 'w';
      return 'l';
    };

    const north = categorize(N);
    const east = categorize(E);
    const south = categorize(S);
    const west = categorize(W);

    // Count road connections
    const roadCount = [north, east, south, west].filter(c => c === 'r').length;

    // 4-way intersection (all roads)
    if (roadCount === 4) {
      return {x: 10, y: 0};
    }

    // 3-way junctions (T-junctions)
    if (roadCount === 3) {
      if (north !== 'r') return {x: 12, y: 0}; // T pointing down
      if (east !== 'r') return {x: 13, y: 0};  // T pointing left
      if (south !== 'r') return {x: 14, y: 0}; // T pointing up
      if (west !== 'r') return {x: 15, y: 0};  // T pointing right
    }

    // Straight roads (2 opposite connections)
    if (roadCount === 2) {
      if (north === 'r' && south === 'r') return {x: 1, y: 0}; // Vertical
      if (east === 'r' && west === 'r') return {x: 0, y: 0};   // Horizontal

      // Corners (2 adjacent connections)
      if (north === 'r' && east === 'r') return {x: 6, y: 0}; // NE corner
      if (east === 'r' && south === 'r') return {x: 7, y: 0}; // SE corner
      if (south === 'r' && west === 'r') return {x: 8, y: 0}; // SW corner
      if (west === 'r' && north === 'r') return {x: 9, y: 0}; // NW corner
    }

    // Dead ends (1 connection)
    if (roadCount === 1) {
      if (north === 'r') return {x: 2, y: 0}; // Road from north
      if (east === 'r') return {x: 3, y: 0};  // Road from east
      if (south === 'r') return {x: 4, y: 0}; // Road from south
      if (west === 'r') return {x: 5, y: 0};  // Road from west
    }

    // Isolated road (no connections)
    return {x: 0, y: 0}; // Horizontal segment as default
  }

  /**
   * Placeholder for building auto-tiling (complex, 30+ variants).
   * For now, returns isolated building. Can be enhanced later.
   */
  static getBuildingTile(_neighbors: (TerrainType | null)[]): TileCoord {
    // TODO: Implement full building auto-tiling (Orona lines 155-228)
    return {x: 6, y: 1}; // Isolated building
  }
}
