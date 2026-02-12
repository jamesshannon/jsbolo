import {RangeAdjustment} from '@jsbolo/shared';
import {type BotCommand, type BotController, type BotObservation} from '../types.js';

const TURN_PHASE_TICKS = 48;
const SHOOT_DISTANCE_WORLD_UNITS = 8 * 256;
const SHOOT_DISTANCE_SQUARED = SHOOT_DISTANCE_WORLD_UNITS * SHOOT_DISTANCE_WORLD_UNITS;

/**
 * Simple deterministic patrol brain.
 *
 * Behavior policy:
 * - Keep moving forward.
 * - Sweep direction in fixed phases to avoid getting stuck in straight corridors.
 * - Fire when an enemy is nearby and gun is reloaded.
 */
export class PatrolBot implements BotController {
  readonly profile = 'patrol';

  think(observation: BotObservation): BotCommand {
    const phase = Math.floor(observation.tick / TURN_PHASE_TICKS) % 2;
    const shouldTurnClockwise = phase === 0;

    const nearestEnemyDistanceSquared = this.findNearestEnemyDistanceSquared(observation);
    const hasTargetInRange =
      nearestEnemyDistanceSquared !== null && nearestEnemyDistanceSquared <= SHOOT_DISTANCE_SQUARED;

    return {
      accelerating: true,
      braking: false,
      turningClockwise: shouldTurnClockwise,
      turningCounterClockwise: !shouldTurnClockwise,
      shooting: hasTargetInRange && observation.self.reload === 0,
      rangeAdjustment: RangeAdjustment.NONE,
    };
  }

  private findNearestEnemyDistanceSquared(observation: BotObservation): number | null {
    if (observation.enemies.length === 0) {
      return null;
    }

    let minDistanceSquared: number | null = null;

    for (const enemy of observation.enemies) {
      const dx = enemy.x - observation.self.x;
      const dy = enemy.y - observation.self.y;
      const distanceSquared = (dx * dx) + (dy * dy);

      if (minDistanceSquared === null || distanceSquared < minDistanceSquared) {
        minDistanceSquared = distanceSquared;
      }
    }

    return minDistanceSquared;
  }
}
