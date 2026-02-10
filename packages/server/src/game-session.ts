/**
 * Game session - manages a single game instance
 */

import {
  TICK_LENGTH_MS,
  SHELL_DAMAGE,
  PILLBOX_RANGE,
  BASE_REFUEL_RANGE,
  MINE_EXPLOSION_RADIUS_TILES,
  BuilderOrder,
  type PlayerInput,
  encodeServerMessage,
  type WelcomeMessage,
  type UpdateMessage,
  type TerrainUpdate,
} from '@jsbolo/shared';
import {ServerTank} from './simulation/tank.js';
import {ServerWorld} from './simulation/world.js';
import {ServerShell} from './simulation/shell.js';
import {ServerPillbox} from './simulation/pillbox.js';
import {ServerBase} from './simulation/base.js';
import {ServerBuilder} from './simulation/builder.js';
import type {WebSocket} from 'ws';

interface Player {
  id: number;
  ws: WebSocket;
  tank: ServerTank;
  lastInput: PlayerInput;
}

export class GameSession {
  private readonly world: ServerWorld;
  private readonly players = new Map<number, Player>();
  private readonly shells = new Map<number, ServerShell>();
  private readonly pillboxes = new Map<number, ServerPillbox>();
  private readonly bases = new Map<number, ServerBase>();
  private readonly terrainChanges = new Set<string>(); // Track terrain changes as "x,y"
  private nextPlayerId = 1;
  private tick = 0;
  private running = false;
  private tickInterval?: NodeJS.Timeout;

  // Network optimization: throttle broadcasts and track state changes
  private readonly BROADCAST_INTERVAL = 2; // Broadcast every 2 ticks (25 Hz instead of 50 Hz)
  private previousState = {
    tanks: new Map<number, string>(), // tankId -> state hash
    shells: new Set<number>(), // Track which shells existed last broadcast
    builders: new Map<number, string>(),
    pillboxes: new Map<number, string>(),
    bases: new Map<number, string>(),
  };

  /**
   * Create a new game session, optionally loading a map file.
   *
   * WHY OPTIONAL MAP PATH:
   * - Backwards compatibility with existing code
   * - Allows testing without map files
   * - Graceful fallback if map loading fails
   *
   * MAP LOADING FLOW:
   * 1. ServerWorld loads map and terrain data
   * 2. We extract pillbox/base spawn data from world
   * 3. Spawn entities from map data OR use hardcoded fallback
   *
   * @param mapPath Optional path to .map file
   */
  constructor(mapPath?: string) {
    this.world = new ServerWorld(mapPath);

    // Use map spawn data if available, otherwise fall back to hardcoded spawns
    const pillboxSpawns = this.world.getPillboxSpawns();
    if (pillboxSpawns.length > 0) {
      this.spawnPillboxesFromMap(pillboxSpawns);
      console.log(`  Spawned ${pillboxSpawns.length} pillboxes from map`);
    } else {
      this.spawnInitialPillboxes();  // Hardcoded fallback
    }

    const baseSpawns = this.world.getBaseSpawns();
    if (baseSpawns.length > 0) {
      this.spawnBasesFromMap(baseSpawns);
      console.log(`  Spawned ${baseSpawns.length} bases from map`);
    } else {
      this.spawnInitialBases();  // Hardcoded fallback
    }

    console.log(`Map ready: ${this.world.getMapName()}`);
  }

  private spawnInitialPillboxes(): void {
    // Spawn some neutral pillboxes around the map
    const pillboxLocations = [
      {x: 100, y: 100},
      {x: 150, y: 100},
      {x: 100, y: 150},
      {x: 150, y: 150},
      {x: 125, y: 75},
      {x: 175, y: 125},
    ];

    for (const loc of pillboxLocations) {
      const pillbox = new ServerPillbox(loc.x, loc.y, 255); // Neutral
      this.pillboxes.set(pillbox.id, pillbox);
    }
  }

  private spawnInitialBases(): void {
    // Spawn some neutral bases around the map
    const baseLocations = [
      {x: 80, y: 80},
      {x: 170, y: 80},
      {x: 80, y: 170},
      {x: 170, y: 170},
    ];

    for (const loc of baseLocations) {
      const base = new ServerBase(loc.x, loc.y, 255); // Neutral
      this.bases.set(base.id, base);
    }
  }

  /**
   * Spawn pillboxes from loaded map data.
   *
   * WHY RESTORE MAP STATE:
   * - Map files include pillbox health, team ownership, reload speed
   * - Preserves map designer's intended difficulty/balance
   * - Some maps have damaged or team-owned pillboxes for strategic gameplay
   *
   * @param spawns Pillbox spawn data from map file
   */
  private spawnPillboxesFromMap(spawns: import('./simulation/map-loader.js').PillboxSpawnData[]): void {
    for (const spawn of spawns) {
      const pillbox = new ServerPillbox(spawn.tileX, spawn.tileY, spawn.ownerTeam);
      pillbox.armor = spawn.armor;
      // Note: ServerPillbox already implements variable reload speed system
      // The 'speed' value from map is stored but our implementation
      // uses dynamic speed adjustment (aggravation mechanics)
      this.pillboxes.set(pillbox.id, pillbox);
    }
  }

  /**
   * Spawn bases from loaded map data.
   *
   * WHY RESTORE RESOURCES:
   * - Map files include base stockpiles (shells, mines)
   * - Different maps have different resource availability
   * - Affects gameplay balance (resource-rich vs resource-scarce maps)
   *
   * @param spawns Base spawn data from map file
   */
  private spawnBasesFromMap(spawns: import('./simulation/map-loader.js').BaseSpawnData[]): void {
    for (const spawn of spawns) {
      const base = new ServerBase(spawn.tileX, spawn.tileY, spawn.ownerTeam);
      base.armor = spawn.armor;
      base.shells = spawn.shells;
      base.mines = spawn.mines;
      this.bases.set(base.id, base);
    }
  }

  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    this.tickInterval = setInterval(() => {
      this.update();
    }, TICK_LENGTH_MS);

    console.log('Game session started');
  }

  stop(): void {
    this.running = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
    console.log('Game session stopped');
  }

  addPlayer(ws: WebSocket): number {
    const playerId = this.nextPlayerId++;
    const team = (playerId - 1) % 16; // Simple team assignment

    // Use map start positions if available, otherwise fallback to hardcoded position
    const startPositions = this.world.getStartPositions();
    let spawnX: number;
    let spawnY: number;

    if (startPositions.length > 0) {
      // Cycle through start positions (wrap around if more players than start positions)
      const startPos = startPositions[(playerId - 1) % startPositions.length]!;
      spawnX = startPos.tileX;
      spawnY = startPos.tileY;
      const terrain = this.world.getTerrainAt(spawnX, spawnY);
      console.log(`Player ${playerId} spawning at start position (${spawnX}, ${spawnY}) - terrain: ${terrain}`);
    } else {
      // Fallback: spawn near center with some offset
      spawnX = 128 + (playerId * 5);
      spawnY = 128 + (playerId * 5);
      console.log(`Player ${playerId} spawning at fallback position (${spawnX}, ${spawnY})`);
    }

    const terrain = this.world.getTerrainAt(spawnX, spawnY);

    const tank = new ServerTank(playerId, team, spawnX, spawnY);

    // Auto-place tank on boat if spawning in water (deep sea or river)
    // ASSUMPTION: Boat is "carried" by tank - no BOAT tile created at spawn
    // BOAT tiles only exist when tank disembarks onto land from water
    if (terrain === 10 || terrain === 1) {  // DEEP_SEA = 10, RIVER = 1
      tank.onBoat = true;
      console.log(`  -> Tank spawned on boat in water at (${spawnX}, ${spawnY}), no BOAT tile created`);
    }

    const player: Player = {
      id: playerId,
      ws,
      tank,
      lastInput: {
        sequence: 0,
        tick: 0,
        accelerating: false,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: 0, // NONE
      },
    };

    this.players.set(playerId, player);

    // Send welcome message
    this.sendWelcome(player);

    console.log(`Player ${playerId} joined (total: ${this.players.size})`);
    return playerId;
  }

  removePlayer(playerId: number): void {
    this.players.delete(playerId);
    console.log(`Player ${playerId} left (remaining: ${this.players.size})`);

    // Stop session if no players
    if (this.players.size === 0) {
      this.stop();
    }
  }

  handlePlayerInput(playerId: number, input: PlayerInput): void {
    const player = this.players.get(playerId);
    if (player) {
      player.lastInput = input;
    }
  }

  private update(): void {
    this.tick++;

    // Update all tanks
    for (const player of this.players.values()) {
      const tank = player.tank;

      if (tank.isDead()) {
        continue; // Skip dead tanks
      }

      // Get terrain speed using multi-point sampling at tank's current position.
      // This samples terrain under the tank's footprint (5 points: center + 4 corners)
      // and uses the slowest terrain to determine speed. This prevents unrealistic
      // behavior when crossing terrain boundaries at angles.
      let terrainSpeed = this.world.getTankSpeedAtPosition(tank.x, tank.y);

      // If tank is on a boat, always use full speed
      // This overrides terrain sampling to prevent getting stuck when boat
      // is near the edge and samples ahead to DEEP_SEA (speed 0)
      if (tank.onBoat) {
        terrainSpeed = 1.0;
      }

      // Collision check function
      const checkCollision = (newX: number, newY: number): boolean => {
        const newTileX = Math.floor(newX / 256); // TILE_SIZE_WORLD
        const newTileY = Math.floor(newY / 256);
        return this.world.isPassable(newTileX, newTileY);
      };

      // Track previous tank position for boat movement
      const prevTile = tank.getTilePosition();
      const prevTerrain = this.world.getTerrainAt(prevTile.x, prevTile.y);

      tank.update(player.lastInput, terrainSpeed, checkCollision);

      // Handle boat movement: boat "carried" by tank, only exists as tile when disembarked
      // ASSUMPTION: Boats can only be disembarked from RIVER terrain (coastlines).
      // Deep sea is too far from shore to disembark onto land.
      // Therefore, all BOAT tiles are always restored to RIVER when re-boarded.
      if (tank.onBoat) {
        const newTile = tank.getTilePosition();
        const newTerrain = this.world.getTerrainAt(newTile.x, newTile.y);

        // Check if tank moved to a new tile
        if (newTile.x !== prevTile.x || newTile.y !== prevTile.y) {
          const isWaterTerrain = (t: number) => t === 10 || t === 1 || t === 9; // DEEP_SEA, RIVER, BOAT

          if (isWaterTerrain(newTerrain)) {
            // Tank still in water - boat is "carried" by the tank
            // NO terrain changes - boat moves smoothly with tank, no tile jumping
          } else {
            // Tank moved onto land - disembark and leave boat behind
            tank.onBoat = false;
            // Place BOAT tile at the water position tank just left
            // Boat faces opposite direction so tank can re-board by backing up
            // (Assumption: this is always RIVER since you can't disembark from deep sea)
            const boatDirection = (tank.direction + 128) % 256;
            this.world.setTerrainAt(prevTile.x, prevTile.y, 9, boatDirection); // BOAT
            this.terrainChanges.add(`${prevTile.x},${prevTile.y}`);
            console.log(`Tank ${tank.id} disembarked at (${newTile.x}, ${newTile.y}), left boat facing ${boatDirection} at (${prevTile.x}, ${prevTile.y})`);
          }
        }
      } else {
        // Tank is NOT on boat - check if it should board an existing boat
        const currentTile = tank.getTilePosition();
        const currentTerrain = this.world.getTerrainAt(currentTile.x, currentTile.y);

        // If tank is on a BOAT tile, board it and restore terrain
        if (currentTerrain === 9) { // BOAT
          tank.onBoat = true;
          // Remove BOAT tile and restore to RIVER (see assumption above)
          this.world.setTerrainAt(currentTile.x, currentTile.y, 1); // RIVER
          this.terrainChanges.add(`${currentTile.x},${currentTile.y}`);
          console.log(`Tank ${tank.id} boarded boat at (${currentTile.x}, ${currentTile.y}), restored RIVER terrain`);
        }
      }

      // Handle shooting
      if (player.lastInput.shooting && tank.canShoot()) {
        this.spawnShell(tank);
        tank.shoot();
      }

      // Handle builder tasks
      this.updateBuilder(tank);

      // Check for mines under the tank
      const tankTile = tank.getTilePosition();
      if (this.world.hasMineAt(tankTile.x, tankTile.y)) {
        // Tank hit a mine! Create explosion
        this.world.removeMineAt(tankTile.x, tankTile.y);

        // Create explosion affecting terrain in radius
        const affectedTiles = this.world.createMineExplosion(
          tankTile.x,
          tankTile.y,
          MINE_EXPLOSION_RADIUS_TILES
        );

        // Track all terrain changes
        for (const tile of affectedTiles) {
          this.terrainChanges.add(`${tile.x},${tile.y}`);
        }

        // Damage all tanks in explosion radius
        const explosionCenterX = (tankTile.x + 0.5) * 256; // TILE_SIZE_WORLD
        const explosionCenterY = (tankTile.y + 0.5) * 256;
        const explosionRadius = MINE_EXPLOSION_RADIUS_TILES * 256; // Convert to world units

        for (const otherPlayer of this.players.values()) {
          const otherTank = otherPlayer.tank;
          if (otherTank.isDead()) {
            continue;
          }

          const dx = otherTank.x - explosionCenterX;
          const dy = otherTank.y - explosionCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance <= explosionRadius) {
            const killed = otherTank.takeDamage(10); // MINE_DAMAGE
            if (killed) {
              console.log(`Tank ${otherTank.id} destroyed by mine explosion`);
              setTimeout(() => {
                const spawnX = 128 + Math.floor(Math.random() * 20);
                const spawnY = 128 + Math.floor(Math.random() * 20);
                otherTank.respawn(spawnX, spawnY);
              }, 3000);
            }
          }
        }

        console.log(`Mine exploded at (${tankTile.x}, ${tankTile.y}), damaged ${affectedTiles.length} tiles`);
      }
    }

    // Update all shells
    for (const shell of this.shells.values()) {
      shell.update();

      // Check collisions with terrain (solid objects)
      if (shell.alive) {
        this.checkShellTerrainCollision(shell);
      }

      // Check collisions with tanks
      if (shell.alive) {
        this.checkShellCollisions(shell);
      }

      // Check collisions with pillboxes
      if (shell.alive) {
        this.checkShellPillboxCollisions(shell);
      }

      // Check collisions with bases
      if (shell.alive) {
        this.checkShellBaseCollisions(shell);
      }

      // Handle dead shells
      if (!shell.alive) {
        const tilePos = shell.getTilePosition();
        const terrain = this.world.getTerrainAt(tilePos.x, tilePos.y);

        // If shell should explode (end-of-range), damage terrain beneath it
        if (shell.shouldExplode) {
          console.log(`[DEBUG] Shell ${shell.id} exploded at (${tilePos.x}, ${tilePos.y}), terrain=${terrain}, distance=${shell.distanceTraveled}/${shell.range}`);
          this.world.damageTerrainFromExplosion(tilePos.x, tilePos.y);
          this.terrainChanges.add(`${tilePos.x},${tilePos.y}`);
        } else {
          console.log(`[DEBUG] Shell ${shell.id} removed by collision at (${tilePos.x}, ${tilePos.y}), terrain=${terrain}`);
        }
        this.shells.delete(shell.id);
      }
    }

    // Update all pillboxes
    for (const pillbox of this.pillboxes.values()) {
      if (pillbox.isDead()) {
        continue;
      }

      pillbox.update();

      // Pillboxes auto-fire at enemy tanks
      if (pillbox.canShoot()) {
        const tanks = Array.from(this.players.values()).map(p => ({
          id: p.tank.id,
          x: p.tank.x,
          y: p.tank.y,
          direction: p.tank.direction,
          speed: p.tank.speed,
          team: p.tank.team,
          armor: p.tank.armor,
        }));

        const target = pillbox.findTarget(tanks, PILLBOX_RANGE);
        if (target) {
          // Shoot returns true if it actually fires (handles acquisition delay)
          if (pillbox.shoot()) {
            // Calculate predicted position based on target's movement
            const pos = pillbox.getWorldPosition();
            const dx = target.x - pos.x;
            const dy = target.y - pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Predict where target will be (Orona algorithm)
            const radians = ((256 - target.direction) * 2 * Math.PI) / 256;
            const predictedX =
              target.x +
              (distance / 32) * Math.round(Math.cos(radians) * Math.ceil(target.speed));
            const predictedY =
              target.y +
              (distance / 32) * Math.round(Math.sin(radians) * Math.ceil(target.speed));

            const direction = pillbox.getDirectionTo(predictedX, predictedY);
            this.spawnShellFromPillbox(pillbox.id, pos.x, pos.y, direction);
          }
        } else {
          // No target in range - lose target
          pillbox.loseTarget();
        }
      }
    }

    // Update all bases
    for (const base of this.bases.values()) {
      if (base.isDead()) {
        continue;
      }

      base.update();

      // Check for tanks in range to refuel
      for (const player of this.players.values()) {
        const tank = player.tank;
        if (tank.isDead()) {
          continue;
        }

        if (base.isTankInRange(tank.x, tank.y, BASE_REFUEL_RANGE)) {
          base.refuelTank(tank);
        }
      }
    }

    // Broadcast state to all players (throttled to reduce CPU usage)
    if (this.tick % this.BROADCAST_INTERVAL === 0) {
      this.broadcastState();
    }
  }

  private spawnShell(tank: ServerTank): void {
    const shell = new ServerShell(
      tank.id,
      tank.x,
      tank.y,
      tank.direction,
      tank.firingRange
    );
    this.shells.set(shell.id, shell);
  }

  private spawnShellFromPillbox(
    pillboxId: number,
    x: number,
    y: number,
    direction: number
  ): void {
    const shell = new ServerShell(
      -pillboxId, // Negative ID for pillbox shells
      x,
      y,
      direction,
      7 // Default range
    );
    this.shells.set(shell.id, shell);
  }

  private checkShellTerrainCollision(shell: ServerShell): void {
    const tilePos = shell.getTilePosition();

    // DEBUG: Check terrain BEFORE collision check
    const terrainBeforeCheck = this.world.getTerrainAt(tilePos.x, tilePos.y);
    console.log(`[DEBUG] Checking shell ${shell.id} at (${tilePos.x}, ${tilePos.y}), terrain BEFORE=${terrainBeforeCheck}`);

    // Check if shell hit solid terrain
    if (this.world.checkShellTerrainCollision(tilePos.x, tilePos.y)) {
      console.log(`[DEBUG] COLLISION DETECTED! Shell ${shell.id} hit terrain at (${tilePos.x}, ${tilePos.y}), terrain=${terrainBeforeCheck} - THIS SHOULD NOT HAPPEN FOR ROADS!`);

      // Damage terrain and kill shell
      const destroyed = this.world.damageTerrainFromCollision(tilePos.x, tilePos.y);
      this.terrainChanges.add(`${tilePos.x},${tilePos.y}`);
      shell.killByCollision(); // Collision kills don't explode
      console.log(`Shell ${shell.id} hit terrain at (${tilePos.x}, ${tilePos.y}), terrain destroyed: ${destroyed}`);
    }
  }

  private checkShellCollisions(shell: ServerShell): void {
    for (const player of this.players.values()) {
      const tank = player.tank;

      // Skip dead tanks and owner
      if (tank.isDead() || tank.id === shell.ownerTankId) {
        continue;
      }

      // Check distance
      const dx = shell.x - tank.x;
      const dy = shell.y - tank.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Hit detection (128 world units = 16 pixels = half a tile)
      if (distance < 128) {
        shell.killByCollision();
        const killed = tank.takeDamage(SHELL_DAMAGE);

        if (killed) {
          console.log(`Tank ${tank.id} destroyed by tank ${shell.ownerTankId}`);
          // Tank will respawn after a delay
          setTimeout(() => {
            const spawnX = 128 + Math.floor(Math.random() * 20);
            const spawnY = 128 + Math.floor(Math.random() * 20);
            tank.respawn(spawnX, spawnY);
          }, 3000); // 3 second respawn delay
        }
        break;
      }
    }
  }

  private checkShellPillboxCollisions(shell: ServerShell): void {
    for (const pillbox of this.pillboxes.values()) {
      if (pillbox.isDead() || pillbox.inTank) {
        continue;
      }

      // Skip if shell was fired by this pillbox (negative owner ID = -pillboxId)
      if (shell.ownerTankId === -pillbox.id) {
        continue;
      }

      const pillboxPos = pillbox.getWorldPosition();
      const dx = shell.x - pillboxPos.x;
      const dy = shell.y - pillboxPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Hit detection
      if (distance < 128) {
        shell.killByCollision();
        const destroyed = pillbox.takeDamage(SHELL_DAMAGE);

        if (destroyed) {
          console.log(`Pillbox ${pillbox.id} destroyed`);
        } else {
          // If hit by friendly tank, capture it
          if (shell.ownerTankId > 0) {
            const player = this.players.get(shell.ownerTankId);
            if (player && player.tank.team !== pillbox.ownerTeam) {
              pillbox.capture(player.tank.team);
              console.log(
                `Pillbox ${pillbox.id} captured by team ${player.tank.team}`
              );
            }
          }
        }
        break;
      }
    }
  }

  private checkShellBaseCollisions(shell: ServerShell): void {
    for (const base of this.bases.values()) {
      if (base.isDead()) {
        continue;
      }

      const basePos = base.getWorldPosition();
      const dx = shell.x - basePos.x;
      const dy = shell.y - basePos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Hit detection
      if (distance < 128) {
        shell.killByCollision();
        const destroyed = base.takeDamage(SHELL_DAMAGE);

        if (destroyed) {
          console.log(`Base ${base.id} destroyed`);
        } else {
          // If hit by tank, capture it
          if (shell.ownerTankId > 0) {
            const player = this.players.get(shell.ownerTankId);
            if (player && player.tank.team !== base.ownerTeam) {
              base.capture(player.tank.team);
              console.log(`Base ${base.id} captured by team ${player.tank.team}`);
            }
          }
        }
        break;
      }
    }
  }

  private updateBuilder(tank: ServerTank): void {
    const builder = tank.builder;

    if (builder.isWorking()) {
      const builderTile = builder.getTilePosition();
      const terrain = this.world.getTerrainAt(builderTile.x, builderTile.y);

      // Handle different builder orders
      switch (builder.order) {
        case BuilderOrder.HARVESTING:
          if (builder.canHarvest(terrain)) {
            // Every 10 ticks, harvest a tree and clear the terrain
            if (this.tick % 10 === 0) {
              builder.harvestTree();
              this.world.setTerrainAt(builderTile.x, builderTile.y, 7); // GRASS (7, not 0!)
              tank.trees = builder.trees; // Sync with tank
            }
          } else {
            // Done harvesting or invalid terrain
            builder.recallToTank(tank.x, tank.y);
          }
          break;

        case BuilderOrder.BUILDING_ROAD:
          if (builder.canBuildWall() && terrain === 7) {
            // GRASS (7, not 0!)
            if (this.tick % 10 === 0) {
              builder.useTree();
              this.world.setTerrainAt(builderTile.x, builderTile.y, 4); // ROAD
              tank.trees = builder.trees;
              builder.recallToTank(tank.x, tank.y);
            }
          } else {
            builder.recallToTank(tank.x, tank.y);
          }
          break;

        case BuilderOrder.BUILDING_WALL:
          if (builder.canBuildWall() && terrain === 7) {
            // GRASS (7, not 0!)
            if (this.tick % 10 === 0) {
              builder.useTree();
              this.world.setTerrainAt(builderTile.x, builderTile.y, 0); // BUILDING (0, not 6!)
              tank.trees = builder.trees;
              builder.recallToTank(tank.x, tank.y);
            }
          } else {
            builder.recallToTank(tank.x, tank.y);
          }
          break;

        case BuilderOrder.BUILDING_BOAT:
          if (terrain === 1) {
            // RIVER (1, not 3!)
            if (this.tick % 20 === 0) {
              // Boats take longer
              this.world.setTerrainAt(builderTile.x, builderTile.y, 9); // BOAT
              builder.recallToTank(tank.x, tank.y);
            }
          } else {
            builder.recallToTank(tank.x, tank.y);
          }
          break;

        case BuilderOrder.LAYING_MINE:
          if (builder.hasMine && !this.world.hasMineAt(builderTile.x, builderTile.y)) {
            if (this.tick % 10 === 0) {
              this.world.setMineAt(builderTile.x, builderTile.y, true);
              builder.hasMine = false;
              tank.mines = Math.max(0, tank.mines - 1);
              builder.recallToTank(tank.x, tank.y);
            }
          } else {
            builder.recallToTank(tank.x, tank.y);
          }
          break;

        default:
          // Other orders not yet implemented
          break;
      }
    }
  }

  private sendWelcome(player: Player): void {
    const mapData = this.world.getMapData();

    // Pack terrain data as flat arrays
    const terrain: number[] = [];
    const terrainLife: number[] = [];
    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const cell = mapData[y]![x]!;
        terrain.push(cell.terrain);
        terrainLife.push(cell.terrainLife);
      }
    }

    // Diagnostic: Count non-deep-sea terrain in sent data
    const terrainHistogram = new Map<number, number>();
    for (let i = 0; i < terrain.length; i++) {
      const t = terrain[i]!;
      terrainHistogram.set(t, (terrainHistogram.get(t) || 0) + 1);
    }
    console.log('Sending terrain histogram:', Object.fromEntries(terrainHistogram));

    // Sample some specific rows to verify data
    console.log('Sample terrain at row 102:', terrain.slice(102 * 256, 102 * 256 + 10));
    console.log('Sample terrain at row 241:', terrain.slice(241 * 256, 241 * 256 + 10));

    // Collect all tanks
    const tanks = Array.from(this.players.values()).map(p => ({
      id: p.tank.id,
      team: p.tank.team,
      x: p.tank.x,
      y: p.tank.y,
      direction: p.tank.direction,
      speed: p.tank.speed,
      armor: p.tank.armor,
      shells: p.tank.shells,
      mines: p.tank.mines,
      trees: p.tank.trees,
      onBoat: p.tank.onBoat,
      reload: p.tank.reload,
      firingRange: p.tank.firingRange,
    }));

    // Collect all pillboxes
    const pillboxes = Array.from(this.pillboxes.values()).map(pb => ({
      id: pb.id,
      tileX: pb.tileX,
      tileY: pb.tileY,
      armor: pb.armor,
      ownerTeam: pb.ownerTeam,
      inTank: pb.inTank,
    }));

    // Collect all bases
    const bases = Array.from(this.bases.values()).map(base => ({
      id: base.id,
      tileX: base.tileX,
      tileY: base.tileY,
      armor: base.armor,
      shells: base.shells,
      mines: base.mines,
      ownerTeam: base.ownerTeam,
    }));

    const welcome: WelcomeMessage = {
      type: 'welcome',
      playerId: player.id,
      assignedTeam: player.tank.team,
      currentTick: this.tick,
      mapName: this.world.getMapName(),
      map: {
        width: 256,
        height: 256,
        terrain,
        terrainLife,
      },
      tanks,
      pillboxes,
      bases,
    };

    const message = encodeServerMessage(welcome);
    player.ws.send(message);
  }

  /**
   * Generate a state hash for an entity to detect changes.
   * Only includes mutable fields that clients need to know about.
   */
  private getTankStateHash(tank: ServerTank): string {
    return `${Math.round(tank.x)},${Math.round(tank.y)},${tank.direction},${tank.speed},${tank.armor},${tank.shells},${tank.mines},${tank.trees},${tank.onBoat},${tank.reload},${tank.firingRange}`;
  }

  private getBuilderStateHash(builder: ServerBuilder): string {
    return `${Math.round(builder.x)},${Math.round(builder.y)},${Math.round(builder.targetX)},${Math.round(builder.targetY)},${builder.order},${builder.trees},${builder.hasMine}`;
  }

  private getPillboxStateHash(pillbox: ServerPillbox): string {
    return `${pillbox.armor},${pillbox.ownerTeam},${pillbox.inTank}`;
  }

  private getBaseStateHash(base: ServerBase): string {
    return `${base.armor},${base.shells},${base.mines},${base.ownerTeam}`;
  }

  private broadcastState(): void {
    // Delta compression: only send entities that changed since last broadcast
    const tanks = [];
    const builders = [];
    const changedTankIds = new Set<number>();

    for (const player of this.players.values()) {
      const tank = player.tank;
      const currentHash = this.getTankStateHash(tank);
      const previousHash = this.previousState.tanks.get(tank.id);

      // Include tank if it changed or is new
      if (currentHash !== previousHash) {
        tanks.push({
          id: tank.id,
          x: Math.round(tank.x),
          y: Math.round(tank.y),
          direction: tank.direction,
          speed: tank.speed,
          armor: tank.armor,
          shells: tank.shells,
          mines: tank.mines,
          trees: tank.trees,
          team: tank.team,
          onBoat: tank.onBoat,
          reload: tank.reload,
          firingRange: tank.firingRange,
        });
        this.previousState.tanks.set(tank.id, currentHash);
        changedTankIds.add(tank.id);
      }

      // Check builder changes
      const builder = tank.builder;
      const builderHash = this.getBuilderStateHash(builder);
      const previousBuilderHash = this.previousState.builders.get(builder.id);

      if (builderHash !== previousBuilderHash) {
        builders.push({
          id: builder.id,
          ownerTankId: builder.ownerTankId,
          x: Math.round(builder.x),
          y: Math.round(builder.y),
          targetX: Math.round(builder.targetX),
          targetY: Math.round(builder.targetY),
          order: builder.order,
          trees: builder.trees,
          hasMine: builder.hasMine,
          team: builder.team,
        });
        this.previousState.builders.set(builder.id, builderHash);
      }
    }

    // Shells: Always include all shells since they move every tick
    // Also track which shells existed for removed shell detection
    const shells = [];
    const currentShellIds = new Set<number>();
    for (const shell of this.shells.values()) {
      shells.push({
        id: shell.id,
        x: Math.round(shell.x),
        y: Math.round(shell.y),
        direction: shell.direction,
        ownerTankId: shell.ownerTankId,
      });
      currentShellIds.add(shell.id);
    }
    this.previousState.shells = currentShellIds;

    // Pillboxes: Only send if changed
    const pillboxes = [];
    for (const pillbox of this.pillboxes.values()) {
      const currentHash = this.getPillboxStateHash(pillbox);
      const previousHash = this.previousState.pillboxes.get(pillbox.id);

      if (currentHash !== previousHash) {
        pillboxes.push({
          id: pillbox.id,
          tileX: pillbox.tileX,
          tileY: pillbox.tileY,
          armor: pillbox.armor,
          ownerTeam: pillbox.ownerTeam,
          inTank: pillbox.inTank,
        });
        this.previousState.pillboxes.set(pillbox.id, currentHash);
      }
    }

    // Bases: Only send if changed
    const bases = [];
    for (const base of this.bases.values()) {
      const currentHash = this.getBaseStateHash(base);
      const previousHash = this.previousState.bases.get(base.id);

      if (currentHash !== previousHash) {
        bases.push({
          id: base.id,
          tileX: base.tileX,
          tileY: base.tileY,
          armor: base.armor,
          shells: base.shells,
          mines: base.mines,
          ownerTeam: base.ownerTeam,
        });
        this.previousState.bases.set(base.id, currentHash);
      }
    }

    // Collect terrain updates
    const terrainUpdates: TerrainUpdate[] = [];
    const mapData = this.world.getMapData();
    for (const key of this.terrainChanges) {
      const [xStr, yStr] = key.split(',');
      const x = Number(xStr);
      const y = Number(yStr);
      const cell = mapData[y]![x]!;

      // DEBUG: Log terrain updates being broadcast
      console.log(`[DEBUG] Broadcasting terrain update: (${x}, ${y}) terrain=${cell.terrain} (was potentially road)`);

      terrainUpdates.push({
        x,
        y,
        terrain: cell.terrain,
        terrainLife: cell.terrainLife,
      });
    }
    this.terrainChanges.clear(); // Clear for next update

    // Build update message with only changed entities
    // Skip empty arrays to reduce message size (EXCEPT shells - always send shells to clear dead ones on client)
    const update: UpdateMessage = {
      type: 'update',
      tick: this.tick,
      shells, // Always include shells (even if empty) so client can clear dead shells
      ...(tanks.length > 0 && { tanks }),
      ...(builders.length > 0 && { builders }),
      ...(pillboxes.length > 0 && { pillboxes }),
      ...(bases.length > 0 && { bases }),
      ...(terrainUpdates.length > 0 && { terrainUpdates }),
    };

    // Skip broadcast if nothing changed (rare but possible when idle)
    const hasChanges = tanks.length > 0 || shells.length > 0 || builders.length > 0 ||
                       pillboxes.length > 0 || bases.length > 0 || terrainUpdates.length > 0;

    if (!hasChanges) {
      return; // No changes, skip broadcast entirely
    }

    const message = encodeServerMessage(update);

    // Send to all players
    for (const player of this.players.values()) {
      if (player.ws.readyState === 1) { // OPEN
        player.ws.send(message);
      }
    }
  }

  getPlayerCount(): number {
    return this.players.size;
  }
}
