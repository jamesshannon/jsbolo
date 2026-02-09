# Sprite Atlas Documentation

## base.png (Main Sprite Sheet)

All tiles are **32x32 pixels**.

### Terrain Tiles (Row 0-1)

**Row 0 (y=0):**
- Various terrain combinations (grass, water, forest, swamp, roads, buildings)
- Includes edge transitions between different terrain types

**Row 1 (y=32):**
- Continuation of terrain tiles
- More edge and corner pieces for smooth transitions

### Water/Special Tiles (Row 2)

**Row 2 (y=64):**
- Water tiles with various edge configurations
- Deep sea tiles

### Explosions & Effects (Row 3-4)

**Row 3 (y=96):**
- Small explosion frames (animation)
- Shell/bullet sprite
- Mine explosion frames

**Row 4 (y=128):**
- Large explosion frames (animation)
- Additional particle effects

### Buildings & Structures (Row 5-6)

**Row 5 (y=160):**
- Pillbox sprites (neutral, captured, damaged)
- Base sprites (neutral, captured)
- Building/wall tiles

**Row 6 (y=192):**
- Additional building states
- Damaged/destroyed building variants

### Special Elements (Row 7-8)

**Row 7 (y=224):**
- Little Green Man (Builder) animation frames
- Parachute sprite
- Mine sprite

**Row 8 (y=256):**
- Additional special elements
- UI indicators

## styled.png (Team-Colored Sprites)

**16 columns (x=0 to x=480, each 32px wide):**
- Tank sprites in 16 directions (0° to 337.5° in 22.5° increments)
  - Column 0: North (0°)
  - Column 1: NNE (22.5°)
  - Column 2: NE (45°)
  - ...
  - Column 15: NNW (337.5°)

**2 rows (y=0 to y=32):**
- Row 0 (y=0): Tank on land
- Row 1 (y=32): Tank on boat

These sprites are overlaid with team colors at runtime.

## hud.png (HUD Elements)

UI elements for the heads-up display:
- Ammo counter
- Armor/health bar
- Mine counter
- Tree counter
- Minimap elements

---

## Sprite Coordinate Reference

### Common Terrain Types (ASCII codes from Orona)

| Terrain | ASCII | Description | Approximate Location |
|---------|-------|-------------|---------------------|
| Grass   | '.'   | Open grass  | Row 0, various      |
| Forest  | '#'   | Trees       | Row 0, various      |
| Swamp   | '~'   | Swamp       | Row 0-1, various    |
| River   | ' '   | Water       | Row 2, various      |
| Road    | '='   | Road        | Row 0-1, various    |
| Crater  | '%'   | Crater      | Row 0-1, various    |
| Building| '|'   | Wall        | Row 5-6, various    |
| Rubble  | ':'   | Rubble      | Row 0-1, various    |
| Boat    | 'b'   | Boat on river| Row 2, various     |
| Deep Sea| '^'   | Deep water  | Row 2, various      |
| Damaged | '}'   | Shot building| Row 5-6, various   |

### Tank Directions (from styled.png)

Direction index maps to compass bearing:
```
 0 = North (0°)
 1 = NNE (22.5°)
 2 = NE (45°)
 3 = ENE (67.5°)
 4 = East (90°)
 5 = ESE (112.5°)
 6 = SE (135°)
 7 = SSE (157.5°)
 8 = South (180°)
 9 = SSW (202.5°)
10 = SW (225°)
11 = WSW (247.5°)
12 = West (270°)
13 = WNW (292.5°)
14 = NW (315°)
15 = NNW (337.5°)
```

## Usage Notes

1. **Tile-based rendering**: The game world is rendered tile-by-tile (32x32 pixel tiles)
2. **Dynamic tiling**: Terrain tiles auto-select based on neighbors (edge matching)
3. **Team coloring**: Base and pillbox sprites are colored based on team ownership
4. **Animation**: Explosions and the builder use multiple frames for animation
5. **Rotation**: Tanks use pre-rendered rotations (16 directions) rather than runtime rotation
