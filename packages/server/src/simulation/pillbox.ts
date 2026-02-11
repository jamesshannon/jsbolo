/**
 * Pillbox (defensive structure) simulation
 */

import {TILE_SIZE_WORLD, PILLBOX_STARTING_ARMOR} from '@jsbolo/shared';

export class ServerPillbox {
  id: number;
  tileX: number;
  tileY: number;
  armor: number;
  ownerTeam: number; // 255 = neutral
  inTank: boolean;
  reload = 0;

  // Variable reload speed system (from Orona)
  private coolDown = 32; // Ticks between speed increases
  private speed = 6; // Current firing speed (ticks between shots)
  private hasTarget = false; // Acquisition delay flag

  private static nextId = 1;

  constructor(tileX: number, tileY: number, ownerTeam = 255) {
    this.id = ServerPillbox.nextId++;
    this.tileX = tileX;
    this.tileY = tileY;
    this.armor = PILLBOX_STARTING_ARMOR;
    this.ownerTeam = ownerTeam;
    this.inTank = false;
  }

  /**
   * Update pillbox state
   */
  update(): void {
    // Increment reload counter
    if (this.reload < this.speed) {
      this.reload++;
    }

    // Decrement cooldown and increase speed
    if (this.coolDown > 0) {
      this.coolDown--;
    } else {
      // Every 32 ticks, increase firing speed (up to max 100)
      this.coolDown = 32;
      if (this.speed < 100) {
        this.speed++;
      }
    }
  }

  /**
   * Check if pillbox can shoot
   */
  canShoot(): boolean {
    return this.reload >= this.speed && this.armor > 0 && !this.inTank;
  }

  /**
   * Fire at a target (returns true if this is first shot at new target)
   */
  shoot(): boolean {
    if (!this.hasTarget) {
      // First frame of target acquisition - don't shoot yet
      this.hasTarget = true;
      this.reload = 0;
      return false; // Don't fire yet
    }

    if (this.canShoot()) {
      this.reload = 0;
      return true; // Fire!
    }

    return false;
  }

  /**
   * Called when target is lost
   */
  loseTarget(): void {
    this.hasTarget = false;
  }

  /**
   * Take damage
   * Triggers aggravation mechanic (slows down reload)
   */
  takeDamage(damage: number): boolean {
    this.armor -= damage;

    // Aggravation mechanic: halve speed when hit
    this.coolDown = 32;
    this.speed = Math.max(6, Math.floor(this.speed / 2));

    return this.armor <= 0; // Return true if destroyed
  }

  /**
   * Check if pillbox is dead
   */
  isDead(): boolean {
    return this.armor <= 0;
  }

  /**
   * Capture pillbox by a team
   */
  capture(team: number): void {
    this.ownerTeam = team;
  }

  /**
   * Get world position (center of tile)
   */
  getWorldPosition(): {x: number; y: number} {
    return {
      x: (this.tileX + 0.5) * TILE_SIZE_WORLD,
      y: (this.tileY + 0.5) * TILE_SIZE_WORLD,
    };
  }

  /**
   * Find nearest enemy tank within range
   * Neutral pillboxes (team 255) shoot at ALL tanks
   * Team-owned pillboxes only shoot at enemy tanks
   * Tanks concealed in forest cannot be targeted
   */
  findTarget(
    tanks: Array<{
      id: number;
      x: number;
      y: number;
      direction: number;
      speed: number;
      team: number;
      armor: number;
    }>,
    range: number,
    checkConcealment?: (tileX: number, tileY: number) => boolean
  ): {id: number; x: number; y: number; direction: number; speed: number} | null {
    const pos = this.getWorldPosition();
    let nearestDistance = range;
    let nearestTank: {
      id: number;
      x: number;
      y: number;
      direction: number;
      speed: number;
    } | null = null;

    for (const tank of tanks) {
      // Skip dead tanks
      if (tank.armor <= 0) {
        continue;
      }

      // If pillbox is owned by a team, skip friendly tanks
      if (this.ownerTeam !== 255 && tank.team === this.ownerTeam) {
        continue;
      }

      // Check if tank is concealed in forest
      if (checkConcealment) {
        const tankTileX = Math.floor(tank.x / TILE_SIZE_WORLD);
        const tankTileY = Math.floor(tank.y / TILE_SIZE_WORLD);
        if (checkConcealment(tankTileX, tankTileY)) {
          continue; // Skip concealed tanks
        }
      }

      const dx = tank.x - pos.x;
      const dy = tank.y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestTank = {
          id: tank.id,
          x: tank.x,
          y: tank.y,
          direction: tank.direction,
          speed: tank.speed,
        };
      }
    }

    return nearestTank;
  }

  /**
   * Get direction to target
   */
  getDirectionTo(targetX: number, targetY: number): number {
    const pos = this.getWorldPosition();
    const dx = targetX - pos.x;
    const dy = targetY - pos.y;
    const radians = Math.atan2(dy, dx);
    // Convert to 0-255 direction (0 = east, clockwise)
    let direction = Math.round((256 - (radians * 256) / (2 * Math.PI)) % 256);
    if (direction < 0) direction += 256;
    return direction;
  }
}
