import {
  BUILDER_WALL_COST,
  BUILDER_BOAT_COST,
  BUILDER_PILLBOX_COST,
  PILLBOX_MAX_ARMOR,
  FOREST_REGROWTH_TICKS,
  SOUND_FARMING_TREE,
  SOUND_MAN_BUILDING,
  SOUND_MAN_LAY_MINE,
  BuilderOrder,
  TerrainType,
} from '@jsbolo/shared';
import {ServerPillbox} from '../simulation/pillbox.js';
import type {ServerTank} from '../simulation/tank.js';

export interface BuilderWorldView {
  getTerrainAt(tileX: number, tileY: number): TerrainType;
  setTerrainAt(tileX: number, tileY: number, terrain: TerrainType): void;
  hasMineAt(tileX: number, tileY: number): boolean;
}

export interface BuilderSystemContext {
  world: BuilderWorldView;
  pillboxes: Iterable<ServerPillbox>;
}

export interface BuilderSystemCallbacks {
  emitSound(soundId: number, x: number, y: number): void;
  onTerrainChanged(tileX: number, tileY: number): void;
  onTrackForestRegrowth(tileX: number, tileY: number): void;
  onPlaceMine(team: number, tileX: number, tileY: number): boolean;
  onCreatePillbox(pillbox: ServerPillbox): void;
}

export class BuilderSystem {
  update(
    tank: ServerTank,
    tick: number,
    context: BuilderSystemContext,
    callbacks: BuilderSystemCallbacks
  ): void {
    const builder = tank.builder;

    if (!builder.isWorking()) {
      return;
    }

    const builderTile = builder.getTilePosition();
    const terrain = context.world.getTerrainAt(builderTile.x, builderTile.y);
    console.log(
      `[BUILDER] Builder ${builder.id} working at (${builderTile.x}, ${builderTile.y}), order=${builder.order}, terrain=${terrain}`
    );

    switch (builder.order) {
      case BuilderOrder.HARVESTING:
        if (builder.canHarvest(terrain)) {
          if (tick % 10 === 0) {
            builder.harvestTree();
            context.world.setTerrainAt(builderTile.x, builderTile.y, TerrainType.GRASS);
            tank.trees = builder.trees;
            callbacks.emitSound(SOUND_FARMING_TREE, builder.x, builder.y);
            callbacks.onTerrainChanged(builderTile.x, builderTile.y);
            callbacks.onTrackForestRegrowth(builderTile.x, builderTile.y);
            console.log(
              `[REGROWTH] Started regrowth timer for (${builderTile.x}, ${builderTile.y}) with ${FOREST_REGROWTH_TICKS} ticks`
            );
          }
        } else {
          console.log(
            `[BUILDER] Cannot harvest at (${builderTile.x}, ${builderTile.y}): terrain=${terrain} (need 5), trees=${builder.trees} (max 40)`
          );
          builder.recallToTank(tank.x, tank.y);
        }
        break;

      case BuilderOrder.BUILDING_ROAD:
        if (builder.canBuildWall(BUILDER_WALL_COST) && terrain === TerrainType.GRASS) {
          if (tick % 10 === 0) {
            builder.useTrees(BUILDER_WALL_COST);
            context.world.setTerrainAt(builderTile.x, builderTile.y, TerrainType.ROAD);
            callbacks.onTerrainChanged(builderTile.x, builderTile.y);
            tank.trees = builder.trees;
            builder.recallToTank(tank.x, tank.y);
            callbacks.emitSound(SOUND_MAN_BUILDING, builder.x, builder.y);
          }
        } else {
          builder.recallToTank(tank.x, tank.y);
        }
        break;

      case BuilderOrder.BUILDING_WALL:
        if (builder.canBuildWall(BUILDER_WALL_COST) && terrain === TerrainType.GRASS) {
          if (tick % 10 === 0) {
            builder.useTrees(BUILDER_WALL_COST);
            context.world.setTerrainAt(builderTile.x, builderTile.y, TerrainType.BUILDING);
            callbacks.onTerrainChanged(builderTile.x, builderTile.y);
            tank.trees = builder.trees;
            builder.recallToTank(tank.x, tank.y);
            callbacks.emitSound(SOUND_MAN_BUILDING, builder.x, builder.y);
          }
        } else {
          builder.recallToTank(tank.x, tank.y);
        }
        break;

      case BuilderOrder.BUILDING_BOAT:
        if (builder.canBuildWall(BUILDER_BOAT_COST) && terrain === TerrainType.RIVER) {
          if (tick % 20 === 0) {
            builder.useTrees(BUILDER_BOAT_COST);
            context.world.setTerrainAt(builderTile.x, builderTile.y, TerrainType.BOAT);
            callbacks.onTerrainChanged(builderTile.x, builderTile.y);
            tank.trees = builder.trees;
            builder.recallToTank(tank.x, tank.y);
            callbacks.emitSound(SOUND_MAN_BUILDING, builder.x, builder.y);
          }
        } else {
          builder.recallToTank(tank.x, tank.y);
        }
        break;

      case BuilderOrder.LAYING_MINE:
        if (builder.hasMine && !context.world.hasMineAt(builderTile.x, builderTile.y)) {
          if (tick % 10 === 0) {
            callbacks.onPlaceMine(tank.team, builderTile.x, builderTile.y);
            builder.hasMine = false;
            tank.mines = Math.max(0, tank.mines - 1);
            builder.recallToTank(tank.x, tank.y);
            callbacks.emitSound(SOUND_MAN_LAY_MINE, builder.x, builder.y);
          }
        } else {
          builder.recallToTank(tank.x, tank.y);
        }
        break;

      case BuilderOrder.PLACING_PILLBOX:
        this.updatePillboxPlacement(tank, tick, terrain, builderTile.x, builderTile.y, callbacks);
        break;

      case BuilderOrder.REPAIRING:
        this.updateRepairing(tank, tick, builderTile.x, builderTile.y, context, callbacks);
        break;

      default:
        break;
    }
  }

  private updatePillboxPlacement(
    tank: ServerTank,
    tick: number,
    terrain: TerrainType,
    tileX: number,
    tileY: number,
    callbacks: BuilderSystemCallbacks
  ): void {
    const builder = tank.builder;
    const canPlacePillbox = (t: TerrainType): boolean =>
      t !== TerrainType.DEEP_SEA &&
      t !== TerrainType.BOAT &&
      t !== TerrainType.FOREST;

    if (builder.hasPillbox && canPlacePillbox(terrain)) {
      if (tick % 10 === 0) {
        const pillbox = tank.dropPillbox();
        if (pillbox) {
          pillbox.tileX = tileX;
          pillbox.tileY = tileY;
          builder.hasPillbox = false;
          builder.recallToTank(tank.x, tank.y);
          callbacks.emitSound(SOUND_MAN_BUILDING, builder.x, builder.y);
          console.log(`[PILLBOX] Placed pillbox ${pillbox.id} at (${tileX}, ${tileY})`);
        }
      }
      return;
    }

    if (builder.canBuildWall(BUILDER_PILLBOX_COST) && canPlacePillbox(terrain)) {
      if (tick % 10 === 0) {
        builder.useTrees(BUILDER_PILLBOX_COST);
        const newPillbox = new ServerPillbox(tileX, tileY, tank.team);
        callbacks.onCreatePillbox(newPillbox);
        tank.trees = builder.trees;
        builder.recallToTank(tank.x, tank.y);
        callbacks.emitSound(SOUND_MAN_BUILDING, builder.x, builder.y);
        console.log(`[PILLBOX] Built new pillbox at (${tileX}, ${tileY}) for team ${tank.team}`);
      }
      return;
    }

    console.log(
      `[PILLBOX] Cannot place pillbox at (${tileX}, ${tileY}): terrain=${terrain}, hasPillbox=${builder.hasPillbox}, trees=${builder.trees}`
    );
    builder.recallToTank(tank.x, tank.y);
  }

  private updateRepairing(
    tank: ServerTank,
    tick: number,
    tileX: number,
    tileY: number,
    context: BuilderSystemContext,
    callbacks: BuilderSystemCallbacks
  ): void {
    const builder = tank.builder;
    const pillboxAtLocation = Array.from(context.pillboxes).find(
      pb => pb.tileX === tileX && pb.tileY === tileY && !pb.inTank
    );

    if (pillboxAtLocation && pillboxAtLocation.armor < PILLBOX_MAX_ARMOR) {
      const damageRatio =
        (PILLBOX_MAX_ARMOR - pillboxAtLocation.armor) / PILLBOX_MAX_ARMOR;
      const repairCost = damageRatio * BUILDER_PILLBOX_COST;

      if (builder.canBuildWall(repairCost)) {
        if (tick % 10 === 0) {
          builder.useTrees(repairCost);
          pillboxAtLocation.armor = PILLBOX_MAX_ARMOR;
          tank.trees = builder.trees;
          builder.recallToTank(tank.x, tank.y);
          callbacks.emitSound(SOUND_MAN_BUILDING, builder.x, builder.y);
          console.log(
            `[PILLBOX] Repaired pillbox ${pillboxAtLocation.id} for ${repairCost.toFixed(2)} trees (ownership unchanged, still team ${pillboxAtLocation.ownerTeam})`
          );
        }
      } else {
        console.log(
          `[PILLBOX] Cannot repair: need ${repairCost.toFixed(2)} trees, have ${builder.trees}`
        );
        builder.recallToTank(tank.x, tank.y);
      }
    } else {
      console.log(`[PILLBOX] No damaged pillbox to repair at (${tileX}, ${tileY})`);
      builder.recallToTank(tank.x, tank.y);
    }
  }
}
