import { useMemo } from 'react';
import { GameMap as GameMapType, Position, NPC } from '@/types/game';

interface GameMapProps {
  map: GameMapType;
  playerPosition: Position;
  onNpcClick?: (npc: NPC) => void;
}

const TILE_SIZE = 32;
const VIEWPORT_TILES_X = 15;
const VIEWPORT_TILES_Y = 11;

const TILE_COLORS: Record<string, string> = {
  grass: 'bg-green-600',
  water: 'bg-blue-500',
  wall: 'bg-gray-700',
  floor: 'bg-amber-800',
  door: 'bg-amber-600',
  chest: 'bg-yellow-600',
  npc: 'bg-green-500',
  entrance: 'bg-blue-400',
  exit: 'bg-red-400',
  boss: 'bg-purple-600',
};


const NPC_SPRITES: Record<string, string> = {
  villager: '👨',
  shopkeeper: '🧑‍💼',
  innkeeper: '🧑‍🍳',
  traveler: '🧳',
  miner: '⛏️',
  hermit: '🧙',
  sage: '📚',
};

export function GameMap({ map, playerPosition, onNpcClick }: GameMapProps) {
    const viewportOffset = useMemo(() => {
      const halfViewportX = Math.floor(VIEWPORT_TILES_X / 2);
      const halfViewportY = Math.floor(VIEWPORT_TILES_Y / 2);
    
      let offsetX = playerPosition.x - halfViewportX;
      let offsetY = playerPosition.y - halfViewportY;
    
      offsetX = Math.max(0, Math.min(offsetX, map.width - VIEWPORT_TILES_X));
      offsetY = Math.max(0, Math.min(offsetY, map.height - VIEWPORT_TILES_Y));
    
      return { x: offsetX, y: offsetY };
    }, [playerPosition, map]);

  const visibleTiles = useMemo(() => {
    const tiles: { x: number; y: number; tile: typeof map.tiles[0][0] }[] = [];
    
    for (let y = 0; y < VIEWPORT_TILES_Y; y++) {
      for (let x = 0; x < VIEWPORT_TILES_X; x++) {
        const mapX = viewportOffset.x + x;
        const mapY = viewportOffset.y + y;
        
        if (mapY >= 0 && mapY < map.height && mapX >= 0 && mapX < map.width) {
          tiles.push({
            x: mapX,
            y: mapY,
            tile: map.tiles[mapY][mapX],
          });
        }
      }
    }
    
    return tiles;
  }, [map.tiles, viewportOffset, map.width, map.height]);

  const visibleNpcs = useMemo(() => {
    return map.npcs.filter(npc => {
      const relX = npc.position.x - viewportOffset.x;
      const relY = npc.position.y - viewportOffset.y;
      return relX >= 0 && relX < VIEWPORT_TILES_X && relY >= 0 && relY < VIEWPORT_TILES_Y;
    });
  }, [map.npcs, viewportOffset]);

  const playerScreenPos = useMemo(() => ({
    x: (playerPosition.x - viewportOffset.x) * TILE_SIZE,
    y: (playerPosition.y - viewportOffset.y) * TILE_SIZE,
  }), [playerPosition, viewportOffset]);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl border-4 border-gray-800">
      <div className="absolute top-2 left-2 z-20 bg-black/70 px-3 py-1 rounded text-white text-sm font-bold">
        {map.name}
      </div>
      
      <div 
        className="relative"
        style={{ 
          width: VIEWPORT_TILES_X * TILE_SIZE, 
          height: VIEWPORT_TILES_Y * TILE_SIZE 
        }}
      >
        {visibleTiles.map(({ x, y, tile }) => {
          const screenX = (x - viewportOffset.x) * TILE_SIZE;
          const screenY = (y - viewportOffset.y) * TILE_SIZE;
          
          return (
            <div
              key={`${x}-${y}`}
              className={`absolute ${TILE_COLORS[tile.type] || 'bg-gray-500'} border border-black/20 flex items-center justify-center text-xs`}
              style={{
                left: screenX,
                top: screenY,
                width: TILE_SIZE,
                height: TILE_SIZE,
              }}
            >
              {tile.event && !tile.event.triggered && tile.type === 'chest' && (
                <span className="text-lg">📦</span>
              )}
              {tile.event?.triggered && tile.type === 'chest' && (
                <span className="text-lg opacity-50">📭</span>
              )}
              {tile.type === 'boss' && !tile.event?.triggered && (
                <span className="text-lg animate-pulse">💀</span>
              )}
              {tile.type === 'entrance' && <span className="text-sm">⬅️</span>}
              {tile.type === 'exit' && <span className="text-sm">➡️</span>}
              {tile.type === 'door' && <span className="text-sm">🚪</span>}
            </div>
          );
        })}

        {visibleNpcs.map(npc => {
          const screenX = (npc.position.x - viewportOffset.x) * TILE_SIZE;
          const screenY = (npc.position.y - viewportOffset.y) * TILE_SIZE;
          
          return (
            <div
              key={npc.id}
              className="absolute flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-10"
              style={{
                left: screenX,
                top: screenY,
                width: TILE_SIZE,
                height: TILE_SIZE,
              }}
              onClick={() => onNpcClick?.(npc)}
            >
              <span className="text-2xl">
                {NPC_SPRITES[npc.sprite] || '👤'}
              </span>
            </div>
          );
        })}

        <div
          className="absolute z-10 flex items-center justify-center transition-all duration-150"
          style={{
            left: playerScreenPos.x,
            top: playerScreenPos.y,
            width: TILE_SIZE,
            height: TILE_SIZE,
          }}
        >
          <span className="text-2xl animate-bounce">🐱</span>
        </div>
      </div>

      <div className="absolute bottom-2 right-2 z-20 bg-black/70 px-2 py-1 rounded text-white text-xs">
        ({playerPosition.x}, {playerPosition.y})
      </div>
    </div>
  );
}
