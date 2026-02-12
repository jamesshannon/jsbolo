import {describe, it, expect} from 'vitest';
import {TankInterpolator} from '../tank-interpolator.js';
import type {Tank} from '@shared';

function createTank(id: number, x: number, y: number, direction = 0): Tank {
  return {
    id,
    x,
    y,
    direction,
    speed: 0,
    armor: 40,
    shells: 40,
    mines: 0,
    trees: 0,
    team: 0,
    onBoat: false,
    reload: 0,
    firingRange: 7,
  };
}

describe('TankInterpolator', () => {
  it('should return current snapshot when no previous snapshot exists', () => {
    const interpolator = new TankInterpolator(100);
    interpolator.pushSnapshot(createTank(1, 100, 100), 10, 1000);

    const result = interpolator.getInterpolatedTank(1, 1100);
    expect(result?.x).toBe(100);
    expect(result?.y).toBe(100);
  });

  it('should interpolate tank position between snapshots', () => {
    const interpolator = new TankInterpolator(100);
    interpolator.pushSnapshot(createTank(1, 100, 100), 10, 1000);
    interpolator.pushSnapshot(createTank(1, 200, 100), 11, 1100);

    // targetTime = 1150 - 100 = 1050 => halfway between 1000 and 1100
    const result = interpolator.getInterpolatedTank(1, 1150);
    expect(result?.x).toBeCloseTo(150);
    expect(result?.y).toBeCloseTo(100);
  });

  it('should ignore out-of-order snapshots', () => {
    const interpolator = new TankInterpolator(100);
    interpolator.pushSnapshot(createTank(1, 100, 100), 10, 1000);
    interpolator.pushSnapshot(createTank(1, 200, 100), 12, 1200);
    interpolator.pushSnapshot(createTank(1, 150, 100), 11, 1300); // stale

    const result = interpolator.getInterpolatedTank(1, 1400);
    expect(result?.x).toBe(200);
  });

  it('should interpolate direction across 0/255 wrap using shortest path', () => {
    const interpolator = new TankInterpolator(100);
    interpolator.pushSnapshot(createTank(1, 0, 0, 250), 10, 1000);
    interpolator.pushSnapshot(createTank(1, 0, 0, 10), 11, 1100);

    const result = interpolator.getInterpolatedTank(1, 1150);
    expect(result?.direction).toBeCloseTo(2);
  });
});
