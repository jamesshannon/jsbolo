/**
 * Network protocol using JSON (Phase 2)
 * TODO: Optimize with Protocol Buffers in Phase 4
 */
import type { PlayerInput, Tank, Builder } from './types.js';
export interface ClientMessage {
    type: 'input';
    input: PlayerInput;
}
export type ServerMessage = WelcomeMessage | UpdateMessage;
export interface WelcomeMessage {
    type: 'welcome';
    playerId: number;
    assignedTeam: number;
    currentTick: number;
    map: {
        width: number;
        height: number;
        terrain: number[];
    };
}
export interface Shell {
    id: number;
    x: number;
    y: number;
    direction: number;
    ownerTankId: number;
}
export interface UpdateMessage {
    type: 'update';
    tick: number;
    tanks: Tank[];
    shells?: Shell[];
    builders?: Builder[];
}
export declare function encodeClientMessage(message: ClientMessage): string;
export declare function decodeClientMessage(data: string): ClientMessage;
export declare function encodeServerMessage(message: ServerMessage): string;
export declare function decodeServerMessage(data: string): ServerMessage;
//# sourceMappingURL=network-protocol.d.ts.map