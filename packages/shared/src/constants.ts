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
export const PILLBOX_DAMAGE = 5;

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
