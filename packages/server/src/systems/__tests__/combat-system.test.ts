import {describe, it, expect} from 'vitest';
import {
  SOUND_HIT_TANK,
  SOUND_SHOT_TREE,
  SOUND_TANK_SINKING,
  TerrainType,
} from '@jsbolo/shared';
import {ServerTank} from '../../simulation/tank.js';
import {ServerWorld} from '../../simulation/world.js';
import {CombatSystem} from '../combat-system.js';

describe('CombatSystem', () => {
  it('should damage and respawn-schedule destroyed tanks on shell hit', () => {
    const system = new CombatSystem();
    const world = new ServerWorld();
    world.setTerrainAt(50, 50, TerrainType.ROAD);
    const attacker = new ServerTank(1, 0, 50, 50);
    const victim = new ServerTank(2, 1, 50, 50);
    victim.armor = 1;

    const shells = new Map<number, any>();
    shells.set(1, {
      id: 1,
      x: victim.x,
      y: victim.y,
      direction: 0,
      ownerTankId: attacker.id,
      alive: true,
      shouldExplode: false,
      update() {},
      getTilePosition: () => ({x: 50, y: 50}),
      killByCollision() {
        this.alive = false;
      },
    });

    const sounds: number[] = [];
    const respawns: number[] = [];

    system.updateShells(
      shells,
      {
        world,
        players: [{tank: attacker}, {tank: victim}],
        getPlayerByTankId: (id) =>
          id === attacker.id ? {tank: attacker} : id === victim.id ? {tank: victim} : undefined,
        pillboxes: [],
        bases: [],
      },
      {
        areTeamsAllied: () => false,
        emitSound: (soundId) => sounds.push(soundId),
        scheduleTankRespawn: (tankId) => respawns.push(tankId),
        onTerrainChanged: () => {},
        onForestDestroyed: () => {},
      }
    );

    expect(victim.isDead()).toBe(true);
    expect(respawns).toEqual([victim.id]);
    expect(sounds).toContain(SOUND_HIT_TANK);
    expect(sounds).toContain(SOUND_TANK_SINKING);
    expect(shells.size).toBe(0);
  });

  it('should track forest regrowth when shell collides with forest terrain', () => {
    const system = new CombatSystem();
    const world = new ServerWorld();
    world.setTerrainAt(60, 60, TerrainType.FOREST);

    const shells = new Map<number, any>();
    shells.set(2, {
      id: 2,
      x: (60 + 0.5) * 256,
      y: (60 + 0.5) * 256,
      direction: 0,
      ownerTankId: 999,
      alive: true,
      shouldExplode: false,
      update() {},
      getTilePosition: () => ({x: 60, y: 60}),
      killByCollision() {
        this.alive = false;
      },
    });

    const changedTiles: string[] = [];
    const regrowthTiles: string[] = [];
    const sounds: number[] = [];

    system.updateShells(
      shells,
      {
        world,
        players: [],
        getPlayerByTankId: () => undefined,
        pillboxes: [],
        bases: [],
      },
      {
        areTeamsAllied: () => false,
        emitSound: (soundId) => sounds.push(soundId),
        scheduleTankRespawn: () => {},
        onTerrainChanged: (x, y) => changedTiles.push(`${x},${y}`),
        onForestDestroyed: (x, y) => regrowthTiles.push(`${x},${y}`),
      }
    );

    expect(changedTiles).toContain('60,60');
    expect(regrowthTiles).toContain('60,60');
    expect(sounds).toContain(SOUND_SHOT_TREE);
    expect(shells.size).toBe(0);
  });
});
