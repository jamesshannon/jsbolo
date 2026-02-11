/**
 * Bolo Manual Spec: Tank Movement
 *
 * Manual Reference: docs/bolo-manual-reference.md § 2 "Tank Movement"
 *
 * Tests all aspects of tank movement mechanics:
 * - Terrain speed modifiers (road 1.0x, grass 0.75x, swamp 0.25x, etc.)
 * - Acceleration (0.25 per tick), deceleration, coasting
 * - Turning with acceleration (2 units/tick → 4 units/tick after 10 ticks)
 * - Collision detection and stopping
 * - Deep sea death (without boat)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ServerTank } from '../../simulation/tank.js';
import { ServerWorld } from '../../simulation/world.js';
import { GameSession } from '../../game-session.js';
import {
  TerrainType,
  TANK_MAX_SPEED,
  TANK_ACCELERATION,
  TANK_DECELERATION,
  TILE_SIZE_WORLD,
} from '@jsbolo/shared';
import {
  createDefaultInput,
  createMockWebSocket,
  getPlayer,
  getWorld,
  fillArea,
  placeTankAtTile,
  tickSession,
} from './helpers.js';

describe('Bolo Manual Spec: 2. Tank Movement', () => {
  describe('2a. Terrain Speed Modifiers', () => {
    let tank: ServerTank;

    beforeEach(() => {
      tank = new ServerTank(1, 0, 50, 50);
    });

    const accelInput = createDefaultInput({ accelerating: true });

    // "Road: fast" -> speed multiplier 1.0
    it('should reach max speed 16 on road terrain (1.0x)', () => {
      for (let i = 0; i < 200; i++) {
        tank.update(accelInput, 1.0);
      }
      expect(tank.speed).toBe(TANK_MAX_SPEED); // 16
    });

    // "Grass: medium" -> 0.75x
    it('should cap speed at 12 on grass (0.75x)', () => {
      for (let i = 0; i < 200; i++) {
        tank.update(accelInput, 0.75);
      }
      expect(tank.speed).toBe(TANK_MAX_SPEED * 0.75); // 12
    });

    // "Forest: slow" -> 0.5x
    it('should cap speed at 8 on forest (0.5x)', () => {
      for (let i = 0; i < 200; i++) {
        tank.update(accelInput, 0.5);
      }
      expect(tank.speed).toBe(TANK_MAX_SPEED * 0.5); // 8
    });

    // "Crater: very slow" -> 0.5x
    it('should cap speed at 8 on crater (0.5x)', () => {
      for (let i = 0; i < 200; i++) {
        tank.update(accelInput, 0.5);
      }
      expect(tank.speed).toBe(TANK_MAX_SPEED * 0.5); // 8
    });

    // "Swamp: very slow" -> 0.25x
    it('should cap speed at 4 on swamp (0.25x)', () => {
      for (let i = 0; i < 200; i++) {
        tank.update(accelInput, 0.25);
      }
      expect(tank.speed).toBe(TANK_MAX_SPEED * 0.25); // 4
    });

    // "Building: impassable" -> 0.0x
    it('should not accelerate on impassable terrain (0.0x)', () => {
      for (let i = 0; i < 100; i++) {
        tank.update(accelInput, 0.0);
      }
      expect(tank.speed).toBe(0);
    });

    // Terrain speed lookup from world
    it('should return correct speed multipliers from world terrain lookup', () => {
      const world = new ServerWorld();
      world.setTerrainAt(50, 50, TerrainType.ROAD);
      expect(world.getTankSpeedAt(50, 50)).toBe(1.0);

      world.setTerrainAt(50, 50, TerrainType.GRASS);
      expect(world.getTankSpeedAt(50, 50)).toBe(0.75);

      world.setTerrainAt(50, 50, TerrainType.SWAMP);
      expect(world.getTankSpeedAt(50, 50)).toBe(0.25);
    });

    // Boat terrain = full speed
    it('should give full speed on BOAT terrain (1.0x)', () => {
      const world = new ServerWorld();
      world.setTerrainAt(50, 50, TerrainType.BOAT);
      expect(world.getTankSpeedAt(50, 50)).toBe(1.0);
    });

    // Deep sea = 0
    it('should give 0 speed on deep sea (impassable without boat)', () => {
      const world = new ServerWorld();
      world.setTerrainAt(50, 50, TerrainType.DEEP_SEA);
      expect(world.getTankSpeedAt(50, 50)).toBe(0.0);
    });
  });

  describe('2b. Acceleration and Deceleration', () => {
    let tank: ServerTank;

    beforeEach(() => {
      tank = new ServerTank(1, 0, 50, 50);
    });

    it('should accelerate at 0.25 world units per tick', () => {
      const input = createDefaultInput({ accelerating: true });
      tank.update(input, 1.0);
      expect(tank.speed).toBe(TANK_ACCELERATION); // 0.25
    });

    it('should decelerate at 0.25 per tick when braking', () => {
      // Get to a known speed first
      tank.speed = 4;
      const input = createDefaultInput({ braking: true });
      tank.update(input, 1.0);
      expect(tank.speed).toBe(4 - TANK_DECELERATION); // 3.75
    });

    it('should coast-decelerate at half rate (0.125) with no input', () => {
      tank.speed = 4;
      const input = createDefaultInput(); // no accel, no brake
      tank.update(input, 1.0);
      expect(tank.speed).toBe(4 - TANK_DECELERATION / 2); // 3.875
    });

    // "As soon as they reach the road, the tank accelerates and they go flying off the other side"
    it('should smoothly decelerate when entering slower terrain (not instant)', () => {
      // Tank at full road speed enters swamp
      tank.speed = TANK_MAX_SPEED; // 16
      const input = createDefaultInput({ accelerating: true });
      tank.update(input, 0.25); // Swamp
      // Should decelerate by 0.25, not snap to 4 instantly
      expect(tank.speed).toBe(TANK_MAX_SPEED - TANK_DECELERATION); // 15.75
    });

    it('should not go below 0 speed when braking', () => {
      tank.speed = 0.1;
      const input = createDefaultInput({ braking: true });
      tank.update(input, 1.0);
      expect(tank.speed).toBe(0);
    });
  });

  describe('2c. Turning', () => {
    let tank: ServerTank;

    beforeEach(() => {
      tank = new ServerTank(1, 0, 50, 50);
    });

    it('should turn clockwise when turningClockwise is pressed', () => {
      const input = createDefaultInput({ turningClockwise: true });
      tank.update(input, 1.0);
      // Clockwise adds to direction
      expect(tank.direction).toBe(2);
    });

    it('should turn counter-clockwise when turningCounterClockwise is pressed', () => {
      tank.direction = 10;
      const input = createDefaultInput({ turningCounterClockwise: true });
      tank.update(input, 1.0);
      // Counter-clockwise subtracts from direction
      expect(tank.direction).toBe(8);
    });

    it('should wrap direction around 256 (full circle)', () => {
      tank.direction = 255;
      const input = createDefaultInput({ turningClockwise: true });
      tank.update(input, 1.0);
      // 255 + 2 = 257 % 256 = 1
      expect(tank.direction).toBe(1);
    });

    it('should accelerate turn rate after 10 ticks (2 -> 4 units per tick)', () => {
      const input = createDefaultInput({ turningClockwise: true });

      // First 10 ticks: turn 2 per tick
      for (let i = 0; i < 10; i++) {
        tank.update(input, 1.0);
      }
      expect(tank.direction).toBe(20); // 10 * 2

      // 11th tick should turn 4
      tank.update(input, 1.0);
      expect(tank.direction).toBe(24); // 20 + 4
    });

    it('should allow turning while stopped (speed = 0)', () => {
      expect(tank.speed).toBe(0);
      const input = createDefaultInput({ turningClockwise: true });
      tank.update(input, 1.0);
      expect(tank.direction).not.toBe(0);
    });
  });

  describe('2d. Collision', () => {
    it('should stop tank when hitting a building (speed = 0)', () => {
      const tank = new ServerTank(1, 0, 50, 50);
      const input = createDefaultInput({ accelerating: true });

      // Build up speed
      for (let i = 0; i < 10; i++) {
        tank.update(input, 1.0);
      }
      expect(tank.speed).toBeGreaterThan(0);

      // Collision check always fails (wall ahead)
      tank.update(input, 1.0, () => false);
      expect(tank.speed).toBe(0);
    });

    it('should not change position on collision', () => {
      const tank = new ServerTank(1, 0, 50, 50);
      tank.speed = 8;
      const x = tank.x;
      const y = tank.y;

      const input = createDefaultInput({ accelerating: true });
      tank.update(input, 1.0, () => false);

      expect(tank.x).toBe(x);
      expect(tank.y).toBe(y);
    });

    it('should block buildings via world.isPassable', () => {
      const world = new ServerWorld();
      world.setTerrainAt(50, 50, TerrainType.BUILDING);
      expect(world.isPassable(50, 50)).toBe(false);

      world.setTerrainAt(50, 50, TerrainType.SHOT_BUILDING);
      expect(world.isPassable(50, 50)).toBe(false);
    });

    it('should allow passage through non-building terrain', () => {
      const world = new ServerWorld();
      for (const terrain of [TerrainType.GRASS, TerrainType.ROAD, TerrainType.SWAMP, TerrainType.CRATER, TerrainType.FOREST]) {
        world.setTerrainAt(50, 50, terrain);
        expect(world.isPassable(50, 50)).toBe(true);
      }
    });
  });

  describe('2e. Deep Sea Death', () => {
    // "Deep Sea: instant death"
    it('should give 0 terrain speed for deep sea (impassable)', () => {
      const world = new ServerWorld();
      world.setTerrainAt(50, 50, TerrainType.DEEP_SEA);
      expect(world.getTankSpeedAt(50, 50)).toBe(0.0);
    });

    // Full deep-sea death mechanic (kill tank on entering deep sea without boat)
    it.skip('should kill tank that enters deep sea without boat', () => {
      // Not yet implemented: deep sea should instantly destroy the tank
      // Currently deep sea just has 0 speed (impassable) but doesn't kill
    });
  });
});
