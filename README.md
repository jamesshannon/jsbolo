# JSBolo

A modern TypeScript implementation of the classic Bolo tank warfare game.

## Status

This repo is in active development with a playable multiplayer core.

- `DEVELOPMENT.md` is the current engineering log.
- `ROADMAP.md` tracks planned phases.
- Manual parity tracking lives in `references/winbolo-part1-traceability-matrix.md`.

Implemented highlights include:

- Server-authoritative simulation and visibility windows
- Protocol Buffers binary network protocol over WebSocket
- Pillboxes, bases, mines, builder workflows, terrain effects
- Remote pillbox view (`V`) with server-authoritative camera source
- HUD ticker and chat with server-side recipient filtering
- Bot v1 with startup configuration

## Tech Stack

- Language: TypeScript
- Workspace: pnpm monorepo
- Client: Vite + Canvas 2D
- Server: Node.js + `ws`
- Shared protocol/types: `@jsbolo/shared`
- Bots package: `@jsbolo/bots`

## Project Structure

```text
jsbolo/
├── packages/
│   ├── shared/   # protocol, shared types, constants
│   ├── server/   # authoritative simulation + websocket server
│   ├── client/   # browser renderer/input/HUD
│   └── bots/     # built-in bot profiles and bot contracts
├── docs/
├── references/
├── DEVELOPMENT.md
└── ROADMAP.md
```

## Prerequisites

- Node.js >= 18
- pnpm >= 8

## Setup

```bash
pnpm install
pnpm -r build
```

## Run Locally

### Helper script (recommended)

```bash
./restart-dev.sh
```

### Start manually

```bash
# Terminal 1
cd packages/server && pnpm dev

# Terminal 2
cd packages/client && pnpm dev
```

### Ports

- Client dev server: `http://localhost:3000`
- Game WebSocket server: `ws://localhost:8080`
- Server control/status HTTP API: `http://localhost:8081` (non-production default)

## Deployment Security Note

- WebSocket handshake origin validation is enforced by server allowlist.
- Configure `ALLOWED_WS_ORIGINS` for deployment (comma-separated origins), for example:
  - `ALLOWED_WS_ORIGINS=https://play.example.com,https://staging.example.com`
- Default local origins are `http://localhost:3000` and `http://127.0.0.1:3000`.
- Bot control HTTP API binds to `127.0.0.1` by default; set `CONTROL_HOST` explicitly to expose it.

## Bot Startup Configuration

Used by `restart-dev.sh` and `packages/server/src/main.ts`:

- `ALLOW_BOTS` (`true`/`false`)
- `MAX_BOTS` (integer)
- `BOT_ALLIANCE_MODE` (`all-bots` or `none`)
- `BOT_COUNT` (integer startup bots)
- `BOT_PROFILE` (`tactical`, `patrol`, `idle`)
- `ALLOW_BOT_ONLY_SIM` (`true`/`false`)
- `CONTROL_HOST` (defaults to `127.0.0.1`)

### Debug Logging Flags

- `DEBUG_NETWORK_INPUT=true` enables detailed per-input server logs.
- `DEBUG_PROTOCOL_ERRORS=true` enables full decode error stack logging.
- `DEBUG_WELCOME_TERRAIN=true` enables verbose welcome terrain histogram/sample logging.
- `DEBUG_TERRAIN_UPDATES=true` enables verbose terrain update broadcast logs.

## Testing and Quality

```bash
pnpm -r type-check
pnpm -r test
pnpm -r build
```

CI (`.github/workflows/ci.yml`) enforces type-check, test, build, and runtime protocol smoke checks on pull requests.

## Controls (current defaults)

- Accelerate: `Q` / `W` / `ArrowUp`
- Brake: `Z` / `S` / `ArrowDown`
- Turn: `A` / `D` / `ArrowLeft` / `ArrowRight` / numpad `/` `*`
- Shoot: `Space` / numpad `0`
- Range: `+` / `-`
- Builder: `T`, `D`, `R`, `W`, `B`, `P`, `M`, `C`/`Esc`
- Remote pillbox view toggle: `V`

## License

GPL-2.0
