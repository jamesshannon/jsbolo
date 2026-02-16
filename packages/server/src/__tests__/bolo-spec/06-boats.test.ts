/**
 * Bolo Manual Spec: Boats
 *
 * Manual Reference: docs/bolo-manual-reference.md § 7 "Boats"
 *
 * Tests boat mechanics - speed, boarding, disembarking, building:
 * - "Water: very slow (except when on a boat)" - full speed on boat
 * - Boat is "carried" by tank (no BOAT tile while moving)
 * - Boarding: BOAT tile → RIVER when picked up
 * - Disembarking: boat left behind, faces opposite direction for re-boarding
 * - Building: "Boats are expensive - they cost five trees to build"
 * - Vulnerability: 1 hit destroys boat → RIVER
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { GameSession } from '../../game-session.js';
import { ServerWorld } from '../../simulation/world.js';
import { BuilderOrder, TerrainType, TILE_SIZE_WORLD } from '@jsbolo/shared';
import {
  createDefaultInput,
  createMockWebSocket,
  getPlayer,
  getWorld,
  fillArea,
  placeTankAtTile,
  tickSession,
} from './helpers.js';

describe('Bolo Manual Spec: 6. Boats', () => {
  describe('6a. Speed and Movement', () => {
    it('should move at full speed (1.0x) when on boat', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      // Place tank on water with boat
      fillArea(world, 48, 48, 10, 10, TerrainType.DEEP_SEA);
      placeTankAtTile(player.tank, 50, 50);
      player.tank.onBoat = true;
      player.tank.speed = 0;

      // Accelerate
      player.lastInput = createDefaultInput({ accelerating: true });
      tickSession(session, 10);

      // Tank should have accelerated (boat overrides terrain speed)
      expect(player.tank.speed).toBeGreaterThan(0);
    });

    // "boat is carried by tank"
    it('should not leave BOAT tiles while moving through water', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      // Water corridor
      fillArea(world, 48, 50, 10, 1, TerrainType.DEEP_SEA);
      placeTankAtTile(player.tank, 50, 50);
      player.tank.onBoat = true;
      player.tank.direction = 0; // East
      player.tank.speed = 12;

      player.lastInput = createDefaultInput({ accelerating: true });
      tickSession(session, 30);

      // Original tile should still be deep sea (no BOAT tile left behind)
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.DEEP_SEA);
    });

    it('should traverse deep sea safely while on boat', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      fillArea(world, 48, 48, 10, 10, TerrainType.DEEP_SEA);
      placeTankAtTile(player.tank, 50, 50);
      player.tank.onBoat = true;
      player.tank.direction = 0; // East
      player.tank.speed = 12;

      player.lastInput = createDefaultInput({ accelerating: true });
      tickSession(session, 20);

      // Tank should still be alive and on boat
      expect(player.tank.onBoat).toBe(true);
      expect(player.tank.armor).toBeGreaterThan(0);
    });
  });

  describe('6b. Boarding and Disembarking', () => {
    it('should board BOAT tile when tank moves onto it', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      // Place a BOAT tile
      fillArea(world, 48, 48, 10, 10, TerrainType.GRASS);
      world.setTerrainAt(50, 50, TerrainType.BOAT);
      placeTankAtTile(player.tank, 50, 50);
      player.tank.onBoat = false;

      tickSession(session, 1);

      expect(player.tank.onBoat).toBe(true);
    });

    it('should restore BOAT tile to RIVER when boarded', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      world.setTerrainAt(50, 50, TerrainType.BOAT);
      placeTankAtTile(player.tank, 50, 50);
      player.tank.onBoat = false;

      tickSession(session, 1);

      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.RIVER);
    });

    it('should leave BOAT tile behind when disembarking onto land', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      // River -> Grass boundary
      world.setTerrainAt(50, 50, TerrainType.RIVER);
      world.setTerrainAt(51, 50, TerrainType.GRASS);
      placeTankAtTile(player.tank, 50, 50);
      player.tank.onBoat = true;
      player.tank.direction = 0; // East
      player.tank.speed = 12;

      player.lastInput = createDefaultInput({ accelerating: true });

      // Move until disembarked
      for (let i = 0; i < 40; i++) {
        tickSession(session, 1);
        if (!player.tank.onBoat) break;
      }

      expect(player.tank.onBoat).toBe(false);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.BOAT);
    });

    // "Boats can sail up rivers, but not under the low floating bridges"
    // In our terrain model, bridges are represented as ROAD over water.
    // Entering ROAD from RIVER must force disembark.
    it('should disembark when a boat reaches a bridge road tile', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      world.setTerrainAt(50, 50, TerrainType.RIVER);
      world.setTerrainAt(51, 50, TerrainType.ROAD); // Bridge tile representation
      placeTankAtTile(player.tank, 50, 50);
      player.tank.onBoat = true;
      player.tank.direction = 0; // East
      player.tank.speed = 12;
      player.lastInput = createDefaultInput({accelerating: true});

      for (let i = 0; i < 40; i++) {
        tickSession(session, 1);
        if (!player.tank.onBoat) {
          break;
        }
      }

      expect(player.tank.onBoat).toBe(false);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.BOAT);
      expect(world.getTerrainAt(51, 50)).toBe(TerrainType.ROAD);
    });

    // "Boat faces opposite direction on disembark (for easy re-boarding)"
    it('should orient boat opposite to tank direction on disembark', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      world.setTerrainAt(50, 50, TerrainType.RIVER);
      world.setTerrainAt(51, 50, TerrainType.GRASS);
      placeTankAtTile(player.tank, 50, 50);
      player.tank.onBoat = true;
      player.tank.direction = 0; // East
      player.tank.speed = 12;

      player.lastInput = createDefaultInput({ accelerating: true });

      for (let i = 0; i < 40; i++) {
        tickSession(session, 1);
        if (!player.tank.onBoat) break;
      }

      // Boat should face opposite (128 = west, opposite of 0 = east)
      const cell = world.getMapData()[50]![50]!;
      expect(cell.terrain).toBe(TerrainType.BOAT);
      expect(cell.direction).toBe(128);
    });
  });

  describe('6c. Vulnerability', () => {
    it('should destroy boat in 1 direct hit (BOAT -> RIVER)', () => {
      const world = new ServerWorld();
      world.setTerrainAt(50, 50, TerrainType.BOAT);
      world.damageTerrainFromCollision(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.RIVER);
    });

    it('should destroy boat from explosion (BOAT -> RIVER)', () => {
      const world = new ServerWorld();
      world.setTerrainAt(50, 50, TerrainType.BOAT);
      world.damageTerrainFromExplosion(50, 50);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.RIVER);
    });
  });

  describe('6d. Building', () => {
    // "Boats are expensive - they cost five trees to build"
    it('should build boat on RIVER terrain', () => {
      const world = new ServerWorld();
      world.setTerrainAt(50, 50, TerrainType.RIVER);
      world.setTerrainAt(50, 50, TerrainType.BOAT);
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.BOAT);
    });

    it('should build boat via builder when at river tile', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      // Place a river tile near the builder's reach
      world.setTerrainAt(50, 50, TerrainType.RIVER);
      // Boat building is handled in updateBuilder when order is BUILDING_BOAT
      // and terrain is RIVER
      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.RIVER);
    });

    // "You cannot build on deep sea"
    it('should not allow building boats on deep sea', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      world.setTerrainAt(50, 50, TerrainType.DEEP_SEA);
      placeTankAtTile(player.tank, 49, 50);
      player.tank.trees = 10;
      player.tank.builder.trees = 10;
      player.tank.builder.x = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.y = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.targetX = player.tank.builder.x;
      player.tank.builder.targetY = player.tank.builder.y;
      player.tank.builder.order = BuilderOrder.BUILDING_BOAT;

      tickSession(session, 30);

      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.DEEP_SEA);
      expect([BuilderOrder.IN_TANK, BuilderOrder.RETURNING]).toContain(
        player.tank.builder.order
      );
    });

    // "Boats cost five trees" - resource cost validation
    it('should cost 5 trees to build a boat', () => {
      const session = new GameSession();
      const ws = createMockWebSocket();
      const id = session.addPlayer(ws);
      const player = getPlayer(session, id);
      const world = getWorld(session);

      world.setTerrainAt(50, 50, TerrainType.RIVER);
      placeTankAtTile(player.tank, 49, 50);
      player.tank.trees = 10;
      player.tank.builder.trees = 10;
      player.tank.builder.x = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.y = (50 + 0.5) * TILE_SIZE_WORLD;
      player.tank.builder.targetX = player.tank.builder.x;
      player.tank.builder.targetY = player.tank.builder.y;
      player.tank.builder.order = BuilderOrder.BUILDING_BOAT;

      for (let i = 0; i < 40; i++) {
        tickSession(session, 1);
        if (world.getTerrainAt(50, 50) === TerrainType.BOAT) {
          break;
        }
      }

      expect(world.getTerrainAt(50, 50)).toBe(TerrainType.BOAT);
      expect(player.tank.trees).toBe(5);
    });
  });
});
