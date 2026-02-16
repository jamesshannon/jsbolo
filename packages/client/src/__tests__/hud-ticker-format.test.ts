import {describe, expect, it} from 'vitest';
import type {Tank} from '@shared';
import {formatHudTickerHtml} from '../game/hud-ticker-format.js';

function tank(id: number, team: number): Tank {
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
  };
}

describe('formatHudTickerHtml', () => {
  it('formats self/friendly/hostile sender names with relation classes', () => {
    const tanks = new Map<number, Tank>([
      [1, tank(1, 2)],
      [2, tank(2, 2)],
      [3, tank(3, 5)],
    ]);

    expect(
      formatHudTickerHtml('Player 1: hello', {
        myPlayerId: 1,
        myAllianceId: 2,
        allianceRelations: new Map(),
        tanks,
      })
    ).toContain('hud-sender-self');
    expect(
      formatHudTickerHtml('Player 2: hello', {
        myPlayerId: 1,
        myAllianceId: 2,
        allianceRelations: new Map(),
        tanks,
      })
    ).toContain('hud-sender-friendly');
    expect(
      formatHudTickerHtml('Player 3: hello', {
        myPlayerId: 1,
        myAllianceId: 2,
        allianceRelations: new Map(),
        tanks,
      })
    ).toContain('hud-sender-hostile');
  });

  it('escapes html in sender and body', () => {
    const html = formatHudTickerHtml('Player 2: <b>xss</b>', {
      myPlayerId: 1,
      myAllianceId: 1,
      allianceRelations: new Map(),
      tanks: new Map([[2, tank(2, 9)]]),
    });
    expect(html).not.toContain('<b>');
    expect(html).toContain('&lt;b&gt;xss&lt;/b&gt;');
  });

  it('returns escaped plain text for non-chat messages', () => {
    const html = formatHudTickerHtml('Team 1 won <fast>', {
      myPlayerId: 1,
      myAllianceId: 1,
      allianceRelations: new Map(),
      tanks: new Map(),
    });
    expect(html).toBe('Team 1 won &lt;fast&gt;');
  });
});
