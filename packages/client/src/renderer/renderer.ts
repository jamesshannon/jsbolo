/**
 * Main game renderer
 */

import {
  TILE_SIZE_PIXELS,
  TerrainType,
  BuilderOrder,
  type Tank as NetworkTank,
  type Shell,
  type Builder,
  type Pillbox,
  type Base,
} from '@shared';
import {SpriteSheet} from './sprite-sheet.js';
import {Camera} from './camera.js';
import {AutoTiler} from './auto-tiler.js';
import type {World} from '../world/world.js';
import type {Tank} from '../entities/tank.js';

/**
 * Terrain tile defaults.
 * Auto-tilers override these for neighbor-sensitive terrain.
 */
const TERRAIN_TILES: Record<TerrainType, {x: number; y: number}> = {
  [TerrainType.GRASS]: {x: 2, y: 1},         // '.' - green grass
  [TerrainType.FOREST]: {x: 3, y: 1},        // '#' - dense forest tile fallback
  [TerrainType.SWAMP]: {x: 7, y: 1},         // '~' - swamp
  [TerrainType.RIVER]: {x: 1, y: 0},         // ' ' - river fallback
  [TerrainType.ROAD]: {x: 0, y: 1},          // '=' - road fallback
  [TerrainType.CRATER]: {x: 5, y: 1},        // '%' - crater/rubble center
  [TerrainType.BUILDING]: {x: 6, y: 1},      // '|' - isolated wall/building fallback
  [TerrainType.RUBBLE]: {x: 4, y: 1},        // ':' - rubble
  [TerrainType.SHOT_BUILDING]: {x: 8, y: 1}, // '}' - damaged building (intentionally non-autotiled)
  [TerrainType.BOAT]: {x: 11, y: 6},         // 'b' - boat fallback (autotiled by direction when available)
  [TerrainType.DEEP_SEA]: {x: 0, y: 0},      // '^' - deep sea fallback
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
   * Render the game world (single-player)
   */
  render(world: World, tank: Tank): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.renderTerrain(world);
    this.renderTank(tank);
  }

  /**
   * Render multiplayer game (multiple tanks + shells + builders + pillboxes + bases from server state)
   */
  renderMultiplayer(
    world: World,
    tanks: Map<number, NetworkTank>,
    shells: Map<number, Shell>,
    builders: Map<number, Builder>,
    pillboxes: Map<number, Pillbox>,
    bases: Map<number, Base>,
    myPlayerId: number | null
  ): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.renderTerrain(world);

    // Render all bases
    for (const baseData of bases.values()) {
      this.renderBase(baseData);
    }

    // Render all pillboxes
    for (const pillboxData of pillboxes.values()) {
      this.renderPillbox(pillboxData);
    }

    // Render all shells
    for (const shellData of shells.values()) {
      this.renderShell(shellData);
    }

    // Render all tanks
    for (const [tankId, tankData] of tanks) {
      this.renderNetworkTank(tankData, tankId === myPlayerId);
    }

    // Render all builders
    for (const builderData of builders.values()) {
      this.renderBuilder(builderData);
    }
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

      // Determine sprite coordinates based on terrain type
      let tileDef: {x: number; y: number};

      // Apply auto-tiling for supported terrain types
      if (cell.terrain === TerrainType.FOREST) {
        const neighbors = world.getNeighbors(tileX, tileY);
        tileDef = AutoTiler.getForestTile(neighbors);
      } else if (cell.terrain === TerrainType.ROAD) {
        const neighbors = world.getNeighbors(tileX, tileY);
        tileDef = AutoTiler.getRoadTile(neighbors);
      } else if (cell.terrain === TerrainType.RIVER) {
        const neighbors = world.getNeighbors(tileX, tileY);
        tileDef = AutoTiler.getRiverTile(neighbors);
      } else if (cell.terrain === TerrainType.DEEP_SEA) {
        const neighbors = world.getNeighbors(tileX, tileY);
        tileDef = AutoTiler.getDeepSeaTile(neighbors);
      } else if (cell.terrain === TerrainType.BUILDING) {
        const neighbors = world.getNeighbors(tileX, tileY);
        tileDef = AutoTiler.getBuildingTile(neighbors);
      } else if (cell.terrain === TerrainType.BOAT && cell.direction !== undefined) {
        // Directional boats: sprite depends on boat facing direction
        tileDef = AutoTiler.getBoatTile(cell.direction);
      } else {
        // Use static mapping for non-auto-tiled terrain
        tileDef = TERRAIN_TILES[cell.terrain] || TERRAIN_TILES[TerrainType.GRASS];
      }

      this.baseSprites.drawTile(
        this.ctx,
        tileDef.x,
        tileDef.y,
        screenX,
        screenY
      );

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
   * Render tank from network state
   */
  private renderNetworkTank(tankData: NetworkTank, isLocalPlayer: boolean): void {
    if (tankData.x === undefined || tankData.y === undefined) {
      return;
    }

    // Convert from world coordinates to pixel coordinates
    const pixelX = tankData.x / 8; // PIXEL_SIZE_WORLD = 8
    const pixelY = tankData.y / 8;

    const screenPos = this.camera.worldToScreen(pixelX, pixelY);
    const direction16 = Math.round((tankData.direction - 1) / 16) % 16;

    // Draw tank sprite
    const row = tankData.onBoat ? 1 : 0;
    this.styledSprites.drawTile(
      this.ctx,
      direction16,
      row,
      screenPos.x - TILE_SIZE_PIXELS / 2,
      screenPos.y - TILE_SIZE_PIXELS / 2
    );

    // Draw targeting reticle (only for local player)
    if (isLocalPlayer && tankData.firingRange !== undefined) {
      this.drawTargetingReticle(tankData);
    }

    // Draw player ID above tank
    this.ctx.save();
    this.ctx.fillStyle = isLocalPlayer ? '#00ff00' : '#ffffff';
    this.ctx.font = '12px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`P${tankData.id}`, screenPos.x, screenPos.y - 20);
    this.ctx.restore();
  }

  /**
   * Draw targeting reticle showing where shells will land.
   *
   * This replicates the original Bolo targeting system which shows a crosshair
   * at the exact landing point based on the tank's direction and firing range.
   * Much more accurate than a simple direction line.
   *
   * @param tankData Tank data including position, direction, and firingRange
   */
  private drawTargetingReticle(tankData: NetworkTank): void {
    if (tankData.x === undefined || tankData.y === undefined || tankData.firingRange === undefined) {
      return;
    }

    // Convert tank position from world units to pixels
    const tankPixelX = tankData.x / 8; // PIXEL_SIZE_WORLD = 8
    const tankPixelY = tankData.y / 8;

    // Calculate target position based on direction and range
    // Direction: 0 = North, increases clockwise, 256 = full circle
    const angle = ((256 - tankData.direction) * 2 * Math.PI) / 256;

    // Range is in tiles, convert to pixels (32 pixels per tile)
    const rangePixels = tankData.firingRange * 32; // TILE_SIZE_PIXELS

    // Calculate target position
    const targetPixelX = tankPixelX + Math.cos(angle) * rangePixels;
    const targetPixelY = tankPixelY + Math.sin(angle) * rangePixels;

    // Convert to screen coordinates
    const targetScreenPos = this.camera.worldToScreen(targetPixelX, targetPixelY);

    // Draw crosshair reticle (matching original Bolo style)
    this.ctx.save();
    this.ctx.strokeStyle = '#ffffff'; // White like the original
    this.ctx.lineWidth = 1;

    const reticleSize = 8; // Size of crosshair arms

    // Draw crosshair
    this.ctx.beginPath();
    // Horizontal line
    this.ctx.moveTo(targetScreenPos.x - reticleSize, targetScreenPos.y);
    this.ctx.lineTo(targetScreenPos.x + reticleSize, targetScreenPos.y);
    // Vertical line
    this.ctx.moveTo(targetScreenPos.x, targetScreenPos.y - reticleSize);
    this.ctx.lineTo(targetScreenPos.x, targetScreenPos.y + reticleSize);
    this.ctx.stroke();

    // Draw center dot for precision
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(targetScreenPos.x, targetScreenPos.y, 1, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  /**
   * Render shell/bullet
   */
  private renderShell(shellData: Shell): void {
    if (shellData.x === undefined || shellData.y === undefined) {
      return;
    }

    // Convert from world coordinates to pixel coordinates
    const pixelX = shellData.x / 8; // PIXEL_SIZE_WORLD = 8
    const pixelY = shellData.y / 8;

    const screenPos = this.camera.worldToScreen(pixelX, pixelY);

    // Draw shell as a small circle
    this.ctx.save();
    this.ctx.fillStyle = '#ffff00'; // Yellow
    this.ctx.beginPath();
    this.ctx.arc(screenPos.x, screenPos.y, 3, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  /**
   * Render builder/LGM
   */
  private renderBuilder(builderData: Builder): void {
    if (builderData.x === undefined || builderData.y === undefined) {
      return;
    }

    // Only render if not in tank
    if (builderData.order === BuilderOrder.IN_TANK) {
      return;
    }

    // Convert from world coordinates to pixel coordinates
    const pixelX = builderData.x / 8; // PIXEL_SIZE_WORLD = 8
    const pixelY = builderData.y / 8;

    const screenPos = this.camera.worldToScreen(pixelX, pixelY);

    // Draw builder as a small green circle (placeholder)
    this.ctx.save();
    this.ctx.fillStyle = '#00ff00'; // Green
    this.ctx.beginPath();
    this.ctx.arc(screenPos.x, screenPos.y, 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw a line to target location if moving
    if (
      builderData.order === BuilderOrder.WAITING ||
      builderData.order === BuilderOrder.RETURNING ||
      builderData.order === BuilderOrder.PARACHUTING
    ) {
      // WAITING, RETURNING, PARACHUTING
      const targetPixelX = builderData.targetX / 8;
      const targetPixelY = builderData.targetY / 8;
      const targetScreenPos = this.camera.worldToScreen(targetPixelX, targetPixelY);

      this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([4, 4]);
      this.ctx.beginPath();
      this.ctx.moveTo(screenPos.x, screenPos.y);
      this.ctx.lineTo(targetScreenPos.x, targetScreenPos.y);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    this.ctx.restore();
  }

  /**
   * Render pillbox
   */
  private renderPillbox(pillboxData: Pillbox): void {
    if (
      pillboxData.tileX === undefined ||
      pillboxData.tileY === undefined ||
      pillboxData.inTank
    ) {
      return;
    }

    // Convert tile to pixel coordinates (center of tile)
    const pixelX = (pillboxData.tileX + 0.5) * TILE_SIZE_PIXELS;
    const pixelY = (pillboxData.tileY + 0.5) * TILE_SIZE_PIXELS;

    const screenPos = this.camera.worldToScreen(pixelX, pixelY);

    // Draw pillbox as a square with team color
    this.ctx.save();

    // Color based on team (neutral = gray, team colors otherwise)
    let color = '#606060'; // Neutral dark gray
    if (pillboxData.ownerTeam !== 255) {
      // Team colors (simple palette)
      const teamColors = [
        '#ff0000',
        '#00ff00',
        '#0000ff',
        '#ffff00',
        '#ff00ff',
        '#00ffff',
        '#ff8800',
        '#8800ff',
      ];
      color = teamColors[pillboxData.ownerTeam % teamColors.length] ?? '#ffffff';
    }

    // Draw larger pillbox body (20x20)
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      screenPos.x - 10,
      screenPos.y - 10,
      20,
      20
    );

    // Draw black border
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      screenPos.x - 10,
      screenPos.y - 10,
      20,
      20
    );

    // Draw white inner border for visibility
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(
      screenPos.x - 9,
      screenPos.y - 9,
      18,
      18
    );

    // Draw health bar above pillbox
    if (pillboxData.armor > 0) {
      const barWidth = 16;
      const barHeight = 3;
      const healthPercent = pillboxData.armor / 15; // PILLBOX_MAX_ARMOR

      this.ctx.fillStyle = '#ff0000';
      this.ctx.fillRect(
        screenPos.x - barWidth / 2,
        screenPos.y - 12,
        barWidth,
        barHeight
      );

      this.ctx.fillStyle = '#00ff00';
      this.ctx.fillRect(
        screenPos.x - barWidth / 2,
        screenPos.y - 12,
        barWidth * healthPercent,
        barHeight
      );
    }

    this.ctx.restore();
  }

  /**
   * Render base (refueling station)
   */
  private renderBase(baseData: Base): void {
    if (baseData.tileX === undefined || baseData.tileY === undefined) {
      return;
    }

    // Convert tile to pixel coordinates (center of tile)
    const pixelX = (baseData.tileX + 0.5) * TILE_SIZE_PIXELS;
    const pixelY = (baseData.tileY + 0.5) * TILE_SIZE_PIXELS;

    const screenPos = this.camera.worldToScreen(pixelX, pixelY);

    // Draw base as a larger square with team color
    this.ctx.save();

    // Color based on team (neutral = blue-gray, team colors otherwise)
    let color = '#4466aa'; // Neutral blue-gray
    if (baseData.ownerTeam !== 255) {
      // Team colors (simple palette)
      const teamColors = [
        '#ff0000',
        '#00ff00',
        '#0000ff',
        '#ffff00',
        '#ff00ff',
        '#00ffff',
        '#ff8800',
        '#8800ff',
      ];
      color = teamColors[baseData.ownerTeam % teamColors.length] ?? '#ffffff';
    }

    // Draw larger base body (28x28)
    this.ctx.fillStyle = color;
    this.ctx.fillRect(screenPos.x - 14, screenPos.y - 14, 28, 28);

    // Draw black border
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(screenPos.x - 14, screenPos.y - 14, 28, 28);

    // Draw white inner border
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(screenPos.x - 13, screenPos.y - 13, 26, 26);

    // Draw cross pattern to distinguish from pillboxes
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(screenPos.x - 14, screenPos.y);
    this.ctx.lineTo(screenPos.x + 14, screenPos.y);
    this.ctx.moveTo(screenPos.x, screenPos.y - 14);
    this.ctx.lineTo(screenPos.x, screenPos.y + 14);
    this.ctx.stroke();

    // Draw health bar above base
    if (baseData.armor > 0) {
      const barWidth = 28;
      const barHeight = 3;
      const healthPercent = baseData.armor / 90; // BASE_MAX_ARMOR

      this.ctx.fillStyle = '#ff0000';
      this.ctx.fillRect(
        screenPos.x - barWidth / 2,
        screenPos.y - 20,
        barWidth,
        barHeight
      );

      this.ctx.fillStyle = '#00ff00';
      this.ctx.fillRect(
        screenPos.x - barWidth / 2,
        screenPos.y - 20,
        barWidth * healthPercent,
        barHeight
      );
    }

    // Draw resource indicators (shells/mines) below base
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '8px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      `S:${baseData.shells} M:${baseData.mines}`,
      screenPos.x,
      screenPos.y + 22
    );

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
