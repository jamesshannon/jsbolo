/**
 * Bolo Manual Spec: Tank Death and Respawn
 *
 * Manual Reference: docs/bolo-manual-reference.md § 12 "Tank Death and Respawn"
 *
 * Tests tank destruction and respawn mechanics:
 * - Tank destroyed when armor <= 0
 * - Respawn after delay (255 ticks)
 * - Respawn with full starting resources: 40 shells, 0 mines, 40 armor, 0 trees
 * - Speed and direction reset to 0
 */

import { describe, it, expect } from 'vitest';
import { ServerTank } from '../../simulation/tank.js';
import {
  SHELL_DAMAGE,
  TANK_STARTING_SHELLS,
  TANK_STARTING_MINES,
  TANK_STARTING_ARMOR,
  TANK_STARTING_TREES,
} from '@jsbolo/shared';

describe('Bolo Manual Spec: 11. Tank Death and Respawn', () => {
  it('should die when armor reaches 0', () => {
    const tank = new ServerTank(1, 0, 50, 50);
    tank.takeDamage(TANK_STARTING_ARMOR); // 40 damage
    expect(tank.isDead()).toBe(true);
    expect(tank.armor).toBe(0);
  });

  it('should die when armor goes below 0', () => {
    const tank = new ServerTank(1, 0, 50, 50);
    tank.takeDamage(100); // way more than armor
    expect(tank.isDead()).toBe(true);
    expect(tank.armor).toBeLessThan(0);
  });

  it('should respawn with full starting resources', () => {
    const tank = new ServerTank(1, 0, 50, 50);
    tank.takeDamage(100); // kill
    expect(tank.isDead()).toBe(true);

    tank.respawn(60, 60);

    expect(tank.armor).toBe(TANK_STARTING_ARMOR);   // 40
    expect(tank.shells).toBe(TANK_STARTING_SHELLS);  // 40
    expect(tank.mines).toBe(TANK_STARTING_MINES);    // 0
    expect(tank.trees).toBe(TANK_STARTING_TREES);    // 0
  });

  it('should reset speed and direction on respawn', () => {
    const tank = new ServerTank(1, 0, 50, 50);
    tank.speed = 12;
    tank.direction = 128;
    tank.takeDamage(100);

    tank.respawn(60, 60);

    expect(tank.speed).toBe(0);
    expect(tank.direction).toBe(0);
  });
});
