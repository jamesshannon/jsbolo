import {TILE_SIZE_WORLD, type Builder} from '@shared';

interface BuilderSnapshot {
  builder: Builder;
  tick: number;
  receivedAtMs: number;
}

interface BuilderSnapshotPair {
  previous: BuilderSnapshot | null;
  current: BuilderSnapshot | null;
}

export class BuilderInterpolator {
  // ASSUMPTION: larger jumps are effectively teleports/order-reset events and
  // should snap to authoritative state instead of interpolating.
  private static readonly SNAP_DISTANCE_WORLD = TILE_SIZE_WORLD * 4;
  private readonly snapshots = new Map<number, BuilderSnapshotPair>();

  constructor(private readonly interpolationDelayMs: number = 100) {}

  pushSnapshot(builder: Builder, tick: number, receivedAtMs: number): void {
    const nextSnapshot: BuilderSnapshot = {
      builder: {...builder},
      tick,
      receivedAtMs,
    };

    const pair = this.snapshots.get(builder.id);
    if (!pair) {
      this.snapshots.set(builder.id, {
        previous: null,
        current: nextSnapshot,
      });
      return;
    }

    if (pair.current && tick < pair.current.tick) {
      return;
    }

    if (pair.current && tick === pair.current.tick) {
      pair.current = nextSnapshot;
      return;
    }

    const current = pair.current;
    if (!current) {
      pair.current = nextSnapshot;
      return;
    }

    const dx = nextSnapshot.builder.x - current.builder.x;
    const dy = nextSnapshot.builder.y - current.builder.y;
    const jumpDistance = Math.sqrt((dx * dx) + (dy * dy));
    if (jumpDistance > BuilderInterpolator.SNAP_DISTANCE_WORLD) {
      pair.previous = null;
      pair.current = nextSnapshot;
      return;
    }

    pair.previous = pair.current;
    pair.current = nextSnapshot;
  }

  getInterpolatedBuilder(builderId: number, nowMs: number): Builder | undefined {
    const pair = this.snapshots.get(builderId);
    if (!pair?.current) {
      return undefined;
    }

    if (!pair.previous) {
      return pair.current.builder;
    }

    const targetTime = nowMs - this.interpolationDelayMs;
    const from = pair.previous;
    const to = pair.current;

    if (targetTime <= from.receivedAtMs) {
      return from.builder;
    }
    if (targetTime >= to.receivedAtMs) {
      return to.builder;
    }

    const window = to.receivedAtMs - from.receivedAtMs;
    if (window <= 0) {
      return to.builder;
    }

    const alpha = (targetTime - from.receivedAtMs) / window;
    return {
      ...to.builder,
      x: this.lerp(from.builder.x, to.builder.x, alpha),
      y: this.lerp(from.builder.y, to.builder.y, alpha),
    };
  }

  clear(): void {
    this.snapshots.clear();
  }

  removeBuilder(builderId: number): void {
    this.snapshots.delete(builderId);
  }

  private lerp(start: number, end: number, alpha: number): number {
    return start + (end - start) * alpha;
  }
}
