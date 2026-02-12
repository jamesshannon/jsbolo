import {describe, expect, it, vi} from 'vitest';
import {
  applyNetworkWorldEffects,
  applyTerrainUpdates,
  playUpdateSoundEvents,
} from '../game/network-world-effects.js';

describe('network-world-effects', () => {
  it('should apply terrain updates and emit debug log lines', () => {
    const grid = new Map<string, {terrain: number; terrainLife: number; direction?: number}>();
    grid.set('5,6', {terrain: 7, terrainLife: 100});
    const world = {
      getCellAt(x: number, y: number) {
        return grid.get(`${x},${y}`);
      },
      updateCell(
        x: number,
        y: number,
        data: {terrain: number; terrainLife: number; direction?: number}
      ) {
        grid.set(`${x},${y}`, {...data});
      },
    };
    const log = vi.fn();

    applyTerrainUpdates(
      [{x: 5, y: 6, terrain: 4, terrainLife: 80, direction: 64}] as any,
      world,
      log
    );

    expect(grid.get('5,6')).toEqual({terrain: 4, terrainLife: 80, direction: 64});
    expect(log).toHaveBeenCalledWith(
      '[CLIENT] Received terrain update: (5, 6) 7 -> 4'
    );
  });

  it('should route sound events and classify own tank by distance', () => {
    const tanks = new Map<number, any>([[1, {id: 1, x: 1000, y: 1000}]]);
    const playSound = vi.fn();

    playUpdateSoundEvents(
      [
        {soundId: 8, x: 1060, y: 1000}, // own tank range
        {soundId: 9, x: 1600, y: 1000}, // remote
      ] as any,
      1,
      tanks,
      {playSound}
    );

    expect(playSound).toHaveBeenCalledTimes(2);
    expect(playSound).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({soundId: 8}),
      1000,
      1000,
      true
    );
    expect(playSound).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({soundId: 9}),
      1000,
      1000,
      false
    );
  });

  it('should no-op world effects when player tank context is missing', () => {
    const world = {
      getCellAt: () => undefined,
      updateCell: vi.fn(),
    };
    const tanks = new Map<number, any>();
    const playSound = vi.fn();

    applyNetworkWorldEffects(
      {
        type: 'update',
        tick: 10,
        soundEvents: [{soundId: 3, x: 0, y: 0}],
      } as any,
      {
        world,
        playerId: 7,
        tanks,
        soundPlayback: {playSound},
        log: vi.fn(),
      }
    );

    expect(world.updateCell).not.toHaveBeenCalled();
    expect(playSound).not.toHaveBeenCalled();
  });
});
