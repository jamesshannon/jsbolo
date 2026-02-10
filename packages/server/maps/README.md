# Bolo Maps

This directory contains `.map` files for JSBolo gameplay.

## Current Maps

### Everard Island (`everard_island.map`)
- **Source**: [Orona Project](https://github.com/stephank/orona)
- **Size**: 256×256 tiles
- **Features**: Balanced map with strategic centers, road networks, and varied terrain
- **License**: Community-created Bolo map

## Map Format

Maps use the classic Bolo binary format (`.map`):
- Header: "BMAPBOLO" magic string + version
- Entity data: Pillbox/base positions and stats
- Terrain: Run-length encoded (RLE) 256×256 tile grid

## Adding More Maps

To add additional maps:

1. **Download from WinBolo.net**: http://www.winbolo.net/mapcollection.php
2. **Place in this directory**: `packages/server/maps/`
3. **Rename to lowercase**: `strategic_center.map` (no spaces)
4. **Update this README**: List the map with source and description

## Map Credits

All maps are community-created content from the Bolo community. Maps included here are:
- Freely shared by the community
- Used for educational and gameplay purposes
- Credited to original creators where known

If you created one of these maps and would like attribution or removal, please open an issue.

## Recommended Maps to Download

Looking for more maps? Try these highly-rated maps from WinBolo.net:

- **Training maps**: Small, simple layouts for learning
- **Strategic maps**: Balanced 4-base layouts with road networks
- **Large maps**: Complex terrain for long campaigns
- **Custom maps**: Unique designs from community creators

## Map Selection

Currently, the server loads a single map at startup (configured in `main.ts`).

Future enhancements:
- Map rotation between games
- Player-selectable maps
- Random map selection from pool
- Custom map upload feature
