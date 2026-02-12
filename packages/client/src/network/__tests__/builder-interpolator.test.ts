import {describe, expect, it} from 'vitest';
import type {Builder} from '@shared';
import {BuilderInterpolator} from '../builder-interpolator.js';

function createBuilder(id: number, x: number, y: number): Builder {
  return {
    id,
    ownerTankId: 1,
    x,
    y,
    targetX: x,
    targetY: y,
    order: 1,
    trees: 0,
    hasMine: false,
    team: 0,
  };
}

describe('BuilderInterpolator', () => {
  it('should interpolate builder position between snapshots', () => {
    const interpolator = new BuilderInterpolator(100);
    interpolator.pushSnapshot(createBuilder(1, 100, 100), 10, 1000);
    interpolator.pushSnapshot(createBuilder(1, 200, 100), 11, 1100);

    const result = interpolator.getInterpolatedBuilder(1, 1150);
    expect(result?.x).toBeCloseTo(150);
    expect(result?.y).toBeCloseTo(100);
  });

  it('should ignore out-of-order builder snapshots', () => {
    const interpolator = new BuilderInterpolator(100);
    interpolator.pushSnapshot(createBuilder(1, 100, 100), 10, 1000);
    interpolator.pushSnapshot(createBuilder(1, 200, 100), 12, 1200);
    interpolator.pushSnapshot(createBuilder(1, 150, 100), 11, 1300);

    const result = interpolator.getInterpolatedBuilder(1, 1400);
    expect(result?.x).toBe(200);
  });

  it('should remove builder snapshots when entity is removed', () => {
    const interpolator = new BuilderInterpolator(100);
    interpolator.pushSnapshot(createBuilder(1, 100, 100), 10, 1000);

    expect(interpolator.getInterpolatedBuilder(1, 1100)).toBeDefined();
    interpolator.removeBuilder(1);
    expect(interpolator.getInterpolatedBuilder(1, 1100)).toBeUndefined();
  });
});
