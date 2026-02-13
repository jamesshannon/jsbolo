/**
 * Bolo Manual Spec: Water Mechanics
 *
 * Manual Reference: references/bolo-manual-reference.md § 8 "Water Mechanics"
 *
 * Tests resource drain when tank is in water without boat:
 * - "tank's stocks of shells and mines will be depleted"
 * - 1 shell drained every 15 ticks
 * - 1 mine drained every 15 ticks
 * - "water also damages any shells and mines carried by the tank,
 *    so any tank caught in your moat will soon be helpless"
 * - "When you come out of water, remember that you may have lost
 *    shells and mines, so check your inventory"
 */

import {describe, it, expect} from 'vitest';
import {
  TerrainType,
  WATER_DRAIN_INTERVAL_TICKS,
  WATER_MINES_DRAINED,
  WATER_SHELLS_DRAINED,
} from '@jsbolo/shared';
import {GameSession} from '../../game-session.js';
import {
  createMockWebSocket,
  getPlayer,
  getWorld,
  placeTankAtTile,
  tickSession,
} from './helpers.js';

describe('Bolo Manual Spec: 7. Water Mechanics', () => {
  it('should drain 1 shell every 15 ticks when tank is in water without boat', () => {
    const session = new GameSession();
    const playerId = session.addPlayer(createMockWebSocket());
    const player = getPlayer(session, playerId);
    const world = getWorld(session);

    world.setTerrainAt(60, 60, TerrainType.RIVER);
    placeTankAtTile(player.tank, 60, 60);
    player.tank.onBoat = false;
    player.tank.shells = 6;
    player.tank.mines = 6;

    tickSession(session, WATER_DRAIN_INTERVAL_TICKS - 1);
    expect(player.tank.shells).toBe(6);

    tickSession(session, 1);
    expect(player.tank.shells).toBe(6 - WATER_SHELLS_DRAINED);

    tickSession(session, WATER_DRAIN_INTERVAL_TICKS);
    expect(player.tank.shells).toBe(6 - (WATER_SHELLS_DRAINED * 2));
  });

  it('should drain 1 mine every 15 ticks when tank is in water without boat', () => {
    const session = new GameSession();
    const playerId = session.addPlayer(createMockWebSocket());
    const player = getPlayer(session, playerId);
    const world = getWorld(session);

    world.setTerrainAt(61, 60, TerrainType.RIVER);
    placeTankAtTile(player.tank, 61, 60);
    player.tank.onBoat = false;
    player.tank.shells = 0;
    player.tank.mines = 5;

    tickSession(session, WATER_DRAIN_INTERVAL_TICKS - 1);
    expect(player.tank.mines).toBe(5);

    tickSession(session, 1);
    expect(player.tank.mines).toBe(5 - WATER_MINES_DRAINED);

    tickSession(session, WATER_DRAIN_INTERVAL_TICKS);
    expect(player.tank.mines).toBe(5 - (WATER_MINES_DRAINED * 2));
  });

  it('should not drain resources when tank is on a boat', () => {
    const session = new GameSession();
    const playerId = session.addPlayer(createMockWebSocket());
    const player = getPlayer(session, playerId);
    const world = getWorld(session);

    world.setTerrainAt(62, 60, TerrainType.RIVER);
    placeTankAtTile(player.tank, 62, 60);
    player.tank.onBoat = true;
    player.tank.shells = 7;
    player.tank.mines = 7;

    tickSession(session, WATER_DRAIN_INTERVAL_TICKS * 4);

    expect(player.tank.shells).toBe(7);
    expect(player.tank.mines).toBe(7);
  });

  it('should reset the drain timer when tank leaves water', () => {
    const session = new GameSession();
    const playerId = session.addPlayer(createMockWebSocket());
    const player = getPlayer(session, playerId);
    const world = getWorld(session);

    world.setTerrainAt(63, 60, TerrainType.RIVER);
    world.setTerrainAt(64, 60, TerrainType.GRASS);
    placeTankAtTile(player.tank, 63, 60);
    player.tank.onBoat = false;
    player.tank.shells = 4;
    player.tank.mines = 4;

    tickSession(session, 10);
    placeTankAtTile(player.tank, 64, 60);
    tickSession(session, 1); // Leaves water, resets counter.

    placeTankAtTile(player.tank, 63, 60);
    tickSession(session, WATER_DRAIN_INTERVAL_TICKS - 1);
    expect(player.tank.shells).toBe(4);
    expect(player.tank.mines).toBe(4);

    tickSession(session, 1);
    expect(player.tank.shells).toBe(4 - WATER_SHELLS_DRAINED);
    expect(player.tank.mines).toBe(4 - WATER_MINES_DRAINED);
  });

  it('should start counting drain immediately after entering water', () => {
    const session = new GameSession();
    const playerId = session.addPlayer(createMockWebSocket());
    const player = getPlayer(session, playerId);
    const world = getWorld(session);

    world.setTerrainAt(65, 60, TerrainType.GRASS);
    world.setTerrainAt(66, 60, TerrainType.RIVER);
    placeTankAtTile(player.tank, 65, 60);
    player.tank.onBoat = false;
    player.tank.shells = 3;
    player.tank.mines = 3;

    tickSession(session, 20);
    expect(player.tank.shells).toBe(3);
    expect(player.tank.mines).toBe(3);

    placeTankAtTile(player.tank, 66, 60);
    tickSession(session, WATER_DRAIN_INTERVAL_TICKS - 1);
    expect(player.tank.shells).toBe(3);
    expect(player.tank.mines).toBe(3);

    tickSession(session, 1);
    expect(player.tank.shells).toBe(3 - WATER_SHELLS_DRAINED);
    expect(player.tank.mines).toBe(3 - WATER_MINES_DRAINED);
  });
});
