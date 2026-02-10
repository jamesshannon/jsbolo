/**
 * Terrain type definitions
 */
export declare enum TerrainType {
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
    DEEP_SEA = 10
}
/** ASCII character representation for terrain (from Bolo/WinBolo) */
export declare const TERRAIN_ASCII: Record<TerrainType, string>;
/** Reverse mapping: ASCII to TerrainType */
export declare const ASCII_TO_TERRAIN: Record<string, TerrainType>;
/** Human-readable descriptions */
export declare const TERRAIN_DESCRIPTIONS: Record<TerrainType, string>;
/**
 * Tank speed multipliers for each terrain type
 * 0 = impassable, 1.0 = full speed
 */
export declare const TERRAIN_TANK_SPEED: Record<TerrainType, number>;
/**
 * Builder/LGM speed for each terrain type
 * 0 = impassable, 16 = full speed
 */
export declare const TERRAIN_BUILDER_SPEED: Record<TerrainType, number>;
/**
 * Can terrain be shot through?
 */
export declare function isTerrainShootable(terrain: TerrainType): boolean;
/**
 * Does this terrain hide tanks (concealment)?
 */
export declare function isTerrainConcealing(terrain: TerrainType): boolean;
//# sourceMappingURL=terrain.d.ts.map