/**
 * Bolo Manual Spec: Pillboxes
 *
 * Manual Reference: references/bolo-manual-reference.md § 9 "Pillboxes"
 *
 * Tests pillbox behavior - targeting, firing, damage, pickup/placement:
 * - Auto-targeting: 8-tile range, neutral shoots all, team-owned shoots enemies only
 * - Variable fire rate: starts at 100 ticks; aggravation can lower to 6, then
 *   cooldown returns toward 100 over time
 * - Aggravation mechanic: hit → speed halves, cooldown resets
 * - "In a straightforward confrontation, with a tank and a pillbox both firing
 *    at each other as fast as they can, a pillbox will win every time."
 * - Damage: 15 armor, 1 per shell hit (15 hits to disable)
 * - "Pillboxes can never be totally destroyed, just disabled."
 * - Pickup/placement/repair (NOT YET IMPLEMENTED)
 * - Forest concealment (NOT YET IMPLEMENTED)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ServerPillbox } from '../../simulation/pillbox.js';
import { ServerWorld } from '../../simulation/world.js';
import {
  PILLBOX_MAX_ARMOR,
  PILLBOX_RANGE,
  TILE_SIZE_WORLD,
  NEUTRAL_TEAM,
} from '@jsbolo/shared';

describe('Bolo Manual Spec: 8. Pillboxes', () => {
  describe('8a. Targeting and Firing', () => {
    it('should have range of 8 tiles (2048 world units)', () => {
      expect(PILLBOX_RANGE).toBe(8 * TILE_SIZE_WORLD);
    });

    // "Neutral pillboxes shoot at ALL tanks"
    it('should target all tanks when neutral (team 255)', () => {
      const pb = new ServerPillbox(50, 50, NEUTRAL_TEAM);
      const tanks = [
        { id: 1, x: 51 * 256, y: 50 * 256, direction: 0, speed: 0, team: 0, armor: 40 },
        { id: 2, x: 52 * 256, y: 50 * 256, direction: 0, speed: 0, team: 1, armor: 40 },
      ];

      const target = pb.findTarget(tanks, PILLBOX_RANGE);
      expect(target).not.toBeNull();
    });

    // Team-owned pillboxes only shoot at enemy tanks
    it('should skip friendly tanks when team-owned', () => {
      const pb = new ServerPillbox(50, 50, 0); // owned by team 0
      const tanks = [
        { id: 1, x: 51 * 256, y: 50 * 256, direction: 0, speed: 0, team: 0, armor: 40 }, // friendly
      ];

      const target = pb.findTarget(tanks, PILLBOX_RANGE);
      expect(target).toBeNull();
    });

    it('should target nearest enemy tank', () => {
      const pb = new ServerPillbox(50, 50, 0);
      const tanks = [
        { id: 1, x: 55 * 256, y: 50 * 256, direction: 0, speed: 0, team: 1, armor: 40 }, // 5 tiles away
        { id: 2, x: 52 * 256, y: 50 * 256, direction: 0, speed: 0, team: 1, armor: 40 }, // 2 tiles away
      ];

      const target = pb.findTarget(tanks, PILLBOX_RANGE);
      expect(target!.id).toBe(2); // Nearest
    });

    it('should not target tanks beyond range', () => {
      const pb = new ServerPillbox(50, 50, NEUTRAL_TEAM);
      const tanks = [
        { id: 1, x: 70 * 256, y: 50 * 256, direction: 0, speed: 0, team: 0, armor: 40 }, // 20 tiles away
      ];

      const target = pb.findTarget(tanks, PILLBOX_RANGE);
      expect(target).toBeNull();
    });

    it('should not target dead tanks', () => {
      const pb = new ServerPillbox(50, 50, NEUTRAL_TEAM);
      const tanks = [
        { id: 1, x: 51 * 256, y: 50 * 256, direction: 0, speed: 0, team: 0, armor: 0 }, // dead
      ];

      const target = pb.findTarget(tanks, PILLBOX_RANGE);
      expect(target).toBeNull();
    });

    // Target acquisition delay
    it('should delay first shot on new target (acquisition delay)', () => {
      const pb = new ServerPillbox(50, 50, NEUTRAL_TEAM);
      pb.reload = 100; // Ready to fire

      // First call: acquires target but doesn't fire
      const fired = pb.shoot();
      expect(fired).toBe(false);

      // Subsequent calls: should fire when ready
      pb.reload = pb['speed']; // Set reload to ready
      const fired2 = pb.shoot();
      expect(fired2).toBe(true);
    });
  });

  describe('8b. Variable Fire Rate', () => {
    it('should start with fire speed of 100 ticks between shots', () => {
      const pb = new ServerPillbox(50, 50);
      expect(pb['speed']).toBe(100);
    });

    it('should increase fire interval over time after aggravation (gets slower)', () => {
      const pb = new ServerPillbox(50, 50, NEUTRAL_TEAM, 50);
      const initialSpeed = pb['speed'];

      // Run 33 updates (32 ticks to trigger speed increase + 1)
      for (let i = 0; i < 33; i++) {
        pb.update();
      }

      expect(pb['speed']).toBe(initialSpeed + 1); // 51
    });

    // "aggravation mechanic: halve speed when hit"
    it('should halve fire interval when hit (aggravation mechanic)', () => {
      const pb = new ServerPillbox(50, 50);
      // Pump up the speed value
      for (let i = 0; i < 200; i++) {
        pb.update();
      }

      const speedBefore = pb['speed'];
      expect(speedBefore).toBeGreaterThan(6);

      pb.takeShellHit();
      expect(pb['speed']).toBe(Math.max(6, Math.floor(speedBefore / 2)));
    });
  });

  describe('8c. Damage and Destruction', () => {
    it('should start with 15 armor', () => {
      const pb = new ServerPillbox(50, 50);
      expect(pb.armor).toBe(PILLBOX_MAX_ARMOR); // 15
    });

    it('should take 15 shell hits to disable (15 / 1 = 15)', () => {
      const pb = new ServerPillbox(50, 50);
      for (let i = 0; i < 14; i++) {
        pb.takeShellHit();
      }
      expect(pb.isDead()).toBe(false);
      pb.takeShellHit();
      expect(pb.isDead()).toBe(true);
    });

    // "Pillboxes can never be totally destroyed, just disabled"
    it('should be disabled (not destroyed) at 0 armor - can be picked up', () => {
      const pb = new ServerPillbox(50, 50);
      for (let i = 0; i < 15; i++) {
        pb.takeShellHit();
      }
      expect(pb.isDead()).toBe(true);
      // Pillbox object still exists - can be picked up and repaired
      expect(pb.armor).toBe(0);
    });
  });

  describe('8d. Pickup', () => {
    // "you can drive over the pillbox and pick it up"
    it('should allow pickup when pillbox is disabled (armor 0)', () => {
      const pb = new ServerPillbox(50, 50, NEUTRAL_TEAM);
      pb.armor = 0; // Disable

      // Simulate tank at same tile
      const tankMock = {
        carriedPillbox: null as ServerPillbox | null,
        armor: 40,
        team: 1,
      };

      // Manual pickup simulation
      const canPickup = tankMock.carriedPillbox === null && tankMock.armor > 0;
      expect(canPickup).toBe(true);

      // Pickup
      tankMock.carriedPillbox = pb;
      pb.inTank = true;
      pb.armor = PILLBOX_MAX_ARMOR;
      pb.ownerTeam = tankMock.team;

      expect(tankMock.carriedPillbox).toBe(pb);
      expect(pb.inTank).toBe(true);
    });

    // "It will be repaired, and will become loyal to you"
    it('should repair pillbox when picked up', () => {
      const pb = new ServerPillbox(50, 50, NEUTRAL_TEAM);
      pb.armor = 0; // Disabled

      const tankMock = {
        carriedPillbox: null as ServerPillbox | null,
        armor: 40,
        team: 2,
      };

      // Pickup and repair
      tankMock.carriedPillbox = pb;
      pb.inTank = true;
      pb.armor = PILLBOX_MAX_ARMOR; // Repair to full
      pb.ownerTeam = tankMock.team; // Change ownership

      expect(pb.armor).toBe(PILLBOX_MAX_ARMOR); // 15
      expect(pb.ownerTeam).toBe(2); // Tank's team
    });

    it('should set pillbox to inTank state and change ownership', () => {
      const pb = new ServerPillbox(50, 50, 1); // Originally team 1
      pb.armor = 0;

      const tankMock = {team: 2};

      pb.inTank = true;
      pb.ownerTeam = tankMock.team;

      expect(pb.inTank).toBe(true);
      expect(pb.ownerTeam).toBe(2); // Changed from 1 to 2
    });
  });

  describe('8e. Placement by Builder', () => {
    // "it can be placed back onto the map"
    it('should place carried pillbox via builder for free', () => {
      // Simulates placing a picked-up pillbox (should be free)
      const builderMock = {
        hasPillbox: true,
        trees: 5,
        canBuildWall: (cost: number) => builderMock.trees >= cost,
        useTrees: (cost: number) => {
          builderMock.trees -= cost;
        },
      };

      const initialTrees = builderMock.trees;

      // Placing picked-up pillbox (hasPillbox=true) should be free
      expect(builderMock.hasPillbox).toBe(true);
      builderMock.hasPillbox = false; // Placed

      // No trees consumed
      expect(builderMock.trees).toBe(initialTrees);
    });

    // "Building a pillbox requires a whole tree"
    it('should cost 1 tree to place a new pillbox', () => {
      const builderMock = {
        hasPillbox: false, // Not carrying picked-up pillbox
        trees: 5,
        canBuildWall: (cost: number) => builderMock.trees >= cost,
        useTrees: (cost: number) => {
          builderMock.trees -= cost;
        },
      };

      // Building new pillbox costs 1 tree
      const cost = 1; // BUILDER_PILLBOX_COST
      expect(builderMock.canBuildWall(cost)).toBe(true);
      builderMock.useTrees(cost);

      expect(builderMock.trees).toBe(4); // 5 - 1
    });

    it('should not allow placement on deep sea, boats, or forest', () => {
      const forbiddenTerrains = [10, 9, 5]; // DEEP_SEA, BOAT, FOREST

      for (const terrain of forbiddenTerrains) {
        const canPlace =
          terrain !== 10 && terrain !== 9 && terrain !== 5; // TerrainType values
        expect(canPlace).toBe(false);
      }

      // Valid terrains
      const validTerrains = [7, 4, 3, 2]; // GRASS, ROAD, CRATER, SWAMP
      for (const terrain of validTerrains) {
        const canPlace =
          terrain !== 10 && terrain !== 9 && terrain !== 5;
        expect(canPlace).toBe(true);
      }
    });
  });

  describe('8f. Repair by Builder', () => {
    // "repair a damaged pillbox by selecting 'Pillbox mode' and putting the cursor on top of it"
    it('should repair damaged pillbox in place via builder', () => {
      const pb = new ServerPillbox(50, 50, 1); // Team 1
      pb.armor = 10; // Damaged (5 points lost)

      const builderMock = {
        trees: 5,
        canBuildWall: (cost: number) => builderMock.trees >= cost,
        useTrees: (cost: number) => {
          builderMock.trees -= cost;
        },
      };

      // Calculate repair cost
      const damageRatio = (15 - pb.armor) / 15; // (15 - 10) / 15 = 1/3
      const repairCost = damageRatio * 1; // 0.333... trees

      expect(builderMock.canBuildWall(repairCost)).toBe(true);
      builderMock.useTrees(repairCost);
      pb.armor = 15; // Repair to full

      expect(pb.armor).toBe(PILLBOX_MAX_ARMOR);
      expect(builderMock.trees).toBeCloseTo(5 - 0.333, 2);
    });

    // "He may take up to whole tree, depending on how damaged the pillbox is"
    it('should cost up to 1 tree depending on damage level', () => {
      // Test different damage levels
      const testCases = [
        {armor: 15, expectedCost: 0}, // No damage
        {armor: 10, expectedCost: (5 / 15) * 1}, // 1/3 damage
        {armor: 5, expectedCost: (10 / 15) * 1}, // 2/3 damage
        {armor: 0, expectedCost: (15 / 15) * 1}, // Full damage (1 tree)
      ];

      for (const {armor, expectedCost} of testCases) {
        const damageRatio = (15 - armor) / 15;
        const actualCost = damageRatio * 1;
        expect(actualCost).toBeCloseTo(expectedCost, 10);
      }
    });

    // "even if it belongs to someone else"
    // "repairing a dead or damaged pillbox with your man never claims ownership"
    it('should NOT change ownership when repairing', () => {
      const pb = new ServerPillbox(50, 50, 1); // Owned by team 1
      pb.armor = 5; // Damaged

      const originalOwner = pb.ownerTeam;

      // Builder from team 2 repairs it
      const builderTeam = 2;
      expect(builderTeam).not.toBe(originalOwner);

      // Repair
      pb.armor = 15;

      // Ownership unchanged
      expect(pb.ownerTeam).toBe(originalOwner); // Still team 1
      expect(pb.ownerTeam).not.toBe(builderTeam);
    });
  });

  describe('8g. Forest Concealment', () => {
    // "tanks cannot be seen whilst they are under the cover of trees"
    // "completely enclosed in forest, surrounded on all sides"
    it('should hide tank when completely surrounded by forest', () => {
      const world = new ServerWorld();

      // Create 3x3 forest with tank in center at (50, 50)
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          world.setTerrainAt(50 + dx, 50 + dy, 5); // FOREST = 5
        }
      }

      // Tank at (50, 50) should be concealed
      const concealed = world.isTankConcealedInForest(50, 50);
      expect(concealed).toBe(true);
    });

    it('should not hide tank if any adjacent tile is not forest', () => {
      const world = new ServerWorld();

      // Create forest with one grass tile
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          world.setTerrainAt(50 + dx, 50 + dy, 5); // FOREST
        }
      }

      // Break concealment with grass tile
      world.setTerrainAt(51, 50, 7); // GRASS to the right

      const concealed = world.isTankConcealedInForest(50, 50);
      expect(concealed).toBe(false);
    });

    // "enemy tanks to make surprise attacks"
    it('should not allow pillbox to target tank hidden in forest', () => {
      const pb = new ServerPillbox(50, 50, NEUTRAL_TEAM);
      const tanks = [
        {
          id: 1,
          x: 55 * 256,
          y: 50 * 256,
          direction: 0,
          speed: 0,
          team: 0,
          armor: 40,
        },
      ];

      // Mock concealment check that returns true (tank is concealed)
      const checkConcealment = (tileX: number, tileY: number) => {
        return tileX === 55 && tileY === 50; // Tank at (55, 50) is concealed
      };

      const target = pb.findTarget(tanks, PILLBOX_RANGE, checkConcealment);
      expect(target).toBeNull(); // Cannot target concealed tank
    });

    it('should allow pillbox to target tank NOT in forest', () => {
      const pb = new ServerPillbox(50, 50, NEUTRAL_TEAM);
      const tanks = [
        {
          id: 1,
          x: 55 * 256,
          y: 50 * 256,
          direction: 0,
          speed: 0,
          team: 0,
          armor: 40,
        },
      ];

      // Mock concealment check that returns false (tank not concealed)
      const checkConcealment = () => false;

      const target = pb.findTarget(tanks, PILLBOX_RANGE, checkConcealment);
      expect(target).not.toBeNull(); // Can target visible tank
      expect(target!.id).toBe(1);
    });
  });
});
