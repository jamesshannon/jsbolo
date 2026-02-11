/**
 * Server-side tank simulation
 */

import {
  TANK_MAX_SPEED,
  TANK_ACCELERATION,
  TANK_DECELERATION,
  DIRECTION_UNITS_FULL_CIRCLE,
  TANK_STARTING_ARMOR,
  TANK_STARTING_SHELLS,
  TANK_STARTING_MINES,
  TANK_STARTING_TREES,
  TILE_SIZE_WORLD,
  type PlayerInput,
} from '@jsbolo/shared';
import {ServerBuilder} from './builder.js';

export class ServerTank {
  id: number;
  team: number;

  // Position in world units (not pixels)
  x: number;
  y: number;

  // Movement
  direction = 0; // 0-255
  speed = 0;
  turnSpeed = 0;
  turnTicks = 0; // Track how long we've been turning

  // Resources
  armor = TANK_STARTING_ARMOR;
  shells = TANK_STARTING_SHELLS;
  mines = TANK_STARTING_MINES;
  trees = TANK_STARTING_TREES;

  // State
  onBoat = false;
  reload = 0;
  firingRange = 7;
  waterTickCounter = 0;

  // Builder
  builder: ServerBuilder;

  constructor(id: number, team: number, tileX: number, tileY: number) {
    this.id = id;
    this.team = team;

    // Start at center of tile (in world coordinates)
    this.x = (tileX + 0.5) * TILE_SIZE_WORLD;
    this.y = (tileY + 0.5) * TILE_SIZE_WORLD;

    // Create builder
    this.builder = new ServerBuilder(id, team);
  }

  /**
   * Update tank based on player input and terrain
   */
  update(
    input: PlayerInput,
    terrainSpeedMultiplier: number,
    checkCollision?: (newX: number, newY: number) => boolean
  ): void {
    this.updateTurning(input);
    this.updateSpeed(input, terrainSpeedMultiplier);
    this.updatePosition(checkCollision);

    if (this.reload > 0) {
      this.reload--;
    }

    // Handle range adjustment
    if (input.rangeAdjustment === 1) {
      // INCREASE (max range in Bolo is 9 tiles)
      this.firingRange = Math.min(9, this.firingRange + 0.5);
    } else if (input.rangeAdjustment === 2) {
      // DECREASE (min range is 1 tile)
      this.firingRange = Math.max(1, this.firingRange - 0.5);
    }

    // Update builder
    this.builder.update(this.x, this.y);

    // Handle builder orders
    if (input.buildOrder) {
      this.builder.sendToLocation(
        input.buildOrder.targetX,
        input.buildOrder.targetY,
        input.buildOrder.action,
        this.mines
      );
    }
  }

  /**
   * Check if tank can shoot
   */
  canShoot(): boolean {
    return this.reload === 0 && this.shells > 0 && this.armor > 0;
  }

  /**
   * Fire a shell
   */
  shoot(): void {
    if (this.canShoot()) {
      this.shells--;
      this.reload = 13; // 13 ticks reload time
    }
  }

  /**
   * Take damage from a shell
   */
  takeDamage(damage: number): boolean {
    this.armor -= damage;
    return this.armor <= 0; // Return true if tank is destroyed
  }

  /**
   * Check if tank is dead
   */
  isDead(): boolean {
    return this.armor <= 0;
  }

  /**
   * Respawn the tank
   */
  respawn(tileX: number, tileY: number): void {
    this.x = (tileX + 0.5) * TILE_SIZE_WORLD;
    this.y = (tileY + 0.5) * TILE_SIZE_WORLD;
    this.direction = 0;
    this.speed = 0;
    this.armor = TANK_STARTING_ARMOR;
    this.shells = TANK_STARTING_SHELLS;
    this.mines = TANK_STARTING_MINES;
    this.trees = TANK_STARTING_TREES;
    this.reload = 0;
    this.waterTickCounter = 0;
  }

  private updateTurning(input: PlayerInput): void {
    // Use finer turn increments with acceleration
    // First 10 ticks: turn 2 units per tick (slow, precise)
    // After 10 ticks: turn 4 units per tick (faster sustained turning)
    let turnAmount = this.turnTicks < 10 ? 2 : 4;

    if (input.turningCounterClockwise && !input.turningClockwise) {
      this.turnTicks++;
      if (this.turnSpeed < 10) {
        this.turnSpeed = Math.min(10, this.turnSpeed + 1);
      }
      this.direction =
        (this.direction - turnAmount + DIRECTION_UNITS_FULL_CIRCLE) %
        DIRECTION_UNITS_FULL_CIRCLE;
    } else if (input.turningClockwise && !input.turningCounterClockwise) {
      this.turnTicks++;
      if (this.turnSpeed > -10) {
        this.turnSpeed = Math.max(-10, this.turnSpeed - 1);
      }
      this.direction = (this.direction + turnAmount) % DIRECTION_UNITS_FULL_CIRCLE;
    } else {
      // Reset turn acceleration when not turning
      this.turnSpeed = 0;
      this.turnTicks = 0;
    }
  }

  /**
   * Update tank speed based on player input and terrain.
   *
   * Terrain affects maximum speed via a multiplier (0.0 to 1.0):
   * - Road: 1.0x (full speed, 16 units/tick)
   * - Grass/Rubble: 0.75x (12 units/tick)
   * - Crater/Forest: 0.5x (8 units/tick)
   * - Swamp: 0.25x (4 units/tick)
   *
   * When terrain changes:
   * - If current speed > new max: decelerate at normal rate (smooth slowdown)
   * - If current speed < new max: accelerate normally (smooth speedup)
   *
   * This creates realistic momentum where tanks don't instantly slow down
   * or speed up when crossing terrain boundaries.
   */
  private updateSpeed(input: PlayerInput, terrainSpeedMultiplier: number): void {
    const maxSpeed = TANK_MAX_SPEED * terrainSpeedMultiplier;

    // If going too fast for current terrain, decelerate smoothly
    if (this.speed > maxSpeed) {
      this.speed = Math.max(maxSpeed, this.speed - TANK_DECELERATION);
    } else if (input.accelerating && !input.braking) {
      this.speed = Math.min(maxSpeed, this.speed + TANK_ACCELERATION);
    } else if (input.braking && !input.accelerating) {
      this.speed = Math.max(0, this.speed - TANK_DECELERATION);
    } else if (!input.accelerating && !input.braking) {
      // Slow drift deceleration when coasting
      this.speed = Math.max(0, this.speed - TANK_DECELERATION / 2);
    }
  }

  private updatePosition(
    checkCollision?: (newX: number, newY: number) => boolean
  ): void {
    if (this.speed > 0) {
      const radians =
        ((DIRECTION_UNITS_FULL_CIRCLE - this.direction) * 2 * Math.PI) /
        DIRECTION_UNITS_FULL_CIRCLE;

      // Use ceil() on speed to ensure even small speeds produce movement
      // This matches the original Bolo behavior where speed 0.25 still moves the tank
      const effectiveSpeed = Math.ceil(this.speed);

      // Calculate movement delta and round to ensure integer world unit movement
      const dx = Math.round(Math.cos(radians) * effectiveSpeed);
      const dy = Math.round(Math.sin(radians) * effectiveSpeed);

      const newX = this.x + dx;
      const newY = this.y + dy;

      // Check collision if function provided
      if (checkCollision && !checkCollision(newX, newY)) {
        // Collision detected, stop the tank
        this.speed = 0;
        return;
      }

      this.x = newX;
      this.y = newY;

      // Bounds checking
      const maxCoord = TILE_SIZE_WORLD * 256;
      this.x = Math.max(0, Math.min(this.x, maxCoord));
      this.y = Math.max(0, Math.min(this.y, maxCoord));
    }
  }

  getTilePosition(): {x: number; y: number} {
    return {
      x: Math.floor(this.x / TILE_SIZE_WORLD),
      y: Math.floor(this.y / TILE_SIZE_WORLD),
    };
  }
}
