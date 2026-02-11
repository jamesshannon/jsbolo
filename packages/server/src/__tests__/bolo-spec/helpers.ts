/**
 * Shared helpers for Bolo Manual Specification tests.
 *
 * These helpers provide consistent patterns for setting up game state,
 * creating mock objects, and advancing the simulation.
 */

import { vi } from 'vitest';
import { GameSession } from '../../game-session.js';
import { ServerWorld } from '../../simulation/world.js';
import { ServerTank } from '../../simulation/tank.js';
import {
  TerrainType,
  getTerrainInitialLife,
  TILE_SIZE_WORLD,
  type PlayerInput,
} from '@jsbolo/shared';
import type { WebSocket } from 'ws';

/** Create a mock WebSocket that records sent messages */
export function createMockWebSocket(): WebSocket {
  return {
    send: vi.fn(),
    readyState: 1, // OPEN
    on: vi.fn(),
    close: vi.fn(),
  } as unknown as WebSocket;
}

/** Default player input with all flags false */
export function createDefaultInput(overrides?: Partial<PlayerInput>): PlayerInput {
  return {
    sequence: 1,
    tick: 1,
    accelerating: false,
    braking: false,
    turningClockwise: false,
    turningCounterClockwise: false,
    shooting: false,
    rangeAdjustment: 0,
    ...overrides,
  };
}

/** Advance the simulation N ticks by calling the private update() method */
export function tickSession(session: GameSession, n: number): void {
  for (let i = 0; i < n; i++) {
    (session as any).update();
  }
}

/** Set terrain at a tile position with proper life initialization */
export function setTerrain(world: ServerWorld, x: number, y: number, type: TerrainType): void {
  world.setTerrainAt(x, y, type);
}

/** Get internal player object from session */
export function getPlayer(session: GameSession, playerId: number) {
  return (session as any).players.get(playerId);
}

/** Get the world from session */
export function getWorld(session: GameSession): ServerWorld {
  return (session as any).world;
}

/** Get shells map from session */
export function getShells(session: GameSession): Map<number, any> {
  return (session as any).shells;
}

/** Get pillboxes map from session */
export function getPillboxes(session: GameSession): Map<number, any> {
  return (session as any).pillboxes;
}

/** Get bases map from session */
export function getBases(session: GameSession): Map<number, any> {
  return (session as any).bases;
}

/** Place a tank at a specific tile, centered */
export function placeTankAtTile(tank: ServerTank, tileX: number, tileY: number): void {
  tank.x = (tileX + 0.5) * TILE_SIZE_WORLD;
  tank.y = (tileY + 0.5) * TILE_SIZE_WORLD;
}

/**
 * Set up a clear area of uniform terrain around a position.
 * Useful for isolating terrain speed tests from procedural map generation.
 */
export function fillArea(
  world: ServerWorld,
  startX: number,
  startY: number,
  width: number,
  height: number,
  terrain: TerrainType
): void {
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      world.setTerrainAt(x, y, terrain);
    }
  }
}
