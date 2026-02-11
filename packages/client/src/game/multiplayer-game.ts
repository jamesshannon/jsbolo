/**
 * Multiplayer game class
 */

import {
  TICK_LENGTH_MS,
  TILE_SIZE_WORLD,
  PIXEL_SIZE_WORLD,
  TILE_SIZE_PIXELS,
  RangeAdjustment,
} from '@shared';
import {KeyboardInput} from '../input/keyboard.js';
import {BuilderInput} from '../input/builder-input.js';
import {Camera} from '../renderer/camera.js';
import {Renderer} from '../renderer/renderer.js';
import {World} from '../world/world.js';
import {NetworkClient} from '../network/network-client.js';
import {DebugOverlay} from '../debug/debug-overlay.js';
import {SoundManager} from '../audio/sound-manager.js';

export class MultiplayerGame {
  private readonly input: KeyboardInput;
  private readonly builderInput: BuilderInput;
  private readonly camera: Camera;
  private readonly renderer: Renderer;
  private readonly world: World;
  private readonly network: NetworkClient;
  private readonly debugOverlay: DebugOverlay;
  private readonly soundManager: SoundManager;

  private running = false;
  private tick = 0;
  private lastTickTime = 0;
  private accumulator = 0;

  // Network state
  private playerId: number | null = null;
  private mapName: string = 'Unknown';
  private tanks = new Map<number, any>();
  private shells = new Map<number, any>();
  private builders = new Map<number, any>();
  private pillboxes = new Map<number, any>();
  private bases = new Map<number, any>();

  // FPS tracking
  private fps = 0;
  private frameCount = 0;
  private lastFpsUpdate = 0;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    this.input = new KeyboardInput();
    this.camera = new Camera(canvas.width, canvas.height);
    this.builderInput = new BuilderInput(canvas, this.camera);
    this.renderer = new Renderer(ctx, this.camera);
    this.world = new World();
    this.network = new NetworkClient();
    this.debugOverlay = new DebugOverlay();
    this.soundManager = new SoundManager();

    // Setup builder command handler
    this.builderInput.setBuildCommandHandler((action, worldTileX, worldTileY) => {
      console.log(`Sending builder to world tile (${worldTileX}, ${worldTileY}) with action ${action}`);

      // Send build order to server
      this.network.sendInput({
        tick: this.tick,
        accelerating: false,
        braking: false,
        turningClockwise: false,
        turningCounterClockwise: false,
        shooting: false,
        rangeAdjustment: RangeAdjustment.NONE,
        buildOrder: {
          action,
          targetX: worldTileX,
          targetY: worldTileY,
        },
      });
    });

    this.network.onWelcome(welcome => {
      this.playerId = welcome.playerId ?? null;
      this.mapName = welcome.mapName || 'Unknown';
      console.log('Assigned player ID:', this.playerId);
      console.log('Map name:', this.mapName);

      // Load terrain data from server
      if (welcome.map) {
        console.log(`Loading map: ${welcome.map.width}x${welcome.map.height}, ${welcome.map.terrain.length} terrain tiles`);

        // Sample first few tiles to verify data
        console.log('First 10 terrain tiles:', welcome.map.terrain.slice(0, 10));

        // Sample row 241 to compare with server
        const row241Start = 241 * 256;
        console.log('Row 241 first 10 tiles:', welcome.map.terrain.slice(row241Start, row241Start + 10));

        // Count terrain types in received data
        const clientHistogram = new Map<number, number>();
        for (const t of welcome.map.terrain) {
          clientHistogram.set(t, (clientHistogram.get(t) || 0) + 1);
        }
        console.log('Client received terrain histogram:', Object.fromEntries(clientHistogram));

        let tilesUpdated = 0;
        for (let y = 0; y < welcome.map.height; y++) {
          for (let x = 0; x < welcome.map.width; x++) {
            const index = y * welcome.map.width + x;
            this.world.updateCell(x, y, {
              terrain: welcome.map.terrain[index]!,
              terrainLife: welcome.map.terrainLife[index]!,
            });
            tilesUpdated++;
          }
        }
        console.log(`Terrain data loaded from server: ${tilesUpdated} tiles updated`);

        // Sample some tiles to verify they were set
        const sampleTile = this.world.getCellAt(125, 152);
        console.log('Sample tile at (125, 152):', sampleTile);
      }

      // Load initial entity state
      if (welcome.tanks) {
        for (const tank of welcome.tanks) {
          this.tanks.set(tank.id, tank);
        }
        console.log(`Loaded ${welcome.tanks.length} tanks from welcome message`);
      }

      if (welcome.pillboxes) {
        for (const pillbox of welcome.pillboxes) {
          this.pillboxes.set(pillbox.id, pillbox);
        }
        console.log(`Loaded ${welcome.pillboxes.length} pillboxes from welcome message`);
      }

      if (welcome.bases) {
        for (const base of welcome.bases) {
          this.bases.set(base.id, base);
        }
        console.log(`Loaded ${welcome.bases.length} bases from welcome message`);
      }
    });

    this.network.onUpdate(update => {
      // Delta updates: merge changed entities instead of replacing all state
      if (update.tanks) {
        for (const tank of update.tanks) {
          if (tank.id !== undefined) {
            this.tanks.set(tank.id, tank);
          }
        }
      }
      if (update.shells) {
        // Shells are always included when they exist (they move every tick)
        // So we can safely replace the entire collection
        this.shells.clear();
        for (const shell of update.shells) {
          if (shell.id !== undefined) {
            this.shells.set(shell.id, shell);
          }
        }
      }
      if (update.builders) {
        for (const builder of update.builders) {
          if (builder.id !== undefined) {
            this.builders.set(builder.id, builder);
          }
        }
      }
      if (update.pillboxes) {
        for (const pillbox of update.pillboxes) {
          if (pillbox.id !== undefined) {
            this.pillboxes.set(pillbox.id, pillbox);
          }
        }
      }
      if (update.bases) {
        for (const base of update.bases) {
          if (base.id !== undefined) {
            this.bases.set(base.id, base);
          }
        }
      }
      if (update.terrainUpdates) {
        for (const terrainUpdate of update.terrainUpdates) {
          // DEBUG: Log terrain updates received
          const oldCell = this.world.getCellAt(terrainUpdate.x, terrainUpdate.y);
          console.log(`[CLIENT] Received terrain update: (${terrainUpdate.x}, ${terrainUpdate.y}) ${oldCell?.terrain} -> ${terrainUpdate.terrain}`);

          this.world.updateCell(terrainUpdate.x, terrainUpdate.y, {
            terrain: terrainUpdate.terrain,
            terrainLife: terrainUpdate.terrainLife,
            ...(terrainUpdate.direction !== undefined && { direction: terrainUpdate.direction }),
          });
        }
      }

      // Handle sound events
      if (update.soundEvents && this.playerId !== null) {
        const myTank = this.tanks.get(this.playerId);
        if (myTank && myTank.x !== undefined && myTank.y !== undefined) {
          for (const soundEvent of update.soundEvents) {
            // Check if this sound is from the player's own tank (within 128 world units)
            const dx = soundEvent.x - myTank.x;
            const dy = soundEvent.y - myTank.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const isOwnTank = distance < 128; // Half a tile

            this.soundManager.playSound(soundEvent, myTank.x, myTank.y, isOwnTank);
          }
        }
      }
    });
  }

  async init(serverUrl: string): Promise<void> {
    await Promise.all([
      this.renderer.loadAssets(),
      this.soundManager.preloadSounds(),
    ]);
    await this.network.connect(serverUrl);
    this.updateDebugInfo();
  }

  start(): void {
    this.running = true;
    this.lastTickTime = performance.now();
    this.lastFpsUpdate = performance.now();
    this.gameLoop(this.lastTickTime);
  }

  stop(): void {
    this.running = false;
  }

  private gameLoop(currentTime: number): void {
    if (!this.running) {
      return;
    }

    requestAnimationFrame(time => this.gameLoop(time));

    const deltaTime = currentTime - this.lastTickTime;
    this.lastTickTime = currentTime;

    this.accumulator += deltaTime;

    while (this.accumulator >= TICK_LENGTH_MS) {
      this.update();
      this.accumulator -= TICK_LENGTH_MS;
      this.tick++;
    }

    this.render();

    this.frameCount++;
    if (currentTime - this.lastFpsUpdate >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
      this.updateDebugInfo();
    }

    // Get terrain info for player's current tile
    let terrainInfo: {terrain: string; life: number; hasMine: boolean} | undefined = undefined;
    if (this.playerId !== null) {
      const myTank = this.tanks.get(this.playerId);
      if (myTank && myTank.x !== undefined && myTank.y !== undefined) {
        const tileX = Math.floor(myTank.x / TILE_SIZE_WORLD);
        const tileY = Math.floor(myTank.y / TILE_SIZE_WORLD);
        const cell = this.world.getCellAt(tileX, tileY);
        if (cell) {
          const terrainNames: Record<number, string> = {
            0: 'Building',
            1: 'River',
            2: 'Swamp',
            3: 'Crater',
            4: 'Road',
            5: 'Forest',
            6: 'Rubble',
            7: 'Grass',
            8: 'Shot Building',
            9: 'Boat',
            10: 'Deep Sea',
          };
          terrainInfo = {
            terrain: terrainNames[cell.terrain] || 'Unknown',
            life: cell.terrainLife,
            hasMine: cell.hasMine,
          };
        }
      }
    }

    // Update debug overlay
    this.debugOverlay.update({
      tanks: this.tanks,
      pillboxes: this.pillboxes,
      bases: this.bases,
      shells: this.shells,
      builders: this.builders,
      myPlayerId: this.playerId,
      tick: this.tick,
      fps: this.fps,
      mapName: this.mapName,
      terrainInfo,
    });
  }

  private update(): void {
    const inputState = this.input.getState();

    // Debug input state
    if (inputState.accelerating || inputState.braking || inputState.turningLeft || inputState.turningRight) {
      console.log('Input state:', inputState);
    }

    // Determine range adjustment
    let rangeAdjustment = RangeAdjustment.NONE;
    if (inputState.increaseRange) {
      rangeAdjustment = RangeAdjustment.INCREASE;
    } else if (inputState.decreaseRange) {
      rangeAdjustment = RangeAdjustment.DECREASE;
    }

    // Send input to server
    this.network.sendInput({
      tick: this.tick,
      accelerating: inputState.accelerating,
      braking: inputState.braking,
      turningClockwise: inputState.turningRight,
      turningCounterClockwise: inputState.turningLeft,
      shooting: inputState.shooting,
      rangeAdjustment,
    });

    // Center camera on our tank
    if (this.playerId !== null) {
      const myTank = this.tanks.get(this.playerId);
      if (myTank && myTank.x !== undefined && myTank.y !== undefined) {
        // Convert from world coordinates to pixel coordinates
        const pixelX = (myTank.x / PIXEL_SIZE_WORLD);
        const pixelY = (myTank.y / PIXEL_SIZE_WORLD);
        this.camera.centerOn(pixelX, pixelY);
      }
    }
  }

  private render(): void {
    this.renderer.renderMultiplayer(
      this.world,
      this.tanks,
      this.shells,
      this.builders,
      this.pillboxes,
      this.bases,
      this.playerId
    );
  }

  private updateDebugInfo(): void {
    const fpsElement = document.getElementById('fps');
    const tickElement = document.getElementById('tick');
    const tankPosElement = document.getElementById('tank-pos');
    const tankDirElement = document.getElementById('tank-dir');
    const tankSpeedElement = document.getElementById('tank-speed');

    if (fpsElement) {
      fpsElement.textContent = this.fps.toString();
    }
    if (tickElement) {
      tickElement.textContent = this.tick.toString();
    }

    if (this.playerId !== null) {
      const myTank = this.tanks.get(this.playerId);
      if (myTank) {
        if (tankPosElement && myTank.x !== undefined && myTank.y !== undefined) {
          const tileX = Math.floor(myTank.x / TILE_SIZE_WORLD);
          const tileY = Math.floor(myTank.y / TILE_SIZE_WORLD);
          tankPosElement.textContent = `${tileX}, ${tileY}`;
        }
        if (tankDirElement && myTank.direction !== undefined) {
          const dir16 = Math.round((myTank.direction - 1) / 16) % 16;
          tankDirElement.textContent = `${myTank.direction}° (${dir16}/16)`;
        }
        if (tankSpeedElement && myTank.speed !== undefined) {
          tankSpeedElement.textContent = myTank.speed.toFixed(2);
        }

        // Update HUD
        this.updateHUD(myTank);
      }
    }
  }

  private updateHUD(tank: any): void {
    const hudArmor = document.getElementById('hud-armor');
    const hudArmorBar = document.getElementById('hud-armor-bar');
    const hudShells = document.getElementById('hud-shells');
    const hudMines = document.getElementById('hud-mines');
    const hudTrees = document.getElementById('hud-trees');
    const hudRange = document.getElementById('hud-range');
    const hudBuilder = document.getElementById('hud-builder');

    if (hudArmor) {
      hudArmor.textContent = `${tank.armor}/40`;
    }
    if (hudArmorBar) {
      const percent = (tank.armor / 40) * 100;
      hudArmorBar.style.width = `${percent}%`;
    }
    if (hudShells) {
      hudShells.textContent = `${tank.shells}/40`;
    }
    if (hudMines) {
      hudMines.textContent = `${tank.mines}/40`;
    }
    if (hudTrees) {
      hudTrees.textContent = `${tank.trees}/40`;
    }
    if (hudRange && tank.firingRange !== undefined) {
      hudRange.textContent = `${tank.firingRange} tiles`;
    }

    // Update builder status
    if (hudBuilder && this.playerId !== null) {
      const myBuilder = this.builders.get(this.playerId);
      if (myBuilder) {
        const orderNames = [
          'In Tank',
          'Waiting',
          'Returning',
          'Parachuting',
          '', '', '', '', '', '',
          'Harvesting',
          'Building Road',
          'Repairing',
          'Building Boat',
          'Building Wall',
          'Placing Pillbox',
          'Laying Mine',
        ];
        hudBuilder.textContent = orderNames[myBuilder.order] || 'Unknown';
      }
    }
  }

  destroy(): void {
    this.stop();
    this.network.disconnect();
    this.input.destroy();
    this.builderInput.destroy();
    this.debugOverlay.destroy();
  }
}
