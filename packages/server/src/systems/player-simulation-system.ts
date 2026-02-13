import {
  MINE_DAMAGE,
  MINE_EXPLOSION_RADIUS_TILES,
  SOUND_BUBBLES,
  SOUND_MINE_EXPLOSION,
  SOUND_SHOOTING,
  SOUND_TANK_SINKING,
  TILE_SIZE_WORLD,
  WATER_DRAIN_INTERVAL_TICKS,
  WATER_MINES_DRAINED,
  WATER_SHELLS_DRAINED,
  TerrainType,
  type PlayerInput,
} from '@jsbolo/shared';
import type {ServerPillbox} from '../simulation/pillbox.js';
import type {ServerTank} from '../simulation/tank.js';

interface MineExplosionTile {
  x: number;
  y: number;
  originalTerrain: TerrainType;
}

interface MineExplosionMine {
  x: number;
  y: number;
}

interface SimulationPlayer {
  id: number;
  tank: ServerTank;
  lastInput: PlayerInput;
  pendingBuildOrder?: NonNullable<PlayerInput['buildOrder']>;
}

interface SimulationWorldView {
  getTankSpeedAtPosition(x: number, y: number): number;
  isPassable(tileX: number, tileY: number): boolean;
  getTerrainAt(tileX: number, tileY: number): TerrainType;
  setTerrainAt(tileX: number, tileY: number, terrain: TerrainType, direction?: number): void;
  hasMineAt(tileX: number, tileY: number): boolean;
  triggerMineExplosion(tileX: number, tileY: number, radiusTiles: number): {
    explodedMines: MineExplosionMine[];
    affectedTiles: MineExplosionTile[];
  };
}

interface PlayerSimulationContext {
  world: SimulationWorldView;
  players: Iterable<SimulationPlayer>;
  pillboxes: Iterable<ServerPillbox>;
}

interface PlayerSimulationCallbacks {
  tryRespawn(player: SimulationPlayer): void;
  emitSound(soundId: number, x: number, y: number): void;
  onTerrainChanged(tileX: number, tileY: number): void;
  onForestDestroyed(tileX: number, tileY: number): void;
  scheduleTankRespawn(tankId: number): void;
  onMineExploded(tileX: number, tileY: number): void;
  spawnShell(tank: ServerTank): void;
  updateBuilder(tank: ServerTank, tick: number): void;
  onPillboxPickedUp?(event: {
    pillboxId: number;
    previousOwnerTeam: number;
    newOwnerTeam: number;
    byTankId: number;
  }): void;
}

/**
 * Owns per-player tick simulation orchestration.
 *
 * WHY THIS SYSTEM EXISTS:
 * - `GameSession.update()` had a large mixed-responsibility player loop.
 * - Extracting it keeps session orchestration thin and testable.
 * - Gameplay semantics stay centralized while lower-level effects are callback-driven.
 */
export class PlayerSimulationSystem {
  /**
   * Simulate one tick for all players.
   * Dead tanks are delegated to respawn handling; living tanks run movement/combat-support logic.
   */
  updatePlayers(
    tick: number,
    context: PlayerSimulationContext,
    callbacks: PlayerSimulationCallbacks
  ): void {
    for (const player of context.players) {
      const tank = player.tank;

      if (tank.isDead()) {
        callbacks.tryRespawn(player);
        continue;
      }

      let terrainSpeed = context.world.getTankSpeedAtPosition(tank.x, tank.y);
      if (tank.onBoat) {
        // Decision: boats always run at full speed to avoid edge-sampling slowdowns.
        terrainSpeed = 1.0;
      }

      const checkCollision = (newX: number, newY: number): boolean => {
        const newTileX = Math.floor(newX / TILE_SIZE_WORLD);
        const newTileY = Math.floor(newY / TILE_SIZE_WORLD);
        return context.world.isPassable(newTileX, newTileY);
      };

      const prevTile = tank.getTilePosition();
      const inputForTick: PlayerInput = player.pendingBuildOrder
        ? {...player.lastInput, buildOrder: player.pendingBuildOrder}
        : player.lastInput;
      // Build orders are one-shot commands. Consume exactly once per server tick.
      delete player.pendingBuildOrder;

      tank.update(inputForTick, terrainSpeed, checkCollision);
      this.updateBoatState(tank, prevTile, context.world, callbacks);
      if (this.handleDeepSeaHazard(tank, context.world, callbacks)) {
        continue;
      }
      this.updateWaterDrain(tank, context.world, callbacks);

      if (player.lastInput.shooting && tank.canShoot()) {
        callbacks.spawnShell(tank);
        tank.shoot();
        callbacks.emitSound(SOUND_SHOOTING, tank.x, tank.y);
      }

      tank.builder.updateRespawn(tank.x, tank.y);
      if (!tank.builder.isDead()) {
        tank.builder.update(tank.x, tank.y);
        callbacks.updateBuilder(tank, tick);
      }

      this.tryPickupDisabledPillbox(tank, context.pillboxes, callbacks);
      this.handleTankMineInteraction(tank, context, callbacks);
    }
  }

  private updateBoatState(
    tank: ServerTank,
    prevTile: {x: number; y: number},
    world: SimulationWorldView,
    callbacks: PlayerSimulationCallbacks
  ): void {
    if (tank.onBoat) {
      const newTile = tank.getTilePosition();
      const newTerrain = world.getTerrainAt(newTile.x, newTile.y);
      if (newTile.x === prevTile.x && newTile.y === prevTile.y) {
        return;
      }

      const isWaterTerrain = (t: TerrainType): boolean =>
        t === TerrainType.DEEP_SEA || t === TerrainType.RIVER || t === TerrainType.BOAT;
      if (isWaterTerrain(newTerrain)) {
        return;
      }

      // Decision: disembark leaves a BOAT tile on the water tile just vacated.
      tank.onBoat = false;
      const boatDirection = (tank.direction + 128) % 256;
      world.setTerrainAt(prevTile.x, prevTile.y, TerrainType.BOAT, boatDirection);
      callbacks.onTerrainChanged(prevTile.x, prevTile.y);
      console.log(
        `Tank ${tank.id} disembarked at (${newTile.x}, ${newTile.y}), left boat facing ${boatDirection} at (${prevTile.x}, ${prevTile.y})`
      );
      return;
    }

    const currentTile = tank.getTilePosition();
    const currentTerrain = world.getTerrainAt(currentTile.x, currentTile.y);
    if (currentTerrain === TerrainType.BOAT) {
      // Decision: boarding a boat restores that tile back to RIVER terrain.
      tank.onBoat = true;
      world.setTerrainAt(currentTile.x, currentTile.y, TerrainType.RIVER);
      callbacks.onTerrainChanged(currentTile.x, currentTile.y);
      console.log(
        `Tank ${tank.id} boarded boat at (${currentTile.x}, ${currentTile.y}), restored RIVER terrain`
      );
    }
  }

  private updateWaterDrain(
    tank: ServerTank,
    world: SimulationWorldView,
    callbacks: PlayerSimulationCallbacks
  ): void {
    const currentTile = tank.getTilePosition();
    const terrain = world.getTerrainAt(currentTile.x, currentTile.y);
    const isInWater = terrain === TerrainType.RIVER || terrain === TerrainType.DEEP_SEA;

    if (isInWater && !tank.onBoat) {
      tank.waterTickCounter++;
      if (tank.waterTickCounter >= WATER_DRAIN_INTERVAL_TICKS) {
        tank.waterTickCounter = 0;
        // Decision: water attrition drains shells first, then mines on same cadence.
        if (tank.shells > 0) {
          tank.shells = Math.max(0, tank.shells - WATER_SHELLS_DRAINED);
          callbacks.emitSound(SOUND_BUBBLES, tank.x, tank.y);
        }
        if (tank.mines > 0) {
          tank.mines = Math.max(0, tank.mines - WATER_MINES_DRAINED);
          if (tank.shells === 0) {
            callbacks.emitSound(SOUND_BUBBLES, tank.x, tank.y);
          }
        }
      }
      return;
    }

    tank.waterTickCounter = 0;
  }

  /**
   * Manual rule: deep sea without boat is instant death.
   * Returns true when tank was killed and remaining per-tick actions should stop.
   */
  private handleDeepSeaHazard(
    tank: ServerTank,
    world: SimulationWorldView,
    callbacks: PlayerSimulationCallbacks
  ): boolean {
    const currentTile = tank.getTilePosition();
    const terrain = world.getTerrainAt(currentTile.x, currentTile.y);
    if (terrain !== TerrainType.DEEP_SEA || tank.onBoat) {
      return false;
    }

    // Use takeDamage to preserve standard death flow and respawn scheduling.
    const killed = tank.takeDamage(Math.max(1, tank.armor));
    if (killed) {
      console.log(`Tank ${tank.id} sank in deep sea at (${currentTile.x}, ${currentTile.y})`);
      callbacks.emitSound(SOUND_TANK_SINKING, tank.x, tank.y);
      callbacks.scheduleTankRespawn(tank.id);
    }
    return killed;
  }

  private tryPickupDisabledPillbox(
    tank: ServerTank,
    pillboxes: Iterable<ServerPillbox>,
    callbacks: PlayerSimulationCallbacks
  ): void {
    if (!tank.canPickupPillbox()) {
      return;
    }

    const tankTilePos = tank.getTilePosition();
    for (const pillbox of pillboxes) {
      if (pillbox.armor > 0 || pillbox.inTank) {
        continue;
      }
      if (pillbox.tileX === tankTilePos.x && pillbox.tileY === tankTilePos.y) {
        const previousOwnerTeam = pillbox.ownerTeam;
        // Decision: drive-over pickup captures/repairs exactly one disabled pillbox per tick.
        tank.pickupPillbox(pillbox);
        callbacks.onPillboxPickedUp?.({
          pillboxId: pillbox.id,
          previousOwnerTeam,
          newOwnerTeam: tank.team,
          byTankId: tank.id,
        });
        console.log(
          `[PILLBOX] Tank ${tank.id} picked up pillbox ${pillbox.id}, repaired and captured for team ${tank.team}`
        );
        break;
      }
    }
  }

  private handleTankMineInteraction(
    tank: ServerTank,
    context: PlayerSimulationContext,
    callbacks: PlayerSimulationCallbacks
  ): void {
    const tankTile = tank.getTilePosition();
    if (!context.world.hasMineAt(tankTile.x, tankTile.y)) {
      return;
    }

    const {explodedMines, affectedTiles} = context.world.triggerMineExplosion(
      tankTile.x,
      tankTile.y,
      MINE_EXPLOSION_RADIUS_TILES
    );

    // Terrain and regrowth side effects happen before damage/sound fan-out.
    for (const tile of affectedTiles) {
      callbacks.onTerrainChanged(tile.x, tile.y);
      if (tile.originalTerrain === TerrainType.FOREST) {
        callbacks.onForestDestroyed(tile.x, tile.y);
      }
    }

    for (const mine of explodedMines) {
      const worldX = (mine.x + 0.5) * TILE_SIZE_WORLD;
      const worldY = (mine.y + 0.5) * TILE_SIZE_WORLD;
      callbacks.emitSound(SOUND_MINE_EXPLOSION, worldX, worldY);
      callbacks.onMineExploded(mine.x, mine.y);
    }

    for (const mine of explodedMines) {
      const centerX = (mine.x + 0.5) * TILE_SIZE_WORLD;
      const centerY = (mine.y + 0.5) * TILE_SIZE_WORLD;
      const explosionRadius = MINE_EXPLOSION_RADIUS_TILES * TILE_SIZE_WORLD;

      for (const otherPlayer of context.players) {
        const otherTank = otherPlayer.tank;
        if (otherTank.isDead()) {
          continue;
        }

        const dx = otherTank.x - centerX;
        const dy = otherTank.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= explosionRadius) {
          const killed = otherTank.takeDamage(MINE_DAMAGE);
          if (killed) {
            console.log(`Tank ${otherTank.id} destroyed by mine explosion`);
            callbacks.emitSound(SOUND_TANK_SINKING, otherTank.x, otherTank.y);
            callbacks.scheduleTankRespawn(otherTank.id);
          }
        }
      }
    }

    console.log(
      `Mine chain reaction: ${explodedMines.length} mines exploded at (${tankTile.x}, ${tankTile.y}), damaged ${affectedTiles.length} tiles`
    );
  }
}
