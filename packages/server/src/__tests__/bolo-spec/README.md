# Bolo Manual Specification Tests

This directory contains comprehensive specification tests derived from the official Bolo manual. These tests serve as a living specification: every testable rule from the manual is represented as either an active test (if implemented) or a skipped test (if not yet implemented).

## Purpose

- **Living Documentation**: Run `npm test` to see what's implemented (passing), what's planned (skipped), and what's broken (failing)
- **Regression Prevention**: Ensure game mechanics match the official manual
- **Implementation Roadmap**: Skipped tests show unimplemented features ready to activate

## Organization

Tests are organized by **game system** (not manual section order) for developer clarity:

- `01-tank-spawning.test.ts` - Initial tank state and resources
- `02-tank-movement.test.ts` - Movement, acceleration, turning, collision
- `03-shooting.test.ts` - Shells, range, reload, collisions
- `04-terrain-damage.test.ts` - Direct hits, explosions, crater flooding
- `05-mines.test.ts` - Quick mines, builder mines, explosions, chains
- `06-boats.test.ts` - Speed, boarding, disembarking, building
- `07-water-mechanics.test.ts` - Resource drain in water
- `08-pillboxes.test.ts` - Targeting, firing, damage, pickup/placement
- `09-bases.test.ts` - Refueling, capture, self-replenishment
- `10-builder.test.ts` - Lifecycle, harvesting, building, vulnerability
- `11-death-respawn.test.ts` - Tank destruction and respawn
- `12-alliances.test.ts` - Team mechanics and alliance system
- `13-win-condition.test.ts` - Victory detection
- `helpers.ts` - Shared test utilities

See `docs/bolo-manual-reference.md` for the mapping between manual sections and test files.

## Test Conventions

### File Structure

Each test file starts with a header comment containing:

```typescript
/**
 * Bolo Manual Spec: [System Name]
 *
 * Manual Reference: docs/bolo-manual-reference.md § N "[Section Name]"
 * Also covers: § "[Other Related Sections]" (if applicable)
 *
 * [Brief description of what this file tests]
 * - Key mechanics with bullet points
 * - "Quoted text from manual for critical rules"
 * - NOT YET IMPLEMENTED notes for skipped tests
 */
```

### Individual Test Conventions

When writing or updating tests, **ALWAYS** reference the manual:

```typescript
// Good - references the specific manual rule being tested
it('should drain 1 shell every 15 ticks when in water without boat', () => {
  // Manual: § 8 "Water Mechanics"
  // "tank's stocks of shells and mines will be depleted"
  expect(WATER_DRAIN_INTERVAL_TICKS).toBe(15);
  expect(WATER_SHELLS_DRAINED).toBe(1);
});

// Bad - no traceability to manual
it('should drain shells in water', () => {
  // What's the drain rate? How do we know this is correct?
  // No way to verify against the manual
});
```

For tests covering ambiguous or inferred behavior, add a comment explaining the reasoning:

```typescript
it('should restore BOAT tile to RIVER when boarded', () => {
  // Manual § 7: "boat is 'carried' by the tank"
  // Inference: Since boats can only be disembarked from RIVER (coastlines),
  // not DEEP_SEA, all BOAT tiles restore to RIVER when picked up.
  world.setTerrainAt(50, 50, TerrainType.BOAT);
  tankMovesOnto(50, 50);
  expect(world.getTerrainAt(50, 50)).toBe(TerrainType.RIVER);
});
```

### Skipped Tests

Use `it.skip()` for unimplemented features with full test body:

```typescript
it.skip('should flood crater adjacent to river (becomes river)', () => {
  // Manual § 5: "Craters adjacent to sea or river will flood with water"
  // Not yet implemented
  world.setTerrainAt(50, 50, TerrainType.RIVER);
  world.setTerrainAt(51, 50, TerrainType.CRATER);
  tickSession(session, 100); // Wait for flooding
  expect(world.getTerrainAt(51, 50)).toBe(TerrainType.RIVER);
});
```

When implementing a feature:
1. Remove `.skip` from the test
2. Verify the test passes
3. No other changes needed - the assertion is already correct

### Direct Quotes

Include direct quotes from the manual for critical or surprising rules:

```typescript
describe('Variable Fire Rate', () => {
  // "In a straightforward confrontation, with a tank and a pillbox both
  //  firing at each other as fast as they can, a pillbox will win every time."
  it('should increase fire interval over time (gets slower)', () => {
    const pb = new ServerPillbox(50, 50);
    // Test implementation...
  });
});
```

## Coverage Status

**137 active tests** (passing) - implemented features
**48 skipped tests** - not yet implemented but specified

Major unimplemented features:
- Water resource drain
- Crater flooding
- Mine chain reactions
- Pillbox pickup/placement/repair
- Forest concealment and regrowth
- Alliance system
- Base self-replenishment
- Win condition detection

## Running Tests

```bash
# Run all spec tests
npm test -- src/__tests__/bolo-spec/

# Run specific file
npm test -- src/__tests__/bolo-spec/02-tank-movement.test.ts

# Watch mode during development
npm test -- --watch src/__tests__/bolo-spec/
```

## Updating Tests

When you implement a new feature:

1. Find the corresponding `.skip` test(s)
2. Remove `.skip` to activate the test
3. Run the test - it should pass immediately
4. If it fails, either:
   - Fix the implementation (the test is correct per the manual)
   - OR fix the test (if manual interpretation was wrong)

When adding new tests:

1. Check `docs/bolo-manual-reference.md` for the rule
2. Add test with manual reference in comment
3. Use `it.skip()` if feature not yet implemented
4. Include direct quote for critical rules
5. Group related tests in descriptive `describe()` blocks
