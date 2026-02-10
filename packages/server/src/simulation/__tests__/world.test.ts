/**
 * World terrain tests
 *
 * These tests prevent regressions in:
 * - Building health being wrong
 * - Explosion damage on grass/roads
 * - Terrain degradation (building -> shot building -> rubble)
 * - Multi-point terrain sampling
 * - Boat terrain behavior
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ServerWorld } from '../world.js';
import { TerrainType, getTerrainInitialLife } from '@jsbolo/shared';

describe('World Terrain', () => {
  let world: ServerWorld;

  beforeEach(() => {
    // Create world without loading a map (uses procedural generation)
    world = new ServerWorld();
  });

  // Helper to set terrain with proper life initialization
  const setTerrain = (x: number, y: number, terrain: TerrainType) => {
    world.setTerrainAt(x, y, terrain);
    const cell = world.getMapData()[y]![x]!;
    cell.terrainLife = getTerrainInitialLife(terrain);
  };

  describe('Terrain Damage from Direct Hits', () => {
    it('should damage building with direct hit (1 hit to degrade)', () => {
      // Manually set a building at tile (10, 10)
      world.setTerrainAt(10, 10, TerrainType.BUILDING);
      const cell = world.getMapData()[10]![10]!;
      // Manually set terrain life since setTerrainAt doesn't initialize it
      cell.terrainLife = 1;

      expect(cell.terrain).toBe(TerrainType.BUILDING);
      expect(cell.terrainLife).toBe(1); // Buildings should have 1 life

      // Hit the building
      const destroyed = world.damageTerrainFromCollision(10, 10);

      // Building should become SHOT_BUILDING after 1 hit
      expect(destroyed).toBe(true);
      expect(cell.terrain).toBe(TerrainType.SHOT_BUILDING);
    });

    it('should degrade shot building to rubble (2 hits)', () => {
      world.setTerrainAt(10, 10, TerrainType.SHOT_BUILDING);
      const cell = world.getMapData()[10]![10]!;

      expect(cell.terrainLife).toBe(2); // Shot buildings have 2 life

      // First hit - life decreases
      let destroyed = world.damageTerrainFromCollision(10, 10);
      expect(destroyed).toBe(false);
      expect(cell.terrainLife).toBe(1);
      expect(cell.terrain).toBe(TerrainType.SHOT_BUILDING);

      // Second hit - degrades to rubble
      destroyed = world.damageTerrainFromCollision(10, 10);
      expect(destroyed).toBe(true);
      expect(cell.terrain).toBe(TerrainType.RUBBLE);
    });

    it('should degrade rubble to crater (2 hits)', () => {
      world.setTerrainAt(10, 10, TerrainType.RUBBLE);
      const cell = world.getMapData()[10]![10]!;

      expect(cell.terrainLife).toBe(2);

      // Hit rubble twice
      world.damageTerrainFromCollision(10, 10);
      expect(cell.terrainLife).toBe(1);

      const destroyed = world.damageTerrainFromCollision(10, 10);
      expect(destroyed).toBe(true);
      expect(cell.terrain).toBe(TerrainType.CRATER);
    });

    it('should destroy forest in 1 hit', () => {
      world.setTerrainAt(10, 10, TerrainType.FOREST);
      const cell = world.getMapData()[10]![10]!;

      expect(cell.terrainLife).toBe(1);

      const destroyed = world.damageTerrainFromCollision(10, 10);
      expect(destroyed).toBe(true);
      expect(cell.terrain).toBe(TerrainType.GRASS);
    });
  });

  describe('Terrain Damage from Explosions', () => {
    it('should turn grass into crater from explosion', () => {
      world.setTerrainAt(10, 10, TerrainType.GRASS);
      world.damageTerrainFromExplosion(10, 10);

      const terrain = world.getTerrainAt(10, 10);
      expect(terrain).toBe(TerrainType.CRATER);
    });

    it('should NOT damage roads from explosions', () => {
      world.setTerrainAt(10, 10, TerrainType.ROAD);
      world.damageTerrainFromExplosion(10, 10);

      const terrain = world.getTerrainAt(10, 10);
      expect(terrain).toBe(TerrainType.ROAD); // Roads are not damaged by explosions in Bolo
    });

    it('should turn building into rubble from explosion (not crater)', () => {
      world.setTerrainAt(10, 10, TerrainType.BUILDING);
      world.damageTerrainFromExplosion(10, 10);

      const terrain = world.getTerrainAt(10, 10);
      expect(terrain).toBe(TerrainType.RUBBLE); // Buildings become rubble, not crater
    });

    it('should turn forest into crater from explosion', () => {
      world.setTerrainAt(10, 10, TerrainType.FOREST);
      world.damageTerrainFromExplosion(10, 10);

      const terrain = world.getTerrainAt(10, 10);
      expect(terrain).toBe(TerrainType.CRATER);
    });

    it('should turn boat into river from explosion', () => {
      world.setTerrainAt(10, 10, TerrainType.BOAT);
      world.damageTerrainFromExplosion(10, 10);

      const terrain = world.getTerrainAt(10, 10);
      expect(terrain).toBe(TerrainType.RIVER);
    });

    it('should not affect water from explosion', () => {
      world.setTerrainAt(10, 10, TerrainType.RIVER);
      world.damageTerrainFromExplosion(10, 10);

      const terrain = world.getTerrainAt(10, 10);
      expect(terrain).toBe(TerrainType.RIVER); // Water unaffected

      world.setTerrainAt(10, 10, TerrainType.DEEP_SEA);
      world.damageTerrainFromExplosion(10, 10);
      expect(world.getTerrainAt(10, 10)).toBe(TerrainType.DEEP_SEA);
    });
  });

  describe('Terrain Passability', () => {
    it('should block buildings', () => {
      expect(world.isPassable(10, 10)).toBe(true); // Initially passable

      world.setTerrainAt(10, 10, TerrainType.BUILDING);
      expect(world.isPassable(10, 10)).toBe(false);

      world.setTerrainAt(10, 10, TerrainType.SHOT_BUILDING);
      expect(world.isPassable(10, 10)).toBe(false);
    });

    it('should allow roads, grass, water, etc.', () => {
      world.setTerrainAt(10, 10, TerrainType.ROAD);
      expect(world.isPassable(10, 10)).toBe(true);

      world.setTerrainAt(10, 10, TerrainType.GRASS);
      expect(world.isPassable(10, 10)).toBe(true);

      world.setTerrainAt(10, 10, TerrainType.RIVER);
      expect(world.isPassable(10, 10)).toBe(true);

      world.setTerrainAt(10, 10, TerrainType.DEEP_SEA);
      expect(world.isPassable(10, 10)).toBe(true);

      world.setTerrainAt(10, 10, TerrainType.SWAMP);
      expect(world.isPassable(10, 10)).toBe(true);
    });

    it('should return false for out of bounds', () => {
      expect(world.isPassable(-1, 10)).toBe(false);
      expect(world.isPassable(10, -1)).toBe(false);
      expect(world.isPassable(1000, 10)).toBe(false);
      expect(world.isPassable(10, 1000)).toBe(false);
    });
  });

  describe('Shell Terrain Collision', () => {
    it('should detect collision with buildings', () => {
      world.setTerrainAt(10, 10, TerrainType.BUILDING);
      expect(world.checkShellTerrainCollision(10, 10)).toBe(true);
    });

    it('should detect collision with forest', () => {
      world.setTerrainAt(10, 10, TerrainType.FOREST);
      expect(world.checkShellTerrainCollision(10, 10)).toBe(true);
    });

    it('should not detect collision with grass', () => {
      world.setTerrainAt(10, 10, TerrainType.GRASS);
      expect(world.checkShellTerrainCollision(10, 10)).toBe(false);
    });

    it('should not detect collision with roads', () => {
      world.setTerrainAt(10, 10, TerrainType.ROAD);
      expect(world.checkShellTerrainCollision(10, 10)).toBe(false);
    });

    it('should not detect collision with water', () => {
      world.setTerrainAt(10, 10, TerrainType.RIVER);
      expect(world.checkShellTerrainCollision(10, 10)).toBe(false);

      world.setTerrainAt(10, 10, TerrainType.DEEP_SEA);
      expect(world.checkShellTerrainCollision(10, 10)).toBe(false);
    });
  });

  describe('Multi-Point Terrain Sampling', () => {
    it('should return slowest terrain speed from sampled points', () => {
      // Set up a scenario: tank at edge of grass (1.0 speed) and swamp (0.25 speed)
      // Tank center at world position (2560, 2560) = tile (10, 10)
      // Multi-point sampling will check tiles: (10,10), (9,9), (10,9), (9,10), (10,10)

      // Set all tiles that will be sampled to grass (except one corner)
      world.setTerrainAt(10, 10, TerrainType.GRASS);
      world.setTerrainAt(10, 9, TerrainType.GRASS);
      world.setTerrainAt(9, 10, TerrainType.GRASS);

      // Set tile (9, 9) to swamp (tank's corner will sample this)
      world.setTerrainAt(9, 9, TerrainType.SWAMP);

      const speed = world.getTankSpeedAtPosition(2560, 2560);

      // Should return slowest terrain (swamp = 0.25)
      expect(speed).toBe(0.25);
    });

    it('should sample 5 points correctly', () => {
      // Center at (2560, 2560) = tile (10, 10)
      // Multi-point sampling checks: (10,10), (9,9), (10,9), (9,10), (10,10)
      // Set all tiles that will be sampled to grass
      world.setTerrainAt(10, 10, TerrainType.GRASS);
      world.setTerrainAt(9, 9, TerrainType.GRASS);
      world.setTerrainAt(10, 9, TerrainType.GRASS);
      world.setTerrainAt(9, 10, TerrainType.GRASS);

      const speed = world.getTankSpeedAtPosition(2560, 2560);

      // All grass, so should get grass speed (0.75)
      expect(speed).toBe(0.75);
    });

    it('should prevent getting stuck by sampling ahead', () => {
      // Tank near edge of grass, about to enter swamp
      // This simulates the boat bug where tank samples DEEP_SEA ahead

      // Current tile is grass
      world.setTerrainAt(10, 10, TerrainType.GRASS);

      // Next tile is deep sea (speed 0)
      world.setTerrainAt(11, 10, TerrainType.DEEP_SEA);

      // Tank at edge of tile, corner samples ahead
      const edgePosition = 2560 + 128; // Near edge of tile
      const speed = world.getTankSpeedAtPosition(edgePosition, 2560);

      // Should detect the DEEP_SEA ahead and return 0
      // This is what caused the boat bug!
      expect(speed).toBe(0);
    });
  });

  describe('Mine Explosions', () => {
    it('should damage multiple tiles in radius', () => {
      // Set center and surrounding tiles to grass
      for (let y = 9; y <= 11; y++) {
        for (let x = 9; x <= 11; x++) {
          world.setTerrainAt(x, y, TerrainType.GRASS);
        }
      }

      // Create mine explosion at (10, 10) with radius 1
      const affectedTiles = world.createMineExplosion(10, 10, 1);

      // Should affect 9 tiles (3x3 grid)
      expect(affectedTiles.length).toBe(9);

      // All should be craters now
      for (let y = 9; y <= 11; y++) {
        for (let x = 9; x <= 11; x++) {
          expect(world.getTerrainAt(x, y)).toBe(TerrainType.CRATER);
        }
      }
    });
  });

  describe('Boat Mechanics', () => {
    it('should place boat terrain when spawning in water', () => {
      world.setTerrainAt(10, 10, TerrainType.DEEP_SEA);

      // Simulate placing boat
      world.setTerrainAt(10, 10, TerrainType.BOAT);

      expect(world.getTerrainAt(10, 10)).toBe(TerrainType.BOAT);
    });

    it('should allow boat to be placed on river', () => {
      world.setTerrainAt(10, 10, TerrainType.RIVER);
      world.setTerrainAt(10, 10, TerrainType.BOAT);

      expect(world.getTerrainAt(10, 10)).toBe(TerrainType.BOAT);
    });
  });
});
