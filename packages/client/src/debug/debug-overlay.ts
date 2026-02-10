/**
 * Debug overlay system
 * Toggle with F3 key to show/hide detailed game state
 */

export class DebugOverlay {
  private enabled = false;
  private overlayElement: HTMLDivElement;

  constructor() {
    this.overlayElement = this.createOverlayElement();
    this.setupEventListeners();
  }

  private createOverlayElement(): HTMLDivElement {
    const overlay = document.createElement('div');
    overlay.id = 'debug-overlay';
    overlay.style.cssText = `
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.95);
      border: 2px solid #f00;
      padding: 15px;
      font-family: monospace;
      font-size: 11px;
      color: #f00;
      max-height: 80vh;
      overflow-y: auto;
      display: none;
      min-width: 300px;
      z-index: 1000;
    `;

    const title = document.createElement('div');
    title.style.cssText = `
      font-weight: bold;
      font-size: 13px;
      margin-bottom: 10px;
      border-bottom: 1px solid #f00;
      padding-bottom: 5px;
    `;
    title.textContent = 'DEBUG MODE (F3 to toggle)';
    overlay.appendChild(title);

    document.body.appendChild(overlay);
    return overlay;
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F3') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  toggle(): void {
    this.enabled = !this.enabled;
    this.overlayElement.style.display = this.enabled ? 'block' : 'none';
    console.log(`Debug mode ${this.enabled ? 'enabled' : 'disabled'}`);
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Update debug overlay with current game state
   */
  update(data: {
    tanks?: Map<number, any>;
    pillboxes?: Map<number, any>;
    bases?: Map<number, any>;
    shells?: Map<number, any>;
    builders?: Map<number, any>;
    myPlayerId?: number | null;
    tick?: number;
    fps?: number;
    mapName?: string;
    terrainInfo?: {terrain: string; life: number; hasMine: boolean} | undefined;
  }): void {
    if (!this.enabled) return;

    let html = '<div style="font-weight: bold; font-size: 13px; margin-bottom: 10px; border-bottom: 1px solid #f00; padding-bottom: 5px;">DEBUG MODE (F3 to toggle)</div>';

    // Map info
    if (data.mapName) {
      html += '<div style="margin-bottom: 10px;"><strong>MAP</strong></div>';
      html += `<div>${data.mapName}</div>`;
      html += '<div style="height: 5px;"></div>';
    }

    // Performance stats
    if (data.tick !== undefined || data.fps !== undefined) {
      html += '<div style="margin-bottom: 10px;"><strong>PERFORMANCE</strong></div>';
      if (data.fps !== undefined) {
        html += `<div>FPS: ${data.fps}</div>`;
      }
      if (data.tick !== undefined) {
        html += `<div>Tick: ${data.tick}</div>`;
      }
      html += '<div style="height: 5px;"></div>';
    }

    // Terrain info (under player's tank)
    if (data.terrainInfo) {
      html += '<div style="margin-bottom: 5px;"><strong>TERRAIN (UNDER TANK)</strong></div>';
      html += `<div style="margin-left: 10px;">`;
      html += `Type: ${data.terrainInfo.terrain}<br>`;
      html += `Life: ${data.terrainInfo.life}<br>`;
      html += `Mine: ${data.terrainInfo.hasMine ? 'Yes' : 'No'}<br>`;
      html += `</div>`;
      html += '<div style="height: 5px;"></div>';
    }

    // Tank debug info
    if (data.tanks && data.tanks.size > 0) {
      html += '<div style="margin-bottom: 5px;"><strong>TANKS (${data.tanks.size})</strong></div>';
      for (const [id, tank] of data.tanks) {
        const isMe = id === data.myPlayerId;
        html += `<div style="margin-left: 10px; ${isMe ? 'color: #0f0;' : ''}">`;
        html += `Tank ${id}${isMe ? ' (YOU)' : ''}<br>`;
        html += `  Armor: ${tank.armor}/40<br>`;
        html += `  Shells: ${tank.shells}/40<br>`;
        html += `  Reload: ${tank.reload}<br>`;
        html += `  Speed: ${tank.speed?.toFixed(2)}<br>`;
        html += `  Dir: ${tank.direction}<br>`;
        html += `  Range: ${tank.firingRange}<br>`;
        html += `</div>`;
      }
      html += '<div style="height: 5px;"></div>';
    }

    // Pillbox debug info with aggravation
    if (data.pillboxes && data.pillboxes.size > 0) {
      html += `<div style="margin-bottom: 5px;"><strong>PILLBOXES (${data.pillboxes.size})</strong></div>`;
      for (const [id, pillbox] of data.pillboxes) {
        const teamColor = pillbox.ownerTeam === 255 ? '#888' : '#0ff';
        html += `<div style="margin-left: 10px; color: ${teamColor};">`;
        html += `Pillbox ${id}<br>`;
        html += `  Armor: ${pillbox.armor}/15<br>`;
        html += `  Team: ${pillbox.ownerTeam === 255 ? 'Neutral' : pillbox.ownerTeam}<br>`;
        html += `  Tile: (${pillbox.tileX}, ${pillbox.tileY})<br>`;
        // Note: Server doesn't send aggravation stats yet
        html += `</div>`;
      }
      html += '<div style="height: 5px;"></div>';
    }

    // Base debug info
    if (data.bases && data.bases.size > 0) {
      html += `<div style="margin-bottom: 5px;"><strong>BASES (${data.bases.size})</strong></div>`;
      for (const [id, base] of data.bases) {
        const teamColor = base.ownerTeam === 255 ? '#888' : '#0ff';
        html += `<div style="margin-left: 10px; color: ${teamColor};">`;
        html += `Base ${id}<br>`;
        html += `  Armor: ${base.armor}/90<br>`;
        html += `  Shells: ${base.shells}<br>`;
        html += `  Mines: ${base.mines}<br>`;
        html += `  Team: ${base.ownerTeam === 255 ? 'Neutral' : base.ownerTeam}<br>`;
        html += `  Tile: (${base.tileX}, ${base.tileY})<br>`;
        html += `</div>`;
      }
      html += '<div style="height: 5px;"></div>';
    }

    // Shell debug info
    if (data.shells && data.shells.size > 0) {
      html += `<div style="margin-bottom: 5px;"><strong>SHELLS (${data.shells.size})</strong></div>`;
      for (const [id, shell] of data.shells) {
        html += `<div style="margin-left: 10px;">`;
        html += `Shell ${id}<br>`;
        html += `  Owner: ${shell.ownerTankId}<br>`;
        html += `  Dir: ${shell.direction}<br>`;
        html += `</div>`;
      }
      html += '<div style="height: 5px;"></div>';
    }

    // Builder debug info
    if (data.builders && data.builders.size > 0) {
      html += `<div style="margin-bottom: 5px;"><strong>BUILDERS (${data.builders.size})</strong></div>`;
      for (const [id, builder] of data.builders) {
        const orderNames = [
          'In Tank', 'Waiting', 'Returning', 'Parachuting',
          '', '', '', '', '', '',
          'Harvesting', 'Building Road', 'Repairing', 'Building Boat',
          'Building Wall', 'Placing Pillbox', 'Laying Mine',
        ];
        html += `<div style="margin-left: 10px;">`;
        html += `Builder ${id}<br>`;
        html += `  Order: ${orderNames[builder.order] || builder.order}<br>`;
        html += `  Trees: ${builder.trees}<br>`;
        html += `  Has Mine: ${builder.hasMine}<br>`;
        html += `</div>`;
      }
    }

    this.overlayElement.innerHTML = html;
  }

  destroy(): void {
    this.overlayElement.remove();
  }
}
