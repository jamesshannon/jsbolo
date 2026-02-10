/**
 * Unit tests for AutoTiler - neighbor-based sprite selection
 */

import {describe, it, expect} from 'vitest';
import {AutoTiler} from '../auto-tiler.js';
import {TerrainType} from '@shared';

describe('AutoTiler - Forest Tiling', () => {
  it('should return dense forest tile when fully surrounded', () => {
    // All cardinal directions are forest
    const neighbors = [
      TerrainType.FOREST, null, TerrainType.FOREST, null,
      TerrainType.FOREST, null, TerrainType.FOREST, null
    ]; // N, NE, E, SE, S, SW, W, NW
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 8, y: 9});
  });

  it('should return corner tile when two adjacent cardinal directions are open', () => {
    // Test one corner case to verify the logic works
    // !north && !east && south && west => NE corner
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.GRASS, null,
      TerrainType.FOREST, null, TerrainType.FOREST, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 10, y: 9}); // NE corner
  });

  it('should return vertical strip when N+S surrounded, E+W open', () => {
    const neighbors = [
      TerrainType.FOREST, null, TerrainType.GRASS, null,
      TerrainType.FOREST, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 14, y: 9});
  });

  it('should return horizontal strip when E+W surrounded, N+S open', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.FOREST, null,
      TerrainType.GRASS, null, TerrainType.FOREST, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 15, y: 9});
  });

  it('should return north edge open when only north is grass', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.FOREST, null,
      TerrainType.FOREST, null, TerrainType.FOREST, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 13, y: 9});
  });

  it('should return default dense forest for isolated tile', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.GRASS, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    expect(tile).toEqual({x: 3, y: 1});
  });

  it('should ignore diagonal neighbors and only use cardinals', () => {
    // All diagonals are forest, but cardinals are grass
    const neighbors = [
      TerrainType.GRASS, TerrainType.FOREST, TerrainType.GRASS, TerrainType.FOREST,
      TerrainType.GRASS, TerrainType.FOREST, TerrainType.GRASS, TerrainType.FOREST
    ];
    const tile = AutoTiler.getForestTile(neighbors);
    // Should treat as isolated since only cardinals matter
    expect(tile).toEqual({x: 3, y: 1});
  });
});

describe('AutoTiler - Road Tiling', () => {
  it('should return 4-way intersection when all directions are roads', () => {
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.ROAD, null,
      TerrainType.ROAD, null, TerrainType.ROAD, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 10, y: 0});
  });

  it('should return T-junction pointing down when N is not road', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.ROAD, null,
      TerrainType.ROAD, null, TerrainType.ROAD, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 12, y: 0});
  });

  it('should return T-junction pointing left when E is not road', () => {
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.GRASS, null,
      TerrainType.ROAD, null, TerrainType.ROAD, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 13, y: 0});
  });

  it('should return T-junction pointing up when S is not road', () => {
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.ROAD, null,
      TerrainType.GRASS, null, TerrainType.ROAD, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 14, y: 0});
  });

  it('should return T-junction pointing right when W is not road', () => {
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.ROAD, null,
      TerrainType.ROAD, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 15, y: 0});
  });

  it('should return NE corner when N+E are roads', () => {
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.ROAD, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 6, y: 0});
  });

  it('should return SE corner when S+E are roads', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.ROAD, null,
      TerrainType.ROAD, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 7, y: 0});
  });

  it('should return SW corner when S+W are roads', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.GRASS, null,
      TerrainType.ROAD, null, TerrainType.ROAD, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 8, y: 0});
  });

  it('should return NW corner when N+W are roads', () => {
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.GRASS, null,
      TerrainType.GRASS, null, TerrainType.ROAD, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 9, y: 0});
  });

  it('should return horizontal road when E+W are roads', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.ROAD, null,
      TerrainType.GRASS, null, TerrainType.ROAD, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 0, y: 0});
  });

  it('should return vertical road when N+S are roads', () => {
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.GRASS, null,
      TerrainType.ROAD, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 1, y: 0});
  });

  it('should return dead end pointing north when only N is road', () => {
    const neighbors = [
      TerrainType.ROAD, null, TerrainType.GRASS, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 2, y: 0});
  });

  it('should return dead end pointing east when only E is road', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.ROAD, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 3, y: 0});
  });

  it('should return dead end pointing south when only S is road', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.GRASS, null,
      TerrainType.ROAD, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 4, y: 0});
  });

  it('should return dead end pointing west when only W is road', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.GRASS, null,
      TerrainType.GRASS, null, TerrainType.ROAD, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 5, y: 0});
  });

  it('should return horizontal segment for isolated road', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.GRASS, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    expect(tile).toEqual({x: 0, y: 0});
  });

  it('should handle null (out-of-bounds) neighbors as land', () => {
    // North is out of bounds (null)
    const neighbors = [
      null, null, TerrainType.ROAD, null,
      TerrainType.ROAD, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    // Should be SE corner (E+S are roads)
    expect(tile).toEqual({x: 7, y: 0});
  });

  it('should treat water neighbors differently (not as roads)', () => {
    // All directions have water, not roads
    const neighbors = [
      TerrainType.RIVER, null, TerrainType.DEEP_SEA, null,
      TerrainType.BOAT, null, TerrainType.RIVER, null
    ];
    const tile = AutoTiler.getRoadTile(neighbors);
    // Should be isolated road (water is not road)
    expect(tile).toEqual({x: 0, y: 0});
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
