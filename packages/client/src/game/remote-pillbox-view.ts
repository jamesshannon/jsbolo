import type {Pillbox} from '@shared';
import type {AllianceRelations} from './alliance-relations.js';
import {isFriendlyToLocalAlliance} from './alliance-relations.js';

export type RemotePillboxDirection = 'up' | 'down' | 'left' | 'right';

interface DirectionVector {
  dx: number;
  dy: number;
}

const DIRECTION_VECTORS: Record<RemotePillboxDirection, DirectionVector> = {
  up: {dx: 0, dy: -1},
  down: {dx: 0, dy: 1},
  left: {dx: -1, dy: 0},
  right: {dx: 1, dy: 0},
};

/**
 * Return eligible pillboxes for remote camera mode.
 *
 * Includes locally owned and allied pillboxes.
 */
export function listRemoteViewPillboxes(
  pillboxes: Iterable<Pillbox>,
  myAllianceId: number | null,
  allianceRelations: AllianceRelations
): Pillbox[] {
  if (myAllianceId === null) {
    return [];
  }

  return Array.from(pillboxes)
    .filter(
      pillbox =>
        !pillbox.inTank &&
        isFriendlyToLocalAlliance(myAllianceId, pillbox.ownerTeam, allianceRelations)
    )
    .sort((a, b) => a.id - b.id);
}

/**
 * Choose the closest candidate to the anchor tile.
 */
export function pickInitialRemotePillbox(
  candidates: readonly Pillbox[],
  anchorTileX: number,
  anchorTileY: number
): number | null {
  if (candidates.length === 0) {
    return null;
  }

  let best = candidates[0]!;
  let bestDistance = distanceSquared(anchorTileX, anchorTileY, best.tileX, best.tileY);

  for (const candidate of candidates) {
    const distance = distanceSquared(anchorTileX, anchorTileY, candidate.tileX, candidate.tileY);
    if (distance < bestDistance || (distance === bestDistance && candidate.id < best.id)) {
      best = candidate;
      bestDistance = distance;
    }
  }

  return best.id;
}

/**
 * Pick a neighboring pillbox in the requested direction.
 *
 * Returns the current pillbox id if no directional candidate is available.
 */
export function pickDirectionalRemotePillbox(
  candidates: readonly Pillbox[],
  currentPillboxId: number,
  direction: RemotePillboxDirection
): number {
  const current = candidates.find(candidate => candidate.id === currentPillboxId);
  if (!current) {
    return currentPillboxId;
  }

  const axis = DIRECTION_VECTORS[direction];
  let bestId = currentPillboxId;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const candidate of candidates) {
    if (candidate.id === current.id) {
      continue;
    }

    const vx = candidate.tileX - current.tileX;
    const vy = candidate.tileY - current.tileY;
    const forwardDot = vx * axis.dx + vy * axis.dy;

    // Ignore pillboxes that are not in the requested direction.
    if (forwardDot <= 0) {
      continue;
    }

    // Prefer heading alignment first, then shorter distance.
    const lateralOffset = Math.abs(vx * axis.dy - vy * axis.dx);
    const distance = vx * vx + vy * vy;
    const score = lateralOffset * 1000 + distance;

    if (score < bestScore || (score === bestScore && candidate.id < bestId)) {
      bestScore = score;
      bestId = candidate.id;
    }
  }

  return bestId;
}

function distanceSquared(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}
