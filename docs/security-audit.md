# Security Audit

**Status:** In progress — Phase 1 (fixes + tests) complete 2026-02-16.

---

## Overview

JSBolo is a multiplayer WebSocket-based game (Node.js server, browser client, Protocol Buffers protocol). The server-authoritative architecture is a strong baseline: clients cannot directly set positions, armor, or resources, and the binary Protocol Buffers format prevents text injection and rejects structurally invalid messages.

This document records findings, remediation status, and design decisions from the ongoing audit.

---

## Finding Status

### Category 1: Security Exploits

| ID | Finding | Severity | Status | Notes |
|----|---------|----------|--------|-------|
| S1 | No WebSocket message size limit | HIGH | **Fixed** | Added `maxPayload: 16384` to `WebSocketServer` in `game-server.ts` |
| S2 | Chat text relay as-is | MEDIUM | **No fix needed** | Server truncates to 160 chars. Client escapes before `innerHTML`. Documented in test. |
| S3 | Unbounded chat recipient array | MEDIUM | **Fixed** | `recipientPlayerIds.slice(0, MAX_PLAYERS)` before processing in `game-session.ts` |
| S4 | Silent error on malformed messages | LOW | **Fixed** | Disconnect after 5 consecutive decode errors (`game-server.ts`). Counter resets on valid message. |
| S5 | Debug overlay XSS via `mapName` | MEDIUM | **Fixed** | `escapeHtml()` applied before `innerHTML` in `debug-overlay.ts` |
| S6 | Debug overlay XSS via `terrainInfo` | LOW | **Fixed** | `escapeHtml()` applied to `terrainInfo.terrain` in `debug-overlay.ts` |

### Category 2: Gameplay Exploits

| ID | Finding | Severity | Status | Notes |
|----|---------|----------|--------|-------|
| G1 | No input rate limiting | HIGH | **Fixed** | Sliding-window limiter: 100 msg/sec max, excess dropped silently (`game-server.ts`) |
| G2 | No build order coordinate validation | HIGH | **Fixed** | `Number.isFinite()` + clamp `[0, MAP_SIZE_TILES-1]` in `sanitizeBuildOrder()` (`game-session.ts`) |
| G3 | No build action enum validation | MEDIUM | **Fixed** | Set-membership check against valid `BuildAction` values; invalid → rejected (`game-session.ts`) |
| G4 | No rangeAdjustment enum validation | LOW | **Fixed** | Set-membership check; invalid value reset to `NONE` before applying (`game-session.ts`) |
| G5 | Mine chain reaction unbounded | MEDIUM | **Fixed** | `ServerWorld.MAX_CHAIN_DETONATIONS = 256` cap in BFS loop (`world.ts`) |
| G6 | Builder distance not validated | INFO | **No fix** (by design) | Bolo allows sending builder anywhere; walking time acts as natural rate limit |

### Category 3: Information Disclosure

| ID | Finding | Severity | Status | Notes |
|----|---------|----------|--------|-------|
| I1 | Full map terrain sent on connect | HIGH | **Open — gap** | Welcome builder sends full 256×256 terrain; viewport-scoped updates contradict this. See note. |
| I2 | All enemy tank stats visible in welcome | HIGH | **Fixed** | `shells`, `mines`, `trees`, `firingRange`, `reload` zeroed for non-self tanks in `session-welcome-builder.ts` |
| I3 | Pillbox/base state globally broadcast | MEDIUM | **Open — explicit trade-off** | Deliberately kept global for HUD status panes. See note. |
| I4 | Enemy tank resources in updates | MEDIUM | **Fixed** | Resources zeroed for enemy tanks in `session-state-broadcaster.ts`; hash is view-dependent |
| I5 | Sound events broadcast globally | LOW | **Open** | Future: filter by audible range relative to viewport. Tracked for Phase 2. |

### Category 4: DoS / Resource Exhaustion

| ID | Finding | Severity | Status | Notes |
|----|---------|----------|--------|-------|
| D1 | No WebSocket message size limit | HIGH | **Fixed** | Same as S1 |
| D2 | No connection rate limiting | MEDIUM | **Open** | Not yet implemented. Tracked for Phase 2 auth work. |
| D3 | No per-player message rate limit | HIGH | **Fixed** | Same as G1 |
| D4 | MAX_PLAYERS not enforced on accept | MEDIUM | **Fixed** | `addPlayer()` checks `players.size >= MAX_PLAYERS`; closes with code `1013` if full |
| D5 | Mine chain CPU spike | MEDIUM | **Fixed** | Same as G5 |

### Category 5: Session / Identity (Deferred)

All items in this category require an authentication subsystem. Tests are written but skipped.

| ID | Finding | Severity | Status | Notes |
|----|---------|----------|--------|-------|
| A1 | No authentication | CRITICAL | **Deferred** | Any WebSocket connection accepted as player. Tracked for auth phase. |
| A2 | No session tokens | HIGH | **Deferred** | No reconnect-as-same-player mechanism |
| A3 | Player ID assigned without verification | HIGH | **Deferred** | No HMAC/signature on playerId |
| A4 | No TLS enforcement | MEDIUM | **Deferred** | Server accepts plain `ws://`. TLS handled at reverse-proxy level in prod. |

---

## Test Coverage

| Test File | Scope | Tests |
|-----------|-------|-------|
| `packages/server/src/__tests__/security/input-validation.test.ts` | G2–G4, S2–S3 | 11 active |
| `packages/server/src/__tests__/security/dos-resilience.test.ts` | S1, S4, D1–D5, G1, G5 | 7 active |
| `packages/server/src/__tests__/security/information-disclosure.test.ts` | I1–I4 | 4 active |
| `packages/server/src/__tests__/security/session-identity.test.ts` | A1–A4 | 4 skipped (deferred) |
| `packages/client/src/__tests__/security/xss-prevention.test.ts` | S5–S6 | 5 active |

---

## Open / Future Work

- **D2**: Connection-level rate limiting (rapid connect/disconnect cycling). Depends on auth phase.
- **I5**: Viewport-scoped sound event filtering. Low priority; sound position reveals little given full-map visibility (I1).
- **Category 5 (A1–A4)**: Full auth implementation — session tokens, TLS enforcement, reconnect flow.

---

## Design Decisions and Notes

### I1: Full map terrain in welcome (gap)

The `SessionStateBroadcaster` enforces viewport-scoped terrain delivery for updates: only tiles within the player's viewport + 1-tile prefetch ring are sent as terrain changes. However, `SessionWelcomeBuilder` bypasses this entirely and sends the full 256×256 terrain array on connect.

Whether this is acceptable depends on the intended semantics of the viewport system:
- If viewport scoping is a **bandwidth optimization** (send only what the client is rendering), sending the full terrain on welcome is fine — the client needs it to render immediately when the player pans the camera.
- If viewport scoping is a **gameplay fog-of-war mechanic** (players should only discover terrain they've visited), the welcome message is a genuine gap that defeats the mechanic.

This distinction has not yet been decided. The finding is left open pending a decision. Note: mine positions are NOT included in the terrain array (they are managed separately via the mine visibility system), so the terrain disclosure does not directly reveal mine locations.

### I3: Pillbox/base global broadcast (explicit trade-off)

This was a deliberate choice made during the visibility streaming implementation, not inherited Bolo behavior. The comment in `session-state-broadcaster.ts` states: *"Pillboxes and bases are global strategic structures shown in HUD status panes regardless of current viewport source, so keep these streams global."*

The consequence is that all players know the position, armor, and ownership of every pillbox and base on the map at all times, even ones they've never visited. This enables the minimap/status HUD but undermines any fog-of-war mechanic for structure discovery. If structure discovery fog-of-war is wanted in future, pillboxes and bases need viewport filtering and the HUD would need to fall back to "unknown" state for out-of-range structures.

### G6: Builder distance

Builder can be sent to any tile on the map. The physical walk time is the rate limit. Not a vulnerability.

### S2: Chat content

Chat content is not sanitized server-side because the server only relays text into HUD message objects; the client escapes all HUD text before `innerHTML` insertion.
