import {describe, expect, it, vi} from 'vitest';
import {ServerBase} from '../../simulation/base.js';
import {ServerPillbox} from '../../simulation/pillbox.js';
import {ServerTank} from '../../simulation/tank.js';
import {ServerWorld} from '../../simulation/world.js';
import {SessionStateBroadcaster} from '../session-state-broadcaster.js';
import {TerrainType, decodeServerMessage} from '@jsbolo/shared';

function createMockWs() {
  return {
    send: vi.fn(),
    readyState: 1,
  } as any;
}

describe('SessionStateBroadcaster', () => {
  it('should emit removed tank and builder ids after entity disappears', () => {
    const broadcaster = new SessionStateBroadcaster(() => {});
    const world = new ServerWorld();
    const wsA = createMockWs();
    const wsB = createMockWs();
    const tankA = new ServerTank(1, 0, 50, 50);
    const tankB = new ServerTank(2, 1, 60, 60);

    broadcaster.broadcastState({
      tick: 1,
      players: [
        {ws: wsA, tank: tankA},
        {ws: wsB, tank: tankB},
      ],
      shells: [],
      pillboxes: [],
      bases: [],
      world,
      terrainChanges: new Set<string>(),
      soundEvents: [],
      matchEnded: false,
      winningTeams: [],
      matchEndAnnounced: false,
    });

    (wsB.send as any).mockClear();
    const result = broadcaster.broadcastState({
      tick: 2,
      players: [{ws: wsB, tank: tankB}],
      shells: [],
      pillboxes: [],
      bases: [],
      world,
      terrainChanges: new Set<string>(),
      soundEvents: [],
      matchEnded: false,
      winningTeams: [],
      matchEndAnnounced: false,
    });

    expect(result.didBroadcast).toBe(true);
    const message = decodeServerMessage((wsB.send as any).mock.calls[0][0]);
    expect(message.removedTankIds).toContain(tankA.id);
    expect(message.removedBuilderIds).toContain(tankA.builder.id);
  });

  it('should include terrain updates and clear pending terrain keys', () => {
    const broadcaster = new SessionStateBroadcaster(() => {});
    const world = new ServerWorld();
    const ws = createMockWs();
    const tank = new ServerTank(10, 0, 50, 50);
    const terrainChanges = new Set<string>(['5,6']);

    world.setTerrainAt(5, 6, TerrainType.GRASS);

    broadcaster.broadcastState({
      tick: 10,
      players: [{ws, tank}],
      shells: [],
      pillboxes: [new ServerPillbox(10, 10, 255)],
      bases: [new ServerBase(20, 20, 255)],
      world,
      terrainChanges,
      soundEvents: [],
      matchEnded: false,
      winningTeams: [],
      matchEndAnnounced: false,
    });

    const message = decodeServerMessage((ws.send as any).mock.calls[0][0]);
    expect(message.terrainUpdates).toHaveLength(1);
    expect(message.terrainUpdates[0]).toMatchObject({x: 5, y: 6});
    expect(terrainChanges.size).toBe(0);
  });

  it('should announce match end only once', () => {
    const broadcaster = new SessionStateBroadcaster(() => {});
    const world = new ServerWorld();
    const ws = createMockWs();
    const tank = new ServerTank(20, 0, 40, 40);
    const base = new ServerBase(40, 40, 0);

    const first = broadcaster.broadcastState({
      tick: 1,
      players: [{ws, tank}],
      shells: [],
      pillboxes: [],
      bases: [base],
      world,
      terrainChanges: new Set<string>(),
      soundEvents: [],
      matchEnded: true,
      winningTeams: [0],
      matchEndAnnounced: false,
    });

    expect(first.matchEndAnnounced).toBe(true);
    const firstMessage = decodeServerMessage((ws.send as any).mock.calls[0][0]);
    expect(firstMessage.matchEnded).toBe(true);
    expect(firstMessage.winningTeams).toEqual([0]);

    const second = broadcaster.broadcastState({
      tick: 2,
      players: [{ws, tank}],
      shells: [],
      pillboxes: [],
      bases: [base],
      world,
      terrainChanges: new Set<string>(),
      soundEvents: [],
      matchEnded: true,
      winningTeams: [0],
      matchEndAnnounced: first.matchEndAnnounced,
    });

    expect(second.matchEndAnnounced).toBe(true);
    expect((ws.send as any).mock.calls.length).toBe(1);
  });
});
