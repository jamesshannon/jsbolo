import type {Base, Pillbox} from '@shared';
import {
  type AllianceRelations,
  isFriendlyToLocalAlliance,
} from './alliance-relations.js';

function pillboxChipClass(
  ownerAllianceId: number,
  myAllianceId: number,
  allianceRelations: AllianceRelations
): string {
  if (ownerAllianceId === 255) {
    return 'neutral';
  }
  return isFriendlyToLocalAlliance(myAllianceId, ownerAllianceId, allianceRelations)
    ? 'owned'
    : 'enemy';
}

function baseChipClass(
  ownerAllianceId: number,
  myAllianceId: number,
  allianceRelations: AllianceRelations
): string {
  if (ownerAllianceId === 255) {
    return 'neutral';
  }
  return isFriendlyToLocalAlliance(myAllianceId, ownerAllianceId, allianceRelations)
    ? 'owned'
    : 'enemy';
}

/**
 * Build the pillbox status-box chip list.
 * Includes a shrunken "carried pillbox" marker when the player is carrying one.
 */
export function buildPillboxHudChipsHtml(
  pillboxes: Iterable<Pillbox>,
  myAllianceId: number,
  allianceRelations: AllianceRelations,
  carriedPillboxId?: number | null
): string {
  const chips: string[] = [];
  if (carriedPillboxId !== undefined && carriedPillboxId !== null) {
    chips.push('<span class="hud-chip hud-chip-square pillbox-chip carried" title="Carried pillbox"></span>');
  }

  for (const pillbox of pillboxes) {
    chips.push(
      `<span class="hud-chip hud-chip-square pillbox-chip ${pillboxChipClass(
        pillbox.ownerTeam,
        myAllianceId,
        allianceRelations
      )}"></span>`
    );
  }
  return chips.join('');
}

/**
 * Build the base status-box chip list.
 */
export function buildBaseHudChipsHtml(
  bases: Iterable<Base>,
  myAllianceId: number,
  allianceRelations: AllianceRelations
): string {
  const chips: string[] = [];
  for (const base of bases) {
    chips.push(
      `<span class="hud-chip hud-chip-square base-chip ${baseChipClass(
        base.ownerTeam,
        myAllianceId,
        allianceRelations
      )}"></span>`
    );
  }
  return chips.join('');
}
