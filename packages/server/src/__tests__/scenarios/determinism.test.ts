import {describe, it, expect} from 'vitest';
import {TerrainType} from '@jsbolo/shared';
import {ScenarioRunner} from './scenario-runner';
import {BOAT_INVARIANTS, MOVEMENT_INVARIANTS} from './invariants';

function snapshotSignature(runner: ScenarioRunner): string[] {
  return runner.history.map((snap) =>
    [
      snap.tick,
      snap.tank.x,
      snap.tank.y,
      snap.tank.direction,
      snap.tank.speed,
      snap.tank.armor,
      snap.tank.shells,
      snap.tank.mines,
      snap.tank.onBoat ? 1 : 0,
      snap.terrainAround.center,
      snap.computed.terrainSpeed,
      snap.computed.effectiveSpeed,
    ].join('|')
  );
}

describe('Simulation Determinism Scenarios', () => {
  it('should produce identical 300-tick movement history for identical scripted inputs', () => {
    const buildRunner = (): ScenarioRunner =>
      new ScenarioRunner()
        .terrain(20, 20, 90, 90, TerrainType.GRASS)
        .terrain(45, 45, 40, 8, TerrainType.ROAD)
        .terrain(60, 52, 30, 6, TerrainType.SWAMP)
        .placeTank(50, 50)
        .setTank({speed: 0, direction: 0, onBoat: false})
        .input({accelerating: true})
        .inputAt(80, {turningClockwise: true})
        .inputAt(96, {turningClockwise: false})
        .inputAt(140, {accelerating: false, braking: true})
        .inputAt(165, {braking: false})
        .inputAt(200, {accelerating: true, turningCounterClockwise: true})
        .inputAt(225, {turningCounterClockwise: false})
        .addInvariants(...MOVEMENT_INVARIANTS);

    const runA = buildRunner().run(300);
    const runB = buildRunner().run(300);

    runA.assertNoViolations();
    runB.assertNoViolations();

    expect(snapshotSignature(runA)).toEqual(snapshotSignature(runB));
  });

  it('should produce identical 500-tick boat traversal history for identical scripted inputs', () => {
    const buildRunner = (): ScenarioRunner =>
      new ScenarioRunner()
        .terrain(30, 30, 120, 120, TerrainType.DEEP_SEA)
        .terrain(78, 78, 25, 10, TerrainType.RIVER)
        .placeTank(80, 80)
        .setTank({speed: 0, direction: 0, onBoat: true})
        .input({accelerating: true})
        .inputAt(150, {turningClockwise: true})
        .inputAt(190, {turningClockwise: false})
        .inputAt(280, {turningCounterClockwise: true})
        .inputAt(320, {turningCounterClockwise: false})
        .addInvariants(...BOAT_INVARIANTS);

    const runA = buildRunner().run(500);
    const runB = buildRunner().run(500);

    runA.assertNoViolations();
    runB.assertNoViolations();

    expect(snapshotSignature(runA)).toEqual(snapshotSignature(runB));
  });
});
