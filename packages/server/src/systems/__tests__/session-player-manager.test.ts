import {TerrainType} from '@jsbolo/shared';
import {describe, expect, it, vi} from 'vitest';
import {ServerWorld} from '../../simulation/world.js';
import {SessionPlayerManager} from '../session-player-manager.js';

function createMockWs() {
  return {
    send: vi.fn(),
    readyState: 1,
  } as any;
}

describe('SessionPlayerManager', () => {
  it('should assign players to sequential teams and fallback spawn positions', () => {
    const world = new ServerWorld();
    const joined = vi.fn();
    const manager = new SessionPlayerManager(world, joined, () => {});

    const id1 = manager.addPlayer(createMockWs());
    const id2 = manager.addPlayer(createMockWs());

    const player1 = manager.getPlayer(id1)!;
    const player2 = manager.getPlayer(id2)!;

    expect(player1.tank.team).toBe(0);
    expect(player2.tank.team).toBe(1);
    expect(player1.tank.getTilePosition()).toEqual({x: 133, y: 133});
    expect(player2.tank.getTilePosition()).toEqual({x: 138, y: 138});
    expect(joined).toHaveBeenCalledTimes(2);
  });

  it('should spawn tank on boat when spawn tile is water', () => {
    const world = new ServerWorld();
    world.setTerrainAt(133, 133, TerrainType.RIVER);

    const manager = new SessionPlayerManager(world, () => {}, () => {});
    const id = manager.addPlayer(createMockWs());
    const player = manager.getPlayer(id)!;

    expect(player.tank.getTilePosition()).toEqual({x: 133, y: 133});
    expect(player.tank.onBoat).toBe(true);
  });

  it('should adjust map start position to nearest water tile for classic boat spawn', () => {
    const world = {
      getStartPositions: () => [{tileX: 100, tileY: 100, direction: 0}],
      getTerrainAt: (tileX: number, tileY: number) =>
        tileX === 101 && tileY === 100 ? TerrainType.RIVER : TerrainType.GRASS,
    } as unknown as ServerWorld;

    const manager = new SessionPlayerManager(world, () => {}, () => {});
    const id = manager.addPlayer(createMockWs());
    const player = manager.getPlayer(id)!;

    expect(player.tank.getTilePosition()).toEqual({x: 101, y: 100});
    expect(player.tank.onBoat).toBe(true);
  });

  it('should report session-empty status after final disconnect', () => {
    const world = new ServerWorld();
    const manager = new SessionPlayerManager(world, () => {}, () => {});

    const id1 = manager.addPlayer(createMockWs());
    const id2 = manager.addPlayer(createMockWs());

    const firstRemoval = manager.removePlayer(id1);
    expect(firstRemoval.removed).toBe(true);
    expect(firstRemoval.isEmpty).toBe(false);

    const secondRemoval = manager.removePlayer(id2);
    expect(secondRemoval.removed).toBe(true);
    expect(secondRemoval.isEmpty).toBe(true);
  });
});
