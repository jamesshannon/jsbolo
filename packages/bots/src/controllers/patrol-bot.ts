import {RangeAdjustment} from '@jsbolo/shared';
import {type BotCommand, type BotController, type BotObservation} from '../types.js';

const TURN_PHASE_TICKS = 64;
const SHOOT_DISTANCE_WORLD_UNITS = 8 * 256;
const SHOOT_DISTANCE_SQUARED = SHOOT_DISTANCE_WORLD_UNITS * SHOOT_DISTANCE_WORLD_UNITS;
const AIM_TOLERANCE_RADIANS = Math.PI / 10; // ~18 degrees
const STUCK_SAMPLE_MIN_DISTANCE_SQUARED = 16 * 16;
const STUCK_TICK_THRESHOLD = 24;
const STUCK_RECOVERY_TICKS = 20;
const FULL_CIRCLE_DIRECTION = 256;
const DIRECTION_SCALE = (2 * Math.PI) / FULL_CIRCLE_DIRECTION;

interface TargetingInfo {
  distanceSquared: number;
  angularError: number;
}

/**
 * Simple deterministic patrol brain.
 *
 * Behavior policy:
 * - Keep moving forward.
 * - Sweep direction in fixed phases for map coverage.
 * - If movement stalls for many ticks, run deterministic recovery (brake + hard turn).
 * - Fire only when enemy is near, roughly in front, and weapon can shoot.
 */
export class PatrolBot implements BotController {
  readonly profile = 'patrol';
  private lastSelfPosition: {x: number; y: number} | null = null;
  private stuckTicks = 0;
  private recoveryTicksRemaining = 0;
  private recoveryTurnClockwise = true;

  think(observation: BotObservation): BotCommand {
    this.updateStuckState(observation);

    const targetInfo = this.findTargetingInfo(observation);
    const hasTargetInRange =
      targetInfo !== null && targetInfo.distanceSquared <= SHOOT_DISTANCE_SQUARED;
    const isAimAcceptable =
      targetInfo !== null && targetInfo.angularError <= AIM_TOLERANCE_RADIANS;

    if (this.recoveryTicksRemaining > 0) {
      this.recoveryTicksRemaining--;
      return {
        accelerating: false,
        braking: true,
        turningClockwise: this.recoveryTurnClockwise,
        turningCounterClockwise: !this.recoveryTurnClockwise,
        shooting: false,
        rangeAdjustment: RangeAdjustment.NONE,
      };
    }

    const phase = Math.floor(observation.tick / TURN_PHASE_TICKS) % 2;
    const shouldTurnClockwise = phase === 0;

    return {
      accelerating: true,
      braking: false,
      turningClockwise: shouldTurnClockwise,
      turningCounterClockwise: !shouldTurnClockwise,
      shooting: hasTargetInRange && isAimAcceptable && observation.self.reload === 0 && observation.self.shells > 0,
      rangeAdjustment: RangeAdjustment.NONE,
    };
  }

  private updateStuckState(observation: BotObservation): void {
    if (this.lastSelfPosition) {
      const dx = observation.self.x - this.lastSelfPosition.x;
      const dy = observation.self.y - this.lastSelfPosition.y;
      const movementDistanceSquared = (dx * dx) + (dy * dy);

      if (movementDistanceSquared <= STUCK_SAMPLE_MIN_DISTANCE_SQUARED) {
        this.stuckTicks++;
      } else {
        this.stuckTicks = 0;
      }

      if (this.stuckTicks >= STUCK_TICK_THRESHOLD && this.recoveryTicksRemaining === 0) {
        this.recoveryTicksRemaining = STUCK_RECOVERY_TICKS;
        // Deterministic parity flip prevents always choosing one bias.
        this.recoveryTurnClockwise = (observation.tick % 2) === 0;
        this.stuckTicks = 0;
      }
    }

    this.lastSelfPosition = {
      x: observation.self.x,
      y: observation.self.y,
    };
  }

  private findTargetingInfo(observation: BotObservation): TargetingInfo | null {
    if (observation.enemies.length === 0) {
      return null;
    }

    let bestTarget: TargetingInfo | null = null;

    for (const enemy of observation.enemies) {
      const dx = enemy.x - observation.self.x;
      const dy = enemy.y - observation.self.y;
      const distanceSquared = (dx * dx) + (dy * dy);
      const angularError = this.computeAngularError(observation.self.direction, dx, dy);

      if (bestTarget === null || distanceSquared < bestTarget.distanceSquared) {
        bestTarget = {
          distanceSquared,
          angularError,
        };
      }
    }

    return bestTarget;
  }

  private computeAngularError(direction: number, deltaX: number, deltaY: number): number {
    const headingRadians = this.directionToRadians(direction);
    const targetRadians = Math.atan2(deltaY, deltaX);
    return this.absoluteWrappedAngleDifference(headingRadians, targetRadians);
  }

  private directionToRadians(direction: number): number {
    return (FULL_CIRCLE_DIRECTION - direction) * DIRECTION_SCALE;
  }

  private absoluteWrappedAngleDifference(a: number, b: number): number {
    const tau = Math.PI * 2;
    let diff = Math.abs(a - b) % tau;
    if (diff > Math.PI) {
      diff = tau - diff;
    }
    return diff;
  }
}
