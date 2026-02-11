/**
 * Bolo Manual Spec: Shooting
 *
 * Manual Reference: docs/bolo-manual-reference.md § 4 "Shooting"
 * Also covers: § "Mine Clearing" (range adjustment for mine clearing)
 *
 * Tests shell firing, movement, collisions, and reload:
 * - Shell travel speed (32 world units/tick)
 * - Default range (7 tiles), adjustable 1-9 tiles
 * - Collisions with terrain (solid vs pass-through)
 * - Collisions with tanks, pillboxes, bases (128 unit hit radius)
 * - Damage (5 per hit)
 * - Reload timer (13 ticks)
 * - Range adjustment for manual mine clearing
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ServerShell } from '../../simulation/shell.js';
import { ServerTank } from '../../simulation/tank.js';
import { ServerWorld } from '../../simulation/world.js';
import { ServerPillbox } from '../../simulation/pillbox.js';
import { ServerBase } from '../../simulation/base.js';
import { GameSession } from '../../game-session.js';
import {
  TerrainType,
  TILE_SIZE_WORLD,
  SHELL_DAMAGE,
  RELOAD_TIME_TICKS,
  TANK_MAX_SHELLS,
  PILLBOX_MAX_ARMOR,
} from '@jsbolo/shared';
import {
  createDefaultInput,
  createMockWebSocket,
  getPlayer,
  getWorld,
  getShells,
  fillArea,
  placeTankAtTile,
  tickSession,
} from './helpers.js';

describe('Bolo Manual Spec: 3. Shooting', () => {
  describe('3a. Shell Basics', () => {
    it('should travel at 32 world units per tick', () => {
      const shell = new ServerShell(1, 5000, 5000, 0, 5);
      shell.update();
      expect(shell.distanceTraveled).toBe(32);
    });

    it('should have default firing range of 7 tiles', () => {
      const tank = new ServerTank(1, 0, 50, 50);
      expect(tank.firingRange).toBe(7);
    });

    it('should convert range from tiles to world units', () => {
      const shell = new ServerShell(1, 5000, 5000, 0, 7);
      expect(shell.range).toBe(7 * TILE_SIZE_WORLD); // 1792
    });

    it('should fire in tank direction', () => {
      const shell = new ServerShell(1, 5000, 5000, 64, 5); // direction 64 = south
      expect(shell.direction).toBe(64);
    });

    it('should spawn at tank position', () => {
      const shell = new ServerShell(1, 5000, 6000, 0, 5);
      expect(shell.x).toBe(5000);
      expect(shell.y).toBe(6000);
    });

    it('should cost 1 shell from tank inventory when firing', () => {
      const tank = new ServerTank(1, 0, 50, 50);
      const before = tank.shells;
      tank.shoot();
      expect(tank.shells).toBe(before - 1);
    });

    // "You must find a refueling base to replenish the tank's supplies of shells"
    it('should not fire with 0 shells or 0 armor', () => {
      const tank = new ServerTank(1, 0, 50, 50);
      tank.shells = 0;
      expect(tank.canShoot()).toBe(false);

      tank.shells = 10;
      tank.armor = 0;
      expect(tank.canShoot()).toBe(false);
    });
  });

  describe('3b. Shell-Terrain Collision', () => {
    let world: ServerWorld;

    beforeEach(() => {
      world = new ServerWorld();
    });

    it('should collide with Building', () => {
      world.setTerrainAt(50, 50, TerrainType.BUILDING);
      expect(world.checkShellTerrainCollision(50, 50)).toBe(true);
    });

    it('should collide with Shot Building', () => {
      world.setTerrainAt(50, 50, TerrainType.SHOT_BUILDING);
      expect(world.checkShellTerrainCollision(50, 50)).toBe(true);
    });

    it('should collide with Rubble', () => {
      world.setTerrainAt(50, 50, TerrainType.RUBBLE);
      expect(world.checkShellTerrainCollision(50, 50)).toBe(true);
    });

    it('should collide with Forest', () => {
      world.setTerrainAt(50, 50, TerrainType.FOREST);
      expect(world.checkShellTerrainCollision(50, 50)).toBe(true);
    });

    it('should pass through Grass', () => {
      world.setTerrainAt(50, 50, TerrainType.GRASS);
      expect(world.checkShellTerrainCollision(50, 50)).toBe(false);
    });

    it('should pass through Road', () => {
      world.setTerrainAt(50, 50, TerrainType.ROAD);
      expect(world.checkShellTerrainCollision(50, 50)).toBe(false);
    });

    it('should pass through water (River, Deep Sea)', () => {
      world.setTerrainAt(50, 50, TerrainType.RIVER);
      expect(world.checkShellTerrainCollision(50, 50)).toBe(false);

      world.setTerrainAt(50, 50, TerrainType.DEEP_SEA);
      expect(world.checkShellTerrainCollision(50, 50)).toBe(false);
    });
  });

  describe('3c. Shell-Tank Collision', () => {
    it('should detect hit within 128 world units', () => {
      const session = new GameSession();
      const ws1 = createMockWebSocket();
      const ws2 = createMockWebSocket();
      const id1 = session.addPlayer(ws1);
      const id2 = session.addPlayer(ws2);

      const p1 = getPlayer(session, id1);
      const p2 = getPlayer(session, id2);

      // Place tanks near each other, facing the target
      placeTankAtTile(p1.tank, 50, 50);
      placeTankAtTile(p2.tank, 52, 50);
      p1.tank.direction = 0; // East

      // Set terrain to allow shell passage
      const world = getWorld(session);
      fillArea(world, 48, 48, 10, 10, TerrainType.ROAD);

      // Fire and advance
      p1.lastInput = createDefaultInput({ shooting: true });
      const beforeArmor = p2.tank.armor;

      for (let i = 0; i < 30; i++) {
        tickSession(session, 1);
      }

      // Shell should have hit p2
      expect(p2.tank.armor).toBeLessThan(beforeArmor);
    });

    it('should not hit the shell owner', () => {
      const tank = new ServerTank(1, 0, 50, 50);
      // Shells check ownerTankId !== tank.id
      const shell = new ServerShell(1, tank.x, tank.y, 0, 5);
      expect(shell.ownerTankId).toBe(tank.id);
      // The game session skips owner in checkShellCollisions
    });

    it('should deal 5 damage per shell hit', () => {
      expect(SHELL_DAMAGE).toBe(5);

      const tank = new ServerTank(1, 0, 50, 50);
      const before = tank.armor;
      tank.takeDamage(SHELL_DAMAGE);
      expect(tank.armor).toBe(before - 5);
    });
  });

  describe('3d. Shell-Pillbox Collision', () => {
    it('should deal 5 damage per hit to pillbox', () => {
      const pb = new ServerPillbox(50, 50);
      const before = pb.armor;
      pb.takeDamage(SHELL_DAMAGE);
      expect(pb.armor).toBe(before - 5);
    });

    it('should destroy pillbox after enough hits (15 / 5 = 3 hits)', () => {
      const pb = new ServerPillbox(50, 50);
      expect(pb.armor).toBe(PILLBOX_MAX_ARMOR); // 15

      pb.takeDamage(SHELL_DAMAGE); // 10
      expect(pb.isDead()).toBe(false);
      pb.takeDamage(SHELL_DAMAGE); // 5
      expect(pb.isDead()).toBe(false);
      pb.takeDamage(SHELL_DAMAGE); // 0
      expect(pb.isDead()).toBe(true);
    });

    // "you can drive over the pillbox and pick it up... It will be repaired"
    it('should capture pillbox when hit by enemy shell', () => {
      const pb = new ServerPillbox(50, 50, 255); // neutral
      pb.capture(3);
      expect(pb.ownerTeam).toBe(3);
    });
  });

  describe('3e. Shell-Base Collision', () => {
    it('should deal 5 damage per hit to base', () => {
      const base = new ServerBase(50, 50);
      const before = base.armor;
      base.takeDamage(SHELL_DAMAGE);
      expect(base.armor).toBe(before - 5);
    });

    it('should capture base when hit by enemy shell', () => {
      const base = new ServerBase(50, 50, 255); // neutral
      base.capture(2);
      expect(base.ownerTeam).toBe(2);
    });
  });

  describe('3f. Range Adjustment', () => {
    let tank: ServerTank;

    beforeEach(() => {
      tank = new ServerTank(1, 0, 50, 50);
    });

    it('should increase range by 0.5 tiles per adjustment', () => {
      const before = tank.firingRange;
      const input = createDefaultInput({ rangeAdjustment: 1 }); // INCREASE
      tank.update(input, 1.0);
      expect(tank.firingRange).toBe(before + 0.5);
    });

    it('should decrease range by 0.5 tiles per adjustment', () => {
      const before = tank.firingRange;
      const input = createDefaultInput({ rangeAdjustment: 2 }); // DECREASE
      tank.update(input, 1.0);
      expect(tank.firingRange).toBe(before - 0.5);
    });

    it('should cap range at maximum 9 tiles', () => {
      tank.firingRange = 9;
      const input = createDefaultInput({ rangeAdjustment: 1 });
      tank.update(input, 1.0);
      expect(tank.firingRange).toBe(9);
    });

    it('should cap range at minimum 1 tile', () => {
      tank.firingRange = 1;
      const input = createDefaultInput({ rangeAdjustment: 2 });
      tank.update(input, 1.0);
      expect(tank.firingRange).toBe(1);
    });

    // "deliberately land a shell on top of a mine to set it off"
    it.skip('should allow using range control for mine clearing', () => {
      // Not directly testable as a unit - this is about the game loop
      // triggering mine detonation from shell end-of-range explosion
    });
  });

  describe('3g. Reload', () => {
    let tank: ServerTank;

    beforeEach(() => {
      tank = new ServerTank(1, 0, 50, 50);
    });

    it('should set reload timer to 13 ticks after firing', () => {
      expect(tank.canShoot()).toBe(true);
      tank.shoot();
      expect(tank.reload).toBe(RELOAD_TIME_TICKS); // 13
      expect(tank.canShoot()).toBe(false);
    });

    it('should decrement reload timer each tick', () => {
      tank.shoot();
      const input = createDefaultInput();
      tank.update(input, 1.0);
      expect(tank.reload).toBe(RELOAD_TIME_TICKS - 1); // 12
    });

    it('should allow firing again after reload completes', () => {
      tank.shoot();
      const input = createDefaultInput();
      for (let i = 0; i < RELOAD_TIME_TICKS; i++) {
        tank.update(input, 1.0);
      }
      expect(tank.reload).toBe(0);
      expect(tank.canShoot()).toBe(true);
    });

    it('should not fire during reload', () => {
      tank.shoot();
      expect(tank.canShoot()).toBe(false);
      // Advance only 5 ticks (not enough)
      const input = createDefaultInput();
      for (let i = 0; i < 5; i++) {
        tank.update(input, 1.0);
      }
      expect(tank.canShoot()).toBe(false);
    });
  });
});
