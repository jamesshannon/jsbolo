import {describe, it, expect, vi} from 'vitest';
import {KeyboardInput} from '../input/keyboard.js';
import {BuilderInput} from '../input/builder-input.js';
import {BuildAction} from '@shared';
import {DebugOverlay} from '../debug/debug-overlay.js';

class MockCamera {
  screenToWorld(screenX: number, screenY: number): {x: number; y: number} {
    return {x: screenX, y: screenY};
  }
}

function createMockCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  return canvas;
}

describe('Lifecycle Cleanup', () => {
  it('should stop keyboard input updates after destroy', () => {
    const input = new KeyboardInput();

    window.dispatchEvent(new KeyboardEvent('keydown', {code: 'KeyQ'}));
    window.dispatchEvent(new KeyboardEvent('keyup', {code: 'KeyQ'}));
    expect(input.getState().accelerating).toBe(false);

    input.destroy();

    window.dispatchEvent(new KeyboardEvent('keydown', {code: 'KeyQ'}));
    expect(input.getState().accelerating).toBe(false);
  });

  it('should stop builder keyboard and click handlers after destroy', () => {
    const canvas = createMockCanvas();
    const builderInput = new BuilderInput(canvas, new MockCamera() as any);
    const handler = vi.fn();
    builderInput.setBuildCommandHandler(handler);

    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'p'}));
    expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);

    builderInput.destroy();

    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'r'}));
    expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);

    canvas.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      width: 800,
      height: 600,
      right: 800,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
    canvas.dispatchEvent(new MouseEvent('click', {clientX: 100, clientY: 100}));
    expect(handler).not.toHaveBeenCalled();
  });

  it('should remove debug overlay keyboard listener on destroy', () => {
    const overlay = new DebugOverlay();
    const toggleSpy = vi.spyOn(overlay, 'toggle');

    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'F3'}));
    expect(toggleSpy).toHaveBeenCalledTimes(1);

    overlay.destroy();
    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'F3'}));
    expect(toggleSpy).toHaveBeenCalledTimes(1);
  });
});
