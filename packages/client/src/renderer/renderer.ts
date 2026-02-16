/**
 * Main game renderer
 */

import {
  TILE_SIZE_PIXELS,
  TerrainType,
  BuilderOrder,
  NEUTRAL_TEAM,
  type Tank as NetworkTank,
  type Shell,
  type Builder,
  type Pillbox,
  type Base,
} from '@shared';
import {SpriteSheet} from './sprite-sheet.js';
import {Camera} from './camera.js';
import {AutoTiler} from './auto-tiler.js';
import {getRelationPalette, type HudColorMode} from './color-palette.js';
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

const HUD_ICON_SIZE = 16;
// NOTE: These icon coordinates come from the shared Orona/WinBolo HUD atlas.
// They are used for classic-looking base/pillbox glyphs in-world.
const HUD_ICONS = {
  // NOTE: in this atlas, base/pillbox icon families are opposite of what their
  // status-box labels might suggest, so we map by observed in-game appearance.
  BASE_NEUTRAL: {x: 16, y: 0, width: HUD_ICON_SIZE, height: HUD_ICON_SIZE},
  PILL_NEUTRAL: {x: 0, y: 0, width: HUD_ICON_SIZE, height: HUD_ICON_SIZE},
  BASE_HEALTHY_MASK: {x: 80, y: 0, width: HUD_ICON_SIZE, height: HUD_ICON_SIZE},
  BASE_VULNERABLE_MASK: {x: 96, y: 0, width: HUD_ICON_SIZE, height: HUD_ICON_SIZE},
  PILL_DEAD: {x: 64, y: 0, width: HUD_ICON_SIZE, height: HUD_ICON_SIZE},
  PILL_HEALTHY_MASK: {x: 32, y: 0, width: HUD_ICON_SIZE, height: HUD_ICON_SIZE},
  PILL_DAMAGED_MASK: {x: 48, y: 0, width: HUD_ICON_SIZE, height: HUD_ICON_SIZE},
} as const;

export class Renderer {
  private baseSprites: SpriteSheet;
  private styledSprites: SpriteSheet;
  private hudSprites: SpriteSheet;
  private colorMode: HudColorMode = 'default';

  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    private readonly camera: Camera
  ) {
    this.baseSprites = new SpriteSheet('/assets/sprites/base.png');
    this.styledSprites = new SpriteSheet('/assets/sprites/styled.png');
    this.hudSprites = new SpriteSheet('/assets/sprites/hud.png');
  }

  async loadAssets(): Promise<void> {
    await Promise.all([
      this.baseSprites.load(),
      this.styledSprites.load(),
      this.hudSprites.load(),
    ]);
  }

  setColorMode(mode: HudColorMode): void {
    this.colorMode = mode;
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
    myPlayerId: number | null,
    myAllianceAllies: ReadonlySet<number> | null = null
  ): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    const myAllianceId = myPlayerId !== null
      ? (tanks.get(myPlayerId)?.allianceId ?? tanks.get(myPlayerId)?.team ?? null)
      : null;

    this.renderTerrain(world);

    // Render all bases
    for (const baseData of bases.values()) {
      this.renderBase(baseData, myAllianceId, myAllianceAllies);
    }

    // Render all pillboxes
    for (const pillboxData of pillboxes.values()) {
      this.renderPillbox(pillboxData, myAllianceId, myAllianceAllies);
    }

    // Render all shells
    for (const shellData of shells.values()) {
      this.renderShell(shellData);
    }

    // Render all tanks
    for (const [tankId, tankData] of tanks) {
      this.renderNetworkTank(
        tankData,
        tankId === myPlayerId,
        myAllianceId,
        myAllianceAllies
      );
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

      const drawTileY = cell.hasMine ? tileDef.y + 10 : tileDef.y;
      this.baseSprites.drawTile(
        this.ctx,
        tileDef.x,
        drawTileY,
        screenX,
        screenY
      );
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
  private renderNetworkTank(
    tankData: NetworkTank,
    isLocalPlayer: boolean,
    myAllianceId: number | null,
    myAllianceAllies: ReadonlySet<number> | null
  ): void {
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
    this.drawTankTurretMarker(
      screenPos.x,
      screenPos.y,
      tankData.direction,
      tankData.allianceId ?? tankData.team,
      myAllianceId,
      myAllianceAllies,
      isLocalPlayer
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

    const animationFrame = Math.floor(performance.now() / 150) % 3;
    const tileX = builderData.order === BuilderOrder.PARACHUTING ? 16 : 17;
    const tileY = builderData.order === BuilderOrder.PARACHUTING ? 1 : animationFrame;
    this.styledSprites.drawTile(
      this.ctx,
      tileX,
      tileY,
      screenPos.x - TILE_SIZE_PIXELS / 2,
      screenPos.y - TILE_SIZE_PIXELS / 2
    );

    this.ctx.save();
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
  private renderPillbox(
    pillboxData: Pillbox,
    myAllianceId: number | null,
    myAllianceAllies: ReadonlySet<number> | null
  ): void {
    if (
      pillboxData.tileX === undefined ||
      pillboxData.tileY === undefined ||
      pillboxData.inTank
    ) {
      return;
    }

    const worldX = pillboxData.tileX * TILE_SIZE_PIXELS;
    const worldY = pillboxData.tileY * TILE_SIZE_PIXELS;
    const camPos = this.camera.getPosition();
    const screenX = worldX - camPos.x;
    const screenY = worldY - camPos.y;
    const centerX = screenX + (TILE_SIZE_PIXELS / 2);
    const centerY = screenY + (TILE_SIZE_PIXELS / 2);

    // Keep the armor-indexed damage progression from base.png visible, but subtle.
    // This preserves classic "changes with hits" behavior while using clearer glyphs.
    const armorTile = Math.max(0, Math.min(15, Math.round(pillboxData.armor)));
    this.ctx.save();
    this.ctx.globalAlpha = 0.35;
    this.baseSprites.drawTile(this.ctx, armorTile, 2, screenX, screenY);
    this.ctx.restore();

    if (pillboxData.armor <= 0) {
      this.drawHudIcon(HUD_ICONS.PILL_DEAD, centerX, centerY);
      return;
    }

    if (pillboxData.ownerTeam === NEUTRAL_TEAM) {
      this.drawHudIcon(HUD_ICONS.PILL_NEUTRAL, centerX, centerY);
      return;
    }

    const relationColor = this.getRelationColor(
      pillboxData.ownerTeam,
      myAllianceId,
      myAllianceAllies,
      '#d7bf2f'
    );
    // Assumption: the "damaged" HUD mask at x=96 is used as low-health proxy for
    // readability until we have full per-hit dedicated pillbox icon states.
    const mask = pillboxData.armor <= 5
      ? HUD_ICONS.PILL_DAMAGED_MASK
      : HUD_ICONS.PILL_HEALTHY_MASK;
    const tintColor = pillboxData.armor <= 2 ? '#de2f2f' : relationColor;
    this.drawTintedHudMask(mask, centerX, centerY, tintColor);
  }

  /**
   * Render base (refueling station)
   */
  private renderBase(
    baseData: Base,
    myAllianceId: number | null,
    myAllianceAllies: ReadonlySet<number> | null
  ): void {
    if (baseData.tileX === undefined || baseData.tileY === undefined) {
      return;
    }

    const worldX = baseData.tileX * TILE_SIZE_PIXELS;
    const worldY = baseData.tileY * TILE_SIZE_PIXELS;
    const camPos = this.camera.getPosition();
    const screenX = worldX - camPos.x;
    const screenY = worldY - camPos.y;
    const centerX = screenX + TILE_SIZE_PIXELS / 2;
    const centerY = screenY + TILE_SIZE_PIXELS / 2;

    if (baseData.ownerTeam === NEUTRAL_TEAM) {
      this.drawHudIcon(HUD_ICONS.BASE_NEUTRAL, centerX, centerY);
      return;
    }

    const relationColor = this.getRelationColor(
      baseData.ownerTeam,
      myAllianceId,
      myAllianceAllies,
      '#26d93b'
    );
    const mask = baseData.armor <= 9
      ? HUD_ICONS.BASE_VULNERABLE_MASK
      : HUD_ICONS.BASE_HEALTHY_MASK;
    this.drawTintedHudMask(mask, centerX, centerY, relationColor);
  }

  private getRelationColor(
    ownerTeam: number,
    myAllianceId: number | null,
    myAllianceAllies: ReadonlySet<number> | null,
    neutralColor: string
  ): string {
    const palette = getRelationPalette(this.colorMode);
    if (ownerTeam === NEUTRAL_TEAM) {
      return neutralColor;
    }
    if (myAllianceId === null) {
      return palette.neutral;
    }
    return ownerTeam === myAllianceId || myAllianceAllies?.has(ownerTeam)
      ? palette.friendly
      : palette.hostile;
  }

  private drawTankTurretMarker(
    centerX: number,
    centerY: number,
    direction: number,
    allianceId: number,
    myAllianceId: number | null,
    myAllianceAllies: ReadonlySet<number> | null,
    isLocalPlayer: boolean
  ): void {
    const palette = getRelationPalette(this.colorMode);
    const isFriendly = myAllianceId !== null &&
      (allianceId === myAllianceId || myAllianceAllies?.has(allianceId) === true);
    const markerColor = isLocalPlayer
      ? palette.self
      : (isFriendly ? palette.friendly : palette.hostile);
    const angle = ((256 - direction) * 2 * Math.PI) / 256;
    const tipX = centerX + Math.cos(angle) * 10;
    const tipY = centerY + Math.sin(angle) * 10;

    this.ctx.save();
    this.ctx.strokeStyle = markerColor;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY);
    this.ctx.lineTo(tipX, tipY);
    this.ctx.stroke();
    this.ctx.restore();
  }

  private drawHudIcon(
    src: {x: number; y: number; width: number; height: number},
    centerX: number,
    centerY: number
  ): void {
    this.hudSprites.drawSprite(
      this.ctx,
      src,
      Math.round(centerX - HUD_ICON_SIZE / 2),
      Math.round(centerY - HUD_ICON_SIZE / 2)
    );
  }

  private drawTintedHudMask(
    src: {x: number; y: number; width: number; height: number},
    centerX: number,
    centerY: number,
    tint: string
  ): void {
    const x = Math.round(centerX - HUD_ICON_SIZE / 2);
    const y = Math.round(centerY - HUD_ICON_SIZE / 2);
    this.ctx.save();
    this.ctx.fillStyle = tint;
    this.ctx.fillRect(x, y, HUD_ICON_SIZE, HUD_ICON_SIZE);
    this.ctx.restore();
    this.hudSprites.drawSprite(this.ctx, src, x, y);
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
