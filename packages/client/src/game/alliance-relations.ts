import type {AllianceSnapshot, Tank} from '@shared';

export type AllianceRelations = Map<number, ReadonlySet<number>>;

/**
 * Build relation lookup from protocol alliance snapshots.
 */
export function buildAllianceRelations(
  snapshots: readonly AllianceSnapshot[] | undefined
): AllianceRelations {
  const relations: AllianceRelations = new Map<number, ReadonlySet<number>>();
  for (const snapshot of snapshots ?? []) {
    relations.set(snapshot.allianceId, new Set(snapshot.alliedAllianceIds));
  }
  return relations;
}

/**
 * Canonical alliance identifier for a tank.
 */
export function getTankAllianceId(tank: Tank): number {
  return tank.allianceId ?? tank.team;
}

/**
 * Check whether two alliances are friendly in the current snapshot.
 */
export function areAlliancesFriendly(
  allianceA: number,
  allianceB: number,
  relations: AllianceRelations
): boolean {
  if (allianceA === allianceB) {
    return true;
  }

  const alliesA = relations.get(allianceA);
  if (alliesA?.has(allianceB)) {
    return true;
  }

  const alliesB = relations.get(allianceB);
  if (alliesB?.has(allianceA)) {
    return true;
  }

  return false;
}

/**
 * Resolve local-vs-target friendliness with a safe fallback.
 *
 * Fallback behavior:
 * If no relation data exists yet (older payload / first frame), compare alliance ids directly.
 */
export function isFriendlyToLocalAlliance(
  localAllianceId: number | null,
  targetAllianceId: number,
  relations: AllianceRelations
): boolean {
  if (localAllianceId === null) {
    return false;
  }

  if (relations.size === 0) {
    return localAllianceId === targetAllianceId;
  }

  return areAlliancesFriendly(localAllianceId, targetAllianceId, relations);
}
