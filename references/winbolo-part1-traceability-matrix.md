# WinBolo Manual Part 1 Traceability Matrix

Source of truth: `references/winbolo Manual - part 1 - how to play.pdf`  
Scope: Sections `2.9` through `2.10` (gameplay, HUD/screen semantics, brains).  
Last audited: 2026-02-16

## Status Legend

| Status | Meaning |
|---|---|
| `verified` | Behavior is implemented and covered by explicit automated tests. |
| `mapped` | Likely implemented or partially implemented; coverage or parity is incomplete. |
| `missing` | Not implemented in current client/server behavior. |
| `deferred` | Intentionally out of scope for current version/phase. |
| `failing` | Implemented behavior materially contradicts the manual requirement. |
| `informational` | Manual guidance/tactics note, not a strict product requirement. |

## Matrix

### 2.9.1 Driving the Tank

| ID | Requirement | Manual Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `DRV-01` | Default driving keys match documented controls (`Q/A`, `O/P`, `Tab`, `Space`). | `§2.9.1`, p.9 | `packages/client/src/input/keyboard.ts` | `packages/client/src/__tests__/input-mapping.test.ts` | `failing` | Current defaults are mixed (`Q`, `Z/S`, arrows, numpad, `Space`) and `Tab` quick-mine binding is not in client input. |
| `DRV-02` | Key assignments can be changed by players. | `§2.9.1`, p.9 | `packages/client/src/input/keyboard.ts` | none | `missing` | No runtime keybinding/rebind UI/config is present. |

### 2.9.2 Beginning the Game

| ID | Requirement | Manual Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `BGN-01` | Tank begins out at sea on a boat. | `§2.9.2`, p.9 | `packages/server/src/simulation/map-loader.ts`, `packages/server/src/systems/session-player-manager.ts` | `packages/server/src/__tests__/bolo-spec/01-tank-spawning.test.ts` | `mapped` | Spawn is map/start-position driven; no universal "start at sea on boat" rule is enforced. |
| `BGN-02` | Boats cannot pass under low floating bridges; player must disembark or destroy bridge. | `§2.9.2`, p.9 | `packages/server/src/systems/player-simulation-system.ts`, `packages/server/src/simulation/world.ts` | `packages/server/src/__tests__/bolo-spec/06-boats.test.ts` | `mapped` | Boat/bridge interactions are modeled, but this exact constraint is not explicitly asserted in current tests. |
| `BGN-03` | Boats are sunk by one hit; tank dumped into water; deep sea without boat kills immediately. | `§2.9.2`, p.9 | `packages/server/src/systems/combat-system.ts`, `packages/server/src/systems/player-simulation-system.ts`, `packages/server/src/simulation/world.ts` | `packages/server/src/__tests__/bolo-spec/06-boats.test.ts`, `packages/server/src/__tests__/bolo-spec/02-tank-movement.test.ts` | `verified` |  |

### 2.9.3 Terrain

| ID | Requirement | Manual Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `TRN-01` | Water is very slow without boat and drains shells/mines over time. | `§2.9.3`, p.10 | `packages/server/src/systems/player-simulation-system.ts` | `packages/server/src/__tests__/bolo-spec/07-water-mechanics.test.ts` | `verified` |  |
| `TRN-02` | Deep sea is instant death without boat, non-buildable, and immutable. | `§2.9.3`, p.10 | `packages/server/src/systems/player-simulation-system.ts`, `packages/server/src/systems/builder-system.ts`, `packages/server/src/simulation/world.ts` | `packages/server/src/__tests__/bolo-spec/02-tank-movement.test.ts`, `packages/server/src/__tests__/bolo-spec/10-builder.test.ts` | `mapped` | Instant-death + build restrictions are covered; explicit "immutable throughout game" assertion is not separately tested. |
| `TRN-03` | Moored boats are boardable and provide fast travel by river/sea. | `§2.9.3`, p.10 | `packages/server/src/systems/player-simulation-system.ts` | `packages/server/src/__tests__/bolo-spec/06-boats.test.ts` | `verified` |  |
| `TRN-04` | Swamp slows tanks significantly. | `§2.9.3`, p.10 | `packages/server/src/simulation/tank.ts`, `packages/server/src/simulation/world.ts` | `packages/server/src/__tests__/bolo-spec/02-tank-movement.test.ts` | `mapped` | Terrain speed modeling exists; explicit swamp-speed parity test is limited. |
| `TRN-05` | Mines can be laid on valid terrain and damage tanks on contact/explosion. | `§2.9.3`, p.10 | `packages/server/src/game-session.ts`, `packages/server/src/systems/player-simulation-system.ts`, `packages/server/src/simulation/world.ts` | `packages/server/src/__tests__/bolo-spec/05-mines.test.ts` | `verified` |  |
| `TRN-06` | Mine craters are slow and flood when adjacent to water. | `§2.9.3`, p.10 | `packages/server/src/systems/terrain-effects-system.ts`, `packages/server/src/simulation/world.ts` | `packages/server/src/__tests__/bolo-spec/04-terrain-damage.test.ts`, `packages/server/src/systems/__tests__/terrain-effects-system.test.ts` | `verified` |  |
| `TRN-07` | Roads/bridges provide fast traversal. | `§2.9.3`, p.11 | `packages/server/src/simulation/tank.ts` | `packages/server/src/__tests__/bolo-spec/02-tank-movement.test.ts` | `mapped` | Fast-terrain behavior exists; not all speed ratios are asserted against manual text. |
| `TRN-08` | Forest slows tanks and provides concealment when fully enclosed. | `§2.9.3`, p.11 | `packages/server/src/simulation/world.ts`, `packages/server/src/simulation/pillbox.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts`, `packages/server/src/__tests__/bolo-spec/10-builder.test.ts` | `verified` |  |
| `TRN-09` | Building damage progression: building -> damaged building -> rubble; rubble is slow but traversable. | `§2.9.3`, p.11 | `packages/server/src/simulation/world.ts` | `packages/server/src/__tests__/bolo-spec/04-terrain-damage.test.ts` | `verified` |  |
| `TRN-10` | Pillbox states include damaged/dead visuals with damage readability. | `§2.9.3`, p.12 | `packages/client/src/renderer/renderer.ts` | `packages/client/src/renderer/__tests__/renderer-structures.test.ts` | `verified` |  |
| `TRN-11` | Dead pillbox can be driven over to pick up. | `§2.9.3`, p.12 | `packages/server/src/systems/player-simulation-system.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts` | `verified` |  |
| `TRN-12` | Refueling base provides shells/mines/armor when occupied. | `§2.9.3`, p.12 | `packages/server/src/systems/structure-simulation-system.ts`, `packages/server/src/simulation/base.ts` | `packages/server/src/__tests__/bolo-spec/09-bases.test.ts` | `verified` |  |

### 2.9.4 Pillboxes

| ID | Requirement | Manual Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `PIL-01` | Pillboxes auto-target enemies in range and fire rapidly when provoked. | `§2.9.4`, p.12 | `packages/server/src/simulation/pillbox.ts`, `packages/server/src/systems/structure-simulation-system.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts` | `verified` |  |
| `PIL-02` | Disabled pillboxes are pick-up capable and convert loyalty to player/alliance after capture. | `§2.9.4`, p.12 | `packages/server/src/systems/player-simulation-system.ts`, `packages/server/src/systems/match-state-system.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts`, `packages/server/src/__tests__/bolo-spec/12-alliances.test.ts` | `verified` |  |
| `PIL-03` | Captured pillboxes can be placed back on map for defense. | `§2.9.4`, p.12 | `packages/server/src/systems/builder-system.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts`, `packages/server/src/systems/__tests__/builder-system.test.ts` | `verified` |  |

### 2.9.5 Refuelling Bases and Win Condition

| ID | Requirement | Manual Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `BAS-01` | Tank starts with limited resources and must refuel at bases. | `§2.9.5`, p.12 | `packages/server/src/systems/session-player-manager.ts`, `packages/server/src/simulation/tank.ts` | `packages/server/src/__tests__/bolo-spec/01-tank-spawning.test.ts` | `verified` |  |
| `BAS-02` | Nearest base stocks are shown in HUD and decrease during refuel. | `§2.9.5`, p.12 | `packages/client/src/game/hud-nearest-base.ts`, `packages/server/src/systems/structure-simulation-system.ts` | `packages/client/src/__tests__/hud-nearest-base.test.ts`, `packages/server/src/__tests__/bolo-spec/09-bases.test.ts` | `verified` |  |
| `BAS-03` | Bases slowly replenish stocks automatically. | `§2.9.5`, p.12 | `packages/server/src/simulation/base.ts` | `packages/server/src/__tests__/bolo-spec/09-bases.test.ts` | `verified` |  |
| `BAS-04` | Drive-over capture, defended-base denial, armor depletion before hostile capture. | `§2.9.5`, p.12 | `packages/server/src/systems/structure-simulation-system.ts` | `packages/server/src/__tests__/bolo-spec/09-bases.test.ts` | `verified` |  |
| `WIN-01` | Match objective: capture all refueling bases. | `§2.9.5`, p.12 | `packages/server/src/systems/match-state-system.ts` | `packages/server/src/__tests__/bolo-spec/13-win-condition.test.ts`, `packages/server/src/systems/__tests__/match-state-system.test.ts` | `verified` |  |

### 2.9.6 Farming and Building

| ID | Requirement | Manual Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `BLD-01` | Builder modes: farm, roads/bridges, buildings/boats, pillbox (place/repair), mine. | `§2.9.6`, p.13 | `packages/client/src/input/builder-input.ts`, `packages/server/src/systems/builder-system.ts` | `packages/client/src/__tests__/builder-input.test.ts`, `packages/server/src/__tests__/bolo-spec/10-builder.test.ts` | `verified` |  |
| `BLD-02` | Builder leaves tank, performs task at tile, returns to tank. | `§2.9.6`, p.13 | `packages/server/src/simulation/builder.ts`, `packages/server/src/systems/builder-system.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts` | `verified` |  |
| `BLD-03` | Build costs: roads/bridges/buildings `0.5` tree, pillbox `1` tree, boat `5` trees. | `§2.9.6`, p.13 | `packages/server/src/systems/builder-system.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts`, `packages/server/src/__tests__/bolo-spec/06-boats.test.ts` | `verified` |  |
| `BLD-04` | Cannot build on deep sea, moored boat, or forest. | `§2.9.6`, p.13 | `packages/server/src/systems/builder-system.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts` | `mapped` | Deep-sea/forest restrictions are covered; moored-boat prohibition is not explicitly asserted. |
| `BLD-05` | Pillbox mode repairs existing pillbox; otherwise places new pillbox. | `§2.9.6`, p.13 | `packages/server/src/systems/builder-system.ts`, `packages/client/src/input/builder-input.ts` | `packages/server/src/systems/__tests__/builder-system.test.ts` | `verified` |  |
| `BLD-06` | Repairing enemy pillboxes is allowed; repair cost scales by damage; repair alone does not claim ownership. | `§2.9.6` + `§2.9.13`, pp.13,16 | `packages/server/src/systems/builder-system.ts`, `packages/server/src/systems/player-simulation-system.ts` | `packages/server/src/systems/__tests__/builder-system.test.ts`, `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts` | `verified` |  |
| `BLD-07` | Builder-laid mines are stealthier than quick mines and can be laid remotely. | `§2.9.6`, p.13 | `packages/server/src/systems/builder-system.ts`, `packages/server/src/systems/match-state-system.ts` | `packages/server/src/__tests__/bolo-spec/05-mines.test.ts`, `packages/server/src/__tests__/bolo-spec/10-builder.test.ts` | `verified` |  |
| `BLD-08` | Mine intel is shared with allies only for mines laid during alliance period. | `§2.9.6`, p.13 | `packages/server/src/systems/match-state-system.ts` | `packages/server/src/__tests__/bolo-spec/05-mines.test.ts`, `packages/server/src/systems/__tests__/match-state-system.test.ts` | `verified` |  |
| `BLD-09` | If builder dies outside tank, replacement builder arrives after delay. | `§2.9.6`, p.13 | `packages/server/src/simulation/builder.ts`, `packages/server/src/systems/respawn-system.ts`, `packages/server/src/systems/combat-system.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts`, `packages/server/src/systems/__tests__/respawn-system.test.ts` | `mapped` | Respawn exists, but manual "several minutes" timing parity is not asserted. |
| `BLD-10` | Forest regrows over time. | `§2.9.6`, p.13 | `packages/server/src/systems/terrain-effects-system.ts` | `packages/server/src/systems/__tests__/terrain-effects-system.test.ts` | `verified` |  |

### 2.9.7 Alliances

| ID | Requirement | Manual Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `ALL-01` | Formal request/accept alliance flow controls friendly-fire behavior for pillboxes. | `§2.9.7`, p.14 | `packages/server/src/systems/match-state-system.ts`, `packages/server/src/simulation/pillbox.ts` | `packages/server/src/__tests__/bolo-spec/12-alliances.test.ts`, `packages/server/src/systems/__tests__/match-state-system.test.ts` | `verified` |  |
| `ALL-02` | Player must leave existing alliance before joining another. | `§2.9.7`, p.14 | `packages/server/src/systems/match-state-system.ts` | `packages/server/src/systems/__tests__/match-state-system.test.ts` | `verified` |  |
| `ALL-03` | Leaving alliance is supported at any time. | `§2.9.7`, p.14 | `packages/server/src/systems/match-state-system.ts` | `packages/server/src/__tests__/bolo-spec/12-alliances.test.ts` | `verified` |  |
| `ALL-04` | Alliance mine-sharing excludes pre-alliance mines. | `§2.9.7`, p.14 | `packages/server/src/systems/match-state-system.ts` | `packages/server/src/__tests__/bolo-spec/05-mines.test.ts` | `verified` |  |

### 2.9.8 Building a Fortress (Tactics)

| ID | Requirement | Manual Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `FOR-01` | Adjacent mine chain reactions and checkerboard mitigation strategy. | `§2.9.8`, p.14 | `packages/server/src/simulation/world.ts` | `packages/server/src/__tests__/bolo-spec/05-mines.test.ts` | `verified` |  |
| `FOR-02` | Mine-crater flooding can create artificial waterways/moats. | `§2.9.8`, p.14 | `packages/server/src/systems/terrain-effects-system.ts` | `packages/server/src/systems/__tests__/terrain-effects-system.test.ts` | `verified` |  |
| `FOR-03` | Forest can conceal attackers; defensive downside near bases. | `§2.9.8`, p.14 | `packages/server/src/simulation/world.ts`, `packages/server/src/simulation/pillbox.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts` | `verified` |  |

### 2.9.9 Mine Laying and 2.9.10 Mine Clearing

| ID | Requirement | Manual Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `MIN-01` | Two mine-laying modes exist: builder-laid and quick drop (`Tab`). | `§2.9.9`, p.15 | `packages/server/src/game-session.ts`, `packages/client/src/input/keyboard.ts`, `packages/client/src/input/builder-input.ts` | `packages/server/src/__tests__/bolo-spec/05-mines.test.ts`, `packages/client/src/__tests__/builder-input.test.ts` | `mapped` | Server supports quick-mine semantics (`dropQuickMine`), but client keybinding/UI path for quick mine is missing. |
| `MIN-02` | Quick-dropped mines are visible to nearby tanks. | `§2.9.9`, p.15 | `packages/server/src/systems/match-state-system.ts`, `packages/server/src/game-session.ts` | `packages/server/src/__tests__/bolo-spec/05-mines.test.ts` | `verified` |  |
| `CLR-01` | Adjustable gun range supports deliberate mine detonation. | `§2.9.10`, p.15 | `packages/server/src/simulation/tank.ts`, `packages/server/src/systems/combat-system.ts`, `packages/client/src/game/input-mapping.ts` | `packages/server/src/__tests__/bolo-spec/03-shooting.test.ts`, `packages/server/src/__tests__/bolo-spec/05-mines.test.ts`, `packages/client/src/__tests__/input-mapping.test.ts` | `verified` |  |
| `CLR-02` | Manual range controls match documented keys (`+`, `9`) and scroll wheel behavior. | `§2.9.10`, p.15 | `packages/client/src/input/keyboard.ts`, `packages/client/src/game/multiplayer-game.ts` | `packages/client/src/__tests__/input-mapping.test.ts` | `failing` | Current controls use `=` and `-`; `9`/scroll-wheel behavior is not implemented as documented. |

### 2.9.11 The Screen

| ID | Requirement | Manual Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `HUD-01` | Right-side info boxes report tank/pillbox/base status. | `§2.9.11`, p.15 | `packages/client/src/game/multiplayer-game.ts`, `packages/client/src/game/hud-tank-status.ts`, `packages/client/src/game/hud-structure-chips.ts` | `packages/client/src/__tests__/hud-tank-status.test.ts`, `packages/client/src/__tests__/hud-structure-chips.test.ts` | `verified` |  |
| `HUD-02` | Color semantics: hostile red, friendly green; own-tank marker is special in tank status. | `§2.9.11`, p.15 | `packages/client/src/game/hud-tank-status.ts`, `packages/client/src/renderer/color-palette.ts` | `packages/client/src/__tests__/hud-tank-status.test.ts`, `packages/client/src/renderer/__tests__/color-palette.test.ts` | `mapped` | Team relation semantics are covered; exact hollow-circle shape parity is not explicitly asserted. |
| `HUD-03` | Carried pillboxes show shrunken status icon variants by relation. | `§2.9.11`, p.15 | `packages/client/src/game/hud-structure-chips.ts` | `packages/client/src/__tests__/hud-structure-chips.test.ts` | `verified` |  |
| `HUD-04` | Neutral pillboxes and bases use special neutral patterns distinct from owned/hostile states. | `§2.9.11`, p.15 | `packages/client/src/game/hud-structure-chips.ts`, `packages/client/src/renderer/renderer.ts` | `packages/client/src/__tests__/hud-structure-chips.test.ts`, `packages/client/src/renderer/__tests__/renderer-structures.test.ts` | `verified` |  |
| `HUD-05` | Base stock bars show nearest friendly base shells/mines/armor. | `§2.9.11`, p.15 | `packages/client/src/game/hud-nearest-base.ts`, `packages/client/src/game/multiplayer-game.ts` | `packages/client/src/__tests__/hud-nearest-base.test.ts` | `verified` |  |
| `HUD-06` | Tank stock bars show shells/mines/armor/building materials. | `§2.9.11`, pp.15-16 | `packages/client/src/game/multiplayer-game.ts` | `packages/client/src/__tests__/network-entity-state.test.ts` | `mapped` | Data path exists; full DOM bar rendering parity is not deeply asserted. |
| `HUD-07` | Map tank turret colors: hostile red, friendly green, self black. | `§2.9.11`, p.16 | `packages/client/src/renderer/renderer.ts` | `packages/client/src/renderer/__tests__/renderer-structures.test.ts` | `mapped` | Implemented in renderer; no dedicated pixel/color assertion for all three relations. |
| `HUD-08` | Base and pillbox map visuals communicate ownership and pillbox damage state. | `§2.9.11`, p.16 | `packages/client/src/renderer/renderer.ts` | `packages/client/src/renderer/__tests__/renderer-structures.test.ts` | `verified` |  |

### 2.9.12 Remote Views

| ID | Requirement | Manual Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `REM-01` | Pillbox-view mode cycles through own/allied pillboxes; cursor keys navigate neighboring pillboxes. | `§2.9.12`, p.16 | `packages/client/src/game/multiplayer-game.ts`, `packages/client/src/renderer/camera.ts` | none | `missing` | No remote pillbox camera/view mode is currently implemented. |

### 2.9.13 Notes (Normative Mechanical Clause)

| ID | Requirement | Manual Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `NTE-01` | Repairing dead/damaged pillbox does not transfer ownership; ownership requires pickup by tank. | `§2.9.13`, p.16 | `packages/server/src/systems/builder-system.ts`, `packages/server/src/systems/player-simulation-system.ts` | `packages/server/src/systems/__tests__/builder-system.test.ts`, `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts` | `verified` |  |

### 2.9.14 Other Maps

| ID | Requirement | Manual Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `MAP-01` | Client game setup supports choosing alternate map before start. | `§2.9.14`, p.17 | `packages/client` setup UI, `packages/server/src/game-server.ts` | none | `missing` | Server accepts map path at startup, but client-side "Choose Map" flow is not present. |

### 2.10 Brains / Play Without Network

| ID | Requirement | Manual Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `BRN-01` | Brain/autopilot can temporarily control tank when user leaves keyboard. | `§2.10`, p.18 | `packages/bots`, `packages/server/src/systems/bot-input-system.ts` | `packages/server/src/__tests__/bot-startup.test.ts`, `packages/server/src/systems/__tests__/bot-input-system.test.ts` | `mapped` | Server bots exist, but manual’s per-client brain handoff/menu flow is not implemented. |
| `BRN-02` | "Allow computer tanks" style game setting controls bot availability. | `§2.10`, p.18 | `packages/server/src/index.ts`, `restart-dev.sh` | `packages/server/src/__tests__/game-server-bot-admin.test.ts`, `packages/server/src/__tests__/bot-lifecycle.test.ts` | `verified` | Implemented via startup/env policy (`ALLOW_BOTS`, `MAX_BOTS`, `BOT_COUNT`, profile options). |
| `BRN-03` | Brains appear from a `Brains` folder and are selectable via client Brain menu. | `§2.10`, p.18 | `packages/bots`, future plugin loader package | none | `deferred` | Current implementation uses built-in server profiles; no dynamic client menu/plugin folder loading yet. |
| `BRN-04` | One brain per running copy/client instance. | `§2.10`, p.18 | `packages/server/src/systems/bot-runtime-adapter.ts` | `packages/server/src/__tests__/bot-lifecycle.test.ts` | `mapped` | Runtime currently enforces bot-player lifecycle centrally, not per-legacy-client process semantics. |

## Immediate Gaps Highlighted by This Matrix

1. Input parity gaps: default key layout, key rebinding, and mine-clearing key semantics (`DRV-01`, `DRV-02`, `CLR-02`).
2. Missing manual UI flows: remote pillbox view and map chooser (`REM-01`, `MAP-01`).
3. Legacy brain/menu semantics are only partially represented by server-side bots (`BRN-01`, `BRN-03`, `BRN-04`).
