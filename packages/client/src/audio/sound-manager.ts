/**
 * Sound Manager - handles loading and playing positional audio
 */

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
  TILE_SIZE_WORLD,
  type SoundEvent,
} from '@jsbolo/shared';

// Distance thresholds (in world units)
const NEAR_DISTANCE = TILE_SIZE_WORLD * 15; // 15 tiles
const FAR_DISTANCE = TILE_SIZE_WORLD * 40; // 40 tiles

interface SoundVariants {
  self?: string;
  near?: string;
  far?: string;
}

export class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled = true;
  private volume = 0.7;

  // Map sound IDs to file paths
  private readonly soundMap: Record<number, SoundVariants> = {
    [SOUND_BIG_EXPLOSION]: {
      near: '/assets/sounds/big_explosion_near.ogg',
      far: '/assets/sounds/big_explosion_far.ogg',
    },
    [SOUND_BUBBLES]: {
      near: '/assets/sounds/bubbles.ogg',
    },
    [SOUND_FARMING_TREE]: {
      near: '/assets/sounds/farming_tree_near.ogg',
      far: '/assets/sounds/farming_tree_far.ogg',
    },
    [SOUND_HIT_TANK]: {
      self: '/assets/sounds/hit_tank_self.ogg',
      near: '/assets/sounds/hit_tank_near.ogg',
      far: '/assets/sounds/hit_tank_far.ogg',
    },
    [SOUND_MAN_BUILDING]: {
      near: '/assets/sounds/man_building_near.ogg',
      far: '/assets/sounds/man_building_far.ogg',
    },
    [SOUND_MAN_DYING]: {
      near: '/assets/sounds/man_dying_near.ogg',
      far: '/assets/sounds/man_dying_far.ogg',
    },
    [SOUND_MAN_LAY_MINE]: {
      near: '/assets/sounds/man_lay_mine_near.ogg',
    },
    [SOUND_MINE_EXPLOSION]: {
      near: '/assets/sounds/mine_explosion_near.ogg',
      far: '/assets/sounds/mine_explosion_far.ogg',
    },
    [SOUND_SHOOTING]: {
      self: '/assets/sounds/shooting_self.ogg',
      near: '/assets/sounds/shooting_near.ogg',
      far: '/assets/sounds/shooting_far.ogg',
    },
    [SOUND_SHOT_BUILDING]: {
      near: '/assets/sounds/shot_building_near.ogg',
      far: '/assets/sounds/shot_building_far.ogg',
    },
    [SOUND_SHOT_TREE]: {
      near: '/assets/sounds/shot_tree_near.ogg',
      far: '/assets/sounds/shot_tree_far.ogg',
    },
    [SOUND_TANK_SINKING]: {
      near: '/assets/sounds/tank_sinking_near.ogg',
      far: '/assets/sounds/tank_sinking_far.ogg',
    },
  };

  async preloadSounds(): Promise<void> {
    console.log('Preloading sounds...');
    const loadPromises: Promise<void>[] = [];

    for (const [soundId, variants] of Object.entries(this.soundMap)) {
      for (const [variant, path] of Object.entries(variants)) {
        const key = `${soundId}_${variant}`;
        loadPromises.push(this.loadSound(key, path));
      }
    }

    await Promise.all(loadPromises);
    console.log(`Loaded ${this.sounds.size} sound files`);
  }

  private async loadSound(key: string, path: string): Promise<void> {
    return new Promise((resolve) => {
      const audio = new Audio(path);
      audio.volume = this.volume;
      audio.preload = 'auto';

      audio.addEventListener('canplaythrough', () => {
        this.sounds.set(key, audio);
        resolve();
      }, { once: true });

      audio.addEventListener('error', (e) => {
        console.warn(`Failed to load sound: ${path}`, e);
        resolve(); // Don't reject, just skip this sound
      });

      audio.load();
    });
  }

  /**
   * Play a sound event with positional audio
   * @param event The sound event from the server
   * @param playerX Player's tank X position in world units
   * @param playerY Player's tank Y position in world units
   * @param playerTankId Player's tank ID to determine if it's a "self" sound
   */
  playSound(event: SoundEvent, playerX: number, playerY: number, isOwnTank: boolean): void {
    if (!this.enabled) return;

    const variants = this.soundMap[event.soundId];
    if (!variants) {
      console.warn(`Unknown sound ID: ${event.soundId}`);
      return;
    }

    // Calculate distance from player
    const dx = event.x - playerX;
    const dy = event.y - playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Determine which variant to play based on distance and ownership
    let variant: 'self' | 'near' | 'far';
    if (isOwnTank && variants.self) {
      variant = 'self';
    } else if (distance < NEAR_DISTANCE) {
      variant = 'near';
    } else if (distance < FAR_DISTANCE) {
      variant = 'far';
    } else {
      // Too far away, don't play
      return;
    }

    // Fallback to near if variant doesn't exist
    const soundPath = variants[variant] || variants.near;
    if (!soundPath) return;

    const key = `${event.soundId}_${variant}`;
    const audio = this.sounds.get(key);

    if (audio) {
      // Clone the audio element to allow overlapping sounds
      const clone = audio.cloneNode() as HTMLAudioElement;
      clone.volume = this.volume * this.calculateVolume(distance);
      clone.play().catch(err => {
        // Ignore play errors (can happen if user hasn't interacted with page yet)
        console.debug('Audio play failed:', err);
      });
    }
  }

  /**
   * Calculate volume based on distance (0.0 to 1.0)
   */
  private calculateVolume(distance: number): number {
    if (distance < NEAR_DISTANCE) {
      return 1.0;
    } else if (distance < FAR_DISTANCE) {
      // Linear falloff from near to far
      const ratio = (distance - NEAR_DISTANCE) / (FAR_DISTANCE - NEAR_DISTANCE);
      return 1.0 - (ratio * 0.5); // Max 50% reduction at far distance
    } else {
      return 0.5;
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}
