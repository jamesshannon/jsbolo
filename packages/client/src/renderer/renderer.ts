/**
 * Main game renderer
 */

import {TILE_SIZE_PIXELS, TerrainType} from '@shared';
import {SpriteSheet} from './sprite-sheet.js';
import {Camera} from './camera.js';
import type {World} from '../world/world.js';
import type {Tank} from '../entities/tank.js';

/**
 * Simple terrain tile mapping for Phase 1
 * TODO: Implement proper auto-tiling based on neighbors
 */
const TERRAIN_TILES: Record<TerrainType, {x: number; y: number}> = {
  [TerrainType.GRASS]: {x: 7, y: 0},
  [TerrainType.FOREST]: {x: 5, y: 0},
  [TerrainType.SWAMP]: {x: 2, y: 0},
  [TerrainType.RIVER]: {x: 1, y: 2},
  [TerrainType.ROAD]: {x: 4, y: 0},
  [TerrainType.CRATER]: {x: 3, y: 0},
  [TerrainType.BUILDING]: {x: 0, y: 0},
  [TerrainType.RUBBLE]: {x: 6, y: 0},
  [TerrainType.SHOT_BUILDING]: {x: 8, y: 0},
  [TerrainType.BOAT]: {x: 9, y: 2},
  [TerrainType.DEEP_SEA]: {x: 10, y: 2},
};

export class Renderer {
  private baseSprites: SpriteSheet;
  private styledSprites: SpriteSheet;

  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    private readonly camera: Camera
  ) {
    this.baseSprites = new SpriteSheet('/assets/sprites/base.png');
    this.styledSprites = new SpriteSheet('/assets/sprites/styled.png');
  }

  async loadAssets(): Promise<void> {
    await Promise.all([this.baseSprites.load(), this.styledSprites.load()]);
  }

  /**
   * Render the game world
   */
  render(world: World, tank: Tank): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.renderTerrain(world);
    this.renderTank(tank);
  }

  /**
   * Render terrain tiles
   */
  private renderTerrain(world: World): void {
    const {startX, startY, endX, endY} = this.camera.getVisibleTiles();
    const camPos = this.camera.getPosition();

    world.forEachVisibleTile(startX, startY, endX, endY, (cell, tileX, tileY) => {
      const worldX = tileX * TILE_SIZE_PIXELS;
      const worldY = tileY * TILE_SIZE_PIXELS;
      const screenX = worldX - camPos.x;
      const screenY = worldY - camPos.y;

      const tileDef = TERRAIN_TILES[cell.terrain];
      if (tileDef) {
        this.baseSprites.drawTile(
          this.ctx,
          tileDef.x,
          tileDef.y,
          screenX,
          screenY
        );
      }

      // Draw mine indicator if present
      if (cell.hasMine) {
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        this.ctx.fillRect(
          screenX,
          screenY,
          TILE_SIZE_PIXELS,
          TILE_SIZE_PIXELS
        );
      }
    });
  }

  /**
   * Render tank
   */
  private renderTank(tank: Tank): void {
    const screenPos = this.camera.worldToScreen(tank.x, tank.y);
    const direction16 = tank.getDirection16();

    // Draw tank sprite
    // Tank sprites are in styled.png, row 0 for land, row 1 for boat
    const row = tank.onBoat ? 1 : 0;
    this.styledSprites.drawTile(
      this.ctx,
      direction16,
      row,
      screenPos.x - TILE_SIZE_PIXELS / 2,
      screenPos.y - TILE_SIZE_PIXELS / 2
    );

    // Draw debug direction indicator
    this.ctx.save();
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(screenPos.x, screenPos.y);

    const angle = ((256 - tank.direction) * 2 * Math.PI) / 256;
    const endX = screenPos.x + Math.cos(angle) * 20;
    const endY = screenPos.y + Math.sin(angle) * 20;
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * Draw debug grid
   */
  drawGrid(): void {
    const {startX, startY, endX, endY} = this.camera.getVisibleTiles();
    const camPos = this.camera.getPosition();

    this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
    this.ctx.lineWidth = 1;

    // Vertical lines
    for (let x = startX; x <= endX; x++) {
      const worldX = x * TILE_SIZE_PIXELS;
      const screenX = worldX - camPos.x;
      this.ctx.beginPath();
      this.ctx.moveTo(screenX, 0);
      this.ctx.lineTo(screenX, this.ctx.canvas.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = startY; y <= endY; y++) {
      const worldY = y * TILE_SIZE_PIXELS;
      const screenY = worldY - camPos.y;
      this.ctx.beginPath();
      this.ctx.moveTo(0, screenY);
      this.ctx.lineTo(this.ctx.canvas.width, screenY);
      this.ctx.stroke();
    }
  }
}
