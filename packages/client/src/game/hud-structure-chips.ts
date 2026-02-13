import type {Base, Pillbox} from '@shared';

function pillboxChipClass(ownerTeam: number, myTeam: number): string {
  if (ownerTeam === 255) {
    return 'neutral';
  }
  return ownerTeam === myTeam ? 'owned' : 'enemy';
}

function baseChipClass(ownerTeam: number, myTeam: number): string {
  if (ownerTeam === 255) {
    return 'neutral';
  }
  return ownerTeam === myTeam ? 'owned' : 'enemy';
}

/**
 * Build the pillbox status-box chip list.
 * Includes a shrunken "carried pillbox" marker when the player is carrying one.
 */
export function buildPillboxHudChipsHtml(
  pillboxes: Iterable<Pillbox>,
  myTeam: number,
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
        myTeam
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
  myTeam: number
): string {
  const chips: string[] = [];
  for (const base of bases) {
    chips.push(
      `<span class="hud-chip hud-chip-square base-chip ${baseChipClass(
        base.ownerTeam,
        myTeam
      )}"></span>`
    );
  }
  return chips.join('');
}
