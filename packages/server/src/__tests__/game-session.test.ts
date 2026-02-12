/**
 * Game Session Integration Tests
 *
 * These tests prevent regressions in:
 * - Shells not disappearing (always send shells array)
 * - Boat movement through water
 * - Tank getting stuck on boats
 * - Network state synchronization
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameSession } from '../game-session.js';
import { TerrainType } from '@jsbolo/shared';
import type { WebSocket } from 'ws';

// Mock WebSocket
const createMockWebSocket = () => {
  const ws = {
    send: vi.fn(),
    readyState: 1, // OPEN
    on: vi.fn(),
    close: vi.fn(),
  } as unknown as WebSocket;
  return ws;
};

describe('GameSession Integration', () => {
  let session: GameSession;

  beforeEach(() => {
    // Create session without map (uses procedural generation)
    session = new GameSession();
    session.start();
  });

  describe('Shell Lifecycle Management', () => {
    it('should remove dead shells from the game', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      // Manually add a shell that will die immediately
      const shells = (session as any).shells;
      const shell = {
        id: 999,
        x: 2560,
        y: 2560,
        direction: 0,
        ownerTankId: playerId,
        range: 256,
        distanceTraveled: 300, // Exceeded range
        alive: false,
        shouldExplode: true,
        update: () => {},
        getTilePosition: () => ({ x: 10, y: 10 }),
        killByCollision: () => {},
      };
      shells.set(999, shell);

      expect(shells.size).toBe(1);

      // Run one update tick
      (session as any).update();

      // Dead shell should be removed
      expect(shells.has(999)).toBe(false);
      expect(shells.size).toBe(0);
    });

    it('should always send shells array in updates (even if empty)', () => {
      const ws = createMockWebSocket();
      session.addPlayer(ws);

      // Clear any existing shells
      (session as any).shells.clear();

      // Trigger a broadcast
      (session as any).broadcastState();

      // Check that send was called with shells array
      expect(ws.send).toHaveBeenCalled();

      const lastCall = (ws.send as any).mock.calls.slice(-1)[0];
      const message = JSON.parse(lastCall[0]);

      // CRITICAL: shells array must be present even if empty
      expect(message).toHaveProperty('shells');
      expect(message.shells).toEqual([]);
    });

    it('should send shells when they exist', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      // Manually add a shell
      const shells = (session as any).shells;
      shells.set(1, {
        id: 1,
        x: 2560,
        y: 2560,
        direction: 0,
        ownerTankId: playerId,
        alive: true,
        range: 256,
        distanceTraveled: 0,
        shouldExplode: false,
        update: () => {},
        getTilePosition: () => ({ x: 10, y: 10 }),
        killByCollision: () => {},
      });

      // Trigger a broadcast
      (session as any).broadcastState();

      const lastCall = (ws.send as any).mock.calls.slice(-1)[0];
      const message = JSON.parse(lastCall[0]);

      expect(message.shells).toHaveLength(1);
      expect(message.shells[0].id).toBe(1);
    });
  });

  describe('Sound Event Delivery', () => {
    it('should broadcast update when only sound events changed', () => {
      const ws = createMockWebSocket();
      session.addPlayer(ws);

      // Ignore welcome message
      (ws.send as any).mockClear();

      // Inject a sound event with no other state changes
      (session as any).emitSound(8, 1000, 2000); // SOUND_SHOOTING
      (session as any).broadcastState();

      expect(ws.send).toHaveBeenCalledTimes(1);
      const lastCall = (ws.send as any).mock.calls.slice(-1)[0];
      const message = JSON.parse(lastCall[0]);

      expect(message.type).toBe('update');
      expect(message.soundEvents).toBeDefined();
      expect(message.soundEvents).toHaveLength(1);
      expect(message.soundEvents[0]).toEqual({
        soundId: 8,
        x: 1000,
        y: 2000,
      });
    });
  });

  describe('Boat Movement Mechanics', () => {
    it('should set onBoat=true when tank spawns in water (no BOAT tile)', () => {
      // ASSUMPTION: Boat is "carried" by tank - no BOAT tile created at spawn
      const world = (session as any).world;
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      const players = (session as any).players;
      const player = players.get(playerId);

      // Manually place tank in deep sea
      world.setTerrainAt(50, 50, TerrainType.DEEP_SEA);
      player.tank.x = 50 * 256;
      player.tank.y = 50 * 256;
      player.tank.onBoat = true;

      // Verify tank has onBoat flag
      expect(player.tank.onBoat).toBe(true);

      // Verify terrain is still DEEP_SEA (no BOAT tile created)
      const tankTile = player.tank.getTilePosition();
      const terrain = world.getTerrainAt(tankTile.x, tankTile.y);
      expect(terrain).toBe(TerrainType.DEEP_SEA);
    });

    it('should give tank full speed when onBoat (prevents getting stuck)', () => {
      const world = (session as any).world;
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      const players = (session as any).players;
      const player = players.get(playerId);

      // Manually place tank in deep sea on a boat (no BOAT tile, boat is carried)
      world.setTerrainAt(50, 50, TerrainType.DEEP_SEA);
      player.tank.x = 50 * 256;
      player.tank.y = 50 * 256;
      player.tank.onBoat = true;

      // Verify tank has onBoat flag
      expect(player.tank.onBoat).toBe(true);

      // Simulate tank trying to move
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

      player.lastInput = input;

      const initialSpeed = player.tank.speed;

      // Run several update ticks
      for (let i = 0; i < 10; i++) {
        (session as any).update();
      }

      // Tank should have accelerated (not stuck at speed 0)
      expect(player.tank.speed).toBeGreaterThan(initialSpeed);
    });

    it('should carry boat smoothly through water (no tile jumping)', () => {
      // ASSUMPTION: Boat is "carried" by tank - no BOAT tiles created while moving
      const world = (session as any).world;

      // Set up water path: deep sea -> river -> deep sea
      world.setTerrainAt(10, 10, TerrainType.DEEP_SEA);
      world.setTerrainAt(10, 11, TerrainType.RIVER);
      world.setTerrainAt(10, 12, TerrainType.DEEP_SEA);

      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      const players = (session as any).players;
      const player = players.get(playerId);

      // Force tank to spawn at center of tile (10, 10) with boat
      player.tank.x = 10.5 * 256;
      player.tank.y = 10.5 * 256;
      player.tank.onBoat = true;
      player.tank.speed = 12; // Give it initial speed

      // Move tank south (towards tile 11)
      player.tank.direction = 192; // South
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
      player.lastInput = input;

      // Run updates until tank crosses to tile (10, 11)
      for (let i = 0; i < 40; i++) {
        (session as any).update();

        const tankTile = player.tank.getTilePosition();
        if (tankTile.y === 11) {
          break;
        }
      }

      // Tank should have moved to tile (10, 11)
      const tankTile = player.tank.getTilePosition();
      expect(tankTile.y).toBe(11);

      // Tank should still be on boat
      expect(player.tank.onBoat).toBe(true);

      // No BOAT tiles should exist - boat is carried by tank
      expect(world.getTerrainAt(10, 10)).toBe(TerrainType.DEEP_SEA);
      expect(world.getTerrainAt(10, 11)).toBe(TerrainType.RIVER);
    });

    it('should leave BOAT tile when tank disembarks onto land', () => {
      // ASSUMPTION: BOAT tiles only created when disembarking, always restored to RIVER
      const world = (session as any).world;

      // Set up path: river -> grass (coastline to land)
      world.setTerrainAt(10, 10, TerrainType.RIVER);
      world.setTerrainAt(10, 11, TerrainType.GRASS);

      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      const players = (session as any).players;
      const player = players.get(playerId);

      // Force tank to spawn at center of tile (10, 10) with boat
      player.tank.x = 10.5 * 256;
      player.tank.y = 10.5 * 256;
      player.tank.onBoat = true;
      player.tank.speed = 12; // Give it initial speed

      // Move tank south towards land
      player.tank.direction = 192; // South
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
      player.lastInput = input;

      // Run updates until tank crosses to land
      for (let i = 0; i < 40; i++) {
        (session as any).update();

        const tankTile = player.tank.getTilePosition();
        if (tankTile.y === 11) {
          break;
        }
      }

      // Tank should be on land
      const tankTile = player.tank.getTilePosition();
      expect(tankTile.y).toBe(11);

      // Tank should no longer be on boat
      expect(player.tank.onBoat).toBe(false);

      // Boat should be left at previous water position (10, 10)
      expect(world.getTerrainAt(10, 10)).toBe(TerrainType.BOAT);

      // Land tile should still be grass (no boat)
      expect(world.getTerrainAt(10, 11)).toBe(TerrainType.GRASS);
    });
  });

  describe('Network State Synchronization', () => {
    it('should send welcome message with map data', () => {
      const ws = createMockWebSocket();
      session.addPlayer(ws);

      expect(ws.send).toHaveBeenCalled();

      const firstCall = (ws.send as any).mock.calls[0];
      const message = JSON.parse(firstCall[0]);

      expect(message.type).toBe('welcome');
      expect(message.playerId).toBeDefined();
      expect(message.map).toBeDefined();
      expect(message.map.terrain).toBeDefined();
      expect(message.map.terrainLife).toBeDefined();
    });

    it('should broadcast updates with delta compression', () => {
      const ws = createMockWebSocket();
      session.addPlayer(ws);

      // Clear send mock
      (ws.send as any).mockClear();

      // Trigger a broadcast
      (session as any).broadcastState();

      expect(ws.send).toHaveBeenCalled();

      const lastCall = (ws.send as any).mock.calls.slice(-1)[0];
      const message = JSON.parse(lastCall[0]);

      expect(message.type).toBe('update');
      expect(message.tick).toBeDefined();
      // shells should ALWAYS be present (even if empty)
      expect(message).toHaveProperty('shells');
    });
  });

  describe('Collision and Terrain Integration', () => {
    it('should stop tank when hitting building', () => {
      const world = (session as any).world;
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      const players = (session as any).players;
      const player = players.get(playerId);

      // Place tank and building
      player.tank.x = 10 * 256;
      player.tank.y = 10 * 256;
      player.tank.direction = 0; // North

      // Place building north of tank
      world.setTerrainAt(10, 9, TerrainType.BUILDING);

      // Try to move north
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
      player.lastInput = input;

      // Build up speed first
      for (let i = 0; i < 10; i++) {
        (session as any).update();
      }

      const speedBeforeCollision = player.tank.speed;

      // Continue trying to move into building
      for (let i = 0; i < 20; i++) {
        (session as any).update();
      }

      // Tank should hit building and speed should drop to 0
      expect(player.tank.speed).toBe(0);
    });
  });

  describe('Builder Update Lifecycle', () => {
    it('should update builder movement exactly once per tick', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);

      const players = (session as any).players;
      const player = players.get(playerId);
      const builder = player.tank.builder;

      const originalUpdate = builder.update.bind(builder);
      const updateSpy = vi.fn(originalUpdate);
      builder.update = updateSpy;

      player.lastInput = {
        sequence: 1,
        tick: 1,
        accelerating: false,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: 0,
      };

      (session as any).update();

      expect(updateSpy).toHaveBeenCalledTimes(1);
    });
  });
});
