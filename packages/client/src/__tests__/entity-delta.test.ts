import {describe, expect, it} from 'vitest';
import {applyRemovedEntityIds} from '../game/entity-delta.js';

describe('applyRemovedEntityIds', () => {
  it('should remove entities from local maps when removal IDs are present', () => {
    const tanks = new Map([[1, {id: 1}], [2, {id: 2}]]) as any;
    const builders = new Map([[10, {id: 10}], [20, {id: 20}]]) as any;
    const pillboxes = new Map([[100, {id: 100}]]) as any;
    const bases = new Map([[200, {id: 200}], [201, {id: 201}]]) as any;

    applyRemovedEntityIds(
      {
        type: 'update',
        tick: 123,
        removedTankIds: [2],
        removedBuilderIds: [10],
        removedPillboxIds: [100],
        removedBaseIds: [201],
      },
      {tanks, builders, pillboxes, bases}
    );

    expect(tanks.has(1)).toBe(true);
    expect(tanks.has(2)).toBe(false);
    expect(builders.has(10)).toBe(false);
    expect(builders.has(20)).toBe(true);
    expect(pillboxes.size).toBe(0);
    expect(bases.has(200)).toBe(true);
    expect(bases.has(201)).toBe(false);
  });

  it('should let removals win when update and removal for same id arrive together', () => {
    const tanks = new Map<number, any>();
    const builders = new Map<number, any>();
    const pillboxes = new Map<number, any>();
    const bases = new Map<number, any>();

    // Simulate the same ordering used in MultiplayerGame.onUpdate:
    // 1) Merge changed entities from delta.
    // 2) Apply explicit removed ids.
    tanks.set(7, {id: 7, x: 100, y: 100});

    applyRemovedEntityIds(
      {
        type: 'update',
        tick: 200,
        removedTankIds: [7],
      },
      {tanks, builders, pillboxes, bases}
    );

    expect(tanks.has(7)).toBe(false);
  });
});
