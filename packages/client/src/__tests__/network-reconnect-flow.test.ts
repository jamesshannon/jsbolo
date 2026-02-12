import {encodeServerMessage, type Base, type Builder, type Pillbox, type Shell, type Tank} from '@shared';
import {describe, expect, it} from 'vitest';
import {applyNetworkEntityUpdate} from '../game/network-entity-state.js';
import {applyNetworkWelcomeState} from '../game/network-welcome-state.js';
import {NetworkClient} from '../network/network-client.js';
import {TankInterpolator} from '../network/tank-interpolator.js';
import {World} from '../world/world.js';

function createTank(id: number, x: number, y: number): Tank {
  return {
    id,
    x,
    y,
    direction: 0,
    speed: 0,
    armor: 40,
    shells: 40,
    mines: 0,
    trees: 0,
    team: 0,
    onBoat: false,
    reload: 0,
    firingRange: 7,
  };
}

describe('Network Reconnect Flow', () => {
  it('should clear stale entity and interpolation state on reconnect welcome', () => {
    const client = new NetworkClient();
    const world = new World();
    const tankInterpolator = new TankInterpolator(100);

    const tanks = new Map<number, Tank>();
    const shells = new Map<number, Shell>();
    const builders = new Map<number, Builder>();
    const pillboxes = new Map<number, Pillbox>();
    const bases = new Map<number, Base>();

    let playerId: number | null = null;
    let mapName = '';

    client.onWelcome(welcome => {
      const result = applyNetworkWelcomeState(welcome, {
        world,
        tanks,
        shells,
        builders,
        pillboxes,
        bases,
        tankInterpolator,
        nowMs: 1_000,
        log: () => {},
      });
      playerId = result.playerId;
      mapName = result.mapName;
    });

    client.onUpdate(update => {
      applyNetworkEntityUpdate(
        update,
        {
          tanks,
          shells,
          builders,
          pillboxes,
          bases,
        },
        1_100,
        {
          onTankUpdated: (tank, tick, receivedAtMs) => {
            tankInterpolator.pushSnapshot(tank, tick, receivedAtMs);
          },
          onTankRemoved: tankId => {
            tankInterpolator.removeTank(tankId);
          },
        }
      );
    });

    const internal = client as any;
    internal.handleMessage(
      encodeServerMessage({
        type: 'welcome',
        playerId: 7,
        assignedTeam: 0,
        currentTick: 10,
        mapName: 'session-a',
        map: {
          width: 2,
          height: 2,
          terrain: [7, 7, 7, 7],
          terrainLife: [255, 255, 255, 255],
        },
        tanks: [createTank(1, 100, 100)],
        pillboxes: [{id: 40, tileX: 10, tileY: 10, armor: 255, ownerTeam: 255, inTank: false}],
        bases: [{id: 50, tileX: 12, tileY: 12, armor: 90, shells: 5, mines: 2, ownerTeam: 1}],
      })
    );

    internal.handleMessage(
      encodeServerMessage({
        type: 'update',
        tick: 11,
        tanks: [createTank(1, 150, 150)],
        shells: [{id: 99, x: 150, y: 150, direction: 0, ownerTankId: 1}],
        builders: [{
          id: 88,
          ownerTankId: 1,
          x: 150,
          y: 151,
          targetX: 151,
          targetY: 151,
          order: 0,
          trees: 0,
          hasMine: false,
          team: 0,
        }],
        pillboxes: [{id: 40, tileX: 10, tileY: 10, armor: 250, ownerTeam: 0, inTank: false}],
        bases: [{id: 50, tileX: 12, tileY: 12, armor: 80, shells: 4, mines: 2, ownerTeam: 1}],
      })
    );

    expect(playerId).toBe(7);
    expect(mapName).toBe('session-a');
    expect(tanks.size).toBe(1);
    expect(shells.size).toBe(1);
    expect(builders.size).toBe(1);
    expect(pillboxes.size).toBe(1);
    expect(bases.size).toBe(1);
    expect(tankInterpolator.getInterpolatedTank(1, 1_200)).toBeDefined();

    internal.handleMessage(
      encodeServerMessage({
        type: 'welcome',
        playerId: 8,
        assignedTeam: 3,
        currentTick: 1,
        mapName: 'session-b',
        map: {
          width: 2,
          height: 2,
          terrain: [4, 4, 4, 4],
          terrainLife: [255, 255, 255, 255],
        },
        tanks: [],
        pillboxes: [],
        bases: [],
      })
    );

    expect(playerId).toBe(8);
    expect(mapName).toBe('session-b');
    expect(tanks.size).toBe(0);
    expect(shells.size).toBe(0);
    expect(builders.size).toBe(0);
    expect(pillboxes.size).toBe(0);
    expect(bases.size).toBe(0);
    expect(tankInterpolator.getInterpolatedTank(1, 1_300)).toBeUndefined();
    expect(client.getState().tanks.size).toBe(0);
    expect(client.getState().currentTick).toBe(1);
  });
});
