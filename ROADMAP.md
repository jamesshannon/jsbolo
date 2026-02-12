# JSBolo Roadmap (4 Phases)

This file is the forward plan for the project. It assumes active development, with some features intentionally incomplete and some tests intentionally skipped until those features are implemented.

## Environment Notes

- Backend game server: `ws://localhost:8080` (and alternate backend usage on `8081` when configured)
- Client dev server: `http://localhost:3000`
- `README.md` is currently behind active development state; `DEVELOPMENT.md` is the primary status log.

## Delivery Rules (Applied In Every Phase)

1. Add new unit and/or integration tests whenever behavior is added or changed.
2. Keep skipped tests only for intentionally not-yet-implemented behavior.
3. Commit code in logical chunks (small, coherent, reviewable).
4. Do not merge work that breaks `test`, `build`, or `type-check` for the touched scope.

---

## Phase 1: Stabilization and Baseline Hardening

### Goals

- Make the core developer loop reliable.
- Resolve current build/type-check/lint friction in active code paths.
- Align docs and scripts with actual runtime behavior.

### Scope

- Fix immediate TypeScript/build issues in server/client.
- Reduce high-noise debug logging in hot paths (or gate behind debug flags).
- Fix listener lifecycle issues and obvious cleanup defects.
- Ensure scripts/docs reflect server/client ports and current startup flow.

### Test Expectations

- Add/adjust tests for each bug fix or behavior change.
- Keep server integration tests green; add regression tests for each defect fixed.

### Exit Criteria

- `pnpm -r test` passes.
- `pnpm -r type-check` passes.
- `pnpm -r build` passes.
- Updated docs reflect current reality.

---

## Phase 2: Core Gameplay Completion (Manual-Spec-Driven)

### Goals

- Complete the remaining major gameplay mechanics currently marked as not-yet-implemented.
- Convert high-value skipped spec tests to active tests.

### Scope

- Base mechanics completion:
  - Drive-over and armor-gated capture behavior
  - Regeneration/self-replenishment behavior
- Alliance system:
  - Alliance state and membership transitions
  - Ally-aware visibility rules (mines, ownership interactions)
- Win condition detection:
  - Team/alliance win checks
  - End-of-match signaling

### Test Expectations

- Unskip and satisfy spec tests as features land.
- Add integration coverage for full-session scenarios (not only isolated unit logic).

### Exit Criteria

- Remaining skipped tests are only for intentionally deferred features.
- Core base/alliance/win loops are functional and regression-covered.

---

## Phase 3: Architecture and Multiplayer Quality

### Goals

- Improve maintainability and simulation determinism as the feature set grows.
- Strengthen network robustness and client experience under latency.

### Scope

- Refactor monolithic server orchestration into clearer systems:
  - Combat system
  - Builder system
  - Terrain/world effects system
  - Match state/win system
- Reduce duplicated update logic and tighten ownership boundaries.
- Move timer-based gameplay events to tick-scheduled simulation paths where feasible.
- Improve client networking quality:
  - Better interpolation/reconciliation for remote entities
  - More deterministic handling of entity lifecycle updates

### Test Expectations

- Add focused unit tests for newly extracted systems.
- Add scenario/integration tests for deterministic behavior over many ticks.

### Exit Criteria

- Lower coupling in server runtime modules.
- Deterministic multi-tick outcomes in core gameplay systems.
- Multiplayer feel and consistency improved without regressions.

---

## Phase 4: Productization and Polish

### Goals

- Transition from “playable dev build” to “maintainable game product”.
- Improve UX, observability, and contribution readiness.

### Scope

- UX polish:
  - HUD refinements
  - Better feedback for builder/actions/combat events
  - `HUD-TODO`: add scrolling message when player drives over a disabled pillbox while already carrying one (pickup blocked by single-pillbox carry limit)
  - Optional accessibility and input quality improvements
- Content and tooling:
  - Map workflow improvements (selection/validation/editor groundwork)
  - Replay/diagnostic tooling (if in scope)
- Engineering polish:
  - CI pipeline for test/build/type-check/lint
  - Contributor workflow docs and release/versioning strategy

### Test Expectations

- Add end-to-end smoke checks for startup/connect/play loop.
- Preserve strong unit/integration coverage while expanding product behavior.

### Exit Criteria

- Repeatable CI quality gate.
- Stable developer onboarding path.
- Clear path from dev branch to release candidates.

---

## Suggested Commit Cadence

Use this as a default pattern in each phase:

1. `chore/docs`: planning or docs-only updates.
2. `fix(core)`: one bug fix + related tests.
3. `refactor(system)`: structural change with no behavior drift (tests prove no regressions).
4. `feat(...)`: one coherent feature increment + tests.

Keep each commit independently understandable and reversible.
