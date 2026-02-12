/**
 * Sprite sheet loader and manager
 */

import {TILE_SIZE_PIXELS} from '@shared';

export interface SpriteCoords {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SpriteSheet {
  private image: HTMLImageElement | null = null;
  private loaded = false;

  constructor(private readonly imagePath: string) {}

  async load(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.image = new Image();
      this.image.onload = (): void => {
        this.loaded = true;
        resolve();
      };
      this.image.onerror = (): void => {
        reject(new Error(`Failed to load sprite sheet: ${this.imagePath}`));
      };
      this.image.src = this.imagePath;
    });
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  /**
   * Draw a tile from the sprite sheet
   */
  drawTile(
    ctx: CanvasRenderingContext2D,
    tileX: number,
    tileY: number,
    destX: number,
    destY: number,
    width = TILE_SIZE_PIXELS,
    height = TILE_SIZE_PIXELS
  ): void {
    if (!this.image || !this.loaded) {
      return;
    }

    ctx.drawImage(
      this.image,
      tileX * TILE_SIZE_PIXELS,
      tileY * TILE_SIZE_PIXELS,
      TILE_SIZE_PIXELS,
      TILE_SIZE_PIXELS,
      destX,
      destY,
      width,
      height
    );
  }

  /**
   * Draw a sprite with custom source coordinates
   */
  drawSprite(
    ctx: CanvasRenderingContext2D,
    src: SpriteCoords,
    destX: number,
    destY: number,
    destWidth?: number,
    destHeight?: number
  ): void {
    if (!this.image || !this.loaded) {
      return;
    }

    ctx.drawImage(
      this.image,
      src.x,
      src.y,
      src.width,
      src.height,
      destX,
      destY,
      destWidth ?? src.width,
      destHeight ?? src.height
    );
  }

  getImage(): HTMLImageElement | null {
    return this.image;
  }
}
