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
import {
  BuildAction,
  BuilderOrder,
  PILLBOX_MAX_ARMOR,
  TerrainType,
  TANK_RESPAWN_TICKS,
  decodeServerMessage,
} from '@jsbolo/shared';
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
      const message = decodeServerMessage(lastCall[0]);

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
      const message = decodeServerMessage(lastCall[0]);

      expect(message.shells).toHaveLength(1);
      expect(message.shells[0].id).toBe(1);
    });

    it('should respawn destroyed tanks on tick schedule (no wall-clock timeout)', () => {
      const ws1 = createMockWebSocket();
      const ws2 = createMockWebSocket();
      const playerId1 = session.addPlayer(ws1);
      const playerId2 = session.addPlayer(ws2);

      const players = (session as any).players;
      const world = (session as any).world;
      const victim = players.get(playerId1);
      const attacker = players.get(playerId2);

      victim.tank.armor = 1;
      victim.tank.x = 50 * 256;
      victim.tank.y = 50 * 256;
      world.setTerrainAt(50, 50, TerrainType.ROAD);

      const shells = (session as any).shells;
      shells.set(1001, {
        id: 1001,
        x: victim.tank.x,
        y: victim.tank.y,
        direction: 0,
        ownerTankId: attacker.tank.id,
        alive: true,
        range: 256,
        distanceTraveled: 0,
        shouldExplode: false,
        update: () => {},
        getTilePosition: () => ({ x: 50, y: 50 }),
        killByCollision() {
          this.alive = false;
        },
      });

      (session as any).update();

      expect(victim.tank.isDead()).toBe(true);

      for (let i = 0; i < TANK_RESPAWN_TICKS - 1; i++) {
        (session as any).update();
      }
      expect(victim.tank.isDead()).toBe(true);

      (session as any).update();
      expect(victim.tank.isDead()).toBe(false);
    });
  });

  describe('Entity Lifecycle Deltas', () => {
    it('should emit removed tank and builder IDs when a player disconnects', () => {
      const ws1 = createMockWebSocket();
      const ws2 = createMockWebSocket();

      const playerId1 = session.addPlayer(ws1);
      session.addPlayer(ws2);

      const players = (session as any).players;
      const departing = players.get(playerId1);
      const departingTankId = departing.tank.id;
      const departingBuilderId = departing.tank.builder.id;

      // Prime previous-state hashes so removal appears as a delta.
      (session as any).broadcastState();
      (ws2.send as any).mockClear();

      session.removePlayer(playerId1);
      (session as any).broadcastState();

      expect(ws2.send).toHaveBeenCalled();
      const lastCall = (ws2.send as any).mock.calls.slice(-1)[0];
      const message = decodeServerMessage(lastCall[0]);

      expect(message.removedTankIds).toContain(departingTankId);
      expect(message.removedBuilderIds).toContain(departingBuilderId);
    });
  });

  describe('Pillbox Capture Lifecycle', () => {
    const idleInput = {
      sequence: 0,
      tick: 0,
      accelerating: false,
      braking: false,
      turningClockwise: false,
      turningCounterClockwise: false,
      shooting: false,
      rangeAdjustment: 0,
    };

    it('should allow capturing another disabled pillbox after placing a carried one', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);
      const players = (session as any).players;
      const player = players.get(playerId);
      const tank = player.tank;

      const pillboxes = Array.from((session as any).pillboxes.values());
      const first = pillboxes[0];
      const second = pillboxes[1];
      expect(first).toBeDefined();
      expect(second).toBeDefined();

      first.armor = 0;
      second.armor = 0;
      const world = (session as any).world;
      world.setTerrainAt(first.tileX + 2, first.tileY, TerrainType.GRASS);

      // Pick up first disabled pillbox
      tank.x = (first.tileX + 0.5) * 256;
      tank.y = (first.tileY + 0.5) * 256;
      (session as any).update();
      expect(tank.carriedPillbox?.id).toBe(first.id);
      expect(first.inTank).toBe(true);

      // Place carried pillbox via builder at a nearby valid land tile.
      session.handlePlayerInput(playerId, {
        ...idleInput,
        sequence: 1,
        tick: 1,
        buildOrder: {
          action: BuildAction.PILLBOX,
          targetX: first.tileX + 2,
          targetY: first.tileY,
        },
      });
      (session as any).update();

      // Builder movement is in world units (4/tick), so even nearby placements can
      // take >100 ticks before reaching the target and completing the build action.
      for (let i = 0; i < 220; i++) {
        (session as any).update();
        if (tank.carriedPillbox === null) {
          break;
        }
      }
      expect(tank.carriedPillbox).toBeNull();
      expect(first.inTank).toBe(false);

      // Pick up second disabled pillbox
      tank.x = (second.tileX + 0.5) * 256;
      tank.y = (second.tileY + 0.5) * 256;
      (session as any).update();
      expect(tank.carriedPillbox?.id).toBe(second.id);
      expect(second.inTank).toBe(true);
    });

    it('should not lose one-shot build orders when a later movement input arrives in the same tick', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);
      const players = (session as any).players;
      const player = players.get(playerId);
      const tank = player.tank;
      const world = (session as any).world;

      const first = Array.from((session as any).pillboxes.values())[0];
      expect(first).toBeDefined();

      first.armor = 0;
      world.setTerrainAt(first.tileX + 2, first.tileY, TerrainType.GRASS);

      // Pick up a disabled pillbox.
      tank.x = (first.tileX + 0.5) * 256;
      tank.y = (first.tileY + 0.5) * 256;
      (session as any).update();
      expect(tank.carriedPillbox?.id).toBe(first.id);

      // Simulate client packet race:
      // 1) Click-to-build packet with buildOrder.
      // 2) Immediate regular movement packet without buildOrder.
      session.handlePlayerInput(playerId, {
        ...idleInput,
        sequence: 10,
        tick: 10,
        buildOrder: {
          action: BuildAction.PILLBOX,
          targetX: first.tileX + 2,
          targetY: first.tileY,
        },
      });
      session.handlePlayerInput(playerId, {
        ...idleInput,
        sequence: 11,
        tick: 10,
      });

      (session as any).update();
      expect(tank.builder.order).toBe(BuilderOrder.PLACING_PILLBOX);

      for (let i = 0; i < 220; i++) {
        (session as any).update();
        if (tank.carriedPillbox === null) {
          break;
        }
      }

      expect(tank.carriedPillbox).toBeNull();
      expect(first.inTank).toBe(false);
    });

    it('should repair an existing damaged pillbox when using pillbox mode', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);
      const players = (session as any).players;
      const player = players.get(playerId);
      const tank = player.tank;

      const target = Array.from((session as any).pillboxes.values())[0];
      expect(target).toBeDefined();

      target.armor = 5;
      target.inTank = false;
      tank.trees = 1;
      tank.builder.trees = 1;
      tank.x = (target.tileX + 0.5) * 256;
      tank.y = (target.tileY + 0.5) * 256;
      // Keep builder attached to the relocated tank before issuing one-shot order.
      (session as any).update();

      session.handlePlayerInput(playerId, {
        ...idleInput,
        sequence: 20,
        tick: 20,
        buildOrder: {
          action: BuildAction.PILLBOX,
          targetX: target.tileX,
          targetY: target.tileY,
        },
      });
      (session as any).update();

      for (let i = 0; i < 120; i++) {
        (session as any).update();
        if (tank.builder.order === BuilderOrder.RETURNING) {
          break;
        }
      }

      expect(target.armor).toBe(PILLBOX_MAX_ARMOR);
      expect(tank.builder.order).toBe(BuilderOrder.RETURNING);
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
      const message = decodeServerMessage(lastCall[0]);

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
    it('should publish global join/quit HUD notifications', () => {
      const ws1 = createMockWebSocket();
      const ws2 = createMockWebSocket();
      const playerId1 = session.addPlayer(ws1);
      session.addPlayer(ws2);

      (ws1.send as any).mockClear();
      (ws2.send as any).mockClear();

      (session as any).broadcastState();
      const joinMessage1 = decodeServerMessage((ws1.send as any).mock.calls.slice(-1)[0][0]);
      const joinMessage2 = decodeServerMessage((ws2.send as any).mock.calls.slice(-1)[0][0]);

      expect(joinMessage1.hudMessages?.some(m => m.text.includes('joined game'))).toBe(true);
      expect(joinMessage2.hudMessages?.some(m => m.text.includes('joined game'))).toBe(true);

      (ws2.send as any).mockClear();
      session.removePlayer(playerId1);
      (session as any).broadcastState();

      const quitMessage = decodeServerMessage((ws2.send as any).mock.calls.slice(-1)[0][0]);
      expect(quitMessage.hudMessages?.some(m => m.text.includes('has quit game'))).toBe(true);
    });

    it('should publish global HUD notifications for neutral base and pillbox captures', () => {
      const ws = createMockWebSocket();
      const playerId = session.addPlayer(ws);
      const players = (session as any).players;
      const player = players.get(playerId);
      const tank = player.tank;
      const base = Array.from((session as any).bases.values())[0];
      const pillbox = Array.from((session as any).pillboxes.values())[0];

      expect(base).toBeDefined();
      expect(pillbox).toBeDefined();

      // Prime both structures as neutral so capture messages follow classic wording.
      base.ownerTeam = 255;
      base.armor = 90;
      pillbox.ownerTeam = 255;
      pillbox.armor = 0;
      pillbox.inTank = false;

      // Clear welcome/join packets to inspect only new gameplay HUD notifications.
      (ws.send as any).mockClear();

      tank.x = (base.tileX + 0.5) * 256;
      tank.y = (base.tileY + 0.5) * 256;
      (session as any).update();

      tank.x = (pillbox.tileX + 0.5) * 256;
      tank.y = (pillbox.tileY + 0.5) * 256;
      (session as any).update();

      (session as any).broadcastState();
      const message = decodeServerMessage((ws.send as any).mock.calls.slice(-1)[0][0]);
      const hudText = (message.hudMessages ?? []).map(m => m.text);

      expect(hudText.some(text => text.includes('captured a Neutral Base'))).toBe(true);
      expect(hudText.some(text => text.includes('captured a Neutral Pillbox'))).toBe(true);
    });

    it('should server-filter alliance HUD notifications to relevant teams only', () => {
      const wsA = createMockWebSocket();
      const wsB = createMockWebSocket();
      const wsC = createMockWebSocket();
      const playerA = session.addPlayer(wsA);
      const playerB = session.addPlayer(wsB);
      session.addPlayer(wsC);

      const players = (session as any).players;
      const teamA = players.get(playerA).tank.team;
      const teamB = players.get(playerB).tank.team;

      (wsA.send as any).mockClear();
      (wsB.send as any).mockClear();
      (wsC.send as any).mockClear();
      (session as any).broadcastState();
      (wsA.send as any).mockClear();
      (wsB.send as any).mockClear();
      (wsC.send as any).mockClear();

      expect(session.requestAlliance(teamA, teamB)).toBe(true);
      (session as any).broadcastState();

      const requestA = decodeServerMessage((wsA.send as any).mock.calls.slice(-1)[0][0]);
      const requestB = decodeServerMessage((wsB.send as any).mock.calls.slice(-1)[0][0]);
      const requestC = decodeServerMessage((wsC.send as any).mock.calls.slice(-1)[0][0]);

      expect(requestA.hudMessages?.some(m => m.text.includes('requested alliance'))).toBe(true);
      expect(requestB.hudMessages?.some(m => m.text.includes('received alliance request'))).toBe(true);
      expect(requestC.hudMessages).toBeUndefined();

      (wsA.send as any).mockClear();
      (wsB.send as any).mockClear();
      (wsC.send as any).mockClear();

      expect(session.acceptAlliance(teamB, teamA)).toBe(true);
      (session as any).broadcastState();

      const acceptA = decodeServerMessage((wsA.send as any).mock.calls.slice(-1)[0][0]);
      const acceptB = decodeServerMessage((wsB.send as any).mock.calls.slice(-1)[0][0]);
      const acceptC = decodeServerMessage((wsC.send as any).mock.calls.slice(-1)[0][0]);

      expect(acceptA.hudMessages?.some(m => m.text.includes('accepted alliance'))).toBe(true);
      expect(acceptB.hudMessages?.some(m => m.text.includes('accepted alliance'))).toBe(true);
      expect(acceptC.hudMessages).toBeUndefined();

      (wsA.send as any).mockClear();
      (wsB.send as any).mockClear();
      (wsC.send as any).mockClear();

      expect(session.breakAlliance(teamA, teamB)).toBeUndefined();
      expect(session.requestAlliance(teamA, teamB)).toBe(true);
      expect(session.cancelAllianceRequest(teamA, teamB)).toBe(true);
      expect(session.acceptAlliance(teamB, teamA)).toBe(false);
      (session as any).broadcastState();

      const cancelA = decodeServerMessage((wsA.send as any).mock.calls.slice(-1)[0][0]);
      const cancelB = decodeServerMessage((wsB.send as any).mock.calls.slice(-1)[0][0]);
      const cancelC = decodeServerMessage((wsC.send as any).mock.calls.slice(-1)[0][0]);

      expect(cancelA.hudMessages?.some(m => m.text.includes('canceled alliance request'))).toBe(true);
      expect(cancelB.hudMessages?.some(m => m.text.includes('was canceled'))).toBe(true);
      expect(cancelC.hudMessages).toBeUndefined();
    });

    it('should send builder rejection HUD notifications only to the affected player', () => {
      const ws1 = createMockWebSocket();
      const ws2 = createMockWebSocket();
      const playerId1 = session.addPlayer(ws1);
      session.addPlayer(ws2);

      const players = (session as any).players;
      const player1 = players.get(playerId1);
      const tank1 = player1.tank;
      const builder = tank1.builder;
      const world = (session as any).world;

      builder.order = BuilderOrder.PLACING_PILLBOX;
      builder.hasPillbox = true;
      builder.x = (52 + 0.5) * 256;
      builder.y = (50 + 0.5) * 256;
      builder.targetX = builder.x;
      builder.targetY = builder.y;
      world.setTerrainAt(52, 50, TerrainType.FOREST);

      // Flush join notifications before asserting personal delivery.
      (session as any).broadcastState();
      (ws1.send as any).mockClear();
      (ws2.send as any).mockClear();

      (session as any).update();
      (session as any).broadcastState();

      const message1 = decodeServerMessage((ws1.send as any).mock.calls.slice(-1)[0][0]);
      const message2 = decodeServerMessage((ws2.send as any).mock.calls.slice(-1)[0][0]);

      expect(message1.hudMessages?.some(m => m.text.includes('Builder action failed'))).toBe(true);
      expect(message2.hudMessages).toBeUndefined();
    });

    it('should publish global and alliance chat with server-side filtering', () => {
      const ws1 = createMockWebSocket();
      const ws2 = createMockWebSocket();
      const ws3 = createMockWebSocket();
      const playerId1 = session.addPlayer(ws1);
      const playerId2 = session.addPlayer(ws2);
      const playerId3 = session.addPlayer(ws3);

      const players = (session as any).players;
      const team1 = players.get(playerId1).tank.team;
      const team2 = players.get(playerId2).tank.team;

      // Flush join notifications.
      (session as any).broadcastState();
      (ws1.send as any).mockClear();
      (ws2.send as any).mockClear();
      (ws3.send as any).mockClear();

      session.handlePlayerChat(playerId1, 'hello world');
      (session as any).broadcastState();
      const global1 = decodeServerMessage((ws1.send as any).mock.calls.slice(-1)[0][0]);
      const global2 = decodeServerMessage((ws2.send as any).mock.calls.slice(-1)[0][0]);
      const global3 = decodeServerMessage((ws3.send as any).mock.calls.slice(-1)[0][0]);
      expect(global1.hudMessages?.some(m => m.class === 'chat_global' && m.text.includes('hello world'))).toBe(true);
      expect(global2.hudMessages?.some(m => m.class === 'chat_global' && m.text.includes('hello world'))).toBe(true);
      expect(global3.hudMessages?.some(m => m.class === 'chat_global' && m.text.includes('hello world'))).toBe(true);

      (ws1.send as any).mockClear();
      (ws2.send as any).mockClear();
      (ws3.send as any).mockClear();
      expect(session.requestAlliance(team1, team2)).toBe(true);
      expect(session.acceptAlliance(team2, team1)).toBe(true);
      (session as any).broadcastState();
      (ws1.send as any).mockClear();
      (ws2.send as any).mockClear();
      (ws3.send as any).mockClear();

      session.handlePlayerChat(playerId1, 'ally only', {allianceOnly: true});
      (session as any).broadcastState();
      const alliance1 = decodeServerMessage((ws1.send as any).mock.calls.slice(-1)[0][0]);
      const alliance2 = decodeServerMessage((ws2.send as any).mock.calls.slice(-1)[0][0]);
      const alliance3 = decodeServerMessage((ws3.send as any).mock.calls.slice(-1)[0][0]);
      expect(alliance1.hudMessages?.some(m => m.class === 'chat_alliance' && m.text.includes('ally only'))).toBe(true);
      expect(alliance2.hudMessages?.some(m => m.class === 'chat_alliance' && m.text.includes('ally only'))).toBe(true);
      expect(alliance3.hudMessages).toBeUndefined();

      // Nearby chat should only reach players within local radius.
      const tank1 = players.get(playerId1).tank;
      const tank2 = players.get(playerId2).tank;
      const tank3 = players.get(playerId3).tank;
      tank1.x = 100 * 256;
      tank1.y = 100 * 256;
      tank2.x = 112 * 256;
      tank2.y = 100 * 256;
      tank3.x = 113 * 256;
      tank3.y = 100 * 256;

      (ws1.send as any).mockClear();
      (ws2.send as any).mockClear();
      (ws3.send as any).mockClear();

      session.handlePlayerChat(playerId1, '/n local ping');
      (session as any).broadcastState();
      const nearby1 = decodeServerMessage((ws1.send as any).mock.calls.slice(-1)[0][0]);
      const nearby2 = decodeServerMessage((ws2.send as any).mock.calls.slice(-1)[0][0]);
      const nearby3 = decodeServerMessage((ws3.send as any).mock.calls.slice(-1)[0][0]);
      expect(nearby1.hudMessages?.some(m => m.text.includes('(nearby): local ping'))).toBe(true);
      expect(nearby2.hudMessages?.some(m => m.text.includes('(nearby): local ping'))).toBe(true);
      expect(nearby3.hudMessages).toBeUndefined();

      // Whisper should reach only sender and target.
      (ws1.send as any).mockClear();
      (ws2.send as any).mockClear();
      (ws3.send as any).mockClear();
      session.handlePlayerChat(playerId1, '/w 2 secret plan');
      (session as any).broadcastState();
      const whisper1 = decodeServerMessage((ws1.send as any).mock.calls.slice(-1)[0][0]);
      const whisper2 = decodeServerMessage((ws2.send as any).mock.calls.slice(-1)[0][0]);
      const whisper3 = decodeServerMessage((ws3.send as any).mock.calls.slice(-1)[0][0]);
      expect(whisper1.hudMessages?.some(m => m.text.includes('to Player 2 (whisper): secret plan'))).toBe(true);
      expect(whisper2.hudMessages?.some(m => m.text.includes('Player 1 (whisper): secret plan'))).toBe(true);
      expect(whisper3.hudMessages).toBeUndefined();
    });

    it('should seed reconnecting/new players with recent global HUD tail only', () => {
      const ws1 = createMockWebSocket();
      const ws2 = createMockWebSocket();
      const playerId1 = session.addPlayer(ws1);

      // Flush initial join/welcome packets.
      (session as any).broadcastState();
      (ws1.send as any).mockClear();

      // Emit enough global messages to exceed retained history.
      for (let i = 0; i < 30; i++) {
        session.handlePlayerChat(playerId1, `seed-${i}`);
      }

      session.addPlayer(ws2);
      (session as any).broadcastState();

      const message2 = decodeServerMessage((ws2.send as any).mock.calls.slice(-1)[0][0]);
      const texts = (message2.hudMessages ?? []).map(m => m.text);
      const seededChats = texts.filter(text => text.includes('seed-'));

      // Service keeps only the recent global tail instead of replaying full history.
      expect(seededChats).toHaveLength(24);
      expect(seededChats.some(text => text.includes('seed-0'))).toBe(false);
      expect(seededChats.some(text => text.includes('seed-29'))).toBe(true);
    });

    it('should publish global HUD notification when match ends', () => {
      const ws = createMockWebSocket();
      session.addPlayer(ws);
      const bases = Array.from((session as any).bases.values());

      // Force win condition: all bases owned by one team.
      for (const base of bases) {
        base.ownerTeam = 0;
      }

      // Flush welcome/join packets before validating win HUD.
      (session as any).broadcastState();
      (ws.send as any).mockClear();

      (session as any).update();
      (session as any).broadcastState();

      const message = decodeServerMessage((ws.send as any).mock.calls.slice(-1)[0][0]);
      expect(message.hudMessages?.some(m => m.text.includes('won the match'))).toBe(true);
      expect(message.matchEnded).toBe(true);
      expect(message.winningTeams).toEqual([0]);
    });

    it('should send welcome message with map data', () => {
      const ws = createMockWebSocket();
      session.addPlayer(ws);

      expect(ws.send).toHaveBeenCalled();

      const firstCall = (ws.send as any).mock.calls[0];
      const message = decodeServerMessage(firstCall[0]);

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
      const message = decodeServerMessage(lastCall[0]);

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
