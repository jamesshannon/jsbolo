import {describe, expect, it} from 'vitest';
import type {Base, Pillbox} from '@shared';
import {deriveStructureHudMessages} from '../game/hud-events.js';

function pillbox(id: number, ownerTeam: number): Pillbox {
  return {
    id,
    tileX: 10,
    tileY: 10,
    armor: 10,
    ownerTeam,
    inTank: false,
  };
}

function base(id: number, ownerTeam: number): Base {
  return {
    id,
    tileX: 20,
    tileY: 20,
    armor: 80,
    shells: 30,
    mines: 20,
    ownerTeam,
  };
}

describe('deriveStructureHudMessages', () => {
  it('returns no messages when player team is unknown', () => {
    const messages = deriveStructureHudMessages({
      previousPillboxes: new Map([[1, pillbox(1, 255)]]),
      previousBases: new Map(),
      updatedPillboxes: [pillbox(1, 0)],
      myTeam: null,
    });

    expect(messages).toEqual([]);
  });

  it('reports capturing neutral structures for the local team', () => {
    const messages = deriveStructureHudMessages({
      previousPillboxes: new Map([[1, pillbox(1, 255)]]),
      previousBases: new Map([[2, base(2, 255)]]),
      updatedPillboxes: [pillbox(1, 3)],
      updatedBases: [base(2, 3)],
      myTeam: 3,
    });

    expect(messages).toEqual([
      'Captured neutral pillbox.',
      'Captured neutral base.',
    ]);
  });

  it('reports structure losses for the local team', () => {
    const messages = deriveStructureHudMessages({
      previousPillboxes: new Map([[1, pillbox(1, 3)]]),
      previousBases: new Map([[2, base(2, 3)]]),
      updatedPillboxes: [pillbox(1, 1)],
      updatedBases: [base(2, 1)],
      myTeam: 3,
    });

    expect(messages).toEqual([
      'Lost pillbox to Team 1.',
      'Lost base to Team 1.',
    ]);
  });
});
