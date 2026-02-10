/**
 * Game constants following Bolo/WinBolo specifications
 */
/** Size of a single CSS pixel in world units */
export declare const PIXEL_SIZE_WORLD = 8;
/** Size of a single tile in pixels and world units */
export declare const TILE_SIZE_PIXELS = 32;
export declare const TILE_SIZE_WORLD: number;
/** Map dimensions */
export declare const MAP_SIZE_TILES = 256;
export declare const MAP_SIZE_PIXELS: number;
export declare const MAP_SIZE_WORLD: number;
/** Game tick rate - 50 ticks per second (20ms per tick) */
export declare const TICK_LENGTH_MS = 20;
export declare const TICKS_PER_SECOND: number;
/** Tank constants */
export declare const TANK_MAX_SHELLS = 40;
export declare const TANK_MAX_MINES = 40;
export declare const TANK_MAX_ARMOR = 40;
export declare const TANK_MAX_TREES = 40;
export declare const TANK_STARTING_SHELLS = 40;
export declare const TANK_STARTING_MINES = 0;
export declare const TANK_STARTING_ARMOR = 40;
export declare const TANK_STARTING_TREES = 0;
/** Tank speed constants (in world units per tick) */
export declare const TANK_MAX_SPEED = 16;
export declare const TANK_ACCELERATION = 0.25;
export declare const TANK_DECELERATION = 0.25;
/** Tank turning (256 direction units = full circle) */
export declare const DIRECTION_UNITS_FULL_CIRCLE = 256;
export declare const DIRECTION_SIXTEENTHS = 16;
export declare const DIRECTION_PER_SIXTEENTH: number;
/** Tank combat */
export declare const SHELL_DAMAGE = 5;
export declare const MINE_DAMAGE = 10;
export declare const RELOAD_TIME_TICKS = 13;
export declare const TANK_SLIDE_TICKS = 8;
/** Builder/LGM constants */
export declare const BUILDER_SPEED = 16;
export declare const BUILDER_RESPAWN_TICKS = 255;
export declare const BUILDER_TREE_HARVEST = 4;
export declare const BUILDER_WALL_COST = 0.5;
export declare const BUILDER_WAIT_TICKS = 20;
/** Pillbox constants */
export declare const PILLBOX_MAX_ARMOR = 15;
export declare const PILLBOX_DAMAGE = 5;
/** Water mechanics */
export declare const WATER_DRAIN_INTERVAL_TICKS = 15;
export declare const WATER_SHELLS_DRAINED = 1;
export declare const WATER_MINES_DRAINED = 1;
/** Respawn */
export declare const TANK_RESPAWN_TICKS = 255;
/** Maximum players */
export declare const MAX_PLAYERS = 16;
/** Team count */
export declare const MAX_TEAMS = 16;
export declare const NEUTRAL_TEAM = 255;
//# sourceMappingURL=constants.d.ts.map