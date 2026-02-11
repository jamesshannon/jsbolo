import type { Invariant, TickSnapshot } from './scenario-runner';
import { TILE_SIZE_WORLD } from '@jsbolo/shared';

const MAP_SIZE_TILES = 256;
const MAP_SIZE_WORLD = MAP_SIZE_TILES * TILE_SIZE_WORLD;
const MAX_TANK_SPEED = 16;

// --- Core Invariants ---

export const TANK_IN_BOUNDS: Invariant = {
  name: 'tank-in-bounds',
  check(current: TickSnapshot) {
    const { x, y } = current.tank;
    const inBounds = x >= 0 && x < MAP_SIZE_WORLD && y >= 0 && y < MAP_SIZE_WORLD;

    return {
      passed: inBounds,
      message: inBounds
        ? ''
        : `Tank out of bounds at (${x.toFixed(1)}, ${y.toFixed(1)})`,
    };
  },
};

export const SPEED_WITHIN_MAX: Invariant = {
  name: 'speed-within-max',
  check(current: TickSnapshot) {
    const { speed } = current.tank;
    const valid = speed <= MAX_TANK_SPEED;

    return {
      passed: valid,
      message: valid ? '' : `Tank speed ${speed.toFixed(2)} exceeds max ${MAX_TANK_SPEED}`,
    };
  },
};

export const SPEED_NON_NEGATIVE: Invariant = {
  name: 'speed-non-negative',
  check(current: TickSnapshot) {
    const { speed } = current.tank;
    const valid = speed >= 0;

    return {
      passed: valid,
      message: valid ? '' : `Tank speed is negative: ${speed.toFixed(2)}`,
    };
  },
};

export const ARMOR_NON_NEGATIVE: Invariant = {
  name: 'armor-non-negative',
  check(current: TickSnapshot) {
    const { armor } = current.tank;
    const valid = armor >= 0;

    return {
      passed: valid,
      message: valid ? '' : `Tank armor is negative: ${armor}`,
    };
  },
};

// --- Boat-Specific Invariants ---

export const BOAT_FULL_SPEED: Invariant = {
  name: 'boat-full-speed',
  check(current: TickSnapshot) {
    const { tank, input, computed } = current;

    // If tank is on boat and accelerating, it should have speed
    // If both speed and terrainSpeed are 0, that's the freeze bug
    if (tank.onBoat && input.accelerating && tank.speed === 0 && computed.terrainSpeed === 0) {
      return {
        passed: false,
        message: `Tank on boat with accelerating=true has speed=0 (terrainSpeed=${computed.terrainSpeed.toFixed(2)})`,
      };
    }

    return { passed: true, message: '' };
  },
};

export const BOAT_SPEED_NEVER_DROPS_TO_ZERO: Invariant = {
  name: 'boat-speed-drop',
  check(current: TickSnapshot, history: TickSnapshot[]) {
    const { tank } = current;

    if (history.length === 0) return { passed: true, message: '' };

    const prev = history[history.length - 1];

    // If tank is on boat and had speed last tick, it should not drop to 0
    if (tank.onBoat && prev.tank.onBoat && prev.tank.speed > 0 && tank.speed === 0) {
      return {
        passed: false,
        message: `Tank on boat had speed ${prev.tank.speed.toFixed(1)} last tick but dropped to 0`,
      };
    }

    return { passed: true, message: '' };
  },
};

// --- Movement Invariants ---

export const MOVING_TANK_CHANGES_POSITION: Invariant = {
  name: 'moving-tank-changes-position',
  check(current: TickSnapshot) {
    const { tank, computed } = current;
    const { dx, dy } = computed.positionDelta;

    // If tank has speed, it should be moving (unless collision stopped it)
    // We give a small epsilon for rounding
    if (tank.speed > 0.1 && Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
      return {
        passed: false,
        message: `Tank has speed ${tank.speed.toFixed(2)} but position unchanged (dx=${dx.toFixed(3)}, dy=${dy.toFixed(3)})`,
      };
    }

    return { passed: true, message: '' };
  },
};

export const ACCELERATION_PRODUCES_SPEED: Invariant = {
  name: 'acceleration-produces-speed',
  check(current: TickSnapshot, history: TickSnapshot[]) {
    // Check if tank has been accelerating on passable terrain for 5+ consecutive ticks
    // but still has 0 speed (permanent freeze bug)

    if (current.tank.speed > 0) {
      return { passed: true, message: '' };
    }

    const recentHistory = history.slice(-5);
    if (recentHistory.length < 5) {
      return { passed: true, message: '' };
    }

    const allAccelerating = recentHistory.every((s) => s.input.accelerating);
    const allPassable = recentHistory.every((s) => s.computed.terrainSpeed > 0);
    const allZeroSpeed = recentHistory.every((s) => s.tank.speed === 0);

    if (allAccelerating && allPassable && allZeroSpeed && current.tank.speed === 0) {
      return {
        passed: false,
        message: `Tank accelerating on passable terrain for 5+ ticks but speed remains 0 (terrainSpeed=${current.computed.terrainSpeed.toFixed(2)})`,
      };
    }

    return { passed: true, message: '' };
  },
};

// --- Pre-built Bundles ---

export const STANDARD_INVARIANTS: Invariant[] = [
  TANK_IN_BOUNDS,
  SPEED_WITHIN_MAX,
  SPEED_NON_NEGATIVE,
  ARMOR_NON_NEGATIVE,
];

export const BOAT_INVARIANTS: Invariant[] = [
  ...STANDARD_INVARIANTS,
  BOAT_FULL_SPEED,
  BOAT_SPEED_NEVER_DROPS_TO_ZERO,
  MOVING_TANK_CHANGES_POSITION,
];

export const MOVEMENT_INVARIANTS: Invariant[] = [
  ...STANDARD_INVARIANTS,
  MOVING_TANK_CHANGES_POSITION,
  ACCELERATION_PRODUCES_SPEED,
];
