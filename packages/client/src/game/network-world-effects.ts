import type {SoundEvent, Tank, TerrainUpdate, UpdateMessage} from '@shared';

interface WorldCellView {
  terrain: number;
}

export interface TerrainWorldView {
  getCellAt(x: number, y: number): WorldCellView | null | undefined;
  updateCell(
    x: number,
    y: number,
    data: {
      terrain: number;
      terrainLife: number;
      direction?: number;
    }
  ): void;
}

export interface SoundPlayback {
  playSound(
    event: SoundEvent,
    playerX: number,
    playerY: number,
    isOwnTank: boolean
  ): void;
}

/**
 * Apply terrain and sound side effects from a server update.
 *
 * WHY THIS MODULE EXISTS:
 * - Keeps `MultiplayerGame` update orchestration small and readable.
 * - Preserves deterministic side-effect ordering while making behavior easy to test.
 */
export function applyNetworkWorldEffects(
  update: UpdateMessage,
  deps: {
    world: TerrainWorldView;
    playerId: number | null;
    tanks: Map<number, Tank>;
    soundPlayback: SoundPlayback;
    log?: (message: string) => void;
  }
): void {
  applyTerrainUpdates(update.terrainUpdates, deps.world, deps.log ?? console.log);
  playUpdateSoundEvents(update.soundEvents, deps.playerId, deps.tanks, deps.soundPlayback);
}

/**
 * Applies authoritative terrain deltas from the server.
 */
export function applyTerrainUpdates(
  terrainUpdates: TerrainUpdate[] | undefined,
  world: TerrainWorldView,
  log: (message: string) => void = console.log
): void {
  if (!terrainUpdates) {
    return;
  }

  for (const terrainUpdate of terrainUpdates) {
    const oldCell = world.getCellAt(terrainUpdate.x, terrainUpdate.y);
    log(
      `[CLIENT] Received terrain update: (${terrainUpdate.x}, ${terrainUpdate.y}) ` +
      `${oldCell?.terrain} -> ${terrainUpdate.terrain}`
    );

    world.updateCell(terrainUpdate.x, terrainUpdate.y, {
      terrain: terrainUpdate.terrain,
      terrainLife: terrainUpdate.terrainLife,
      ...(terrainUpdate.direction !== undefined && {direction: terrainUpdate.direction}),
    });
  }
}

/**
 * Plays server-emitted sound events from the player's perspective.
 */
export function playUpdateSoundEvents(
  soundEvents: SoundEvent[] | undefined,
  playerId: number | null,
  tanks: Map<number, Tank>,
  soundPlayback: SoundPlayback
): void {
  if (!soundEvents || playerId === null) {
    return;
  }

  const myTank = tanks.get(playerId);
  if (!myTank || myTank.x === undefined || myTank.y === undefined) {
    return;
  }

  for (const soundEvent of soundEvents) {
    // ASSUMPTION: sound source within 128 world units belongs to local player.
    const dx = soundEvent.x - myTank.x;
    const dy = soundEvent.y - myTank.y;
    const distance = Math.sqrt((dx * dx) + (dy * dy));
    const isOwnTank = distance < 128;
    soundPlayback.playSound(soundEvent, myTank.x, myTank.y, isOwnTank);
  }
}
