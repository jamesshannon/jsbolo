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
      }
    );

    expect(base.ownerTeam).toBe(tank.team);
    expect(tank.shells).toBeGreaterThan(0);
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
});
