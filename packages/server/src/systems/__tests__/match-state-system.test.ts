import {describe, it, expect} from 'vitest';
import {ServerWorld} from '../../simulation/world.js';
import {MatchStateSystem} from '../match-state-system.js';

describe('MatchStateSystem', () => {
  it('should support request/accept alliance transitions', () => {
    const system = new MatchStateSystem();
    expect(system.requestAlliance(0, 1)).toBe(true);
    expect(system.acceptAlliance(1, 0)).toBe(true);
    expect(system.areTeamsAllied(0, 1)).toBe(true);
  });

  it('should preserve snapshot mine visibility semantics across alliance changes', () => {
    const system = new MatchStateSystem();
    const world = new ServerWorld();

    system.placeMineForTeam(2, 30, 30, world); // before alliance
    system.createAlliance(2, 3);
    system.placeMineForTeam(2, 31, 30, world); // during alliance
    system.breakAlliance(2, 3);
    system.placeMineForTeam(2, 32, 30, world); // after break

    const visibleToTeam2 = system.getVisibleMineTilesForTeam(2, world);
    expect(visibleToTeam2).toContainEqual({x: 30, y: 30});
    expect(visibleToTeam2).toContainEqual({x: 31, y: 30});
    expect(visibleToTeam2).toContainEqual({x: 32, y: 30});

    const visibleToTeam3 = system.getVisibleMineTilesForTeam(3, world);
    expect(visibleToTeam3).not.toContainEqual({x: 30, y: 30});
    expect(visibleToTeam3).toContainEqual({x: 31, y: 30});
    expect(visibleToTeam3).not.toContainEqual({x: 32, y: 30});
  });

  it('should end match when all owned entities are held by one alliance', () => {
    const system = new MatchStateSystem();
    system.createAlliance(0, 1);

    const didEnd = system.evaluateWinCondition([
      {ownerTeam: 0},
      {ownerTeam: 1},
      {ownerTeam: 0},
    ]);

    expect(didEnd).toBe(true);
    expect(system.isMatchEnded()).toBe(true);
    expect(system.getWinningTeams()).toEqual([0, 1]);
  });
});
