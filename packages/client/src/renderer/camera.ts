/**
 * Camera/viewport management
 */

import {TILE_SIZE_PIXELS, MAP_SIZE_PIXELS} from '@shared';

export class Camera {
  private x = 0;
  private y = 0;

  constructor(
    private readonly viewportWidth: number,
    private readonly viewportHeight: number
  ) {}

  /**
   * Center camera on world coordinates
   */
  centerOn(worldX: number, worldY: number): void {
    this.x = worldX - this.viewportWidth / 2;
    this.y = worldY - this.viewportHeight / 2;

    // Clamp to map bounds
    this.x = Math.max(0, Math.min(this.x, MAP_SIZE_PIXELS - this.viewportWidth));
    this.y = Math.max(0, Math.min(this.y, MAP_SIZE_PIXELS - this.viewportHeight));
  }

  /**
   * Get camera position (top-left corner)
   */
  getPosition(): {x: number; y: number} {
    return {x: this.x, y: this.y};
  }

  /**
   * Convert world coordinates to screen coordinates
   */
  worldToScreen(worldX: number, worldY: number): {x: number; y: number} {
    return {
      x: worldX - this.x,
      y: worldY - this.y,
    };
  }

  /**
   * Convert screen coordinates to world coordinates
   */
  screenToWorld(screenX: number, screenY: number): {x: number; y: number} {
    return {
      x: screenX + this.x,
      y: screenY + this.y,
    };
  }

  /**
   * Get visible tile range (for culling)
   */
  getVisibleTiles(): {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } {
    const startX = Math.floor(this.x / TILE_SIZE_PIXELS);
    const startY = Math.floor(this.y / TILE_SIZE_PIXELS);
    const endX = Math.ceil((this.x + this.viewportWidth) / TILE_SIZE_PIXELS);
    const endY = Math.ceil((this.y + this.viewportHeight) / TILE_SIZE_PIXELS);

    return {startX, startY, endX, endY};
  }

  /**
   * Check if a point is visible on screen
   */
  isVisible(worldX: number, worldY: number, padding = 0): boolean {
    return (
      worldX >= this.x - padding &&
      worldX <= this.x + this.viewportWidth + padding &&
      worldY >= this.y - padding &&
      worldY <= this.y + this.viewportHeight + padding
    );
  }
}
