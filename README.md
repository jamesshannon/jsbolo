# JSBolo

A modern TypeScript implementation of the classic Bolo tank warfare game.

## Status

This project is actively in development.

- `DEVELOPMENT.md` is the authoritative progress log.
- `ROADMAP.md` contains the current four-phase plan.

Current implementation includes multiplayer server simulation, tank combat, builder workflows, pillboxes, bases (partial), mines, terrain effects, and client audio/rendering support.

## Tech Stack

- Language: TypeScript
- Client: Vite + Canvas 2D
- Server: Node.js + WebSocket (`ws`)
- Shared protocol/types: workspace package (`@jsbolo/shared`)
- Package manager: pnpm workspaces

Networking currently uses JSON messages. Protocol Buffers artifacts exist in the repo for future optimization work.

## Project Structure

```text
jsbolo/
├── packages/
│   ├── shared/    # Shared types, constants, protocol helpers
│   ├── client/    # Browser game client
│   └── server/    # Multiplayer game server
├── DEVELOPMENT.md
├── ROADMAP.md
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js >= 18
- pnpm >= 8

## Setup

```bash
pnpm install
pnpm build
```

## Running Locally

### Option 1: Helper Script (client + server)

```bash
./restart-dev.sh
```

### Option 2: Start Individually

```bash
# Terminal 1: server
cd packages/server
pnpm dev

# Terminal 2: client
cd packages/client
pnpm dev
```

### Default Ports

- Client dev server: `http://localhost:3000`
- Backend game server: `ws://localhost:8080`
- Alternate backend port usage during development: `8081` (if configured)

## Testing

```bash
# Entire workspace
pnpm -r test

# Type-check
pnpm -r type-check

# Build
pnpm -r build
```

## Controls (Current)

- Move: `Q` / `W` / `ArrowUp`
- Brake: `Z` / `S` / `ArrowDown`
- Turn: `A` / `D` / `ArrowLeft` / `ArrowRight` / numpad `/` `*`
- Shoot: `Space` / numpad `0`
- Range: `+` / `-`
- Builder actions: `T`, `D`, `R`, `W`, `B`, `P`, `M`, `C`/`Esc`

## License

GPL-2.0 (inherited from original Bolo ecosystem assets and project direction).
