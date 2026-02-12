import {describe, expect, it} from 'vitest';
import {TerrainType} from '@jsbolo/shared';
import {ServerPillbox} from '../../simulation/pillbox.js';
import {ServerTank} from '../../simulation/tank.js';
import {PlayerSimulationSystem} from '../player-simulation-system.js';

describe('PlayerSimulationSystem', () => {
  it('should attempt respawn for dead tanks and skip active simulation', () => {
    const system = new PlayerSimulationSystem();
    const tank = new ServerTank(1, 0, 50, 50);
    tank.armor = 0;

    const player = {
      id: 1,
      tank,
      lastInput: {
        sequence: 1,
        tick: 1,
        accelerating: true,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: true,
        rangeAdjustment: 0,
      },
    };

    let triedRespawn = 0;
    let spawnedShells = 0;

    system.updatePlayers(
      10,
      {
        world: {
          getTankSpeedAtPosition: () => 1,
          isPassable: () => true,
          getTerrainAt: () => TerrainType.GRASS,
          setTerrainAt: () => {},
          hasMineAt: () => false,
          triggerMineExplosion: () => ({explodedMines: [], affectedTiles: []}),
        },
        players: [player],
        pillboxes: [],
      },
      {
        tryRespawn: () => {
          triedRespawn++;
        },
        emitSound: () => {},
        onTerrainChanged: () => {},
        onForestDestroyed: () => {},
        scheduleTankRespawn: () => {},
        onMineExploded: () => {},
        spawnShell: () => {
          spawnedShells++;
        },
        updateBuilder: () => {},
      }
    );

    expect(triedRespawn).toBe(1);
    expect(spawnedShells).toBe(0);
  });

  it('should pick up disabled pillbox on same tile for alive tank', () => {
    const system = new PlayerSimulationSystem();
    const tank = new ServerTank(1, 0, 100, 100);
    const player = {
      id: 1,
      tank,
      lastInput: {
        sequence: 1,
        tick: 1,
        accelerating: false,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: 0,
      },
    };

    const pillbox = new ServerPillbox(100, 100, 255);
    pillbox.armor = 0;

    system.updatePlayers(
      10,
      {
        world: {
          getTankSpeedAtPosition: () => 1,
          isPassable: () => true,
          getTerrainAt: () => TerrainType.GRASS,
          setTerrainAt: () => {},
          hasMineAt: () => false,
          triggerMineExplosion: () => ({explodedMines: [], affectedTiles: []}),
        },
        players: [player],
        pillboxes: [pillbox],
      },
      {
        tryRespawn: () => {},
        emitSound: () => {},
        onTerrainChanged: () => {},
        onForestDestroyed: () => {},
        scheduleTankRespawn: () => {},
        onMineExploded: () => {},
        spawnShell: () => {},
        updateBuilder: () => {},
      }
    );

    expect(tank.carriedPillbox?.id).toBe(pillbox.id);
    expect(pillbox.inTank).toBe(true);
    expect(pillbox.ownerTeam).toBe(tank.team);
  });
});
