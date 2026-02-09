# JSBolo

A modern TypeScript implementation of the classic Bolo tank warfare game.

## About

Bolo is a top-down tank warfare game originally created by Stuart Cheshire for the BBC Micro (1987) and later ported to Macintosh (1989-1995). This project recreates Bolo using modern web technologies while staying faithful to the original game mechanics.

## Features (Planned)

- **Phase 1** (Current): ✅ Basic single-player tank movement and rendering
- **Phase 2**: Multiplayer networking with WebSockets
- **Phase 3**: Full game mechanics (builder, pillboxes, bases, terrain modification)
- **Phase 4**: Polish (sounds, effects, UI, lobby system)

## Technology Stack

- **Language**: TypeScript (Google Style Guide)
- **Build**: Vite (client) + tsc (server)
- **Networking**: WebSockets with Protocol Buffers
- **Rendering**: HTML5 Canvas 2D
- **Package Manager**: pnpm (workspaces)

## Project Structure

```
jsbolo/
├── packages/
│   ├── shared/    # Shared types, constants, protocol definitions
│   ├── client/    # Browser game client
│   └── server/    # Game server (multiplayer)
├── package.json
└── pnpm-workspace.yaml
```

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Running

```bash
# Development mode (client only for Phase 1)
cd packages/client
pnpm dev

# Open browser to http://localhost:3000
```

## Controls

Following the original Bolo keybindings:

- **Q**: Accelerate
- **A**: Brake/Reverse
- **Numpad /**: Turn left
- **Numpad ***: Turn right
- **Arrow Left/Right**: Alternative turning
- **Numpad 0 / Space**: Shoot
- **+/-**: Increase/decrease firing range

## Credits

- **Original Bolo**: © 1993 Stuart Cheshire
- **Graphics & Sounds**: From original Bolo (GPL v2)
- **WinBolo**: John Morrison (reference implementation)
- **Orona**: Stéphan Kochen (browser port, used as reference)

## License

GPL-2.0 (inherited from original Bolo)

## Development Status

**Phase 1: Basic Single-Player** ✅ COMPLETE
- [x] Project structure setup
- [x] Sprite extraction and documentation
- [x] Basic terrain rendering
- [x] Tank sprite rendering (16 directions)
- [x] Keyboard input
- [x] Tank movement physics
- [x] Camera following tank
- [x] Game loop (fixed timestep)

**Phase 2: Multiplayer Foundation** (Next)
- [ ] Protocol Buffer implementation
- [ ] WebSocket server
- [ ] Client-server communication
- [ ] Multiple tanks
- [ ] Client-side prediction
- [ ] Server reconciliation

**Phase 3: Full Game Mechanics** (Future)
- [ ] Builder/LGM system
- [ ] Pillboxes
- [ ] Bases
- [ ] Terrain modification
- [ ] Combat system
- [ ] Mines

**Phase 4: Polish** (Future)
- [ ] Sound effects
- [ ] Particle effects
- [ ] HUD/UI
- [ ] Lobby system
- [ ] Map editor
