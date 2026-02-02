import { GameMap, MapTile, TileType } from '../types/game';
import { CONSUMABLE_ITEMS, WEAPONS, ARMORS } from './items';

const createTile = (type: TileType, walkable: boolean = true): MapTile => ({
  type,
  walkable,
  sprite: type,
});

const TILE_PRESETS = {
  grass: createTile('grass', true),
  water: createTile('water', false),
  wall: createTile('wall', false),
  floor: createTile('floor', true),
  door: createTile('door', true),
  entrance: createTile('entrance', true),
  exit: createTile('exit', true),
};

function createEmptyMap(width: number, height: number, defaultTile: MapTile): MapTile[][] {
  return Array(height).fill(null).map(() => 
    Array(width).fill(null).map(() => ({ ...defaultTile }))
  );
}

export const VILLAGE_MAP: GameMap = {
  id: 'village',
  name: '始まりの村',
  width: 20,
  height: 15,
  tiles: (() => {
    const tiles = createEmptyMap(20, 15, TILE_PRESETS.grass);
    
    for (let x = 0; x < 20; x++) {
      tiles[0][x] = { ...TILE_PRESETS.wall };
      tiles[14][x] = { ...TILE_PRESETS.wall };
    }
    for (let y = 0; y < 15; y++) {
      tiles[y][0] = { ...TILE_PRESETS.wall };
      tiles[y][19] = { ...TILE_PRESETS.wall };
    }
    
    for (let x = 5; x <= 8; x++) {
      for (let y = 3; y <= 6; y++) {
        tiles[y][x] = { ...TILE_PRESETS.floor };
      }
    }
    
    for (let x = 12; x <= 15; x++) {
      for (let y = 3; y <= 6; y++) {
        tiles[y][x] = { ...TILE_PRESETS.floor };
      }
    }
    
    for (let x = 8; x <= 12; x++) {
      for (let y = 9; y <= 12; y++) {
        tiles[y][x] = { ...TILE_PRESETS.floor };
      }
    }
    
    tiles[7][17] = { 
      ...TILE_PRESETS.exit,
      event: {
        type: 'teleport',
        data: { destination: { mapId: 'forest', position: { x: 1, y: 7 } } },
        triggered: false,
        repeatable: true,
      }
    };
    
    tiles[10][10] = {
      ...TILE_PRESETS.floor,
      event: {
        type: 'heal',
        data: {},
        triggered: false,
        repeatable: true,
      }
    };
    
    return tiles;
  })(),
  enemies: [],
  npcs: [
    {
      id: 'villager1',
      name: '村人',
      position: { x: 6, y: 5 },
      sprite: 'villager',
      dialogues: [
        { speaker: '村人', text: '勇者様、頑張ってください！' },
        { speaker: '村人', text: '森には危険なモンスターがいるので気をつけて。' },
      ],
      isShop: false,
    },
    {
      id: 'shopkeeper',
      name: '道具屋',
      position: { x: 13, y: 5 },
      sprite: 'shopkeeper',
      dialogues: [
        { speaker: '店主', text: 'いらっしゃい！何をお求めですか？' },
      ],
      isShop: true,
      shopItems: [
        CONSUMABLE_ITEMS[0],
        CONSUMABLE_ITEMS[1],
        CONSUMABLE_ITEMS[3],
        CONSUMABLE_ITEMS[6],
        WEAPONS[0],
        WEAPONS[1],
        ARMORS[0],
        ARMORS[1],
      ],
    },
    {
      id: 'innkeeper',
      name: '宿屋の主人',
      position: { x: 10, y: 11 },
      sprite: 'innkeeper',
      dialogues: [
        { speaker: '宿屋の主人', text: '一晩泊まっていきますか？HPとMPが全回復しますよ。（50ゴールド）' },
      ],
      isShop: false,
    },
  ],
  bgm: 'village',
};

export const FOREST_MAP: GameMap = {
  id: 'forest',
  name: '始まりの森',
  width: 25,
  height: 20,
  tiles: (() => {
    const tiles = createEmptyMap(25, 20, TILE_PRESETS.grass);
    
    for (let x = 0; x < 25; x++) {
      tiles[0][x] = { ...TILE_PRESETS.wall };
      tiles[19][x] = { ...TILE_PRESETS.wall };
    }
    for (let y = 0; y < 20; y++) {
      tiles[y][0] = { ...TILE_PRESETS.wall };
      tiles[y][24] = { ...TILE_PRESETS.wall };
    }
    
    const treePositions = [
      [3, 3], [5, 2], [7, 4], [10, 3], [12, 2], [15, 4], [18, 3], [20, 2],
      [4, 8], [8, 9], [11, 7], [14, 8], [17, 9], [21, 8],
      [3, 13], [6, 14], [9, 12], [13, 14], [16, 13], [19, 14], [22, 12],
      [5, 17], [8, 16], [12, 17], [15, 16], [18, 17], [21, 16],
    ];
    
    treePositions.forEach(([y, x]) => {
      if (y < 20 && x < 25) {
        tiles[y][x] = { ...TILE_PRESETS.wall };
      }
    });
    
    tiles[7][0] = { 
      ...TILE_PRESETS.entrance,
      event: {
        type: 'teleport',
        data: { destination: { mapId: 'village', position: { x: 16, y: 7 } } },
        triggered: false,
        repeatable: true,
      }
    };
    
    tiles[10][23] = { 
      ...TILE_PRESETS.exit,
      event: {
        type: 'boss',
        data: { enemies: ['darkWolf'] },
        triggered: false,
        repeatable: false,
      }
    };
    
    tiles[5][12] = {
      type: 'chest',
      walkable: true,
      sprite: 'chest',
      event: {
        type: 'item',
        data: { items: [CONSUMABLE_ITEMS[1]] },
        triggered: false,
        repeatable: false,
      }
    };
    
    tiles[15][8] = {
      type: 'chest',
      walkable: true,
      sprite: 'chest',
      event: {
        type: 'item',
        data: { items: [WEAPONS[1]] },
        triggered: false,
        repeatable: false,
      }
    };
    
    return tiles;
  })(),
  enemies: [],
  npcs: [
    {
      id: 'traveler1',
      name: '旅人',
      position: { x: 10, y: 10 },
      sprite: 'traveler',
      dialogues: [
        { speaker: '旅人', text: 'この森の奥には強いモンスターがいるらしい。' },
        { speaker: '旅人', text: '気をつけて進むんだ。' },
      ],
      isShop: false,
    },
  ],
  bgm: 'forest',
};

export const CAVE_MAP: GameMap = {
  id: 'cave',
  name: '暗黒の洞窟',
  width: 25,
  height: 20,
  tiles: (() => {
    const tiles = createEmptyMap(25, 20, TILE_PRESETS.floor);
    
    for (let x = 0; x < 25; x++) {
      tiles[0][x] = { ...TILE_PRESETS.wall };
      tiles[19][x] = { ...TILE_PRESETS.wall };
    }
    for (let y = 0; y < 20; y++) {
      tiles[y][0] = { ...TILE_PRESETS.wall };
      tiles[y][24] = { ...TILE_PRESETS.wall };
    }
    
    const wallPositions = [
      [3, 5], [3, 6], [3, 7], [4, 7], [5, 7],
      [7, 10], [7, 11], [7, 12], [8, 12], [9, 12], [10, 12],
      [12, 3], [12, 4], [13, 4], [14, 4], [14, 5], [14, 6],
      [5, 15], [6, 15], [6, 16], [6, 17], [7, 17],
      [15, 15], [15, 16], [16, 16], [16, 17], [17, 17],
      [10, 5], [10, 6], [11, 6],
    ];
    
    wallPositions.forEach(([y, x]) => {
      if (y < 20 && x < 25) {
        tiles[y][x] = { ...TILE_PRESETS.wall };
      }
    });
    
    tiles[10][1] = { 
      ...TILE_PRESETS.entrance,
      event: {
        type: 'teleport',
        data: { destination: { mapId: 'forest', position: { x: 22, y: 10 } } },
        triggered: false,
        repeatable: true,
      }
    };
    
    tiles[10][23] = { 
      ...TILE_PRESETS.exit,
      event: {
        type: 'boss',
        data: { enemies: ['darkBear'] },
        triggered: false,
        repeatable: false,
      }
    };
    
    tiles[5][20] = {
      type: 'chest',
      walkable: true,
      sprite: 'chest',
      event: {
        type: 'item',
        data: { items: [WEAPONS[2]] },
        triggered: false,
        repeatable: false,
      }
    };
    
    tiles[15][10] = {
      type: 'chest',
      walkable: true,
      sprite: 'chest',
      event: {
        type: 'item',
        data: { items: [ARMORS[2]] },
        triggered: false,
        repeatable: false,
      }
    };
    
    tiles[8][5] = {
      type: 'chest',
      walkable: true,
      sprite: 'chest',
      event: {
        type: 'item',
        data: { items: [CONSUMABLE_ITEMS[5]] },
        triggered: false,
        repeatable: false,
      }
    };
    
    return tiles;
  })(),
  enemies: [],
  npcs: [
    {
      id: 'miner',
      name: '鉱夫',
      position: { x: 8, y: 8 },
      sprite: 'miner',
      dialogues: [
        { speaker: '鉱夫', text: 'この洞窟は危険だ。奥には恐ろしいクマがいるらしい。' },
      ],
      isShop: false,
    },
  ],
  bgm: 'cave',
};

export const MOUNTAIN_MAP: GameMap = {
  id: 'mountain',
  name: '試練の山',
  width: 30,
  height: 25,
  tiles: (() => {
    const tiles = createEmptyMap(30, 25, TILE_PRESETS.grass);
    
    for (let x = 0; x < 30; x++) {
      tiles[0][x] = { ...TILE_PRESETS.wall };
      tiles[24][x] = { ...TILE_PRESETS.wall };
    }
    for (let y = 0; y < 25; y++) {
      tiles[y][0] = { ...TILE_PRESETS.wall };
      tiles[y][29] = { ...TILE_PRESETS.wall };
    }
    
    const cliffPositions: number[][] = [];
    for (let x = 5; x < 25; x += 3) {
      for (let y = 3; y < 22; y += 4) {
        if (Math.random() > 0.3) {
          cliffPositions.push([y, x]);
          if (Math.random() > 0.5) cliffPositions.push([y, x + 1]);
        }
      }
    }
    
    cliffPositions.forEach(([y, x]) => {
      if (y < 25 && x < 30) {
        tiles[y][x] = { ...TILE_PRESETS.wall };
      }
    });
    
    tiles[12][1] = { 
      ...TILE_PRESETS.entrance,
      event: {
        type: 'teleport',
        data: { destination: { mapId: 'cave', position: { x: 22, y: 10 } } },
        triggered: false,
        repeatable: true,
      }
    };
    
    tiles[12][28] = { 
      ...TILE_PRESETS.exit,
      event: {
        type: 'teleport',
        data: { destination: { mapId: 'darkCastle', position: { x: 1, y: 10 } } },
        triggered: false,
        repeatable: true,
      }
    };
    
    tiles[6][15] = {
      type: 'chest',
      walkable: true,
      sprite: 'chest',
      event: {
        type: 'item',
        data: { items: [WEAPONS[3]] },
        triggered: false,
        repeatable: false,
      }
    };
    
    tiles[18][20] = {
      type: 'chest',
      walkable: true,
      sprite: 'chest',
      event: {
        type: 'item',
        data: { items: [ARMORS[3]] },
        triggered: false,
        repeatable: false,
      }
    };
    
    return tiles;
  })(),
  enemies: [],
  npcs: [
    {
      id: 'hermit',
      name: '山の仙人',
      position: { x: 15, y: 12 },
      sprite: 'hermit',
      dialogues: [
        { speaker: '山の仙人', text: 'この山を越えれば、闇の城が見えるじゃろう。' },
        { speaker: '山の仙人', text: '心して進むのじゃ、若き勇者よ。' },
      ],
      isShop: false,
    },
  ],
  bgm: 'mountain',
};

export const DARK_CASTLE_MAP: GameMap = {
  id: 'darkCastle',
  name: '闇の城',
  width: 30,
  height: 25,
  tiles: (() => {
    const tiles = createEmptyMap(30, 25, TILE_PRESETS.floor);
    
    for (let x = 0; x < 30; x++) {
      tiles[0][x] = { ...TILE_PRESETS.wall };
      tiles[24][x] = { ...TILE_PRESETS.wall };
    }
    for (let y = 0; y < 25; y++) {
      tiles[y][0] = { ...TILE_PRESETS.wall };
      tiles[y][29] = { ...TILE_PRESETS.wall };
    }
    
    for (let x = 10; x < 20; x++) {
      tiles[8][x] = { ...TILE_PRESETS.wall };
      tiles[16][x] = { ...TILE_PRESETS.wall };
    }
    for (let y = 8; y < 17; y++) {
      tiles[y][10] = { ...TILE_PRESETS.wall };
      tiles[y][19] = { ...TILE_PRESETS.wall };
    }
    
    tiles[16][14] = { ...TILE_PRESETS.door };
    tiles[16][15] = { ...TILE_PRESETS.door };
    
    tiles[10][1] = { 
      ...TILE_PRESETS.entrance,
      event: {
        type: 'teleport',
        data: { destination: { mapId: 'mountain', position: { x: 27, y: 12 } } },
        triggered: false,
        repeatable: true,
      }
    };
    
    tiles[12][14] = { 
      type: 'boss',
      walkable: true,
      sprite: 'boss',
      event: {
        type: 'boss',
        data: { enemies: ['dragon'] },
        triggered: false,
        repeatable: false,
      }
    };
    
    tiles[20][5] = {
      type: 'chest',
      walkable: true,
      sprite: 'chest',
      event: {
        type: 'item',
        data: { items: [WEAPONS[6]] },
        triggered: false,
        repeatable: false,
      }
    };
    
    tiles[20][24] = {
      type: 'chest',
      walkable: true,
      sprite: 'chest',
      event: {
        type: 'item',
        data: { items: [ARMORS[5]] },
        triggered: false,
        repeatable: false,
      }
    };
    
    tiles[4][15] = {
      type: 'chest',
      walkable: true,
      sprite: 'chest',
      event: {
        type: 'item',
        data: { items: [CONSUMABLE_ITEMS[2], CONSUMABLE_ITEMS[4]] },
        triggered: false,
        repeatable: false,
      }
    };
    
    return tiles;
  })(),
  enemies: [],
  npcs: [],
  bgm: 'darkCastle',
};

export const ALL_MAPS: Record<string, GameMap> = {
  village: VILLAGE_MAP,
  forest: FOREST_MAP,
  cave: CAVE_MAP,
  mountain: MOUNTAIN_MAP,
  darkCastle: DARK_CASTLE_MAP,
};

export function getMapById(mapId: string): GameMap | undefined {
  return ALL_MAPS[mapId];
}
