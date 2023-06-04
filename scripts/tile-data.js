/**
 * @typedef {{
 *      biome: string,
 *      crisis: string[], 
 * }} Tile
 */

/**
 * @type {Array.<{
 *     tiles: Tile[],
 * }>}
 */
const tiles = [];

let mapTileCount = 0;

/**
 * @type {Array.<{
 *      tiles: Tile[],
 *      name: string,   
 *      crisis: String[], 
 * }>}
 */
const regions = [];

export function initializeTileBiome(runtime) {
    const tilemap = runtime.objects.TilemapBiome.getFirstInstance();
    
    for (let y = 0; y < tilemap.mapHeight; y++) {
        const row = [];

        for (let x = 0; x < tilemap.mapWidth; x++) {
            let tile = tilemap.getTileAt(x, y);

            if (tile !== -1) {
                const tileID = tile & ITilemapInstance.TILE_ID_MASK;
                const biome = getBiomeString(tileID);
                const tileInfo = {
                    biome: biome,
                    crisis: [],
                };
                mapTileCount++;
                row.push(tileInfo); 
            } else {
                row.push(null);
            }
        }
        tiles.push(row);
    }
}

function getNeighbourTiles(x, y) {
    const neighbours = [];
    if (x > 0) {
        neighbours.push(tiles[y][x - 1]);
    }
    if (x < tiles[y].length - 1) {
        neighbours.push(tiles[y][x + 1]);
    }
    if (y > 0) {
        neighbours.push(tiles[y - 1][x]);
    }
    if (y < tiles.length - 1) {
        neighbours.push(tiles[y + 1][x]);
    }
    return neighbours;
}

function getBiomeString(tile) {
    if (tile < 7) {
        return "desert";
    } else if (tile < 14) {
        return "wetland";
    } else if (tile < 21) {
        return "grassland";
    } else if (tile < 28) {
        return "forest";
    } else {
        return "frostland";
    }
}