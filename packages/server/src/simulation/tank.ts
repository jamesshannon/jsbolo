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

  // Resources
  armor = TANK_STARTING_ARMOR;
  shells = TANK_STARTING_SHELLS;
  mines = TANK_STARTING_MINES;
  trees = TANK_STARTING_TREES;

  // State
  onBoat = false;
  reload = 0;
  firingRange = 7;

  constructor(id: number, team: number, tileX: number, tileY: number) {
    this.id = id;
    this.team = team;

    // Start at center of tile (in world coordinates)
    this.x = (tileX + 0.5) * TILE_SIZE_WORLD;
    this.y = (tileY + 0.5) * TILE_SIZE_WORLD;
  }

  /**
   * Update tank based on player input and terrain
   */
  update(input: PlayerInput, terrainSpeedMultiplier: number): void {
    this.updateTurning(input);
    this.updateSpeed(input, terrainSpeedMultiplier);
    this.updatePosition();

    if (this.reload > 0) {
      this.reload--;
    }
  }

  private updateTurning(input: PlayerInput): void {
    const maxTurn = 4;

    if (input.turningCounterClockwise && !input.turningClockwise) {
      if (this.turnSpeed < 10) {
        this.turnSpeed = Math.min(10, this.turnSpeed + 1);
      }
      this.direction = (this.direction - maxTurn + DIRECTION_UNITS_FULL_CIRCLE) % DIRECTION_UNITS_FULL_CIRCLE;
    } else if (input.turningClockwise && !input.turningCounterClockwise) {
      if (this.turnSpeed > -10) {
        this.turnSpeed = Math.max(-10, this.turnSpeed - 1);
      }
      this.direction = (this.direction + maxTurn) % DIRECTION_UNITS_FULL_CIRCLE;
    } else {
      this.turnSpeed = 0;
    }
  }

  private updateSpeed(input: PlayerInput, terrainSpeedMultiplier: number): void {
    const maxSpeed = TANK_MAX_SPEED * terrainSpeedMultiplier;

    if (this.speed > maxSpeed) {
      this.speed = Math.max(maxSpeed, this.speed - TANK_DECELERATION);
    } else if (input.accelerating && !input.braking) {
      this.speed = Math.min(maxSpeed, this.speed + TANK_ACCELERATION);
    } else if (input.braking && !input.accelerating) {
      this.speed = Math.max(0, this.speed - TANK_DECELERATION);
    } else if (!input.accelerating && !input.braking) {
      this.speed = Math.max(0, this.speed - TANK_DECELERATION / 2);
    }
  }

  private updatePosition(): void {
    if (this.speed > 0) {
      const radians = ((DIRECTION_UNITS_FULL_CIRCLE - this.direction) * 2 * Math.PI) / DIRECTION_UNITS_FULL_CIRCLE;

      this.x += Math.cos(radians) * this.speed;
      this.y += Math.sin(radians) * this.speed;

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
