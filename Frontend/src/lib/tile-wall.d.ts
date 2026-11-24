export interface TileWallTheme {
  accent: string;
  hot: string;
  deep: string;
  tile: string;
  page: string;
}

export interface TileWallInstance {
  setFrame(frame: {
    width: number;
    height: number;
    lightX: number;
    lightY: number;
  }): void;
  setPointer(pointer: { x: number; y: number } | null): void;
  playRipple(): void;
  warmUp(): Promise<void>;
  dispose(): void;
}

export function createTileWall(
  canvas: HTMLCanvasElement,
  theme?: TileWallTheme,
  options?: { pixelRatio?: number }
): TileWallInstance;
