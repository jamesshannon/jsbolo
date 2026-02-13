# Bolo Manual Reference

> [!WARNING]
> Deprecated as an authoritative spec source.
> Use `references/MacBolo Instructions.html` as the source of truth.
>
> Reason: this markdown was a derivative summary and may omit or reword nuanced requirements.
> It remains only as historical developer notes.

## Traceability

The authoritative requirement-to-code mapping now lives in:
`references/manual-traceability-matrix.md`

That matrix tracks each manual behavior against:
- owner files (server/client),
- automated test evidence,
- implementation status,
- explicit deviation notes (if any).

---

## 1. Overview

Bolo is a networked tank game for up to 16 players. Players control tanks on a shared map, competing to capture all refueling bases. The game features pillboxes (automated defensive turrets), refueling bases, a builder unit ("the man"), terrain effects, and alliance mechanics.

## 2. Tank Movement

### Terrain Speed Modifiers

| Terrain       | Speed Category | Notes                                |
|---------------|---------------|--------------------------------------|
| Road          | Fast (1.0x)   | Highest speed                        |
| Grass         | Medium (0.75x)| Standard terrain                     |
| Rubble        | Medium (0.75x)| Destroyed buildings                  |
| Forest        | Slow (0.5x)   | Also provides concealment            |
| Crater        | Slow (0.5x)   | Left by explosions                   |
| Swamp         | Very slow (0.25x)| Natural obstacle                  |
| River/Water   | Very slow (0.2x) | Without boat; drains resources    |
| Boat          | Fast (1.0x)   | Full speed on water                  |
| Deep Sea      | Impassable (0.0x)| Instant death without boat        |
| Building/Wall | Impassable (0.0x)| Blocked by collision detection    |

### Acceleration and Deceleration

- Tank accelerates at 0.25 world units per tick when pressing forward
- Tank decelerates at 0.25 world units per tick when braking
- Coasting (no input) decelerates at half rate (0.125 per tick)
- Maximum speed: 16 world units per tick (on road terrain)
- Speed is clamped to terrain maximum: `TANK_MAX_SPEED * terrainMultiplier`
- If speed exceeds terrain max (e.g., entering swamp from road), tank decelerates smoothly

### Turning

- 256 direction units = full circle
- Turn amount: 2 units/tick for first 10 ticks, then 4 units/tick (acceleration)
- Tank can turn even when stopped or stuck against walls
- Counter-clockwise and clockwise turning are mutually exclusive

### Collision

- Buildings and damaged buildings (SHOT_BUILDING) block tank movement
- Collision stops tank immediately (speed = 0)
- Tank position does not change on collision
- Collision is checked at 5 sample points (center + 4 corners of tank footprint)

### Deep Sea Death

- Deep sea (without boat) is instant death
- Tank cannot enter deep sea without a boat

## 3. Tank Spawning and Initial State

- Tanks spawn at designated start positions (from map) or fallback positions
- Initial resources: 40 shells, 0 mines, 40 armor, 0 trees
- Initial direction: 0 (east)
- Initial speed: 0
- If spawn is on water, tank automatically starts on a boat
- Each player is assigned a team (cycling 0-15)

## 4. Shooting

### Shell Basics

- Shells travel at 32 world units per tick
- Default firing range: 7 tiles
- Range adjustable from 1 to 9 tiles (in 0.5 tile increments)
- Shell direction matches tank direction at time of firing
- Shells spawn at tank's current position
- Each shot costs 1 shell from tank inventory
- Cannot shoot with 0 shells or 0 armor

### Shell-Terrain Collision

- Shells are stopped by "solid" terrain: Building, Shot Building, Rubble, Forest, Boat
- Shells pass through: Grass, Road, River, Deep Sea, Swamp, Crater
- Direct hit damages terrain (reduces terrainLife by 1)
- Terrain degradation chain: Building -> Shot Building -> Rubble -> Crater
- Forest destroyed in 1 hit (becomes Grass)
- Boat destroyed in 1 hit (becomes River)

### Shell-Tank Collision

- Hit detection radius: 128 world units (half a tile)
- Shells cannot hit their owner tank
- Shell damage to tank: 5 armor points per hit
- Tank destroyed when armor <= 0

### Shell-Pillbox Collision

- Hit detection radius: 128 world units
- Pillboxes cannot be hit by their own shells
- Shell damage to pillbox: 5 armor points per hit
- Pillbox capture: hitting an enemy pillbox with your shell captures it for your team

### Shell-Base Collision

- Hit detection radius: 128 world units
- Shell damage to base: 5 armor points per hit
- Base capture: hitting an enemy base captures it for your team

### Range Adjustment

- Range increase: +0.5 tiles per adjustment (max 9)
- Range decrease: -0.5 tiles per adjustment (min 1)
- Useful for mine clearing (landing shells on suspected mine locations)

### Reload

- Reload time: 13 ticks between shots
- Cannot fire during reload
- Reload countdown decrements each tick

## 5. Terrain Damage

### Direct Hit (Shell Collision)

- Only solid terrain takes direct hit damage
- Building: 1 hit -> Shot Building
- Shot Building: 2 hits -> Rubble
- Rubble: 2 hits -> Crater
- Forest: 1 hit -> Grass
- Boat: 1 hit -> River

### Explosion Damage (End-of-Range or Mine)

- Building -> Rubble (skips Shot Building)
- Shot Building -> Crater
- Grass -> Crater
- Forest -> Crater
- Rubble -> Crater
- Swamp -> Crater
- Road -> NOT damaged (roads survive explosions)
- Boat -> River
- River -> unaffected
- Deep Sea -> unaffected
- Crater -> unaffected

### Crater Flooding

- Craters adjacent to water (river or deep sea) flood and become river
- Creates possibility of artificial rivers/moats
- Chain reaction: setting off a line of mines to the sea creates a river

## 6. Mines

### Quick Mines (Tab Key)

- Dropped directly under tank position
- Visible to all nearby enemy tanks
- No builder required
- Costs 1 mine from tank inventory

### Builder-Laid Mines

- Builder walks to target location and buries mine
- Invisible to enemies (even if watching)
- Allies are informed of mine locations
- Alliance mine sharing: mines laid during alliance are shared; pre-alliance mines stay secret

### Mine Explosion

- Mine detonation radius: 1 tile (3x3 grid of affected tiles)
- Mine damage to tank: 10 armor points
- All terrain in radius takes explosion damage
- Mine removed from tile after detonation

### Mine Chain Reactions

- Adjacent mines trigger each other
- A line of mines will all detonate in sequence
- Checker-board pattern prevents chain reactions
- Chain reactions can create artificial rivers when leading to water

## 7. Boats

### Speed and Movement

- Tank on boat moves at full speed (1.0x) regardless of water terrain
- Boat is "carried" by the tank (no BOAT tile while moving through water)
- Tank can traverse deep sea safely while on boat

### Boarding and Disembarking

- Tank automatically boards BOAT tiles when moving onto them
- BOAT tile restored to RIVER when boarded (boat picked up)
- Disembarking: tank moves from water to land, boat left behind as BOAT tile
- Boat faces opposite direction on disembark (for easy re-boarding)
- Tank spawning in water automatically starts on boat

### Vulnerability

- Boats destroyed in 1 hit (BOAT -> RIVER)
- Boat destruction leaves tank in water (subject to water mechanics)

### Building

- Boats cost 5 trees to build
- Builder walks to river tile and constructs boat
- Cannot build boats on deep sea
- Takes longer than other construction (20 ticks vs 10)

## 8. Water Mechanics

- Tank in water (without boat) loses resources over time
- Shells drained: 1 per 15 ticks
- Mines drained: 1 per 15 ticks
- "Check your inventory when you come out of water"
- Water slows tanks significantly (river = 0.2x speed)
- Deep sea is impassable without boat

## 9. Pillboxes

### Targeting and Firing

- Pillboxes auto-fire at enemy tanks within range
- Range: 8 tiles (2048 world units)
- Neutral pillboxes (team 255) shoot at ALL tanks
- Team-owned pillboxes only shoot at enemy tanks
- Target acquisition delay: first frame of seeing a target, pillbox doesn't fire
- Pillbox uses predictive targeting (leads the target based on movement)
- Pillbox shells travel at same speed as tank shells (32 world units/tick)

### Variable Fire Rate

- Starting fire speed: 6 ticks between shots
- Every 32 ticks of continuous targeting, fire speed increases by 1 tick
- Maximum fire speed: 100 ticks between shots (slows down over time)
- "In a straightforward confrontation, a pillbox will win every time"

### Damage and Destruction

- Pillbox armor: 15 (starting/max)
- Shell damage to pillbox: 5 per hit (3 hits to destroy)
- Aggravation mechanic: when hit, cooldown resets to 32 and speed halves (min 6)
- Pillboxes can never be totally destroyed, just disabled
- Disabled pillbox can be picked up by driving over it

### Pickup

- Drive over disabled (0 armor) pillbox to pick it up
- Pillbox is repaired when picked up
- Becomes loyal to the player who picked it up
- Carried in tank inventory

### Placement by Builder

- Builder places pillbox at target location
- Costs 1 tree
- Cannot place on deep sea, boats, or forest

### Repair by Builder

- Builder can repair damaged pillbox in place
- Costs up to 1 tree depending on damage
- Does NOT change ownership (repairing enemy pillbox keeps it enemy-owned)

### Forest Concealment

- Tank must be completely enclosed in forest (surrounded on all sides) to be hidden
- Pillboxes cannot see tanks hidden in forest
- Enemies shooting at forest will clear trees, potentially revealing hidden tanks

## 10. Bases

### Refueling

- Tanks automatically refuel when within range of friendly base
- Refuel range: 1.5 tiles (384 world units)
- Transfer rate: 1 unit per tick (with 2-tick cooldown between transfers)
- Transfers: armor, shells, mines (1 per transfer tick)
- Tank resource maximums: 40 shells, 40 mines, 40 armor, 40 trees
- Neutral bases refuel anyone; team bases only refuel friendly tanks
- Base stocks deplete as they refuel tanks

### Capture

- Bases captured by shooting them (shell hit captures for shooter's team)
- Neutral bases captured automatically when tank drives onto them
- Enemy tanks cannot drive onto your base to refuel (must shoot to deplete armor first)
- When armor is depleted, enemy can drive on and capture

### Self-Replenishment

- "The base will slowly replenish its stocks automatically"
- Base starting stocks: 90 armor, 40 shells, 40 mines

## 11. Builder / Man

### Lifecycle

- Builder starts inside tank (IN_TANK state)
- Sent to target tile when player gives build order
- Walks to target at builder speed (4 world units/tick)
- Performs task when arriving at target
- Returns to tank when task complete
- If killed while outside tank, new one parachuted in after delay

### Harvesting Trees

- Builder walks to forest tile
- Harvests tree: converts FOREST to GRASS
- Gains trees for tank inventory
- Can carry up to 40 trees

### Building Roads

- Costs 1/2 tree (0.5 trees) per road segment
- Builder converts GRASS to ROAD
- Must have trees in inventory
- Can only build on grass tiles

### Building Walls/Buildings

- Costs 1/2 tree (0.5 trees) per wall/building
- Builder converts GRASS to BUILDING
- Must have trees in inventory

### Building Boats

- Costs 5 trees to build
- Builder converts RIVER to BOAT
- Takes longer than other construction (20 ticks vs 10)
- Cannot build on deep sea

### Laying Mines (via Builder)

- Builder walks to target and buries mine
- Mine is invisible to enemies
- Costs 1 mine from tank inventory
- Builder takes mine from tank when dispatched

### Vulnerability

- Builder can be killed by enemy fire while outside tank
- If killed, respawn delay before new builder arrives (255 ticks)
- During respawn, player cannot build anything

### Forest Regrowth

- "Forests grow all the time"
- Trees harvested by builder will be replenished slowly over time

## 12. Tank Death and Respawn

- Tank destroyed when armor <= 0
- Respawn after delay (~3 seconds / 255 ticks)
- Respawn with full resources: 40 shells, 0 mines, 40 armor, 0 trees
- Respawn at random position near map center
- Direction reset to 0, speed reset to 0

## 13. Alliances

- Up to 16 teams
- Alliance formed via request/invite system
- Allied pillboxes don't shoot at each other
- Allied players share mine locations (only mines laid during alliance)
- Any member can leave alliance at any time
- Carried pillboxes go with leaving player; placed ones stay with alliance
- Must leave old alliance before joining new one

## 14. Win Condition

- "The object of the game is, eventually, to have captured all of these refueling bases."
- Game won when one player/alliance controls all bases

---

## Appendix: Game Constants (from codebase)

| Constant | Value | Unit |
|----------|-------|------|
| TICK_LENGTH_MS | 20 | ms per tick |
| TICKS_PER_SECOND | 50 | ticks/sec |
| TILE_SIZE_WORLD | 256 | world units |
| TILE_SIZE_PIXELS | 32 | pixels |
| TANK_MAX_SPEED | 16 | world units/tick |
| TANK_ACCELERATION | 0.25 | world units/tick/tick |
| TANK_DECELERATION | 0.25 | world units/tick/tick |
| DIRECTION_UNITS_FULL_CIRCLE | 256 | direction units |
| SHELL_SPEED | 32 | world units/tick |
| SHELL_DAMAGE | 5 | armor points |
| MINE_DAMAGE | 10 | armor points |
| RELOAD_TIME_TICKS | 13 | ticks |
| PILLBOX_RANGE | 2048 | world units (8 tiles) |
| PILLBOX_MAX_ARMOR | 15 | armor points |
| BASE_REFUEL_RANGE | 384 | world units (1.5 tiles) |
| BASE_STARTING_ARMOR | 90 | armor points |
| BASE_STARTING_SHELLS | 40 | shells |
| BASE_STARTING_MINES | 40 | mines |
| TANK_MAX_SHELLS | 40 | shells |
| TANK_MAX_MINES | 40 | mines |
| TANK_MAX_ARMOR | 40 | armor |
| TANK_STARTING_SHELLS | 40 | shells |
| TANK_STARTING_MINES | 0 | mines |
| TANK_STARTING_ARMOR | 40 | armor |
| BUILDER_SPEED | 4 | world units/tick |
| BUILDER_RESPAWN_TICKS | 255 | ticks |
| WATER_DRAIN_INTERVAL_TICKS | 15 | ticks |
| MINE_EXPLOSION_RADIUS_TILES | 1 | tiles (3x3 grid) |
