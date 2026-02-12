import {describe, expect, it, vi} from 'vitest';
import {applyNetworkEntityUpdate} from '../game/network-entity-state.js';

describe('applyNetworkEntityUpdate', () => {
  it('should merge entity deltas, apply removals, and notify tank callbacks', () => {
    const state = {
      tanks: new Map<number, any>([[1, {id: 1, x: 10, y: 10}]]),
      shells: new Map<number, any>(),
      builders: new Map<number, any>(),
      pillboxes: new Map<number, any>([[90, {id: 90}]]),
      bases: new Map<number, any>(),
    };
    const onTankUpdated = vi.fn();
    const onTankRemoved = vi.fn();

    applyNetworkEntityUpdate(
      {
        type: 'update',
        tick: 77,
        tanks: [{id: 1, x: 20, y: 20}, {id: 2, x: 30, y: 30}],
        builders: [{id: 4}],
        pillboxes: [{id: 90, armor: 10}],
        bases: [{id: 7}],
        removedTankIds: [1],
      } as any,
      state,
      1234,
      {onTankUpdated, onTankRemoved}
    );

    expect(state.tanks.has(1)).toBe(false);
    expect(state.tanks.get(2)?.x).toBe(30);
    expect(state.builders.has(4)).toBe(true);
    expect(state.pillboxes.get(90)?.armor).toBe(10);
    expect(state.bases.has(7)).toBe(true);
    expect(onTankUpdated).toHaveBeenCalledTimes(2);
    expect(onTankUpdated).toHaveBeenCalledWith(
      expect.objectContaining({id: 1}),
      77,
      1234
    );
    expect(onTankRemoved).toHaveBeenCalledWith(1);
  });

  it('should replace shell map when shells are present in update', () => {
    const state = {
      tanks: new Map<number, any>(),
      shells: new Map<number, any>([
        [100, {id: 100}],
        [101, {id: 101}],
      ]),
      builders: new Map<number, any>(),
      pillboxes: new Map<number, any>(),
      bases: new Map<number, any>(),
    };

    applyNetworkEntityUpdate(
      {
        type: 'update',
        tick: 5,
        shells: [{id: 200}],
      } as any,
      state,
      2000
    );

    expect(state.shells.size).toBe(1);
    expect(state.shells.has(100)).toBe(false);
    expect(state.shells.has(101)).toBe(false);
    expect(state.shells.has(200)).toBe(true);
  });

  it('should ignore delta entities missing id fields', () => {
    const state = {
      tanks: new Map<number, any>(),
      shells: new Map<number, any>(),
      builders: new Map<number, any>(),
      pillboxes: new Map<number, any>(),
      bases: new Map<number, any>(),
    };
    const onTankUpdated = vi.fn();

    applyNetworkEntityUpdate(
      {
        type: 'update',
        tick: 9,
        tanks: [{x: 10, y: 20}],
        shells: [{x: 10, y: 20}],
        builders: [{x: 10, y: 20}],
        pillboxes: [{x: 10, y: 20}],
        bases: [{x: 10, y: 20}],
      } as any,
      state,
      90,
      {onTankUpdated}
    );

    expect(state.tanks.size).toBe(0);
    expect(state.shells.size).toBe(0);
    expect(state.builders.size).toBe(0);
    expect(state.pillboxes.size).toBe(0);
    expect(state.bases.size).toBe(0);
    expect(onTankUpdated).not.toHaveBeenCalled();
  });
});
