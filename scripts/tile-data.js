import { crisis as myCrisis } from "./crisis-data.js";
import { clamp } from "./utils.js";

/**
 * @typedef {{
 *      x: number,
 *      y: number,
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
                    x: x,
                    y: y,
                    biome: biome,
                    crisis: [],
                };
                mapTileCount++;
                console.log("initializeTile", x, y, mapTileCount);
                const tileText = runtime.objects.UIText.createInstance("tilemap", (x+1) * 64 - 32 - 16, (y+1) * 64 - 32 - 16);
                tileText.text = mapTileCount.toString();
                tileText.scale = 0.2;
                tileText.colorRgb = [0.1, 0.1, 0.1];
                row.push(tileInfo); 
            } else {
                row.push(null);
            }
        }
        tiles.push(row);
    }
    // console.log(tilemap.mapHeight, tilemap.mapWidth, mapTileCount);
    // console.log(tiles[0].length, tiles.length);
    // console.log(tiles);
}

/**
 * Expand the crisis tiles for a crisis
 * @param {IRuntimeObjects} runtime The runtime object
 * @param {string} crisisName The crisis name  to expand
 */
export function expandCrisisTiles(runtime, crisisName) { 
    const crisis = myCrisis[crisisName];
    let crisisTiles = getCrisisTiles(crisisName);
    console.log(crisis, mapTileCount);
    const expectedTiles = Math.floor((clamp(crisis.value, 0, 100) - crisis.thresholds[1]) / (100 - crisis.thresholds[1]) * mapTileCount);
    console.log("expectedTiles", expectedTiles, crisisTiles.length, crisisName);
    if (expectedTiles === crisisTiles.length || expectedTiles < 0) {
        return;
    }

    const tilesToExpand = expectedTiles - crisisTiles.length;
    const tilemapCrisis = runtime.objects.TilemapCrisis.getAllInstances().filter(t => t.instVars['id'] === crisis.type + "_crisis_tilemap")[0];
    console.log("tilesToExpand", tilesToExpand);

    if (tilesToExpand > 0) {
        // Add tiles
        let selectedTiles = [];
        const allTiles = getAllTiles();
        // let borderTiles = getBorderCrisisTiles(crisisTiles, crisisName);
        let availableTiles = getAvailableCrisisTiles(crisisTiles, crisisName);

        for (let i = 0; i < tilesToExpand; i++) {
            let selectedTile = null;

            if (crisisTiles.length === 0) {
                // Choose random tile on the map if there are no crisis tiles
                selectedTile = allTiles[Math.floor(Math.random() * allTiles.length)];
            } else {
                // If available tiles are empty, choose random tile from the all tiles that are not in the crisis
                if (availableTiles.length === 0) {
                    availableTiles = allTiles.filter(tile => !crisisTiles.includes(tile));
                    selectedTile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
                    availableTiles = getAvailableCrisisTiles([selectedTile], crisisName);
                } else {
                    // Choose random tile from the available tiles
                    selectedTile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
                }
            }

            // Add selected tile to crisis tiles
            selectedTiles.push(selectedTile);
            crisisTiles.push(selectedTile);
            selectedTile.crisis.push(crisisName);

            // Remove selected tile from available tiles
            availableTiles = availableTiles.filter(tile => tile !== selectedTile);

            // Add selected tile neighbours that are available to available tiles
            const selectedTileAvailableNeighbours = getAvailableCrisisTiles([selectedTile], crisisName);
            availableTiles = availableTiles.concat(selectedTileAvailableNeighbours);
        }

        selectedTiles.forEach(tile => {
            let isSameCrisisTypeExists = false;
            for (const tileCrisis of tile.crisis) {
                const crisisType = myCrisis[tileCrisis].type;
                if (tileCrisis !== crisisName && crisisType === crisis.type) {
                    isSameCrisisTypeExists = true;
                    break;
                }
            }
 
            if (!isSameCrisisTypeExists) {
                const tileID = getCrisisTileID(crisis.type);
                console.log(tile, tileID);
                tilemapCrisis.setTileAt(tile.x, tile.y, tileID + 1);
            }
        });
    } else {
        const tilesToRemove = Math.abs(tilesToExpand);

        // Remove tiles
        let removedTiles = [];
        let borderTiles = getBorderCrisisTiles(crisisTiles, crisisName);

        for (let i = 0; i < tilesToRemove; i++) {
            // Choose random tile from the border crisis tiles
            const removedTile = borderTiles[Math.floor(Math.random() * borderTiles.length)];

            removedTiles.push(removedTile);
            borderTiles.filter(tile => tile !== removedTile);
            crisisTiles = crisisTiles.filter(tile => tile !== removedTile);

            removedTile.crisis = removedTile.crisis.filter(c => c !== crisisName);
        }

        removedTiles.forEach(tile => {
            let isSameCrisisTypeExists = false;
            for (const tileCrisis of tile.crisis) {
                const crisisType = myCrisis[tileCrisis].type;
                if (tileCrisis !== crisisName && crisisType === crisis.type) {
                    isSameCrisisTypeExists = true;
                    break;
                }
            }

            if (!isSameCrisisTypeExists) {
                console.log(tile);
                tilemapCrisis.setTileAt(tile.x + 1, tile.y + 1, -1);
            }
        });
    }
}

/**
 * Get all the tiles (tile that are not null)
 * @returns {Tile[]}
 */
function getAllTiles() {
    const allTiles = [];

    for (let y = 0; y < tiles.length; y++) {
        for (let x = 0; x < tiles[y].length; x++) {
            const tile = tiles[y][x];
            if (tile) {
                allTiles.push(tile);
            }
        }
    }

    return allTiles;
}

/**
 * Get all the tiles that has a particular crisis
 * @param {string} crisisName The crisis name to get the tiles for
 * @returns {Tile[]}
 */
function getCrisisTiles(crisisName) {
    const crisisTiles = [];

    for (let y = 0; y < tiles.length; y++) {
        for (let x = 0; x < tiles[y].length; x++) {
            const tile = tiles[y][x];
            if (tile && tile.crisis.includes(crisisName)) {
                crisisTiles.push(tile);
            }
        }
    }

    return crisisTiles;
}

/**
 * Get all the tiles that are adjacent to a crisis tile
 * @param {Tile[]} borderTiles The tiles that are on the border of the crisis tiles
 * @param {string} crisisName The name of the crisis
 * @returns {Tile[]}
 */
function getAvailableCrisisTiles(crisisTiles, crisisName) {
    const availableCrisisTiles = [];

    for (const tile of crisisTiles) {
        const neighbours = getNeighbourTiles(tile.x, tile.y);

        // Check if the tile has a neighbour that is not null and doesn't have the same crisis
        if (neighbours.some(neighbour => neighbour !== null && !neighbour.crisis.includes(crisisName))) {
            for (const neighbour of neighbours) {
                if (neighbour !== null && !neighbour.crisis.includes(crisisName) && !availableCrisisTiles.includes(neighbour)) {
                    availableCrisisTiles.push(neighbour);
                }
            }
        }
    }

    // for (const borderTile of borderTiles) {
    //     const neighbours = getNeighbourTiles(borderTile.x, borderTile.y);
    //     for (const neighbour of neighbours) {
    //         if (neighbour !== null && !neighbour.crisis.includes(crisisName)) {
    //             availableCrisisTiles.push(borderTile);
    //         }
    //     }
    // }

    return availableCrisisTiles;
}

/**
 * Get all the tiles that are on the border of the crisis tiles
 * @param {Tile[]} crisisTiles The name of the crisis
 * @param {string} crisisName The name of the crisis
 * @returns {Tile[]}
 */
function getBorderCrisisTiles(crisisTiles, crisisName) {
    const borderCrisisTiles = [];

    for (const tile of crisisTiles) {
        const neighbours = getNeighbourTiles(tile.x, tile.y);
        if (neighbours.some(neighbour => neighbour === null || !neighbour.crisis.includes(crisisName))) {
            borderCrisisTiles.push(tile);
        }
    }

    return borderCrisisTiles;
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

/**
 * Get the tile ID of the crisis tile based on the crisis type
 * @param {string} type The crisis type
 * @returns {number} The tile ID
 * @example
 * getCrisisTileID("finance"); // 0
 * getCrisisTileID("health"); // 12
 * getCrisisTileID("education"); // 24
 */
function getCrisisTileID(type) {
    switch (type) {
        case "finance":
            return 0;
        case "health":
            return 12;
        case "education":
            return 24;
        case "social":
            return 36;
        case "environment":
            return 48;
        case "nature":
            return 60;
        case "infrastructure":
            return 72;
        case "labor":
            return 84;
        case "defense":
            return 96;
        case "stability":
            return 108;
        case "industry":
            return 120;
    }
}