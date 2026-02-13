import {describe, expect, it} from 'vitest';
import {
  BuilderOrder,
  PILLBOX_MAX_ARMOR,
  SOUND_MAN_BUILDING,
  TerrainType,
} from '@jsbolo/shared';
import {ServerPillbox} from '../../simulation/pillbox.js';
import {ServerTank} from '../../simulation/tank.js';
import {BuilderSystem} from '../builder-system.js';

describe('BuilderSystem', () => {
  it('should place a carried pillbox and recall the builder', () => {
    const system = new BuilderSystem();
    const tank = new ServerTank(1, 0, 50, 50);
    const carried = new ServerPillbox(10, 10, 255);
    carried.inTank = true;
    tank.carriedPillbox = carried;

    const builder = tank.builder;
    builder.order = BuilderOrder.PLACING_PILLBOX;
    builder.hasPillbox = true;
    builder.x = (52 + 0.5) * 256;
    builder.y = (50 + 0.5) * 256;
    builder.targetX = builder.x;
    builder.targetY = builder.y;

    const sounds: number[] = [];

    system.update(
      tank,
      10,
      {
        world: {
          getTerrainAt: () => TerrainType.GRASS,
          setTerrainAt: () => {},
          hasMineAt: () => false,
        },
        pillboxes: [],
      },
      {
        emitSound: (soundId) => sounds.push(soundId),
        onTerrainChanged: () => {},
        onTrackForestRegrowth: () => {},
        onPlaceMine: () => false,
        onCreatePillbox: () => {},
      }
    );

    expect(tank.carriedPillbox).toBeNull();
    expect(carried.inTank).toBe(false);
    expect(carried.tileX).toBe(52);
    expect(carried.tileY).toBe(50);
    expect(builder.hasPillbox).toBe(false);
    expect(builder.order).toBe(BuilderOrder.RETURNING);
    expect(sounds).toContain(SOUND_MAN_BUILDING);
  });

  it('should recall the builder when placement terrain is invalid', () => {
    const system = new BuilderSystem();
    const tank = new ServerTank(1, 0, 50, 50);
    const carried = new ServerPillbox(10, 10, 255);
    carried.inTank = true;
    tank.carriedPillbox = carried;

    const builder = tank.builder;
    builder.order = BuilderOrder.PLACING_PILLBOX;
    builder.hasPillbox = true;
    builder.x = (52 + 0.5) * 256;
    builder.y = (50 + 0.5) * 256;
    builder.targetX = builder.x;
    builder.targetY = builder.y;

    const rejections: Array<{tankId: number; text: string}> = [];

    system.update(
      tank,
      10,
      {
        world: {
          getTerrainAt: () => TerrainType.FOREST,
          setTerrainAt: () => {},
          hasMineAt: () => false,
        },
        pillboxes: [],
      },
      {
        emitSound: () => {},
        onTerrainChanged: () => {},
        onTrackForestRegrowth: () => {},
        onPlaceMine: () => false,
        onCreatePillbox: () => {},
        onActionRejected: event => rejections.push(event),
      }
    );

    expect(builder.order).toBe(BuilderOrder.RETURNING);
    expect(builder.hasPillbox).toBe(true);
    expect(tank.carriedPillbox?.id).toBe(carried.id);
    expect(rejections).toEqual([{
      tankId: tank.id,
      text: 'Builder action failed: cannot place pillbox here.',
    }]);
  });

  it('should repair an existing pillbox when using pillbox mode', () => {
    const system = new BuilderSystem();
    const tank = new ServerTank(1, 0, 50, 50);
    const builder = tank.builder;
    builder.order = BuilderOrder.PLACING_PILLBOX;
    builder.trees = 1;
    builder.x = (52 + 0.5) * 256;
    builder.y = (50 + 0.5) * 256;
    builder.targetX = builder.x;
    builder.targetY = builder.y;

    const damaged = new ServerPillbox(52, 50, 2);
    damaged.armor = 6;

    system.update(
      tank,
      10,
      {
        world: {
          getTerrainAt: () => TerrainType.GRASS,
          setTerrainAt: () => {},
          hasMineAt: () => false,
        },
        pillboxes: [damaged],
      },
      {
        emitSound: () => {},
        onTerrainChanged: () => {},
        onTrackForestRegrowth: () => {},
        onPlaceMine: () => false,
        onCreatePillbox: () => {
          throw new Error('should not create a new pillbox while repairing');
        },
      }
    );

    expect(damaged.armor).toBe(PILLBOX_MAX_ARMOR);
    expect(builder.order).toBe(BuilderOrder.RETURNING);
  });

  it('should reject new pillbox build in pillbox mode when trees are insufficient', () => {
    const system = new BuilderSystem();
    const tank = new ServerTank(1, 0, 50, 50);
    const builder = tank.builder;
    builder.order = BuilderOrder.PLACING_PILLBOX;
    builder.trees = 0;
    builder.x = (52 + 0.5) * 256;
    builder.y = (50 + 0.5) * 256;
    builder.targetX = builder.x;
    builder.targetY = builder.y;

    const rejections: Array<{tankId: number; text: string}> = [];

    system.update(
      tank,
      10,
      {
        world: {
          getTerrainAt: () => TerrainType.GRASS,
          setTerrainAt: () => {},
          hasMineAt: () => false,
        },
        pillboxes: [],
      },
      {
        emitSound: () => {},
        onTerrainChanged: () => {},
        onTrackForestRegrowth: () => {},
        onPlaceMine: () => false,
        onCreatePillbox: () => {},
        onActionRejected: event => rejections.push(event),
      }
    );

    expect(builder.order).toBe(BuilderOrder.RETURNING);
    expect(rejections).toEqual([{
      tankId: tank.id,
      text: 'Builder action failed: not enough trees to build pillbox.',
    }]);
  });
});
