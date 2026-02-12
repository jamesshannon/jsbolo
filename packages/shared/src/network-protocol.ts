/**
 * Network protocol using JSON (Phase 2)
 * TODO: Optimize with Protocol Buffers in Phase 4
 */

import type {PlayerInput, Tank, Builder, Pillbox, Base} from './types.js';

// Client -> Server Messages

export interface ClientMessage {
  type: 'input';
  input: PlayerInput;
}

// Server -> Client Messages

export type ServerMessage = WelcomeMessage | UpdateMessage;

export interface WelcomeMessage {
  type: 'welcome';
  playerId: number;
  assignedTeam: number;
  currentTick: number;
  mapName: string;
  map: {
    width: number;
    height: number;
    terrain: number[]; // Flattened array
    terrainLife: number[]; // Flattened array of terrain health
  };
  // Initial state of all entities
  tanks: Tank[];
  pillboxes: Pillbox[];
  bases: Base[];
  matchEnded?: boolean;
  winningTeams?: number[];
}

export interface Shell {
  id: number;
  x: number;
  y: number;
  direction: number;
  ownerTankId: number;
}

export interface TerrainUpdate {
  x: number;
  y: number;
  terrain: number;
  terrainLife: number;
  direction?: number;
}

export interface SoundEvent {
  soundId: number;
  x: number; // World coordinates
  y: number;
}

export interface UpdateMessage {
  type: 'update';
  tick: number;
  // All entity arrays are optional for delta compression
  // Only changed entities are included in updates
  tanks?: Tank[];
  shells?: Shell[];
  builders?: Builder[];
  pillboxes?: Pillbox[];
  bases?: Base[];
  terrainUpdates?: TerrainUpdate[];
  soundEvents?: SoundEvent[];
  matchEnded?: boolean;
  winningTeams?: number[];
}

// Encoding/Decoding helpers

export function encodeClientMessage(message: ClientMessage): string {
  return JSON.stringify(message);
}

export function decodeClientMessage(data: string): ClientMessage {
  return JSON.parse(data) as ClientMessage;
}

export function encodeServerMessage(message: ServerMessage): string {
  return JSON.stringify(message);
}

export function decodeServerMessage(data: string): ServerMessage {
  return JSON.parse(data) as ServerMessage;
}
