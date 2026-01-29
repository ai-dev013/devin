export interface Position {
  x: number;
  y: number;
}

export interface Stats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
  level: number;
  exp: number;
  expToNext: number;
}

export interface Character {
  id: string;
  name: string;
  stats: Stats;
  position: Position;
  sprite: string;
  isAlive: boolean;
}

export interface Player extends Character {
  gold: number;
  inventory: InventoryItem[];
  equipment: Equipment;
  learnedMagic: Magic[];
}

export interface Enemy extends Character {
  type: EnemyType;
  expReward: number;
  goldReward: number;
  dropItems: { item: Item; chance: number }[];
  aiPattern: AIPattern;
  isBoss: boolean;
}

export type EnemyType = 
  | 'slime'
  | 'wolf'
  | 'bear'
  | 'snake'
  | 'bird'
  | 'goblin'
  | 'skeleton'
  | 'darkWolf'
  | 'darkBear'
  | 'dragon';

export type AIPattern = 'aggressive' | 'defensive' | 'balanced' | 'boss';

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  effect: ItemEffect;
  price: number;
  sprite: string;
}

export type ItemType = 'consumable' | 'weapon' | 'armor' | 'accessory' | 'key';

export interface ItemEffect {
  type: 'heal' | 'healMp' | 'revive' | 'buff' | 'cure' | 'damage';
  value: number;
  target?: 'self' | 'enemy' | 'all';
}

export interface InventoryItem {
  item: Item;
  quantity: number;
}

export interface Weapon extends Item {
  attackBonus: number;
  magicBonus: number;
}

export interface Armor extends Item {
  defenseBonus: number;
  magicDefenseBonus: number;
}

export interface Equipment {
  weapon: Weapon | null;
  armor: Armor | null;
  accessory: Item | null;
}

export interface Magic {
  id: string;
  name: string;
  description: string;
  mpCost: number;
  type: MagicType;
  power: number;
  element: Element;
  target: 'single' | 'all';
  animation: string;
}

export type MagicType = 'offensive' | 'healing' | 'buff' | 'debuff';
export type Element = 'fire' | 'ice' | 'thunder' | 'holy' | 'dark' | 'none';

export interface MapTile {
  type: TileType;
  walkable: boolean;
  event?: MapEvent;
  sprite: string;
}

export type TileType = 
  | 'grass'
  | 'water'
  | 'wall'
  | 'floor'
  | 'door'
  | 'chest'
  | 'npc'
  | 'entrance'
  | 'exit'
  | 'boss';

export interface MapEvent {
  type: EventType;
  data: EventData;
  triggered: boolean;
  repeatable: boolean;
}

export type EventType = 
  | 'dialogue'
  | 'battle'
  | 'item'
  | 'shop'
  | 'heal'
  | 'teleport'
  | 'story'
  | 'boss';

export interface EventData {
  dialogues?: Dialogue[];
  enemies?: EnemyType[];
  items?: Item[];
  shopItems?: Item[];
  destination?: { mapId: string; position: Position };
  storyId?: string;
}

export interface Dialogue {
  speaker: string;
  text: string;
  portrait?: string;
}

export interface GameMap {
  id: string;
  name: string;
  width: number;
  height: number;
  tiles: MapTile[][];
  enemies: Enemy[];
  npcs: NPC[];
  bgm: string;
}

export interface NPC {
  id: string;
  name: string;
  position: Position;
  sprite: string;
  dialogues: Dialogue[];
  isShop: boolean;
  shopItems?: Item[];
}

export interface Chapter {
  id: number;
  name: string;
  description: string;
  maps: string[];
  bossId: string;
  unlocked: boolean;
  completed: boolean;
}

export interface GameState {
  player: Player;
  currentMap: GameMap;
  currentChapter: Chapter;
  chapters: Chapter[];
  gameTime: number;
  battleCount: number;
  defeatedBosses: string[];
  flags: Record<string, boolean>;
  gamePhase: GamePhase;
}

export type GamePhase = 
  | 'title'
  | 'intro'
  | 'exploration'
  | 'battle'
  | 'dialogue'
  | 'shop'
  | 'menu'
  | 'gameover'
  | 'ending';

export interface BattleState {
  player: Player;
  enemies: Enemy[];
  turn: 'player' | 'enemy';
  currentEnemyIndex: number;
  selectedAction: BattleAction | null;
  selectedTarget: number;
  battleLog: string[];
  isVictory: boolean;
  isDefeat: boolean;
  rewards: {
    exp: number;
    gold: number;
    items: Item[];
  };
}

export type BattleAction = 
  | { type: 'attack' }
  | { type: 'magic'; magic: Magic }
  | { type: 'item'; item: Item }
  | { type: 'defend' }
  | { type: 'run' };

export interface SaveData {
  player: Player;
  currentMapId: string;
  currentChapterId: number;
  gameTime: number;
  flags: Record<string, boolean>;
  defeatedBosses: string[];
  timestamp: number;
}
