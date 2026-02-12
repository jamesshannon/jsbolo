/**
 * Bolo Manual Spec: Refueling Bases
 *
 * Manual Reference: docs/bolo-manual-reference.md § 10 "Bases"
 *
 * Tests base mechanics - refueling and capture:
 * - "the first thing you must do before you can attack pillboxes or other tanks
 *    is find a refueling base to replenish the tank's supplies"
 * - Refuel range: 1.5 tiles
 * - Transfer rate: 1 armor/shells/mines per tick (with 2-tick cooldown)
 * - Starting stocks: 90 armor, 40 shells, 40 mines
 * - Neutral bases refuel anyone; team bases only refuel friendlies
 * - Capture via shell hit or drive-over (when neutral)
 * - Self-replenishment over time (NOT YET IMPLEMENTED)
 * - "The object of the game is, eventually, to have captured all of these
 *    refueling bases."
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ServerBase } from '../../simulation/base.js';
import { GameSession } from '../../game-session.js';
import {
  BASE_STARTING_ARMOR,
  BASE_STARTING_SHELLS,
  BASE_STARTING_MINES,
  BASE_REFUEL_RANGE,
  TANK_MAX_ARMOR,
  TANK_MAX_SHELLS,
  TANK_MAX_MINES,
  TILE_SIZE_WORLD,
  NEUTRAL_TEAM,
} from '@jsbolo/shared';

describe('Bolo Manual Spec: 9. Bases', () => {
  describe('9a. Refueling', () => {
    it('should start with correct stocks (90 armor, 40 shells, 40 mines)', () => {
      const base = new ServerBase(50, 50);
      expect(base.armor).toBe(BASE_STARTING_ARMOR);  // 90
      expect(base.shells).toBe(BASE_STARTING_SHELLS); // 40
      expect(base.mines).toBe(BASE_STARTING_MINES);   // 40
    });

    it('should have refuel range of 1.5 tiles', () => {
      expect(BASE_REFUEL_RANGE).toBe(TILE_SIZE_WORLD * 1.5); // 384
    });

    it('should detect tank in range', () => {
      const base = new ServerBase(50, 50);
      // Tank at same tile
      const pos = base.getWorldPosition();
      expect(base.isTankInRange(pos.x, pos.y, BASE_REFUEL_RANGE)).toBe(true);

      // Tank 10 tiles away
      expect(base.isTankInRange(pos.x + 10 * TILE_SIZE_WORLD, pos.y, BASE_REFUEL_RANGE)).toBe(false);
    });

    // "you will see the stocks go down as your tank is refueled"
    it('should transfer armor, shells, and mines to tank', () => {
      const base = new ServerBase(50, 50, 0);
      const tank = { armor: 30, shells: 30, mines: 0, team: 0 };

      base.refuelTank(tank);

      expect(tank.armor).toBe(31);  // +1
      expect(tank.shells).toBe(31); // +1
      expect(tank.mines).toBe(1);   // +1
    });

    it('should deplete base stocks when refueling', () => {
      const base = new ServerBase(50, 50, 0);
      const armorBefore = base.armor;
      const shellsBefore = base.shells;

      const tank = { armor: 30, shells: 30, mines: 0, team: 0 };
      base.refuelTank(tank);

      expect(base.armor).toBe(armorBefore - 1);
      expect(base.shells).toBe(shellsBefore - 1);
    });

    it('should not overfill tank (respect max values)', () => {
      const base = new ServerBase(50, 50, 0);
      const tank = {
        armor: TANK_MAX_ARMOR,
        shells: TANK_MAX_SHELLS,
        mines: TANK_MAX_MINES,
        team: 0,
      };

      const result = base.refuelTank(tank);
      expect(result).toBe(false); // Nothing to transfer
    });

    // "An enemy tank cannot drive onto your base to refuel"
    it('should not refuel enemy tanks (team mismatch)', () => {
      const base = new ServerBase(50, 50, 0); // owned by team 0
      const tank = { armor: 30, shells: 30, mines: 0, team: 1 }; // team 1

      const result = base.refuelTank(tank);
      expect(result).toBe(false);
    });

    // Neutral bases refuel anyone
    it('should refuel any tank when neutral', () => {
      const base = new ServerBase(50, 50, NEUTRAL_TEAM);
      const tank = { armor: 30, shells: 30, mines: 0, team: 5 };

      const result = base.refuelTank(tank);
      expect(result).toBe(true);
    });
  });

  describe('9b. Capture', () => {
    it('should capture base when shot by enemy shell', () => {
      const base = new ServerBase(50, 50, NEUTRAL_TEAM);
      base.capture(3);
      expect(base.ownerTeam).toBe(3);
    });

    it('should allow changing ownership via capture', () => {
      const base = new ServerBase(50, 50, 0);
      base.capture(1);
      expect(base.ownerTeam).toBe(1);
    });

    // "The base will also be automatically captured" when you drive onto it
    it('should auto-capture neutral base when tank drives onto it', () => {
      const session = new GameSession();
      const ws = { send: () => {}, readyState: 1 } as any;
      const playerId = session.addPlayer(ws);

      const player = (session as any).players.get(playerId);
      const base = Array.from((session as any).bases.values())[0];
      base.ownerTeam = NEUTRAL_TEAM;
      base.armor = BASE_STARTING_ARMOR;

      const basePos = base.getWorldPosition();
      player.tank.x = basePos.x;
      player.tank.y = basePos.y;

      (session as any).update();
      expect(base.ownerTeam).toBe(player.tank.team);
    });

    // "it can shoot your base and deplete the armour that it has.
    //  When the armour is all gone, there is nothing to stop the enemy
    //  tank from driving onto your base and capturing it."
    it('should allow enemy capture after armor depleted', () => {
      const session = new GameSession();
      const ws1 = { send: () => {}, readyState: 1 } as any;
      const ws2 = { send: () => {}, readyState: 1 } as any;
      const p1 = session.addPlayer(ws1);
      const p2 = session.addPlayer(ws2);
      const player1 = (session as any).players.get(p1);
      const player2 = (session as any).players.get(p2);
      const base = Array.from((session as any).bases.values())[0];

      base.ownerTeam = player1.tank.team;
      base.armor = 0;

      const basePos = base.getWorldPosition();
      player2.tank.x = basePos.x;
      player2.tank.y = basePos.y;

      (session as any).update();
      expect(base.ownerTeam).toBe(player2.tank.team);
    });
  });

  describe('9c. Self-Replenishment', () => {
    // "The base will slowly replenish its stocks automatically"
    it('should slowly regenerate armor over time', () => {
      const base = new ServerBase(50, 50);
      base.armor = 80;

      for (let i = 0; i < 50; i++) {
        base.update();
      }

      expect(base.armor).toBe(81);
    });

    it('should slowly regenerate shells over time', () => {
      const base = new ServerBase(50, 50);
      base.shells = 30;

      for (let i = 0; i < 50; i++) {
        base.update();
      }

      expect(base.shells).toBe(31);
    });

    it('should slowly regenerate mines over time', () => {
      const base = new ServerBase(50, 50);
      base.mines = 20;

      for (let i = 0; i < 50; i++) {
        base.update();
      }

      expect(base.mines).toBe(21);
    });

    it('should not regenerate beyond starting values', () => {
      const base = new ServerBase(50, 50);

      for (let i = 0; i < 500; i++) {
        base.update();
      }

      expect(base.armor).toBe(BASE_STARTING_ARMOR);
      expect(base.shells).toBe(BASE_STARTING_SHELLS);
      expect(base.mines).toBe(BASE_STARTING_MINES);
    });
  });
});
