import {PIXEL_SIZE_WORLD, TILE_SIZE_PIXELS, type Base, type Tank} from '@shared';
import {
  type AllianceRelations,
  getTankAllianceId,
  isFriendlyToLocalAlliance,
} from './alliance-relations.js';

interface CameraLike {
  isVisible(worldX: number, worldY: number, padding?: number): boolean;
}

/**
 * Select the closest friendly base that is currently inside the map viewport.
 * This matches the manual's "closest base which is also in map view" semantics.
 */
export function selectNearestFriendlyVisibleBase(
  tank: Tank,
  bases: Iterable<Base>,
  camera: CameraLike,
  allianceRelations: AllianceRelations
): Base | null {
  let nearest: Base | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  const tankPixelX = tank.x / PIXEL_SIZE_WORLD;
  const tankPixelY = tank.y / PIXEL_SIZE_WORLD;

  const localAllianceId = getTankAllianceId(tank);

  for (const base of bases) {
    if (!isFriendlyToLocalAlliance(localAllianceId, base.ownerTeam, allianceRelations)) {
      continue;
    }

    const basePixelX = ((base.tileX + 0.5) * TILE_SIZE_PIXELS);
    const basePixelY = ((base.tileY + 0.5) * TILE_SIZE_PIXELS);
    if (!camera.isVisible(basePixelX, basePixelY)) {
      continue;
    }

    const dx = tankPixelX - basePixelX;
    const dy = tankPixelY - basePixelY;
    const distance = (dx * dx) + (dy * dy);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = base;
    }
  }

  return nearest;
}
