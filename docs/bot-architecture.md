# Bot (Brains) Architecture Plan

## Context

This document defines how to implement classic Bolo-style "Brains" in `jsbolo` with modern multiplayer architecture.

## What WinBolo Did

WinBolo implemented Brains as client-side plug-ins:

- Brain modules exported `BrainMain` (`OPEN`, `CLOSE`, `THINK`, `MENU` operations).
- Brains were loaded at runtime from dynamic modules (`.brn`/DLL on Windows, `.so` on Linux).
- Brain logic ran in the client event loop and returned key/build/chat outputs through a shared `BrainInfo` struct.
- The protocol exposed server flags for AI policy (`allow_AI`, `assist_AI`).

Reference paths (local):

- `references/winbolo/winbolo/trunk/winbolo/docs/Brains/How to write plug-in brains.txt`
- `references/winbolo/winbolo/trunk/winbolo/docs/Brains/Brain.h`
- `references/winbolo/winbolo/trunk/winbolo/src/gui/win32/brainsHandler.c`
- `references/winbolo/winbolo/trunk/winbolo/src/bolo/screen.c`
- `references/winbolo/std-autopilot/Standard Autopilot.c`

## Design Goals For JSBolo

1. Keep multiplayer authoritative and cheat-resistant.
2. Preserve deterministic simulation where possible.
3. Reuse the existing server tick/update pipeline.
4. Support classic-style autopilot behavior profiles over time.
5. Keep room for optional local "auto-play" mode in browser clients.

## Implementation Options

### Option A: Browser Auto-Mode (one client window/tab per bot)

How it works:
- Start additional browser clients and toggle each into auto mode.

Pros:
- Closest user experience to historic "run another client and enable brain".
- No server bot logic required initially.

Cons:
- Expensive and fragile at scale (many tabs/windows).
- Not authoritative: bot input can be tampered with like any normal client.
- Hard to guarantee deterministic behavior.
- Coupled to renderer/input loop timing.

### Option B: Headless Bot Clients (separate process)

How it works:
- Run Node-based bot workers that connect over WebSocket as normal players.

Pros:
- Clear separation from game server process.
- Reuses public network protocol.

Cons:
- Still non-authoritative and easier to exploit.
- Extra process management and deployment complexity.
- Duplicate prediction/state handling logic.

### Option C: Server-Authoritative Bot Controllers (Recommended)

How it works:
- Add bot players directly inside server session state.
- Each tick, bot controllers compute `PlayerInput` from an observation and feed the same pipeline as humans.

Pros:
- Matches modern multiplayer architecture used by most competitive games.
- Deterministic and replay-friendly.
- Low runtime overhead.
- Single source of truth for simulation and rules.

Cons:
- Requires explicit bot interfaces and lifecycle in server code.
- Slightly less "classic" from a runtime topology perspective (but behavior can remain classic).

## Recommendation

Implement Option C as the primary path, and optionally add Option A later as a client feature for debugging/sandbox play.

## Proposed Server Design

### 1. Bot Controller Interface

Add a small interface in server code:

- `init(context): void`
- `think(observation): PlayerInput`
- `onEvent(event): void` (optional)
- `shutdown(): void`

Keep `think()` pure from the caller perspective so test harnesses can snapshot and compare outputs.

### 2. Session Integration

Integrate before simulation tick:

1. Gather human `lastInput`.
2. Compute bot inputs for this tick.
3. Write bot input into session player state.
4. Run existing `SessionUpdatePipeline`.

This keeps one authoritative input merge point per tick.

### 3. Player Model Changes

Extend session player metadata:

- `controlType: 'human' | 'bot'`
- `botId?: string`
- `botProfile?: string`

No separate entity model is needed; bots should use the same `ServerTank` and inventory rules as humans.

### 4. Match/Config Flags

Add session options (server-owned):

- `allowBots: boolean`
- `maxBots: number`
- `botAssistMode: 'off' | 'standard' | 'advantage'`

This mirrors classic intent of `allow_AI`/`assist_AI` while keeping naming clear.

### 5. Observability

Add structured logs for:

- Bot join/leave
- Bot profile selected
- Input generation failures/fallback behavior

Do not spam per-tick logs unless debug mode is enabled.

## Rollout Plan

### Milestone 1: Infrastructure

- Add bot-capable session player model.
- Add bot registry/manager.
- Add one deterministic `IdleBot` and one simple `PatrolBot`.
- Add unit tests for bot lifecycle and tick input injection.

### Milestone 2: Classic Autopilot Baseline

- Implement behavior priorities from WinBolo autopilot patterns:
  - move toward strategic targets
  - engage nearby enemies
  - basic resource use (shell/mine conservation)
- Add integration tests for stable multi-tick behavior.

### Milestone 3: Policy and Fairness

- Enforce `allowBots`/`botAssistMode` policy.
- Define allowed observation scope (full map vs fog-limited).
- Add tests preventing bots from bypassing normal player constraints.

### Milestone 4: Optional Client Auto-Mode

- Add local client auto-mode toggle for sandbox/debug use.
- Keep it explicitly non-authoritative; server still validates and simulates everything.

## Test Strategy

1. Unit tests:
   - Controller output for fixed observations.
   - Policy gates (`allowBots`, `maxBots`, assist mode).
2. Integration tests:
   - Human + bot session progression over many ticks.
   - Deterministic replay snapshots for the same seed/input stream.
3. Regression tests:
   - Bots cannot exceed movement, firing, builder, or inventory limits.

## Notes

- This plan intentionally separates "where bot code executes" (server) from "what bot behavior feels like" (classic Bolo-style priorities).
- The initial implementation should prioritize correctness and determinism over advanced tactics.
