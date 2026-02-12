import type {Base, Builder, Pillbox, Tank, UpdateMessage} from '@shared';

interface EntityCollections {
  tanks: Map<number, Tank>;
  builders: Map<number, Builder>;
  pillboxes: Map<number, Pillbox>;
  bases: Map<number, Base>;
}

export function applyRemovedEntityIds(
  update: UpdateMessage,
  collections: EntityCollections
): void {
  for (const id of update.removedTankIds ?? []) {
    collections.tanks.delete(id);
  }
  for (const id of update.removedBuilderIds ?? []) {
    collections.builders.delete(id);
  }
  for (const id of update.removedPillboxIds ?? []) {
    collections.pillboxes.delete(id);
  }
  for (const id of update.removedBaseIds ?? []) {
    collections.bases.delete(id);
  }
}
