import type {Base, Pillbox} from '@shared';

const NEUTRAL_TEAM = 255;

export interface StructureHudEventInput {
  previousPillboxes: ReadonlyMap<number, Pillbox>;
  previousBases: ReadonlyMap<number, Base>;
  updatedPillboxes?: readonly Pillbox[];
  updatedBases?: readonly Base[];
  myTeam: number | null;
}

/**
 * Derive player-facing HUD ticker messages from structure ownership transitions.
 *
 * WHY THIS EXISTS:
 * - Server updates are state deltas, not high-level event messages.
 * - We infer meaningful capture/loss text from owner changes deterministically.
 */
export function deriveStructureHudMessages(input: StructureHudEventInput): string[] {
  if (input.myTeam === null) {
    return [];
  }

  const messages: string[] = [];
  const myTeam = input.myTeam;

  for (const pillbox of input.updatedPillboxes ?? []) {
    const previous = input.previousPillboxes.get(pillbox.id);
    if (!previous || previous.ownerTeam === pillbox.ownerTeam) {
      continue;
    }

    if (pillbox.ownerTeam === myTeam) {
      messages.push(
        previous.ownerTeam === NEUTRAL_TEAM
          ? 'Captured neutral pillbox.'
          : `Captured enemy pillbox (Team ${previous.ownerTeam}).`
      );
      continue;
    }

    if (previous.ownerTeam === myTeam) {
      messages.push(
        pillbox.ownerTeam === NEUTRAL_TEAM
          ? 'Lost pillbox.'
          : `Lost pillbox to Team ${pillbox.ownerTeam}.`
      );
    }
  }

  for (const base of input.updatedBases ?? []) {
    const previous = input.previousBases.get(base.id);
    if (!previous || previous.ownerTeam === base.ownerTeam) {
      continue;
    }

    if (base.ownerTeam === myTeam) {
      messages.push(
        previous.ownerTeam === NEUTRAL_TEAM
          ? 'Captured neutral base.'
          : `Captured enemy base (Team ${previous.ownerTeam}).`
      );
      continue;
    }

    if (previous.ownerTeam === myTeam) {
      messages.push(
        base.ownerTeam === NEUTRAL_TEAM
          ? 'Lost base.'
          : `Lost base to Team ${base.ownerTeam}.`
      );
    }
  }

  return messages;
}
