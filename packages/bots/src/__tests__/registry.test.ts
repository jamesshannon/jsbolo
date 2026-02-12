import {describe, expect, it} from 'vitest';
import {createBotController, listBuiltInBotProfiles} from '../registry.js';

describe('bot registry', () => {
  it('lists deterministic built-in profiles', () => {
    expect(listBuiltInBotProfiles()).toEqual(['idle', 'patrol', 'tactical']);
  });

  it('builds working idle, patrol, and tactical controllers', () => {
    const idle = createBotController('idle');
    const patrol = createBotController('patrol');
    const tactical = createBotController('tactical');

    expect(idle.profile).toBe('idle');
    expect(patrol.profile).toBe('patrol');
    expect(tactical.profile).toBe('tactical');

    const idleCommand = idle.think({
      tick: 10,
      self: {
        id: 1,
        team: 0,
        x: 100,
        y: 100,
        direction: 0,
        speed: 0,
        armor: 40,
        shells: 40,
        mines: 40,
        trees: 0,
        onBoat: false,
        reload: 0,
        firingRange: 7,
      },
      enemies: [],
    });

    expect(idleCommand.accelerating).toBe(false);
    expect(idleCommand.shooting).toBe(false);
  });

  it('throws for unknown profiles', () => {
    expect(() => createBotController('unknown-profile')).toThrow(
      'Unknown bot profile: unknown-profile'
    );
  });
});
