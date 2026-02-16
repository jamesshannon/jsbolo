import {describe, expect, it} from 'vitest';
import type {Pillbox} from '@shared';
import {
  listRemoteViewPillboxes,
  pickDirectionalRemotePillbox,
  pickInitialRemotePillbox,
} from '../game/remote-pillbox-view.js';

function makePillbox(
  id: number,
  tileX: number,
  tileY: number,
  ownerTeam: number,
  inTank = false
): Pillbox {
  return {
    id,
    tileX,
    tileY,
    ownerTeam,
    inTank,
    armor: 15,
  };
}

describe('remote pillbox view helpers', () => {
  it('filters candidates to local/allied pillboxes that are on-map', () => {
    const candidates = listRemoteViewPillboxes(
      [
        makePillbox(1, 10, 10, 2),
        makePillbox(2, 20, 10, 3),
        makePillbox(3, 30, 10, 2, true),
      ],
      2,
      new Map([
        [2, new Set([3])],
        [3, new Set([2])],
      ])
    );

    expect(candidates.map(candidate => candidate.id)).toEqual([1, 2]);
  });

  it('picks the nearest pillbox to local tank tile for initial selection', () => {
    const initial = pickInitialRemotePillbox(
      [makePillbox(1, 10, 10, 2), makePillbox(2, 18, 18, 2)],
      12,
      12
    );

    expect(initial).toBe(1);
  });

  it('picks directional neighbors from current pillbox', () => {
    const candidates = [
      makePillbox(1, 10, 10, 2),
      makePillbox(2, 10, 7, 2),
      makePillbox(3, 14, 10, 2),
      makePillbox(4, 8, 10, 2),
    ];

    expect(pickDirectionalRemotePillbox(candidates, 1, 'up')).toBe(2);
    expect(pickDirectionalRemotePillbox(candidates, 1, 'right')).toBe(3);
    expect(pickDirectionalRemotePillbox(candidates, 1, 'left')).toBe(4);
  });

  it('keeps current selection when no candidate exists in a direction', () => {
    const candidates = [makePillbox(1, 10, 10, 2), makePillbox(2, 15, 10, 2)];

    expect(pickDirectionalRemotePillbox(candidates, 1, 'down')).toBe(1);
  });
});
