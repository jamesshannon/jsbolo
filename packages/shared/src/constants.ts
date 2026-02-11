/**
 * Game constants following Bolo/WinBolo specifications
 */

/** Size of a single CSS pixel in world units */
export const PIXEL_SIZE_WORLD = 8;

/** Size of a single tile in pixels and world units */
export const TILE_SIZE_PIXELS = 32;
export const TILE_SIZE_WORLD = TILE_SIZE_PIXELS * PIXEL_SIZE_WORLD;

/** Map dimensions */
export const MAP_SIZE_TILES = 256;
export const MAP_SIZE_PIXELS = MAP_SIZE_TILES * TILE_SIZE_PIXELS;
export const MAP_SIZE_WORLD = MAP_SIZE_TILES * TILE_SIZE_WORLD;

/** Game tick rate - 50 ticks per second (20ms per tick) */
export const TICK_LENGTH_MS = 20;
export const TICKS_PER_SECOND = 1000 / TICK_LENGTH_MS;

/** Tank constants */
export const TANK_MAX_SHELLS = 40;
export const TANK_MAX_MINES = 40;
export const TANK_MAX_ARMOR = 40;
export const TANK_MAX_TREES = 40;
export const TANK_STARTING_SHELLS = 40;
export const TANK_STARTING_MINES = 0;
export const TANK_STARTING_ARMOR = 40;
export const TANK_STARTING_TREES = 0;

/** Tank speed constants (in world units per tick) */
export const TANK_MAX_SPEED = 16.0;
export const TANK_ACCELERATION = 0.25;
export const TANK_DECELERATION = 0.25;

/** Tank turning (256 direction units = full circle) */
export const DIRECTION_UNITS_FULL_CIRCLE = 256;
export const DIRECTION_SIXTEENTHS = 16; // 16 discrete directions
export const DIRECTION_PER_SIXTEENTH = DIRECTION_UNITS_FULL_CIRCLE / DIRECTION_SIXTEENTHS;

/** Tank combat */
export const SHELL_DAMAGE = 5;
export const MINE_DAMAGE = 10;
export const RELOAD_TIME_TICKS = 13;
export const TANK_SLIDE_TICKS = 8;

/** Builder/LGM constants */
export const BUILDER_SPEED = 16; // world units per tick
export const BUILDER_RESPAWN_TICKS = 255;
export const BUILDER_TREE_HARVEST = 4; // trees gained from harvesting forest
export const BUILDER_WALL_COST = 0.5; // trees per wall segment
export const BUILDER_WAIT_TICKS = 20; // pause after building

/** Pillbox constants */
export const PILLBOX_MAX_ARMOR = 15;
export const PILLBOX_STARTING_ARMOR = 15;
export const PILLBOX_DAMAGE = 5;
export const PILLBOX_RANGE = TILE_SIZE_WORLD * 8; // 8 tiles range

/** Base constants */
export const BASE_MAX_ARMOR = 90;
export const BASE_STARTING_ARMOR = 90;
export const BASE_STARTING_SHELLS = 40;
export const BASE_STARTING_MINES = 40;
export const BASE_REFUEL_RANGE = TILE_SIZE_WORLD * 1.5; // 1.5 tiles range

/** Water mechanics */
export const WATER_DRAIN_INTERVAL_TICKS = 15;
export const WATER_SHELLS_DRAINED = 1;
export const WATER_MINES_DRAINED = 1;

/** Respawn */
export const TANK_RESPAWN_TICKS = 255;

/** Maximum players */
export const MAX_PLAYERS = 16;

/** Team count */
export const MAX_TEAMS = 16;
export const NEUTRAL_TEAM = 255;

/** Terrain health/life points */
export const TERRAIN_LIFE_BUILDING = 4; // 4 hits to destroy
export const TERRAIN_LIFE_SHOT_BUILDING = 7; // 7 more hits to rubble
export const TERRAIN_LIFE_FOREST = 1; // 1 hit to clear
export const TERRAIN_LIFE_BOAT = 1; // 1 hit to sink
export const TERRAIN_LIFE_RUBBLE = 3; // 3 hits to crater

/** Shell damage to terrain */
export const SHELL_TERRAIN_COLLISION_DAMAGE = 1; // Direct hit on solid terrain
export const SHELL_TERRAIN_EXPLOSION_DAMAGE = 1; // End-of-range explosion

/** Mine explosion constants */
export const MINE_EXPLOSION_RADIUS_TILES = 1; // Explosion affects tiles in 1-tile radius (3x3 grid)

/** Sound event IDs (from Orona sounds.coffee) */
export const SOUND_BIG_EXPLOSION = 0;
export const SOUND_BUBBLES = 1;
export const SOUND_FARMING_TREE = 2;
export const SOUND_HIT_TANK = 3;
export const SOUND_MAN_BUILDING = 4;
export const SOUND_MAN_DYING = 5;
export const SOUND_MAN_LAY_MINE = 6;
export const SOUND_MINE_EXPLOSION = 7;
export const SOUND_SHOOTING = 8;
export const SOUND_SHOT_BUILDING = 9;
export const SOUND_SHOT_TREE = 10;
export const SOUND_TANK_SINKING = 11;
