/**
 * Bolo Manual Spec: Win Condition
 *
 * Manual Reference: docs/bolo-manual-reference.md § 14 "Win Condition"
 *
 * Tests game victory detection:
 * - "The object of the game is, eventually, to have captured all of these
 *    refueling bases."
 * - Game won when one player/alliance controls all bases
 *
 * NOT YET IMPLEMENTED - all tests skipped
 */

import { describe, it, expect } from 'vitest';
import { GameSession } from '../../game-session.js';

describe('Bolo Manual Spec: 13. Win Condition', () => {
  // "to have captured all of these refueling bases"
  it('should detect win when one player/alliance controls all bases', () => {
    const session = new GameSession();
    const ws = {
      send: () => {},
      readyState: 1,
    } as any;
    session.addPlayer(ws);

    const bases = Array.from((session as any).bases.values());
    for (const base of bases) {
      base.ownerTeam = 0;
    }

    (session as any).update();

    expect(session.isMatchEnded()).toBe(true);
    expect(session.getWinningTeams()).toEqual([0]);
  });
});
