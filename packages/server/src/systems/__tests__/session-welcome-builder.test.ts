import {TerrainType} from '@jsbolo/shared';
import {describe, expect, it} from 'vitest';
import {ServerBase} from '../../simulation/base.js';
import {ServerPillbox} from '../../simulation/pillbox.js';
import {ServerTank} from '../../simulation/tank.js';
import {ServerWorld} from '../../simulation/world.js';
import {SessionWelcomeBuilder} from '../session-welcome-builder.js';

describe('SessionWelcomeBuilder', () => {
  it('should build a complete welcome snapshot with map and entity state', () => {
    const world = new ServerWorld();
    world.setTerrainAt(3, 4, TerrainType.ROAD);

    const tank = new ServerTank(1, 2, 10, 11);
    tank.speed = 6;
    tank.onBoat = true;

    const pillbox = new ServerPillbox(20, 21, 3);
    pillbox.armor = 123;

    const base = new ServerBase(30, 31, 4);
    base.shells = 5;
    base.mines = 6;

    const builder = new SessionWelcomeBuilder(() => {});
    const welcome = builder.buildWelcome({
      playerId: 10,
      assignedTeam: 2,
      currentTick: 55,
      world,
      players: [{tank}],
      pillboxes: [pillbox],
      bases: [base],
      matchEnded: false,
      winningTeams: [],
    });

    expect(welcome.type).toBe('welcome');
    expect(welcome.playerId).toBe(10);
    expect(welcome.assignedTeam).toBe(2);
    expect(welcome.currentTick).toBe(55);
    expect(welcome.map.width).toBe(256);
    expect(welcome.map.height).toBe(256);
    expect(welcome.map.terrain).toHaveLength(256 * 256);
    expect(welcome.map.terrainLife).toHaveLength(256 * 256);

    const changedCellIndex = 4 * welcome.map.width + 3;
    expect(welcome.map.terrain[changedCellIndex]).toBe(TerrainType.ROAD);
    expect(welcome.map.terrainLife[changedCellIndex]).toBe(
      world.getMapData()[4]![3]!.terrainLife
    );

    expect(welcome.tanks).toHaveLength(1);
    expect(welcome.tanks[0]).toMatchObject({
      id: tank.id,
      team: tank.team,
      allianceId: tank.team,
      speed: tank.speed,
      onBoat: true,
      carriedPillbox: null,
    });

    expect(welcome.pillboxes).toHaveLength(1);
    expect(welcome.pillboxes[0]).toMatchObject({
      id: pillbox.id,
      tileX: pillbox.tileX,
      tileY: pillbox.tileY,
      armor: 123,
      ownerTeam: pillbox.ownerTeam,
    });

    expect(welcome.bases).toHaveLength(1);
    expect(welcome.bases[0]).toMatchObject({
      id: base.id,
      tileX: base.tileX,
      tileY: base.tileY,
      shells: 5,
      mines: 6,
      ownerTeam: base.ownerTeam,
    });

    expect(welcome.matchEnded).toBeUndefined();
    expect(welcome.winningTeams).toBeUndefined();
  });

  it('should include alliance snapshots when provided by session context', () => {
    const world = new ServerWorld();
    const tank = new ServerTank(1, 0, 50, 50);
    const builder = new SessionWelcomeBuilder(() => {});

    const welcome = builder.buildWelcome({
      playerId: 1,
      assignedTeam: 0,
      currentTick: 99,
      world,
      players: [{tank}],
      pillboxes: [],
      bases: [],
      matchEnded: false,
      winningTeams: [],
      getAllianceSnapshots: () => [{allianceId: 0, alliedAllianceIds: [1]}],
    });

    expect(welcome.alliances).toEqual([{allianceId: 0, alliedAllianceIds: [1]}]);
  });

  it('should include match end fields when match has already ended', () => {
    const world = new ServerWorld();
    const tank = new ServerTank(1, 0, 50, 50);
    const builder = new SessionWelcomeBuilder(() => {});

    const welcome = builder.buildWelcome({
      playerId: 1,
      assignedTeam: 0,
      currentTick: 99,
      world,
      players: [{tank}],
      pillboxes: [],
      bases: [],
      matchEnded: true,
      winningTeams: [0, 3],
    });

    expect(welcome.matchEnded).toBe(true);
    expect(welcome.winningTeams).toEqual([0, 3]);
  });
});
