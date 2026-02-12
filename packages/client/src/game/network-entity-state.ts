import type {
  Base,
  Builder,
  Pillbox,
  Shell,
  Tank,
  UpdateMessage,
} from '@shared';
import {applyRemovedEntityIds} from './entity-delta.js';

export interface NetworkEntityState {
  tanks: Map<number, Tank>;
  shells: Map<number, Shell>;
  builders: Map<number, Builder>;
  pillboxes: Map<number, Pillbox>;
  bases: Map<number, Base>;
}

export interface NetworkEntityCallbacks {
  onTankUpdated?(tank: Tank, tick: number, receivedAtMs: number): void;
  onTankRemoved?(tankId: number): void;
  onBuilderUpdated?(builder: Builder, tick: number, receivedAtMs: number): void;
  onBuilderRemoved?(builderId: number): void;
}

/**
 * Apply an authoritative server entity delta into local client caches.
 *
 * WHY THIS IS A SINGLE REDUCER:
 * - Keeps merge/remove ordering deterministic and reusable.
 * - Lets `MultiplayerGame` focus on presentation-side concerns (terrain/sound).
 * - Makes update semantics easy to regression-test in isolation.
 */
export function applyNetworkEntityUpdate(
  update: UpdateMessage,
  state: NetworkEntityState,
  receivedAtMs: number,
  callbacks: NetworkEntityCallbacks = {}
): void {
  if (update.tanks) {
    for (const tank of update.tanks) {
      if (tank.id === undefined) {
        continue;
      }
      state.tanks.set(tank.id, tank);
      callbacks.onTankUpdated?.(tank, update.tick, receivedAtMs);
    }
  }

  if (update.shells) {
    // ASSUMPTION: server sends complete shell state whenever shells exist.
    // Shells move every tick, so replace is simpler and avoids stale entries.
    state.shells.clear();
    for (const shell of update.shells) {
      if (shell.id === undefined) {
        continue;
      }
      state.shells.set(shell.id, shell);
    }
  }

  if (update.builders) {
    for (const builder of update.builders) {
      if (builder.id === undefined) {
        continue;
      }
      state.builders.set(builder.id, builder);
      callbacks.onBuilderUpdated?.(builder, update.tick, receivedAtMs);
    }
  }

  if (update.pillboxes) {
    for (const pillbox of update.pillboxes) {
      if (pillbox.id === undefined) {
        continue;
      }
      state.pillboxes.set(pillbox.id, pillbox);
    }
  }

  if (update.bases) {
    for (const base of update.bases) {
      if (base.id === undefined) {
        continue;
      }
      state.bases.set(base.id, base);
    }
  }

  applyRemovedEntityIds(update, state);
  for (const tankId of update.removedTankIds ?? []) {
    callbacks.onTankRemoved?.(tankId);
  }
  for (const builderId of update.removedBuilderIds ?? []) {
    callbacks.onBuilderRemoved?.(builderId);
  }
}
