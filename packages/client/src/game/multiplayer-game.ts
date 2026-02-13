/**
 * Multiplayer game class
 */

import {
  TICK_LENGTH_MS,
  TILE_SIZE_WORLD,
  PIXEL_SIZE_WORLD,
  BuildAction,
  RangeAdjustment,
  TerrainType,
  type Tank,
  type Shell,
  type Builder,
  type Pillbox,
  type Base,
} from '@shared';
import {KeyboardInput} from '../input/keyboard.js';
import {BuilderInput} from '../input/builder-input.js';
import {Camera} from '../renderer/camera.js';
import {Renderer} from '../renderer/renderer.js';
import {World} from '../world/world.js';
import {NetworkClient} from '../network/network-client.js';
import {TankInterpolator} from '../network/tank-interpolator.js';
import {BuilderInterpolator} from '../network/builder-interpolator.js';
import {DebugOverlay} from '../debug/debug-overlay.js';
import {SoundManager} from '../audio/sound-manager.js';
import {toNetworkInput} from './input-mapping.js';
import {applyNetworkEntityUpdate} from './network-entity-state.js';
import {applyNetworkWorldEffects} from './network-world-effects.js';
import {applyNetworkWelcomeState} from './network-welcome-state.js';
import {deriveStructureHudMessages} from './hud-events.js';
import {deriveTankHudMarkers} from './hud-tank-status.js';
import {deriveTickerMessagesFromServerHud} from './hud-message-stream.js';

export class MultiplayerGame {
  private readonly input: KeyboardInput;
  private readonly builderInput: BuilderInput;
  private readonly camera: Camera;
  private readonly renderer: Renderer;
  private readonly world: World;
  private readonly network: NetworkClient;
  private readonly tankInterpolator: TankInterpolator;
  private readonly builderInterpolator: BuilderInterpolator;
  private readonly debugOverlay: DebugOverlay;
  private readonly soundManager: SoundManager;

  private running = false;
  private tick = 0;
  private lastTickTime = 0;
  private accumulator = 0;

  // Network state
  private playerId: number | null = null;
  private mapName: string = 'Unknown';
  private tanks = new Map<number, Tank>();
  private shells = new Map<number, Shell>();
  private builders = new Map<number, Builder>();
  private pillboxes = new Map<number, Pillbox>();
  private bases = new Map<number, Base>();

  // FPS tracking
  private fps = 0;
  private frameCount = 0;
  private lastFpsUpdate = 0;
  private pillboxButtonUsesRepair = false;
  private readonly tickerQueue: string[] = [];
  private tickerActiveUntilMs = 0;
  private currentTickerText = 'Ready.';

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
    this.tankInterpolator = new TankInterpolator();
    this.builderInterpolator = new BuilderInterpolator();
    this.debugOverlay = new DebugOverlay();
    this.soundManager = new SoundManager();
    this.bindBuilderHudButtons();
    this.setTickerText('Ready.');

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
      const welcomeState = applyNetworkWelcomeState(welcome, {
        world: this.world,
        tanks: this.tanks,
        shells: this.shells,
        builders: this.builders,
        pillboxes: this.pillboxes,
        bases: this.bases,
        tankInterpolator: this.tankInterpolator,
        builderInterpolator: this.builderInterpolator,
        nowMs: performance.now(),
      });
      this.playerId = welcomeState.playerId;
      this.mapName = welcomeState.mapName;
    });

    this.network.onUpdate(update => {
      const now = performance.now();
      const previousPillboxes = new Map(this.pillboxes);
      const previousBases = new Map(this.bases);
      applyNetworkEntityUpdate(
        update,
        {
          tanks: this.tanks,
          shells: this.shells,
          builders: this.builders,
          pillboxes: this.pillboxes,
          bases: this.bases,
        },
        now,
        {
          onTankUpdated: (tank, tick, receivedAtMs) => {
            this.tankInterpolator.pushSnapshot(tank, tick, receivedAtMs);
          },
          onTankRemoved: tankId => {
            this.tankInterpolator.removeTank(tankId);
          },
          onBuilderUpdated: (builder, tick, receivedAtMs) => {
            this.builderInterpolator.pushSnapshot(builder, tick, receivedAtMs);
          },
          onBuilderRemoved: builderId => {
            this.builderInterpolator.removeBuilder(builderId);
          },
        }
      );
      applyNetworkWorldEffects(update, {
        world: this.world,
        playerId: this.playerId,
        tanks: this.tanks,
        soundPlayback: this.soundManager,
      });
      const serverHudMessages = deriveTickerMessagesFromServerHud(update.hudMessages);
      for (const message of serverHudMessages) {
        this.enqueueHudMessage(message);
      }

      const structureMessages = deriveStructureHudMessages({
        previousPillboxes,
        previousBases,
        ...(update.pillboxes !== undefined && {updatedPillboxes: update.pillboxes}),
        ...(update.bases !== undefined && {updatedBases: update.bases}),
        myTeam: this.getMyTeam(),
      });
      for (const message of structureMessages) {
        this.enqueueHudMessage(message);
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
          terrainInfo = {
            terrain: this.getTerrainName(cell.terrain),
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

    this.updateHudTicker(currentTime);
  }

  private update(): void {
    const inputState = this.input.getState();

    // Debug input state
    if (inputState.accelerating || inputState.braking || inputState.turningLeft || inputState.turningRight) {
      console.log('Input state:', inputState);
    }

    // Send input to server
    this.network.sendInput(toNetworkInput(inputState, this.tick));

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
    const renderTanks = this.getRenderTanks();
    const renderBuilders = this.getRenderBuilders();
    this.renderer.renderMultiplayer(
      this.world,
      renderTanks,
      this.shells,
      renderBuilders,
      this.pillboxes,
      this.bases,
      this.playerId
    );
  }

  private getRenderTanks(): Map<number, Tank> {
    const now = performance.now();
    const renderTanks = new Map<number, Tank>();

    for (const [tankId, tank] of this.tanks) {
      if (this.playerId !== null && tankId === this.playerId) {
        renderTanks.set(tankId, tank);
        continue;
      }

      const interpolated = this.tankInterpolator.getInterpolatedTank(tankId, now);
      renderTanks.set(tankId, interpolated ?? tank);
    }

    return renderTanks;
  }

  private getRenderBuilders(): Map<number, Builder> {
    const now = performance.now();
    const renderBuilders = new Map<number, Builder>();

    for (const [builderId, builder] of this.builders) {
      if (this.playerId !== null && builder.ownerTankId === this.playerId) {
        renderBuilders.set(builderId, builder);
        continue;
      }

      const interpolated = this.builderInterpolator.getInterpolatedBuilder(builderId, now);
      renderBuilders.set(builderId, interpolated ?? builder);
    }

    return renderBuilders;
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

  private updateHUD(tank: Tank): void {
    const hudArmor = document.getElementById('hud-armor');
    const hudArmorBar = document.getElementById('hud-armor-bar');
    const hudShells = document.getElementById('hud-shells');
    const hudMines = document.getElementById('hud-mines');
    const hudTrees = document.getElementById('hud-trees');
    const hudKills = document.getElementById('hud-player-kills');
    const hudDeaths = document.getElementById('hud-player-deaths');
    const hudBuilderMode = document.getElementById('hud-builder-mode');
    const hudBuilderModeSide = document.getElementById('hud-builder-mode-side');
    const hudRange = document.getElementById('hud-range');
    const hudPlayerShield = document.getElementById('hud-player-shield');
    const hudPillboxes = document.getElementById('hud-pillbox-list');
    const hudBases = document.getElementById('hud-base-list');
    const hudNearestBaseOwner = document.getElementById('hud-nearest-base-owner');
    const hudNearestBaseArmor = document.getElementById('hud-nearest-base-armor');
    const hudNearestBaseShells = document.getElementById('hud-nearest-base-shells');
    const hudNearestBaseMines = document.getElementById('hud-nearest-base-mines');
    const hudTankList = document.getElementById('hud-tank-list');
    const hudTankSummary = document.getElementById('hud-tank-summary');

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
    if (hudPlayerShield) {
      hudPlayerShield.textContent = `${tank.armor}/40`;
    }
    if (hudRange) {
      hudRange.textContent = `${tank.firingRange} tiles`;
    }
    // ASSUMPTION: kill/death counters are not yet authoritative in protocol.
    // Keep placeholders until server emits these stats.
    if (hudKills) {
      hudKills.textContent = '0';
    }
    if (hudDeaths) {
      hudDeaths.textContent = '0';
    }
    const buildAction = this.builderInput.getPendingAction();
    if (hudBuilderMode) {
      hudBuilderMode.textContent = this.getBuildActionLabel(buildAction);
    }
    if (hudBuilderModeSide) {
      hudBuilderModeSide.textContent = this.getBuildActionLabel(buildAction);
    }
    this.refreshBuilderHudButtonState();

    if (hudPillboxes) {
      const myTeam = tank.team;
      const chips = Array.from(this.pillboxes.values()).map(pillbox => {
        const cls =
          pillbox.ownerTeam === 255
            ? 'neutral'
            : pillbox.ownerTeam === myTeam
              ? 'owned'
              : 'enemy';
        return `<span class="hud-chip ${cls}"></span>`;
      });
      hudPillboxes.innerHTML = chips.join('');
    }

    if (hudBases) {
      const myTeam = tank.team;
      const chips = Array.from(this.bases.values()).map(base => {
        const cls =
          base.ownerTeam === 255
            ? 'neutral'
            : base.ownerTeam === myTeam
              ? 'owned'
              : 'enemy';
        return `<span class="hud-chip ${cls}"></span>`;
      });
      hudBases.innerHTML = chips.join('');
    }

    if (
      hudNearestBaseOwner &&
      hudNearestBaseArmor &&
      hudNearestBaseShells &&
      hudNearestBaseMines
    ) {
      const nearestBase = this.getNearestBaseToTank(tank);
      if (!nearestBase) {
        hudNearestBaseOwner.textContent = 'None';
        hudNearestBaseArmor.textContent = '-';
        hudNearestBaseShells.textContent = '-';
        hudNearestBaseMines.textContent = '-';
      } else {
        hudNearestBaseOwner.textContent =
          nearestBase.ownerTeam === 255 ? 'Neutral' : `Team ${nearestBase.ownerTeam}`;
        hudNearestBaseArmor.textContent = `${nearestBase.armor}`;
        hudNearestBaseShells.textContent = `${nearestBase.shells}`;
        hudNearestBaseMines.textContent = `${nearestBase.mines}`;
      }
    }

    if (hudTankList || hudTankSummary) {
      const tankMarkers = deriveTankHudMarkers({
        tanks: this.tanks.values(),
        myPlayerId: this.playerId,
        myTeam: tank.team,
      });
      const friendlyCount = tankMarkers.filter(marker => marker.relation === 'friendly').length;
      const hostileCount = tankMarkers.filter(marker => marker.relation === 'hostile').length;

      if (hudTankSummary) {
        hudTankSummary.textContent = `${friendlyCount} friendly / ${hostileCount} hostile`;
      }

      if (hudTankList) {
        const markerNodes = tankMarkers.map(marker =>
          `<span class="hud-chip ${marker.relation}" title="P${marker.playerId}"></span>`
        );
        hudTankList.innerHTML = markerNodes.join('');
      }
    }
  }

  private getNearestBaseToTank(tank: Tank): Base | null {
    let nearest: Base | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const base of this.bases.values()) {
      const baseX = (base.tileX + 0.5) * TILE_SIZE_WORLD;
      const baseY = (base.tileY + 0.5) * TILE_SIZE_WORLD;
      const dx = tank.x - baseX;
      const dy = tank.y - baseY;
      const distance = (dx * dx) + (dy * dy);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = base;
      }
    }

    return nearest;
  }

  private getMyTeam(): number | null {
    if (this.playerId === null) {
      return null;
    }
    const tank = this.tanks.get(this.playerId);
    return tank?.team ?? null;
  }

  private enqueueHudMessage(message: string): void {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return;
    }

    const lastQueued = this.tickerQueue[this.tickerQueue.length - 1];
    if (lastQueued === trimmedMessage || this.currentTickerText === trimmedMessage) {
      return;
    }

    this.tickerQueue.push(trimmedMessage);
    this.updateHudTicker(performance.now());
  }

  private updateHudTicker(nowMs: number): void {
    if (nowMs < this.tickerActiveUntilMs) {
      return;
    }

    const nextMessage = this.tickerQueue.shift();
    if (nextMessage) {
      this.setTickerText(nextMessage);
      this.tickerActiveUntilMs = nowMs + 3200;
      return;
    }

    if (this.currentTickerText !== 'Ready.') {
      this.setTickerText('Ready.');
    }
  }

  private setTickerText(text: string): void {
    const tickerElement = document.getElementById('hud-ticker-text');
    if (!tickerElement) {
      return;
    }
    tickerElement.textContent = text;
    this.currentTickerText = text;
  }

  private bindBuilderHudButtons(): void {
    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[data-build-action]')
    );

    for (const button of buttons) {
      button.addEventListener('click', () => {
        const action = button.dataset.buildAction;
        if (action === 'pillbox-toggle') {
          this.pillboxButtonUsesRepair = !this.pillboxButtonUsesRepair;
          const nextAction = this.pillboxButtonUsesRepair
            ? BuildAction.REPAIR
            : BuildAction.PILLBOX;
          this.builderInput.setPendingAction(nextAction);
          button.dataset.mode = this.pillboxButtonUsesRepair ? 'repair' : 'place';
        } else {
          const parsedAction = Number(action);
          if (!Number.isNaN(parsedAction)) {
            this.builderInput.setPendingAction(parsedAction as BuildAction);
          }
        }
        this.refreshBuilderHudButtonState();
      });
    }
  }

  private refreshBuilderHudButtonState(): void {
    const activeAction = this.builderInput.getPendingAction();
    // Keep button mode aligned even when action was selected from keyboard.
    if (activeAction === BuildAction.REPAIR) {
      this.pillboxButtonUsesRepair = true;
    } else if (activeAction === BuildAction.PILLBOX) {
      this.pillboxButtonUsesRepair = false;
    }

    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[data-build-action]')
    );
    for (const button of buttons) {
      const action = button.dataset.buildAction;
      if (action === 'pillbox-toggle') {
        button.dataset.mode = this.pillboxButtonUsesRepair ? 'repair' : 'place';
        const isActive =
          (this.pillboxButtonUsesRepair && activeAction === BuildAction.REPAIR) ||
          (!this.pillboxButtonUsesRepair && activeAction === BuildAction.PILLBOX);
        button.classList.toggle('active', isActive);
      } else {
        button.classList.toggle('active', Number(action) === activeAction);
      }
    }
  }

  private getBuildActionLabel(action: BuildAction): string {
    switch (action) {
      case BuildAction.FOREST:
        return 'Harvest';
      case BuildAction.ROAD:
        return 'Road';
      case BuildAction.BUILDING:
        return 'Wall';
      case BuildAction.PILLBOX:
        return 'Pillbox';
      case BuildAction.REPAIR:
        return 'Repair';
      case BuildAction.MINE:
        return 'Mine';
      case BuildAction.BOAT:
        return 'Boat';
      default:
        return 'None';
    }
  }

  private getTerrainName(terrain: TerrainType): string {
    switch (terrain) {
      case TerrainType.BUILDING:
        return 'Building';
      case TerrainType.RIVER:
        return 'River';
      case TerrainType.SWAMP:
        return 'Swamp';
      case TerrainType.CRATER:
        return 'Crater';
      case TerrainType.ROAD:
        return 'Road';
      case TerrainType.FOREST:
        return 'Forest';
      case TerrainType.RUBBLE:
        return 'Rubble';
      case TerrainType.GRASS:
        return 'Grass';
      case TerrainType.SHOT_BUILDING:
        return 'Shot Building';
      case TerrainType.BOAT:
        return 'Boat';
      case TerrainType.DEEP_SEA:
        return 'Deep Sea';
      default:
        return 'Unknown';
    }
  }

  destroy(): void {
    this.stop();
    this.network.disconnect();
    this.tankInterpolator.clear();
    this.builderInterpolator.clear();
    this.input.destroy();
    this.builderInput.destroy();
    this.debugOverlay.destroy();
  }
}
