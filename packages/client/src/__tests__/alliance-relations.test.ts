import {describe, expect, it} from 'vitest';
import {
  areAlliancesFriendly,
  buildAllianceRelations,
  getTankAllianceId,
  isFriendlyToLocalAlliance,
} from '../game/alliance-relations.js';

describe('alliance-relations', () => {
  it('builds symmetric-friendly lookups from snapshot entries', () => {
    const relations = buildAllianceRelations([
      {allianceId: 1, alliedAllianceIds: [2]},
      {allianceId: 2, alliedAllianceIds: [1]},
    ]);

    expect(areAlliancesFriendly(1, 2, relations)).toBe(true);
    expect(areAlliancesFriendly(1, 3, relations)).toBe(false);
  });

  it('falls back to same-alliance comparison when no relation snapshot exists', () => {
    const relations = buildAllianceRelations(undefined);
    expect(isFriendlyToLocalAlliance(5, 5, relations)).toBe(true);
    expect(isFriendlyToLocalAlliance(5, 6, relations)).toBe(false);
  });

  it('prefers explicit allianceId over legacy team field', () => {
    expect(
      getTankAllianceId({
        id: 1,
        x: 0,
        y: 0,
        direction: 0,
        speed: 0,
        armor: 40,
        shells: 40,
        mines: 0,
        trees: 0,
        team: 4,
        allianceId: 9,
        onBoat: false,
        reload: 0,
        firingRange: 7,
      })
    ).toBe(9);
  });
});
