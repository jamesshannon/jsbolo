/**
 * Terrain type definitions
 */

export enum TerrainType {
  BUILDING = 0,
  RIVER = 1,
  SWAMP = 2,
  CRATER = 3,
  ROAD = 4,
  FOREST = 5,
  RUBBLE = 6,
  GRASS = 7,
  SHOT_BUILDING = 8,
  BOAT = 9,
  DEEP_SEA = 10,
}

/** ASCII character representation for terrain (from Bolo/WinBolo) */
export const TERRAIN_ASCII: Record<TerrainType, string> = {
  [TerrainType.BUILDING]: '|',
  [TerrainType.RIVER]: ' ',
  [TerrainType.SWAMP]: '~',
  [TerrainType.CRATER]: '%',
  [TerrainType.ROAD]: '=',
  [TerrainType.FOREST]: '#',
  [TerrainType.RUBBLE]: ':',
  [TerrainType.GRASS]: '.',
  [TerrainType.SHOT_BUILDING]: '}',
  [TerrainType.BOAT]: 'b',
  [TerrainType.DEEP_SEA]: '^',
};

/** Reverse mapping: ASCII to TerrainType */
export const ASCII_TO_TERRAIN: Record<string, TerrainType> = Object.fromEntries(
  Object.entries(TERRAIN_ASCII).map(([type, ascii]) => [ascii, Number(type)])
);

/** Human-readable descriptions */
export const TERRAIN_DESCRIPTIONS: Record<TerrainType, string> = {
  [TerrainType.BUILDING]: 'Wall/Building',
  [TerrainType.RIVER]: 'River',
  [TerrainType.SWAMP]: 'Swamp',
  [TerrainType.CRATER]: 'Crater',
  [TerrainType.ROAD]: 'Road',
  [TerrainType.FOREST]: 'Forest',
  [TerrainType.RUBBLE]: 'Rubble',
  [TerrainType.GRASS]: 'Grass',
  [TerrainType.SHOT_BUILDING]: 'Damaged Building',
  [TerrainType.BOAT]: 'Boat on River',
  [TerrainType.DEEP_SEA]: 'Deep Sea',
};

/**
 * Tank speed multipliers for each terrain type
 * 0 = impassable, 1.0 = full speed
 */
export const TERRAIN_TANK_SPEED: Record<TerrainType, number> = {
  [TerrainType.BUILDING]: 0.0,
  [TerrainType.RIVER]: 0.2,
  [TerrainType.SWAMP]: 0.25,
  [TerrainType.CRATER]: 0.5,
  [TerrainType.ROAD]: 1.0,
  [TerrainType.FOREST]: 0.5,
  [TerrainType.RUBBLE]: 0.75,
  [TerrainType.GRASS]: 0.75,
  [TerrainType.SHOT_BUILDING]: 0.0,
  [TerrainType.BOAT]: 1.0,
  [TerrainType.DEEP_SEA]: 0.0,  // Impassable without boat
};

/**
 * Builder/LGM speed for each terrain type
 * 0 = impassable, 16 = full speed
 */
export const TERRAIN_BUILDER_SPEED: Record<TerrainType, number> = {
  [TerrainType.BUILDING]: 0,
  [TerrainType.RIVER]: 0,
  [TerrainType.SWAMP]: 8,
  [TerrainType.CRATER]: 12,
  [TerrainType.ROAD]: 16,
  [TerrainType.FOREST]: 8,
  [TerrainType.RUBBLE]: 16,
  [TerrainType.GRASS]: 16,
  [TerrainType.SHOT_BUILDING]: 0,
  [TerrainType.BOAT]: 16,
  [TerrainType.DEEP_SEA]: 0,
};

/**
 * Can terrain be shot through?
 */
export function isTerrainShootable(terrain: TerrainType): boolean {
  return (
    terrain !== TerrainType.BUILDING && terrain !== TerrainType.SHOT_BUILDING
  );
}

/**
 * Does this terrain hide tanks (concealment)?
 */
export function isTerrainConcealing(terrain: TerrainType): boolean {
  return terrain === TerrainType.FOREST;
}

/**
 * Is terrain solid (blocks shell movement)?
 */
export function isTerrainSolid(terrain: TerrainType): boolean {
  return (
    terrain === TerrainType.BUILDING ||
    terrain === TerrainType.SHOT_BUILDING ||
    terrain === TerrainType.RUBBLE ||
    terrain === TerrainType.FOREST ||
    terrain === TerrainType.BOAT
  );
}

/**
 * Get initial health/life points for terrain
 * Values tuned to match classic Bolo behavior
 */
export function getTerrainInitialLife(terrain: TerrainType): number {
  switch (terrain) {
    case TerrainType.BUILDING:
      return 1; // 1 hit to damage (becomes SHOT_BUILDING)
    case TerrainType.SHOT_BUILDING:
      return 2; // 2 hits to destroy (becomes RUBBLE)
    case TerrainType.FOREST:
      return 1; // 1 hit to clear
    case TerrainType.BOAT:
      return 1; // 1 hit to destroy
    case TerrainType.RUBBLE:
      return 2; // 2 hits to crater
    default:
      return 0; // Indestructible or pass-through terrain
  }
}

/**
 * Get terrain degradation result after health depletes
 */
export function getTerrainDegradation(terrain: TerrainType): TerrainType {
  switch (terrain) {
    case TerrainType.BUILDING:
      return TerrainType.SHOT_BUILDING;
    case TerrainType.SHOT_BUILDING:
      return TerrainType.RUBBLE;
    case TerrainType.FOREST:
      return TerrainType.GRASS;
    case TerrainType.BOAT:
      return TerrainType.RIVER;
    case TerrainType.RUBBLE:
      return TerrainType.CRATER;
    default:
      return terrain; // No degradation
  }
}
