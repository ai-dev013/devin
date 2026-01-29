# Cat Hero's Adventure - Action RPG Web Game

A complete action RPG web game built with React + TypeScript + Vite. The game features a cat protagonist who must defeat the Dark Dragon King to save the kingdom, inspired by Final Fantasy and Dragon Quest.

## Features

- Turn-based battle system with attack, magic, items, defend, and run options
- 5 explorable maps: Village, Forest, Cave, Mountain, Dark Castle
- 10 enemy types including 3 bosses (Dark Wolf, Dark Bear, Dragon)
- 14 magic spells, 7 weapons, 6 armor pieces, and various consumable items
- 4-chapter story with intro and ending sequences
- NPC interactions with shops and dialogue
- Character leveling system with stat growth
- BGM and sound effects support
- Keyboard controls (WASD/arrows for movement, Enter/Space for confirm, ESC for menu)

## Local Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ai-dev013/devin.git
cd devin/cat-rpg-game

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173` (or the next available port).

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## How to Play

### Controls

- **Movement**: WASD or Arrow keys
- **Confirm/Interact**: Enter or Space
- **Menu**: ESC
- **Cancel**: Backspace or ESC

### Game Flow

1. Start the game from the title screen
2. Watch the intro story
3. Explore the village, talk to NPCs, buy items from the shop
4. Exit to the forest and engage in battles
5. Defeat enemies to gain EXP and gold
6. Level up to become stronger
7. Progress through 4 chapters, defeating bosses along the way
8. Reach the Dark Castle and defeat the Dragon King to complete the game

### Tips

- Save your gold for better equipment
- Use healing items wisely in battle
- Learn magic spells as you level up
- Talk to NPCs for hints and story progression
- Defend when low on HP to reduce incoming damage

## Testing

The project includes comprehensive tests:

- **Unit Tests**: Game logic, combat calculations, leveling system
- **Integration Tests**: Inventory, equipment, combat, magic, shop systems
- **E2E Tests**: Complete game flow, chapter progression, data integrity

Run all tests with:

```bash
npm run test
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Vitest for testing
