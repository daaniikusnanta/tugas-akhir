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
    
    console.log("Map width", tilemap.mapWidth);
    console.log("Map height", tilemap.mapHeight);
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
                row.push(tileInfo); 
            } else {
                row.push(null);
            }
        }
        tiles.push(row);
    }
    console.log("Tiles", tiles);
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