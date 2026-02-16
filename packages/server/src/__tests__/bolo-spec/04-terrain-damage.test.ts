/**
 * Bolo Manual Spec: Terrain Damage
 *
 * Manual Reference: docs/bolo-manual-reference.md § 5 "Terrain Damage"
 *
 * Tests terrain degradation from shell impacts and explosions:
 * - Direct hits: Building → Shot Building → Rubble → Crater
 * - Explosion damage: most terrain → Crater (roads immune)
 * - Crater flooding (adjacent to water) - NOT YET IMPLEMENTED
 *
 * "When mines explode, they leave craters which will slow down any tank"
 * "Craters adjacent to sea or river will flood with water"
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ServerWorld } from '../../simulation/world.js';
import { TerrainType, getTerrainInitialLife } from '@jsbolo/shared';

describe('Bolo Manual Spec: 4. Terrain Damage', () => {
  let world: ServerWorld;

  beforeEach(() => {
    world = new ServerWorld();
  });

  describe('4a. Direct Hit (Shell Collision)', () => {
    it('should degrade Building to Shot Building in 1 hit', () => {
      world.setTerrainAt(50, 50, TerrainType.BUILDING);
      world.damageTerrainFromCollision(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.SHOT_BUILDING);
    });

    it('should degrade Shot Building to Rubble in 2 hits', () => {
      world.setTerrainAt(50, 50, TerrainType.SHOT_BUILDING);
      world.damageTerrainFromCollision(50, 50); // hit 1
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.SHOT_BUILDING);
      world.damageTerrainFromCollision(50, 50); // hit 2
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.RUBBLE);
    });

    it('should degrade Rubble to Crater in 2 hits', () => {
      world.setTerrainAt(50, 50, TerrainType.RUBBLE);
      world.damageTerrainFromCollision(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.RUBBLE);
      world.damageTerrainFromCollision(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.CRATER);
    });

    it('should clear Forest in 1 hit (becomes Grass)', () => {
      world.setTerrainAt(50, 50, TerrainType.FOREST);
      world.damageTerrainFromCollision(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.GRASS);
    });

    it('should destroy Boat in 1 hit (becomes River)', () => {
      world.setTerrainAt(50, 50, TerrainType.BOAT);
      world.damageTerrainFromCollision(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.RIVER);
    });

    // Deep sea is immutable in manual terrain rules.
    it('should NOT change Deep Sea from direct-hit collision damage', () => {
      world.setTerrainAt(50, 50, TerrainType.DEEP_SEA);
      const changed = world.damageTerrainFromCollision(50, 50);
      expect(changed).toBe(false);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.DEEP_SEA);
    });
  });

  describe('4b. Explosion Damage', () => {
    // "mines explode, they leave craters"
    it('should turn Grass into Crater', () => {
      world.setTerrainAt(50, 50, TerrainType.GRASS);
      world.damageTerrainFromExplosion(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.CRATER);
    });

    it('should turn Building into Rubble (not Crater)', () => {
      world.setTerrainAt(50, 50, TerrainType.BUILDING);
      world.damageTerrainFromExplosion(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.RUBBLE);
    });

    it('should turn Shot Building into Crater', () => {
      world.setTerrainAt(50, 50, TerrainType.SHOT_BUILDING);
      world.damageTerrainFromExplosion(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.CRATER);
    });

    it('should turn Forest into Crater', () => {
      world.setTerrainAt(50, 50, TerrainType.FOREST);
      world.damageTerrainFromExplosion(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.CRATER);
    });

    it('should turn Rubble into Crater', () => {
      world.setTerrainAt(50, 50, TerrainType.RUBBLE);
      world.damageTerrainFromExplosion(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.CRATER);
    });

    it('should turn Swamp into Crater', () => {
      world.setTerrainAt(50, 50, TerrainType.SWAMP);
      world.damageTerrainFromExplosion(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.CRATER);
    });

    // "Roads are NOT damaged by explosions in Bolo"
    it('should NOT damage Road from explosion', () => {
      world.setTerrainAt(50, 50, TerrainType.ROAD);
      world.damageTerrainFromExplosion(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.ROAD);
    });

    it('should turn Boat into River from explosion', () => {
      world.setTerrainAt(50, 50, TerrainType.BOAT);
      world.damageTerrainFromExplosion(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.RIVER);
    });

    it('should not affect water or existing craters', () => {
      world.setTerrainAt(50, 50, TerrainType.RIVER);
      world.damageTerrainFromExplosion(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.RIVER);

      world.setTerrainAt(50, 50, TerrainType.DEEP_SEA);
      world.damageTerrainFromExplosion(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.DEEP_SEA);

      world.setTerrainAt(50, 50, TerrainType.CRATER);
      world.damageTerrainFromExplosion(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.CRATER);
    });
  });

  describe('4c. Crater Flooding', () => {
    // "Craters adjacent to sea or river will flood with water"
    it('should flood crater adjacent to river (becomes river)', () => {
      const world = new ServerWorld();
      world.setTerrainAt(50, 50, TerrainType.RIVER);
      world.setTerrainAt(51, 50, TerrainType.CRATER);

      // Check for flooding
      const flooded = world.checkCraterFlooding();

      // Crater should have flooded
      expect(flooded.length).toBe(1);
      expect(flooded[0]).toEqual({x: 51, y: 50});
      expect(world.getTerrainAt(51, 50)).toBe(TerrainType.RIVER);
    });

    // "setting off a long line of mines leading to the sea will have the effect
    //  of creating an artificial river"
    it('should chain-flood craters to create artificial rivers', () => {
      const world = new ServerWorld();
      // Use coordinates that are GRASS in procedural map: (121,121) avoids all patterns
      world.setTerrainAt(121, 121, TerrainType.RIVER);
      world.setTerrainAt(122, 121, TerrainType.CRATER);
      world.setTerrainAt(123, 121, TerrainType.CRATER);
      world.setTerrainAt(124, 121, TerrainType.CRATER);

      // First flooding cycle - only crater adjacent to water floods
      let flooded = world.checkCraterFlooding();
      expect(flooded.length).toBe(1);
      expect(world.getTerrainAt(122, 121)).toBe(TerrainType.RIVER);

      // Second cycle - next crater floods (now adjacent to new river)
      flooded = world.checkCraterFlooding();
      expect(flooded.length).toBe(1);
      expect(world.getTerrainAt(123, 121)).toBe(TerrainType.RIVER);

      // Third cycle - last crater floods
      flooded = world.checkCraterFlooding();
      expect(flooded.length).toBe(1);
      expect(world.getTerrainAt(124, 121)).toBe(TerrainType.RIVER);
    });

    // "you can create a moat around your fortress"
    it('should create moat by flooding crater chain from water source', () => {
      const world = new ServerWorld();
      // Create crater not adjacent to water (use coordinates far from procedural river)
      world.setTerrainAt(150, 150, TerrainType.GRASS);
      world.setTerrainAt(150, 149, TerrainType.GRASS);
      world.setTerrainAt(150, 150, TerrainType.CRATER);

      // Check for flooding - nothing should flood
      let flooded = world.checkCraterFlooding();
      expect(flooded.length).toBe(0);
      expect(world.getTerrainAt(150, 150)).toBe(TerrainType.CRATER);

      // Add water nearby
      world.setTerrainAt(150, 149, TerrainType.RIVER);

      // Now crater should flood
      flooded = world.checkCraterFlooding();
      expect(flooded.length).toBe(1);
      expect(world.getTerrainAt(150, 150)).toBe(TerrainType.RIVER);
    });
  });
});
