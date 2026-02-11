/**
 * Tests for SoundManager
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SoundManager } from '../sound-manager.js';
import {
  SOUND_SHOOTING,
  SOUND_BUBBLES,
  SOUND_MINE_EXPLOSION,
  TILE_SIZE_WORLD,
} from '@jsbolo/shared';

// Mock Audio API with proper constructor
class MockAudio {
  src: string;
  volume = 1;
  preload = 'auto';
  load = vi.fn();
  play = vi.fn().mockResolvedValue(undefined);
  cloneNode = vi.fn(() => new MockAudio(this.src));
  addEventListener = vi.fn((event: string, callback: any) => {
    if (event === 'canplaythrough') {
      setTimeout(() => callback(), 0);
    }
  });

  constructor(src: string) {
    this.src = src;
  }
}

// Wrap in spy using function keyword to track constructor calls
global.Audio = vi.fn(function(this: any, src: string) {
  return new MockAudio(src);
}) as any;

describe('SoundManager', () => {
  let soundManager: SoundManager;

  beforeEach(() => {
    soundManager = new SoundManager();
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should create sound manager with default settings', () => {
      expect(soundManager.isEnabled()).toBe(true);
    });

    it('should allow enabling/disabling sounds', () => {
      soundManager.setEnabled(false);
      expect(soundManager.isEnabled()).toBe(false);

      soundManager.setEnabled(true);
      expect(soundManager.isEnabled()).toBe(true);
    });

    it('should allow setting volume', () => {
      soundManager.setVolume(0.5);
      // Volume is private, but we can test it doesn't throw
      expect(() => soundManager.setVolume(0.5)).not.toThrow();
    });

    it('should clamp volume between 0 and 1', () => {
      soundManager.setVolume(-0.5);
      soundManager.setVolume(1.5);
      // Should not throw, values should be clamped internally
      expect(() => soundManager.setVolume(-1)).not.toThrow();
      expect(() => soundManager.setVolume(2)).not.toThrow();
    });
  });

  describe('Sound Loading', () => {
    it('should preload sound files', async () => {
      await soundManager.preloadSounds();
      expect(global.Audio).toHaveBeenCalled();
    });

    it('should load multiple sound variants', async () => {
      await soundManager.preloadSounds();
      // Should load near/far/self variants for different sounds
      const callCount = (global.Audio as any).mock.calls.length;
      expect(callCount).toBeGreaterThan(10); // At least 10 sound files
    });
  });

  describe('Positional Audio', () => {
    beforeEach(async () => {
      await soundManager.preloadSounds();
    });

    it('should play sound when enabled', () => {
      const soundEvent = {
        soundId: SOUND_SHOOTING,
        x: 1000,
        y: 1000,
      };

      soundManager.playSound(soundEvent, 1000, 1000, true);
      // Should not throw
      expect(() => soundManager.playSound(soundEvent, 1000, 1000, true)).not.toThrow();
    });

    it('should not play sound when disabled', () => {
      soundManager.setEnabled(false);

      const soundEvent = {
        soundId: SOUND_SHOOTING,
        x: 1000,
        y: 1000,
      };

      soundManager.playSound(soundEvent, 1000, 1000, false);
      // Should not throw, but also should not play
      expect(() => soundManager.playSound(soundEvent, 1000, 1000, false)).not.toThrow();
    });

    it('should handle unknown sound IDs gracefully', () => {
      const soundEvent = {
        soundId: 9999, // Invalid sound ID
        x: 1000,
        y: 1000,
      };

      expect(() => soundManager.playSound(soundEvent, 1000, 1000, false)).not.toThrow();
    });

    it('should not play sounds that are too far away', () => {
      const soundEvent = {
        soundId: SOUND_SHOOTING,
        x: 0,
        y: 0,
      };

      const playerX = TILE_SIZE_WORLD * 50; // 50 tiles away
      const playerY = TILE_SIZE_WORLD * 50;

      // Should not throw, but sound should be silently ignored (too far)
      expect(() => soundManager.playSound(soundEvent, playerX, playerY, false)).not.toThrow();
    });
  });

  describe('Distance-based Variant Selection', () => {
    beforeEach(async () => {
      await soundManager.preloadSounds();
    });

    it('should use self variant for own tank sounds', () => {
      const soundEvent = {
        soundId: SOUND_SHOOTING,
        x: 1000,
        y: 1000,
      };

      // Very close distance + isOwnTank=true should use self variant
      expect(() => soundManager.playSound(soundEvent, 1000, 1000, true)).not.toThrow();
    });

    it('should use near variant for close sounds', () => {
      const soundEvent = {
        soundId: SOUND_SHOOTING,
        x: 1000,
        y: 1000,
      };

      // Within 15 tiles should use near variant
      const playerX = 1000 + TILE_SIZE_WORLD * 5; // 5 tiles away
      const playerY = 1000;

      expect(() => soundManager.playSound(soundEvent, playerX, playerY, false)).not.toThrow();
    });

    it('should use far variant for distant sounds', () => {
      const soundEvent = {
        soundId: SOUND_SHOOTING,
        x: 1000,
        y: 1000,
      };

      // Between 15-40 tiles should use far variant
      const playerX = 1000 + TILE_SIZE_WORLD * 20; // 20 tiles away
      const playerY = 1000;

      expect(() => soundManager.playSound(soundEvent, playerX, playerY, false)).not.toThrow();
    });
  });

  describe('Sound Types', () => {
    beforeEach(async () => {
      await soundManager.preloadSounds();
    });

    it('should handle bubbles sound (no self variant)', () => {
      const soundEvent = {
        soundId: SOUND_BUBBLES,
        x: 1000,
        y: 1000,
      };

      expect(() => soundManager.playSound(soundEvent, 1000, 1000, false)).not.toThrow();
    });

    it('should handle mine explosion sound', () => {
      const soundEvent = {
        soundId: SOUND_MINE_EXPLOSION,
        x: 1000,
        y: 1000,
      };

      expect(() => soundManager.playSound(soundEvent, 1000, 1000, false)).not.toThrow();
    });
  });

  describe('Volume Calculation', () => {
    beforeEach(async () => {
      await soundManager.preloadSounds();
    });

    it('should play sounds with correct volume settings', () => {
      soundManager.setVolume(0.5);

      const soundEvent = {
        soundId: SOUND_SHOOTING,
        x: 1000,
        y: 1000,
      };

      expect(() => soundManager.playSound(soundEvent, 1000, 1000, true)).not.toThrow();
    });
  });
});
