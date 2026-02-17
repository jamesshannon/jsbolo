# WinBolo Part 2 (Reference) Implementation Notes

Scope: `references/winbolo Manual - part 2 - reference.pdf`, sections 3.1 through 3.7.

Purpose: treat this manual as a product/implementation reference (UI, operations, tooling), not as authoritative gameplay rules.

## How This Document Should Be Used

- Use this as a backlog feeder for UX, server operations, diagnostics, and performance controls.
- Do not use this to override gameplay behavior defined by the MacBolo reference/manual traceability work.
- Where this document conflicts with existing gameplay requirements, defer to gameplay sources.

## Adopt (High Value Now)

1. Messaging scopes and anti-flood UX
- Source: 3.1.15 (All Players / All Allies / Nearby / Selected; brief send cooldown)
- Why adopt: aligns with existing server-side recipient filtering and improves chat usability/abuse resistance.
- Suggested implementation:
  - Add explicit UI selectors for send scope (rather than only slash commands).
  - Add client send cooldown indicator synchronized with server enforcement.

2. In-game diagnostics surfaces
- Source: 3.1.12 (System Information), 3.1.13 (Network Information)
- Why adopt: directly useful for debugging latency/prediction and performance regressions.
- Suggested implementation:
  - Add developer HUD panels: FPS/frame time, RTT/jitter, packet/update rates, prediction correction counters.
  - Keep behind debug toggle for normal users.

3. Server admin controls parity
- Source: 3.3 (dedicated server args + lock/unlock/say/kick/info/savemap)
- Why adopt: provides a proven control surface for real operations.
- Suggested implementation:
  - Extend startup/env controls for map, match rules, player cap, start delay, time limit.
  - Add admin endpoints or CLI commands for lock/unlock, announce, kick, status snapshot.

4. Localhost-first admin binding
- Source signal: dedicated server ops orientation + safety expectations
- Why adopt: consistent with current security hardening direction.
- Suggested implementation:
  - Keep `CONTROL_HOST=127.0.0.1` default and document explicit opt-in for remote admin access.

## Defer (Valuable, Not V1-Critical)

1. Full key customization UX
- Source: 3.1.14
- Defer reason: useful, but not required for core gameplay correctness.
- Future: settings UI + persisted key profiles.

2. Match setup completeness
- Source: 3.1.6 (game styles, hidden mines toggle, start delay, time limit)
- Defer reason: several pieces already exist; full host UI is larger product work.
- Future: host setup screen with validation and saved presets.

3. LAN/Internet game finder and tracker integration
- Source: 3.1.7, 3.1.8
- Defer reason: requires discovery/tracker infrastructure and operational policy.
- Future: optional service component and API.

4. Dedicated server command UX parity
- Source: 3.3 command console behavior
- Defer reason: control API exists; interactive command shell parity is lower priority.

## Reject / Legacy-Specific (Do Not Port Directly)

1. Platform-specific legacy behavior
- Source: 3.4, 3.5 (DirectX/ISA sound/Winsock-era troubleshooting)
- Reject reason: obsolete for current TS/web stack; keep only as historical context.

2. Exact menu/window structure replication
- Source: 3.1/3.2 window-by-window design
- Reject reason: UI architecture differs (browser client). Reuse intent, not exact form.

3. Treating part 2 as gameplay authority
- Source: 3.6 has behavior notes mixed with architecture differences
- Reject reason: gameplay traceability should remain tied to gameplay manuals/spec and code tests.

## Specific Notes from 3.6 and 3.7 to Carry Forward

1. Client/server tradeoff documentation
- Capture prediction/reconciliation behavior and expected occasional corrections in developer docs.

2. Performance controls
- Offer user-facing controls for frame rate and label density to reduce client load.

3. Alliance UX semantics
- Use as a secondary reference for alliance request/accept/leave UX flows, but verify against primary gameplay docs.

## Recommended Next Step

Create a small implementation epic named `winbolo-part2-ops-ux` with these first tasks:
1. Chat scope UI + cooldown indicator.
2. Debug diagnostics overlay (network + prediction counters).
3. Host/admin setup expansion (start delay, time limit, max players) with localhost-safe defaults.
