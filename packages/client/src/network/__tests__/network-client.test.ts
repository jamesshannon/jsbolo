import {describe, expect, it, vi} from 'vitest';
import {NetworkClient} from '../network-client.js';

describe('NetworkClient', () => {
  it('should ignore stale update ticks and keep latest state', () => {
    const client = new NetworkClient();
    const onUpdate = vi.fn();
    client.onUpdate(onUpdate);

    const internal = client as any;
    internal.handleUpdate({
      type: 'update',
      tick: 10,
      tanks: [{id: 1, x: 100, y: 100}],
    });

    internal.handleUpdate({
      type: 'update',
      tick: 9,
      tanks: [{id: 1, x: 50, y: 50}],
    });

    expect(client.getState().currentTick).toBe(10);
    expect(client.getState().tanks.get(1)?.x).toBe(100);
    expect(client.getState().tanks.get(1)?.y).toBe(100);
    expect(onUpdate).toHaveBeenCalledTimes(1);
  });

  it('should apply update ticks that are equal or newer than current tick', () => {
    const client = new NetworkClient();
    const internal = client as any;

    internal.handleUpdate({
      type: 'update',
      tick: 20,
      tanks: [{id: 2, x: 10, y: 10}],
    });
    internal.handleUpdate({
      type: 'update',
      tick: 20,
      tanks: [{id: 2, x: 15, y: 15}],
    });
    internal.handleUpdate({
      type: 'update',
      tick: 21,
      tanks: [{id: 2, x: 30, y: 30}],
    });

    expect(client.getState().currentTick).toBe(21);
    expect(client.getState().tanks.get(2)?.x).toBe(30);
    expect(client.getState().tanks.get(2)?.y).toBe(30);
  });

  it('should remove tanks from local cache when update includes removedTankIds', () => {
    const client = new NetworkClient();
    const internal = client as any;

    internal.handleUpdate({
      type: 'update',
      tick: 1,
      tanks: [{id: 9, x: 100, y: 100}],
    });
    expect(client.getState().tanks.has(9)).toBe(true);

    internal.handleUpdate({
      type: 'update',
      tick: 2,
      shells: [],
      removedTankIds: [9],
    });
    expect(client.getState().tanks.has(9)).toBe(false);
  });

  it('should clear cached tanks on welcome to avoid stale entities across reconnects', () => {
    const client = new NetworkClient();
    const internal = client as any;

    internal.handleUpdate({
      type: 'update',
      tick: 50,
      tanks: [{id: 3, x: 44, y: 55}],
    });
    expect(client.getState().tanks.size).toBe(1);

    internal.handleWelcome({
      type: 'welcome',
      playerId: 1,
      assignedTeam: 0,
      currentTick: 5,
      mapName: 'test',
      map: {
        width: 256,
        height: 256,
        terrain: [],
        terrainLife: [],
      },
      tanks: [],
      pillboxes: [],
      bases: [],
    });

    expect(client.getState().currentTick).toBe(5);
    expect(client.getState().tanks.size).toBe(0);
  });
});
