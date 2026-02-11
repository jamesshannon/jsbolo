import { GameSession } from '../../game-session';
import { TerrainType, ASCII_TO_TERRAIN, TILE_SIZE_WORLD } from '@jsbolo/shared';
import type { PlayerInput } from '@jsbolo/shared';
import {
  createMockWebSocket,
  createDefaultInput,
  getPlayer,
  getWorld,
  fillArea,
  placeTankAtTile,
  tickSession,
  setTerrain,
} from '../bolo-spec/helpers';

export interface TickSnapshot {
  tick: number;
  tank: {
    x: number;
    y: number;
    tileX: number;
    tileY: number;
    direction: number;
    speed: number;
    armor: number;
    shells: number;
    mines: number;
    onBoat: boolean;
    reload: number;
  };
  input: {
    accelerating: boolean;
    braking: boolean;
    turningClockwise: boolean;
    turningCounterClockwise: boolean;
    shooting: boolean;
  };
  terrainAround: {
    center: TerrainType;
    north: TerrainType;
    south: TerrainType;
    east: TerrainType;
    west: TerrainType;
    ne: TerrainType;
    nw: TerrainType;
    se: TerrainType;
    sw: TerrainType;
  };
  computed: {
    terrainSpeed: number;
    effectiveSpeed: number;
    positionDelta: { dx: number; dy: number };
    tileChanged: boolean;
  };
}

export interface Invariant {
  name: string;
  check(
    current: TickSnapshot,
    history: TickSnapshot[]
  ): { passed: boolean; message: string };
}

interface ScheduledInput {
  tick: number;
  input: Partial<PlayerInput>;
}

export class ScenarioRunner {
  private session: GameSession;
  private playerId: string;
  private currentInput: PlayerInput;
  private scheduledInputs: ScheduledInput[] = [];
  private invariants: Invariant[] = [];
  public readonly history: TickSnapshot[] = [];
  private currentTick = 0;

  constructor() {
    this.session = new GameSession();
    const ws = createMockWebSocket();
    this.playerId = this.session.addPlayer(ws);
    this.currentInput = createDefaultInput();
  }

  // --- Terrain Setup ---

  terrain(startX: number, startY: number, w: number, h: number, type: TerrainType): this {
    const world = getWorld(this.session);
    fillArea(world, startX, startY, w, h, type);
    return this;
  }

  tile(x: number, y: number, type: TerrainType): this {
    const world = getWorld(this.session);
    setTerrain(world, x, y, type);
    return this;
  }

  terrainMap(originX: number, originY: number, rows: string[]): this {
    for (let y = 0; y < rows.length; y++) {
      const row = rows[y];
      for (let x = 0; x < row.length; x++) {
        const char = row[x];
        const terrain = ASCII_TO_TERRAIN[char];
        if (terrain !== undefined) {
          setTerrain(this.session, originX + x, originY + y, terrain);
        }
      }
    }
    return this;
  }

  // --- Tank Setup ---

  placeTank(tileX: number, tileY: number): this {
    const player = getPlayer(this.session, this.playerId);
    placeTankAtTile(player.tank, tileX, tileY);
    return this;
  }

  setTank(
    props: Partial<{
      direction: number;
      speed: number;
      onBoat: boolean;
      armor: number;
      shells: number;
      mines: number;
    }>
  ): this {
    const player = getPlayer(this.session, this.playerId);
    const tank = player.tank;

    if (props.direction !== undefined) tank.direction = props.direction;
    if (props.speed !== undefined) tank.speed = props.speed;
    if (props.onBoat !== undefined) tank.onBoat = props.onBoat;
    if (props.armor !== undefined) tank.armor = props.armor;
    if (props.shells !== undefined) tank.shells = props.shells;
    if (props.mines !== undefined) tank.mines = props.mines;

    return this;
  }

  // --- Input Control ---

  input(overrides: Partial<PlayerInput>): this {
    this.currentInput = { ...this.currentInput, ...overrides };
    return this;
  }

  inputAt(tick: number, overrides: Partial<PlayerInput>): this {
    this.scheduledInputs.push({ tick, input: overrides });
    return this;
  }

  // --- Invariants ---

  addInvariant(invariant: Invariant): this {
    this.invariants.push(invariant);
    return this;
  }

  addInvariants(...invariants: Invariant[]): this {
    this.invariants.push(...invariants);
    return this;
  }

  // --- Execution ---

  run(ticks: number): this {
    for (let i = 0; i < ticks; i++) {
      this.executeOneTick();
    }
    return this;
  }

  runUntil(
    condition: (snap: TickSnapshot) => boolean,
    maxTicks: number = 1000
  ): this {
    for (let i = 0; i < maxTicks; i++) {
      this.executeOneTick();
      if (condition(this.latest)) {
        break;
      }
    }
    return this;
  }

  private executeOneTick(): void {
    this.currentTick++;

    // Apply scheduled input changes
    for (const scheduled of this.scheduledInputs) {
      if (scheduled.tick === this.currentTick) {
        this.currentInput = { ...this.currentInput, ...scheduled.input };
      }
    }

    // Capture pre-tick state
    const player = getPlayer(this.session, this.playerId);
    const tank = player.tank;
    const world = getWorld(this.session);
    const prevSnapshot = this.history[this.history.length - 1];

    const prevX = tank.x;
    const prevY = tank.y;
    const prevTileX = Math.floor(tank.x / TILE_SIZE_WORLD);
    const prevTileY = Math.floor(tank.y / TILE_SIZE_WORLD);

    // Execute tick
    player.lastInput = this.currentInput;
    tickSession(this.session, 1);

    // Capture post-tick state
    const snapshot = this.captureSnapshot(prevX, prevY, prevTileX, prevTileY);
    this.history.push(snapshot);

    // Check invariants
    for (const invariant of this.invariants) {
      const result = invariant.check(snapshot, this.history);
      if (!result.passed) {
        (snapshot as any).violations = (snapshot as any).violations || [];
        (snapshot as any).violations.push({
          invariant: invariant.name,
          message: result.message,
        });
      }
    }
  }

  private captureSnapshot(
    prevX: number,
    prevY: number,
    prevTileX: number,
    prevTileY: number
  ): TickSnapshot {
    const player = getPlayer(this.session, this.playerId);
    const tank = player.tank;
    const world = getWorld(this.session);

    // Calculate current tile position from world coordinates
    const tileX = Math.floor(tank.x / TILE_SIZE_WORLD);
    const tileY = Math.floor(tank.y / TILE_SIZE_WORLD);

    // Sample terrain in 3x3 grid
    const terrainAround = {
      center: world.getTerrainAt(tileX, tileY),
      north: world.getTerrainAt(tileX, tileY - 1),
      south: world.getTerrainAt(tileX, tileY + 1),
      east: world.getTerrainAt(tileX + 1, tileY),
      west: world.getTerrainAt(tileX - 1, tileY),
      ne: world.getTerrainAt(tileX + 1, tileY - 1),
      nw: world.getTerrainAt(tileX - 1, tileY - 1),
      se: world.getTerrainAt(tileX + 1, tileY + 1),
      sw: world.getTerrainAt(tileX - 1, tileY + 1),
    };

    // Get terrain speed (what the engine sees)
    const terrainSpeed = world.getTankSpeedAtPosition(tank.x, tank.y);
    const effectiveSpeed = tank.onBoat ? 1.0 : terrainSpeed;

    const dx = tank.x - prevX;
    const dy = tank.y - prevY;
    const tileChanged = tileX !== prevTileX || tileY !== prevTileY;

    return {
      tick: this.currentTick,
      tank: {
        x: tank.x,
        y: tank.y,
        tileX,
        tileY,
        direction: tank.direction,
        speed: tank.speed,
        armor: tank.armor,
        shells: tank.shells,
        mines: tank.mines,
        onBoat: tank.onBoat,
        reload: tank.reload,
      },
      input: { ...this.currentInput },
      terrainAround,
      computed: {
        terrainSpeed,
        effectiveSpeed,
        positionDelta: { dx, dy },
        tileChanged,
      },
    };
  }

  // --- Assertions ---

  get latest(): TickSnapshot {
    if (this.history.length === 0) {
      throw new Error('No ticks executed yet');
    }
    return this.history[this.history.length - 1];
  }

  at(tick: number): TickSnapshot {
    const snapshot = this.history.find((s) => s.tick === tick);
    if (!snapshot) {
      throw new Error(`No snapshot found for tick ${tick}`);
    }
    return snapshot;
  }

  assertNoViolations(): void {
    const violations: Array<{ tick: number; invariant: string; message: string }> = [];

    for (const snapshot of this.history) {
      const snapshotViolations = (snapshot as any).violations;
      if (snapshotViolations) {
        for (const v of snapshotViolations) {
          violations.push({
            tick: snapshot.tick,
            invariant: v.invariant,
            message: v.message,
          });
        }
      }
    }

    if (violations.length > 0) {
      const violationSummary = violations
        .map((v) => `  tick ${v.tick}: [${v.invariant}] ${v.message}`)
        .join('\n');

      const history = this.formatHistory(violations.map((v) => v.tick));

      throw new Error(
        `${violations.length} invariant violation(s):\n${violationSummary}\n\n${history}`
      );
    }
  }

  assertAt(description: string, check: (snap: TickSnapshot) => boolean): void {
    if (!check(this.latest)) {
      const history = this.formatHistory([this.currentTick]);
      throw new Error(
        `Assertion failed: ${description}\n\nAt tick ${this.currentTick}:\n${history}`
      );
    }
  }

  private formatHistory(violationTicks: number[]): string {
    const lines: string[] = [
      'Full state history:',
      'tick | x       | y       | tile    | spd   | dir | onBoat | terrain  | accel | dx   | dy',
      '---- | ------- | ------- | ------- | ----- | --- | ------ | -------- | ----- | ---- | ----',
    ];

    for (const snap of this.history) {
      const isViolation = violationTicks.includes(snap.tick);
      const marker = isViolation ? '*' : ' ';
      const suffix = isViolation ? '  <-- VIOLATION' : '';

      const line = [
        `${marker}${snap.tick.toString().padStart(3)}`,
        snap.tank.x.toFixed(1).padStart(7),
        snap.tank.y.toFixed(1).padStart(7),
        `(${snap.tank.tileX},${snap.tank.tileY})`.padStart(7),
        snap.tank.speed.toFixed(2).padStart(5),
        snap.tank.direction.toString().padStart(3),
        snap.tank.onBoat.toString().padStart(6),
        TerrainType[snap.terrainAround.center].padStart(8),
        snap.input.accelerating.toString().padStart(5),
        snap.computed.positionDelta.dx.toFixed(0).padStart(4),
        snap.computed.positionDelta.dy.toFixed(0).padStart(4),
      ].join(' | ');

      lines.push(line + suffix);
    }

    return lines.join('\n');
  }
}
