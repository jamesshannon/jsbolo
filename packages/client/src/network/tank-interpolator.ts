import {TILE_SIZE_WORLD, type Tank} from '@shared';

interface TankSnapshot {
  tank: Tank;
  tick: number;
  receivedAtMs: number;
}

interface TankSnapshotPair {
  previous: TankSnapshot | null;
  current: TankSnapshot | null;
}

export class TankInterpolator {
  // ASSUMPTION: position jumps larger than 4 tiles are teleports/respawns, not
  // physically interpolable movement. Snap to the new authoritative state.
  private static readonly SNAP_DISTANCE_WORLD = TILE_SIZE_WORLD * 4;
  private readonly snapshots = new Map<number, TankSnapshotPair>();

  /**
   * @param interpolationDelayMs How far behind real-time to render remote tanks.
   * Rendering slightly behind reduces visible jitter from network variance.
   */
  constructor(private readonly interpolationDelayMs: number = 100) {}

  /**
   * Add a snapshot for a tank.
   * Out-of-order snapshots are ignored to preserve monotonic interpolation.
   */
  pushSnapshot(tank: Tank, tick: number, receivedAtMs: number): void {
    const nextSnapshot: TankSnapshot = {
      tank: {...tank},
      tick,
      receivedAtMs,
    };

    const pair = this.snapshots.get(tank.id);
    if (!pair) {
      this.snapshots.set(tank.id, {
        previous: null,
        current: nextSnapshot,
      });
      return;
    }

    if (pair.current && tick < pair.current.tick) {
      return;
    }

    // Equal-tick updates replace the current authoritative snapshot in place.
    // This avoids creating a fake interpolation window between two samples
    // that represent the same simulation tick.
    if (pair.current && tick === pair.current.tick) {
      pair.current = nextSnapshot;
      return;
    }

    const dx = nextSnapshot.tank.x - pair.current.tank.x;
    const dy = nextSnapshot.tank.y - pair.current.tank.y;
    const jumpDistance = Math.sqrt((dx * dx) + (dy * dy));
    if (jumpDistance > TankInterpolator.SNAP_DISTANCE_WORLD) {
      pair.previous = null;
      pair.current = nextSnapshot;
      return;
    }

    pair.previous = pair.current;
    pair.current = nextSnapshot;
  }

  getInterpolatedTank(tankId: number, nowMs: number): Tank | undefined {
    const pair = this.snapshots.get(tankId);
    if (!pair?.current) {
      return undefined;
    }

    if (!pair.previous) {
      return pair.current.tank;
    }

    const targetTime = nowMs - this.interpolationDelayMs;
    const from = pair.previous;
    const to = pair.current;

    if (targetTime <= from.receivedAtMs) {
      return from.tank;
    }
    if (targetTime >= to.receivedAtMs) {
      return to.tank;
    }

    const window = to.receivedAtMs - from.receivedAtMs;
    if (window <= 0) {
      return to.tank;
    }

    const alpha = (targetTime - from.receivedAtMs) / window;

    return {
      ...to.tank,
      x: this.lerp(from.tank.x, to.tank.x, alpha),
      y: this.lerp(from.tank.y, to.tank.y, alpha),
      speed: this.lerp(from.tank.speed, to.tank.speed, alpha),
      direction: this.lerpDirection(from.tank.direction, to.tank.direction, alpha),
    };
  }

  clear(): void {
    this.snapshots.clear();
  }

  /**
   * Drop interpolation state for entities removed from authoritative server state.
   * Prevents stale motion data from lingering after disconnect/despawn events.
   */
  removeTank(tankId: number): void {
    this.snapshots.delete(tankId);
  }

  private lerp(start: number, end: number, alpha: number): number {
    return start + (end - start) * alpha;
  }

  private lerpDirection(start: number, end: number, alpha: number): number {
    let delta = ((end - start + 128) % 256) - 128;
    if (delta < -128) {
      delta += 256;
    }
    const value = start + (delta * alpha);
    return ((value % 256) + 256) % 256;
  }
}
