import {RangeAdjustment, type PlayerInput} from '@shared';
import type {InputState} from '../input/keyboard.js';

export function toNetworkInput(
  inputState: Readonly<InputState>,
  tick: number
): Omit<PlayerInput, 'sequence'> {
  let rangeAdjustment = RangeAdjustment.NONE;
  if (inputState.increaseRange) {
    rangeAdjustment = RangeAdjustment.INCREASE;
  } else if (inputState.decreaseRange) {
    rangeAdjustment = RangeAdjustment.DECREASE;
  }

  return {
    tick,
    accelerating: inputState.accelerating,
    braking: inputState.braking,
    // NOTE: Server turn semantics are legacy-inverted relative to these names.
    // Map local "turn right" to the server flag that yields clockwise rotation.
    turningClockwise: inputState.turningLeft,
    turningCounterClockwise: inputState.turningRight,
    shooting: inputState.shooting,
    rangeAdjustment,
  };
}
