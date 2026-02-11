/**
 * Tests for sound event system
 */

import { describe, it, expect } from 'vitest';
import {
  SOUND_BIG_EXPLOSION,
  SOUND_BUBBLES,
  SOUND_FARMING_TREE,
  SOUND_HIT_TANK,
  SOUND_MAN_BUILDING,
  SOUND_MAN_DYING,
  SOUND_MAN_LAY_MINE,
  SOUND_MINE_EXPLOSION,
  SOUND_SHOOTING,
  SOUND_SHOT_BUILDING,
  SOUND_SHOT_TREE,
  SOUND_TANK_SINKING,
} from '@jsbolo/shared';

describe('Sound Event System', () => {
  describe('Sound Constants', () => {
    it('should have SOUND_BIG_EXPLOSION constant', () => {
      expect(SOUND_BIG_EXPLOSION).toBe(0);
    });

    it('should have SOUND_BUBBLES constant', () => {
      expect(SOUND_BUBBLES).toBe(1);
    });

    it('should have SOUND_FARMING_TREE constant', () => {
      expect(SOUND_FARMING_TREE).toBe(2);
    });

    it('should have SOUND_HIT_TANK constant', () => {
      expect(SOUND_HIT_TANK).toBe(3);
    });

    it('should have SOUND_MAN_BUILDING constant', () => {
      expect(SOUND_MAN_BUILDING).toBe(4);
    });

    it('should have SOUND_MAN_DYING constant', () => {
      expect(SOUND_MAN_DYING).toBe(5);
    });

    it('should have SOUND_MAN_LAY_MINE constant', () => {
      expect(SOUND_MAN_LAY_MINE).toBe(6);
    });

    it('should have SOUND_MINE_EXPLOSION constant', () => {
      expect(SOUND_MINE_EXPLOSION).toBe(7);
    });

    it('should have SOUND_SHOOTING constant', () => {
      expect(SOUND_SHOOTING).toBe(8);
    });

    it('should have SOUND_SHOT_BUILDING constant', () => {
      expect(SOUND_SHOT_BUILDING).toBe(9);
    });

    it('should have SOUND_SHOT_TREE constant', () => {
      expect(SOUND_SHOT_TREE).toBe(10);
    });

    it('should have SOUND_TANK_SINKING constant', () => {
      expect(SOUND_TANK_SINKING).toBe(11);
    });
  });

  describe('Sound IDs', () => {
    it('should have 12 unique sound IDs (0-11)', () => {
      const soundIds = [
        SOUND_BIG_EXPLOSION,
        SOUND_BUBBLES,
        SOUND_FARMING_TREE,
        SOUND_HIT_TANK,
        SOUND_MAN_BUILDING,
        SOUND_MAN_DYING,
        SOUND_MAN_LAY_MINE,
        SOUND_MINE_EXPLOSION,
        SOUND_SHOOTING,
        SOUND_SHOT_BUILDING,
        SOUND_SHOT_TREE,
        SOUND_TANK_SINKING,
      ];

      const uniqueIds = new Set(soundIds);
      expect(uniqueIds.size).toBe(12);
      expect(Math.min(...soundIds)).toBe(0);
      expect(Math.max(...soundIds)).toBe(11);
    });
  });
});
