import {
  MINE_DAMAGE,
  MINE_EXPLOSION_RADIUS_TILES,
  SHELL_DAMAGE,
  SOUND_HIT_TANK,
  SOUND_MINE_EXPLOSION,
  SOUND_SHOT_BUILDING,
  SOUND_SHOT_TREE,
  SOUND_MAN_DYING,
  SOUND_TANK_SINKING,
  TILE_SIZE_WORLD,
  TerrainType,
} from '@jsbolo/shared';
import type {ServerShell} from '../simulation/shell.js';
import type {ServerWorld} from '../simulation/world.js';
import type {ServerTank} from '../simulation/tank.js';
import type {ServerPillbox} from '../simulation/pillbox.js';
import type {ServerBase} from '../simulation/base.js';

interface CombatPlayer {
  tank: ServerTank;
}

interface CombatCallbacks {
  areTeamsAllied(teamA: number, teamB: number): boolean;
  emitSound(soundId: number, x: number, y: number): void;
  scheduleTankRespawn(tankId: number): void;
  onTerrainChanged(tileX: number, tileY: number): void;
  onForestDestroyed(tileX: number, tileY: number): void;
  onMineExploded?(tileX: number, tileY: number): void;
  onBuilderKilled?(ownerTankId: number): void;
}

interface CombatContext {
  world: ServerWorld;
  players: Iterable<CombatPlayer>;
  getPlayerByTankId(tankId: number): CombatPlayer | undefined;
  pillboxes: Iterable<ServerPillbox>;
  bases: Iterable<ServerBase>;
}

export class CombatSystem {
  updateShells(
    shells: Map<number, ServerShell>,
    context: CombatContext,
    callbacks: CombatCallbacks
  ): void {
    for (const shell of shells.values()) {
      shell.update();

      if (shell.alive) {
        this.checkShellTerrainCollision(shell, context, callbacks);
      }
      if (shell.alive) {
        this.checkShellTankCollisions(shell, context.players, callbacks);
      }
      if (shell.alive) {
        this.checkShellPillboxCollisions(shell, context);
      }
      if (shell.alive) {
        this.checkShellBaseCollisions(shell, context);
      }
      if (shell.alive) {
        this.checkShellBuilderCollisions(shell, context.players, callbacks);
      }

      if (!shell.alive) {
        this.handleDeadShell(shell, context, callbacks);
        shells.delete(shell.id);
      }
    }
  }

  private checkShellTerrainCollision(
    shell: ServerShell,
    context: CombatContext,
    callbacks: CombatCallbacks
  ): void {
    const tilePos = shell.getTilePosition();
    const terrain = context.world.getTerrainAt(tilePos.x, tilePos.y);

    if (!context.world.checkShellTerrainCollision(tilePos.x, tilePos.y)) {
      return;
    }

    const worldX = (tilePos.x + 0.5) * TILE_SIZE_WORLD;
    const worldY = (tilePos.y + 0.5) * TILE_SIZE_WORLD;
    if (terrain === TerrainType.FOREST) {
      callbacks.emitSound(SOUND_SHOT_TREE, worldX, worldY);
    } else {
      callbacks.emitSound(SOUND_SHOT_BUILDING, worldX, worldY);
    }

    context.world.damageTerrainFromCollision(tilePos.x, tilePos.y);
    callbacks.onTerrainChanged(tilePos.x, tilePos.y);
    shell.killByCollision();

    if (terrain === TerrainType.FOREST) {
      callbacks.onForestDestroyed(tilePos.x, tilePos.y);
    }
  }

  private checkShellTankCollisions(
    shell: ServerShell,
    players: Iterable<CombatPlayer>,
    callbacks: CombatCallbacks
  ): void {
    for (const player of players) {
      const tank = player.tank;
      if (tank.isDead() || tank.id === shell.ownerTankId) {
        continue;
      }

      const dx = shell.x - tank.x;
      const dy = shell.y - tank.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance >= 128) {
        continue;
      }

      shell.killByCollision();
      const killed = tank.takeDamage(SHELL_DAMAGE);
      callbacks.emitSound(SOUND_HIT_TANK, tank.x, tank.y);

      if (killed) {
        callbacks.emitSound(SOUND_TANK_SINKING, tank.x, tank.y);
        callbacks.scheduleTankRespawn(tank.id);
      }
      break;
    }
  }

  private checkShellPillboxCollisions(
    shell: ServerShell,
    context: CombatContext
  ): void {
    for (const pillbox of context.pillboxes) {
      if (pillbox.isDead() || pillbox.inTank) {
        continue;
      }
      if (shell.ownerTankId === -pillbox.id) {
        continue;
      }

      const pos = pillbox.getWorldPosition();
      const dx = shell.x - pos.x;
      const dy = shell.y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance >= 128) {
        continue;
      }

      shell.killByCollision();
      pillbox.takeShellHit();
      break;
    }
  }

  private checkShellBaseCollisions(
    shell: ServerShell,
    context: CombatContext
  ): void {
    for (const base of context.bases) {
      const pos = base.getWorldPosition();
      const dx = shell.x - pos.x;
      const dy = shell.y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance >= 128) {
        continue;
      }

      shell.killByCollision();
      base.takeDamage(SHELL_DAMAGE);
      break;
    }
  }

  private checkShellBuilderCollisions(
    shell: ServerShell,
    players: Iterable<CombatPlayer>,
    callbacks: CombatCallbacks
  ): void {
    for (const player of players) {
      const builder = player.tank.builder;
      if (builder.isDead() || !builder.isOutsideTank() || player.tank.id === shell.ownerTankId) {
        continue;
      }

      const dx = shell.x - builder.x;
      const dy = shell.y - builder.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance >= 64) {
        continue;
      }

      shell.killByCollision();
      builder.kill();
      callbacks.emitSound(SOUND_MAN_DYING, builder.x, builder.y);
      callbacks.onBuilderKilled?.(builder.ownerTankId);
      break;
    }
  }

  private handleDeadShell(
    shell: ServerShell,
    context: CombatContext,
    callbacks: CombatCallbacks
  ): void {
    if (!shell.shouldExplode) {
      return;
    }

    const tilePos = shell.getTilePosition();
    if (context.world.hasMineAt(tilePos.x, tilePos.y)) {
      const {explodedMines, affectedTiles} = context.world.triggerMineExplosion(
        tilePos.x,
        tilePos.y,
        MINE_EXPLOSION_RADIUS_TILES
      );

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
        callbacks.onMineExploded?.(mine.x, mine.y);
      }

      for (const mine of explodedMines) {
        const centerX = (mine.x + 0.5) * TILE_SIZE_WORLD;
        const centerY = (mine.y + 0.5) * TILE_SIZE_WORLD;
        const explosionRadius = MINE_EXPLOSION_RADIUS_TILES * TILE_SIZE_WORLD;

        for (const player of context.players) {
          const tank = player.tank;
          if (tank.isDead()) {
            continue;
          }

          const dx = tank.x - centerX;
          const dy = tank.y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > explosionRadius) {
            continue;
          }

          const killed = tank.takeDamage(MINE_DAMAGE);
          if (killed) {
            callbacks.emitSound(SOUND_TANK_SINKING, tank.x, tank.y);
            callbacks.scheduleTankRespawn(tank.id);
          }
        }
      }
      return;
    }

    const originalTerrain = context.world.damageTerrainFromExplosion(tilePos.x, tilePos.y);
    callbacks.onTerrainChanged(tilePos.x, tilePos.y);

    if (originalTerrain === TerrainType.FOREST) {
      callbacks.onForestDestroyed(tilePos.x, tilePos.y);
    }
  }
}
