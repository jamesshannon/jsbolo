import type {
  Base,
  Builder,
  Pillbox,
  Shell,
  Tank,
  WelcomeMessage,
} from '@shared';
import type {TankInterpolator} from '../network/tank-interpolator.js';
import type {World} from '../world/world.js';

export interface WelcomeStateDeps {
  world: World;
  tanks: Map<number, Tank>;
  shells: Map<number, Shell>;
  builders: Map<number, Builder>;
  pillboxes: Map<number, Pillbox>;
  bases: Map<number, Base>;
  tankInterpolator: TankInterpolator;
  nowMs: number;
  log?: (message: string, ...args: unknown[]) => void;
}

export interface WelcomeStateResult {
  playerId: number | null;
  mapName: string;
}

/**
 * Apply a full welcome snapshot from server into client gameplay state.
 *
 * WHY THIS IS CENTRALIZED:
 * - Reconnect/new-match welcome packets are authoritative reset points.
 * - Clearing old entity/interpolation state here prevents stale entities.
 * - Keeps `MultiplayerGame` networking callbacks easier to reason about.
 */
export function applyNetworkWelcomeState(
  welcome: WelcomeMessage,
  deps: WelcomeStateDeps
): WelcomeStateResult {
  const log = deps.log ?? console.log;

  deps.tanks.clear();
  deps.shells.clear();
  deps.builders.clear();
  deps.pillboxes.clear();
  deps.bases.clear();
  deps.tankInterpolator.clear();

  const playerId = welcome.playerId ?? null;
  const mapName = welcome.mapName || 'Unknown';

  log('Assigned player ID:', playerId);
  log('Map name:', mapName);

  if (welcome.map) {
    log(
      `Loading map: ${welcome.map.width}x${welcome.map.height}, ` +
        `${welcome.map.terrain.length} terrain tiles`
    );
    log('First 10 terrain tiles:', welcome.map.terrain.slice(0, 10));

    const row241Start = 241 * welcome.map.width;
    log('Row 241 first 10 tiles:', welcome.map.terrain.slice(row241Start, row241Start + 10));

    const clientHistogram = new Map<number, number>();
    for (const terrainId of welcome.map.terrain) {
      clientHistogram.set(terrainId, (clientHistogram.get(terrainId) || 0) + 1);
    }
    log('Client received terrain histogram:', Object.fromEntries(clientHistogram));

    let tilesUpdated = 0;
    for (let y = 0; y < welcome.map.height; y++) {
      for (let x = 0; x < welcome.map.width; x++) {
        const index = y * welcome.map.width + x;
        deps.world.updateCell(x, y, {
          terrain: welcome.map.terrain[index]!,
          terrainLife: welcome.map.terrainLife[index]!,
        });
        tilesUpdated++;
      }
    }
    log(`Terrain data loaded from server: ${tilesUpdated} tiles updated`);
    log('Sample tile at (125, 152):', deps.world.getCellAt(125, 152));
  }

  if (welcome.tanks) {
    for (const tank of welcome.tanks) {
      deps.tanks.set(tank.id, tank);
      deps.tankInterpolator.pushSnapshot(tank, welcome.currentTick, deps.nowMs);
    }
    log(`Loaded ${welcome.tanks.length} tanks from welcome message`);
  }

  if (welcome.pillboxes) {
    for (const pillbox of welcome.pillboxes) {
      deps.pillboxes.set(pillbox.id, pillbox);
    }
    log(`Loaded ${welcome.pillboxes.length} pillboxes from welcome message`);
  }

  if (welcome.bases) {
    for (const base of welcome.bases) {
      deps.bases.set(base.id, base);
    }
    log(`Loaded ${welcome.bases.length} bases from welcome message`);
  }

  return {
    playerId,
    mapName,
  };
}
