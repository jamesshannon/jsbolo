import {describe, expect, it} from 'vitest';
import {RangeAdjustment} from '@shared';
import {toNetworkInput} from '../game/input-mapping.js';

describe('toNetworkInput', () => {
  it('should map right turn input to clockwise rotation on server', () => {
    const networkInput = toNetworkInput(
      {
        accelerating: false,
        braking: false,
        turningLeft: false,
        turningRight: true,
        shooting: false,
        increaseRange: false,
        decreaseRange: false,
      },
      42
    );

    expect(networkInput.turningClockwise).toBe(false);
    expect(networkInput.turningCounterClockwise).toBe(true);
  });

  it('should set range adjustment flags', () => {
    const increaseInput = toNetworkInput(
      {
        accelerating: false,
        braking: false,
        turningLeft: false,
        turningRight: false,
        shooting: false,
        increaseRange: true,
        decreaseRange: false,
      },
      1
    );

    const decreaseInput = toNetworkInput(
      {
        accelerating: false,
        braking: false,
        turningLeft: false,
        turningRight: false,
        shooting: false,
        increaseRange: false,
        decreaseRange: true,
      },
      2
    );

    expect(increaseInput.rangeAdjustment).toBe(RangeAdjustment.INCREASE);
    expect(decreaseInput.rangeAdjustment).toBe(RangeAdjustment.DECREASE);
  });
});
