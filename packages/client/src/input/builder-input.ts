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
    window.addEventListener('keydown', this.handleKeyDown);

    // Mouse for selecting target tile
    this.canvas.addEventListener('click', this.handleClick);
  }

  private readonly handleKeyDown = (event: KeyboardEvent): void => {
    switch (event.key.toLowerCase()) {
      case 't':
        this.setPendingAction(BuildAction.FOREST);
        break;
      case 'd':
        this.setPendingAction(BuildAction.ROAD);
        break;
      case 'r':
        this.setPendingAction(BuildAction.REPAIR);
        break;
      case 'w':
        this.setPendingAction(BuildAction.BUILDING);
        break;
      case 'b':
        this.setPendingAction(BuildAction.BOAT);
        break;
      case 'p':
        this.setPendingAction(BuildAction.PILLBOX);
        break;
      case 'm':
        this.setPendingAction(BuildAction.MINE);
        break;
      case 'c':
      case 'escape':
        this.recallBuilder();
        break;
    }
  };

  private readonly handleClick = (event: MouseEvent): void => {
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

    // NOTE: Action stays active (sticky mode) until changed by another key
    // User can click multiple tiles with the same action without re-pressing the key
  };

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

  /**
   * Programmatically set builder action mode (used by HUD buttons and keyboard).
   */
  setPendingAction(action: BuildAction): void {
    this.pendingAction = action;
    switch (action) {
      case BuildAction.FOREST:
        console.log('Builder: Select tile to harvest trees');
        break;
      case BuildAction.ROAD:
        console.log('Builder: Select tile to build road');
        break;
      case BuildAction.REPAIR:
        console.log('Builder: Select pillbox to repair');
        break;
      case BuildAction.BUILDING:
        console.log('Builder: Select tile to build wall');
        break;
      case BuildAction.BOAT:
        console.log('Builder: Select tile to build boat');
        break;
      case BuildAction.PILLBOX:
        console.log('Builder: Select tile to place pillbox');
        break;
      case BuildAction.MINE:
        console.log('Builder: Select tile to lay mine');
        break;
      default:
        break;
    }
  }

  recallBuilder(): void {
    // TODO: Send recall command
    this.pendingAction = BuildAction.NONE;
    console.log('Builder: Recalled');
  }

  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.canvas.removeEventListener('click', this.handleClick);
  }
}
