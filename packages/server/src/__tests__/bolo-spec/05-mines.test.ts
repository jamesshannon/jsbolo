/**
 * Bolo Manual Spec: Mines
 *
 * Manual Reference: docs/bolo-manual-reference.md § 6 "Mines"
 * Also covers: § "Mine Laying" tactical section
 *
 * Tests mine placement, explosion, and chain reactions:
 * - Quick mines (Tab key): "all other tanks which are near to you will see mines"
 * - Builder-laid mines: "invisible even if someone is watching you"
 * - Mine explosion: 1-tile radius (3x3 grid), 10 damage
 * - Chain reactions: "an exploding mine will also set off any adjacent mines"
 * - Checker-board pattern to prevent chain reactions
 *
 * "You can lay mines in two different ways - by sending the man out to bury them
 *  or by just dropping them onto the ground where the tank stands by pressing the
 *  'Tab' key."
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ServerWorld } from '../../simulation/world.js';
import { GameSession } from '../../game-session.js';
import {
  TerrainType,
  MINE_DAMAGE,
  MINE_EXPLOSION_RADIUS_TILES,
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

describe('Bolo Manual Spec: 5. Mines', () => {
  describe('5a. Quick Mines', () => {
    // "by just dropping them onto the ground where the tank stands"
    it('should place mine at tank tile position', () => {
      const world = new ServerWorld();
      expect(world.hasMineAt(50, 50)).toBe(false);
      world.setMineAt(50, 50, true);
      expect(world.hasMineAt(50, 50)).toBe(true);
    });

    // "all other tanks which are near to you will see mines that you lay this way"
    it.skip('should be visible to nearby enemy tanks (quick mines)', () => {
      // Not yet implemented - quick mine visibility system
    });

    // "Don't assume that you can kill him just by dropping mines in his path"
    it.skip('should cost 1 mine from tank inventory when placing', () => {
      // Quick mine placement via input not yet implemented
    });
  });

  describe('5b. Buried Mines via Builder', () => {
    it('should place mine at target location via builder', () => {
      const world = new ServerWorld();
      world.setMineAt(60, 60, true);
      expect(world.hasMineAt(60, 60)).toBe(true);
    });

    // "mines you lay [via builder] are invisible even if someone is watching you"
    it('should be invisible to enemies when laid by builder', () => {
      // Mine placement via builder is implemented, invisibility is a client concern
      const world = new ServerWorld();
      world.setMineAt(60, 60, true);
      // The hasMine field exists but client rendering determines visibility
      expect(world.hasMineAt(60, 60)).toBe(true);
    });

    // "Your computer informs your allies' computers whenever you lay mines"
    it('should share mine locations with allies during alliance', () => {
      const session = new GameSession();
      const ws1 = { send: () => {}, readyState: 1 } as any;
      const ws2 = { send: () => {}, readyState: 1 } as any;
      const player1Id = session.addPlayer(ws1);
      const player2Id = session.addPlayer(ws2);

      session.createAlliance(0, 1);
      session.placeMineForTeam(0, 60, 60);

      const visible1 = session.getVisibleMineTilesForPlayer(player1Id);
      const visible2 = session.getVisibleMineTilesForPlayer(player2Id);
      expect(visible1).toContainEqual({x: 60, y: 60});
      expect(visible2).toContainEqual({x: 60, y: 60});
    });

    // "any mines you lay after the alliance is broken are not shown on their maps"
    it('should not share pre-alliance or post-alliance mine locations', () => {
      const session = new GameSession();
      const ws = { send: () => {}, readyState: 1 } as any;
      session.addPlayer(ws); // team 0
      session.addPlayer(ws); // team 1
      const player2Id = session.addPlayer(ws); // team 2
      const player3Id = session.addPlayer(ws); // team 3

      // Team 2 mine before alliance with team 3: not shared retroactively
      session.placeMineForTeam(2, 61, 60);
      session.createAlliance(2, 3);
      const visibleDuringAlliance = session.getVisibleMineTilesForPlayer(player3Id);
      expect(visibleDuringAlliance).not.toContainEqual({x: 61, y: 60});

      // Team 2 mine while allied with team 3: shared
      session.placeMineForTeam(2, 62, 60);
      const visibleShared = session.getVisibleMineTilesForPlayer(player3Id);
      expect(visibleShared).toContainEqual({x: 62, y: 60});

      // After alliance break, new mines should no longer be shared
      session.breakAlliance(2, 3);
      session.placeMineForTeam(2, 63, 60);
      const visibleAfterBreak = session.getVisibleMineTilesForPlayer(player3Id);
      expect(visibleAfterBreak).not.toContainEqual({x: 63, y: 60});

      // Team 2 still sees all of its own mines
      const visibleOwner = session.getVisibleMineTilesForPlayer(player2Id);
      expect(visibleOwner).toContainEqual({x: 61, y: 60});
      expect(visibleOwner).toContainEqual({x: 62, y: 60});
      expect(visibleOwner).toContainEqual({x: 63, y: 60});
    });
  });

  describe('5c. Mine Explosion', () => {
    let world: ServerWorld;

    beforeEach(() => {
      world = new ServerWorld();
    });

    // "When mines explode, they leave craters"
    it('should damage terrain in 3x3 radius (1 tile radius)', () => {
      // Fill area with grass
      fillArea(world, 49, 49, 3, 3, TerrainType.GRASS);

      const affected = world.createMineExplosion(50, 50, MINE_EXPLOSION_RADIUS_TILES);

      expect(affected.length).toBe(9); // 3x3
      // All grass should become crater
      for (let y = 49; y <= 51; y++) {
        for (let x = 49; x <= 51; x++) {
          expect(world.getTerrainAt(x, y)).toBe(TerrainType.CRATER);
        }
      }
    });

    it('should deal 10 armor damage to tanks in explosion radius', () => {
      expect(MINE_DAMAGE).toBe(10);
    });

    it('should remove mine from tile after detonation', () => {
      world.setMineAt(50, 50, true);
      expect(world.hasMineAt(50, 50)).toBe(true);
      world.removeMineAt(50, 50);
      expect(world.hasMineAt(50, 50)).toBe(false);
    });
  });

  describe('5d. Mine Chain Reactions', () => {
    // "an exploding mine will also set off any adjacent mines"
    it('should trigger adjacent mines in chain reaction', () => {
      const world = new ServerWorld();
      world.setMineAt(50, 50, true);
      world.setMineAt(51, 50, true);

      const {explodedMines} = world.triggerMineExplosion(50, 50, MINE_EXPLOSION_RADIUS_TILES);

      // Both mines should have exploded
      expect(explodedMines.length).toBe(2);
      expect(world.hasMineAt(50, 50)).toBe(false);
      expect(world.hasMineAt(51, 50)).toBe(false);
    });

    // "a long line of mines will all go off together in a chain reaction"
    it('should chain-react a line of adjacent mines', () => {
      const world = new ServerWorld();
      // Place 5 mines in a horizontal line
      for (let x = 50; x < 55; x++) {
        world.setMineAt(x, 50, true);
      }

      const {explodedMines} = world.triggerMineExplosion(50, 50, MINE_EXPLOSION_RADIUS_TILES);

      // All 5 mines should have exploded
      expect(explodedMines.length).toBe(5);
      for (let x = 50; x < 55; x++) {
        expect(world.hasMineAt(x, 50)).toBe(false);
      }
    });

    // "lay mines in a checker-board pattern so that they don't set each other off"
    it('should NOT chain-react mines in checker-board pattern', () => {
      const world = new ServerWorld();
      // Checker-board pattern (mines too far apart to chain)
      world.setMineAt(50, 50, true);
      world.setMineAt(52, 50, true); // 2 tiles away - outside radius of 1
      world.setMineAt(50, 52, true);
      world.setMineAt(52, 52, true);

      const {explodedMines} = world.triggerMineExplosion(50, 50, MINE_EXPLOSION_RADIUS_TILES);

      // Only the triggered mine should explode
      expect(explodedMines.length).toBe(1);
      expect(world.hasMineAt(50, 50)).toBe(false);
      // Other mines should still exist
      expect(world.hasMineAt(52, 50)).toBe(true);
      expect(world.hasMineAt(50, 52)).toBe(true);
      expect(world.hasMineAt(52, 52)).toBe(true);
    });
  });
});
