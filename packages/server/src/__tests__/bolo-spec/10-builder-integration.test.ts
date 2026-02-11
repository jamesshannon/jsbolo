/**
 * Builder Integration Tests
 * Tests end-to-end builder behavior including coordinate conversion and state management
 */

import { describe, it, expect } from 'vitest';
import { GameSession } from '../../game-session.js';
import {
  TerrainType,
  TILE_SIZE_WORLD,
  FOREST_REGROWTH_TICKS,
} from '@jsbolo/shared';

function createMockWebSocket() {
  return {
    send: () => {},
    on: () => {},
    readyState: 1,
  } as any;
}

function getPlayer(session: GameSession, playerId: number) {
  return (session as any).players.get(playerId);
}

function getWorld(session: GameSession) {
  return (session as any).world;
}

function tickSession(session: GameSession, ticks: number) {
  for (let i = 0; i < ticks; i++) {
    (session as any).update();
  }
}

describe('Builder Integration Tests', () => {
  it('should harvest forest at correct tile coordinates', () => {
    const session = new GameSession();
    const ws = createMockWebSocket();
    const id = session.addPlayer(ws);
    const player = getPlayer(session, id);
    const world = getWorld(session);

    // Place forests at specific tiles
    world.setTerrainAt(84, 104, TerrainType.FOREST);
    world.setTerrainAt(85, 104, TerrainType.FOREST);
    world.setTerrainAt(86, 104, TerrainType.FOREST);

    // Place tank near forests
    player.tank.x = (83 + 0.5) * TILE_SIZE_WORLD;
    player.tank.y = (104 + 0.5) * TILE_SIZE_WORLD;

    // Send builder to harvest forest at (84, 104)
    player.tank.builder.sendToLocation(84, 104, 1); // Action 1 = FOREST/harvesting

    // Verify builder is dispatched
    expect(player.tank.builder.order).not.toBe(0); // Not IN_TANK

    // Run until builder reaches and harvests
    let harvested = false;
    for (let i = 0; i < 200; i++) {
      tickSession(session, 1);
      // Check if TILE 84,104 became GRASS (not adjacent tiles!)
      if (world.getTerrainAt(84, 104) === TerrainType.GRASS) {
        harvested = true;
        // Verify adjacent tiles are still FOREST
        expect(world.getTerrainAt(85, 104)).toBe(TerrainType.FOREST);
        expect(world.getTerrainAt(86, 104)).toBe(TerrainType.FOREST);
        expect(world.getTerrainAt(83, 104)).not.toBe(TerrainType.GRASS); // Tank tile
        break;
      }
    }

    expect(harvested).toBe(true);
    expect(player.tank.trees).toBeGreaterThan(0);
  });

  it('should NOT immediately regrow harvested forest', () => {
    const session = new GameSession();
    const ws = createMockWebSocket();
    const id = session.addPlayer(ws);
    const player = getPlayer(session, id);
    const world = getWorld(session);

    // Place forest
    world.setTerrainAt(50, 50, TerrainType.FOREST);
    player.tank.x = (50 + 0.5) * TILE_SIZE_WORLD;
    player.tank.y = (50 + 0.5) * TILE_SIZE_WORLD;

    // Manually harvest (simulate builder behavior)
    player.tank.builder.x = (50 + 0.5) * TILE_SIZE_WORLD;
    player.tank.builder.y = (50 + 0.5) * TILE_SIZE_WORLD;
    player.tank.builder.targetX = player.tank.builder.x;
    player.tank.builder.targetY = player.tank.builder.y;
    player.tank.builder.order = 1; // HARVESTING

    // Run until harvest happens
    for (let i = 0; i < 20; i++) {
      tickSession(session, 1);
      if (world.getTerrainAt(50, 50) === TerrainType.GRASS) break;
    }

    // Verify terrain is GRASS
    expect(world.getTerrainAt(50, 50)).toBe(TerrainType.GRASS);

    // Run for 50 more ticks (much less than regrowth time)
    for (let i = 0; i < 50; i++) {
      tickSession(session, 1);
    }

    // Should still be GRASS (not immediately regrown)
    expect(world.getTerrainAt(50, 50)).toBe(TerrainType.GRASS);

    // Run for full regrowth time
    for (let i = 0; i < FOREST_REGROWTH_TICKS; i++) {
      tickSession(session, 1);
    }

    // Now should be FOREST
    expect(world.getTerrainAt(50, 50)).toBe(TerrainType.FOREST);
  });

  it('should allow builder to harvest multiple forests in sequence', () => {
    const session = new GameSession();
    const ws = createMockWebSocket();
    const id = session.addPlayer(ws);
    const player = getPlayer(session, id);
    const world = getWorld(session);

    // Place multiple forests
    for (let x = 50; x < 55; x++) {
      world.setTerrainAt(x, 50, TerrainType.FOREST);
    }

    // Place tank
    player.tank.x = (48 + 0.5) * TILE_SIZE_WORLD;
    player.tank.y = (50 + 0.5) * TILE_SIZE_WORLD;
    player.tank.trees = 0;

    // Harvest 5 forests in sequence
    for (let targetX = 50; targetX < 55; targetX++) {
      player.tank.builder.sendToLocation(targetX, 50, 1);

      // Wait for harvest to complete
      const initialTrees = player.tank.trees;
      for (let i = 0; i < 300; i++) {
        tickSession(session, 1);
        if (player.tank.trees > initialTrees) break;
      }

      // Verify harvest happened
      expect(world.getTerrainAt(targetX, 50)).toBe(TerrainType.GRASS);
      expect(player.tank.trees).toBeGreaterThan(initialTrees);
    }

    // Verify all 5 forests were harvested
    expect(player.tank.trees).toBeGreaterThanOrEqual(20); // At least 4 trees per harvest * 5
  });

  it('should handle shot forests regrowing correctly', () => {
    const session = new GameSession();
    const ws = createMockWebSocket();
    const id = session.addPlayer(ws);
    const player = getPlayer(session, id);
    const world = getWorld(session);

    // Place forest
    world.setTerrainAt(52, 50, TerrainType.FOREST);
    player.tank.x = (50 + 0.5) * TILE_SIZE_WORLD;
    player.tank.y = (50 + 0.5) * TILE_SIZE_WORLD;
    player.tank.direction = 0; // East

    // Shoot forest
    player.tank.shoot();

    // Wait for shell to hit
    for (let i = 0; i < 50; i++) {
      tickSession(session, 1);
      if (world.getTerrainAt(52, 50) === TerrainType.GRASS) break;
    }

    // Verify became GRASS
    expect(world.getTerrainAt(52, 50)).toBe(TerrainType.GRASS);

    // Wait 50 ticks - should still be GRASS
    for (let i = 0; i < 50; i++) {
      tickSession(session, 1);
    }
    expect(world.getTerrainAt(52, 50)).toBe(TerrainType.GRASS);

    // Wait for regrowth
    for (let i = 0; i < FOREST_REGROWTH_TICKS; i++) {
      tickSession(session, 1);
    }

    // Should be FOREST again
    expect(world.getTerrainAt(52, 50)).toBe(TerrainType.FOREST);
  });
});
