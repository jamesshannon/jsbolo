/**
 * Main game class
 */

import {TICK_LENGTH_MS} from '@shared';
import {KeyboardInput} from '../input/keyboard.js';
import {Camera} from '../renderer/camera.js';
import {Renderer} from '../renderer/renderer.js';
import {World} from '../world/world.js';
import {Tank} from '../entities/tank.js';

export class Game {
  private readonly input: KeyboardInput;
  private readonly camera: Camera;
  private readonly renderer: Renderer;
  private readonly world: World;
  private readonly tank: Tank;

  private running = false;
  private tick = 0;
  private lastTickTime = 0;
  private accumulator = 0;

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
    this.renderer = new Renderer(ctx, this.camera);
    this.world = new World();

    // Spawn tank near center of map
    this.tank = new Tank(128, 128);
  }

  async init(): Promise<void> {
    await this.renderer.loadAssets();
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

    // Accumulate time
    this.accumulator += deltaTime;

    // Fixed timestep update
    while (this.accumulator >= TICK_LENGTH_MS) {
      this.update();
      this.accumulator -= TICK_LENGTH_MS;
      this.tick++;
    }

    // Render
    this.render();

    // Update FPS
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

    // Get terrain speed multiplier at tank's current position
    const tilePos = this.tank.getTilePosition();
    const terrainSpeed = this.world.getTankSpeedAt(tilePos.x, tilePos.y);

    // Update tank with terrain-based speed
    this.tank.update(inputState, terrainSpeed);

    // Center camera on tank
    this.camera.centerOn(this.tank.x, this.tank.y);
  }

  private render(): void {
    this.renderer.render(this.world, this.tank);
    // Uncomment to show grid:
    // this.renderer.drawGrid();
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
    if (tankPosElement) {
      const tilePos = this.tank.getTilePosition();
      tankPosElement.textContent = `${tilePos.x}, ${tilePos.y}`;
    }
    if (tankDirElement) {
      tankDirElement.textContent = `${this.tank.direction}° (${this.tank.getDirection16()}/16)`;
    }
    if (tankSpeedElement) {
      tankSpeedElement.textContent = this.tank.speed.toFixed(2);
    }
  }

  destroy(): void {
    this.stop();
    this.input.destroy();
  }
}
