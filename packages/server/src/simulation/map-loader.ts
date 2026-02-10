/**
 * Bolo Map Loader - Parses binary .map files from WinBolo/Orona
 *
 * FILE FORMAT OVERVIEW:
 * The Bolo .map format is a binary format developed for the classic tank game.
 * It uses run-length encoding for terrain compression and stores entity spawn data.
 *
 * Format: "BMAPBOLO" header + version + counts + entity data + RLE terrain
 * Maps are always 256×256 tiles.
 *
 * REFERENCES:
 * - WinBolo source: https://github.com/milki/winbolo
 * - Format defined in: bolo_map.h, bolo_map.c
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  type MapCell,
  TerrainType,
  getTerrainInitialLife,
  MAP_SIZE_TILES,
} from '@jsbolo/shared';

/** Magic bytes identifying a Bolo map file */
const MAP_HEADER = 'BMAPBOLO';

/** Expected format version */
const MAP_VERSION = 0x01;

/** Maximum entities allowed per map */
const MAX_PILLS = 16;
const MAX_BASES = 16;

/** Run-length encoding constants (from WinBolo bolo_map.h) */
const MAP_ARRAY_LAST = 0xFF;         // Terminator marker

/** Mine terrain code range (10-15 = mine + terrain combinations) */
const MINE_START = 10;
const MINE_END = 15;

/**
 * Pillbox spawn data from map file
 */
export interface PillboxSpawnData {
  tileX: number;
  tileY: number;
  ownerTeam: number;  // 0-15, or 255 for neutral
  armor: number;      // 0-15
  speed: number;      // 6-100 (reload speed)
}

/**
 * Base spawn data from map file
 */
export interface BaseSpawnData {
  tileX: number;
  tileY: number;
  ownerTeam: number;  // 0-15, or 255 for neutral
  armor: number;      // 0-90
  shells: number;     // 0-40
  mines: number;      // 0-40
}

/**
 * Player start position from map file
 */
export interface StartPosition {
  tileX: number;
  tileY: number;
  direction: number;  // 0-255 (initial tank facing)
}

/**
 * Complete loaded map data
 */
export interface LoadedMap {
  terrain: MapCell[][];
  pillboxes: PillboxSpawnData[];
  bases: BaseSpawnData[];
  startPositions: StartPosition[];
  mapName: string;
}

/**
 * Map file header structure
 */
interface MapHeader {
  version: number;
  pillCount: number;
  baseCount: number;
  startCount: number;
  dataOffset: number;  // Offset where entity data begins
}

/**
 * Decoded run segment from RLE terrain data
 */
interface DecodedRun {
  y: number;          // Y coordinate for this run
  startX: number;     // Starting X coordinate
  endX: number;       // Ending X coordinate (inclusive)
  terrainCodes: number[];  // Decoded terrain values
  nextOffset: number; // Offset to next run header
}

/**
 * Bolo Map Loader
 *
 * Parses binary .map files into our internal format.
 * Handles header validation, entity extraction, and RLE terrain decompression.
 */
export class MapLoader {
  /**
   * Load a Bolo .map file from disk.
   *
   * WHY THIS APPROACH:
   * - Binary parsing is necessary (format is not text-based)
   * - Run-length decoding requires sequential processing
   * - Single-pass parsing is most efficient
   *
   * ERROR HANDLING:
   * - Invalid magic bytes → throw (corrupted file)
   * - Version mismatch → warn but continue (may be compatible)
   * - Out-of-range coordinates → clamp and warn
   * - Corrupt RLE data → throw with offset for debugging
   *
   * @param filepath Absolute or relative path to .map file
   * @returns Complete map data ready for ServerWorld
   * @throws Error if file not found, invalid format, or corrupt data
   */
  static loadFromFile(filepath: string): LoadedMap {
    // Read entire file into buffer (maps are small, ~2KB typical)
    const buffer = fs.readFileSync(filepath);
    const mapName = path.basename(filepath, '.map');

    console.log(`Loading map: ${mapName} (${buffer.length} bytes)`);

    // Parse header and validate format
    const header = this.readHeader(buffer);

    console.log(`  Header: v${header.version}, ${header.pillCount} pillboxes, ${header.baseCount} bases, ${header.startCount} starts`);

    // Extract entity spawn data (fixed-size structures)
    let offset = header.dataOffset;

    const pillboxes = this.readPillboxes(buffer, offset, header.pillCount);
    offset += header.pillCount * 5;  // 5 bytes per pillbox

    const bases = this.readBases(buffer, offset, header.baseCount);
    offset += header.baseCount * 6;  // 6 bytes per base

    const startPositions = this.readStarts(buffer, offset, header.startCount);
    offset += header.startCount * 3;  // 3 bytes per start

    // Decompress run-length encoded terrain data
    console.log(`  Decompressing terrain from offset ${offset}...`);
    const terrain = this.decodeTerrainData(buffer, offset);

    console.log(`  Map loaded successfully!`);

    return {
      terrain,
      pillboxes,
      bases,
      startPositions,
      mapName,
    };
  }

  /**
   * Read and validate map file header.
   *
   * HEADER STRUCTURE (11 bytes minimum):
   * - Bytes 0-7: "BMAPBOLO" magic string
   * - Byte 8: Version (expected 0x01)
   * - Byte 9: Pillbox count (0-16)
   * - Byte 10: Base count (0-16)
   * - Byte 11: Start count (0-255)
   *
   * WHY VALIDATE:
   * - Ensures we're parsing a Bolo map (not random binary data)
   * - Version check prevents format mismatches
   * - Count validation prevents buffer overruns
   */
  private static readHeader(buffer: Buffer): MapHeader {
    if (buffer.length < 11) {
      throw new Error(`File too small to be a valid map (${buffer.length} bytes < 11)`);
    }

    // Validate magic bytes
    const magic = buffer.toString('ascii', 0, 8);
    if (magic !== MAP_HEADER) {
      throw new Error(`Invalid map header: expected "${MAP_HEADER}", got "${magic}"`);
    }

    // Read version
    const version = buffer.readUInt8(8);
    if (version !== MAP_VERSION) {
      console.warn(`Warning: Map version ${version} != expected ${MAP_VERSION}, attempting load anyway`);
    }

    // Read entity counts
    const pillCount = buffer.readUInt8(9);
    const baseCount = buffer.readUInt8(10);
    const startCount = buffer.readUInt8(11);

    // Validate counts
    if (pillCount > MAX_PILLS) {
      throw new Error(`Too many pillboxes: ${pillCount} > ${MAX_PILLS}`);
    }
    if (baseCount > MAX_BASES) {
      throw new Error(`Too many bases: ${baseCount} > ${MAX_BASES}`);
    }

    return {
      version,
      pillCount,
      baseCount,
      startCount,
      dataOffset: 12,  // Entity data starts after 12-byte header
    };
  }

  /**
   * Read pillbox spawn data.
   *
   * PILLBOX STRUCTURE (5 bytes each):
   * - Byte 0: X coordinate (0-255)
   * - Byte 1: Y coordinate (0-255)
   * - Byte 2: Owner team (0-15, or 255=neutral)
   * - Byte 3: Armor (0-15)
   * - Byte 4: Speed/reload (6-100)
   *
   * WHY FIXED SIZE:
   * - Simple sequential parsing
   * - No alignment issues
   * - Easy to validate buffer bounds
   */
  private static readPillboxes(
    buffer: Buffer,
    offset: number,
    count: number
  ): PillboxSpawnData[] {
    const pillboxes: PillboxSpawnData[] = [];

    for (let i = 0; i < count; i++) {
      const base = offset + i * 5;

      pillboxes.push({
        tileX: buffer.readUInt8(base),
        tileY: buffer.readUInt8(base + 1),
        ownerTeam: buffer.readUInt8(base + 2),
        armor: buffer.readUInt8(base + 3),
        speed: buffer.readUInt8(base + 4),
      });
    }

    return pillboxes;
  }

  /**
   * Read base spawn data.
   *
   * BASE STRUCTURE (6 bytes each):
   * - Byte 0: X coordinate
   * - Byte 1: Y coordinate
   * - Byte 2: Owner team
   * - Byte 3: Armor (0-90)
   * - Byte 4: Shells stockpile (0-40)
   * - Byte 5: Mines stockpile (0-40)
   */
  private static readBases(
    buffer: Buffer,
    offset: number,
    count: number
  ): BaseSpawnData[] {
    const bases: BaseSpawnData[] = [];

    for (let i = 0; i < count; i++) {
      const base = offset + i * 6;

      bases.push({
        tileX: buffer.readUInt8(base),
        tileY: buffer.readUInt8(base + 1),
        ownerTeam: buffer.readUInt8(base + 2),
        armor: buffer.readUInt8(base + 3),
        shells: buffer.readUInt8(base + 4),
        mines: buffer.readUInt8(base + 5),
      });
    }

    return bases;
  }

  /**
   * Read player start positions.
   *
   * START STRUCTURE (3 bytes each):
   * - Byte 0: X coordinate
   * - Byte 1: Y coordinate
   * - Byte 2: Initial direction (0-255)
   */
  private static readStarts(
    buffer: Buffer,
    offset: number,
    count: number
  ): StartPosition[] {
    const starts: StartPosition[] = [];

    for (let i = 0; i < count; i++) {
      const base = offset + i * 3;

      starts.push({
        tileX: buffer.readUInt8(base),
        tileY: buffer.readUInt8(base + 1),
        direction: buffer.readUInt8(base + 2),
      });
    }

    return starts;
  }

  /**
   * Decode run-length encoded terrain data.
   *
   * RLE FORMAT (nibble-based):
   * - Each terrain code is 4 bits (0-15)
   * - Two terrain codes packed per byte
   * - Organized into "runs" with 4-byte headers
   * - Terminated by all-0xFF header
   *
   * WHY RLE:
   * - Maps have large areas of identical terrain (grass, deep sea)
   * - Compression reduces file size ~10x
   * - Nibble encoding further saves space
   *
   * WHY THIS APPROACH:
   * - Sequential decoding matches file structure
   * - Pre-allocate 256x256 grid for performance
   * - Process runs in order to build complete map
   *
   * ALTERNATIVES CONSIDERED:
   * 1. Decode entire file first, then process → more memory
   * 2. Lazy decoding on access → complex, slower lookups
   * 3. Keep compressed, decompress per-tile → way too slow
   */
  private static decodeTerrainData(buffer: Buffer, offset: number): MapCell[][] {
    // Pre-allocate 256x256 grid initialized to deep sea
    // WHY DEEP SEA:
    // - Bolo maps use deep sea as the default/boundary terrain
    // - RLE compression only encodes non-default tiles
    // - This matches WinBolo's map format where unset tiles are water
    const terrain: MapCell[][] = [];
    for (let y = 0; y < MAP_SIZE_TILES; y++) {
      terrain[y] = [];
      for (let x = 0; x < MAP_SIZE_TILES; x++) {
        terrain[y]![x] = {
          terrain: TerrainType.DEEP_SEA,
          hasMine: false,
          terrainLife: getTerrainInitialLife(TerrainType.DEEP_SEA),
        };
      }
    }

    let currentOffset = offset;
    let runsProcessed = 0;
    let tilesDecoded = 0;
    const terrainCounts: Record<number, number> = {};

    // Process runs until terminator
    // WHY CHECK currentOffset + 4:
    // - Each run header is 4 bytes
    // - Must have enough space to read full header
    // - Prevents buffer overrun errors
    while (currentOffset + 4 <= buffer.length) {
      const run = this.decompressRun(buffer, currentOffset);

      // Check for terminator (all 0xFF)
      // WHY CHECK ALL THREE: WinBolo format uses all-0xFF as sentinel value
      if (run.y === MAP_ARRAY_LAST && run.startX === MAP_ARRAY_LAST && run.endX === MAP_ARRAY_LAST) {
        console.log(`  Terrain decompression complete (${runsProcessed} runs, ${tilesDecoded} tiles decoded)`);
        break;
      }

      // Debug logging - log all runs to find where we skip the terminator
      console.log(`  Run ${runsProcessed} at offset ${currentOffset}: y=${run.y}, x=${run.startX}-${run.endX}, ${run.terrainCodes.length} codes, nextOffset=${run.nextOffset}`);

      // Fill terrain grid with decoded run
      // Terrain codes are sequential from startX to endX (exclusive)
      let x = run.startX;
      for (let i = 0; i < run.terrainCodes.length; i++) {
        if (run.y >= 0 && run.y < MAP_SIZE_TILES && x >= 0 && x < MAP_SIZE_TILES) {
          const code = run.terrainCodes[i]!;
          const {terrain: terrainType, hasMine} = this.terrainCodeToType(code);

          terrain[run.y]![x] = {
            terrain: terrainType,
            hasMine,
            terrainLife: getTerrainInitialLife(terrainType),
          };

          terrainCounts[terrainType] = (terrainCounts[terrainType] || 0) + 1;
          tilesDecoded++;
        }
        x++;
      }

      currentOffset = run.nextOffset;
      runsProcessed++;
    }

    // Log if we exited without hitting terminator (indicates error)
    if (runsProcessed === 0) {
      console.warn(`  WARNING: No terrain runs processed. Map may be empty or corrupt.`);
    }

    // Show terrain distribution
    console.log('  Terrain distribution:', terrainCounts);
    console.log(`  Total tiles decoded: ${tilesDecoded} / 65536 (${((tilesDecoded / 65536) * 100).toFixed(1)}%)`);

    return terrain;
  }

  /**
   * Decompress a single RLE run segment.
   *
   * RUN HEADER (4 bytes):
   * - Byte 0: Data length (nibbles in run data)
   * - Byte 1: Y coordinate
   * - Byte 2: Start X coordinate
   * - Byte 3: End X coordinate
   *
   * RUN DATA (variable length):
   * - Follows header immediately
   * - Nibble-encoded terrain codes
   * - May be identical sequence or different sequence
   *
   * ENCODING TYPES:
   *
   * 1. IDENTICAL RUN (codes 8-15):
   *    - First nibble = 8-15 (length = code - 8)
   *    - Second nibble = terrain value to repeat
   *    - Example: 0xA7 = 10-8=2 repetitions of terrain 7 (grass)
   *
   * 2. DIFFERENT RUN (codes 0-7):
   *    - First nibble = 0-7 (count of following terrain codes)
   *    - Following nibbles = individual terrain values
   *    - Example: 0x37 0x24 = 3 terrains: 7,2,4
   */
  private static decompressRun(buffer: Buffer, offset: number): DecodedRun {
    // Read 4-byte run header
    // Per WinBolo/Orona: first byte is total run size in BYTES (including the 4-byte header)
    const rawDataLen = buffer.readUInt8(offset);
    const y = buffer.readUInt8(offset + 1);
    const startX = buffer.readUInt8(offset + 2);
    const endX = buffer.readUInt8(offset + 3);

    // nextOffset is always offset + rawDataLen (the total run size)
    const nextOffset = offset + rawDataLen;

    // Check for terminator: rawDataLen=4 (0 data bytes), y=0xFF, sx=0xFF, ex=0xFF
    if (rawDataLen === 4 && y === MAP_ARRAY_LAST && startX === MAP_ARRAY_LAST && endX === MAP_ARRAY_LAST) {
      return {y, startX, endX, terrainCodes: [], nextOffset};
    }

    // Data bytes = rawDataLen - 4 (subtract header)
    const dataBytes = rawDataLen - 4;

    // Validate we have enough data
    if (offset + rawDataLen > buffer.length) {
      console.warn(`  Skipping invalid run at offset ${offset}: needs ${dataBytes} data bytes but only ${buffer.length - offset - 4} available`);
      return {y, startX, endX, terrainCodes: [], nextOffset: buffer.length};
    }

    // Read the data bytes into a local array
    const dataStart = offset + 4;
    const runData = buffer.subarray(dataStart, dataStart + dataBytes);

    // Sequential nibble stream (per Orona's takeNibble)
    // runPos tracks position in nibbles (0, 1, 2, 3, ...)
    // Even positions = high nibble, odd positions = low nibble
    let runPos = 0;
    const takeNibble = (): number => {
      const byteIndex = runPos >> 1;  // Math.floor(runPos / 2)
      const isHighNibble = (runPos & 1) === 0;  // Even = high nibble
      runPos++;
      if (byteIndex >= runData.length) return 0;  // Safety
      const byte = runData[byteIndex]!;
      return isHighNibble ? (byte >> 4) & 0x0F : byte & 0x0F;
    };

    // Decode terrain: loop while x < endX (endX is EXCLUSIVE per Orona)
    const terrainCodes: number[] = [];
    let x = startX;
    while (x < endX) {
      const seqLen = takeNibble();

      if (seqLen < 8) {
        // Different run: next (seqLen + 1) nibbles are individual terrain values
        const count = seqLen + 1;
        for (let i = 0; i < count && x < endX; i++) {
          terrainCodes.push(takeNibble());
          x++;
        }
      } else {
        // Identical run: next nibble is terrain type, repeated (seqLen - 6) times
        const terrainType = takeNibble();
        const repeatCount = seqLen - 6;
        for (let i = 0; i < repeatCount && x < endX; i++) {
          terrainCodes.push(terrainType);
          x++;
        }
      }
    }

    return {
      y,
      startX,
      endX,
      terrainCodes,
      nextOffset,
    };
  }

  /**
   * Convert WinBolo terrain code to our TerrainType + mine flag.
   *
   * TERRAIN CODE MAPPING:
   * - 0-9: Standard terrain (direct mapping)
   * - 10-15: Mine + terrain combinations
   * - 0xFF: Deep sea (map boundary)
   *
   * MINE CODES (10-15):
   * WinBolo encodes mines as special terrain types. We decode them by:
   * - Extract base terrain: code - 10 + 2 (MINE_SWAMP=10 → SWAMP=2)
   * - Set hasMine flag
   *
   * WHY THIS MAPPING:
   * - Code 10 = Mine on Swamp (10 - 10 + 2 = 2 = SWAMP)
   * - Code 11 = Mine on Crater (11 - 10 + 2 = 3 = CRATER)
   * - Code 12 = Mine on Road (12 - 10 + 2 = 4 = ROAD)
   * - Code 13 = Mine on Forest (13 - 10 + 2 = 5 = FOREST)
   * - Code 14 = Mine on Rubble (14 - 10 + 2 = 6 = RUBBLE)
   * - Code 15 = Mine on Grass (15 - 10 + 2 = 7 = GRASS)
   *
   * This matches WinBolo's MINE_SUBTRACT constant (8) logic.
   */
  private static terrainCodeToType(code: number): {terrain: TerrainType; hasMine: boolean} {
    // Handle mine-terrain combinations (codes 10-15)
    if (code >= MINE_START && code <= MINE_END) {
      const baseTerrain = (code - MINE_START + 2) as TerrainType;
      return {
        terrain: baseTerrain,
        hasMine: true,
      };
    }

    // Handle deep sea special case (0xFF = map boundary)
    if (code === 0xFF) {
      return {
        terrain: TerrainType.DEEP_SEA,
        hasMine: false,
      };
    }

    // Direct mapping for standard terrain (0-9)
    // Our TerrainType enum matches WinBolo's terrain codes exactly
    return {
      terrain: code as TerrainType,
      hasMine: false,
    };
  }
}
