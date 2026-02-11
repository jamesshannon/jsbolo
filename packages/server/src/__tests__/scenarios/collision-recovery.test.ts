import { describe, it, expect } from 'vitest';
import { ScenarioRunner } from './scenario-runner';
import { MOVEMENT_INVARIANTS } from './invariants';
import { TerrainType } from '@jsbolo/shared';

describe('Collision Recovery Scenarios', () => {
  it('19. Collision then recovery', () => {
    const runner = new ScenarioRunner()
      .terrain(45, 50, 10, 1, TerrainType.ROAD)
      .tile(52, 50, TerrainType.BUILDING)
      .placeTank(47, 50)
      .setTank({ speed: 0, direction: 64 }) // East
      .input({ accelerating: true })
      .addInvariants(...MOVEMENT_INVARIANTS);

    // Accelerate into building
    runner.runUntil((snap) => snap.tank.tileX >= 51, 100);

    // Should have collided and stopped
    const collisionSnap = runner.latest;
    expect(collisionSnap.tank.speed).toBe(0);

    // Turn 90 degrees (clockwise to face south)
    runner.input({ turningClockwise: true, accelerating: false });
    runner.run(16); // 64 degrees turn at 4 per tick

    // Now accelerate again
    runner.input({ accelerating: true, turningClockwise: false });
    runner.run(10);

    // Should have regained speed
    runner.assertAt('Tank recovered speed after collision', (snap) => snap.tank.speed > 0);

    runner.assertNoViolations();
  });

  it('20. Collision at tile boundary', () => {
    const runner = new ScenarioRunner()
      .terrain(45, 50, 10, 1, TerrainType.ROAD)
      .tile(52, 50, TerrainType.BUILDING)
      .placeTank(47, 50)
      .setTank({ speed: 16, direction: 64 }) // East at high speed
      .input({ accelerating: true })
      .addInvariants(...MOVEMENT_INVARIANTS);

    const startX = runner.latest.tank.x;

    // Run until collision
    runner.runUntil((snap) => snap.tank.speed === 0, 50);

    const collisionSnap = runner.latest;

    // Verify speed is 0
    expect(collisionSnap.tank.speed).toBe(0);

    // Verify position changed (moved before collision)
    expect(collisionSnap.tank.x).toBeGreaterThan(startX);

    // Verify tank stopped at or before building tile
    expect(collisionSnap.tank.tileX).toBeLessThan(52);

    // Turn away and verify can recover
    runner.input({ turningCounterClockwise: true, accelerating: false });
    runner.run(16); // Turn 64 degrees

    runner.input({ accelerating: true, turningCounterClockwise: false });
    runner.run(10);

    expect(runner.latest.tank.speed).toBeGreaterThan(0);

    runner.assertNoViolations();
  });

  it('21. Repeated collision-recover cycle', () => {
    const runner = new ScenarioRunner()
      .terrain(48, 48, 5, 5, TerrainType.ROAD)
      .tile(50, 49, TerrainType.BUILDING) // North
      .tile(51, 50, TerrainType.BUILDING) // East
      .tile(50, 51, TerrainType.BUILDING) // South
      .tile(49, 50, TerrainType.BUILDING) // West
      .placeTank(50, 50)
      .setTank({ speed: 0, direction: 0 }) // North
      .addInvariants(...MOVEMENT_INVARIANTS);

    const directions = [0, 64, 128, 192, 0]; // N, E, S, W, N

    for (let cycle = 0; cycle < 5; cycle++) {
      // Set direction
      runner.setTank({ direction: directions[cycle] });

      // Accelerate into wall
      runner.input({ accelerating: true });
      runner.run(20);

      // Should have collided
      expect(runner.latest.tank.speed).toBe(0);

      // Turn to next direction
      const nextDir = directions[cycle + 1];
      const currentDir = runner.latest.tank.direction;
      const turnDiff = (nextDir - currentDir + 256) % 256;
      const turnsNeeded = Math.ceil(turnDiff / 4);

      runner.input({ turningClockwise: true, accelerating: false });
      runner.run(turnsNeeded);

      // Should be able to move
      runner.input({ accelerating: true, turningClockwise: false });
      runner.run(5);

      // Verify not permanently stuck
      const canMove = runner.history.slice(-5).some((s) => s.tank.speed > 0);
      expect(canMove).toBe(true);
    }

    runner.assertNoViolations();
  });

  it('22. Collision while on boat at land edge', () => {
    const runner = new ScenarioRunner()
      .terrain(48, 50, 3, 1, TerrainType.RIVER)
      .tile(51, 50, TerrainType.BUILDING)
      .tile(52, 50, TerrainType.BUILDING)
      .placeTank(49, 50)
      .setTank({ speed: 0, direction: 64, onBoat: true }) // East on boat
      .input({ accelerating: true })
      .addInvariants(...MOVEMENT_INVARIANTS);

    // Accelerate on boat toward building
    runner.runUntil((snap) => snap.tank.tileX >= 50, 50);

    // Should still be on boat
    expect(runner.latest.tank.onBoat).toBe(true);

    // Continue toward building edge
    runner.run(20);

    // Should have stopped (collision or terrain)
    const afterCollision = runner.latest;

    // Should still be on boat
    expect(afterCollision.tank.onBoat).toBe(true);

    // Turn away
    runner.input({ turningCounterClockwise: true, accelerating: false });
    runner.run(32); // Turn 128 degrees (opposite direction)

    // Should still be on boat
    expect(runner.latest.tank.onBoat).toBe(true);

    // Accelerate back
    runner.input({ accelerating: true, turningCounterClockwise: false });
    runner.run(10);

    // Should be able to move and still on boat
    expect(runner.latest.tank.onBoat).toBe(true);
    expect(runner.latest.tank.speed).toBeGreaterThan(0);

    runner.assertNoViolations();
  });
});
