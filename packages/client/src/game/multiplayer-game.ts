/**
 * Multiplayer game class
 */

import {
  TICK_LENGTH_MS,
  TILE_SIZE_PIXELS,
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
import type {InputState} from '../input/keyboard.js';
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
import {deriveTankHudMarkers} from './hud-tank-status.js';
import {
  DEFAULT_HUD_MESSAGE_VISIBILITY,
  deriveTickerMessagesFromServerHud,
  type HudMessageVisibility,
} from './hud-message-stream.js';
import {
  buildBaseHudChipsHtml,
  buildPillboxHudChipsHtml,
} from './hud-structure-chips.js';
import {selectNearestFriendlyVisibleBase} from './hud-nearest-base.js';
import {formatHudTickerHtml} from './hud-ticker-format.js';
import {
  buildAllianceRelations,
  getTankAllianceId,
  isFriendlyToLocalAlliance,
  type AllianceRelations,
} from './alliance-relations.js';
import {
  listRemoteViewPillboxes,
  pickDirectionalRemotePillbox,
  pickInitialRemotePillbox,
  type RemotePillboxDirection,
} from './remote-pillbox-view.js';

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
  private allianceRelations: AllianceRelations = new Map();

  // FPS tracking
  private fps = 0;
  private frameCount = 0;
  private lastFpsUpdate = 0;
  private readonly tickerQueue: string[] = [];
  private tickerActiveUntilMs = 0;
  private currentTickerText = 'Ready.';
  private chatForm: HTMLFormElement | null = null;
  private chatInput: HTMLInputElement | null = null;
  private chatAllianceOnly: HTMLInputElement | null = null;
  private chatRecipientSelect: HTMLSelectElement | null = null;
  private colorblindToggle: HTMLInputElement | null = null;
  private readonly hudMessageVisibility: HudMessageVisibility = {
    ...DEFAULT_HUD_MESSAGE_VISIBILITY,
  };
  private remotePillboxViewEnabled = false;
  private remoteViewPillboxId: number | null = null;
  private remoteViewToggleRequested = false;
  private lastRemoteNavigationTick = -1000;

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
    this.bindHudChatInput();
    this.bindHudMessageFilters();
    this.bindColorblindModeToggle();
    window.addEventListener('keydown', this.handleRemoteViewHotkey);
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
      this.allianceRelations = buildAllianceRelations(welcome.alliances);
      this.refreshChatRecipientOptions();
    });

    this.network.onUpdate(update => {
      const now = performance.now();
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
      const serverHudMessages = deriveTickerMessagesFromServerHud(
        update.hudMessages,
        this.hudMessageVisibility
      );
      if (update.alliances) {
        this.allianceRelations = buildAllianceRelations(update.alliances);
      }
      for (const message of serverHudMessages) {
        this.enqueueHudMessage(message);
      }
      this.refreshChatRecipientOptions();
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

    if (this.remoteViewToggleRequested) {
      this.remoteViewToggleRequested = false;
      this.toggleRemotePillboxView();
    }

    // Debug input state
    if (inputState.accelerating || inputState.braking || inputState.turningLeft || inputState.turningRight) {
      console.log('Input state:', inputState);
    }

    if (this.remotePillboxViewEnabled) {
      this.updateRemotePillboxView(inputState);
      this.sendNeutralInput();
      return;
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

  private sendNeutralInput(): void {
    this.network.sendInput({
      tick: this.tick,
      accelerating: false,
      braking: false,
      turningClockwise: false,
      turningCounterClockwise: false,
      shooting: false,
      rangeAdjustment: RangeAdjustment.NONE,
    });
  }

  private updateRemotePillboxView(inputState: Readonly<InputState>): void {
    const myAllianceId = this.getMyAllianceId();
    const candidates = listRemoteViewPillboxes(
      this.pillboxes.values(),
      myAllianceId,
      this.allianceRelations
    );
    if (candidates.length === 0) {
      this.disableRemotePillboxView('Pillbox view unavailable: no owned pillboxes.');
      return;
    }

    if (this.remoteViewPillboxId === null || !candidates.some(pillbox => pillbox.id === this.remoteViewPillboxId)) {
      const myTank = this.playerId === null ? null : this.tanks.get(this.playerId) ?? null;
      const fallbackTileX = myTank?.x !== undefined ? Math.floor(myTank.x / TILE_SIZE_WORLD) : candidates[0]!.tileX;
      const fallbackTileY = myTank?.y !== undefined ? Math.floor(myTank.y / TILE_SIZE_WORLD) : candidates[0]!.tileY;
      this.remoteViewPillboxId = pickInitialRemotePillbox(candidates, fallbackTileX, fallbackTileY);
    }

    const direction = this.getRemoteNavigationDirection(inputState);
    if (
      direction &&
      this.remoteViewPillboxId !== null &&
      this.tick - this.lastRemoteNavigationTick >= 8
    ) {
      const nextId = pickDirectionalRemotePillbox(
        candidates,
        this.remoteViewPillboxId,
        direction
      );
      if (nextId !== this.remoteViewPillboxId) {
        this.remoteViewPillboxId = nextId;
        this.network.sendRemoteView(this.remoteViewPillboxId);
      }
      this.lastRemoteNavigationTick = this.tick;
    }

    if (this.remoteViewPillboxId === null) {
      return;
    }

    const selected = candidates.find(pillbox => pillbox.id === this.remoteViewPillboxId);
    if (!selected) {
      return;
    }

    const pixelX = (selected.tileX + 0.5) * TILE_SIZE_PIXELS;
    const pixelY = (selected.tileY + 0.5) * TILE_SIZE_PIXELS;
    this.camera.centerOn(pixelX, pixelY);
  }

  private getRemoteNavigationDirection(
    inputState: Readonly<InputState>
  ): RemotePillboxDirection | null {
    if (inputState.accelerating) {
      return 'up';
    }
    if (inputState.braking) {
      return 'down';
    }
    if (inputState.turningLeft) {
      return 'left';
    }
    if (inputState.turningRight) {
      return 'right';
    }
    return null;
  }

  private toggleRemotePillboxView(): void {
    if (this.remotePillboxViewEnabled) {
      this.disableRemotePillboxView('Pillbox view disabled.');
      return;
    }

    const myAllianceId = this.getMyAllianceId();
    const candidates = listRemoteViewPillboxes(
      this.pillboxes.values(),
      myAllianceId,
      this.allianceRelations
    );
    if (candidates.length === 0) {
      this.enqueueHudMessage('Pillbox view unavailable: no owned pillboxes.');
      return;
    }

    const myTank = this.playerId === null ? null : this.tanks.get(this.playerId) ?? null;
    const anchorTileX = myTank?.x !== undefined ? Math.floor(myTank.x / TILE_SIZE_WORLD) : candidates[0]!.tileX;
    const anchorTileY = myTank?.y !== undefined ? Math.floor(myTank.y / TILE_SIZE_WORLD) : candidates[0]!.tileY;
    const initialSelection = pickInitialRemotePillbox(candidates, anchorTileX, anchorTileY);
    if (initialSelection === null) {
      this.enqueueHudMessage('Pillbox view unavailable: no owned pillboxes.');
      return;
    }

    this.remotePillboxViewEnabled = true;
    this.remoteViewPillboxId = initialSelection;
    this.lastRemoteNavigationTick = this.tick;
    this.network.sendRemoteView(this.remoteViewPillboxId);
    this.enqueueHudMessage('Pillbox view enabled.');
  }

  private disableRemotePillboxView(message: string): void {
    this.remotePillboxViewEnabled = false;
    this.remoteViewPillboxId = null;
    this.network.sendRemoteView(null);
    this.enqueueHudMessage(message);
  }

  private render(): void {
    const renderTanks = this.getRenderTanks();
    const renderBuilders = this.getRenderBuilders();
    const myAllianceAllies = this.getMyAlliedAllianceIds();
    this.renderer.renderMultiplayer(
      this.world,
      renderTanks,
      this.shells,
      renderBuilders,
      this.pillboxes,
      this.bases,
      this.playerId,
      myAllianceAllies
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
      const myAllianceId = getTankAllianceId(tank);
      hudPillboxes.innerHTML = buildPillboxHudChipsHtml(
        this.pillboxes.values(),
        myAllianceId,
        this.allianceRelations,
        tank.carriedPillbox
      );
    }

    if (hudBases) {
      hudBases.innerHTML = buildBaseHudChipsHtml(
        this.bases.values(),
        getTankAllianceId(tank),
        this.allianceRelations
      );
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
          nearestBase.ownerTeam === 255 ? 'Neutral' : `Alliance ${nearestBase.ownerTeam}`;
        hudNearestBaseArmor.textContent = `${nearestBase.armor}`;
        hudNearestBaseShells.textContent = `${nearestBase.shells}`;
        hudNearestBaseMines.textContent = `${nearestBase.mines}`;
      }
    }

    if (hudTankList || hudTankSummary) {
      const tankMarkers = deriveTankHudMarkers({
        tanks: this.tanks.values(),
        myPlayerId: this.playerId,
        myAllianceId: getTankAllianceId(tank),
        allianceRelations: this.allianceRelations,
      });
      const friendlyCount = tankMarkers.filter(marker => marker.relation === 'friendly').length;
      const hostileCount = tankMarkers.filter(marker => marker.relation === 'hostile').length;

      if (hudTankSummary) {
        hudTankSummary.textContent = `${friendlyCount} friendly / ${hostileCount} hostile`;
      }

      if (hudTankList) {
        const markerNodes = tankMarkers.map(marker =>
          `<span class="hud-chip ${marker.relation}${marker.relation === 'self' ? ' hud-chip-self-hollow' : ''}" title="P${marker.playerId}"></span>`
        );
        hudTankList.innerHTML = markerNodes.join('');
      }
    }
  }

  private getNearestBaseToTank(tank: Tank): Base | null {
    return selectNearestFriendlyVisibleBase(
      tank,
      this.bases.values(),
      this.camera,
      this.allianceRelations
    );
  }

  private getMyAllianceId(): number | null {
    if (this.playerId === null) {
      return null;
    }
    const tank = this.tanks.get(this.playerId);
    return tank ? getTankAllianceId(tank) : null;
  }

  private getMyAlliedAllianceIds(): ReadonlySet<number> | null {
    const myAllianceId = this.getMyAllianceId();
    if (myAllianceId === null) {
      return null;
    }
    const allies = this.allianceRelations.get(myAllianceId);
    return allies ?? new Set<number>();
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
    tickerElement.innerHTML = formatHudTickerHtml(text, {
      myPlayerId: this.playerId,
      myAllianceId: this.getMyAllianceId(),
      allianceRelations: this.allianceRelations,
      tanks: this.tanks,
    });
    this.currentTickerText = text;
  }

  /**
   * Wire HUD chat controls to network chat messages and focus shortcuts.
   */
  private bindHudChatInput(): void {
    this.chatForm = document.getElementById('hud-chat-form') as HTMLFormElement | null;
    this.chatInput = document.getElementById('hud-chat-input') as HTMLInputElement | null;
    this.chatAllianceOnly = document.getElementById('hud-chat-alliance') as HTMLInputElement | null;
    this.chatRecipientSelect = document.getElementById('hud-chat-recipients') as HTMLSelectElement | null;

    this.chatForm?.addEventListener('submit', this.handleHudChatSubmit);
    window.addEventListener('keydown', this.handleHudChatShortcut);
    this.chatInput?.addEventListener('keydown', this.handleHudChatInputKeyDown);
    this.refreshChatRecipientOptions();
  }

  private bindColorblindModeToggle(): void {
    this.colorblindToggle = document.getElementById('hud-colorblind-mode') as HTMLInputElement | null;
    this.colorblindToggle?.addEventListener('change', this.handleColorblindModeChanged);
    this.handleColorblindModeChanged();
  }

  private readonly handleColorblindModeChanged = (): void => {
    const colorMode = this.colorblindToggle?.checked ? 'colorblind' : 'default';
    this.renderer.setColorMode(colorMode);
    document.body.classList.toggle('colorblind-mode', colorMode === 'colorblind');
  };

  private readonly handleHudChatSubmit = (event: SubmitEvent): void => {
    event.preventDefault();
    if (!this.chatInput) {
      return;
    }

    const text = this.chatInput.value.trim();
    if (!text) {
      return;
    }

    const selectedRecipientIds = this.chatRecipientSelect
      ? Array.from(this.chatRecipientSelect.selectedOptions)
          .map(option => Number(option.value))
          .filter(id => Number.isFinite(id))
      : [];

    this.network.sendChat(text, {
      allianceOnly: this.chatAllianceOnly?.checked ?? false,
      ...(selectedRecipientIds.length > 0 && {recipientPlayerIds: selectedRecipientIds}),
    });
    this.chatInput.value = '';
    this.chatInput.blur();
  };

  private bindHudMessageFilters(): void {
    const newswire = document.getElementById('hud-filter-newswire') as HTMLInputElement | null;
    const assistant = document.getElementById('hud-filter-assistant') as HTMLInputElement | null;
    const aiBrain = document.getElementById('hud-filter-ai-brain') as HTMLInputElement | null;

    if (newswire) {
      newswire.checked = this.hudMessageVisibility.showNewswireMessages;
      newswire.addEventListener('change', this.handleHudFilterChange);
    }
    if (assistant) {
      assistant.checked = this.hudMessageVisibility.showAssistantMessages;
      assistant.addEventListener('change', this.handleHudFilterChange);
    }
    if (aiBrain) {
      aiBrain.checked = this.hudMessageVisibility.showAiBrainMessages;
      aiBrain.addEventListener('change', this.handleHudFilterChange);
    }
  }

  private readonly handleHudFilterChange = (): void => {
    const newswire = document.getElementById('hud-filter-newswire') as HTMLInputElement | null;
    const assistant = document.getElementById('hud-filter-assistant') as HTMLInputElement | null;
    const aiBrain = document.getElementById('hud-filter-ai-brain') as HTMLInputElement | null;

    this.hudMessageVisibility.showNewswireMessages = newswire?.checked ?? true;
    this.hudMessageVisibility.showAssistantMessages = assistant?.checked ?? true;
    this.hudMessageVisibility.showAiBrainMessages = aiBrain?.checked ?? true;
  };

  private refreshChatRecipientOptions(): void {
    if (!this.chatRecipientSelect || this.playerId === null) {
      return;
    }

    const previouslySelected = new Set(
      Array.from(this.chatRecipientSelect.selectedOptions).map(option => Number(option.value))
    );
    const myAllianceId = this.getMyAllianceId();
    const recipients = Array.from(this.tanks.values())
      .filter(tank => tank.id !== this.playerId)
      .sort((a, b) => a.id - b.id);

    this.chatRecipientSelect.innerHTML = '';
    if (recipients.length === 0) {
      this.chatRecipientSelect.disabled = true;
      return;
    }

    this.chatRecipientSelect.disabled = false;
    for (const recipient of recipients) {
      const option = document.createElement('option');
      option.value = String(recipient.id);
      const relation = myAllianceId === null
        ? ''
        : isFriendlyToLocalAlliance(
          myAllianceId,
          getTankAllianceId(recipient),
          this.allianceRelations
        )
          ? ' ally'
          : ' enemy';
      option.textContent = `P${recipient.id}${relation}`;
      option.selected = previouslySelected.has(recipient.id);
      this.chatRecipientSelect.appendChild(option);
    }
  }

  private readonly handleHudChatShortcut = (event: KeyboardEvent): void => {
    if (
      event.key !== 'Enter' ||
      event.defaultPrevented ||
      event.repeat ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    if (this.isEditableTarget(event.target)) {
      return;
    }

    if (!this.chatInput) {
      return;
    }

    event.preventDefault();
    this.chatInput.focus();
    this.chatInput.select();
  };

  private readonly handleRemoteViewHotkey = (event: KeyboardEvent): void => {
    if (
      event.code !== 'KeyV' ||
      event.defaultPrevented ||
      event.repeat ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    if (this.isEditableTarget(event.target)) {
      return;
    }

    event.preventDefault();
    this.remoteViewToggleRequested = true;
  };

  private readonly handleHudChatInputKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.chatInput?.blur();
    }
  };

  private isEditableTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
      return false;
    }
    return (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target.isContentEditable
    );
  }

  private bindBuilderHudButtons(): void {
    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[data-build-action]')
    );

    for (const button of buttons) {
      button.addEventListener('click', () => {
        const action = button.dataset.buildAction;
        const parsedAction = Number(action);
        if (!Number.isNaN(parsedAction)) {
          this.builderInput.setPendingAction(parsedAction as BuildAction);
        }
        this.refreshBuilderHudButtonState();
      });
    }
  }

  private refreshBuilderHudButtonState(): void {
    const activeAction = this.builderInput.getPendingAction();
    const buttons = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[data-build-action]')
    );
    for (const button of buttons) {
      button.classList.toggle('active', Number(button.dataset.buildAction) === activeAction);
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
    this.chatForm?.removeEventListener('submit', this.handleHudChatSubmit);
    window.removeEventListener('keydown', this.handleHudChatShortcut);
    window.removeEventListener('keydown', this.handleRemoteViewHotkey);
    this.chatInput?.removeEventListener('keydown', this.handleHudChatInputKeyDown);
    this.colorblindToggle?.removeEventListener('change', this.handleColorblindModeChanged);
    (document.getElementById('hud-filter-newswire') as HTMLInputElement | null)
      ?.removeEventListener('change', this.handleHudFilterChange);
    (document.getElementById('hud-filter-assistant') as HTMLInputElement | null)
      ?.removeEventListener('change', this.handleHudFilterChange);
    (document.getElementById('hud-filter-ai-brain') as HTMLInputElement | null)
      ?.removeEventListener('change', this.handleHudFilterChange);
    this.input.destroy();
    this.builderInput.destroy();
    this.debugOverlay.destroy();
  }
}
