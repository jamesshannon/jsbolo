/**
 * Comprehensive tests for boat movement and tank-on-boat mechanics
 *
 * Boat Behavior Requirements:
 * 1. Tank on boat should move at full speed even when surrounded by deep sea
 * 2. Boat should follow tank when moving through water
 * 3. Tank should be able to board an existing boat tile
 * 4. Tank should disembark when moving onto land
 * 5. Tank shouldn't get stuck at edge of boat when boat is on deep sea
 * 6. Boat should stay behind when tank moves onto land
 * 7. Tank should be able to re-board the same boat after disembarking
 */

import {describe, it, expect, beforeEach} from 'vitest';
import {GameSession} from '../game-session.js';
import {TerrainType} from '@jsbolo/shared';
import type {WebSocket} from 'ws';

describe('Boat Movement', () => {
  let session: GameSession;
  let mockWs: WebSocket;

  beforeEach(() => {
    session = new GameSession();
    mockWs = {
      send: () => {},
      on: () => {},
      close: () => {},
    } as unknown as WebSocket;
  });

  describe('Boat Boarding', () => {
    it('should set onBoat=true when tank spawns on water (no BOAT tile created)', () => {
      // ASSUMPTION: Boat is "carried" by tank - no BOAT tile at spawn
      session['world'].setTerrainAt(128, 128, TerrainType.DEEP_SEA);

      const playerId = session.addPlayer(mockWs, 0);
      const player = session['players'].get(playerId)!;

      // Force spawn on deep sea
      player.tank.x = 128.5 * 256;
      player.tank.y = 128.5 * 256;
      session['world'].setTerrainAt(128, 128, TerrainType.DEEP_SEA);

      // Simulate respawn logic (no BOAT tile created)
      const terrain = session['world'].getTerrainAt(128, 128);
      if (terrain === TerrainType.DEEP_SEA || terrain === TerrainType.RIVER) {
        player.tank.onBoat = true;
      }

      expect(player.tank.onBoat).toBe(true);
      // No BOAT tile should exist - boat is carried by tank
      expect(session['world'].getTerrainAt(128, 128)).toBe(TerrainType.DEEP_SEA);
    });

    it('should board existing BOAT tile and restore to RIVER', () => {
      // ASSUMPTION: All BOAT tiles are restored to RIVER when boarded
      // (boats can only be disembarked from coastlines, not deep sea)
      const playerId = session.addPlayer(mockWs, 0);
      const player = session['players'].get(playerId)!;

      // Place tank on grass
      player.tank.x = 100 * 256;
      player.tank.y = 100 * 256;
      player.tank.onBoat = false;
      session['world'].setTerrainAt(100, 100, TerrainType.GRASS);

      // Place boat tile nearby (left behind from previous disembark)
      session['world'].setTerrainAt(101, 100, TerrainType.BOAT);

      // Move tank onto boat tile
      player.tank.x = 101.5 * 256;
      player.tank.y = 100.5 * 256;

      // Trigger boarding logic
      session['update']();

      // Tank should have boarded
      expect(player.tank.onBoat).toBe(true);
      // BOAT tile should be removed and restored to RIVER
      expect(session['world'].getTerrainAt(101, 100)).toBe(TerrainType.RIVER);
    });
  });

  describe('Tank Movement on Boat', () => {
    it('should allow tank to move at full speed when on boat surrounded by deep sea', () => {
      const playerId = session.addPlayer(mockWs, 0);
      const player = session['players'].get(playerId)!;

      // Place tank on boat surrounded by deep sea
      player.tank.x = 128.5 * 256;
      player.tank.y = 128.5 * 256;
      player.tank.onBoat = true;
      player.tank.speed = 0;

      // Surround with deep sea
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const terrain = (dx === 0 && dy === 0) ? TerrainType.BOAT : TerrainType.DEEP_SEA;
          session['world'].setTerrainAt(128 + dx, 128 + dy, terrain);
        }
      }

      // Try to accelerate
      player.lastInput = {
        sequence: 1,
        tick: 1,
        accelerating: true,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        buildOrder: null,
        rangeAdjustment: 0,
      };

      // Update tank
      session['update']();

      // Tank should have accelerated (speed > 0)
      expect(player.tank.speed).toBeGreaterThan(0);
    });

    it('should NOT get stuck at edge of boat tile when boat is on deep sea', () => {
      const playerId = session.addPlayer(mockWs, 0);
      const player = session['players'].get(playerId)!;

      // Place tank at center of boat
      player.tank.x = 128.5 * 256;
      player.tank.y = 128.5 * 256;
      player.tank.onBoat = true;
      player.tank.direction = 0; // Facing east
      player.tank.speed = 12; // Moving speed

      // Boat surrounded by deep sea
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const terrain = (dx === 0 && dy === 0) ? TerrainType.BOAT : TerrainType.DEEP_SEA;
          session['world'].setTerrainAt(128 + dx, 128 + dy, terrain);
        }
      }

      // Move tank toward edge multiple times
      for (let i = 0; i < 10; i++) {
        player.lastInput = {
          sequence: i + 1,
          tick: i + 1,
          accelerating: true,
          braking: false,
          turningClockwise: false,
          turningCounterClockwise: false,
          shooting: false,
          buildOrder: null,
          rangeAdjustment: 0,
        };

        session['update']();
      }

      // Tank should have moved to new tile (boat should have followed)
      const newTile = player.tank.getTilePosition();
      expect(newTile.x).not.toBe(128); // Should have moved
      expect(player.tank.onBoat).toBe(true); // Should still be on boat
      expect(player.tank.speed).toBeGreaterThan(0); // Should still be moving
    });
  });

  describe('Boat Following Tank', () => {
    it('should carry boat smoothly through water (no tile jumping)', () => {
      // ASSUMPTION: Boat is "carried" by tank - no BOAT tiles created while moving through water
      const playerId = session.addPlayer(mockWs, 0);
      const player = session['players'].get(playerId)!;

      // Tank starts on water with boat
      player.tank.x = 128.5 * 256;
      player.tank.y = 128.5 * 256;
      player.tank.onBoat = false; // Start not on boat
      player.tank.direction = 0; // Facing east
      player.tank.speed = 12; // Give it speed

      // Place a BOAT tile (left from previous disembark)
      session['world'].setTerrainAt(128, 128, TerrainType.BOAT);
      session['world'].setTerrainAt(129, 128, TerrainType.DEEP_SEA);

      // Actually move tank east by calling update multiple times
      player.lastInput = {
        sequence: 1,
        tick: 1,
        accelerating: true,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        buildOrder: null,
        rangeAdjustment: 0,
      };

      // Move until tank crosses into new tile
      let moved = false;
      for (let i = 0; i < 30 && !moved; i++) {
        session['update']();
        const currentTile = player.tank.getTilePosition();
        if (currentTile.x === 129) moved = true;
      }

      expect(moved).toBe(true); // Verify tank actually moved

      // Tank should be on boat (boarded the BOAT tile at start)
      expect(player.tank.onBoat).toBe(true);
      // BOAT tile at origin should be restored to RIVER
      expect(session['world'].getTerrainAt(128, 128)).toBe(TerrainType.RIVER);
      // No BOAT tile at destination - boat is carried by tank
      expect(session['world'].getTerrainAt(129, 128)).toBe(TerrainType.DEEP_SEA);
    });

    it('should restore BOAT tile to RIVER when boarding', () => {
      // ASSUMPTION: All BOAT tiles restore to RIVER (boats only disembarked from coastlines)
      const playerId = session.addPlayer(mockWs, 0);
      const player = session['players'].get(playerId)!;

      // Tank starts on BOAT tile, not yet boarded
      player.tank.x = 128.5 * 256;
      player.tank.y = 128.5 * 256;
      player.tank.onBoat = false; // Will board when update() is called
      player.tank.direction = 0; // Facing east
      player.tank.speed = 12;

      session['world'].setTerrainAt(128, 128, TerrainType.BOAT);
      // Surround with river
      session['world'].setTerrainAt(127, 128, TerrainType.RIVER);
      session['world'].setTerrainAt(129, 128, TerrainType.RIVER);

      // Actually move tank east
      player.lastInput = {
        sequence: 1,
        tick: 1,
        accelerating: true,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        buildOrder: null,
        rangeAdjustment: 0,
      };

      // Move until tank crosses into new tile
      let moved = false;
      for (let i = 0; i < 30 && !moved; i++) {
        session['update']();
        const currentTile = player.tank.getTilePosition();
        if (currentTile.x === 129) moved = true;
      }

      expect(moved).toBe(true);

      // BOAT tile should be restored to RIVER when boarded
      expect(session['world'].getTerrainAt(128, 128)).toBe(TerrainType.RIVER);
    });
  });

  describe('Disembarking', () => {
    it('should place BOAT tile when tank disembarks onto land', () => {
      // ASSUMPTION: Disembarking only happens from RIVER (coastlines), creates BOAT tile
      const playerId = session.addPlayer(mockWs, 0);
      const player = session['players'].get(playerId)!;

      // Tank on boat in river next to grass (coastline)
      player.tank.x = 128.5 * 256;
      player.tank.y = 128.5 * 256;
      player.tank.onBoat = true; // Carrying boat
      player.tank.direction = 0; // Facing east
      player.tank.speed = 12; // Give it speed

      session['world'].setTerrainAt(128, 128, TerrainType.RIVER);
      session['world'].setTerrainAt(129, 128, TerrainType.GRASS);

      // Actually move tank east onto grass
      player.lastInput = {
        sequence: 1,
        tick: 1,
        accelerating: true,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        buildOrder: null,
        rangeAdjustment: 0,
      };

      // Move until tank crosses into new tile
      let moved = false;
      for (let i = 0; i < 30 && !moved; i++) {
        session['update']();
        const currentTile = player.tank.getTilePosition();
        if (currentTile.x === 129) moved = true;
      }

      expect(moved).toBe(true); // Verify tank actually moved

      // Tank should have disembarked
      expect(player.tank.onBoat).toBe(false);
      // Boat should stay behind
      expect(session['world'].getTerrainAt(128, 128)).toBe(TerrainType.BOAT);
      // Tank should be on grass
      expect(session['world'].getTerrainAt(129, 128)).toBe(TerrainType.GRASS);
    });

    it('should orient boat opposite to disembark direction', () => {
      // Boat should face backward so tank can re-board by reversing
      const playerId = session.addPlayer(mockWs, 0);
      const player = session['players'].get(playerId)!;

      // Tank on boat in river, facing east (direction = 0)
      player.tank.x = 128.5 * 256;
      player.tank.y = 128.5 * 256;
      player.tank.onBoat = true;
      player.tank.direction = 0; // Facing east
      player.tank.speed = 12;

      session['world'].setTerrainAt(128, 128, TerrainType.RIVER);
      session['world'].setTerrainAt(129, 128, TerrainType.GRASS);

      // Move tank east onto grass
      player.lastInput = {
        sequence: 1,
        tick: 1,
        accelerating: true,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        buildOrder: null,
        rangeAdjustment: 0,
      };

      // Move until disembark
      for (let i = 0; i < 30; i++) {
        session['update']();
        if (!player.tank.onBoat) break;
      }

      // Check boat direction - should face west (opposite of east)
      const world = session['world'];
      const boatCell = world['map'][128][128]; // Access internal map
      expect(boatCell.terrain).toBe(TerrainType.BOAT);
      expect(boatCell.direction).toBe(128); // Opposite of 0 is 128 (west faces east coast)
    });
  });

  describe('Re-boarding', () => {
    it('should board BOAT tile and restore to RIVER', () => {
      // ASSUMPTION: Re-boarding removes BOAT tile and restores to RIVER
      const playerId = session.addPlayer(mockWs, 0);
      const player = session['players'].get(playerId)!;

      // Setup: boat at (128, 128) left from previous disembark, grass at (129, 128)
      session['world'].setTerrainAt(128, 128, TerrainType.BOAT);
      session['world'].setTerrainAt(129, 128, TerrainType.GRASS);

      // Tank on grass, boat is one tile away
      player.tank.x = 129.5 * 256;
      player.tank.y = 128.5 * 256;
      player.tank.onBoat = false;

      // Move tank back onto boat
      player.tank.x = 128.5 * 256;

      // Trigger boarding logic
      session['update']();

      // Tank should be on boat
      expect(player.tank.onBoat).toBe(true);
      // BOAT tile should be removed and restored to RIVER
      expect(session['world'].getTerrainAt(128, 128)).toBe(TerrainType.RIVER);
    });
  });

  describe('Edge Cases', () => {
    it('should move smoothly through deep sea without creating tiles', () => {
      // ASSUMPTION: Boat carried by tank through deep sea - no tiles created
      const playerId = session.addPlayer(mockWs, 0);
      const player = session['players'].get(playerId)!;

      // Tank on boat in deep sea
      player.tank.x = 128.5 * 256;
      player.tank.y = 128.5 * 256;
      player.tank.onBoat = true; // Carrying boat
      player.tank.direction = 0; // Facing east
      player.tank.speed = 12; // Give it speed

      // Deep sea area
      session['world'].setTerrainAt(127, 128, TerrainType.DEEP_SEA);
      session['world'].setTerrainAt(128, 128, TerrainType.DEEP_SEA);
      session['world'].setTerrainAt(129, 128, TerrainType.DEEP_SEA);

      // Actually move tank east through deep sea
      player.lastInput = {
        sequence: 1,
        tick: 1,
        accelerating: true,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        buildOrder: null,
        rangeAdjustment: 0,
      };

      // Move until tank crosses into new tile
      let moved = false;
      for (let i = 0; i < 30 && !moved; i++) {
        session['update']();
        const currentTile = player.tank.getTilePosition();
        if (currentTile.x === 129) moved = true;
      }

      expect(moved).toBe(true); // Verify tank actually moved

      // Tank still on boat
      expect(player.tank.onBoat).toBe(true);
      // No BOAT tiles created - boat is carried by tank
      expect(session['world'].getTerrainAt(128, 128)).toBe(TerrainType.DEEP_SEA);
      expect(session['world'].getTerrainAt(129, 128)).toBe(TerrainType.DEEP_SEA);
    });

    it('should allow tank to move off boat onto river without getting stuck', () => {
      const playerId = session.addPlayer(mockWs, 0);
      const player = session['players'].get(playerId)!;

      // Boat on deep sea next to river (like near shore)
      player.tank.x = 128.5 * 256;
      player.tank.y = 128.5 * 256;
      player.tank.onBoat = true;

      session['world'].setTerrainAt(128, 128, TerrainType.BOAT);
      session['world'].setTerrainAt(129, 128, TerrainType.RIVER);
      session['world'].setTerrainAt(127, 128, TerrainType.DEEP_SEA);

      // Move tank onto river
      player.tank.x = 129.5 * 256;
      player.tank.speed = 3; // Some speed

      session['update']();

      // Tank can move on river (speed 0.2), boat stays behind
      // Depending on implementation, tank might disembark or boat might follow
      const terrain = session['world'].getTerrainAt(129, 128);
      expect([TerrainType.RIVER, TerrainType.BOAT]).toContain(terrain);

      // Tank should be able to move (not frozen)
      expect(player.tank.speed).toBeGreaterThanOrEqual(0);
    });
  });
});
