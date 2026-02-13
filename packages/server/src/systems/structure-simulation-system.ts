import {
  BASE_REFUEL_RANGE,
  NEUTRAL_TEAM,
  PILLBOX_RANGE,
  TILE_SIZE_WORLD,
} from '@jsbolo/shared';
import type {ServerBase} from '../simulation/base.js';
import type {ServerPillbox} from '../simulation/pillbox.js';
import type {ServerTank} from '../simulation/tank.js';

interface StructurePlayer {
  tank: ServerTank;
}

interface StructureWorldView {
  isTankConcealedInForest(tileX: number, tileY: number): boolean;
}

interface StructureContext {
  world: StructureWorldView;
  players: Iterable<StructurePlayer>;
  pillboxes: Iterable<ServerPillbox>;
  bases: Iterable<ServerBase>;
}

interface StructureCallbacks {
  areTeamsAllied(teamA: number, teamB: number): boolean;
  spawnShellFromPillbox(pillboxId: number, x: number, y: number, direction: number): void;
  onBaseCaptured?(event: {
    baseId: number;
    previousOwnerTeam: number;
    newOwnerTeam: number;
    capturingTankId: number;
  }): void;
}

/**
 * Simulates non-player structures each tick (pillboxes and bases).
 *
 * WHY THIS SYSTEM EXISTS:
 * - Pillbox/base loops were embedded in `GameSession.update()`.
 * - Extracting them keeps session orchestration focused and testable.
 */
export class StructureSimulationSystem {
  /**
   * Advance all structure simulation by one tick.
   */
  updateStructures(
    context: StructureContext,
    callbacks: StructureCallbacks
  ): void {
    // Materialize players once because `Map#values()` iterators are single-use.
    const players = Array.from(context.players);
    this.updatePillboxes({...context, players}, callbacks);
    this.updateBases({...context, players}, callbacks);
  }

  private updatePillboxes(
    context: StructureContext,
    callbacks: StructureCallbacks
  ): void {
    for (const pillbox of context.pillboxes) {
      if (pillbox.isDead()) {
        continue;
      }

      pillbox.update();
      if (!pillbox.canShoot()) {
        continue;
      }

      const tanks = Array.from(context.players).map(p => ({
        id: p.tank.id,
        x: p.tank.x,
        y: p.tank.y,
        direction: p.tank.direction,
        speed: p.tank.speed,
        team: p.tank.team,
        armor: p.tank.armor,
      }));

      const target = pillbox.findTarget(
        tanks.filter(tank => !callbacks.areTeamsAllied(tank.team, pillbox.ownerTeam)),
        PILLBOX_RANGE,
        (tileX, tileY) => context.world.isTankConcealedInForest(tileX, tileY)
      );
      if (!target) {
        pillbox.loseTarget();
        continue;
      }

      if (!pillbox.shoot()) {
        continue;
      }

      const pos = pillbox.getWorldPosition();
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Shell speed is fixed at 32 world units/tick.
      const predictedX =
        target.x + (distance / 32) * Math.round(Math.cos(((256 - target.direction) * 2 * Math.PI) / 256) * Math.ceil(target.speed));
      const predictedY =
        target.y + (distance / 32) * Math.round(Math.sin(((256 - target.direction) * 2 * Math.PI) / 256) * Math.ceil(target.speed));
      const direction = pillbox.getDirectionTo(predictedX, predictedY);
      callbacks.spawnShellFromPillbox(pillbox.id, pos.x, pos.y, direction);
    }
  }

  private updateBases(
    context: StructureContext,
    callbacks: StructureCallbacks
  ): void {
    for (const base of context.bases) {
      base.update();

      for (const player of context.players) {
        const tank = player.tank;
        if (tank.isDead()) {
          continue;
        }

        const tankTileX = Math.floor(tank.x / TILE_SIZE_WORLD);
        const tankTileY = Math.floor(tank.y / TILE_SIZE_WORLD);
        const isDrivingOnBaseTile = tankTileX === base.tileX && tankTileY === base.tileY;

        // Manual nuance: neutral/depleted-base capture occurs by driving onto the base,
        // not by merely entering refuel proximity.
        if (isDrivingOnBaseTile && base.ownerTeam === NEUTRAL_TEAM) {
          const previousOwnerTeam = base.ownerTeam;
          base.capture(tank.team);
          callbacks.onBaseCaptured?.({
            baseId: base.id,
            previousOwnerTeam,
            newOwnerTeam: tank.team,
            capturingTankId: tank.id,
          });
        } else if (
          isDrivingOnBaseTile &&
          base.armor <= 0 &&
          !callbacks.areTeamsAllied(base.ownerTeam, tank.team)
        ) {
          const previousOwnerTeam = base.ownerTeam;
          base.capture(tank.team);
          callbacks.onBaseCaptured?.({
            baseId: base.id,
            previousOwnerTeam,
            newOwnerTeam: tank.team,
            capturingTankId: tank.id,
          });
        }

        if (base.isTankInRange(tank.x, tank.y, BASE_REFUEL_RANGE)) {
          base.refuelTank(tank);
        }
      }
    }
  }
}
