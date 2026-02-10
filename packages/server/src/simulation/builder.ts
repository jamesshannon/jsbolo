/**
 * Builder (LGM - Little Green Man) simulation
 */

import {
  TILE_SIZE_WORLD,
  BuilderOrder,
  TerrainType,
  type BuildAction,
} from '@jsbolo/shared';

export class ServerBuilder {
  id: number;
  ownerTankId: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  order: BuilderOrder;
  trees: number;
  hasMine: boolean;
  team: number;

  private static nextId = 1;
  private readonly speed = 4.0; // World units per tick (slower than tank)

  constructor(ownerTankId: number, team: number) {
    this.id = ServerBuilder.nextId++;
    this.ownerTankId = ownerTankId;
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.order = BuilderOrder.IN_TANK;
    this.trees = 0;
    this.hasMine = false;
    this.team = team;
  }

  /**
   * Update builder state
   */
  update(tankX: number, tankY: number): void {
    switch (this.order) {
      case BuilderOrder.IN_TANK:
        // Builder stays with tank
        this.x = tankX;
        this.y = tankY;
        break;

      case BuilderOrder.PARACHUTING:
        // Move towards target
        this.moveTowardsTarget();
        // Check if reached target
        if (this.hasReachedTarget()) {
          this.order = BuilderOrder.WAITING;
        }
        break;

      case BuilderOrder.WAITING:
        // Stay at current position
        break;

      case BuilderOrder.RETURNING:
        // Move back to tank
        this.targetX = tankX;
        this.targetY = tankY;
        this.moveTowardsTarget();
        // Check if reached tank
        if (this.hasReachedTarget()) {
          this.order = BuilderOrder.IN_TANK;
          this.x = tankX;
          this.y = tankY;
        }
        break;

      case BuilderOrder.HARVESTING:
      case BuilderOrder.BUILDING_ROAD:
      case BuilderOrder.BUILDING_WALL:
      case BuilderOrder.BUILDING_BOAT:
      case BuilderOrder.REPAIRING:
      case BuilderOrder.PLACING_PILLBOX:
      case BuilderOrder.LAYING_MINE:
        // Move to target location
        this.moveTowardsTarget();
        break;
    }
  }

  /**
   * Send builder to a location with an order
   */
  sendToLocation(
    targetTileX: number,
    targetTileY: number,
    action: BuildAction,
    tankMines?: number
  ): void {
    // Convert tile to world coordinates (center of tile)
    this.targetX = (targetTileX + 0.5) * TILE_SIZE_WORLD;
    this.targetY = (targetTileY + 0.5) * TILE_SIZE_WORLD;

    // Set order based on action
    switch (action) {
      case 1: // FOREST
        this.order = BuilderOrder.HARVESTING;
        break;
      case 2: // ROAD
        this.order = BuilderOrder.BUILDING_ROAD;
        break;
      case 3: // REPAIR
        this.order = BuilderOrder.REPAIRING;
        break;
      case 4: // BOAT
        this.order = BuilderOrder.BUILDING_BOAT;
        break;
      case 5: // BUILDING (wall)
        this.order = BuilderOrder.BUILDING_WALL;
        break;
      case 6: // PILLBOX
        this.order = BuilderOrder.PLACING_PILLBOX;
        break;
      case 7: // MINE
        this.order = BuilderOrder.LAYING_MINE;
        // Builder takes a mine from tank
        if (tankMines && tankMines > 0) {
          this.hasMine = true;
        }
        break;
      default:
        this.order = BuilderOrder.PARACHUTING;
    }
  }

  /**
   * Recall builder back to tank
   */
  recallToTank(tankX: number, tankY: number): void {
    this.targetX = tankX;
    this.targetY = tankY;
    this.order = BuilderOrder.RETURNING;
  }

  /**
   * Check if builder has reached target
   */
  private hasReachedTarget(): boolean {
    const dx = this.x - this.targetX;
    const dy = this.y - this.targetY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.speed * 2; // Within 2 ticks of travel
  }

  /**
   * Move builder towards target
   */
  private moveTowardsTarget(): void {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.speed) {
      // Normalize and move at constant speed
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    } else {
      // Snap to target
      this.x = this.targetX;
      this.y = this.targetY;
    }
  }

  /**
   * Check if builder is working (at target and doing a task)
   */
  isWorking(): boolean {
    return (
      this.hasReachedTarget() &&
      (this.order === BuilderOrder.HARVESTING ||
        this.order === BuilderOrder.BUILDING_ROAD ||
        this.order === BuilderOrder.BUILDING_WALL ||
        this.order === BuilderOrder.BUILDING_BOAT ||
        this.order === BuilderOrder.REPAIRING ||
        this.order === BuilderOrder.PLACING_PILLBOX ||
        this.order === BuilderOrder.LAYING_MINE)
    );
  }

  /**
   * Get current tile position
   */
  getTilePosition(): {x: number; y: number} {
    return {
      x: Math.floor(this.x / TILE_SIZE_WORLD),
      y: Math.floor(this.y / TILE_SIZE_WORLD),
    };
  }

  /**
   * Check if builder can harvest trees (must be at forest)
   */
  canHarvest(terrain: TerrainType): boolean {
    return terrain === TerrainType.FOREST && this.trees < 40;
  }

  /**
   * Harvest a tree
   */
  harvestTree(): void {
    this.trees++;
  }

  /**
   * Check if builder has enough trees for building
   */
  canBuildWall(): boolean {
    return this.trees > 0;
  }

  /**
   * Use a tree for building
   */
  useTree(): void {
    if (this.trees > 0) {
      this.trees--;
    }
  }
}
