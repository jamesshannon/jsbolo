import {describe, expect, it, vi} from 'vitest';
import {SessionWorldBootstrap} from '../session-world-bootstrap.js';

describe('SessionWorldBootstrap', () => {
  it('should use fallback structure spawns when map has no spawn metadata', () => {
    const bootstrap = new SessionWorldBootstrap(() => {});
    const result = bootstrap.initialize({
      getPillboxSpawns: () => [],
      getBaseSpawns: () => [],
    });

    expect(result.pillboxes.size).toBe(6);
    expect(result.bases.size).toBe(4);

    const pillboxTiles = new Set(
      Array.from(result.pillboxes.values()).map(p => `${p.tileX},${p.tileY}`)
    );
    const baseTiles = new Set(
      Array.from(result.bases.values()).map(b => `${b.tileX},${b.tileY}`)
    );

    expect(pillboxTiles.has('100,100')).toBe(true);
    expect(pillboxTiles.has('175,125')).toBe(true);
    expect(baseTiles.has('80,80')).toBe(true);
    expect(baseTiles.has('170,170')).toBe(true);
  });

  it('should prioritize map-provided structure spawns and preserve map state', () => {
    const log = vi.fn();
    const bootstrap = new SessionWorldBootstrap(log);
    const result = bootstrap.initialize({
      getPillboxSpawns: () => [
        {tileX: 11, tileY: 12, armor: 90, ownerTeam: 2, speed: 1},
      ],
      getBaseSpawns: () => [
        {tileX: 21, tileY: 22, armor: 70, shells: 6, mines: 3, ownerTeam: 5},
      ],
    });

    expect(result.pillboxes.size).toBe(1);
    expect(result.bases.size).toBe(1);

    const pillbox = Array.from(result.pillboxes.values())[0]!;
    expect(pillbox.tileX).toBe(11);
    expect(pillbox.tileY).toBe(12);
    expect(pillbox.armor).toBe(90);
    expect(pillbox.ownerTeam).toBe(2);
    // Map speed is clamped to the minimum supported fire interval (6 ticks).
    expect(pillbox.getAttackSpeed()).toBe(6);

    const base = Array.from(result.bases.values())[0]!;
    expect(base.tileX).toBe(21);
    expect(base.tileY).toBe(22);
    expect(base.armor).toBe(70);
    expect(base.shells).toBe(6);
    expect(base.mines).toBe(3);
    expect(base.ownerTeam).toBe(5);

    expect(log).toHaveBeenCalledWith('  Spawned 1 pillboxes from map');
    expect(log).toHaveBeenCalledWith('  Spawned 1 bases from map');
  });
});
