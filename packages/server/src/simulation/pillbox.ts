/**
 * Pillbox (defensive structure) simulation
 */

import {TILE_SIZE_WORLD, PILLBOX_STARTING_ARMOR} from '@jsbolo/shared';

const PILLBOX_COOLDOWN_TICKS = 32;
const PILLBOX_MIN_FIRERATE_TICKS = 6;
const PILLBOX_NORMAL_FIRERATE_TICKS = 100;
const PILLBOX_SHELL_HIT_DAMAGE = 1;

export class ServerPillbox {
  id: number;
  tileX: number;
  tileY: number;
  armor: number;
  ownerTeam: number; // 255 = neutral
  inTank: boolean;
  reload: number;

  // WinBolo/Orona behavior:
  // - `speed` is "ticks between shots" (lower = faster)
  // - Taking shell hits halves speed down to min 6 (gets angrier)
  // - Cooldown ticks gradually return speed toward 100
  private coolDown = 0;
  private speed = PILLBOX_NORMAL_FIRERATE_TICKS;
  private hasTarget = false; // Acquisition delay flag

  private static nextId = 1;

  constructor(tileX: number, tileY: number, ownerTeam = 255, initialSpeed = PILLBOX_NORMAL_FIRERATE_TICKS) {
    this.id = ServerPillbox.nextId++;
    this.tileX = tileX;
    this.tileY = tileY;
    this.armor = PILLBOX_STARTING_ARMOR;
    this.ownerTeam = ownerTeam;
    this.inTank = false;
    this.setAttackSpeed(initialSpeed);
    this.reload = this.speed;
  }

  /**
   * Update pillbox state
   */
  update(): void {
    // Reload progresses up to current fire interval.
    if (this.reload < this.speed) {
      this.reload++;
    }

    // Anger decays over time by increasing the interval back toward normal.
    if (this.coolDown > 0) {
      this.coolDown--;
      if (this.coolDown === 0) {
        this.speed++;
        if (this.speed < PILLBOX_NORMAL_FIRERATE_TICKS) {
          this.coolDown = PILLBOX_COOLDOWN_TICKS;
        }
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
   * Shell hit behavior from WinBolo/Orona:
   * - Shells reduce pillbox armor by 1.
   * - If still alive, pillbox is aggravated (fires faster for a while).
   */
  takeShellHit(): boolean {
    this.armor = Math.max(0, this.armor - PILLBOX_SHELL_HIT_DAMAGE);
    if (this.armor > 0) {
      this.aggravate();
    }
    return this.armor <= 0; // Return true if destroyed
  }

  /**
   * Explosion damage (e.g. mines) is larger than direct shell damage.
   */
  takeExplosionHit(amount: number): boolean {
    this.armor = Math.max(0, this.armor - amount);
    return this.armor <= 0;
  }

  /**
   * Make the pillbox angry: faster cadence, then decay over time.
   */
  private aggravate(): void {
    this.coolDown = PILLBOX_COOLDOWN_TICKS;
    if (this.speed > PILLBOX_MIN_FIRERATE_TICKS) {
      this.speed = Math.max(
        PILLBOX_MIN_FIRERATE_TICKS,
        Math.floor(this.speed / 2)
      );
    }
  }

  /**
   * Apply map-provided fire interval (6..100 ticks between shots).
   */
  setAttackSpeed(speed: number): void {
    const clamped = Math.max(
      PILLBOX_MIN_FIRERATE_TICKS,
      Math.min(PILLBOX_NORMAL_FIRERATE_TICKS, Math.round(speed))
    );
    this.speed = clamped;
    this.coolDown =
      this.speed < PILLBOX_NORMAL_FIRERATE_TICKS ? PILLBOX_COOLDOWN_TICKS : 0;
    this.reload = Math.min(this.reload ?? this.speed, this.speed);
  }

  /**
   * Read current fire interval (ticks between shots).
   */
  getAttackSpeed(): number {
    return this.speed;
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
