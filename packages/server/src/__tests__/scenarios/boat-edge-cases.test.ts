import { describe, it, expect } from 'vitest';
import { ScenarioRunner } from './scenario-runner';
import { BOAT_INVARIANTS } from './invariants';
import { TerrainType, TILE_SIZE_WORLD } from '@jsbolo/shared';

describe('Boat Edge Case Scenarios', () => {
  it('1. Boat on deep sea — accelerate from standstill', () => {
    const runner = new ScenarioRunner()
      .terrain(45, 45, 10, 10, TerrainType.DEEP_SEA)
      .placeTank(50, 50)
      .setTank({ speed: 0, direction: 64, onBoat: true }) // East
      .input({ accelerating: true })
      .addInvariants(...BOAT_INVARIANTS);

    const startX = runner.latest.tank.x;
    const startY = runner.latest.tank.y;

    runner.run(20);

    const final = runner.latest;

    // Assert speed > 0
    expect(final.tank.speed).toBeGreaterThan(0);

    // Assert position changed
    expect(final.tank.x).not.toBe(startX);

    // Assert still on boat
    expect(final.tank.onBoat).toBe(true);

    runner.assertNoViolations();
  });

  it('2. Boat at deep sea edge — 5-point sampling straddles boundary', () => {
    // Create a boundary: RIVER at (50,50), DEEP_SEA at (51,50)
    const runner = new ScenarioRunner()
      .terrain(48, 48, 3, 5, TerrainType.RIVER)
      .terrain(51, 48, 5, 5, TerrainType.DEEP_SEA)
      .placeTank(50, 50)
      .setTank({ onBoat: true, speed: 0, direction: 64 }); // East

    // Position tank so that when 5-point sampling happens, corners extend into DEEP_SEA
    // Tank center at tile (50,50), offset to (50.9, 50.5) in world coords
    // This means one corner (+0.375 offset) extends into tile (51,50)
    const tank = runner.latest.tank;
    const targetWorldX = 50 * TILE_SIZE_WORLD + 0.9 * TILE_SIZE_WORLD;
    const targetWorldY = 50 * TILE_SIZE_WORLD + 0.5 * TILE_SIZE_WORLD;

    runner.setTank({ speed: 0, direction: 64, onBoat: true });

    // Manually set position through internal access (since we need precise positioning)
    const player = (runner as any).session.getPlayerIds()[0];
    const tankObj = (runner as any).session.players.get(player).tank;
    tankObj.x = targetWorldX;
    tankObj.y = targetWorldY;
    tankObj.updateTilePosition();

    runner.input({ accelerating: true }).addInvariants(...BOAT_INVARIANTS);

    runner.run(20);

    const final = runner.latest;

    // Boat override must prevent freeze - tank should have speed
    expect(final.tank.speed).toBeGreaterThan(0);
    expect(final.tank.onBoat).toBe(true);

    runner.assertNoViolations();
  });

  it('3. Boat traversal through mixed water', () => {
    // Create corridor: DEEP_SEA → RIVER → DEEP_SEA → RIVER
    const runner = new ScenarioRunner()
      .terrain(45, 50, 3, 1, TerrainType.DEEP_SEA)
      .terrain(48, 50, 3, 1, TerrainType.RIVER)
      .terrain(51, 50, 3, 1, TerrainType.DEEP_SEA)
      .terrain(54, 50, 3, 1, TerrainType.RIVER)
      .terrain(57, 50, 3, 1, TerrainType.DEEP_SEA)
      .placeTank(46, 50)
      .setTank({ speed: 0, direction: 64, onBoat: true }) // East
      .input({ accelerating: true })
      .addInvariants(...BOAT_INVARIANTS);

    runner.runUntil((snap) => snap.tank.tileX >= 58, 200);

    const final = runner.latest;

    // Verify traversed 5+ tiles
    const startTileX = 46;
    const endTileX = final.tank.tileX;
    expect(endTileX - startTileX).toBeGreaterThanOrEqual(5);

    // Verify speed never dropped to 0 during traversal
    const speedDroppedToZero = runner.history.some((s) => s.tank.speed === 0 && s.tick > 5);
    expect(speedDroppedToZero).toBe(false);

    runner.assertNoViolations();
  });

  it('4. Disembark preserves boat direction', () => {
    // RIVER → GRASS setup
    const runner = new ScenarioRunner()
      .terrain(48, 50, 3, 1, TerrainType.RIVER)
      .terrain(51, 50, 5, 1, TerrainType.GRASS)
      .placeTank(49, 50)
      .setTank({ speed: 0, direction: 64, onBoat: true }) // East
      .input({ accelerating: true })
      .addInvariants(...BOAT_INVARIANTS);

    const tankDirection = 64;

    // Run until tank disembarks
    runner.runUntil((snap) => !snap.tank.onBoat, 100);

    const disembarkSnap = runner.latest;
    expect(disembarkSnap.tank.onBoat).toBe(false);

    // Get the previous tile (where boat should be)
    const prevTileX = disembarkSnap.tank.tileX - 1;
    const prevTileY = disembarkSnap.tank.tileY;

    // Check boat tile has correct direction
    const world = (runner as any).session.world;
    const boatTile = world.getTile(prevTileX, prevTileY);

    // Boat direction should be (tankDirection + 128) % 256
    const expectedBoatDir = (tankDirection + 128) % 256;
    expect(boatTile?.boat?.direction).toBe(expectedBoatDir);

    runner.assertNoViolations();
  });

  it('5. Disembark then re-board cycle', () => {
    // Setup: GRASS → RIVER → GRASS
    const runner = new ScenarioRunner()
      .terrain(45, 50, 3, 1, TerrainType.GRASS)
      .terrain(48, 50, 4, 1, TerrainType.RIVER)
      .terrain(52, 50, 3, 1, TerrainType.GRASS)
      .placeTank(46, 50)
      .setTank({ speed: 0, direction: 64, onBoat: false }) // East on land
      .input({ accelerating: true })
      .addInvariants(...BOAT_INVARIANTS);

    // Phase 1: Land → enter water (board boat)
    runner.runUntil((snap) => snap.tank.onBoat, 50);
    expect(runner.latest.tank.onBoat).toBe(true);

    const boardedTileX = runner.latest.tank.tileX;

    // Phase 2: Cross water
    runner.runUntil((snap) => snap.tank.tileX >= 51, 50);

    // Phase 3: Exit water (disembark)
    runner.runUntil((snap) => !snap.tank.onBoat, 50);
    expect(runner.latest.tank.onBoat).toBe(false);

    // Phase 4: Turn around (reverse direction)
    runner.input({ turningClockwise: true, accelerating: false });
    runner.run(32); // Turn 128 degrees

    // Phase 5: Re-enter water (board boat again)
    runner.input({ accelerating: true, turningClockwise: false });
    runner.runUntil((snap) => snap.tank.onBoat, 50);
    expect(runner.latest.tank.onBoat).toBe(true);

    // Verify full lifecycle completed
    const transitions = runner.history.map((s) => ({
      tick: s.tick,
      onBoat: s.tank.onBoat,
      terrain: s.terrainAround.center,
    }));

    // Should have at least 2 onBoat transitions (false→true, true→false, false→true)
    const onBoatChanges = transitions.filter(
      (t, i) => i > 0 && t.onBoat !== transitions[i - 1].onBoat
    );
    expect(onBoatChanges.length).toBeGreaterThanOrEqual(3);

    runner.assertNoViolations();
  });

  it('6. Boat near coastline — corner samples hit land', () => {
    // Tank on boat in RIVER adjacent to GRASS
    const runner = new ScenarioRunner()
      .terrain(49, 49, 2, 2, TerrainType.RIVER)
      .terrain(51, 49, 2, 2, TerrainType.GRASS)
      .placeTank(50, 50)
      .setTank({ speed: 0, direction: 64, onBoat: true }) // East
      .input({ accelerating: true })
      .addInvariants(...BOAT_INVARIANTS);

    runner.run(20);

    // Verify boat override applies (effective speed should be 1.0, not terrain speed)
    const snapshotsNearEdge = runner.history.filter((s) => s.tank.tileX === 50);

    expect(snapshotsNearEdge.length).toBeGreaterThan(0);

    for (const snap of snapshotsNearEdge) {
      if (snap.tank.onBoat) {
        // Effective speed should be 1.0 (boat override)
        expect(snap.computed.effectiveSpeed).toBe(1.0);
      }
    }

    runner.assertNoViolations();
  });

  it('7. 100-tick sustained boat movement', () => {
    const runner = new ScenarioRunner()
      .terrain(40, 40, 30, 30, TerrainType.DEEP_SEA)
      .placeTank(50, 50)
      .setTank({ speed: 0, direction: 64, onBoat: true }) // East
      .input({ accelerating: true })
      .addInvariants(...BOAT_INVARIANTS);

    const startTileX = runner.latest.tank.tileX;

    runner.run(100);

    const final = runner.latest;

    // No violations
    runner.assertNoViolations();

    // Traversed 5+ tiles
    expect(final.tank.tileX - startTileX).toBeGreaterThanOrEqual(5);

    // Reached max speed (or close to it)
    expect(final.tank.speed).toBeGreaterThan(10);

    // OnBoat stayed true
    expect(final.tank.onBoat).toBe(true);

    // All ticks maintained onBoat
    const allOnBoat = runner.history.every((s) => s.tank.onBoat);
    expect(allOnBoat).toBe(true);
  });

  it('8. Brake and re-accelerate on boat', () => {
    const runner = new ScenarioRunner()
      .terrain(45, 45, 20, 20, TerrainType.DEEP_SEA)
      .placeTank(50, 50)
      .setTank({ speed: 0, direction: 64, onBoat: true }) // East
      .input({ accelerating: true })
      .addInvariants(...BOAT_INVARIANTS);

    // Accelerate to max speed
    runner.run(70);
    const maxSpeed = runner.latest.tank.speed;
    expect(maxSpeed).toBeGreaterThan(10);

    // Brake to 0
    runner.input({ braking: true, accelerating: false });
    runner.runUntil((snap) => snap.tank.speed === 0, 100);
    expect(runner.latest.tank.speed).toBe(0);
    expect(runner.latest.tank.onBoat).toBe(true);

    // Re-accelerate
    runner.input({ accelerating: true, braking: false });
    runner.run(70);

    const finalSpeed = runner.latest.tank.speed;

    // Speed should recover (no permanent stuck state)
    expect(finalSpeed).toBeGreaterThan(10);
    expect(runner.latest.tank.onBoat).toBe(true);

    runner.assertNoViolations();
  });
});
