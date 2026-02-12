import {RangeAdjustment} from '@jsbolo/shared';
import {
  type BotBaseState,
  type BotCommand,
  type BotController,
  type BotObservation,
  type BotPillboxState,
  type BotShellState,
} from '../types.js';

const FULL_CIRCLE_DIRECTION = 256;
const DIRECTION_SCALE = (2 * Math.PI) / FULL_CIRCLE_DIRECTION;
const SHOOT_DISTANCE_WORLD_UNITS = 8 * 256;
const SHOOT_DISTANCE_SQUARED = SHOOT_DISTANCE_WORLD_UNITS * SHOOT_DISTANCE_WORLD_UNITS;
const AIM_TOLERANCE_RADIANS = Math.PI / 12; // 15 degrees
const DANGER_SHELL_DISTANCE = 2.5 * 256;
const LOW_ARMOR_THRESHOLD = 18;
const LOW_SHELL_THRESHOLD = 8;

/**
 * Tactical bot with basic strategy:
 * - Evasive maneuver when shells are close.
 * - Retreat to allied/neutral bases when low on armor or shells.
 * - Engage nearest visible enemy tank.
 * - Otherwise move toward capturable objective (neutral/enemy base or pillbox).
 * - Fallback to deterministic sweep patrol.
 */
export class TacticalBot implements BotController {
  readonly profile = 'tactical';

  think(observation: BotObservation): BotCommand {
    const shellThreat = this.getNearestShellThreat(
      observation.visibleShells ?? [],
      observation.self.team,
      observation.self.x,
      observation.self.y
    );
    if (shellThreat && shellThreat.distanceSquared <= DANGER_SHELL_DISTANCE * DANGER_SHELL_DISTANCE) {
      return this.createEvasionCommand(observation.tick);
    }

    const shouldRefuel = observation.self.armor <= LOW_ARMOR_THRESHOLD || observation.self.shells <= LOW_SHELL_THRESHOLD;
    if (shouldRefuel) {
      const supplyBase = this.findNearestResupplyBase(observation.visibleBases ?? [], observation.self.team, observation.self.x, observation.self.y);
      if (supplyBase) {
        return this.navigateTowards(observation, supplyBase.x, supplyBase.y, false);
      }
    }

    const nearestEnemy = this.findNearestTank(observation);
    if (nearestEnemy) {
      return this.navigateTowards(
        observation,
        nearestEnemy.x,
        nearestEnemy.y,
        nearestEnemy.distanceSquared <= SHOOT_DISTANCE_SQUARED
      );
    }

    const objective = this.findNearestObjective(
      observation.visibleBases ?? [],
      observation.visiblePillboxes ?? [],
      observation.self.team,
      observation.self.x,
      observation.self.y
    );
    if (objective) {
      return this.navigateTowards(observation, objective.x, objective.y, false);
    }

    return this.createPatrolFallback(observation.tick);
  }

  private createEvasionCommand(tick: number): BotCommand {
    // Alternate turn direction each tick parity for deterministic jitter.
    const clockwise = (tick % 2) === 0;
    return {
      accelerating: true,
      braking: false,
      turningClockwise: clockwise,
      turningCounterClockwise: !clockwise,
      shooting: false,
      rangeAdjustment: RangeAdjustment.NONE,
    };
  }

  private navigateTowards(
    observation: BotObservation,
    targetX: number,
    targetY: number,
    allowShooting: boolean
  ): BotCommand {
    const dx = targetX - observation.self.x;
    const dy = targetY - observation.self.y;
    const distanceSquared = (dx * dx) + (dy * dy);
    const targetRadians = Math.atan2(dy, dx);
    const headingRadians = this.directionToRadians(observation.self.direction);
    const angleDiff = this.signedWrappedAngleDifference(headingRadians, targetRadians);
    const absoluteDiff = Math.abs(angleDiff);

    const turningClockwise = angleDiff < -0.05;
    const turningCounterClockwise = angleDiff > 0.05;
    const nearlyAligned = absoluteDiff <= AIM_TOLERANCE_RADIANS;

    return {
      accelerating: true,
      braking: false,
      turningClockwise,
      turningCounterClockwise,
      shooting: allowShooting &&
        nearlyAligned &&
        distanceSquared <= SHOOT_DISTANCE_SQUARED &&
        observation.self.reload === 0 &&
        observation.self.shells > 0,
      rangeAdjustment: RangeAdjustment.NONE,
    };
  }

  private createPatrolFallback(tick: number): BotCommand {
    const phase = Math.floor(tick / 64) % 2;
    const clockwise = phase === 0;
    return {
      accelerating: true,
      braking: false,
      turningClockwise: clockwise,
      turningCounterClockwise: !clockwise,
      shooting: false,
      rangeAdjustment: RangeAdjustment.NONE,
    };
  }

  private findNearestTank(observation: BotObservation): {x: number; y: number; distanceSquared: number} | null {
    let nearest: {x: number; y: number; distanceSquared: number} | null = null;

    for (const enemy of observation.enemies) {
      const dx = enemy.x - observation.self.x;
      const dy = enemy.y - observation.self.y;
      const distanceSquared = (dx * dx) + (dy * dy);
      if (!nearest || distanceSquared < nearest.distanceSquared) {
        nearest = {x: enemy.x, y: enemy.y, distanceSquared};
      }
    }

    return nearest;
  }

  private findNearestResupplyBase(
    bases: readonly BotBaseState[],
    team: number,
    selfX: number,
    selfY: number
  ): BotBaseState | null {
    let nearest: BotBaseState | null = null;
    let nearestDistanceSquared = Number.POSITIVE_INFINITY;

    for (const base of bases) {
      // Neutral and same-team bases can resupply.
      if (base.ownerTeam !== 255 && base.ownerTeam !== team) {
        continue;
      }

      const dx = base.x - selfX;
      const dy = base.y - selfY;
      const distanceSquared = (dx * dx) + (dy * dy);
      if (distanceSquared < nearestDistanceSquared) {
        nearestDistanceSquared = distanceSquared;
        nearest = base;
      }
    }

    return nearest;
  }

  private findNearestObjective(
    bases: readonly BotBaseState[],
    pillboxes: readonly BotPillboxState[],
    team: number,
    selfX: number,
    selfY: number
  ): {x: number; y: number} | null {
    let nearest: {x: number; y: number; distanceSquared: number} | null = null;

    for (const base of bases) {
      if (base.ownerTeam === team) {
        continue;
      }
      const dx = base.x - selfX;
      const dy = base.y - selfY;
      const distanceSquared = (dx * dx) + (dy * dy);
      if (!nearest || distanceSquared < nearest.distanceSquared) {
        nearest = {x: base.x, y: base.y, distanceSquared};
      }
    }

    for (const pillbox of pillboxes) {
      if (pillbox.ownerTeam === team) {
        continue;
      }
      const dx = pillbox.x - selfX;
      const dy = pillbox.y - selfY;
      const distanceSquared = (dx * dx) + (dy * dy);
      if (!nearest || distanceSquared < nearest.distanceSquared) {
        nearest = {x: pillbox.x, y: pillbox.y, distanceSquared};
      }
    }

    return nearest ? {x: nearest.x, y: nearest.y} : null;
  }

  private getNearestShellThreat(
    shells: readonly BotShellState[],
    selfTeam: number,
    selfX: number,
    selfY: number
  ): {distanceSquared: number} | null {
    let nearestDistanceSquared = Number.POSITIVE_INFINITY;

    for (const shell of shells) {
      if (shell.ownerTeam !== null && shell.ownerTeam === selfTeam) {
        continue;
      }
      const dx = shell.x - selfX;
      const dy = shell.y - selfY;
      const distanceSquared = (dx * dx) + (dy * dy);
      if (distanceSquared < nearestDistanceSquared) {
        nearestDistanceSquared = distanceSquared;
      }
    }

    return Number.isFinite(nearestDistanceSquared)
      ? {distanceSquared: nearestDistanceSquared}
      : null;
  }

  private directionToRadians(direction: number): number {
    return (FULL_CIRCLE_DIRECTION - direction) * DIRECTION_SCALE;
  }

  private signedWrappedAngleDifference(from: number, to: number): number {
    const tau = Math.PI * 2;
    let diff = (to - from) % tau;
    if (diff > Math.PI) {
      diff -= tau;
    }
    if (diff < -Math.PI) {
      diff += tau;
    }
    return diff;
  }
}
