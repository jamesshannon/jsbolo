/**
 * Core game types
 */

import type {TerrainType} from './terrain.js';

/** 2D position in world coordinates */
export interface Position {
  x: number;
  y: number;
}

/** 2D position in tile coordinates */
export interface TilePosition {
  x: number;
  y: number;
}

/** Tank state */
export interface Tank {
  id: number;
  x: number;
  y: number;
  direction: number; // 0-255
  speed: number;
  armor: number;
  shells: number;
  mines: number;
  trees: number;
  team: number;
  /** Canonical alliance identity for relation checks. Falls back to `team` when omitted. */
  allianceId?: number;
  onBoat: boolean;
  reload: number;
  firingRange: number;
  carriedPillbox?: number | null;
}

/** Builder/LGM state */
export interface Builder {
  id: number;
  ownerTankId: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  order: BuilderOrder;
  trees: number;
  hasMine: boolean;
  hasPillbox?: boolean;
  team: number;
  /** Canonical alliance identity for relation checks. Falls back to `team` when omitted. */
  allianceId?: number;
  respawnCounter?: number;
}

/** Per-alliance visibility of allied alliances in the current match snapshot. */
export interface AllianceSnapshot {
  allianceId: number;
  alliedAllianceIds: number[];
}

export enum BuilderOrder {
  IN_TANK = 0,
  WAITING = 1,
  RETURNING = 2,
  PARACHUTING = 3,
  HARVESTING = 10,
  BUILDING_ROAD = 11,
  REPAIRING = 12,
  BUILDING_BOAT = 13,
  BUILDING_WALL = 14,
  PLACING_PILLBOX = 15,
  LAYING_MINE = 16,
}

/** Shell/bullet state */
export interface ShellState {
  id: number;
  x: number;
  y: number;
  direction: number;
  ownerTankId: number;
}

/** Explosion state */
export interface Explosion {
  id: number;
  x: number;
  y: number;
  type: ExplosionType;
  frame: number;
}

export enum ExplosionType {
  SMALL = 0,
  LARGE = 1,
  MINE = 2,
}

/** Pillbox state */
export interface Pillbox {
  id: number;
  tileX: number;
  tileY: number;
  armor: number;
  ownerTeam: number; // 255 = neutral
  inTank: boolean;
}

/** Base state */
export interface Base {
  id: number;
  tileX: number;
  tileY: number;
  armor: number;
  shells: number;
  mines: number;
  ownerTeam: number; // 255 = neutral
}

/** Map cell */
export interface MapCell {
  terrain: TerrainType;
  hasMine: boolean;
  terrainLife: number; // Health points for destructible terrain
  direction?: number; // Direction for directional terrain (boats): 0-255, 0=north, 64=east, 128=south, 192=west
}

/** Player input state */
export interface PlayerInput {
  sequence: number;
  tick: number;
  accelerating: boolean;
  braking: boolean;
  turningClockwise: boolean;
  turningCounterClockwise: boolean;
  shooting: boolean;
  buildOrder?: BuildOrder;
  rangeAdjustment: RangeAdjustment;
}

export interface BuildOrder {
  action: BuildAction;
  targetX: number;
  targetY: number;
}

export enum BuildAction {
  NONE = 0,
  FOREST = 1,
  ROAD = 2,
  REPAIR = 3,
  BOAT = 4,
  BUILDING = 5,
  PILLBOX = 6,
  MINE = 7,
}

export enum RangeAdjustment {
  NONE = 0,
  INCREASE = 1,
  DECREASE = 2,
}
