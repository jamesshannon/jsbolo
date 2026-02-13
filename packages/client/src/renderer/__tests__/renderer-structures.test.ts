import {describe, expect, it, vi, beforeEach} from 'vitest';
import {TerrainType, type Base, type Pillbox, type Tank, type Shell, type Builder} from '@shared';
import {Camera} from '../camera.js';
import {Renderer} from '../renderer.js';

type DrawCall = {x: number; y: number};

const drawCallsBySheet = new Map<string, DrawCall[]>();

vi.mock('../sprite-sheet.js', () => {
  class MockSpriteSheet {
    constructor(private readonly imagePath: string) {
      drawCallsBySheet.set(this.imagePath, []);
    }

    async load(): Promise<void> {}

    drawTile(
      _ctx: CanvasRenderingContext2D,
      x: number,
      y: number
    ): void {
      drawCallsBySheet.get(this.imagePath)?.push({x, y});
    }
  }

  return {SpriteSheet: MockSpriteSheet};
});

function createContext(): CanvasRenderingContext2D {
  return {
    canvas: {width: 640, height: 480},
    clearRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    arc: vi.fn(),
    fillText: vi.fn(),
    setLineDash: vi.fn(),
    strokeStyle: '#000000',
    fillStyle: '#000000',
    lineWidth: 1,
    font: '12px monospace',
    textAlign: 'left',
  } as unknown as CanvasRenderingContext2D;
}

function createWorldStub() {
  return {
    forEachVisibleTile(
      _startX: number,
      _startY: number,
      _endX: number,
      _endY: number,
      callback: (cell: {terrain: TerrainType; hasMine: boolean}, tileX: number, tileY: number) => void
    ): void {
      callback({terrain: TerrainType.GRASS, hasMine: false}, 0, 0);
    },
    getNeighbors(): TerrainType[] {
      return [];
    },
  };
}

describe('Renderer structures', () => {
  beforeEach(() => {
    drawCallsBySheet.clear();
  });

  it('renders pillboxes from base sheet using armor column on row 2', () => {
    const ctx = createContext();
    const camera = new Camera(640, 480);
    camera.centerOn(320, 240);
    const renderer = new Renderer(ctx, camera);

    const world = createWorldStub() as any;
    const tanks = new Map<number, Tank>([
      [1, {
        id: 1,
        x: 256 * 20,
        y: 256 * 20,
        direction: 0,
        speed: 0,
        armor: 40,
        shells: 40,
        mines: 0,
        trees: 0,
        team: 2,
        onBoat: false,
        reload: 0,
        firingRange: 7,
      }],
    ]);
    const pillboxes = new Map<number, Pillbox>([
      [10, {id: 10, tileX: 20, tileY: 20, armor: 6, ownerTeam: 255, inTank: false}],
    ]);

    renderer.renderMultiplayer(
      world,
      tanks,
      new Map<number, Shell>(),
      new Map<number, Builder>(),
      pillboxes,
      new Map<number, Base>(),
      1
    );

    const baseCalls = drawCallsBySheet.get('/assets/sprites/base.png') ?? [];
    expect(baseCalls.some(call => call.x === 6 && call.y === 2)).toBe(true);
  });
});
