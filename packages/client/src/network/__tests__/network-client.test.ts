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
});
