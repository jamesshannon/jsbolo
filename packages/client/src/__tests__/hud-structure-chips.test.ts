import {describe, expect, it} from 'vitest';
import {buildBaseHudChipsHtml, buildPillboxHudChipsHtml} from '../game/hud-structure-chips.js';

describe('hud-structure-chips', () => {
  it('renders neutral pillboxes with checker pattern class and carried marker', () => {
    const html = buildPillboxHudChipsHtml(
      [
        {id: 1, tileX: 10, tileY: 10, armor: 15, ownerTeam: 255, inTank: false},
      ],
      2,
      77
    );

    expect(html).toContain('pillbox-chip carried');
    expect(html).toContain('pillbox-chip neutral');
  });

  it('renders neutral bases with dedicated neutral class', () => {
    const html = buildBaseHudChipsHtml(
      [
        {id: 2, tileX: 20, tileY: 20, armor: 90, shells: 40, mines: 40, ownerTeam: 255},
      ],
      3
    );

    expect(html).toContain('base-chip neutral');
  });
});
