# HUD Message Policy

Date: 2026-02-13  
Status: Adopted for v1 implementation planning

## Purpose

Define a server-authoritative HUD ticker/message policy for JSBolo that is:

- consistent with classic Bolo/WinBolo behavior where it matters,
- practical for current architecture,
- explicit enough to implement and test without ambiguity.

## Reference Baseline

Primary behavior references used:

- WinBolo message categories and filters in `references/winbolo/winbolo/trunk/winbolo/src/bolo/messages.h`
- WinBolo concrete message strings in `references/winbolo/winbolo/trunk/winbolo/src/server/win32/resource.rc`
- WinBolo capture/steal message emission in:
  - `references/winbolo/winbolo/trunk/winbolo/src/bolo/bases.c`
  - `references/winbolo/winbolo/trunk/winbolo/src/bolo/pillbox.c`
- WinBolo quit/alliance/chat scope behavior in:
  - `references/winbolo/winbolo/trunk/winbolo/src/bolo/players.c`
  - `references/winbolo/winbolo/trunk/winbolo/src/gui/linux/dialogmessages.c`
- Orona chat behavior (`msg`, `teamMsg`) in:
  - `references/orona/src/server/application.coffee`
  - `references/orona/src/client/world/client.coffee`

## Message Taxonomy

All HUD/ticker entries must be one of these classes:

- `global_notification`
  - major game-state events visible to all players.
- `alliance_notification`
  - alliance/team-scoped events, visible only to allies.
- `personal_notification`
  - events visible only to the local player.
- `chat_global`
  - player-authored chat to everyone.
- `chat_alliance`
  - player-authored chat to allies.
- `system_status`
  - optional operational info (network/server status), off by default in gameplay.

## Audience and Visibility Rules

- `global_notification`: delivered to all active players.
- `alliance_notification`: delivered to players allied with the actor at send time.
- `personal_notification`: delivered only to a specific player.
- `chat_global`: delivered to all active players.
- `chat_alliance`: delivered to allied players only.
- `system_status`: delivered according to client preference; default hidden.

No message should be client-generated as authoritative gameplay truth.  
Clients may derive local cosmetic hints, but authoritative event messages come from server events.

## Event Catalog (v1)

### Global notifications

- Player joined game.
- Player left game.
- Neutral base captured.
- Neutral pillbox captured.
- Base stolen from player.
- Pillbox stolen from player.
- Match ended (winner/team result when implemented).

### Alliance notifications

- Alliance request received.
- Alliance accepted.
- Alliance left/broken.
- Allied chat.

### Personal notifications

- Builder lost.
- Action rejected due to inventory/state constraints.
  - Example: cannot place pillbox, insufficient trees/mines.
- Private or local-only instructional notices.

### Chat

- Global chat (`chat_global`)
- Alliance chat (`chat_alliance`)

v1 does not include nearby/selected-recipient chat. That is a deferred enhancement.

## Explicit Exclusions (v1)

To avoid ticker spam and align with classic feel:

- No per-hit combat ticker messages.
- No per-shot or per-tick fire events.
- No repetitive refuel/stock tick spam.

Kills are optional for v1 and should stay behind a config flag until volume is validated.

## Queueing Model

Each client has a HUD queue maintained server-side as a logical stream:

- ordered by `(tick, sequence)` for deterministic playback,
- bounded length (default 64),
- bounded message lifetime (default 12 seconds),
- with collapse/coalescing for duplicate repeated events in a short window.

Coalescing rule example:

- repeated identical `personal_notification` within 2 seconds can increment a counter instead of adding new rows.

Priority classes:

- `high`: match result, major ownership changes.
- `normal`: join/leave, alliance events, chat.
- `low`: local assistant/status hints.

On overflow, drop oldest `low`, then oldest `normal`, never dropping `high` unless queue is fully saturated by `high`.

## Ingress: How Messages Enter the Queue

Messages are emitted from server-side gameplay systems through a single entry point:

- `HudMessageService.publish(event)`

Event producers (examples):

- player/session lifecycle system (join/leave),
- structure ownership system (base/pillbox capture and steal),
- alliance system (request/accept/leave),
- builder/action validation system,
- chat command handlers.

Each producer emits typed domain events; `HudMessageService` maps them to message payloads and audience.

## Dispatch: How Messages Reach Users

Delivery path:

1. Domain event emitted during simulation tick.
2. `HudMessageService` maps to HUD message and audience set.
3. Message appended to recipient queues with `(tick, sequence, class, priority, text)`.
4. Outbound network packet includes incremental HUD entries for each client.
5. Client ticker appends and scrolls entries by server order.

Disconnect/reconnect behavior:

- On reconnect, send only current active queue tail (last N entries) for context.
- Do not replay full historical logs to ticker.

## Formatting Policy

Message text should be concise and stable for tests.

Preferred style:

- `<Player> captured a Neutral Base`
- `<Player> captured a Neutral Pillbox`
- `<Player> just stole base from <OtherPlayer>`
- `<Player> just stole pillbox from <OtherPlayer>`
- `<Player> has quit game`
- `<Player> just lost builder`

Keep wording close to classic WinBolo semantics unless modernized intentionally.

## Client Controls (v1)

Client supports per-class visibility toggles:

- show global notifications (default on)
- show alliance notifications (default on)
- show personal notifications (default on)
- show chat (default on)
- show system status (default off)

Muted classes still enqueue server-side but are filtered in client rendering.

## Testing Requirements

Unit tests:

- event-to-message mapping correctness,
- audience routing correctness,
- queue ordering and overflow policy,
- coalescing behavior.

Integration tests:

- capture/steal events create expected recipient-visible messages,
- alliance messages only reach allies,
- personal notices only reach actor,
- reconnect receives queue tail and not full history,
- no per-hit spam under sustained combat.

Scenario tests:

- multi-player session with mixed alliance and structure events validates end-to-end ticker stream.

## Implementation Plan

Phase A: Message domain model

- Add shared HUD message types and payload schema.
- Add server `HudMessageService` with deterministic sequencing.

Phase B: Event emitters

- Wire join/leave, capture/steal, alliance, builder validation, and chat to message service.

Phase C: Network transport and client ticker

- Add HUD message stream to server->client protocol.
- Render ticker with class filters and capped history.

Phase D: Hardening

- Add queue coalescing, overflow policy tests, and reconnect behavior tests.
- Verify message volume in bot-heavy sessions.

## Deferred Items

- Nearby chat and selected-recipient chat.
- Rich sender formatting and team-color name rendering.
- Runtime admin controls for message policy.
- Localization and i18n string packs.

