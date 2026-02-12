import {describe, it, expect} from 'vitest';
import {RespawnSystem} from '../respawn-system.js';

describe('RespawnSystem', () => {
  it('should trigger only at or after scheduled tick', () => {
    const system = new RespawnSystem();
    system.schedule(10, 100, 50);

    expect(system.shouldRespawn(10, 149)).toBe(false);
    expect(system.shouldRespawn(10, 150)).toBe(true);
    expect(system.shouldRespawn(10, 151)).toBe(true);
  });

  it('should clear scheduled respawn', () => {
    const system = new RespawnSystem();
    system.schedule(3, 200, 10);
    expect(system.shouldRespawn(3, 210)).toBe(true);

    system.clear(3);
    expect(system.shouldRespawn(3, 999)).toBe(false);
  });
});
