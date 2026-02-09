/**
 * Tank entity
 */

import {
  TANK_MAX_SPEED,
  TANK_ACCELERATION,
  TANK_DECELERATION,
  DIRECTION_UNITS_FULL_CIRCLE,
  DIRECTION_PER_SIXTEENTH,
  TANK_STARTING_ARMOR,
  TANK_STARTING_SHELLS,
  TANK_STARTING_MINES,
  TANK_STARTING_TREES,
  TILE_SIZE_PIXELS,
} from '@shared';
import type {InputState} from '../input/keyboard.js';

export class Tank {
  // Position (in pixels, not world units for simplicity in Phase 1)
  x: number;
  y: number;

  // Movement
  direction = 0; // 0-255
  speed = 0;
  turnSpeed = 0;

  // Resources
  armor = TANK_STARTING_ARMOR;
  shells = TANK_STARTING_SHELLS;
  mines = TANK_STARTING_MINES;
  trees = TANK_STARTING_TREES;

  // State
  onBoat = false;
  reload = 0;
  firingRange = 7;

  constructor(tileX: number, tileY: number) {
    // Start at center of tile
    this.x = tileX * TILE_SIZE_PIXELS + TILE_SIZE_PIXELS / 2;
    this.y = tileY * TILE_SIZE_PIXELS + TILE_SIZE_PIXELS / 2;
  }

  /**
   * Update tank state based on input
   */
  update(input: InputState): void {
    this.updateTurning(input);
    this.updateSpeed(input);
    this.updatePosition();

    if (this.reload > 0) {
      this.reload--;
    }
  }

  private updateTurning(input: InputState): void {
    const maxTurn = 4; // Max turn rate per tick

    // Update turn speed with acceleration
    if (input.turningLeft && !input.turningRight) {
      if (this.turnSpeed < 10) {
        this.turnSpeed = Math.min(10, this.turnSpeed + 1);
      }
      this.direction = (this.direction - maxTurn + DIRECTION_UNITS_FULL_CIRCLE) % DIRECTION_UNITS_FULL_CIRCLE;
    } else if (input.turningRight && !input.turningLeft) {
      if (this.turnSpeed > -10) {
        this.turnSpeed = Math.max(-10, this.turnSpeed - 1);
      }
      this.direction = (this.direction + maxTurn) % DIRECTION_UNITS_FULL_CIRCLE;
    } else {
      this.turnSpeed = 0;
    }
  }

  private updateSpeed(input: InputState): void {
    const maxSpeed = TANK_MAX_SPEED;

    // Simplified speed control for Phase 1
    if (input.accelerating && !input.braking) {
      this.speed = Math.min(maxSpeed, this.speed + TANK_ACCELERATION);
    } else if (input.braking && !input.accelerating) {
      this.speed = Math.max(0, this.speed - TANK_DECELERATION);
    } else if (!input.accelerating && !input.braking) {
      // Natural deceleration
      this.speed = Math.max(0, this.speed - TANK_DECELERATION / 2);
    }
  }

  private updatePosition(): void {
    if (this.speed > 0) {
      // Convert direction (0-255) to radians
      // In Bolo, 0 = North, rotation is clockwise
      const radians = ((DIRECTION_UNITS_FULL_CIRCLE - this.direction) * 2 * Math.PI) / DIRECTION_UNITS_FULL_CIRCLE;

      this.x += Math.cos(radians) * this.speed;
      this.y += Math.sin(radians) * this.speed;

      // Simple bounds checking (Phase 1)
      // TODO: Proper collision detection in later phases
      this.x = Math.max(0, Math.min(this.x, TILE_SIZE_PIXELS * 256));
      this.y = Math.max(0, Math.min(this.y, TILE_SIZE_PIXELS * 256));
    }
  }

  /**
   * Get the tank's direction as a 16-directional index (for sprite selection)
   */
  getDirection16(): number {
    return Math.round((this.direction - 1) / DIRECTION_PER_SIXTEENTH) % 16;
  }

  /**
   * Get tile position
   */
  getTilePosition(): {x: number; y: number} {
    return {
      x: Math.floor(this.x / TILE_SIZE_PIXELS),
      y: Math.floor(this.y / TILE_SIZE_PIXELS),
    };
  }
}
