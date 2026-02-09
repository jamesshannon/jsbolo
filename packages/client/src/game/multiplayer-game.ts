/**
 * Multiplayer game class
 */

import {TICK_LENGTH_MS, TILE_SIZE_WORLD, PIXEL_SIZE_WORLD, RangeAdjustment} from '@shared';
import {KeyboardInput} from '../input/keyboard.js';
import {Camera} from '../renderer/camera.js';
import {Renderer} from '../renderer/renderer.js';
import {World} from '../world/world.js';
import {NetworkClient} from '../network/network-client.js';
import type {proto} from '@shared';

export class MultiplayerGame {
  private readonly input: KeyboardInput;
  private readonly camera: Camera;
  private readonly renderer: Renderer;
  private readonly world: World;
  private readonly network: NetworkClient;

  private running = false;
  private tick = 0;
  private lastTickTime = 0;
  private accumulator = 0;

  // Network state
  private playerId: number | null = null;
  private tanks = new Map<number, proto.jsbolo.ITankState>();

  // FPS tracking
  private fps = 0;
  private frameCount = 0;
  private lastFpsUpdate = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D
  ) {
    this.input = new KeyboardInput();
    this.camera = new Camera(canvas.width, canvas.height);
    this.renderer = new Renderer(ctx, this.camera);
    this.world = new World();
    this.network = new NetworkClient();

    this.network.onWelcome(welcome => {
      this.playerId = welcome.playerId ?? null;
      console.log('Assigned player ID:', this.playerId);
    });

    this.network.onUpdate(update => {
      if (update.tanks) {
        this.tanks.clear();
        for (const tank of update.tanks) {
          if (tank.id !== undefined) {
            this.tanks.set(tank.id, tank);
          }
        }
      }
    });
  }

  async init(serverUrl: string): Promise<void> {
    await this.renderer.loadAssets();
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
  }

  private update(): void {
    const inputState = this.input.getState();

    // Send input to server
    this.network.sendInput({
      tick: this.tick,
      accelerating: inputState.accelerating,
      braking: inputState.braking,
      turningClockwise: inputState.turningRight,
      turningCounterClockwise: inputState.turningLeft,
      shooting: inputState.shooting,
      rangeAdjustment: RangeAdjustment.NONE,
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
    this.renderer.renderMultiplayer(this.world, this.tanks, this.playerId);
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
      }
    }
  }

  destroy(): void {
    this.stop();
    this.network.disconnect();
    this.input.destroy();
  }
}
