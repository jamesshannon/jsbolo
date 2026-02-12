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
  it('should return isolated building when no adjacent walls', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.GRASS, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getBuildingTile(neighbors);
    expect(tile).toEqual({x: 6, y: 1});
  });

  it('should return dense interior tile when surrounded by buildings', () => {
    const neighbors = [
      TerrainType.BUILDING, null, TerrainType.BUILDING, null,
      TerrainType.BUILDING, null, TerrainType.BUILDING, null
    ];
    const tile = AutoTiler.getBuildingTile(neighbors);
    expect(tile).toEqual({x: 30, y: 1});
  });

  it('should return horizontal segment when west and east are connected', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.BUILDING, null,
      TerrainType.GRASS, null, TerrainType.BUILDING, null
    ];
    const tile = AutoTiler.getBuildingTile(neighbors);
    expect(tile).toEqual({x: 11, y: 1});
  });

  it('should treat shot-building neighbors as connected', () => {
    const neighbors = [
      TerrainType.SHOT_BUILDING, null, TerrainType.GRASS, null,
      TerrainType.SHOT_BUILDING, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getBuildingTile(neighbors);
    expect(tile).toEqual({x: 12, y: 1});
  });
});

describe('AutoTiler - Shoreline Tiling', () => {
  it('should select deep-sea corner when NW opens to land', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.DEEP_SEA, null,
      TerrainType.DEEP_SEA, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getDeepSeaTile(neighbors);
    expect(tile).toEqual({x: 10, y: 3});
  });

  it('should select deep-sea river edge when west is river and east is sea', () => {
    const neighbors = [
      TerrainType.DEEP_SEA, null, TerrainType.DEEP_SEA, null,
      TerrainType.DEEP_SEA, null, TerrainType.RIVER, null
    ];
    const tile = AutoTiler.getDeepSeaTile(neighbors);
    expect(tile).toEqual({x: 14, y: 3});
  });

  it('should select river-lake tile when surrounded by land', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.GRASS, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRiverTile(neighbors);
    expect(tile).toEqual({x: 30, y: 2});
  });

  it('should select vertical river channel when north and south are land', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.RIVER, null,
      TerrainType.GRASS, null, TerrainType.RIVER, null
    ];
    const tile = AutoTiler.getRiverTile(neighbors);
    expect(tile).toEqual({x: 0, y: 3});
  });

  it('should select horizontal river channel when west and east are land', () => {
    const neighbors = [
      TerrainType.RIVER, null, TerrainType.GRASS, null,
      TerrainType.RIVER, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getRiverTile(neighbors);
    expect(tile).toEqual({x: 1, y: 3});
  });

  it('should select river edge opening north when only north is land', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.RIVER, null,
      TerrainType.RIVER, null, TerrainType.RIVER, null
    ];
    const tile = AutoTiler.getRiverTile(neighbors);
    expect(tile).toEqual({x: 5, y: 3});
  });

  it('should select deep-sea corner when north-east opens to land', () => {
    const neighbors = [
      TerrainType.GRASS, null, TerrainType.GRASS, null,
      TerrainType.DEEP_SEA, null, TerrainType.DEEP_SEA, null
    ];
    const tile = AutoTiler.getDeepSeaTile(neighbors);
    expect(tile).toEqual({x: 11, y: 3});
  });

  it('should select deep-sea corner when south-east opens to land', () => {
    const neighbors = [
      TerrainType.DEEP_SEA, null, TerrainType.GRASS, null,
      TerrainType.GRASS, null, TerrainType.DEEP_SEA, null
    ];
    const tile = AutoTiler.getDeepSeaTile(neighbors);
    expect(tile).toEqual({x: 13, y: 3});
  });

  it('should select deep-sea corner when south-west opens to land', () => {
    const neighbors = [
      TerrainType.DEEP_SEA, null, TerrainType.DEEP_SEA, null,
      TerrainType.GRASS, null, TerrainType.GRASS, null
    ];
    const tile = AutoTiler.getDeepSeaTile(neighbors);
    expect(tile).toEqual({x: 12, y: 3});
  });

  it('should select default deep-sea tile when fully surrounded by deep-sea', () => {
    const neighbors = [
      TerrainType.DEEP_SEA, TerrainType.DEEP_SEA, TerrainType.DEEP_SEA, TerrainType.DEEP_SEA,
      TerrainType.DEEP_SEA, TerrainType.DEEP_SEA, TerrainType.DEEP_SEA, TerrainType.DEEP_SEA
    ];
    const tile = AutoTiler.getDeepSeaTile(neighbors);
    expect(tile).toEqual({x: 0, y: 0});
  });
});

describe('AutoTiler - Boat Direction', () => {
  describe('getBoatTile - Cardinal Directions', () => {
    it('should return sprite (12, 6) for boat facing north (direction 0)', () => {
      const tile = AutoTiler.getBoatTile(0);
      expect(tile).toEqual({x: 12, y: 6});
    });

    it('should return sprite (10, 6) for boat facing east (direction 64)', () => {
      const tile = AutoTiler.getBoatTile(64);
      expect(tile).toEqual({x: 10, y: 6});
    });

    it('should return sprite (13, 6) for boat facing south (direction 128)', () => {
      const tile = AutoTiler.getBoatTile(128);
      expect(tile).toEqual({x: 13, y: 6});
    });

    it('should return sprite (11, 6) for boat facing west (direction 192)', () => {
      const tile = AutoTiler.getBoatTile(192);
      expect(tile).toEqual({x: 11, y: 6});
    });
  });

  describe('getBoatTile - Boundary Cases', () => {
    it('should return sprite (12, 6) for boat facing north (direction 16)', () => {
      const tile = AutoTiler.getBoatTile(16);
      expect(tile).toEqual({x: 12, y: 6});
    });

    it('should return sprite (12, 6) for boat facing north (direction 31 - just before east)', () => {
      const tile = AutoTiler.getBoatTile(31);
      expect(tile).toEqual({x: 12, y: 6});
    });

    it('should return sprite (10, 6) for boat facing east (direction 32 - start of east range)', () => {
      const tile = AutoTiler.getBoatTile(32);
      expect(tile).toEqual({x: 10, y: 6});
    });

    it('should return sprite (10, 6) for boat facing east (direction 95 - end of east range)', () => {
      const tile = AutoTiler.getBoatTile(95);
      expect(tile).toEqual({x: 10, y: 6});
    });

    it('should return sprite (13, 6) for boat facing south (direction 96 - start of south range)', () => {
      const tile = AutoTiler.getBoatTile(96);
      expect(tile).toEqual({x: 13, y: 6});
    });

    it('should return sprite (13, 6) for boat facing south (direction 159 - end of south range)', () => {
      const tile = AutoTiler.getBoatTile(159);
      expect(tile).toEqual({x: 13, y: 6});
    });

    it('should return sprite (11, 6) for boat facing west (direction 160 - start of west range)', () => {
      const tile = AutoTiler.getBoatTile(160);
      expect(tile).toEqual({x: 11, y: 6});
    });

    it('should return sprite (11, 6) for boat facing west (direction 223 - end of west range)', () => {
      const tile = AutoTiler.getBoatTile(223);
      expect(tile).toEqual({x: 11, y: 6});
    });

    it('should return sprite (12, 6) for boat facing north (direction 224 - wraps to north)', () => {
      const tile = AutoTiler.getBoatTile(224);
      expect(tile).toEqual({x: 12, y: 6});
    });

    it('should return sprite (12, 6) for boat facing north (direction 240)', () => {
      const tile = AutoTiler.getBoatTile(240);
      expect(tile).toEqual({x: 12, y: 6});
    });

    it('should return sprite (12, 6) for boat facing north (direction 255 - max value)', () => {
      const tile = AutoTiler.getBoatTile(255);
      expect(tile).toEqual({x: 12, y: 6});
    });
  });

  describe('getBoatTile - Integration with Tank Disembark', () => {
    it('should handle tank disembarking south (tank dir 128 → boat dir 0 → boat faces north)', () => {
      // Tank moving south (128) hits land, boat faces opposite (north, 0)
      const boatDirection = (128 + 128) % 256; // = 0
      const tile = AutoTiler.getBoatTile(boatDirection);
      expect(tile).toEqual({x: 12, y: 6}); // North-facing boat
    });

    it('should handle tank disembarking west (tank dir 192 → boat dir 64 → boat faces east)', () => {
      // Tank moving west (192) hits land, boat faces opposite (east, 64)
      const boatDirection = (192 + 128) % 256; // = 64
      const tile = AutoTiler.getBoatTile(boatDirection);
      expect(tile).toEqual({x: 10, y: 6}); // East-facing boat
    });

    it('should handle tank disembarking north (tank dir 0 → boat dir 128 → boat faces south)', () => {
      // Tank moving north (0) hits land, boat faces opposite (south, 128)
      const boatDirection = (0 + 128) % 256; // = 128
      const tile = AutoTiler.getBoatTile(boatDirection);
      expect(tile).toEqual({x: 13, y: 6}); // South-facing boat
    });

    it('should handle tank disembarking east (tank dir 64 → boat dir 192 → boat faces west)', () => {
      // Tank moving east (64) hits land, boat faces opposite (west, 192)
      const boatDirection = (64 + 128) % 256; // = 192
      const tile = AutoTiler.getBoatTile(boatDirection);
      expect(tile).toEqual({x: 11, y: 6}); // West-facing boat
    });

    it('should handle tank disembarking northeast (tank dir 32 → boat dir 160 → boat faces west)', () => {
      // Tank moving northeast (32) hits land, boat faces southwest (160)
      const boatDirection = (32 + 128) % 256; // = 160
      const tile = AutoTiler.getBoatTile(boatDirection);
      expect(tile).toEqual({x: 11, y: 6}); // West-facing boat (160 is in west range)
    });

    it('should handle tank disembarking southeast (tank dir 96 → boat dir 224 → boat faces north)', () => {
      // Tank moving southeast (96) hits land, boat faces northwest (224)
      const boatDirection = (96 + 128) % 256; // = 224
      const tile = AutoTiler.getBoatTile(boatDirection);
      expect(tile).toEqual({x: 12, y: 6}); // North-facing boat (224 wraps to north)
    });

    it('should handle tank disembarking southwest (tank dir 160 → boat dir 32 → boat faces east)', () => {
      // Tank moving southwest (160) hits land, boat faces northeast (32)
      const boatDirection = (160 + 128) % 256; // = 32
      const tile = AutoTiler.getBoatTile(boatDirection);
      expect(tile).toEqual({x: 10, y: 6}); // East-facing boat (32 is start of east range)
    });

    it('should handle tank disembarking northwest (tank dir 224 → boat dir 96 → boat faces south)', () => {
      // Tank moving northwest (224) hits land, boat faces southeast (96)
      const boatDirection = (224 + 128) % 256; // = 96
      const tile = AutoTiler.getBoatTile(boatDirection);
      expect(tile).toEqual({x: 13, y: 6}); // South-facing boat (96 is start of south range)
    });
  });

  describe('getBoatTile - Direction Range Transitions', () => {
    it('should transition from north to east correctly', () => {
      const tile31 = AutoTiler.getBoatTile(31);
      const tile32 = AutoTiler.getBoatTile(32);
      expect(tile31).toEqual({x: 12, y: 6}); // North
      expect(tile32).toEqual({x: 10, y: 6}); // East
    });

    it('should transition from east to south correctly', () => {
      const tile95 = AutoTiler.getBoatTile(95);
      const tile96 = AutoTiler.getBoatTile(96);
      expect(tile95).toEqual({x: 10, y: 6}); // East
      expect(tile96).toEqual({x: 13, y: 6}); // South
    });

    it('should transition from south to west correctly', () => {
      const tile159 = AutoTiler.getBoatTile(159);
      const tile160 = AutoTiler.getBoatTile(160);
      expect(tile159).toEqual({x: 13, y: 6}); // South
      expect(tile160).toEqual({x: 11, y: 6}); // West
    });

    it('should transition from west to north correctly', () => {
      const tile223 = AutoTiler.getBoatTile(223);
      const tile224 = AutoTiler.getBoatTile(224);
      expect(tile223).toEqual({x: 11, y: 6}); // West
      expect(tile224).toEqual({x: 12, y: 6}); // North
    });
  });
});
