import {describe, expect, it, vi} from 'vitest';
import {
  TILE_SIZE_WORLD,
  TerrainType,
  decodeServerMessage,
  type UpdateMessage,
} from '@jsbolo/shared';
import type {WebSocket} from 'ws';
import {GameSession} from '../../game-session.js';
import {ServerShell} from '../../simulation/shell.js';

function createMockWebSocket(): WebSocket {
  return {
    send: vi.fn(),
    readyState: 1,
    on: vi.fn(),
    close: vi.fn(),
  } as unknown as WebSocket;
}

function setTankTile(
  tank: {x: number; y: number},
  tileX: number,
  tileY: number
): void {
  tank.x = (tileX + 0.5) * TILE_SIZE_WORLD;
  tank.y = (tileY + 0.5) * TILE_SIZE_WORLD;
}

function clearMessages(ws: WebSocket): void {
  (ws.send as unknown as {mockClear: () => void}).mockClear();
}

function getLastUpdate(ws: WebSocket): UpdateMessage | null {
  const calls = (ws.send as unknown as {mock: {calls: Array<[Uint8Array]>}}).mock.calls;
  for (let index = calls.length - 1; index >= 0; index -= 1) {
    const decoded = decodeServerMessage(calls[index]![0]);
    if (decoded.type === 'update') {
      return decoded;
    }
  }
  return null;
}

describe('Visibility streaming smoke', () => {
  it('streams only in-view dynamic entities to each player', () => {
    const session = new GameSession();
    const wsA = createMockWebSocket();
    const wsB = createMockWebSocket();
    const playerIdA = session.addPlayer(wsA);
    const playerIdB = session.addPlayer(wsB);

    const players = (session as any).players as Map<number, any>;
    const playerA = players.get(playerIdA);
    const playerB = players.get(playerIdB);
    setTankTile(playerA.tank, 10, 10);
    setTankTile(playerB.tank, 100, 100);

    const shells = (session as any).shells as Map<number, ServerShell>;
    const nearShell = new ServerShell(playerIdA, playerA.tank.x, playerA.tank.y, 0, 7);
    const farShell = new ServerShell(playerIdB, playerB.tank.x, playerB.tank.y, 0, 7);
    shells.set(nearShell.id, nearShell);
    shells.set(farShell.id, farShell);

    clearMessages(wsA);
    clearMessages(wsB);
    (session as any).broadcastState();

    const updateA = getLastUpdate(wsA);
    expect(updateA).not.toBeNull();
    expect((updateA?.tanks ?? []).map(tank => tank.id)).toContain(playerIdA);
    expect((updateA?.tanks ?? []).map(tank => tank.id)).not.toContain(playerIdB);
    expect((updateA?.builders ?? []).map(builder => builder.ownerTankId)).toContain(playerIdA);
    expect((updateA?.builders ?? []).map(builder => builder.ownerTankId)).not.toContain(playerIdB);
    expect((updateA?.shells ?? []).map(shell => shell.id)).toContain(nearShell.id);
    expect((updateA?.shells ?? []).map(shell => shell.id)).not.toContain(farShell.id);
  });

  it('does not leak removed ids for entities that were never visible', () => {
    const session = new GameSession();
    const wsA = createMockWebSocket();
    const wsB = createMockWebSocket();
    const playerIdA = session.addPlayer(wsA);
    const playerIdB = session.addPlayer(wsB);

    const players = (session as any).players as Map<number, any>;
    const playerA = players.get(playerIdA);
    const playerB = players.get(playerIdB);
    setTankTile(playerA.tank, 10, 10);
    setTankTile(playerB.tank, 180, 180);

    (session as any).broadcastState();
    clearMessages(wsA);

    const hiddenTankId = playerB.tank.id;
    const hiddenBuilderId = playerB.tank.builder.id;
    session.removePlayer(playerIdB);
    (session as any).broadcastState();

    const updateA = getLastUpdate(wsA);
    expect(updateA).not.toBeNull();
    expect(updateA?.removedTankIds ?? []).not.toContain(hiddenTankId);
    expect(updateA?.removedBuilderIds ?? []).not.toContain(hiddenBuilderId);
  });

  it('filters far terrain changes and emits +1 prefetch ring after movement', () => {
    const session = new GameSession();
    const ws = createMockWebSocket();
    const playerId = session.addPlayer(ws);
    const players = (session as any).players as Map<number, any>;
    const player = players.get(playerId);
    setTankTile(player.tank, 50, 50);

    (session as any).broadcastState();
    clearMessages(ws);

    const world = (session as any).world as {setTerrainAt: (x: number, y: number, terrain: TerrainType) => void};
    world.setTerrainAt(220, 220, TerrainType.CRATER);
    ((session as any).terrainChanges as Set<string>).add('220,220');
    (session as any).broadcastState();

    const farUpdate = getLastUpdate(ws);
    if (farUpdate) {
      expect((farUpdate.terrainUpdates ?? []).some(update => update.x === 220 && update.y === 220)).toBe(
        false
      );
    }

    clearMessages(ws);
    player.tank.x += TILE_SIZE_WORLD;
    (session as any).broadcastState();

    const movementUpdate = getLastUpdate(ws);
    expect(movementUpdate).not.toBeNull();
    expect((movementUpdate?.terrainUpdates ?? []).length).toBeGreaterThan(0);
    expect((movementUpdate?.terrainUpdates ?? []).every(update => update.x === 62)).toBe(true);
  });

  it('limits remote-view visibility to selected camera area', () => {
    const session = new GameSession();
    const wsA = createMockWebSocket();
    const wsB = createMockWebSocket();
    const wsC = createMockWebSocket();
    const playerIdA = session.addPlayer(wsA);
    const playerIdB = session.addPlayer(wsB);
    const playerIdC = session.addPlayer(wsC);

    const players = (session as any).players as Map<number, any>;
    const playerA = players.get(playerIdA);
    const playerB = players.get(playerIdB);
    const playerC = players.get(playerIdC);
    setTankTile(playerA.tank, 10, 10);
    setTankTile(playerB.tank, 100, 100);
    setTankTile(playerC.tank, 210, 210);

    const pillbox = Array.from(((session as any).pillboxes as Map<number, any>).values())[0];
    pillbox.ownerTeam = playerA.tank.team;
    pillbox.inTank = false;
    pillbox.tileX = 100;
    pillbox.tileY = 100;

    (session as any).broadcastState();
    clearMessages(wsA);

    session.handleRemoteView(playerIdA, pillbox.id);
    (session as any).broadcastState();

    const updateA = getLastUpdate(wsA);
    expect(updateA).not.toBeNull();
    expect((updateA?.tanks ?? []).map(tank => tank.id)).toContain(playerIdB);
    expect((updateA?.tanks ?? []).map(tank => tank.id)).not.toContain(playerIdC);
  });
});
