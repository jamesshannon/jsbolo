import {describe, it, expect} from 'vitest';
import {TerrainType} from '@jsbolo/shared';
import {ServerWorld} from '../../simulation/world.js';
import {TerrainEffectsSystem} from '../terrain-effects-system.js';

describe('TerrainEffectsSystem', () => {
  it('should flood craters adjacent to water every 10 ticks', () => {
    const world = new ServerWorld();
    const system = new TerrainEffectsSystem();

    world.setTerrainAt(50, 50, TerrainType.CRATER);
    world.setTerrainAt(49, 50, TerrainType.RIVER);

    const noFlood = system.update(9, world);
    expect(noFlood.terrainChanges).not.toContain('50,50');

    const flooded = system.update(10, world);
    expect(flooded.terrainChanges).toContain('50,50');
    expect(flooded.bubbleSoundPositions.length).toBeGreaterThan(0);
    expect(world.getTerrainAt(50, 50)).toBe(TerrainType.RIVER);
  });

  it('should regrow tracked grass/crater tiles back to forest', () => {
    const world = new ServerWorld();
    const system = new TerrainEffectsSystem();

    world.setTerrainAt(60, 60, TerrainType.GRASS);
    system.trackForestRegrowth('60,60');

    for (let tick = 1; tick <= 500; tick++) {
      system.update(tick, world);
    }

    expect(world.getTerrainAt(60, 60)).toBe(TerrainType.FOREST);
  });
});
