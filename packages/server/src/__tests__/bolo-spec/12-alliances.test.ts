/**
 * Bolo Manual Spec: Alliances
 *
 * Manual Reference: docs/bolo-manual-reference.md § 13 "Alliances"
 *
 * Tests alliance system and team-based mechanics:
 * - "When you capture a pillbox for yourself, it will shoot at all other players.
 *    When there are several people playing, one person does not have much chance
 *    of winning on his own, so you will want to work as a team."
 * - "So that your pillboxes know not to shoot at your friends, a formal alliance
 *    must be declared."
 * - Team-owned pillboxes skip friendly targets (basic implementation exists)
 * - Request/invite alliance system (NOT YET IMPLEMENTED)
 * - Mine visibility sharing among allies (NOT YET IMPLEMENTED)
 * - Alliance leave/join mechanics (NOT YET IMPLEMENTED)
 */

import { describe, it, expect } from 'vitest';
import { ServerPillbox } from '../../simulation/pillbox.js';
import { GameSession } from '../../game-session.js';
import { PILLBOX_RANGE } from '@jsbolo/shared';

describe('Bolo Manual Spec: 12. Alliances', () => {
  // Team-owned pillbox behavior already tests the "don't shoot allies" rule
  it('should have pillboxes skip friendly tanks (same team = allied)', () => {
    const pb = new ServerPillbox(50, 50, 0);
    const tanks = [
      { id: 1, x: 51 * 256, y: 50 * 256, direction: 0, speed: 0, team: 0, armor: 40 },
    ];
    const target = pb.findTarget(tanks, PILLBOX_RANGE);
    expect(target).toBeNull(); // Friendly, no target
  });

  // "a formal alliance must be declared" - request/invite system
  it('should support alliance request/invite system', () => {
    const session = new GameSession();
    expect(session.requestAlliance(0, 1)).toBe(true);
    expect(session.acceptAlliance(1, 0)).toBe(true);
    expect(session.areTeamsAllied(0, 1)).toBe(true);
  });

  // "Members of an alliance can also see each other's mines as they are layed"
  it('should share mine visibility among allies', () => {
    const session = new GameSession();
    const ws1 = { send: () => {}, readyState: 1 } as any;
    const ws2 = { send: () => {}, readyState: 1 } as any;
    const player1Id = session.addPlayer(ws1);
    const player2Id = session.addPlayer(ws2);
    const world = (session as any).world;

    session.createAlliance(0, 1);
    world.setMineAt(10, 10, true);

    const visible1 = session.getVisibleMineTilesForPlayer(player1Id);
    const visible2 = session.getVisibleMineTilesForPlayer(player2Id);
    expect(visible1).toContainEqual({x: 10, y: 10});
    expect(visible2).toContainEqual({x: 10, y: 10});
  });

  // "a player may opt to leave the alliance"
  it('should allow player to leave alliance', () => {
    const session = new GameSession();
    session.createAlliance(0, 1);
    expect(session.areTeamsAllied(0, 1)).toBe(true);

    session.leaveAlliance(0);
    expect(session.areTeamsAllied(0, 1)).toBe(false);
  });

  // "Any pillboxes he is carrying at the time are his, but any active ones
  //  on the map remain with the members of the alliance"
  it('should keep placed pillboxes with alliance when member leaves', () => {
    const session = new GameSession();
    const pillbox = Array.from((session as any).pillboxes.values())[0];
    pillbox.ownerTeam = 0;

    session.createAlliance(0, 1);
    session.leaveAlliance(1);

    expect(pillbox.ownerTeam).toBe(0);
  });
});
