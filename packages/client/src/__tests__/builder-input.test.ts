/**
 * Builder input controls test
 * Tests keyboard bindings for builder commands
 */

import {describe, it, expect, beforeEach, vi} from 'vitest';
import {BuilderInput} from '../input/builder-input.js';
import {BuildAction} from '@shared';

// Mock Camera
class MockCamera {
  x = 0;
  y = 0;
  screenToWorld(screenX: number, screenY: number) {
    return {x: screenX + this.x, y: screenY + this.y};
  }
}

// Mock Canvas
function createMockCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  return canvas;
}

describe('BuilderInput Controls', () => {
  let builderInput: BuilderInput;
  let canvas: HTMLCanvasElement;
  let camera: MockCamera;

  beforeEach(() => {
    canvas = createMockCanvas();
    camera = new MockCamera();
    builderInput = new BuilderInput(canvas, camera as any);
  });

  describe('Keyboard Bindings', () => {
    it('should respond to T key for tree harvesting', () => {
      const event = new KeyboardEvent('keydown', {key: 't'});
      window.dispatchEvent(event);
      expect(builderInput.getPendingAction()).toBe(BuildAction.FOREST);
    });

    it('should respond to D key for road building', () => {
      const event = new KeyboardEvent('keydown', {key: 'd'});
      window.dispatchEvent(event);
      expect(builderInput.getPendingAction()).toBe(BuildAction.ROAD);
    });

    it('should respond to R key for pillbox mode alias', () => {
      const event = new KeyboardEvent('keydown', {key: 'r'});
      window.dispatchEvent(event);
      expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);
    });

    it('should respond to W key for wall building', () => {
      const event = new KeyboardEvent('keydown', {key: 'w'});
      window.dispatchEvent(event);
      expect(builderInput.getPendingAction()).toBe(BuildAction.BUILDING);
    });

    it('should respond to B key for boat building', () => {
      const event = new KeyboardEvent('keydown', {key: 'b'});
      window.dispatchEvent(event);
      expect(builderInput.getPendingAction()).toBe(BuildAction.BOAT);
    });

    it('should respond to P key for pillbox placement', () => {
      const event = new KeyboardEvent('keydown', {key: 'p'});
      window.dispatchEvent(event);
      expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);
    });

    it('should respond to M key for mine laying', () => {
      const event = new KeyboardEvent('keydown', {key: 'm'});
      window.dispatchEvent(event);
      expect(builderInput.getPendingAction()).toBe(BuildAction.MINE);
    });

    it('should respond to C key to recall builder', () => {
      // Set an action first
      window.dispatchEvent(new KeyboardEvent('keydown', {key: 't'}));
      expect(builderInput.getPendingAction()).toBe(BuildAction.FOREST);

      // Recall
      window.dispatchEvent(new KeyboardEvent('keydown', {key: 'c'}));
      expect(builderInput.getPendingAction()).toBe(BuildAction.NONE);
    });

    it('should respond to Escape key to recall builder', () => {
      // Set an action first
      window.dispatchEvent(new KeyboardEvent('keydown', {key: 'p'}));
      expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);

      // Recall
      window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
      expect(builderInput.getPendingAction()).toBe(BuildAction.NONE);
    });

    it('should handle uppercase keys', () => {
      window.dispatchEvent(new KeyboardEvent('keydown', {key: 'P'}));
      expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);

      window.dispatchEvent(new KeyboardEvent('keydown', {key: 'R'}));
      expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);
    });
  });

  describe('Programmatic Builder Controls', () => {
    it('should set pending action via setPendingAction', () => {
      builderInput.setPendingAction(BuildAction.BUILDING);
      expect(builderInput.getPendingAction()).toBe(BuildAction.BUILDING);
    });

    it('should clear pending action via recallBuilder', () => {
      builderInput.setPendingAction(BuildAction.MINE);
      expect(builderInput.getPendingAction()).toBe(BuildAction.MINE);

      builderInput.recallBuilder();
      expect(builderInput.getPendingAction()).toBe(BuildAction.NONE);
    });
  });

  describe('Build Command Callback', () => {
    it('should call handler with correct action and coordinates when clicking', () => {
      const handler = vi.fn();
      builderInput.setBuildCommandHandler(handler);

      // Set pillbox action
      window.dispatchEvent(new KeyboardEvent('keydown', {key: 'p'}));

      // Simulate click at canvas position (100, 100)
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

      const clickEvent = new MouseEvent('click', {
        clientX: 100,
        clientY: 100,
      });
      canvas.dispatchEvent(clickEvent);

      // Handler should be called with pillbox action and tile coordinates
      expect(handler).toHaveBeenCalledWith(
        BuildAction.PILLBOX,
        expect.any(Number),
        expect.any(Number)
      );
    });

    it('should keep action active after click (sticky mode)', () => {
      const handler = vi.fn();
      builderInput.setBuildCommandHandler(handler);

      // Set pillbox mode via R alias
      window.dispatchEvent(new KeyboardEvent('keydown', {key: 'r'}));
      expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);

      // Click
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

      // Action should STAY ACTIVE (sticky mode)
      expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);
    });

    it('should not call handler if no action is pending', () => {
      const handler = vi.fn();
      builderInput.setBuildCommandHandler(handler);

      // Click without setting an action
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
  });

  describe('Complete Builder Control Flow', () => {
    it('should support full pillbox placement workflow with sticky mode', () => {
      const handler = vi.fn();
      builderInput.setBuildCommandHandler(handler);

      // 1. Press P to select pillbox placement
      window.dispatchEvent(new KeyboardEvent('keydown', {key: 'p'}));
      expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);

      // 2. Click to place first pillbox
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

      canvas.dispatchEvent(new MouseEvent('click', {clientX: 200, clientY: 150}));

      // 3. Verify handler called and action STILL ACTIVE (sticky)
      expect(handler).toHaveBeenCalledWith(
        BuildAction.PILLBOX,
        expect.any(Number),
        expect.any(Number)
      );
      expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);

      // 4. Click again to place second pillbox (same mode)
      canvas.dispatchEvent(new MouseEvent('click', {clientX: 250, clientY: 200}));
      expect(handler).toHaveBeenCalledTimes(2);
      expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);
    });

    it('should support R-key alias into pillbox workflow with sticky mode', () => {
      const handler = vi.fn();
      builderInput.setBuildCommandHandler(handler);

      // 1. Press R to select pillbox mode
      window.dispatchEvent(new KeyboardEvent('keydown', {key: 'r'}));
      expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);

      // 2. Click to execute first pillbox command
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

      canvas.dispatchEvent(new MouseEvent('click', {clientX: 300, clientY: 200}));

      // 3. Verify handler called and action STILL ACTIVE
      expect(handler).toHaveBeenCalledWith(
        BuildAction.PILLBOX,
        expect.any(Number),
        expect.any(Number)
      );
      expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);

      // 4. Click again with the same sticky mode
      canvas.dispatchEvent(new MouseEvent('click', {clientX: 350, clientY: 250}));
      expect(handler).toHaveBeenCalledTimes(2);
      expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);
    });

    it('should allow changing modes by pressing different keys', () => {
      const handler = vi.fn();
      builderInput.setBuildCommandHandler(handler);

      // Start with harvest mode
      window.dispatchEvent(new KeyboardEvent('keydown', {key: 't'}));
      expect(builderInput.getPendingAction()).toBe(BuildAction.FOREST);

      // Switch to pillbox mode
      window.dispatchEvent(new KeyboardEvent('keydown', {key: 'p'}));
      expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);

      // Switch via R-key alias (still pillbox mode)
      window.dispatchEvent(new KeyboardEvent('keydown', {key: 'r'}));
      expect(builderInput.getPendingAction()).toBe(BuildAction.PILLBOX);

      // Recall (clear mode)
      window.dispatchEvent(new KeyboardEvent('keydown', {key: 'c'}));
      expect(builderInput.getPendingAction()).toBe(BuildAction.NONE);
    });
  });
});
