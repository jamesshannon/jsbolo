# Bolo Manual Traceability Matrix (HTML Baseline)

Source of truth: `references/MacBolo Instructions.html`  
Saved from: `https://dialup.party/~jolo/bolo/guides/bolomanual/`  
Last reset: 2026-02-13

## Reset Note

This matrix is a full restart from the raw HTML manual.

- Previous matrix content (derived from `references/bolo-manual-reference.md`) was removed.
- No prior `verified` status is carried forward.
- Every row below starts from the HTML text itself and is currently `pending` until re-audited.

## Status Legend

| Status | Meaning |
|---|---|
| `pending` | Requirement extracted from HTML, but code/test trace not yet audited. |
| `mapped` | Candidate owner files/tests identified; behavior still needs confirmation. |
| `verified` | Behavior confirmed in code and covered by explicit automated tests. |
| `deferred` | Intentionally postponed (requires design decision or out-of-scope work). |

## Audit Workflow (HTML-first)

1. Extract one normative requirement per row from `references/MacBolo Instructions.html`.
2. Attach concrete HTML evidence (line numbers and quoted concept).
3. Map server/client owner files.
4. Map unit/integration/scenario tests (existing or new).
5. Mark status and add discrepancy notes where implementation diverges.
6. Commit matrix updates in the same change as code/tests that close gaps.

## Matrix

### 1) Movement, Terrain, Boats, Water

| ID | Requirement (from HTML) | HTML Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `TRN-01` | Water is very slow unless on boat, and prolonged water exposure depletes shells/mines. | `references/MacBolo Instructions.html:176`, `references/MacBolo Instructions.html:177` | `packages/server/src/systems/player-simulation-system.ts`, `packages/server/src/simulation/world.ts` | `packages/server/src/__tests__/bolo-spec/07-water-mechanics.test.ts` | `pending` |  |
| `TRN-02` | Deep sea is instant death without boat and is not buildable terrain. | `references/MacBolo Instructions.html:183`, `references/MacBolo Instructions.html:184` | `packages/server/src/systems/player-simulation-system.ts`, `packages/server/src/systems/builder-system.ts` | `packages/server/src/__tests__/bolo-spec/02-tank-movement.test.ts`, `packages/server/src/__tests__/bolo-spec/10-builder.test.ts` | `pending` |  |
| `TRN-03` | Moored boats are boardable for fast travel by river/sea. | `references/MacBolo Instructions.html:191`, `references/MacBolo Instructions.html:193` | `packages/server/src/systems/player-simulation-system.ts` | `packages/server/src/__tests__/bolo-spec/06-boats.test.ts` | `pending` |  |
| `TRN-04` | Boats are sunk by one hit; tank dumped into water; deep sea without boat kills immediately. | `references/MacBolo Instructions.html:149`, `references/MacBolo Instructions.html:150`, `references/MacBolo Instructions.html:151` | `packages/server/src/simulation/world.ts`, `packages/server/src/systems/combat-system.ts`, `packages/server/src/systems/player-simulation-system.ts` | `packages/server/src/__tests__/bolo-spec/06-boats.test.ts`, `packages/server/src/__tests__/bolo-spec/04-terrain-damage.test.ts` | `pending` |  |
| `TRN-05` | Craters adjacent to water flood and can create waterways. | `references/MacBolo Instructions.html:215`, `references/MacBolo Instructions.html:216` | `packages/server/src/simulation/world.ts`, `packages/server/src/systems/terrain-effects-system.ts` | `packages/server/src/__tests__/bolo-spec/04-terrain-damage.test.ts` | `pending` |  |
| `TRN-06` | Forest provides concealment only when tank is fully enclosed on all sides. | `references/MacBolo Instructions.html:236`, `references/MacBolo Instructions.html:238` | `packages/server/src/simulation/world.ts`, `packages/server/src/simulation/pillbox.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts` | `pending` |  |
| `TRN-07` | Building damage progression: building -> damaged building -> rubble; rubble is traversable but very slow. | `references/MacBolo Instructions.html:247`, `references/MacBolo Instructions.html:252`, `references/MacBolo Instructions.html:253` | `packages/server/src/simulation/world.ts` | `packages/server/src/__tests__/bolo-spec/04-terrain-damage.test.ts` | `pending` |  |

### 2) Pillboxes, Bases, Win Objective

| ID | Requirement (from HTML) | HTML Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `PIL-01` | Pillboxes auto-shoot enemy tanks in range; provoked pillboxes can fire rapidly. | `references/MacBolo Instructions.html:294`, `references/MacBolo Instructions.html:295`, `references/MacBolo Instructions.html:296` | `packages/server/src/simulation/pillbox.ts`, `packages/server/src/systems/structure-simulation-system.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts` | `pending` |  |
| `PIL-02` | Pillboxes are disabled (not removed), can be driven over/picked up, repaired, and become loyal to player and allies. | `references/MacBolo Instructions.html:309`, `references/MacBolo Instructions.html:312`, `references/MacBolo Instructions.html:313` | `packages/server/src/systems/player-simulation-system.ts`, `packages/server/src/simulation/tank.ts`, `packages/server/src/simulation/pillbox.ts` | `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts` | `pending` |  |
| `PIL-03` | Picked-up pillboxes can later be placed back onto the map as defenses. | `references/MacBolo Instructions.html:315`, `references/MacBolo Instructions.html:316` | `packages/server/src/systems/builder-system.ts` | `packages/server/src/systems/__tests__/builder-system.test.ts` | `pending` |  |
| `BAS-01` | Bases refuel shells/mines/armor when tank drives onto base; base stocks visibly decrease while refueling. | `references/MacBolo Instructions.html:321`, `references/MacBolo Instructions.html:331`, `references/MacBolo Instructions.html:332` | `packages/server/src/simulation/base.ts`, `packages/server/src/systems/structure-simulation-system.ts` | `packages/server/src/__tests__/bolo-spec/09-bases.test.ts` | `pending` |  |
| `BAS-02` | Bases slowly replenish stocks automatically. | `references/MacBolo Instructions.html:332` | `packages/server/src/simulation/base.ts` | `packages/server/src/__tests__/bolo-spec/09-bases.test.ts` | `pending` |  |
| `BAS-03` | Base capture on drive-over; enemy cannot drive onto defended base until armor depleted by fire. | `references/MacBolo Instructions.html:333`, `references/MacBolo Instructions.html:335`, `references/MacBolo Instructions.html:336`, `references/MacBolo Instructions.html:337` | `packages/server/src/systems/structure-simulation-system.ts`, `packages/server/src/simulation/base.ts` | `packages/server/src/__tests__/bolo-spec/09-bases.test.ts` | `pending` |  |
| `WIN-01` | Game objective is to capture all refueling bases. | `references/MacBolo Instructions.html:341`, `references/MacBolo Instructions.html:342` | `packages/server/src/systems/match-state-system.ts` | `packages/server/src/__tests__/bolo-spec/13-win-condition.test.ts` | `pending` |  |

### 3) Farming, Building, Builder Lifecycle, Mines

| ID | Requirement (from HTML) | HTML Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `BLD-01` | Builder tool modes: farm, roads/bridges, buildings/boats, place/repair pillbox, lay mine. | `references/MacBolo Instructions.html:348`, `references/MacBolo Instructions.html:352`, `references/MacBolo Instructions.html:356`, `references/MacBolo Instructions.html:360`, `references/MacBolo Instructions.html:364` | `packages/client/src/input/builder-input.ts`, `packages/server/src/systems/builder-system.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts`, `packages/client/src/__tests__/builder-input.test.ts` | `pending` |  |
| `BLD-02` | Builder leaves tank, performs action at clicked map tile, and returns. | `references/MacBolo Instructions.html:372`, `references/MacBolo Instructions.html:373` | `packages/server/src/simulation/builder.ts`, `packages/server/src/systems/builder-system.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts` | `pending` |  |
| `BLD-03` | Build costs: road/bridge/building = 0.5 tree; pillbox = 1 tree; boat = 5 trees. | `references/MacBolo Instructions.html:377`, `references/MacBolo Instructions.html:378`, `references/MacBolo Instructions.html:380`, `references/MacBolo Instructions.html:381` | `packages/server/src/systems/builder-system.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts`, `packages/server/src/__tests__/bolo-spec/06-boats.test.ts` | `pending` |  |
| `BLD-04` | Build restrictions: cannot build on deep sea, moored boat, or forest. | `references/MacBolo Instructions.html:383`, `references/MacBolo Instructions.html:384` | `packages/server/src/systems/builder-system.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts` | `pending` |  |
| `BLD-05` | Pillbox mode is unified: repair existing pillbox if present; otherwise place pillbox. | `references/MacBolo Instructions.html:386`, `references/MacBolo Instructions.html:388` | `packages/server/src/systems/builder-system.ts`, `packages/client/src/input/builder-input.ts` | `packages/server/src/systems/__tests__/builder-system.test.ts`, `packages/client/src/__tests__/builder-input.test.ts` | `pending` |  |
| `BLD-06` | Repair can target enemy pillboxes and does not imply ownership change; repair cost scales up to 1 tree by damage. | `references/MacBolo Instructions.html:388`, `references/MacBolo Instructions.html:389`, `references/MacBolo Instructions.html:390`, `references/MacBolo Instructions.html:391` | `packages/server/src/systems/builder-system.ts` | `packages/server/src/systems/__tests__/builder-system.test.ts`, `packages/server/src/__tests__/bolo-spec/08-pillboxes.test.ts` | `pending` |  |
| `BLD-07` | Builder can be killed while outside tank; replacement builder is parachuted after delay. | `references/MacBolo Instructions.html:407`, `references/MacBolo Instructions.html:409`, `references/MacBolo Instructions.html:410` | `packages/server/src/simulation/builder.ts`, `packages/server/src/systems/combat-system.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts` | `pending` |  |
| `BLD-08` | Forest regrows slowly over time. | `references/MacBolo Instructions.html:411` | `packages/server/src/systems/terrain-effects-system.ts` | `packages/server/src/__tests__/bolo-spec/10-builder.test.ts` | `pending` |  |
| `MIN-01` | Builder-laid mines are hidden to observers while laying; quick mines are an alternative mode. | `references/MacBolo Instructions.html:394`, `references/MacBolo Instructions.html:395`, `references/MacBolo Instructions.html:396` | `packages/server/src/systems/builder-system.ts`, `packages/server/src/game-session.ts` | `packages/server/src/__tests__/bolo-spec/05-mines.test.ts` | `pending` |  |
| `MIN-02` | Alliance mine intel is shared only for mines laid during alliance; pre/post mines remain private. | `references/MacBolo Instructions.html:400`, `references/MacBolo Instructions.html:402`, `references/MacBolo Instructions.html:403`, `references/MacBolo Instructions.html:404` | `packages/server/src/systems/match-state-system.ts` | `packages/server/src/__tests__/bolo-spec/05-mines.test.ts`, `packages/server/src/__tests__/bolo-spec/12-alliances.test.ts` | `pending` |  |
| `MIN-03` | Adjacent mines chain-detonate; checkerboard placement avoids full chain. | `references/MacBolo Instructions.html:487`, `references/MacBolo Instructions.html:488`, `references/MacBolo Instructions.html:490` | `packages/server/src/simulation/world.ts`, `packages/server/src/systems/combat-system.ts` | `packages/server/src/__tests__/bolo-spec/05-mines.test.ts` | `pending` |  |
| `MIN-04` | Mines can be cleared by direct shell hit; range/gunsight can help probe suspected minefields. | `references/MacBolo Instructions.html:526`, `references/MacBolo Instructions.html:527`, `references/MacBolo Instructions.html:528` | `packages/server/src/systems/combat-system.ts`, `packages/client/src/renderer/renderer.ts` | `packages/server/src/__tests__/bolo-spec/05-mines.test.ts` | `pending` |  |

### 4) Alliances and Team Semantics

| ID | Requirement (from HTML) | HTML Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `ALL-01` | Formal alliance request/invite flow via menus. | `references/MacBolo Instructions.html:421`, `references/MacBolo Instructions.html:424`, `references/MacBolo Instructions.html:426` | `packages/server/src/systems/match-state-system.ts`, `packages/server/src/game-session.ts` | `packages/server/src/__tests__/bolo-spec/12-alliances.test.ts` | `pending` |  |
| `ALL-02` | If already allied, player must leave alliance before joining another. | `references/MacBolo Instructions.html:437`, `references/MacBolo Instructions.html:438` | `packages/server/src/systems/match-state-system.ts` | `packages/server/src/__tests__/bolo-spec/12-alliances.test.ts`, `packages/server/src/systems/__tests__/match-state-system.test.ts` | `pending` |  |
| `ALL-03` | Leaving alliance: carried pillboxes stay with leaving player; active placed pillboxes remain with alliance. | `references/MacBolo Instructions.html:444`, `references/MacBolo Instructions.html:446`, `references/MacBolo Instructions.html:447` | `packages/server/src/systems/match-state-system.ts`, `packages/server/src/systems/player-simulation-system.ts` | `packages/server/src/__tests__/bolo-spec/12-alliances.test.ts` | `pending` |  |
| `ALL-04` | Cancel request prevents involuntary alliance acceptance. | `references/MacBolo Instructions.html:461`, `references/MacBolo Instructions.html:463`, `references/MacBolo Instructions.html:464` | `packages/server/src/systems/match-state-system.ts`, `packages/server/src/game-server.ts` | `packages/server/src/__tests__/bolo-spec/12-alliances.test.ts` | `pending` |  |
| `ALL-05` | Allied pillboxes should not shoot allies after alliance is declared. | `references/MacBolo Instructions.html:420`, `references/MacBolo Instructions.html:421` | `packages/server/src/simulation/pillbox.ts`, `packages/server/src/systems/structure-simulation-system.ts` | `packages/server/src/__tests__/bolo-spec/12-alliances.test.ts` | `pending` |  |

### 5) HUD, Screen Semantics, and Visual Parity

| ID | Requirement (from HTML) | HTML Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `HUD-01` | Right-side info boxes show status for tanks, pillboxes, and bases. | `references/MacBolo Instructions.html:545` | `packages/client/src/game/multiplayer-game.ts`, `packages/client/src/renderer/renderer.ts` | `packages/client/src/__tests__/*` | `pending` |  |
| `HUD-02` | Color semantics: red hostile, green friendly, hollow circle = own tank (info display). | `references/MacBolo Instructions.html:550`, `references/MacBolo Instructions.html:552`, `references/MacBolo Instructions.html:554` | `packages/client/src/renderer/sprites.ts`, `packages/client/src/renderer/renderer.ts` | `packages/client/src/__tests__/*` | `pending` |  |
| `HUD-03` | On-map own tank is identified by black turret; hostile/friendly turrets are red/green. | `references/MacBolo Instructions.html:603`, `references/MacBolo Instructions.html:604`, `references/MacBolo Instructions.html:605` | `packages/client/src/renderer/renderer.ts` | `packages/client/src/__tests__/renderer*.test.ts` | `pending` |  |
| `HUD-04` | Neutral-vs-owned visual distinction for pillboxes and bases uses checkerboard/dotted patterns at game start. | `references/MacBolo Instructions.html:563`, `references/MacBolo Instructions.html:565`, `references/MacBolo Instructions.html:571`, `references/MacBolo Instructions.html:573` | `packages/client/src/renderer/sprites.ts`, `packages/client/src/renderer/renderer.ts` | `packages/client/src/__tests__/renderer*.test.ts` | `pending` |  |
| `HUD-05` | Carried pillboxes use shrunken icons in info boxes. | `references/MacBolo Instructions.html:558`, `references/MacBolo Instructions.html:559` | `packages/client/src/game/multiplayer-game.ts`, `packages/client/src/renderer/renderer.ts` | `packages/client/src/__tests__/renderer*.test.ts` | `pending` |  |
| `HUD-06` | Base stock bars show closest friendly base: shells, mines, armor. | `references/MacBolo Instructions.html:581`, `references/MacBolo Instructions.html:583`, `references/MacBolo Instructions.html:584`, `references/MacBolo Instructions.html:585` | `packages/client/src/game/multiplayer-game.ts` | `packages/client/src/__tests__/*` | `pending` |  |
| `HUD-07` | Tank stock bars show shells, mines, armor, and building materials. | `references/MacBolo Instructions.html:593`, `references/MacBolo Instructions.html:594` | `packages/client/src/game/multiplayer-game.ts` | `packages/client/src/__tests__/*` | `pending` |  |
| `HUD-08` | Pillbox damage should be readable from visual appearance. | `references/MacBolo Instructions.html:273`, `references/MacBolo Instructions.html:614`, `references/MacBolo Instructions.html:615` | `packages/client/src/renderer/sprites.ts`, `packages/client/src/renderer/renderer.ts` | `packages/client/src/__tests__/renderer*.test.ts` | `pending` |  |
| `HUD-09` | Color-blind mode must provide alternate hostile/friendly scheme. | `references/MacBolo Instructions.html:619`, `references/MacBolo Instructions.html:758` | `packages/client/src/main.ts`, `packages/client/src/renderer/renderer.ts` | `packages/client/src/__tests__/*` | `pending` |  |
| `ART-01` | Terrain tiles in-game should remain substantially consistent with `terrain01.gif`...`terrain17.gif` semantics. | `references/MacBolo Instructions.html:167`, `references/MacBolo Instructions.html:287` | `packages/client/src/renderer/sprites.ts`, `packages/client/public/*` | visual audit + image diff harness (TBD) | `pending` | Substantial similarity target, not pixel-perfect identity. |
| `ART-02` | Builder tool button icons should map to manual tool semantics (`tool1.gif`...`tool5.gif`). | `references/MacBolo Instructions.html:348`, `references/MacBolo Instructions.html:364` | `packages/client/src/input/builder-input.ts`, `packages/client/index.html` | `packages/client/src/__tests__/builder-input.test.ts` | `pending` |  |

### 6) Messaging, Player Selection, Brains

| ID | Requirement (from HTML) | HTML Evidence | Owner Candidates | Test Candidates | Status | Notes |
|---|---|---|---|---|---|---|
| `MSG-01` | Player menu supports directed messaging to selected players. | `references/MacBolo Instructions.html:805`, `references/MacBolo Instructions.html:806` | `packages/server/src/game-server.ts`, `packages/server/src/game-session.ts`, `packages/client/src/network/network-client.ts` | `packages/server/src/__tests__/game-server-chat.test.ts` | `pending` |  |
| `MSG-02` | Player selection includes “Select Nearby Tanks” within 12 squares. | `references/MacBolo Instructions.html:811`, `references/MacBolo Instructions.html:812` | `packages/client/src/game/multiplayer-game.ts`, `packages/server/src/game-session.ts` | `packages/server/src/__tests__/game-session.test.ts` | `pending` |  |
| `MSG-03` | User-togglable message channels: Newswire, Assistant, AI Brain messages. | `references/MacBolo Instructions.html:780`, `references/MacBolo Instructions.html:782`, `references/MacBolo Instructions.html:784`, `references/MacBolo Instructions.html:788` | `packages/client/src/main.ts`, `packages/server/src/systems/hud-message-service.ts` | `packages/server/src/systems/__tests__/hud-message-service.test.ts` | `pending` |  |
| `BOT-01` | Standard Autopilot mode can temporarily control/defend tank when player leaves keyboard. | `references/MacBolo Instructions.html:680`, `references/MacBolo Instructions.html:681`, `references/MacBolo Instructions.html:682` | `packages/server/src/systems/bot-input-system.ts`, `packages/bots/*` | `packages/server/src/__tests__/bot-startup.test.ts` | `pending` |  |
| `BOT-02` | Brains are extensible and loaded from a “Brains” folder, appearing in Control menu. | `references/MacBolo Instructions.html:705`, `references/MacBolo Instructions.html:706`, `references/MacBolo Instructions.html:707` | `packages/bots/*`, future plugin loader package (TBD) | `packages/server/src/__tests__/game-server-bot-admin.test.ts` | `pending` | Current architecture may intentionally differ; confirm target compatibility policy. |

## Discrepancy Notes (new baseline)

None recorded yet.  
All discrepancies from the previous matrix must be re-validated directly against the HTML source before re-adding.
