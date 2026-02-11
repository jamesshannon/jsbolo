/**
 * Bolo Manual Spec: Builder / Man
 *
 * Manual Reference: docs/bolo-manual-reference.md § 11 "Builder / Man"
 * Also covers: § "Farming and Building" section
 *
 * Tests builder lifecycle and construction abilities:
 * - "A man will leave the tank, run to the square, build the required object,
 *    and return to the tank."
 * - Lifecycle: IN_TANK → dispatched → working → returning
 * - Harvesting: FOREST → GRASS, gains trees
 * - "Building a road or bridge or building costs you 1/2 a tree from the
 *    tank inventory and building a pillbox requires a whole tree.
 *    Boats are expensive - they cost five trees to build."
 * - Roads/walls: 0.5 trees, GRASS → ROAD/BUILDING
 * - Boats: 5 trees, RIVER → BOAT (20 ticks vs 10)
 * - Mine laying: builder-placed mines are invisible
 * - Vulnerability/respawn (NOT YET IMPLEMENTED)
 * - Forest regrowth over time (NOT YET IMPLEMENTED)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ServerBuilder } from '../../simulation/builder.js';
import { GameSession } from '../../game-session.js';
import {
  BuilderOrder,
  TerrainType,
  TILE_SIZE_WORLD,
  BUILDER_RESPAWN_TICKS,
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

describe('Bolo Manual Spec: 10. Builder / Man', () => {
  describe('10a. Lifecycle', () => {
    it('should start inside tank (IN_TANK order)', () => {
      const builder = new ServerBuilder(1, 0);
      expect(builder.order).toBe(BuilderOrder.IN_TANK);
    });

    it('should track tank position when IN_TANK', () => {
      const builder = new ServerBuilder(1, 0);
      builder.update(5000, 6000);
      expect(builder.x).toBe(5000);
      expect(builder.y).toBe(6000);
    });

    it('should move towards target when dispatched', () => {
      const builder = new ServerBuilder(1, 0);
      builder.sendToLocation(60, 60, 1); // FOREST (harvest)

      const targetX = (60 + 0.5) * TILE_SIZE_WORLD;
      const targetY = (60 + 0.5) * TILE_SIZE_WORLD;

      // Builder should be heading towards target
      expect(builder.targetX).toBe(targetX);
      expect(builder.targetY).toBe(targetY);
      expect(builder.order).toBe(BuilderOrder.HARVESTING);
    });

    it('should return to tank after task completion', () => {
      const builder = new ServerBuilder(1, 0);
      builder.recallToTank(5000, 6000);
      expect(builder.order).toBe(BuilderOrder.RETURNING);
    });

    // "A new man will be parachuted in for you" (respawn delay = 255 ticks)
    it('should have respawn delay of 255 ticks when killed', () => {
      expect(BUILDER_RESPAWN_TICKS).toBe(255);
    });
  });

  describe('10b. Harvesting', () => {
    it('should set HARVESTING order when sent to forest', () => {
      const builder = new ServerBuilder(1, 0);
      builder.sendToLocation(60, 60, 1); // BuildAction.FOREST
      expect(builder.order).toBe(BuilderOrder.HARVESTING);
    });

    it('should only harvest from FOREST terrain', () => {
      const builder = new ServerBuilder(1, 0);
      expect(builder.canHarvest(TerrainType.FOREST)).toBe(true);
      expect(builder.canHarvest(TerrainType.GRASS)).toBe(false);
      expect(builder.canHarvest(TerrainType.ROAD)).toBe(false);
    });

    it('should gain trees when harvesting', () => {
      const builder = new ServerBuilder(1, 0);
      expect(builder.trees).toBe(0);
      builder.harvestTree();
      expect(builder.trees).toBe(1);
    });

    it('should convert FOREST to GRASS when harvesting via game session', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      // Set up forest tile
      world.setTerrainAt(50, 50, TerrainType.FOREST);
      placeTankAtTile(player.tank, 50, 50);

      // Place builder at the forest tile and set harvesting
      player.tank.builder.x = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.y = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.targetX = player.tank.builder.x;
      player.tank.builder.targetY = player.tank.builder.y;
      player.tank.builder.order = BuilderOrder.HARVESTING;

      // Tick until harvesting happens (every 10 ticks)
      for (let i = 0; i < 20; i++) {
        tickSession(session, 1);
        if (world.getTerrainAt(50, 50) !== TerrainType.FOREST) break;
      }

      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.GRASS);
    });
  });

  describe('10c. Building Roads', () => {
    // "Building a road ... costs you 1/2 a tree"
    it('should set BUILDING_ROAD order when dispatched', () => {
      const builder = new ServerBuilder(1, 0);
      builder.sendToLocation(60, 60, 2); // BuildAction.ROAD
      expect(builder.order).toBe(BuilderOrder.BUILDING_ROAD);
    });

    it('should convert GRASS to ROAD when building', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      world.setTerrainAt(50, 50, TerrainType.GRASS);
      placeTankAtTile(player.tank, 50, 50);

      player.tank.builder.x = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.y = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.targetX = player.tank.builder.x;
      player.tank.builder.targetY = player.tank.builder.y;
      player.tank.builder.order = BuilderOrder.BUILDING_ROAD;
      player.tank.builder.trees = 5; // Ensure has trees

      for (let i = 0; i < 20; i++) {
        tickSession(session, 1);
        if (world.getTerrainAt(50, 50) !== TerrainType.GRASS) break;
      }

      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.ROAD);
    });

    it('should require trees to build road', () => {
      const builder = new ServerBuilder(1, 0);
      builder.trees = 0;
      expect(builder.canBuildWall()).toBe(false);
      builder.trees = 1;
      expect(builder.canBuildWall()).toBe(true);
    });

    // "costs you 1/2 a tree"
    it('should cost 0.5 trees per road segment', () => {
      const builder = new ServerBuilder(1, 0);
      builder.trees = 2;

      // Use the builder's useTrees method with correct cost
      const initialTrees = builder.trees;
      builder.useTrees(0.5);

      expect(builder.trees).toBe(initialTrees - 0.5);
    });

    it('should deduct 0.5 trees from tank when building road via game session', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      world.setTerrainAt(50, 50, TerrainType.GRASS);
      placeTankAtTile(player.tank, 50, 50);

      // Give tank 2 trees
      player.tank.trees = 2;
      player.tank.builder.trees = 2;

      player.tank.builder.x = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.y = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.targetX = player.tank.builder.x;
      player.tank.builder.targetY = player.tank.builder.y;
      player.tank.builder.order = BuilderOrder.BUILDING_ROAD;

      // Run until road is built
      for (let i = 0; i < 20; i++) {
        tickSession(session, 1);
        if (world.getTerrainAt(50, 50) === TerrainType.ROAD) break;
      }

      // Verify road was built
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.ROAD);

      // Verify 0.5 trees were deducted
      expect(player.tank.trees).toBe(1.5);
    });

    it('should recall builder if not enough trees for road', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      world.setTerrainAt(50, 50, TerrainType.GRASS);
      placeTankAtTile(player.tank, 50, 50);

      // Give tank 0 trees (not enough)
      player.tank.trees = 0;
      player.tank.builder.trees = 0;

      player.tank.builder.x = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.y = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.targetX = player.tank.builder.x;
      player.tank.builder.targetY = player.tank.builder.y;
      player.tank.builder.order = BuilderOrder.BUILDING_ROAD;

      // Run ticks
      tickSession(session, 20);

      // Verify road was NOT built (no trees)
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.GRASS);

      // Verify builder was recalled (may be IN_TANK if already returned)
      expect([BuilderOrder.IN_TANK, BuilderOrder.RETURNING]).toContain(
        player.tank.builder.order
      );
    });
  });

  describe('10d. Building Walls', () => {
    it('should set BUILDING_WALL order when dispatched', () => {
      const builder = new ServerBuilder(1, 0);
      builder.sendToLocation(60, 60, 5); // BuildAction.BUILDING
      expect(builder.order).toBe(BuilderOrder.BUILDING_WALL);
    });

    it('should convert GRASS to BUILDING when building walls', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      world.setTerrainAt(50, 50, TerrainType.GRASS);
      placeTankAtTile(player.tank, 50, 50);

      player.tank.builder.x = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.y = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.targetX = player.tank.builder.x;
      player.tank.builder.targetY = player.tank.builder.y;
      player.tank.builder.order = BuilderOrder.BUILDING_WALL;
      player.tank.builder.trees = 5;

      for (let i = 0; i < 20; i++) {
        tickSession(session, 1);
        if (world.getTerrainAt(50, 50) !== TerrainType.GRASS) break;
      }

      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.BUILDING);
    });

    // "costs you 1/2 a tree"
    it('should cost 0.5 trees per wall segment', () => {
      const builder = new ServerBuilder(1, 0);
      builder.trees = 2;

      // Use the builder's useTrees method with correct cost
      const initialTrees = builder.trees;
      builder.useTrees(0.5);

      expect(builder.trees).toBe(initialTrees - 0.5);
    });

    it('should deduct 0.5 trees from tank when building wall via game session', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      world.setTerrainAt(50, 50, TerrainType.GRASS);
      placeTankAtTile(player.tank, 50, 50);

      // Give tank 2 trees
      player.tank.trees = 2;
      player.tank.builder.trees = 2;

      player.tank.builder.x = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.y = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.targetX = player.tank.builder.x;
      player.tank.builder.targetY = player.tank.builder.y;
      player.tank.builder.order = BuilderOrder.BUILDING_WALL;

      // Run until wall is built
      for (let i = 0; i < 20; i++) {
        tickSession(session, 1);
        if (world.getTerrainAt(50, 50) === TerrainType.BUILDING) break;
      }

      // Verify wall was built
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.BUILDING);

      // Verify 0.5 trees were deducted
      expect(player.tank.trees).toBe(1.5);
    });
  });

  describe('10e. Building Boats', () => {
    it('should set BUILDING_BOAT order when dispatched', () => {
      const builder = new ServerBuilder(1, 0);
      builder.sendToLocation(60, 60, 4); // BuildAction.BOAT
      expect(builder.order).toBe(BuilderOrder.BUILDING_BOAT);
    });

    it('should convert RIVER to BOAT when building', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      world.setTerrainAt(50, 50, TerrainType.RIVER);
      placeTankAtTile(player.tank, 49, 50);

      player.tank.builder.x = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.y = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.targetX = player.tank.builder.x;
      player.tank.builder.targetY = player.tank.builder.y;
      player.tank.builder.order = BuilderOrder.BUILDING_BOAT;
      player.tank.builder.trees = 5; // Boats cost 5 trees

      for (let i = 0; i < 40; i++) {
        tickSession(session, 1);
        if (world.getTerrainAt(50, 50) !== TerrainType.RIVER) break;
      }

      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.BOAT);
    });

    it('should only build boats on RIVER terrain', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      // Try to build on grass - should not work
      world.setTerrainAt(50, 50, TerrainType.GRASS);
      placeTankAtTile(player.tank, 49, 50);

      player.tank.builder.x = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.y = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.targetX = player.tank.builder.x;
      player.tank.builder.targetY = player.tank.builder.y;
      player.tank.builder.order = BuilderOrder.BUILDING_BOAT;

      tickSession(session, 30);

      // Should still be grass (builder recalled since wrong terrain)
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.GRASS);
    });

    it('should deduct 5 trees from tank when building boat via game session', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      world.setTerrainAt(50, 50, TerrainType.RIVER);
      placeTankAtTile(player.tank, 49, 50);

      // Give tank 10 trees
      player.tank.trees = 10;
      player.tank.builder.trees = 10;

      player.tank.builder.x = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.y = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.targetX = player.tank.builder.x;
      player.tank.builder.targetY = player.tank.builder.y;
      player.tank.builder.order = BuilderOrder.BUILDING_BOAT;

      // Run until boat is built (boats take 20 ticks)
      for (let i = 0; i < 40; i++) {
        tickSession(session, 1);
        if (world.getTerrainAt(50, 50) === TerrainType.BOAT) break;
      }

      // Verify boat was built
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.BOAT);

      // Verify 5 trees were deducted
      expect(player.tank.trees).toBe(5);
    });

    it('should recall builder if not enough trees for boat', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      world.setTerrainAt(50, 50, TerrainType.RIVER);
      placeTankAtTile(player.tank, 49, 50);

      // Give tank only 2 trees (not enough for boat which costs 5)
      player.tank.trees = 2;
      player.tank.builder.trees = 2;

      player.tank.builder.x = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.y = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.targetX = player.tank.builder.x;
      player.tank.builder.targetY = player.tank.builder.y;
      player.tank.builder.order = BuilderOrder.BUILDING_BOAT;

      // Run ticks
      tickSession(session, 30);

      // Verify boat was NOT built (not enough trees)
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.RIVER);

      // Verify builder was recalled (may be IN_TANK if already returned)
      expect([BuilderOrder.IN_TANK, BuilderOrder.RETURNING]).toContain(
        player.tank.builder.order
      );
    });
  });

  describe('10f. Laying Mines', () => {
    it('should set LAYING_MINE order when dispatched', () => {
      const builder = new ServerBuilder(1, 0);
      builder.sendToLocation(60, 60, 7, 5); // BuildAction.MINE, tankMines=5
      expect(builder.order).toBe(BuilderOrder.LAYING_MINE);
    });

    it('should take mine from tank inventory when dispatched', () => {
      const builder = new ServerBuilder(1, 0);
      builder.sendToLocation(60, 60, 7, 5);
      expect(builder.hasMine).toBe(true);
    });

    it('should place mine at target location via game session', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      // Place mine at tile (52,50), with tank at tile (50,50) so mine doesn't
      // immediately detonate under the tank
      fillArea(world, 48, 48, 10, 10, TerrainType.GRASS);
      placeTankAtTile(player.tank, 50, 50);
      player.tank.mines = 5;

      const builderWorldX = (52 + 0.5) * TILE_SIZE_WORLD;
      const builderWorldY = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.x = builderWorldX;
      player.tank.builder.y = builderWorldY;
      player.tank.builder.targetX = builderWorldX;
      player.tank.builder.targetY = builderWorldY;
      player.tank.builder.order = BuilderOrder.LAYING_MINE;
      player.tank.builder.hasMine = true;

      // Need enough ticks to hit a tick % 10 === 0 boundary
      for (let i = 0; i < 30; i++) {
        // Keep builder at target (builder.update inside tank.update moves it)
        player.tank.builder.x = builderWorldX;
        player.tank.builder.y = builderWorldY;
        tickSession(session, 1);
        if (world.hasMineAt(52, 50)) break;
      }

      expect(world.hasMineAt(52, 50)).toBe(true);
    });
  });

  describe('10g. Vulnerability', () => {
    // "If the man gets shot by another player while outside the tank"
    it.skip('should be killable by enemy fire while outside tank', () => {
      // Builder damage/death not yet implemented
    });

    it.skip('should prevent building during respawn delay', () => {
      // Builder respawn state not yet implemented
    });

    it.skip('should parachute new builder after respawn delay (255 ticks)', () => {
      // Builder respawn mechanic not yet implemented
    });
  });

  describe('10h. Forest Regrowth', () => {
    // "Forests grow all the time, so trees you farm will be replenished slowly"
    it.skip('should slowly regrow harvested forest tiles over time', () => {
      // Forest regrowth not yet implemented
    });

    it.skip('should convert GRASS back to FOREST after regrowth timer', () => {
      // Forest regrowth not yet implemented
    });
  });
});
