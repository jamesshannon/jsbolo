import {describe, expect, it} from 'vitest';
import {HudMessageService} from '../hud-message-service.js';

describe('HudMessageService', () => {
  it('routes alliance messages only to allied/source-team players', () => {
    const service = new HudMessageService();
    const players = [
      {id: 1, tank: {team: 1}},
      {id: 2, tank: {team: 2}},
      {id: 3, tank: {team: 3}},
    ];

    service.publishAlliance({
      tick: 10,
      text: 'alliance-only',
      sourceTeam: 1,
      players,
      areTeamsAllied: (a: number, b: number) => (a === 1 && b === 2) || (a === 2 && b === 1),
    });

    expect(service.drainForPlayer(1)).toHaveLength(1);
    expect(service.drainForPlayer(2)).toHaveLength(1);
    expect(service.drainForPlayer(3)).toHaveLength(0);
  });

  it('routes personal messages only to the targeted player', () => {
    const service = new HudMessageService();
    service.publishPersonal({
      tick: 20,
      text: 'private',
      playerId: 7,
    });

    expect(service.drainForPlayer(7)).toHaveLength(1);
    expect(service.drainForPlayer(8)).toHaveLength(0);
  });
});

