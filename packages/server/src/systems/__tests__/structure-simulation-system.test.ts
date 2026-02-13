import {describe, expect, it} from 'vitest';
import {ServerBase} from '../../simulation/base.js';
import {ServerPillbox} from '../../simulation/pillbox.js';
import {ServerTank} from '../../simulation/tank.js';
import {StructureSimulationSystem} from '../structure-simulation-system.js';

describe('StructureSimulationSystem', () => {
  it('should capture neutral bases on contact and refuel friendly tank', () => {
    const system = new StructureSimulationSystem();
    const base = new ServerBase(50, 50, 255);
    base.shells = 5;
    const tank = new ServerTank(1, 3, 50, 50);
    tank.shells = 0;

    const captures: Array<{
      baseId: number;
      previousOwnerTeam: number;
      newOwnerTeam: number;
      capturingTankId: number;
    }> = [];

    system.updateStructures(
      {
        world: {
          isTankConcealedInForest: () => false,
        },
        players: [{tank}],
        pillboxes: [],
        bases: [base],
      },
      {
        areTeamsAllied: () => false,
        spawnShellFromPillbox: () => {},
        onBaseCaptured: event => captures.push(event),
      }
    );

    expect(base.ownerTeam).toBe(tank.team);
    expect(tank.shells).toBeGreaterThan(0);
    expect(captures).toEqual([{
      baseId: base.id,
      previousOwnerTeam: 255,
      newOwnerTeam: tank.team,
      capturingTankId: tank.id,
    }]);
  });

  it('should emit steal capture events when destroyed enemy bases are recaptured', () => {
    const system = new StructureSimulationSystem();
    const base = new ServerBase(50, 50, 3);
    base.armor = 0;
    const tank = new ServerTank(1, 7, 50, 50);
    const captures: Array<{
      baseId: number;
      previousOwnerTeam: number;
      newOwnerTeam: number;
      capturingTankId: number;
    }> = [];

    system.updateStructures(
      {
        world: {
          isTankConcealedInForest: () => false,
        },
        players: [{tank}],
        pillboxes: [],
        bases: [base],
      },
      {
        areTeamsAllied: () => false,
        spawnShellFromPillbox: () => {},
        onBaseCaptured: event => captures.push(event),
      }
    );

    expect(base.ownerTeam).toBe(7);
    expect(captures).toEqual([{
      baseId: base.id,
      previousOwnerTeam: 3,
      newOwnerTeam: 7,
      capturingTankId: 1,
    }]);
  });

  it('should fire pillbox shells at enemy tanks when target acquired', () => {
    const system = new StructureSimulationSystem();
    const pillbox = new ServerPillbox(40, 40, 1);
    const enemyTank = new ServerTank(2, 2, 40, 41);
    const fired: Array<{pillboxId: number; x: number; y: number; direction: number}> = [];

    // First call acquires target (pillbox shoot returns false on first lock).
    (pillbox as any).reload = (pillbox as any).speed;
    system.updateStructures(
      {
        world: {
          isTankConcealedInForest: () => false,
        },
        players: [{tank: enemyTank}],
        pillboxes: [pillbox],
        bases: [],
      },
      {
        areTeamsAllied: () => false,
        spawnShellFromPillbox: (pillboxId, x, y, direction) =>
          fired.push({pillboxId, x, y, direction}),
      }
    );

    // Second call with full reload should produce a fired shell.
    (pillbox as any).reload = (pillbox as any).speed;
    system.updateStructures(
      {
        world: {
          isTankConcealedInForest: () => false,
        },
        players: [{tank: enemyTank}],
        pillboxes: [pillbox],
        bases: [],
      },
      {
        areTeamsAllied: () => false,
        spawnShellFromPillbox: (pillboxId, x, y, direction) =>
          fired.push({pillboxId, x, y, direction}),
      }
    );

    expect(fired.length).toBe(1);
    expect(fired[0]?.pillboxId).toBe(pillbox.id);
    expect(typeof fired[0]?.direction).toBe('number');
  });

  it('should allow later pillboxes to target players when players iterable is single-use', () => {
    const system = new StructureSimulationSystem();
    const outOfRangePillbox = new ServerPillbox(10, 10, 1);
    const inRangePillbox = new ServerPillbox(40, 40, 1);
    const enemyTank = new ServerTank(2, 2, 40, 41);
    const fired: Array<{pillboxId: number; x: number; y: number; direction: number}> = [];

    // Prime both pillboxes to be ready, then acquire targets.
    (outOfRangePillbox as any).reload = (outOfRangePillbox as any).speed;
    (inRangePillbox as any).reload = (inRangePillbox as any).speed;

    const playersIterableFactory = () => new Map<number, {tank: ServerTank}>([[enemyTank.id, {tank: enemyTank}]]);

    system.updateStructures(
      {
        world: {
          isTankConcealedInForest: () => false,
        },
        players: playersIterableFactory().values(),
        pillboxes: [outOfRangePillbox, inRangePillbox],
        bases: [],
      },
      {
        areTeamsAllied: () => false,
        spawnShellFromPillbox: (pillboxId, x, y, direction) =>
          fired.push({pillboxId, x, y, direction}),
      }
    );

    // Second tick should produce exactly one shot from the in-range pillbox.
    (outOfRangePillbox as any).reload = (outOfRangePillbox as any).speed;
    (inRangePillbox as any).reload = (inRangePillbox as any).speed;
    system.updateStructures(
      {
        world: {
          isTankConcealedInForest: () => false,
        },
        players: playersIterableFactory().values(),
        pillboxes: [outOfRangePillbox, inRangePillbox],
        bases: [],
      },
      {
        areTeamsAllied: () => false,
        spawnShellFromPillbox: (pillboxId, x, y, direction) =>
          fired.push({pillboxId, x, y, direction}),
      }
    );

    expect(fired.length).toBe(1);
    expect(fired[0]?.pillboxId).toBe(inRangePillbox.id);
  });
});
