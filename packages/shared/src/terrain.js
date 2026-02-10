/**
 * Terrain type definitions
 */
export var TerrainType;
(function (TerrainType) {
    TerrainType[TerrainType["BUILDING"] = 0] = "BUILDING";
    TerrainType[TerrainType["RIVER"] = 1] = "RIVER";
    TerrainType[TerrainType["SWAMP"] = 2] = "SWAMP";
    TerrainType[TerrainType["CRATER"] = 3] = "CRATER";
    TerrainType[TerrainType["ROAD"] = 4] = "ROAD";
    TerrainType[TerrainType["FOREST"] = 5] = "FOREST";
    TerrainType[TerrainType["RUBBLE"] = 6] = "RUBBLE";
    TerrainType[TerrainType["GRASS"] = 7] = "GRASS";
    TerrainType[TerrainType["SHOT_BUILDING"] = 8] = "SHOT_BUILDING";
    TerrainType[TerrainType["BOAT"] = 9] = "BOAT";
    TerrainType[TerrainType["DEEP_SEA"] = 10] = "DEEP_SEA";
})(TerrainType || (TerrainType = {}));
/** ASCII character representation for terrain (from Bolo/WinBolo) */
export const TERRAIN_ASCII = {
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
export const ASCII_TO_TERRAIN = Object.fromEntries(Object.entries(TERRAIN_ASCII).map(([type, ascii]) => [ascii, Number(type)]));
/** Human-readable descriptions */
export const TERRAIN_DESCRIPTIONS = {
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
export const TERRAIN_TANK_SPEED = {
    [TerrainType.BUILDING]: 0.0,
    [TerrainType.RIVER]: 0.0, // unless on boat
    [TerrainType.SWAMP]: 0.25,
    [TerrainType.CRATER]: 0.5,
    [TerrainType.ROAD]: 1.0,
    [TerrainType.FOREST]: 0.5,
    [TerrainType.RUBBLE]: 0.75,
    [TerrainType.GRASS]: 0.75,
    [TerrainType.SHOT_BUILDING]: 0.0,
    [TerrainType.BOAT]: 1.0,
    [TerrainType.DEEP_SEA]: 0.0,
};
/**
 * Builder/LGM speed for each terrain type
 * 0 = impassable, 16 = full speed
 */
export const TERRAIN_BUILDER_SPEED = {
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
export function isTerrainShootable(terrain) {
    return (terrain !== TerrainType.BUILDING && terrain !== TerrainType.SHOT_BUILDING);
}
/**
 * Does this terrain hide tanks (concealment)?
 */
export function isTerrainConcealing(terrain) {
    return terrain === TerrainType.FOREST;
}
//# sourceMappingURL=terrain.js.map