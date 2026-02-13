# Bolo Manual Traceability Matrix

Source of truth: `references/bolo-manual-reference.md` (derived from the classic manual).
Last updated: 2026-02-13.

## Status Legend

| Status | Meaning |
|---|---|
| `verified` | Implemented and covered by automated tests that assert behavior. |
| `partial` | Implemented but test evidence is weak/incomplete, or manual wording is ambiguous. |
| `missing` | Not implemented or no reliable evidence found. |

## Repeatable Audit Workflow

1. Split manual text into normative requirements (one requirement per row, unique ID).
2. Map each requirement to server owner files and client owner files.
3. Map each requirement to at least one automated test.
4. Record status (`verified`/`partial`/`missing`) and explicit notes for deviations.
5. Treat any requirement without strong test evidence as a gap, even if code appears to implement it.
6. Re-run after any systems refactor and update this matrix in the same change.

## Matrix

### 2. Tank Movement

| ID | Requirement | Server Owner(s) | Client Owner(s) | Test Evidence | Status | Notes |
|---|---|---|---|---|---|---|
| `MOV-01` | Terrain speed multipliers (road fast, swamp slow, etc.) | `packages/server/src/simulation/world.ts`, `packages/server/src/simulation/tank.ts`, `packages/server/src/systems/player-simulation-system.ts` | `packages/client/src/input/keyboard.ts`, `packages/client/src/game/input-mapping.ts` | `packages/server/src/__tests__/bolo-spec/02-tank-movement.test.ts`, `packages/server/src/__tests__/scenarios/terrain-transitions.test.ts` | `verified` |  |
| `MOV-02` | Acceleration/deceleration/coasting curves | `packages/server/src/simulation/tank.ts` | `packages/client/src/input/keyboard.ts` | `packages/server/src/__tests__/bolo-spec/02-tank-movement.test.ts`, `packages/server/src/__tests__/scenarios/movement-physics.test.ts` | `verified` |  |
| `MOV-03` | Turning acceleration and direction wrapping | `packages/server/src/simulation/tank.ts` | `packages/client/src/input/keyboard.ts` | `packages/server/src/__tests__/bolo-spec/02-tank-movement.test.ts`, `packages/server/src/__tests__/scenarios/movement-physics.test.ts` | `verified` |  |
| `MOV-04` | Collision blocks movement and zeroes speed | `packages/server/src/simulation/world.ts`, `packages/server/src/simulation/tank.ts` | `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/02-tank-movement.test.ts`, `packages/server/src/__tests__/scenarios/collision-recovery.test.ts` | `verified` |  |
| `MOV-05` | Deep sea death without boat | `packages/server/src/systems/player-simulation-system.ts` | `packages/client/src/game/multiplayer-game.ts` | `packages/server/src/__tests__/bolo-spec/02-tank-movement.test.ts` | `verified` |  |

### 3. Tank Spawning and Initial State

| ID | Requirement | Server Owner(s) | Client Owner(s) | Test Evidence | Status | Notes |
|---|---|---|---|---|---|---|
| `SPN-01` | Starting resources, speed, direction | `packages/server/src/systems/session-player-manager.ts`, `packages/server/src/simulation/tank.ts` | `packages/client/src/game/network-entity-state.ts` | `packages/server/src/__tests__/bolo-spec/01-tank-spawning.test.ts` | `verified` |  |
| `SPN-02` | Spawn on boat when spawn tile is water | `packages/server/src/systems/session-player-manager.ts` | `packages/client/src/game/network-entity-state.ts` | `packages/server/src/__tests__/bolo-spec/01-tank-spawning.test.ts`, `packages/server/src/__tests__/boat-movement.test.ts` | `verified` |  |
| `SPN-03` | Team assignment cycling | `packages/server/src/systems/session-player-manager.ts` | `packages/client/src/game/multiplayer-game.ts` | `packages/server/src/__tests__/bolo-spec/01-tank-spawning.test.ts` | `verified` |  |
| `SPN-04` | Spawn positions from map with deterministic fallback | `packages/server/src/systems/session-player-manager.ts`, `packages/server/src/simulation/map-loader.ts` | `packages/client/src/game/network-welcome-state.ts` | `packages/server/src/__tests__/bolo-spec/01-tank-spawning.test.ts`, `packages/server/src/systems/__tests__/session-welcome-builder.test.ts` | `verified` |  |

### 4. Shooting

| ID | Requirement | Server Owner(s) | Client Owner(s) | Test Evidence | Status | Notes |
|---|---|---|---|---|---|---|
| `SHT-01` | Shell speed, direction, range conversion | `packages/server/src/simulation/shell.ts`, `packages/server/src/simulation/tank.ts` | `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/03-shooting.test.ts` | `verified` |  |
| `SHT-02` | Reload gating and ammo/armor fire constraints | `packages/server/src/simulation/tank.ts` | `packages/client/src/input/keyboard.ts` | `packages/server/src/__tests__/bolo-spec/03-shooting.test.ts` | `verified` |  |
| `SHT-03` | Shell-terrain collision classes and damage chain | `packages/server/src/systems/combat-system.ts`, `packages/server/src/simulation/world.ts` | `packages/client/src/game/network-world-effects.ts` | `packages/server/src/__tests__/bolo-spec/03-shooting.test.ts`, `packages/server/src/__tests__/bolo-spec/04-terrain-damage.test.ts` | `verified` |  |
| `SHT-04` | Shell-tank hit radius and damage | `packages/server/src/systems/combat-system.ts` | `packages/client/src/audio/sound-manager.ts` | `packages/server/src/__tests__/bolo-spec/03-shooting.test.ts` | `verified` |  |
| `SHT-05` | Shell-pillbox damage/disable behavior | `packages/server/src/systems/combat-system.ts`, `packages/server/src/simulation/pillbox.ts` | `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/03-shooting.test.ts`, `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts` | `verified` |  |
| `SHT-06` | Shell-base damage behavior | `packages/server/src/systems/combat-system.ts`, `packages/server/src/simulation/base.ts` | `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/09-bases.test.ts` | `verified` | Ownership does not change on shell hit; capture is separate logic. |
| `SHT-07` | Range adjustment (1..9 in 0.5 increments) | `packages/server/src/simulation/tank.ts` | `packages/client/src/input/keyboard.ts`, `packages/client/src/game/input-mapping.ts` | `packages/server/src/__tests__/bolo-spec/03-shooting.test.ts` | `verified` |  |
| `SHT-08` | No owner self-hit behavior | `packages/server/src/systems/combat-system.ts` | `packages/client/src/game/network-entity-state.ts` | `packages/server/src/__tests__/bolo-spec/03-shooting.test.ts` | `verified` |  |

### 5. Terrain Damage

| ID | Requirement | Server Owner(s) | Client Owner(s) | Test Evidence | Status | Notes |
|---|---|---|---|---|---|---|
| `TER-01` | Direct-hit degradation chain | `packages/server/src/simulation/world.ts` | `packages/client/src/game/network-world-effects.ts` | `packages/server/src/__tests__/bolo-spec/04-terrain-damage.test.ts` | `verified` |  |
| `TER-02` | Explosion damage rules, roads survive | `packages/server/src/simulation/world.ts`, `packages/server/src/systems/combat-system.ts` | `packages/client/src/game/network-world-effects.ts` | `packages/server/src/__tests__/bolo-spec/04-terrain-damage.test.ts` | `verified` |  |
| `TER-03` | Crater flooding adjacent to water | `packages/server/src/simulation/world.ts`, `packages/server/src/systems/terrain-effects-system.ts` | `packages/client/src/game/network-world-effects.ts` | `packages/server/src/__tests__/bolo-spec/04-terrain-damage.test.ts` | `verified` |  |
| `TER-04` | Chain flooding for artificial rivers | `packages/server/src/simulation/world.ts`, `packages/server/src/systems/terrain-effects-system.ts` | `packages/client/src/game/network-world-effects.ts` | `packages/server/src/__tests__/bolo-spec/04-terrain-damage.test.ts` | `verified` |  |

### 6. Mines

| ID | Requirement | Server Owner(s) | Client Owner(s) | Test Evidence | Status | Notes |
|---|---|---|---|---|---|---|
| `MIN-01` | Quick mine placement and nearby visibility | `packages/server/src/game-session.ts`, `packages/server/src/systems/match-state-system.ts` | `packages/client/src/game/multiplayer-game.ts` | `packages/server/src/__tests__/bolo-spec/05-mines.test.ts` | `verified` |  |
| `MIN-02` | Builder-laid mine behavior and alliance visibility snapshots | `packages/server/src/systems/builder-system.ts`, `packages/server/src/systems/match-state-system.ts` | `packages/client/src/game/network-world-effects.ts` | `packages/server/src/__tests__/bolo-spec/05-mines.test.ts`, `packages/server/src/__tests__/bolo-spec/12-alliances.test.ts` | `verified` |  |
| `MIN-03` | Mine explosion radius and tank damage | `packages/server/src/systems/combat-system.ts`, `packages/server/src/simulation/world.ts` | `packages/client/src/audio/sound-manager.ts` | `packages/server/src/__tests__/bolo-spec/05-mines.test.ts` | `verified` |  |
| `MIN-04` | Chain reactions and checkerboard non-chain behavior | `packages/server/src/simulation/world.ts` | `packages/client/src/game/network-world-effects.ts` | `packages/server/src/__tests__/bolo-spec/05-mines.test.ts` | `verified` |  |
| `MIN-05` | Mine removal after detonation | `packages/server/src/systems/combat-system.ts`, `packages/server/src/systems/player-simulation-system.ts` | `packages/client/src/game/network-world-effects.ts` | `packages/server/src/__tests__/bolo-spec/05-mines.test.ts` | `verified` |  |

### 7. Boats

| ID | Requirement | Server Owner(s) | Client Owner(s) | Test Evidence | Status | Notes |
|---|---|---|---|---|---|---|
| `BOT-01` | Full-speed movement while on boat | `packages/server/src/systems/player-simulation-system.ts`, `packages/server/src/simulation/tank.ts` | `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/06-boats.test.ts`, `packages/server/src/__tests__/boat-movement.test.ts` | `verified` |  |
| `BOT-02` | Boarding BOAT restores RIVER | `packages/server/src/systems/player-simulation-system.ts` | `packages/client/src/game/network-world-effects.ts` | `packages/server/src/__tests__/bolo-spec/06-boats.test.ts`, `packages/server/src/__tests__/boat-movement.test.ts` | `verified` |  |
| `BOT-03` | Disembark leaves BOAT with opposite-facing orientation | `packages/server/src/systems/player-simulation-system.ts` | `packages/client/src/renderer/auto-tiler.ts`, `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/06-boats.test.ts`, `packages/server/src/__tests__/boat-movement.test.ts` | `verified` |  |
| `BOT-04` | Deep-sea traversal on boat | `packages/server/src/systems/player-simulation-system.ts` | `packages/client/src/game/multiplayer-game.ts` | `packages/server/src/__tests__/bolo-spec/06-boats.test.ts` | `verified` |  |
| `BOT-05` | Builder boat construction cost/timing constraints | `packages/server/src/systems/builder-system.ts` | `packages/client/src/input/builder-input.ts` | `packages/server/src/__tests__/bolo-spec/06-boats.test.ts`, `packages/server/src/__tests__/bolo-spec/10-builder.test.ts` | `verified` |  |
| `BOT-06` | Boat vulnerability (destroyed to river) | `packages/server/src/simulation/world.ts`, `packages/server/src/systems/combat-system.ts` | `packages/client/src/game/network-world-effects.ts` | `packages/server/src/__tests__/bolo-spec/06-boats.test.ts`, `packages/server/src/__tests__/bolo-spec/04-terrain-damage.test.ts` | `verified` |  |

### 8. Water Mechanics

| ID | Requirement | Server Owner(s) | Client Owner(s) | Test Evidence | Status | Notes |
|---|---|---|---|---|---|---|
| `WAT-01` | Drain shells/mines every 15 ticks in water without boat | `packages/server/src/systems/player-simulation-system.ts` | `packages/client/src/game/multiplayer-game.ts` | `packages/server/src/__tests__/bolo-spec/07-water-mechanics.test.ts` | `verified` | Tick-level integration assertions now validate real inventory depletion on cadence. |
| `WAT-02` | No drain while on boat | `packages/server/src/systems/player-simulation-system.ts` | `packages/client/src/game/multiplayer-game.ts` | `packages/server/src/__tests__/bolo-spec/07-water-mechanics.test.ts` | `verified` | Integration assertions confirm water tiles do not drain resources while `onBoat=true`. |
| `WAT-03` | River movement slowdown | `packages/server/src/simulation/world.ts`, `packages/server/src/simulation/tank.ts` | `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/02-tank-movement.test.ts` | `verified` |  |

### 9. Pillboxes

| ID | Requirement | Server Owner(s) | Client Owner(s) | Test Evidence | Status | Notes |
|---|---|---|---|---|---|---|
| `PIL-01` | Auto-targeting range/ownership rules | `packages/server/src/simulation/pillbox.ts`, `packages/server/src/systems/structure-simulation-system.ts` | `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts` | `verified` |  |
| `PIL-02` | Target-acquisition delay and predictive targeting | `packages/server/src/simulation/pillbox.ts`, `packages/server/src/systems/structure-simulation-system.ts` | `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts` | `verified` |  |
| `PIL-03` | Fire-rate aggravation/cooldown behavior | `packages/server/src/simulation/pillbox.ts` | `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts` | `verified` |  |
| `PIL-04` | Armor/disable rules (not permanently destroyed) | `packages/server/src/simulation/pillbox.ts` | `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts` | `verified` |  |
| `PIL-05` | Disabled pillbox pickup repairs and captures for tank team | `packages/server/src/simulation/tank.ts`, `packages/server/src/systems/player-simulation-system.ts` | `packages/client/src/game/multiplayer-game.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts`, `packages/server/src/__tests__/game-session.test.ts` | `verified` |  |
| `PIL-06` | Single pillbox mode: repair existing pillbox else place/build | `packages/server/src/systems/builder-system.ts` | `packages/client/src/input/builder-input.ts`, `packages/client/src/game/multiplayer-game.ts`, `packages/client/index.html` | `packages/server/src/systems/__tests__/builder-system.test.ts`, `packages/server/src/__tests__/game-session.test.ts`, `packages/client/src/__tests__/builder-input.test.ts` | `verified` | Fixed in commit `cc6e74f`. |
| `PIL-07` | Repairing pillbox does not change ownership | `packages/server/src/systems/builder-system.ts` | `packages/client/src/game/multiplayer-game.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts`, `packages/server/src/systems/__tests__/builder-system.test.ts` | `verified` |  |
| `PIL-08` | Forest concealment blocks pillbox targeting | `packages/server/src/simulation/world.ts`, `packages/server/src/simulation/pillbox.ts` | `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts` | `verified` |  |
| `PIL-09` | Default pillbox fire interval semantics (map vs fallback) | `packages/server/src/simulation/pillbox.ts`, `packages/server/src/systems/session-world-bootstrap.ts` | `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts`, `packages/server/src/systems/__tests__/session-world-bootstrap.test.ts` | `verified` | Explicit policy: map-authored speed is clamped/preserved (6..100); fallback spawns use classic 6-tick cadence. |

### 10. Bases

| ID | Requirement | Server Owner(s) | Client Owner(s) | Test Evidence | Status | Notes |
|---|---|---|---|---|---|---|
| `BAS-01` | Starting stocks and refuel range | `packages/server/src/simulation/base.ts` | `packages/client/src/game/multiplayer-game.ts` | `packages/server/src/__tests__/bolo-spec/09-bases.test.ts` | `verified` |  |
| `BAS-02` | Refuel transfer rates and cooldown | `packages/server/src/simulation/base.ts`, `packages/server/src/systems/structure-simulation-system.ts` | `packages/client/src/game/multiplayer-game.ts` | `packages/server/src/__tests__/bolo-spec/09-bases.test.ts` | `verified` |  |
| `BAS-03` | Neutral/friendly refuel ownership rules | `packages/server/src/simulation/base.ts` | `packages/client/src/game/multiplayer-game.ts` | `packages/server/src/__tests__/bolo-spec/09-bases.test.ts` | `verified` |  |
| `BAS-04` | Capture rules (drive-over neutral/depleted enemy) | `packages/server/src/systems/structure-simulation-system.ts`, `packages/server/src/simulation/base.ts` | `packages/client/src/game/network-world-effects.ts` | `packages/server/src/__tests__/bolo-spec/09-bases.test.ts` | `verified` | Shell hits deplete armor but do not directly transfer ownership. |
| `BAS-05` | Slow self-replenishment of stocks | `packages/server/src/simulation/base.ts` | `packages/client/src/game/multiplayer-game.ts` | `packages/server/src/__tests__/bolo-spec/09-bases.test.ts` | `verified` |  |

### 11. Builder / Man

| ID | Requirement | Server Owner(s) | Client Owner(s) | Test Evidence | Status | Notes |
|---|---|---|---|---|---|---|
| `BLD-01` | Builder lifecycle and movement states | `packages/server/src/simulation/builder.ts`, `packages/server/src/systems/builder-system.ts` | `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts` | `verified` |  |
| `BLD-02` | Harvesting forest to grass with tree gain | `packages/server/src/systems/builder-system.ts` | `packages/client/src/input/builder-input.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts` | `verified` |  |
| `BLD-03` | Road/wall costs and grass-only placement | `packages/server/src/systems/builder-system.ts` | `packages/client/src/input/builder-input.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts` | `verified` |  |
| `BLD-04` | Boat construction costs and timing | `packages/server/src/systems/builder-system.ts` | `packages/client/src/input/builder-input.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts`, `packages/server/src/__tests__/bolo-spec/06-boats.test.ts` | `verified` |  |
| `BLD-05` | Builder mine laying and mine inventory usage | `packages/server/src/systems/builder-system.ts` | `packages/client/src/input/builder-input.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts`, `packages/server/src/__tests__/bolo-spec/05-mines.test.ts` | `verified` |  |
| `BLD-06` | Builder vulnerability and respawn delay | `packages/server/src/simulation/builder.ts`, `packages/server/src/systems/combat-system.ts` | `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts`, `packages/server/src/systems/__tests__/combat-system.test.ts` | `verified` |  |
| `BLD-07` | Forest regrowth over time | `packages/server/src/systems/terrain-effects-system.ts`, `packages/server/src/systems/builder-system.ts` | `packages/client/src/game/network-world-effects.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts` | `verified` |  |

### 12. Tank Death and Respawn

| ID | Requirement | Server Owner(s) | Client Owner(s) | Test Evidence | Status | Notes |
|---|---|---|---|---|---|---|
| `DTH-01` | Death on armor<=0 and respawn reset rules | `packages/server/src/simulation/tank.ts`, `packages/server/src/systems/respawn-system.ts`, `packages/server/src/systems/player-simulation-system.ts` | `packages/client/src/game/network-entity-state.ts` | `packages/server/src/__tests__/bolo-spec/11-death-respawn.test.ts`, `packages/server/src/__tests__/game-session.test.ts` | `verified` |  |

### 13. Alliances

| ID | Requirement | Server Owner(s) | Client Owner(s) | Test Evidence | Status | Notes |
|---|---|---|---|---|---|---|
| `ALL-01` | Request/accept/create/leave alliance APIs | `packages/server/src/systems/match-state-system.ts`, `packages/server/src/game-session.ts` | `packages/client/src/game/multiplayer-game.ts` | `packages/server/src/__tests__/bolo-spec/12-alliances.test.ts` | `verified` |  |
| `ALL-02` | Allied pillboxes do not target allies | `packages/server/src/simulation/pillbox.ts`, `packages/server/src/systems/structure-simulation-system.ts` | `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/12-alliances.test.ts` | `verified` |  |
| `ALL-03` | Alliance mine-sharing behavior | `packages/server/src/systems/match-state-system.ts` | `packages/client/src/game/network-world-effects.ts` | `packages/server/src/__tests__/bolo-spec/12-alliances.test.ts`, `packages/server/src/__tests__/bolo-spec/05-mines.test.ts` | `verified` |  |
| `ALL-04` | Must leave old alliance before joining new one | `packages/server/src/systems/match-state-system.ts` | `packages/client/src/game/multiplayer-game.ts` | `packages/server/src/__tests__/bolo-spec/12-alliances.test.ts`, `packages/server/src/systems/__tests__/match-state-system.test.ts` | `verified` | Enforced in request/accept/create flows: teams with existing alliances must leave before forming a new one. |

### 14. Win Condition

| ID | Requirement | Server Owner(s) | Client Owner(s) | Test Evidence | Status | Notes |
|---|---|---|---|---|---|---|
| `WIN-01` | Match ends when one player/alliance controls all bases | `packages/server/src/systems/match-state-system.ts`, `packages/server/src/systems/session-update-pipeline.ts`, `packages/server/src/game-session.ts` | `packages/client/src/game/multiplayer-game.ts` | `packages/server/src/__tests__/bolo-spec/13-win-condition.test.ts`, `packages/server/src/systems/__tests__/match-state-system.test.ts` | `verified` |  |

## Explicit Discrepancy Notes

1. The summary text in `references/bolo-manual-reference.md` currently says shell hits capture pillboxes/bases in section 4.
   The implemented behavior and detailed sections 9/10 follow a different rule: shell hits deplete armor; ownership changes on pickup/drive-over capture logic.
