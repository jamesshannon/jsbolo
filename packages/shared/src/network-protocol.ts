/**
 * Network protocol using JSON (Phase 2)
 * TODO: Optimize with Protocol Buffers in Phase 4
 */

import type {PlayerInput, Tank} from './types.js';

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
  map: {
    width: number;
    height: number;
    terrain: number[]; // Flattened array
  };
}

export interface UpdateMessage {
  type: 'update';
  tick: number;
  tanks: Tank[];
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
