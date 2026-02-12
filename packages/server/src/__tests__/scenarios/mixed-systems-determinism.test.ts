import {describe, expect, it} from 'vitest';
import {BuildAction, TerrainType} from '@jsbolo/shared';
import {GameSession} from '../../game-session.js';
import {
  createDefaultInput,
  createMockWebSocket,
  getBases,
  getPlayer,
  getShells,
  getWorld,
  placeTankAtTile,
  setTerrain,
  tickSession,
} from '../bolo-spec/helpers';

function runMixedSystemsSignature(): string[] {
  const session = new GameSession();
  const playerId = session.addPlayer(createMockWebSocket());
  const player = getPlayer(session, playerId);
  const world = getWorld(session);
  const shells = getShells(session);
  const bases = getBases(session);

  const tank = player.tank;
  const builder = tank.builder;
  const base = Array.from(bases.values())[0];
  if (!base) {
    throw new Error('Expected at least one base in session');
  }

  // Establish deterministic terrain and structure setup.
  setTerrain(world, 50, 50, TerrainType.FOREST);
  setTerrain(world, 52, 50, TerrainType.FOREST);
  setTerrain(world, 53, 50, TerrainType.FOREST);
  placeTankAtTile(tank, 50, 50);
  base.tileX = 50;
  base.tileY = 50;
  base.ownerTeam = 255; // neutral

  // Queue one-shot builder command through regular input path.
  session.handlePlayerInput(playerId, {
    ...createDefaultInput({sequence: 10, tick: 1}),
    buildOrder: {
      action: BuildAction.FOREST,
      targetX: 50,
      targetY: 50,
    },
  });
  // Keep builder start position anchored to tank so first dispatch does not
  // include unrelated long-travel timing from default constructor origin (0,0).
  builder.x = tank.x;
  builder.y = tank.y;
  builder.targetX = tank.x;
  builder.targetY = tank.y;

  // Pre-seed a shell that collides with forest in combat-system pass.
  shells.set(9001, {
    id: 9001,
    x: (53.5) * 256,
    y: (50.5) * 256,
    direction: 0,
    ownerTankId: 999,
    alive: true,
    shouldExplode: false,
    update() {},
    getTilePosition: () => ({x: 53, y: 50}),
    killByCollision() {
      this.alive = false;
    },
  } as any);

  const signature: string[] = [];
  for (let i = 0; i < 40; i++) {
    tickSession(session, 1);
    const tick = (session as any).tick;
    const baseOwner = base.ownerTeam;
    const forestA = world.getTerrainAt(52, 50);
    const forestB = world.getTerrainAt(53, 50);
    signature.push(
      [
        tick,
        baseOwner,
        forestA,
        forestB,
        tank.trees,
        builder.order,
        shells.size,
      ].join('|')
    );
  }

  return signature;
}

describe('Mixed Systems Determinism', () => {
  it('should produce identical multi-system history for identical setup', () => {
    const runA = runMixedSystemsSignature();
    const runB = runMixedSystemsSignature();

    expect(runA).toEqual(runB);
    const final = runA[runA.length - 1]!;
    const [, baseOwner, , , trees, , shellCount] = final.split('|').map(Number);
    // Expected stable outcomes:
    // - base captured by player team (0 for first player)
    // - builder harvested at least one tree on schedule
    // - combat shell was consumed by terrain collision
    expect(baseOwner).toBe(0);
    expect(trees).toBeGreaterThan(0);
    expect(shellCount).toBe(0);
  });
});
