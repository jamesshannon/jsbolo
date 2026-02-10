# Testing Framework

## Overview

Comprehensive unit testing infrastructure using Vitest to prevent regressions and catch bugs before manual testing.

## Test Coverage

### Tank Movement (`src/simulation/__tests__/tank.test.ts`)
- ✅ Forward/backward movement
- ✅ Turning left/right
- ✅ Terrain speed effects (grass, swamp, deep sea)
- ✅ Collision detection (getting stuck on buildings)
- ✅ Boat mechanics (onBoat flag, full speed on water)
- ✅ Shooting and reload mechanics
- ✅ Range adjustment

### Shell Behavior (`src/simulation/__tests__/shell.test.ts`)
- ✅ Shell movement and direction
- ✅ Distance tracking
- ✅ Dying at end of range
- ✅ Out of bounds detection
- ✅ Collision killing (shells disappear properly)
- ✅ Tile position updates
- ✅ Unique IDs and owner tracking

### World Terrain (`src/simulation/__tests__/world.test.ts`)
- ✅ Building health (1 hit to damage, 3 total to destroy)
- ✅ Terrain degradation (building → shot building → rubble → crater)
- ✅ Explosion damage (grass/road → crater, building → rubble)
- ✅ Terrain passability (buildings block, roads allow)
- ✅ Shell-terrain collision detection
- ✅ Multi-point terrain sampling (5-point for tanks)
- ✅ Mine explosions with radius damage
- ✅ Boat terrain mechanics

### Game Session (`src/__tests__/game-session.test.ts`)
- ✅ Shell removal from game when dead
- ✅ Always sending shells array (even if empty) to fix disappearing bug
- ✅ Boat placement when spawning in water
- ✅ Tank full speed when onBoat (prevents getting stuck)
- ✅ Boat movement through water tiles
- ✅ Boat stopping on land
- ✅ Network state synchronization
- ✅ Tank collision with buildings

## Running Tests

```bash
# Run all tests
pnpm test

# Run in watch mode (auto-rerun on file changes)
pnpm test:watch

# Run with UI
pnpm test:ui

# Run with coverage report
pnpm test:coverage
```

## Test-Driven Development Workflow

### For New Features:
1. Write tests FIRST describing expected behavior
2. Run tests (they should fail)
3. Implement feature
4. Run tests until they pass
5. Refactor with confidence

### For Bug Fixes:
1. Write a test that reproduces the bug (it should fail)
2. Fix the bug
3. Verify test now passes
4. Test prevents regression

## Major Bugs Prevented by Tests

### Shells Not Disappearing
- **Bug**: Shells stayed visible after hitting buildings
- **Root Cause**: Server only sent shells array when non-empty
- **Test**: `should always send shells array in updates (even if empty)`
- **Prevention**: Test verifies shells array is ALWAYS present in updates

### Tank Getting Stuck on Boat
- **Bug**: Multi-point sampling detected DEEP_SEA ahead (speed 0), tank froze
- **Root Cause**: Terrain sampling looked ahead before boat terrain was placed
- **Test**: `should give tank full speed when onBoat`
- **Prevention**: Test verifies tank has full speed when onBoat flag is true

### Building Health Too High
- **Bug**: Buildings took 14 hits to destroy instead of 3
- **Root Cause**: Initial health values were too high
- **Test**: `should damage building with direct hit (1 hit to degrade)`
- **Prevention**: Test verifies exact health and degradation sequence

### Boat Not Moving Through Water
- **Bug**: Boat stopped in deep sea when tank moved to river
- **Root Cause**: Boat movement logic only checked final tile, not all water
- **Test**: `should move boat with tank through water tiles`
- **Prevention**: Test verifies boat follows tank through deep sea → river → land

## Test Maintenance

- Add tests for EVERY new feature
- Add tests for EVERY bug discovered
- Run tests before requesting user testing
- Keep tests simple and focused (one assertion per test when possible)
- Use descriptive test names that explain the behavior being tested

## CI/CD Integration (Future)

Tests should be run automatically on:
- Every commit
- Every pull request
- Before deployment

Fail the build if tests don't pass.
