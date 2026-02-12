# Development Log

## Phase 1 Setup - Complete ✅

### Date: 2026-02-08

### Completed Tasks

#### 1. Project Structure Setup ✅
- Created monorepo with pnpm workspaces
- Set up 3 packages: `shared`, `client`, `server`
- Configured TypeScript with Google Style Guide
- Configured ESLint and Prettier
- Set up Vite for client development

#### 2. Sprite Asset Extraction ✅
- Copied sprite sheets from Orona:
  - `base.png` - Main terrain and entity sprites (32x32 tiles)
  - `styled.png` - Tank sprites (16 directions, 2 rows: land/boat)
  - `hud.png` - HUD elements
- Created comprehensive sprite atlas documentation
- Documented terrain types and sprite coordinates

#### 3. Shared Package ✅
Created core game definitions:
- **constants.ts**: All game constants (tile sizes, speeds, limits, etc.)
- **terrain.ts**: Terrain type enum, ASCII mappings, speed multipliers
- **types.ts**: TypeScript interfaces for game entities
- **protocol.proto**: Protocol Buffer definitions for networking (Phase 2)

#### 4. Client Package - Phase 1 Implementation ✅

**Rendering System:**
- `SpriteSheet` class - Loads and manages sprite sheets
- `Camera` class - Viewport management with world/screen coordinate conversion
- `Renderer` class - Main rendering engine (terrain + entities)

**Input System:**
- `KeyboardInput` class - Handles Bolo-style controls
- Supports classic keybindings (Q/A, numpad /*, arrows, space)

**Game Entities:**
- `Tank` class - Full tank physics (movement, turning, speed)
  - 16-directional movement
  - Acceleration/deceleration
  - Turn rate with acceleration
  - Proper Bolo-style direction mapping (0-255)

**World System:**
- `World` class - Map management
- Procedurally generated test map for Phase 1
- Terrain variety (grass, forest, swamp, roads, water, etc.)

**Game Loop:**
- `Game` class - Main game orchestrator
- Fixed timestep updates (20ms ticks, 50 TPS)
- Separate update/render loops
- FPS counter and debug info

#### 5. Development Environment ✅
- Vite dev server running on http://localhost:3000/
- Hot module replacement (HMR) enabled
- TypeScript compilation working
- Asset loading functional

### File Statistics

**Total TypeScript Files**: 17
- Client: 8 files
- Shared: 4 files
- Server: 0 files (Phase 2)

**Lines of Code** (approximate):
- Client: ~600 lines
- Shared: ~300 lines
- Config/Build: ~200 lines

### Current Capabilities

✅ **What Works:**
1. Tank spawns on procedurally generated map
2. Tank movement with proper Bolo physics
3. Tank rotation in 16 directions
4. Camera follows tank smoothly
5. Terrain rendering with tile culling
6. Keyboard controls (Q/A for accel/brake, arrows/numpad for turning)
7. Debug HUD showing FPS, tick, position, direction, speed
8. Fixed timestep game loop (50 TPS)

### Known Limitations (Phase 1 Scope)

⚠️ **Not Yet Implemented:**
1. Collision detection (tank passes through buildings)
2. Shooting (input registered but no shells spawned)
3. Terrain-based speed modification (all terrain same speed)
4. Builder/LGM system
5. Pillboxes, bases, mines
6. Multiplayer networking
7. Sound effects
8. Proper auto-tiling (terrain edges don't match neighbors)

### Next Steps - Phase 2

1. **Protocol Buffers Integration**
   - Generate TypeScript from protocol.proto
   - Create encode/decode utilities

2. **WebSocket Server**
   - Basic server setup with ws library
   - Connection handling
   - Session management

3. **Client-Server Communication**
   - Input buffering and sending
   - State synchronization
   - Multiple tank rendering

4. **Client-Side Prediction**
   - Predict local tank movement
   - Server reconciliation
   - Interpolation for other tanks

### Technical Notes

**Coordinate Systems:**
- World coordinates: Used for physics (continuous)
- Tile coordinates: 256x256 grid
- Pixel coordinates: For rendering (32px per tile)
- Direction units: 0-255 (256 = full circle), rendered as 16 discrete sprites

**Performance:**
- Tile culling: Only visible tiles rendered
- Fixed timestep ensures consistent physics
- Sprite sheets loaded once, cached
- Canvas 2D rendering (simple and fast for this game)

**Code Quality:**
- Following Google TypeScript Style Guide
- Strict TypeScript enabled
- ESLint configured
- No 'any' types allowed
- Explicit function return types

### Testing the Game

```bash
# From project root
cd packages/client
pnpm dev

# Open browser to http://localhost:3000/

# Controls:
# Q - Accelerate
# A - Brake
# Numpad / or Left Arrow - Turn Left
# Numpad * or Right Arrow - Turn Right
# Space or Numpad 0 - Shoot (not implemented yet)
```

### References

- Original Bolo by Stuart Cheshire
- Orona browser implementation (reference)
- WinBolo documentation
- Google TypeScript Style Guide

---

## Phase 2: Multiplayer & Core Gameplay - Complete ✅

### Date: 2026-02-09 - 2026-02-11

### Completed Tasks

#### 1. Multiplayer Network Protocol ✅
- WebSocket-based server on port 8080
- Protocol Buffers binary protocol for state synchronization
- Delta compression for efficient updates
- Player connection/disconnection handling
- State hash-based change detection

#### 2. Sound System ✅
**Implementation:**
- 24 sound files from Bolo manual specification
- Distance-based variants (self, near, far)
- Positional audio with distance attenuation
- Sound events synchronized via network protocol

**Sounds Implemented:**
- Tank movement (bubbles, sink)
- Shooting (shoot_self, shoot_near, shoot_far)
- Explosions (explosion_near, explosion_far)
- Impacts (hit_tank_near, hit_tank_far, hit_tree_near, hit_tree_far)
- Building (man_building, man_dying, man_lay_mine, farming_tree)
- Pillbox (pillbox_shoot_near, pillbox_shoot_far)
- Mining (mine_explosion_near, mine_explosion_far)

**Test Coverage:** 16 tests

#### 3. Water Mechanics ✅
**Features:**
- Boat boarding when tank enters water (RIVER/DEEP_SEA)
- Water drain mechanics (RIVER → GRASS after prolonged occupation)
- Boat placement on RIVER tiles
- Proper terrain type handling (BOAT tile vs onBoat flag)

**Test Coverage:** 5 tests

#### 4. Mine System with Chain Reactions ✅
**Features:**
- Mine laying by builder (costs 1 mine from tank inventory)
- Mine explosion triggers (tank drives over mine)
- Chain reactions (mines within blast radius trigger)
- Crater creation from mine explosions
- Forest → Crater conversion on explosion
- 2-tile blast radius

**Test Coverage:** Multiple tests in mine explosion suite

#### 5. Crater Flooding Mechanics ✅
**Features:**
- Craters near water automatically flood to RIVER
- Recursive flooding algorithm
- Procedural river generation prevention via distance checks
- Proper terrain state management

**Test Coverage:** Integrated with mine tests

#### 6. Forest Regrowth System ✅
**Features:**
- Forests regrow 500 ticks (10 seconds) after being destroyed
- Tracks regrowth timers per tile
- Works for both collision damage (shells) and harvesting
- Terrain changes broadcast to clients

**Implementation:**
- `forestRegrowthTimers` Map tracking tile keys
- Timer updates in game loop
- Automatic GRASS → FOREST conversion

**Test Coverage:** Builder tests include forest regrowth

#### 7. Builder (LGM) System ✅
**Features:**
- Builder spawning and movement (4.0 world units/tick)
- Tree harvesting (FOREST → GRASS, +1 tree per harvest)
- Road building (GRASS → ROAD, costs 0.5 trees)
- Wall building (GRASS → BUILDING, costs 0.5 trees)
- Boat building (RIVER → BOAT, costs 5 trees, takes longer)
- Mine laying (costs 1 mine from tank)
- Builder death and respawn (255 tick respawn delay)
- Proper coordinate conversion using camera offset

**Builder Orders:**
- IN_TANK = 0
- WAITING = 1
- RETURNING = 2
- PARACHUTING = 3
- HARVESTING = 10
- BUILDING_ROAD = 11
- REPAIRING = 12
- BUILDING_BOAT = 13
- BUILDING_WALL = 14
- PLACING_PILLBOX = 15
- LAYING_MINE = 16

**Test Coverage:** 34 comprehensive tests

#### 8. Pillbox System (Complete Implementation) ✅

**8a. Pillbox Combat:**
- Auto-targeting nearest enemy tank (8-tile range)
- Variable fire rate (starts at 6 ticks, slows to 100)
- Aggravation mechanic (fire rate halves when hit)
- Target acquisition delay
- 15 armor, takes 5 damage per hit (3 hits to disable)
- Neutral pillboxes (team 255) shoot all tanks
- Team-owned pillboxes only shoot enemies

**8b. Pillbox Pickup:**
- Tank drives over disabled pillbox (armor = 0) → auto pickup
- Pillbox repaired to full armor (15)
- Ownership changes to tank's team
- Tank can carry one pillbox at a time
- Pillbox marked as `inTank = true` when carried

**8c. Pillbox Placement (via Builder):**
- Builder places carried pillbox for FREE
- Building NEW pillbox costs 1 tree
- Terrain restrictions: cannot place on DEEP_SEA, BOAT, or FOREST
- Can place on: GRASS, ROAD, SWAMP, CRATER, RUBBLE, RIVER

**8d. Pillbox Repair (via Builder):**
- Builder repairs damaged pillbox in place
- Cost proportional to damage: (maxArmor - currentArmor) / maxArmor * 1 tree
- Does NOT change ownership (can repair enemy pillboxes)

**8e. Forest Concealment:**
- Tanks completely surrounded by forest (8 adjacent tiles) are hidden
- Hidden tanks cannot be targeted by pillboxes
- Enables surprise attacks through forests
- `ServerWorld.isTankConcealedInForest()` checks 8-neighbor forest coverage

**Test Coverage:** 26 pillbox tests (all scenarios covered)

#### 9. Client Builder Controls ✅

**Keyboard Bindings:**
- **T** - Harvest Trees
- **D** - Build Road
- **R** - Repair Pillbox
- **W** - Build Wall
- **B** - Build Boat
- **P** - Place Pillbox
- **M** - Lay Mine
- **C / Escape** - Recall Builder

**Sticky Mode:**
- Selected action persists across multiple clicks
- User can click tiles repeatedly without re-pressing key
- Press different key to change mode
- Press C or Escape to clear mode

**UI Updates:**
- Builder Controls panel (bottom right) updated
- Shows all commands with keyboard shortcuts
- Hint: "Mode stays active - click tiles repeatedly"

**Test Coverage:** 103 client tests (+16 builder input tests)

#### 10. Test Infrastructure ✅

**Server Tests:**
- 280 tests passing, 19 skipped
- Unit tests for all game mechanics
- Integration tests for multi-tick scenarios
- Comprehensive Bolo manual specification coverage

**Client Tests:**
- 103 tests passing
- Builder input controls fully tested
- Sound system tested (16 tests)
- World neighbor queries tested (8 tests)
- Auto-tiler tested (63 tests)

**Test Organization:**
- `bolo-spec/` - Manual specification tests
- Scenario-based testing framework
- ScenarioRunner for multi-tick simulations
- Full traceability to Bolo manual

### Current Capabilities (Phase 2)

✅ **What Works:**
1. Full multiplayer support (WebSocket server)
2. Player connection/disconnection
3. State synchronization with delta compression
4. Tank movement and physics
5. Shooting with shell collision detection
6. Positional audio (24 sound variants)
7. Water mechanics (boat boarding, water drain)
8. Mine system with chain reactions
9. Crater flooding
10. Forest regrowth (10 second timer)
11. Builder system (harvest, build roads/walls/boats, lay mines)
12. Pillbox system (combat, pickup, placement, repair, concealment)
13. Sticky builder controls
14. Camera-based coordinate conversion
15. Terrain change broadcasting
16. Debug overlay with entity stats

### Architecture Highlights

**Coordinate Systems:**
- World units: 256 per tile (used for physics)
- Tile coordinates: Integer grid (0-255)
- Pixel coordinates: 32 per tile (rendering)
- Proper camera offset handling in all conversions

**Network Protocol:**
- Protocol Buffers binary payloads for client/server messages
- Delta updates: only changed entities sent
- State hashing for change detection
- Efficient terrain update tracking via Set

**Game Loop:**
- Server: 50 TPS (20ms tick rate)
- Client: Variable FPS with fixed timestep accumulator
- Separate update/render loops
- Tick-based game logic

**Builder System:**
- State machine with BuilderOrder enum
- Movement system with target tracking
- Work tasks execute every N ticks
- Proper terrain validation
- Resource management (trees, mines)

**Pillbox System:**
- Variable reload speed system
- Aggravation mechanics
- Concealment checking via callback
- Proportional repair costs
- Ownership rules (pickup changes, repair doesn't)

### File Statistics (Phase 2)

**Total Lines Added:** ~3000+ lines
- Server implementation: ~2000 lines
- Client updates: ~500 lines
- Tests: ~1500 lines

**Key Files:**
- `game-session.ts` - Core server game loop (1200+ lines)
- `pillbox.ts` - Pillbox AI and mechanics
- `builder.ts` - Builder state machine
- `world.ts` - Map and terrain management (637 lines)
- `builder-input.ts` - Client controls
- `08-pillboxes.test.ts` - 26 comprehensive tests

### Development Scripts

```bash
# Start both client and server
./restart-dev.sh

# Stop all servers
./kill-dev.sh

# Run server tests
npm test

# Run client tests
cd packages/client && npm test

# Check logs
tail -f logs/server.log
tail -f logs/client.log
```

### Bot Control API (Dev)

The server now exposes a dev-only HTTP API for runtime bot management.

- WebSocket gameplay server: `ws://localhost:8080`
- Bot control API: `http://localhost:8081`

By default, control API is enabled when `NODE_ENV` is not `production`.
You can override with:

```bash
ENABLE_BOT_CONTROL=false
CONTROL_PORT=8081
```

Bot policy is configured at server startup via environment variables:

```bash
# Enable/disable bots globally (default: true)
ALLOW_BOTS=true

# Max number of active bots (default: 4)
MAX_BOTS=4

# Bot alliance policy:
# - none: bots use normal team assignment (default)
# - all-bots: every bot joins one shared bot team
BOT_ALLIANCE_MODE=all-bots
```

Endpoints:

```bash
# Health
curl http://localhost:8081/health

# List built-in bot profiles
curl http://localhost:8081/bots/profiles

# List active bots
curl http://localhost:8081/bots

# Add a bot (idle or patrol)
curl -X POST http://localhost:8081/bots \
  -H 'Content-Type: application/json' \
  -d '{"profile":"idle"}'

# Remove a bot by player id
curl -X DELETE http://localhost:8081/bots/3
```

### Known Issues / Future Work

**Not Yet Implemented:**
1. Base system (partial - spawns exist but no capture mechanics)
2. Win conditions
3. Alliance system (partially implemented)
4. Map editor
5. Replay system
6. Advanced AI for pillboxes (current: simple nearest-enemy targeting)
7. Client-side prediction improvements
8. Proper tile auto-tiling (edge matching)

**Technical Debt:**
- Some skipped tests for alliances and win conditions
- Client prediction could be more sophisticated
- Some edge cases in terrain flooding

### Performance Notes

**Optimizations:**
- Delta compression reduces network traffic significantly
- Tile culling in renderer (only visible tiles drawn)
- State hashing prevents unnecessary network updates
- Forest regrowth timers use Map for O(1) lookup
- Terrain changes tracked via Set for efficient broadcasting

**Benchmarks:**
- Server handles ~50 TPS consistently
- Client renders at 60+ FPS
- Network updates ~50Hz with delta compression
- 280 server tests run in ~2 seconds

### Bolo Manual Compliance

**Implemented Sections:**
- § 3: Shooting (shells, collision, explosion)
- § 6: Boats (boarding, water drain)
- § 7: Water (deep sea, river, boats)
- § 9: Pillboxes (complete - combat, pickup, placement, repair, concealment)
- § 10: Builder (harvesting, building, mine laying)
- Sound system (complete 24-sound specification)
- Mine mechanics (explosions, chain reactions)

**Test Traceability:**
- All implemented features have manual reference comments
- Test descriptions cite manual sections
- Full coverage of specified behaviors

### Next Steps - Phase 3

1. **Base System Enhancement**
   - Capture mechanics
   - Armor/shells/mines refill
   - Team ownership

2. **Win Conditions**
   - All bases captured
   - All pillboxes destroyed/captured
   - Last tank standing

3. **Alliance System**
   - Complete implementation
   - Message passing between allies
   - Shared resources

4. **Polish**
   - Better auto-tiling
   - Improved sound mixing
   - Client-side prediction
   - Replay system

5. **Map System**
   - Map editor
   - Save/load custom maps
   - Map validation

### References

- Original Bolo by Stuart Cheshire
- Bolo Manual (complete specification)
- Orona browser implementation (reference)
- WinBolo documentation
- Google TypeScript Style Guide
