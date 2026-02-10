/**
 * Unit tests for World neighbor query methods
 */

import {describe, it, expect, beforeEach} from 'vitest';
import {World} from '../world.js';
import {TerrainType, MAP_SIZE_TILES} from '@shared';

describe('World Neighbor Queries', () => {
  let world: World;

  beforeEach(() => {
    world = new World();
  });

  describe('getNeighbors', () => {
    it('should return 8 neighbors in correct order [N, NE, E, SE, S, SW, W, NW]', () => {
      // Pick a tile in the middle of the map where we know the pattern
      const tileX = 128;
      const tileY = 128;

      const neighbors = world.getNeighbors(tileX, tileY);

      // Should have exactly 8 neighbors
      expect(neighbors).toHaveLength(8);

      // Verify the order by checking known positions
      // North should be the terrain one tile up
      expect(neighbors[0]).toBe(world.getTerrainAt(tileX, tileY - 1));
      // Northeast
      expect(neighbors[1]).toBe(world.getTerrainAt(tileX + 1, tileY - 1));
      // East
      expect(neighbors[2]).toBe(world.getTerrainAt(tileX + 1, tileY));
      // Southeast
      expect(neighbors[3]).toBe(world.getTerrainAt(tileX + 1, tileY + 1));
      // South
      expect(neighbors[4]).toBe(world.getTerrainAt(tileX, tileY + 1));
      // Southwest
      expect(neighbors[5]).toBe(world.getTerrainAt(tileX - 1, tileY + 1));
      // West
      expect(neighbors[6]).toBe(world.getTerrainAt(tileX - 1, tileY));
      // Northwest
      expect(neighbors[7]).toBe(world.getTerrainAt(tileX - 1, tileY - 1));
    });

    it('should return null for out-of-bounds neighbors at top-left corner', () => {
      const neighbors = world.getNeighbors(0, 0);

      // Top-left corner has 3 out-of-bounds neighbors: N, NE, NW, W
      expect(neighbors[0]).toBeNull(); // North
      expect(neighbors[1]).toBeNull(); // Northeast
      expect(neighbors[7]).toBeNull(); // Northwest
      expect(neighbors[6]).toBeNull(); // West

      // East, Southeast, South should be valid
      expect(neighbors[2]).not.toBeNull(); // East
      expect(neighbors[3]).not.toBeNull(); // Southeast
      expect(neighbors[4]).not.toBeNull(); // South
    });

    it('should return null for out-of-bounds neighbors at bottom-right corner', () => {
      const maxX = MAP_SIZE_TILES - 1;
      const maxY = MAP_SIZE_TILES - 1;
      const neighbors = world.getNeighbors(maxX, maxY);

      // Bottom-right corner has 3 out-of-bounds neighbors: E, SE, S
      expect(neighbors[2]).toBeNull(); // East
      expect(neighbors[3]).toBeNull(); // Southeast
      expect(neighbors[4]).toBeNull(); // South
      expect(neighbors[5]).toBeNull(); // Southwest

      // North, Northwest, West should be valid
      expect(neighbors[0]).not.toBeNull(); // North
      expect(neighbors[7]).not.toBeNull(); // Northwest
      expect(neighbors[6]).not.toBeNull(); // West
    });

    it('should return null for out-of-bounds neighbors at top edge', () => {
      const neighbors = world.getNeighbors(128, 0);

      // Top edge has 3 out-of-bounds neighbors: N, NE, NW
      expect(neighbors[0]).toBeNull(); // North
      expect(neighbors[1]).toBeNull(); // Northeast
      expect(neighbors[7]).toBeNull(); // Northwest

      // All other directions should be valid
      expect(neighbors[2]).not.toBeNull(); // East
      expect(neighbors[3]).not.toBeNull(); // Southeast
      expect(neighbors[4]).not.toBeNull(); // South
      expect(neighbors[5]).not.toBeNull(); // Southwest
      expect(neighbors[6]).not.toBeNull(); // West
    });

    it('should handle middle of map with no out-of-bounds neighbors', () => {
      const neighbors = world.getNeighbors(128, 128);

      // All neighbors should be valid (no nulls)
      neighbors.forEach((neighbor) => {
        expect(neighbor).not.toBeNull();
        expect(Object.values(TerrainType)).toContain(neighbor);
      });
    });
  });

  describe('getCardinalNeighbors', () => {
    it('should return 4 cardinal neighbors [N, E, S, W]', () => {
      const tileX = 128;
      const tileY = 128;

      const cardinalNeighbors = world.getCardinalNeighbors(tileX, tileY);

      // Should have exactly 4 neighbors
      expect(cardinalNeighbors).toHaveLength(4);

      // Verify the order
      expect(cardinalNeighbors[0]).toBe(world.getTerrainAt(tileX, tileY - 1)); // North
      expect(cardinalNeighbors[1]).toBe(world.getTerrainAt(tileX + 1, tileY)); // East
      expect(cardinalNeighbors[2]).toBe(world.getTerrainAt(tileX, tileY + 1)); // South
      expect(cardinalNeighbors[3]).toBe(world.getTerrainAt(tileX - 1, tileY)); // West
    });

    it('should return null for out-of-bounds cardinal neighbors at corner', () => {
      const cardinalNeighbors = world.getCardinalNeighbors(0, 0);

      // Top-left corner: North and West are out of bounds
      expect(cardinalNeighbors[0]).toBeNull(); // North
      expect(cardinalNeighbors[3]).toBeNull(); // West

      // East and South should be valid
      expect(cardinalNeighbors[1]).not.toBeNull(); // East
      expect(cardinalNeighbors[2]).not.toBeNull(); // South
    });

    it('should handle middle of map with no out-of-bounds neighbors', () => {
      const cardinalNeighbors = world.getCardinalNeighbors(128, 128);

      // All cardinal neighbors should be valid
      cardinalNeighbors.forEach((neighbor) => {
        expect(neighbor).not.toBeNull();
        expect(Object.values(TerrainType)).toContain(neighbor);
      });
    });
  });
});
