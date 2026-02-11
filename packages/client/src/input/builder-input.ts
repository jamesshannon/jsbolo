/**
 * Builder input handling
 */

import {BuildAction, TILE_SIZE_PIXELS} from '@shared';
import type {Camera} from '../renderer/camera.js';

export class BuilderInput {
  private pendingAction: BuildAction = BuildAction.NONE;
  private canvas: HTMLCanvasElement;
  private camera: Camera;
  private onBuildCommand?: (
    action: BuildAction,
    tileX: number,
    tileY: number
  ) => void;

  constructor(canvas: HTMLCanvasElement, camera: Camera) {
    this.canvas = canvas;
    this.camera = camera;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Keyboard for selecting action
    window.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Mouse for selecting target tile
    this.canvas.addEventListener('click', this.handleClick.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.key.toLowerCase()) {
      case 't':
        this.pendingAction = BuildAction.FOREST; // Harvest trees
        console.log('Builder: Select tile to harvest trees');
        break;
      case 'd':
        this.pendingAction = BuildAction.ROAD; // Build road
        console.log('Builder: Select tile to build road');
        break;
      case 'r':
        this.pendingAction = BuildAction.REPAIR; // Repair pillbox
        console.log('Builder: Select pillbox to repair');
        break;
      case 'w':
        this.pendingAction = BuildAction.BUILDING; // Build wall
        console.log('Builder: Select tile to build wall');
        break;
      case 'b':
        this.pendingAction = BuildAction.BOAT; // Build boat
        console.log('Builder: Select tile to build boat');
        break;
      case 'p':
        this.pendingAction = BuildAction.PILLBOX; // Place pillbox
        console.log('Builder: Select tile to place pillbox');
        break;
      case 'm':
        this.pendingAction = BuildAction.MINE; // Lay mine
        console.log('Builder: Select tile to lay mine');
        break;
      case 'c':
      case 'escape':
        // Recall builder (send to tank position)
        this.pendingAction = BuildAction.NONE;
        console.log('Builder: Recalled');
        // TODO: Send recall command
        break;
    }
  }

  private handleClick(event: MouseEvent): void {
    if (this.pendingAction === BuildAction.NONE) {
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    const canvasX = event.clientX - rect.left;
    const canvasY = event.clientY - rect.top;

    // Convert canvas coordinates to world pixel coordinates using camera
    const worldPos = this.camera.screenToWorld(canvasX, canvasY);

    // Convert world pixel coordinates to world tile coordinates
    const tileX = Math.floor(worldPos.x / TILE_SIZE_PIXELS);
    const tileY = Math.floor(worldPos.y / TILE_SIZE_PIXELS);

    console.log(
      `Builder command: ${this.pendingAction} at canvas (${Math.floor(canvasX)}, ${Math.floor(canvasY)}) -> world tile (${tileX}, ${tileY})`
    );

    if (this.onBuildCommand) {
      this.onBuildCommand(this.pendingAction, tileX, tileY);
    }

    // Clear pending action after use
    this.pendingAction = BuildAction.NONE;
  }

  /**
   * Set callback for build commands
   */
  setBuildCommandHandler(
    handler: (action: BuildAction, tileX: number, tileY: number) => void
  ): void {
    this.onBuildCommand = handler;
  }

  /**
   * Get current pending action (for UI feedback)
   */
  getPendingAction(): BuildAction {
    return this.pendingAction;
  }

  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    this.canvas.removeEventListener('click', this.handleClick.bind(this));
  }
}
