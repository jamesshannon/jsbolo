import { describe, it, expect } from 'vitest';
import { ScenarioRunner } from './scenario-runner';
import { MOVEMENT_INVARIANTS } from './invariants';
import { TerrainType } from '@jsbolo/shared';

const TANK_DECELERATION = 0.25;
const TANK_ACCELERATION = 0.25;

describe('Terrain Transition Scenarios', () => {
  it('9. Road→swamp smooth deceleration', () => {
    const runner = new ScenarioRunner()
      // Create road then swamp
      .terrain(45, 50, 5, 1, TerrainType.ROAD)
      .terrain(50, 50, 10, 1, TerrainType.SWAMP)
      .placeTank(47, 50)
      .setTank({ speed: 16, direction: 64 }) // East
      .input({ accelerating: true })
      .addInvariants(...MOVEMENT_INVARIANTS);

    runner.runUntil((snap) => snap.tank.tileX >= 52, 100);

    // Find the tick where tank enters swamp
    const swampEntryTick = runner.history.findIndex((s) => s.tank.tileX >= 50);
    expect(swampEntryTick).toBeGreaterThan(0);

    // After entering swamp, speed should decrease gradually (not instantly)
    const speedsAfterEntry: number[] = [];
    for (let i = swampEntryTick; i < Math.min(swampEntryTick + 10, runner.history.length); i++) {
      speedsAfterEntry.push(runner.at(i + 1).tank.speed);
    }

    // Speed should be decreasing (each value <= previous)
    for (let i = 1; i < speedsAfterEntry.length; i++) {
      expect(speedsAfterEntry[i]).toBeLessThanOrEqual(speedsAfterEntry[i - 1] + 0.01); // Small epsilon for rounding
    }

    runner.assertNoViolations();
  });

  it('10. Swamp→road smooth acceleration', () => {
    const runner = new ScenarioRunner()
      .terrain(45, 50, 5, 1, TerrainType.SWAMP)
      .terrain(50, 50, 10, 1, TerrainType.ROAD)
      .placeTank(47, 50)
      .setTank({ speed: 4, direction: 64 }) // East at swamp max speed
      .input({ accelerating: true })
      .addInvariants(...MOVEMENT_INVARIANTS);

    runner.runUntil((snap) => snap.tank.tileX >= 52, 100);

    // Find the tick where tank enters road
    const roadEntryTick = runner.history.findIndex((s) => s.tank.tileX >= 50);
    expect(roadEntryTick).toBeGreaterThan(0);

    // After entering road, speed should increase gradually
    const speedsAfterEntry: number[] = [];
    for (let i = roadEntryTick; i < Math.min(roadEntryTick + 10, runner.history.length); i++) {
      speedsAfterEntry.push(runner.at(i + 1).tank.speed);
    }

    // Speed should be increasing (each value >= previous)
    for (let i = 1; i < speedsAfterEntry.length; i++) {
      expect(speedsAfterEntry[i]).toBeGreaterThanOrEqual(speedsAfterEntry[i - 1] - 0.01);
    }

    runner.assertNoViolations();
  });

  it('11. 5-point sampling at diagonal crossing', () => {
    // Create 4 different terrain types at a corner
    const runner = new ScenarioRunner()
      .tile(50, 50, TerrainType.GRASS) // NW - speed 0.75
      .tile(51, 50, TerrainType.ROAD) // NE - speed 1.0
      .tile(50, 51, TerrainType.SWAMP) // SW - speed 0.25
      .tile(51, 51, TerrainType.CRATER) // SE - speed 0.5
      .placeTank(50, 50)
      .setTank({ speed: 8, direction: 96 }) // Southeast
      .input({ accelerating: true })
      .addInvariants(...MOVEMENT_INVARIANTS);

    runner.run(20);

    // When tank is near corner (50.9, 50.9), sampling should pick minimum terrain speed
    // Find snapshots where tank is near the corner junction
    const cornerSnapshots = runner.history.filter(
      (s) =>
        s.tank.x >= 50.7 * 256 &&
        s.tank.x <= 51.3 * 256 &&
        s.tank.y >= 50.7 * 256 &&
        s.tank.y <= 51.3 * 256
    );

    // At least one snapshot should show terrain speed reflecting the minimum sampled value
    expect(cornerSnapshots.length).toBeGreaterThan(0);

    // The terrain speed should never exceed the minimum of the 4 corners (swamp = 0.25)
    for (const snap of cornerSnapshots) {
      expect(snap.computed.terrainSpeed).toBeLessThanOrEqual(0.26); // Slightly above 0.25 for tolerance
    }

    runner.assertNoViolations();
  });

  it('12. Terrain change mid-movement', () => {
    const runner = new ScenarioRunner()
      .terrain(45, 50, 20, 1, TerrainType.ROAD)
      .placeTank(47, 50)
      .setTank({ speed: 16, direction: 64 }) // East
      .input({ accelerating: true })
      .addInvariants(...MOVEMENT_INVARIANTS);

    // Run 10 ticks at full speed
    runner.run(10);
    const speedBeforeChange = runner.latest.tank.speed;

    // Change terrain ahead to crater
    runner.tile(52, 50, TerrainType.CRATER);
    runner.tile(53, 50, TerrainType.CRATER);
    runner.tile(54, 50, TerrainType.CRATER);

    // Continue running
    runner.runUntil((snap) => snap.tank.tileX >= 54, 50);

    // Find when tank enters crater
    const craterEntryTick = runner.history.findIndex((s) => s.tank.tileX >= 52);
    expect(craterEntryTick).toBeGreaterThan(10);

    // Speed should decrease after entering crater
    const speedAfterCrater = runner.at(craterEntryTick + 5).tank.speed;
    expect(speedAfterCrater).toBeLessThan(speedBeforeChange);

    runner.assertNoViolations();
  });

  it('13. Speed consistency across grass/road boundary', () => {
    const runner = new ScenarioRunner()
      .terrain(45, 50, 5, 1, TerrainType.GRASS)
      .terrain(50, 50, 5, 1, TerrainType.ROAD)
      .terrain(55, 50, 5, 1, TerrainType.GRASS)
      .placeTank(47, 50)
      .setTank({ speed: 0, direction: 64 }) // East
      .input({ accelerating: true })
      .addInvariants(...MOVEMENT_INVARIANTS);

    runner.runUntil((snap) => snap.tank.tileX >= 57, 200);

    // Record full speed curve
    const speedCurve = runner.history.map((s) => s.tank.speed);

    // Check for smooth transitions (no sudden spikes or drops > 1.0)
    for (let i = 1; i < speedCurve.length; i++) {
      const delta = Math.abs(speedCurve[i] - speedCurve[i - 1]);
      expect(delta).toBeLessThan(1.0); // No sudden jumps
    }

    // Verify speed increases in grass section
    const grassSection1 = runner.history.filter((s) => s.tank.tileX < 50);
    if (grassSection1.length > 5) {
      const speeds = grassSection1.map((s) => s.tank.speed);
      expect(speeds[speeds.length - 1]).toBeGreaterThan(speeds[0]);
    }

    // Verify speed increases more on road
    const roadSection = runner.history.filter((s) => s.tank.tileX >= 50 && s.tank.tileX < 55);
    if (roadSection.length > 5) {
      const speeds = roadSection.map((s) => s.tank.speed);
      expect(speeds[speeds.length - 1]).toBeGreaterThan(speeds[0]);
    }

    runner.assertNoViolations();
  });
});
