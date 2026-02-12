import {describe, expect, it} from 'vitest';
import {
  BuilderOrder,
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
      }
    );

    expect(builder.order).toBe(BuilderOrder.RETURNING);
    expect(builder.hasPillbox).toBe(true);
    expect(tank.carriedPillbox?.id).toBe(carried.id);
  });
});
