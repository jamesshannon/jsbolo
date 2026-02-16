import {describe, expect, it} from 'vitest';
import type {Base, Tank} from '@shared';
import {selectNearestFriendlyVisibleBase} from '../game/hud-nearest-base.js';

function tank(team: number, x = 100 * 256, y = 100 * 256): Tank {
  return {
    id: 1,
    x,
    y,
    direction: 0,
    speed: 0,
    armor: 40,
    shells: 40,
    mines: 0,
    trees: 0,
    team,
    onBoat: false,
    reload: 0,
    firingRange: 7,
    carriedPillbox: null,
  };
}

function base(id: number, team: number, tileX: number, tileY: number): Base {
  return {
    id,
    tileX,
    tileY,
    armor: 90,
    shells: 40,
    mines: 40,
    ownerTeam: team,
  };
}

describe('hud-nearest-base', () => {
  it('selects nearest friendly base that is visible in camera viewport', () => {
    const selected = selectNearestFriendlyVisibleBase(
      tank(2),
      [base(1, 2, 101, 100), base(2, 2, 110, 100)],
      {
        isVisible: (x: number) => x < 3500,
      },
      new Map()
    );

    expect(selected?.id).toBe(1);
  });

  it('ignores hostile or neutral bases', () => {
    const selected = selectNearestFriendlyVisibleBase(
      tank(5),
      [base(1, 255, 101, 100), base(2, 7, 100, 100)],
      {
        isVisible: () => true,
      },
      new Map()
    );

    expect(selected).toBeNull();
  });
});
