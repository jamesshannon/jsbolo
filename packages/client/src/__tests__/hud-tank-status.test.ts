import {describe, expect, it} from 'vitest';
import {deriveTankHudMarkers} from '../game/hud-tank-status.js';
import type {Tank} from '@shared';

function makeTank(id: number, team: number): Tank {
  return {
    id,
    x: 0,
    y: 0,
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

describe('deriveTankHudMarkers', () => {
  it('marks self as black relation and teammates as friendly', () => {
    const markers = deriveTankHudMarkers({
      tanks: [makeTank(1, 2), makeTank(2, 2), makeTank(3, 4)],
      myPlayerId: 1,
      myTeam: 2,
    });

    expect(markers).toEqual([
      {playerId: 1, relation: 'self'},
      {playerId: 2, relation: 'friendly'},
      {playerId: 3, relation: 'hostile'},
    ]);
  });

  it('falls back to neutral when local team is unknown', () => {
    const markers = deriveTankHudMarkers({
      tanks: [makeTank(3, 4), makeTank(1, 2)],
      myPlayerId: null,
      myTeam: null,
    });

    expect(markers).toEqual([
      {playerId: 1, relation: 'neutral'},
      {playerId: 3, relation: 'neutral'},
    ]);
  });
});
