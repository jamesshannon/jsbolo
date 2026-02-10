/**
 * Server-side world simulation
 */

import {
  MAP_SIZE_TILES,
  TILE_SIZE_WORLD,
  TerrainType,
  TERRAIN_TANK_SPEED,
  type MapCell,
  getTerrainInitialLife,
  getTerrainDegradation,
  isTerrainSolid,
} from '@jsbolo/shared';
import {
  MapLoader,
  type PillboxSpawnData,
  type BaseSpawnData,
  type StartPosition,
} from './map-loader.js';

export class ServerWorld {
  private readonly map: MapCell[][];
  private readonly mapName: string;
  private readonly pillboxSpawns: PillboxSpawnData[];
  private readonly baseSpawns: BaseSpawnData[];
  private readonly startPositions: StartPosition[];

  /**
   * Create a new world, optionally loading from a .map file.
   *
   * WHY OPTIONAL MAP PATH:
   * - Backwards compatibility: existing code works without changes
   * - Testing flexibility: can use procedural maps for quick tests
   * - Graceful fallback: if map loading fails, game still runs
   *
   * MAP LOADING PRIORITY:
   * 1. If mapPath provided → load from file (throw if invalid)
   * 2. If no mapPath → generate procedural test map
   *
   * @param mapPath Optional path to .map file (absolute or relative)
   */
  constructor(mapPath?: string) {
    if (mapPath) {
      // Load map from file
      const loaded = MapLoader.loadFromFile(mapPath);
      this.map = loaded.terrain;
      this.mapName = loaded.mapName;
      this.pillboxSpawns = loaded.pillboxes;
      this.baseSpawns = loaded.bases;
      this.startPositions = loaded.startPositions;
    } else {
      // Fallback to procedural generation for testing
      this.map = this.generateTestMap();
      this.mapName = 'Test Map (Procedural)';
      this.pillboxSpawns = [];
      this.baseSpawns = [];
      this.startPositions = [];
    }
  }

  private generateTestMap(): MapCell[][] {
    const map: MapCell[][] = [];

    for (let y = 0; y < MAP_SIZE_TILES; y++) {
      map[y] = [];
      for (let x = 0; x < MAP_SIZE_TILES; x++) {
        let terrain: TerrainType;

        if (x < 20 || x >= MAP_SIZE_TILES - 20 || y < 20 || y >= MAP_SIZE_TILES - 20) {
          terrain = TerrainType.DEEP_SEA;
        } else if ((x + y) % 20 === 0) {
          terrain = TerrainType.FOREST;
        } else if (x % 30 === 0 || y % 30 === 0) {
          terrain = TerrainType.ROAD;
        } else if ((x % 15 === 0 && y % 15 === 0)) {
          terrain = TerrainType.SWAMP;
        } else if ((x - 50) ** 2 + (y - 50) ** 2 < 100) {
          terrain = TerrainType.RIVER;
        } else {
          terrain = TerrainType.GRASS;
        }

        map[y]![x] = {
          terrain,
          hasMine: false,
          terrainLife: getTerrainInitialLife(terrain),
        };
      }
    }

    return map;
  }

  /**
   * Get terrain speed multiplier at a single tile position.
   * Used internally by getTankSpeedAtPosition().
   */
  private getTankSpeedAtTile(tileX: number, tileY: number): number {
    if (
      tileX < 0 ||
      tileX >= MAP_SIZE_TILES ||
      tileY < 0 ||
      tileY >= MAP_SIZE_TILES
    ) {
      return 0;
    }
    const terrain = this.map[tileY]![tileX]!.terrain;

    // Buildings (0, 8) are handled by collision detection, not terrain speed
    // If we return 0 here, tanks get stuck when touching buildings
    // Instead, treat them as passable for speed calculation (collision will block actual movement)
    if (terrain === 0 || terrain === 8) {
      return 1.0;  // Don't slow down when near buildings - collision handles blocking
    }

    return TERRAIN_TANK_SPEED[terrain] ?? 0;
  }

  /**
   * Get terrain speed multiplier for a tank at a given world position.
   *
   * This samples terrain at 5 points under the tank's footprint:
   * - Center position
   * - Four corners (±0.375 tiles from center)
   *
   * Returns the SLOWEST terrain multiplier from all sampled points.
   *
   * WHY MULTI-POINT SAMPLING:
   * Tanks occupy approximately 0.75 tiles of space. Sampling only the center
   * point creates unrealistic behavior when crossing terrain boundaries:
   * - Diagonal crossings clip unwanted terrain (craters, forest)
   * - Speed changes lag by one tick
   * - Tank center might be on road while edges are in mud
   *
   * WHY USE SLOWEST TERRAIN:
   * If ANY part of the tank is in slow terrain (swamp, crater), the entire
   * tank should be slowed. This matches physical reality - you can't drive
   * fast if your treads are partially in mud.
   *
   * ALTERNATIVES CONSIDERED:
   * 1. Sample before movement: Simple but causes one-tick lag
   * 2. Sample center only: Fast but unrealistic at terrain boundaries
   * 3. Average all samples: Unrealistic - tank would be "half-fast" in mixed terrain
   * 4. Sample 9 points (3x3): More accurate but 80% more expensive computationally
   *
   * This 5-point slowest-terrain approach balances realism and performance.
   *
   * @param worldX Tank's X position in world units
   * @param worldY Tank's Y position in world units
   * @returns Speed multiplier (0.0 to 1.0)
   */
  getTankSpeedAtPosition(worldX: number, worldY: number): number {
    // Tank footprint is approximately 0.75 tiles, so sample ±0.375 from center
    const TANK_HALF_SIZE = 0.375;

    // Convert world coordinates to tile coordinates
    const centerTileX = worldX / TILE_SIZE_WORLD;
    const centerTileY = worldY / TILE_SIZE_WORLD;

    // Sample 5 points: center + 4 corners
    const samplePoints = [
      {x: centerTileX, y: centerTileY}, // Center
      {x: centerTileX - TANK_HALF_SIZE, y: centerTileY - TANK_HALF_SIZE}, // Top-left
      {x: centerTileX + TANK_HALF_SIZE, y: centerTileY - TANK_HALF_SIZE}, // Top-right
      {x: centerTileX - TANK_HALF_SIZE, y: centerTileY + TANK_HALF_SIZE}, // Bottom-left
      {x: centerTileX + TANK_HALF_SIZE, y: centerTileY + TANK_HALF_SIZE}, // Bottom-right
    ];

    // Get terrain speed at each sample point and keep the slowest
    let slowestSpeed = 1.0;
    for (const point of samplePoints) {
      const tileX = Math.floor(point.x);
      const tileY = Math.floor(point.y);
      const speed = this.getTankSpeedAtTile(tileX, tileY);

      // Use the slowest terrain - if any part of tank is in mud, tank is slowed
      if (speed < slowestSpeed) {
        slowestSpeed = speed;
      }
    }

    return slowestSpeed;
  }

  /**
   * Legacy method for backward compatibility.
   * Prefer getTankSpeedAtPosition() for accurate terrain sampling.
   * @deprecated Use getTankSpeedAtPosition() instead
   */
  getTankSpeedAt(tileX: number, tileY: number): number {
    return this.getTankSpeedAtTile(tileX, tileY);
  }

  /**
   * Check if a tile is passable for tanks
   */
  isPassable(tileX: number, tileY: number): boolean {
    if (
      tileX < 0 ||
      tileX >= MAP_SIZE_TILES ||
      tileY < 0 ||
      tileY >= MAP_SIZE_TILES
    ) {
      return false; // Out of bounds
    }

    const terrain = this.map[tileY]![tileX]!.terrain;

    // Impassable terrain types (without boat/special conditions)
    switch (terrain) {
      case 0:  // BUILDING (walls)
      case 8:  // SHOT_BUILDING (damaged walls)
        return false;
      default:
        return true;
    }
  }

  getTerrainAt(tileX: number, tileY: number): TerrainType {
    if (
      tileX < 0 ||
      tileX >= MAP_SIZE_TILES ||
      tileY < 0 ||
      tileY >= MAP_SIZE_TILES
    ) {
      return TerrainType.DEEP_SEA;
    }
    return this.map[tileY]![tileX]!.terrain;
  }

  setTerrainAt(tileX: number, tileY: number, terrain: TerrainType): void {
    if (
      tileX < 0 ||
      tileX >= MAP_SIZE_TILES ||
      tileY < 0 ||
      tileY >= MAP_SIZE_TILES
    ) {
      return;
    }
    const cell = this.map[tileY]![tileX]!;
    cell.terrain = terrain;
    cell.terrainLife = getTerrainInitialLife(terrain);
  }

  hasMineAt(tileX: number, tileY: number): boolean {
    if (
      tileX < 0 ||
      tileX >= MAP_SIZE_TILES ||
      tileY < 0 ||
      tileY >= MAP_SIZE_TILES
    ) {
      return false;
    }
    return this.map[tileY]![tileX]!.hasMine;
  }

  setMineAt(tileX: number, tileY: number, hasMine: boolean): void {
    if (
      tileX < 0 ||
      tileX >= MAP_SIZE_TILES ||
      tileY < 0 ||
      tileY >= MAP_SIZE_TILES
    ) {
      return;
    }
    this.map[tileY]![tileX]!.hasMine = hasMine;
  }

  removeMineAt(tileX: number, tileY: number): void {
    this.setMineAt(tileX, tileY, false);
  }

  getMapData(): MapCell[][] {
    return this.map;
  }

  /**
   * Check if shell collides with solid terrain
   * Returns true if collision occurred
   */
  checkShellTerrainCollision(tileX: number, tileY: number): boolean {
    if (
      tileX < 0 ||
      tileX >= MAP_SIZE_TILES ||
      tileY < 0 ||
      tileY >= MAP_SIZE_TILES
    ) {
      return false;
    }

    const cell = this.map[tileY]![tileX]!;
    const isSolid = isTerrainSolid(cell.terrain);

    // DEBUG: Log if we're checking a road tile
    if (cell.terrain === TerrainType.ROAD) {
      console.log(`[DEBUG] checkShellTerrainCollision: ROAD at (${tileX}, ${tileY}), isSolid=${isSolid}`);
    }

    return isSolid;
  }

  /**
   * Damage terrain from shell collision (direct hit on solid terrain)
   * Returns true if terrain was destroyed/degraded
   */
  damageTerrainFromCollision(tileX: number, tileY: number): boolean {
    if (
      tileX < 0 ||
      tileX >= MAP_SIZE_TILES ||
      tileY < 0 ||
      tileY >= MAP_SIZE_TILES
    ) {
      return false;
    }

    const cell = this.map[tileY]![tileX]!;

    // DEBUG: Log if called on a road
    if (cell.terrain === TerrainType.ROAD) {
      console.log(`[DEBUG] damageTerrainFromCollision called on ROAD at (${tileX}, ${tileY}) - should return false!`);
    }

    // Only solid terrain can be hit by collision
    if (!isTerrainSolid(cell.terrain)) {
      return false;
    }

    // Reduce terrain life
    cell.terrainLife--;

    // Check if terrain should degrade
    if (cell.terrainLife <= 0) {
      const newTerrain = getTerrainDegradation(cell.terrain);
      cell.terrain = newTerrain;
      cell.terrainLife = getTerrainInitialLife(newTerrain);
      return true;
    }

    return false;
  }

  /**
   * Damage terrain from explosion (end-of-range shell or mine)
   * Based on Orona's takeExplosionHit() logic
   */
  damageTerrainFromExplosion(tileX: number, tileY: number): void {
    if (
      tileX < 0 ||
      tileX >= MAP_SIZE_TILES ||
      tileY < 0 ||
      tileY >= MAP_SIZE_TILES
    ) {
      return;
    }

    const cell = this.map[tileY]![tileX]!;
    const originalTerrain = cell.terrain;

    // DEBUG: Log all explosion damage attempts
    console.log(`[DEBUG] damageTerrainFromExplosion at (${tileX}, ${tileY}), terrain=${originalTerrain} (${this.getTerrainName(originalTerrain)})`);

    if (originalTerrain === TerrainType.ROAD) {
      console.log(`[DEBUG] ROAD at (${tileX}, ${tileY}) - should NOT be damaged!`);
    }

    // Explosion damage rules (from Orona world_map.coffee lines 136-141)
    switch (cell.terrain) {
      case TerrainType.BUILDING:
        // Building becomes RUBBLE (not crater) from explosion
        cell.terrain = TerrainType.RUBBLE;
        cell.terrainLife = getTerrainInitialLife(TerrainType.RUBBLE);
        break;

      case TerrainType.SHOT_BUILDING:
      case TerrainType.GRASS:
      case TerrainType.FOREST:
      case TerrainType.RUBBLE:
      case TerrainType.SWAMP:
        // All become CRATER
        cell.terrain = TerrainType.CRATER;
        cell.terrainLife = 0;
        break;

      case TerrainType.ROAD:
        // Roads are NOT damaged by explosions in Bolo
        // (They can only be damaged by direct hits from shells or tanks)
        break;

      case TerrainType.BOAT:
        // Boat destroyed → becomes river
        cell.terrain = TerrainType.RIVER;
        cell.terrainLife = 0;
        break;

      case TerrainType.RIVER:
      case TerrainType.DEEP_SEA:
      case TerrainType.CRATER:
        // Water and craters unaffected by explosions
        break;
    }

    // DEBUG: Log if terrain changed
    if (cell.terrain !== originalTerrain) {
      console.log(`[DEBUG] Terrain changed at (${tileX}, ${tileY}): ${this.getTerrainName(originalTerrain)} -> ${this.getTerrainName(cell.terrain)}`);
    } else if (originalTerrain === TerrainType.ROAD) {
      console.log(`[DEBUG] ROAD at (${tileX}, ${tileY}) correctly NOT damaged (stayed as ROAD)`);
    }
  }

  /**
   * Create mine explosion affecting tiles in radius
   * Returns array of affected tile positions
   */
  createMineExplosion(tileX: number, tileY: number, radius: number): Array<{x: number; y: number}> {
    const affectedTiles: Array<{x: number; y: number}> = [];

    // Damage all tiles in radius
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const targetX = tileX + dx;
        const targetY = tileY + dy;

        if (
          targetX < 0 ||
          targetX >= MAP_SIZE_TILES ||
          targetY < 0 ||
          targetY >= MAP_SIZE_TILES
        ) {
          continue;
        }

        // Apply explosion damage
        this.damageTerrainFromExplosion(targetX, targetY);
        affectedTiles.push({x: targetX, y: targetY});
      }
    }

    return affectedTiles;
  }

  /**
   * Get pillbox spawn data from loaded map.
   * Returns empty array if map was procedurally generated.
   */
  getPillboxSpawns(): PillboxSpawnData[] {
    return this.pillboxSpawns;
  }

  /**
   * Get base spawn data from loaded map.
   * Returns empty array if map was procedurally generated.
   */
  getBaseSpawns(): BaseSpawnData[] {
    return this.baseSpawns;
  }

  /**
   * Get player start positions from loaded map.
   * Returns empty array if map was procedurally generated.
   */
  getStartPositions(): StartPosition[] {
    return this.startPositions;
  }

  /**
   * Get name of currently loaded map.
   */
  getMapName(): string {
    return this.mapName;
  }

  /**
   * Helper for debug logging
   */
  private getTerrainName(terrain: TerrainType): string {
    const names = {
      0: 'BUILDING',
      1: 'RIVER',
      2: 'SWAMP',
      3: 'CRATER',
      4: 'ROAD',
      5: 'FOREST',
      6: 'RUBBLE',
      7: 'GRASS',
      8: 'SHOT_BUILDING',
      9: 'BOAT',
      10: 'DEEP_SEA',
    };
    return names[terrain] || 'UNKNOWN';
  }
}
