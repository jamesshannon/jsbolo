import {describe, it, expect} from 'vitest';
import {
  SOUND_HIT_TANK,
  SOUND_MAN_DYING,
  SOUND_SHOT_TREE,
  SOUND_TANK_SINKING,
  BuilderOrder,
  TerrainType,
} from '@jsbolo/shared';
import {ServerTank} from '../../simulation/tank.js';
import {ServerWorld} from '../../simulation/world.js';
import {ServerPillbox} from '../../simulation/pillbox.js';
import {ServerBase} from '../../simulation/base.js';
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

  it('should schedule one respawn when multiple same-tick shells overlap a tank', () => {
    const system = new CombatSystem();
    const world = new ServerWorld();
    world.setTerrainAt(70, 70, TerrainType.ROAD);
    const attackerA = new ServerTank(10, 0, 20, 20);
    const attackerB = new ServerTank(11, 2, 25, 25);
    const victim = new ServerTank(12, 1, 70, 70);
    victim.armor = 1;

    const shells = new Map<number, any>();
    // ASSUMPTION: both shells are processed during the same simulation tick.
    // Deterministic behavior should still produce a single death/respawn event.
    shells.set(101, {
      id: 101,
      x: victim.x,
      y: victim.y,
      direction: 0,
      ownerTankId: attackerA.id,
      alive: true,
      shouldExplode: false,
      update() {},
      getTilePosition: () => ({x: 70, y: 70}),
      killByCollision() {
        this.alive = false;
      },
    });
    shells.set(102, {
      id: 102,
      x: victim.x,
      y: victim.y,
      direction: 128,
      ownerTankId: attackerB.id,
      alive: true,
      shouldExplode: false,
      update() {},
      getTilePosition: () => ({x: 70, y: 70}),
      killByCollision() {
        this.alive = false;
      },
    });

    const respawns: number[] = [];
    const sinkingSounds: number[] = [];

    system.updateShells(
      shells,
      {
        world,
        players: [{tank: attackerA}, {tank: attackerB}, {tank: victim}],
        getPlayerByTankId: (id) => {
          if (id === attackerA.id) return {tank: attackerA};
          if (id === attackerB.id) return {tank: attackerB};
          if (id === victim.id) return {tank: victim};
          return undefined;
        },
        pillboxes: [],
        bases: [],
      },
      {
        areTeamsAllied: () => false,
        emitSound: (soundId) => {
          if (soundId === SOUND_TANK_SINKING) {
            sinkingSounds.push(soundId);
          }
        },
        scheduleTankRespawn: (tankId) => respawns.push(tankId),
        onTerrainChanged: () => {},
        onForestDestroyed: () => {},
      }
    );

    expect(victim.isDead()).toBe(true);
    expect(respawns).toEqual([victim.id]);
    expect(sinkingSounds).toHaveLength(1);
    // Only the lethal shell is consumed; once the victim is dead, the other
    // same-tick shell no longer has a valid tank collision target.
    expect(shells.size).toBe(1);
    expect(Array.from(shells.values())[0]?.alive).toBe(true);
  });

  it('publishes builder-killed callback when shell hits an exposed builder', () => {
    const system = new CombatSystem();
    const world = new ServerWorld();
    world.setTerrainAt(80, 80, TerrainType.ROAD);

    const owner = new ServerTank(20, 1, 80, 80);
    owner.builder.order = BuilderOrder.PARACHUTING;
    owner.builder.x = owner.x + 256;
    owner.builder.y = owner.y;
    owner.builder.targetX = owner.builder.x;
    owner.builder.targetY = owner.builder.y;

    const shells = new Map<number, any>();
    shells.set(201, {
      id: 201,
      x: owner.builder.x,
      y: owner.builder.y,
      direction: 0,
      ownerTankId: 999,
      alive: true,
      shouldExplode: false,
      update() {},
      getTilePosition: () => ({x: 80, y: 80}),
      killByCollision() {
        this.alive = false;
      },
    });

    const sounds: number[] = [];
    const killedBuilders: number[] = [];

    system.updateShells(
      shells,
      {
        world,
        players: [{tank: owner}],
        getPlayerByTankId: () => undefined,
        pillboxes: [],
        bases: [],
      },
      {
        areTeamsAllied: () => false,
        emitSound: (soundId) => sounds.push(soundId),
        scheduleTankRespawn: () => {},
        onTerrainChanged: () => {},
        onForestDestroyed: () => {},
        onBuilderKilled: ownerTankId => killedBuilders.push(ownerTankId),
      }
    );

    expect(owner.builder.isDead()).toBe(true);
    expect(sounds).toContain(SOUND_MAN_DYING);
    expect(killedBuilders).toEqual([owner.id]);
  });

  it('should damage pillboxes without transferring ownership on shell hit', () => {
    const system = new CombatSystem();
    const world = new ServerWorld();
    world.setTerrainAt(50, 50, TerrainType.ROAD);

    const attacker = new ServerTank(30, 4, 50, 50);
    const pillbox = new ServerPillbox(50, 50, 9);
    const initialArmor = pillbox.armor;

    const shells = new Map<number, any>();
    shells.set(301, {
      id: 301,
      x: (50 + 0.5) * 256,
      y: (50 + 0.5) * 256,
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

    system.updateShells(
      shells,
      {
        world,
        players: [{tank: attacker}],
        getPlayerByTankId: () => ({tank: attacker}),
        pillboxes: [pillbox],
        bases: [],
      },
      {
        areTeamsAllied: () => false,
        emitSound: () => {},
        scheduleTankRespawn: () => {},
        onTerrainChanged: () => {},
        onForestDestroyed: () => {},
      }
    );

    expect(pillbox.armor).toBe(initialArmor - 1);
    expect(pillbox.ownerTeam).toBe(9);
  });

  it('should damage bases without transferring ownership on shell hit', () => {
    const system = new CombatSystem();
    const world = new ServerWorld();
    world.setTerrainAt(50, 50, TerrainType.ROAD);

    const attacker = new ServerTank(31, 4, 50, 50);
    const base = new ServerBase(50, 50, 7);
    const initialArmor = base.armor;

    const shells = new Map<number, any>();
    shells.set(302, {
      id: 302,
      x: (50 + 0.5) * 256,
      y: (50 + 0.5) * 256,
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

    system.updateShells(
      shells,
      {
        world,
        players: [{tank: attacker}],
        getPlayerByTankId: () => ({tank: attacker}),
        pillboxes: [],
        bases: [base],
      },
      {
        areTeamsAllied: () => false,
        emitSound: () => {},
        scheduleTankRespawn: () => {},
        onTerrainChanged: () => {},
        onForestDestroyed: () => {},
      }
    );

    expect(base.armor).toBe(initialArmor - 5);
    expect(base.ownerTeam).toBe(7);
  });
});
