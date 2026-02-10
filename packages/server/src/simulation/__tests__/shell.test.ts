/**
 * Shell behavior tests
 *
 * These tests prevent regressions in:
 * - Shells not disappearing after collision
 * - Shells exploding at end of range
 * - Shell movement and direction
 * - Shell-terrain collision
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ServerShell } from '../shell.js';
import { TILE_SIZE_WORLD } from '@jsbolo/shared';

describe('Shell Behavior', () => {
  describe('Shell Movement', () => {
    it('should move in the correct direction', () => {
      const shell = new ServerShell(1, 2560, 2560, 0, 5);
      const initialX = shell.x;
      const initialY = shell.y;

      shell.update();

      // Shell should move (direction and distance)
      const moved = shell.x !== initialX || shell.y !== initialY;
      expect(moved).toBe(true);
      expect(shell.alive).toBe(true);
    });

    it('should track distance traveled', () => {
      const shell = new ServerShell(1, 2560, 2560, 0, 5);
      expect(shell.distanceTraveled).toBe(0);

      shell.update();

      // Shell moves 32 world units per tick
      expect(shell.distanceTraveled).toBe(32);
    });

    it('should die when exceeding range', () => {
      // Range of 1 tile = 256 world units
      const shell = new ServerShell(1, 2560, 2560, 0, 1);

      // Shell moves 32 units per tick, so 256/32 = 8 ticks to reach range
      for (let i = 0; i < 8; i++) {
        shell.update();
        expect(shell.alive).toBe(true);
      }

      // One more tick should exceed range
      shell.update();

      expect(shell.alive).toBe(false);
      expect(shell.shouldExplode).toBe(true); // End-of-range should explode
    });

    it('should die when out of bounds', () => {
      // Start near map edge, pointing out
      const maxCoord = TILE_SIZE_WORLD * 256;
      const shell = new ServerShell(1, maxCoord - 10, 2560, 90, 10); // East

      // Update until out of bounds
      while (shell.x < maxCoord + 100 && shell.alive) {
        shell.update();
      }

      expect(shell.alive).toBe(false);
      expect(shell.shouldExplode).toBe(true);
    });
  });

  describe('Shell Collision', () => {
    it('should be marked as dead when killed by collision', () => {
      const shell = new ServerShell(1, 2560, 2560, 0, 10);
      expect(shell.alive).toBe(true);

      shell.killByCollision();

      expect(shell.alive).toBe(false);
      expect(shell.shouldExplode).toBe(false); // Collision kills don't explode
    });

    it('should get tile position correctly', () => {
      // Spawn at world position (2560, 2560) = tile (10, 10)
      const shell = new ServerShell(1, 2560, 2560, 0, 10);
      const tilePos = shell.getTilePosition();

      expect(tilePos.x).toBe(10);
      expect(tilePos.y).toBe(10);
    });

    it('should update tile position as shell moves', () => {
      const shell = new ServerShell(1, 2560, 2560, 0, 10); // North
      const initialTile = shell.getTilePosition();

      // Move for several ticks to cross tile boundary
      for (let i = 0; i < 10; i++) {
        shell.update();
      }

      const newTile = shell.getTilePosition();

      // Shell moved north, so Y tile should decrease
      expect(newTile.y).toBeLessThan(initialTile.y);
    });
  });

  describe('Shell Lifecycle', () => {
    it('should start alive', () => {
      const shell = new ServerShell(1, 2560, 2560, 0, 10);
      expect(shell.alive).toBe(true);
      expect(shell.shouldExplode).toBe(false);
    });

    it('should not update when dead', () => {
      const shell = new ServerShell(1, 2560, 2560, 0, 10);
      shell.killByCollision();

      const deadX = shell.x;
      const deadY = shell.y;

      shell.update();

      // Dead shells don't move
      expect(shell.x).toBe(deadX);
      expect(shell.y).toBe(deadY);
    });

    it('should have unique IDs', () => {
      const shell1 = new ServerShell(1, 2560, 2560, 0, 10);
      const shell2 = new ServerShell(1, 2560, 2560, 0, 10);

      expect(shell1.id).not.toBe(shell2.id);
    });

    it('should track owner tank ID', () => {
      const ownerTankId = 42;
      const shell = new ServerShell(ownerTankId, 2560, 2560, 0, 10);

      expect(shell.ownerTankId).toBe(ownerTankId);
    });
  });

  describe('Shell Range', () => {
    it('should convert range from tiles to world units', () => {
      const rangeTiles = 5;
      const shell = new ServerShell(1, 2560, 2560, 0, rangeTiles);

      // Range should be in world units (tiles * TILE_SIZE_WORLD)
      expect(shell.range).toBe(rangeTiles * TILE_SIZE_WORLD);
    });

    it('should die exactly at range limit', () => {
      const rangeTiles = 2;
      const shell = new ServerShell(1, 2560, 2560, 0, rangeTiles);

      const maxDistance = rangeTiles * TILE_SIZE_WORLD; // 512
      const ticksToReachRange = maxDistance / 32; // 16 ticks exactly

      // Shell should survive all ticks up to and including reaching range
      for (let i = 0; i < ticksToReachRange; i++) {
        shell.update();
        expect(shell.alive).toBe(true);
      }

      // One more tick should exceed range and kill it
      shell.update();
      expect(shell.alive).toBe(false);
    });
  });
});
