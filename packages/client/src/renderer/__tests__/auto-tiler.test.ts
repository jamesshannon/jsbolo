/**
 * Unit tests for AutoTiler - neighbor-based sprite selection
 * Coordinates verified against Orona map.coffee lines 100-360
 */

import {describe, it, expect} from 'vitest';
import {AutoTiler} from '../auto-tiler.js';
import {TerrainType} from '@shared';

describe('AutoTiler - Forest Tiling', () => {
  it('should return dense forest tile when fully surrounded (4 filled)', () => {
    // All cardinal directions are forest -> default case
    const neighbors = [
      TerrainType.FOREST, null, TerrainType.FOREST, null,
      TerrainType.FOREST, null, TerrainType.FOREST, null
    ]; // N, NE, E, SE, S, SW, W, NW
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 3, y: 1}); // Orona line 337
  });

  it('should return dense forest for vertical strip (N+S filled, E+W open)', () => {
    const neighbors = [
      TerrainType.FOREST, null, TerrainType.GRASS, null,
      TerrainType.FOREST, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 3, y: 1}); // 2 opposite filled -> default
  });

  it('should return dense forest for horizontal strip (E+W filled, N+S open)', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.FOREST, null,
      TerrainType.GRASS, null, TerrainType.FOREST, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 3, y: 1}); // 2 opposite filled -> default
  });

  it('should return dense forest when 3 directions filled', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.FOREST, null,
      TerrainType.FOREST, null, TerrainType.FOREST, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 3, y: 1}); // 3 filled -> default
  });

  it('should return isolated forest when no neighbors (0 filled)', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.GRASS, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 8, y: 9}); // Orona line 336
  });

  it('should return NW corner (NW quadrant open: E+S filled)', () => {
    // !N && !W && E && S (Orona line 328)
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.FOREST, null,
      TerrainType.FOREST, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 9, y: 9});
  });

  it('should return NE corner (NE quadrant open: W+S filled)', () => {
    // !N && W && !E && S (Orona line 329)
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.GRASS, null,
      TerrainType.FOREST, null, TerrainType.FOREST, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 10, y: 9});
  });

  it('should return SE corner (SE quadrant open: N+W filled)', () => {
    // N && W && !E && !S (Orona line 330)
    const neighbors = [
      TerrainType.FOREST, null, TerrainType.GRASS, null,
      TerrainType.GRASS, null, TerrainType.FOREST, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 11, y: 9});
  });

  it('should return SW corner (SW quadrant open: N+E filled)', () => {
    // N && !W && E && !S (Orona line 331)
    const neighbors = [
      TerrainType.FOREST, null, TerrainType.FOREST, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 12, y: 9});
  });

  it('should return edge tile when only north filled', () => {
    // N && !W && !E && !S (Orona line 332)
    const neighbors = [
      TerrainType.FOREST, null, TerrainType.GRASS, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 16, y: 9});
  });

  it('should return edge tile when only south filled', () => {
    // !N && !W && !E && S (Orona line 333)
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.GRASS, null,
      TerrainType.FOREST, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 15, y: 9});
  });

  it('should return edge tile when only west filled', () => {
    // !N && W && !E && !S (Orona line 334)
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.GRASS, null,
      TerrainType.GRASS, null, TerrainType.FOREST, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 14, y: 9});
  });

  it('should return edge tile when only east filled', () => {
    // !N && !W && E && !S (Orona line 335)
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.FOREST, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 13, y: 9});
  });

  it('should ignore diagonal neighbors and only use cardinals', () => {
    // All diagonals are forest, but cardinals are grass
    const neighbors = [
      TerrainType.GRASS, TerrainType.FOREST, TerrainType.GRASS, TerrainType.FOREST,
      TerrainType.GRASS, TerrainType.FOREST, TerrainType.GRASS, TerrainType.FOREST
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    // Should treat as isolated since only cardinals matter
    expect(tile).toEqual({x: 8, y: 9});
  });
});

describe('AutoTiler - Road Tiling', () => {
  it('should return 4-way intersection when all directions are roads (with diagonals)', () => {
    // When diagonals are also roads, we get general 4-way (10, 0)
    // When diagonals are NOT roads, we get special pattern (11, 0) - Orona line 280
    const neighbors = [
      TerrainType.ROAD, TerrainType.ROAD, TerrainType.ROAD, TerrainType.ROAD,
      TerrainType.ROAD, TerrainType.ROAD, TerrainType.ROAD, TerrainType.ROAD
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 10, y: 0}); // Orona line 282
  });

  it('should return special 4-way when cardinals are roads but diagonals are not', () => {
    // Special pattern: all 4 cardinals are roads, all 4 diagonals are NOT roads
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.ROAD, null,
      TerrainType.ROAD, null, TerrainType.ROAD, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 11, y: 0}); // Orona line 280
  });

  it('should return T-junction pointing up when E+W+S are roads (no N)', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.ROAD, null,
      TerrainType.ROAD, null, TerrainType.ROAD, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 12, y: 0}); // Orona line 301
  });

  it('should return T-junction pointing right when N+W+S are roads (no E)', () => {
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.GRASS, null,
      TerrainType.ROAD, null, TerrainType.ROAD, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 13, y: 0}); // Orona line 302
  });

  it('should return T-junction pointing down when N+E+W are roads (no S)', () => {
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.ROAD, null,
      TerrainType.GRASS, null, TerrainType.ROAD, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 14, y: 0}); // Orona line 303
  });

  it('should return T-junction pointing left when N+E+S are roads (no W)', () => {
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.ROAD, null,
      TerrainType.ROAD, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 15, y: 0}); // Orona line 304
  });

  it('should return SE corner when S+E are roads (no diagonal)', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.ROAD, null,
      TerrainType.ROAD, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 2, y: 0}); // Orona line 311
  });

  it('should return SW corner when S+W are roads (no diagonal)', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.GRASS, null,
      TerrainType.ROAD, null, TerrainType.ROAD, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 3, y: 0}); // Orona line 312
  });

  it('should return NW corner when N+W are roads (no diagonal)', () => {
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.GRASS, null,
      TerrainType.GRASS, null, TerrainType.ROAD, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 4, y: 0}); // Orona line 313
  });

  it('should return NE corner when N+E are roads (no diagonal)', () => {
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.ROAD, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 5, y: 0}); // Orona line 314
  });

  it('should return SE corner with diagonal when S+E+SE are roads', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.ROAD, TerrainType.ROAD,
      TerrainType.ROAD, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 6, y: 0}); // Orona line 306
  });

  it('should return horizontal road when E+W are roads', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.ROAD, null,
      TerrainType.GRASS, null, TerrainType.ROAD, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 0, y: 1}); // Orona line 316
  });

  it('should return vertical road when N+S are roads', () => {
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.GRASS, null,
      TerrainType.ROAD, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 1, y: 1}); // Orona line 317
  });

  it('should return horizontal road when only E is road', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.ROAD, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 0, y: 1}); // E or W -> horizontal
  });

  it('should return vertical road when only N is road', () => {
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.GRASS, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 1, y: 1}); // N or S -> vertical
  });

  it('should return isolated road (4-way) when no neighbors', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.GRASS, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 10, y: 0}); // Orona line 319
  });

  it('should handle null (out-of-bounds) neighbors as land', () => {
    // North is out of bounds (null), E+S are roads
    const neighbors = [
      null, null, TerrainType.ROAD, null,
      TerrainType.ROAD, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    // Should be SE corner (E+S are roads)
    expect(tile).toEqual({x: 2, y: 0});
  });

  it('should treat water neighbors differently (not as roads)', () => {
    // All directions have water, not roads
    const neighbors = [
      TerrainType.RIVER, null, TerrainType.DEEP_SEA, null,
      TerrainType.BOAT, null, TerrainType.RIVER, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    // Should be surrounded by water case
    expect(tile).toEqual({x: 26, y: 0}); // Orona line 283
  });

  it('should return water crossing when road crosses river vertically', () => {
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.RIVER, null,
      TerrainType.ROAD, null, TerrainType.RIVER, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    // N+S are roads (vertical road), E+W are water (horizontal river)
    // Road is vertical crossing horizontal river -> use (25, 0)
    expect(tile).toEqual({x: 25, y: 0}); // Orona line 290 (west + east are water)
  });

  it('should return water crossing when road crosses river horizontally', () => {
    const neighbors = [
      TerrainType.RIVER, null, TerrainType.ROAD, null,
      TerrainType.RIVER, null, TerrainType.ROAD, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    // E+W are roads (horizontal road), N+S are water (vertical river)
    // Road is horizontal crossing vertical river -> use (24, 0)
    expect(tile).toEqual({x: 24, y: 0}); // Orona line 289 (north + south are water)
  });
});

describe('AutoTiler - Building Tiling', () => {
  it('should return isolated building (placeholder implementation)', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.GRASS, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getBuildingTile(neighbors);
    expect(tile).toEqual({x: 6, y: 1});
  });

  it('should return isolated building even when surrounded by buildings', () => {
    const neighbors = [
      TerrainType.BUILDING, null, TerrainType.BUILDING, null,
      TerrainType.BUILDING, null, TerrainType.BUILDING, null
    ];
    const tile = AutoTiler.getBuildingTile(neighbors);
    // TODO: This should return a different tile once full building auto-tiling is implemented
    expect(tile).toEqual({x: 6, y: 1});
  });
});
