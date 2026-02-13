import {describe, expect, it} from 'vitest';
import {getRelationPalette} from '../color-palette.js';

describe('renderer color palette', () => {
  it('provides distinct hostile/friendly colors in default mode', () => {
    const palette = getRelationPalette('default');
    expect(palette.friendly).not.toBe(palette.hostile);
  });

  it('provides alternate hostile/friendly colors for colorblind mode', () => {
    const normal = getRelationPalette('default');
    const colorblind = getRelationPalette('colorblind');
    expect(colorblind.friendly).not.toBe(normal.friendly);
    expect(colorblind.hostile).not.toBe(normal.hostile);
  });
});
