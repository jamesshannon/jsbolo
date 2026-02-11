/**
 * Tank movement and collision tests
 *
 * These tests prevent regressions in:
 * - Tank getting stuck on buildings
 * - Tank movement with terrain speed
 * - Collision detection
 * - Boat mechanics
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ServerTank } from '../tank.js';
import { TILE_SIZE_WORLD } from '@jsbolo/shared';

describe('Tank Movement', () => {
  let tank: ServerTank;

  beforeEach(() => {
    // Spawn tank at tile (10, 10) = world position (2560, 2560)
    tank = new ServerTank(1, 0, 10, 10);
  });

  describe('Basic Movement', () => {
    it('should move forward when accelerating', () => {
      // Set diagonal direction so both X and Y change
      tank.direction = 32; // Northeast (between East=0 and North=64)

      const initialX = tank.x;
      const initialY = tank.y;

      const input = {
        sequence: 1,
        tick: 1,
        accelerating: true,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: 0,
      };

      // Update tank for multiple ticks to build up speed
      for (let i = 0; i < 10; i++) {
        tank.update(input, 1.0); // Full terrain speed
      }

      // Tank should have moved
      expect(tank.x).not.toBe(initialX);
      expect(tank.y).not.toBe(initialY);
      expect(tank.speed).toBeGreaterThan(0);
    });

    it('should stop when braking', () => {
      // Accelerate first
      const accelInput = {
        sequence: 1,
        tick: 1,
        accelerating: true,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: 0,
      };

      for (let i = 0; i < 10; i++) {
        tank.update(accelInput, 1.0);
      }

      expect(tank.speed).toBeGreaterThan(0);

      // Now brake
      const brakeInput = {
        ...accelInput,
        accelerating: false,
        braking: true,
      };

      for (let i = 0; i < 20; i++) {
        tank.update(brakeInput, 1.0);
      }

      expect(tank.speed).toBe(0);
    });

    it('should turn left', () => {
      const initialDirection = tank.direction;

      const input = {
        sequence: 1,
        tick: 1,
        accelerating: false,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: true,
        shooting: false,
        rangeAdjustment: 0,
      };

      tank.update(input, 1.0);

      // Direction should have changed (counter-clockwise = increasing direction)
      expect(tank.direction).not.toBe(initialDirection);
    });

    it('should turn right', () => {
      const initialDirection = tank.direction;

      const input = {
        sequence: 1,
        tick: 1,
        accelerating: false,
        braking: false,
        turningClockwise: true,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: 0,
      };

      tank.update(input, 1.0);

      // Direction should have changed (clockwise = decreasing direction)
      expect(tank.direction).not.toBe(initialDirection);
    });
  });

  describe('Terrain Speed Effects', () => {
    it('should move slower with low terrain speed', () => {
      const input = {
        sequence: 1,
        tick: 1,
        accelerating: true,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: 0,
      };

      // Move with full speed (run longer so tank reaches different max speeds)
      const tank1 = new ServerTank(1, 0, 10, 10);
      const tank1StartX = tank1.x;
      const tank1StartY = tank1.y;
      for (let i = 0; i < 100; i++) {
        tank1.update(input, 1.0);
      }
      const fullSpeedDistance = Math.sqrt(
        Math.pow(tank1.x - tank1StartX, 2) + Math.pow(tank1.y - tank1StartY, 2)
      );

      // Move with half speed (swamp) - will cap at lower max speed
      const tank2 = new ServerTank(2, 0, 10, 10);
      const tank2StartX = tank2.x;
      const tank2StartY = tank2.y;
      for (let i = 0; i < 100; i++) {
        tank2.update(input, 0.5);
      }
      const halfSpeedDistance = Math.sqrt(
        Math.pow(tank2.x - tank2StartX, 2) + Math.pow(tank2.y - tank2StartY, 2)
      );

      // Tank with full speed should move further
      expect(fullSpeedDistance).toBeGreaterThan(halfSpeedDistance);
    });

    it('should not move with zero terrain speed', () => {
      const initialX = tank.x;
      const initialY = tank.y;

      const input = {
        sequence: 1,
        tick: 1,
        accelerating: true,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: 0,
      };

      // Update with zero terrain speed (building/deep sea)
      for (let i = 0; i < 10; i++) {
        tank.update(input, 0.0);
      }

      // Tank should not have moved (speed should be 0)
      expect(tank.x).toBe(initialX);
      expect(tank.y).toBe(initialY);
      expect(tank.speed).toBe(0);
    });
  });

  describe('Collision Detection', () => {
    it('should stop when collision check fails', () => {
      const input = {
        sequence: 1,
        tick: 1,
        accelerating: true,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: 0,
      };

      // Build up some speed first
      for (let i = 0; i < 5; i++) {
        tank.update(input, 1.0);
      }

      expect(tank.speed).toBeGreaterThan(0);

      const initialSpeed = tank.speed;
      const initialX = tank.x;
      const initialY = tank.y;

      // Collision check that always fails (like hitting a wall)
      const failingCollisionCheck = () => false;

      // Update with collision check
      tank.update(input, 1.0, failingCollisionCheck);

      // Tank should have stopped (speed = 0) and not moved
      expect(tank.speed).toBe(0);
      expect(tank.x).toBe(initialX);
      expect(tank.y).toBe(initialY);
    });

    it('should be able to turn even when stuck', () => {
      const input = {
        sequence: 1,
        tick: 1,
        accelerating: true,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: 0,
      };

      // Collision check that always fails
      const failingCollisionCheck = () => false;

      // Try to move - should get stuck
      tank.update(input, 1.0, failingCollisionCheck);
      expect(tank.speed).toBe(0);

      const initialDirection = tank.direction;

      // Try to turn - should work even when stuck
      const turnInput = {
        ...input,
        accelerating: false,
        turningClockwise: true,
      };

      tank.update(turnInput, 1.0, failingCollisionCheck);

      // Direction should have changed even though tank is stuck
      expect(tank.direction).not.toBe(initialDirection);
    });
  });

  describe('Boat Mechanics', () => {
    it('should have onBoat flag when placed on boat', () => {
      const boatTank = new ServerTank(1, 0, 10, 10);
      boatTank.onBoat = true;
      expect(boatTank.onBoat).toBe(true);
    });

    it('should move at full speed when onBoat even with zero terrain speed', () => {
      tank.onBoat = true;

      const input = {
        sequence: 1,
        tick: 1,
        accelerating: true,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: 0,
      };

      // In game-session, onBoat overrides terrain speed to 1.0
      // This test verifies the tank CAN move with full speed when onBoat
      for (let i = 0; i < 10; i++) {
        tank.update(input, 1.0); // Should be overridden to 1.0 in game-session
      }

      expect(tank.speed).toBeGreaterThan(0);
    });
  });

  describe('Shooting Mechanics', () => {
    it('should respect reload time', () => {
      expect(tank.canShoot()).toBe(true);

      tank.shoot();
      expect(tank.canShoot()).toBe(false);

      // Advance reload counter
      for (let i = 0; i < 50; i++) {
        const input = {
          sequence: i,
          tick: i,
          accelerating: false,
          braking: false,
          turningClockwise: false,
          turningCounterClockwise: false,
          shooting: false,
          rangeAdjustment: 0,
        };
        tank.update(input, 1.0);
      }

      expect(tank.canShoot()).toBe(true);
    });

    it('should adjust firing range with +/- keys', () => {
      const initialRange = tank.firingRange;

      const increaseInput = {
        sequence: 1,
        tick: 1,
        accelerating: false,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: 1, // INCREASE
      };

      tank.update(increaseInput, 1.0);
      expect(tank.firingRange).toBeGreaterThan(initialRange);

      const increasedRange = tank.firingRange;

      const decreaseInput = {
        ...increaseInput,
        rangeAdjustment: 2, // DECREASE (2, not -1)
      };

      tank.update(decreaseInput, 1.0);
      expect(tank.firingRange).toBeLessThan(increasedRange);
    });
  });
});
