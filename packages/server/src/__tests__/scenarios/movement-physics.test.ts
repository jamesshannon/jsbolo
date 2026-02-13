import { describe, it, expect } from 'vitest';
import { ScenarioRunner } from './scenario-runner';
import { MOVEMENT_INVARIANTS } from './invariants';
import { TerrainType } from '@jsbolo/shared';

const TANK_ACCELERATION = 0.25;
const TANK_DECELERATION = 0.25;
const TANK_COAST_DECELERATION = 0.125;
const MAX_SPEED = 16;
const TURN_RATE_SLOW = 2; // First 10 ticks
const TURN_RATE_FAST = 4; // After 10 ticks
const SCENARIO_TIMEOUT_MS = 15000;

describe('Movement Physics Scenarios', () => {
  it('14. Full acceleration curve', () => {
    const runner = new ScenarioRunner()
      .terrain(40, 40, 20, 20, TerrainType.ROAD)
      .placeTank(50, 50)
      .setTank({ speed: 0, direction: 0 })
      .input({ accelerating: true })
      .addInvariants(...MOVEMENT_INVARIANTS);

    // Run enough ticks to reach max speed (64 ticks at 0.25/tick)
    runner.run(70);

    // Check that speed increased by exactly 0.25/tick until max
    for (let i = 1; i <= 64 && i <= runner.history.length; i++) {
      const snap = runner.at(i);
      const expectedSpeed = Math.min(i * TANK_ACCELERATION, MAX_SPEED);
      expect(snap.tank.speed).toBeCloseTo(expectedSpeed, 2);
    }

    // Verify max speed reached and maintained
    const final = runner.latest;
    expect(final.tank.speed).toBeCloseTo(MAX_SPEED, 2);

    runner.assertNoViolations();
  });

  it('15. Full deceleration curve', () => {
    const runner = new ScenarioRunner()
      .terrain(40, 40, 20, 20, TerrainType.ROAD)
      .placeTank(50, 50)
      .setTank({ speed: MAX_SPEED, direction: 0 })
      .input({ braking: true })
      .addInvariants(...MOVEMENT_INVARIANTS);

    // Run enough ticks to decelerate to 0 (64 ticks at 0.25/tick)
    runner.run(70);

    // Check that speed decreased by exactly 0.25/tick until 0
    for (let i = 1; i <= 64 && i <= runner.history.length; i++) {
      const snap = runner.at(i);
      const expectedSpeed = Math.max(MAX_SPEED - i * TANK_DECELERATION, 0);
      expect(snap.tank.speed).toBeCloseTo(expectedSpeed, 2);
    }

    // Verify speed is 0
    const final = runner.latest;
    expect(final.tank.speed).toBeCloseTo(0, 2);

    runner.assertNoViolations();
  });

  it('16. Coasting deceleration', () => {
    const runner = new ScenarioRunner()
      .terrain(40, 40, 20, 20, TerrainType.ROAD)
      .placeTank(50, 50)
      .setTank({ speed: 8, direction: 0 })
      .input({}) // No input = coasting
      .addInvariants(...MOVEMENT_INVARIANTS);

    // Run enough ticks to decelerate to 0 (64 ticks at 0.125/tick)
    runner.run(70);

    // Check that speed decreased by exactly 0.125/tick until 0
    for (let i = 1; i <= 64 && i <= runner.history.length; i++) {
      const snap = runner.at(i);
      const expectedSpeed = Math.max(8 - i * TANK_COAST_DECELERATION, 0);
      expect(snap.tank.speed).toBeCloseTo(expectedSpeed, 2);
    }

    // Verify speed is 0
    const final = runner.latest;
    expect(final.tank.speed).toBeCloseTo(0, 2);

    runner.assertNoViolations();
  });

  it('17. Direction wrapping at 256', () => {
    const runner = new ScenarioRunner()
      .terrain(40, 40, 20, 20, TerrainType.ROAD)
      .placeTank(50, 50)
      .setTank({ speed: 0, direction: 254 })
      .input({ turningClockwise: true })
      .addInvariants(...MOVEMENT_INVARIANTS);

    runner.run(5);

    // Check direction progression with 2 units/tick for first 10 ticks
    const directions = runner.history.map((s) => s.tank.direction);

    // After turn, directions should wrap through 256
    // Note: turning happens on tick execution, so first snapshot shows after first turn
    expect(directions[0]).toBe((254 + TURN_RATE_SLOW) % 256); // 256 % 256 = 0
    expect(directions[1]).toBe((254 + TURN_RATE_SLOW * 2) % 256); // 258 % 256 = 2
    expect(directions[2]).toBe((254 + TURN_RATE_SLOW * 3) % 256); // 260 % 256 = 4
    expect(directions[3]).toBe((254 + TURN_RATE_SLOW * 4) % 256); // 262 % 256 = 6
    expect(directions[4]).toBe((254 + TURN_RATE_SLOW * 5) % 256); // 264 % 256 = 8

    runner.assertNoViolations();
  });

  const allDirections = Array.from({ length: 16 }, (_, i) => i * 16);
  it.each(allDirections)('18.%s Movement in compass direction', (dir) => {
    const runner = new ScenarioRunner()
      .terrain(40, 40, 20, 20, TerrainType.ROAD)
      .placeTank(50, 50)
      .setTank({ speed: 0, direction: dir })
      .addInvariants(...MOVEMENT_INVARIANTS);

    // Accelerate to speed
    runner.input({ accelerating: true }).run(40);

    // Capture start position
    const startX = runner.latest.tank.x;
    const startY = runner.latest.tank.y;

    // Run more ticks to accumulate clear movement
    runner.run(5);

    const endX = runner.latest.tank.x;
    const endY = runner.latest.tank.y;

    const dx = endX - startX;
    const dy = endY - startY;
    const totalMovement = Math.sqrt(dx * dx + dy * dy);

    // Verify tank actually moved
    expect(totalMovement).toBeGreaterThan(10);

    // Verify direction is maintained (roughly)
    const finalDirection = runner.latest.tank.direction;
    const directionDiff = Math.abs(finalDirection - dir);
    expect(directionDiff).toBeLessThan(10); // Allow small drift

    runner.assertNoViolations();
  }, SCENARIO_TIMEOUT_MS);
});
