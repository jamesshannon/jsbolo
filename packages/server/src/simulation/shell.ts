/**
 * Server-side shell (bullet) simulation
 */

import {TILE_SIZE_WORLD, DIRECTION_UNITS_FULL_CIRCLE} from '@jsbolo/shared';

export class ServerShell {
  id: number;
  x: number;
  y: number;
  direction: number;
  ownerTankId: number;
  range: number;
  distanceTraveled = 0;
  alive = true;
  shouldExplode = false; // True if shell died from range expiration

  private static nextId = 1;

  constructor(
    ownerTankId: number,
    startX: number,
    startY: number,
    direction: number,
    range: number
  ) {
    this.id = ServerShell.nextId++;
    this.ownerTankId = ownerTankId;
    this.x = startX;
    this.y = startY;
    this.direction = direction;
    this.range = range * TILE_SIZE_WORLD; // Convert tiles to world units
  }

  update(): void {
    if (!this.alive) {
      return;
    }

    // Shells travel at 32 world units per tick
    const speed = 32;
    const radians =
      ((DIRECTION_UNITS_FULL_CIRCLE - this.direction) * 2 * Math.PI) /
      DIRECTION_UNITS_FULL_CIRCLE;

    this.x += Math.cos(radians) * speed;
    this.y += Math.sin(radians) * speed;
    this.distanceTraveled += speed;

    // Check if shell exceeded range
    // Shell survives when distance equals range, dies when it exceeds
    if (this.distanceTraveled > this.range) {
      this.alive = false;
      this.shouldExplode = true; // End-of-life explosion
    }

    // Check map bounds
    const maxCoord = TILE_SIZE_WORLD * 256;
    if (this.x < 0 || this.x > maxCoord || this.y < 0 || this.y > maxCoord) {
      this.alive = false;
      this.shouldExplode = true; // Out of bounds explosion
    }
  }

  getTilePosition(): {x: number; y: number} {
    return {
      x: Math.floor(this.x / TILE_SIZE_WORLD),
      y: Math.floor(this.y / TILE_SIZE_WORLD),
    };
  }

  /**
   * Kill shell due to collision (no explosion)
   */
  killByCollision(): void {
    this.alive = false;
    this.shouldExplode = false; // Collision kills don't explode
  }
}
