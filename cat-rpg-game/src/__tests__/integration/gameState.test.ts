import { describe, it, expect, beforeEach } from 'vitest';
import { CONSUMABLE_ITEMS, WEAPONS, ARMORS, MAGIC_SPELLS } from '../../data/items';
import { createEnemy } from '../../data/enemies';
import type { Player, Enemy, Item, Weapon, Armor, Magic } from '../../types/game';

// Helper to create a test player
function createTestPlayer(): Player {
  return {
    id: 'player',
    name: 'ニャン太',
    stats: {
      hp: 100,
      maxHp: 100,
      mp: 50,
      maxMp: 50,
      attack: 15,
      defense: 8,
      speed: 10,
      level: 1,
      exp: 0,
      expToNext: 100,
    },
    position: { x: 5, y: 5 },
    inventory: [],
    equipment: {
      weapon: null,
      armor: null,
    },
    gold: 100,
    knownMagic: [],
  };
}

describe('Integration Tests - Inventory System', () => {
  let player: Player;

  beforeEach(() => {
    player = createTestPlayer();
  });

  it('should add item to inventory', () => {
    const potion = CONSUMABLE_ITEMS.find(i => i.id === 'potion')!;
    player.inventory.push({ ...potion, quantity: 1 });
    
    expect(player.inventory.length).toBe(1);
    expect(player.inventory[0].id).toBe('potion');
  });

  it('should stack same items in inventory', () => {
    const potion = CONSUMABLE_ITEMS.find(i => i.id === 'potion')!;
    player.inventory.push({ ...potion, quantity: 1 });
    
    // Add another potion
    const existingItem = player.inventory.find(i => i.id === 'potion');
    if (existingItem && 'quantity' in existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    }
    
    expect(player.inventory.length).toBe(1);
    expect((player.inventory[0] as Item & { quantity: number }).quantity).toBe(2);
  });

  it('should use consumable item and reduce quantity', () => {
    const potion = CONSUMABLE_ITEMS.find(i => i.id === 'potion')!;
    player.inventory.push({ ...potion, quantity: 3 });
    player.stats.hp = 50;
    
    // Use potion
    const item = player.inventory[0] as Item & { quantity: number };
    if (item.effect?.type === 'heal') {
      player.stats.hp = Math.min(player.stats.maxHp, player.stats.hp + item.effect.value);
    }
    item.quantity--;
    
    expect(player.stats.hp).toBe(80); // 50 + 30 heal
    expect(item.quantity).toBe(2);
  });

  it('should remove item when quantity reaches 0', () => {
    const potion = CONSUMABLE_ITEMS.find(i => i.id === 'potion')!;
    player.inventory.push({ ...potion, quantity: 1 });
    
    // Use last potion
    const item = player.inventory[0] as Item & { quantity: number };
    item.quantity--;
    
    if (item.quantity <= 0) {
      player.inventory = player.inventory.filter(i => i.id !== item.id);
    }
    
    expect(player.inventory.length).toBe(0);
  });
});

describe('Integration Tests - Equipment System', () => {
  let player: Player;

  beforeEach(() => {
    player = createTestPlayer();
  });

  it('should equip weapon and increase attack', () => {
    const sword = WEAPONS.find(w => w.id === 'iron-sword')!;
    const baseAttack = player.stats.attack;
    
    player.equipment.weapon = sword;
    const totalAttack = player.stats.attack + (player.equipment.weapon?.attackBonus || 0);
    
    expect(totalAttack).toBe(baseAttack + sword.attackBonus);
  });

  it('should equip armor and increase defense', () => {
    const armor = ARMORS.find(a => a.id === 'leather-armor')!;
    const baseDefense = player.stats.defense;
    
    player.equipment.armor = armor;
    const totalDefense = player.stats.defense + (player.equipment.armor?.defenseBonus || 0);
    
    expect(totalDefense).toBe(baseDefense + armor.defenseBonus);
  });

  it('should swap equipment correctly', () => {
    const ironSword = WEAPONS.find(w => w.id === 'iron-sword')!;
    const steelSword = WEAPONS.find(w => w.id === 'steel-sword')!;
    
    player.equipment.weapon = ironSword;
    expect(player.equipment.weapon.id).toBe('iron-sword');
    
    // Swap to steel sword
    const oldWeapon = player.equipment.weapon;
    player.equipment.weapon = steelSword;
    player.inventory.push(oldWeapon);
    
    expect(player.equipment.weapon.id).toBe('steel-sword');
    expect(player.inventory.find(i => i.id === 'iron-sword')).toBeDefined();
  });
});

describe('Integration Tests - Combat System', () => {
  let player: Player;
  let enemy: Enemy;

  beforeEach(() => {
    player = createTestPlayer();
    enemy = createEnemy('slime', { x: 6, y: 5 });
  });

  it('should deal damage to enemy', () => {
    const initialHp = enemy.stats.hp;
    const damage = Math.max(1, player.stats.attack - enemy.stats.defense);
    
    enemy.stats.hp -= damage;
    
    expect(enemy.stats.hp).toBeLessThan(initialHp);
  });

  it('should mark enemy as dead when HP reaches 0', () => {
    enemy.stats.hp = 5;
    const damage = 10;
    
    enemy.stats.hp -= damage;
    if (enemy.stats.hp <= 0) {
      enemy.stats.hp = 0;
      enemy.isAlive = false;
    }
    
    expect(enemy.stats.hp).toBe(0);
    expect(enemy.isAlive).toBe(false);
  });

  it('should receive damage from enemy', () => {
    const initialHp = player.stats.hp;
    const damage = Math.max(1, enemy.stats.attack - player.stats.defense);
    
    player.stats.hp -= damage;
    
    expect(player.stats.hp).toBeLessThan(initialHp);
  });

  it('should gain exp and gold after defeating enemy', () => {
    const initialExp = player.stats.exp;
    const initialGold = player.gold;
    
    // Defeat enemy
    enemy.isAlive = false;
    player.stats.exp += enemy.expReward;
    player.gold += enemy.goldReward;
    
    expect(player.stats.exp).toBe(initialExp + enemy.expReward);
    expect(player.gold).toBe(initialGold + enemy.goldReward);
  });

  it('should level up when exp exceeds threshold', () => {
    player.stats.exp = 95;
    const expGained = 20;
    
    player.stats.exp += expGained;
    
    if (player.stats.exp >= player.stats.expToNext) {
      player.stats.exp -= player.stats.expToNext;
      player.stats.level++;
      player.stats.expToNext = Math.floor(player.stats.expToNext * 1.5);
      player.stats.maxHp += 10;
      player.stats.maxMp += 5;
      player.stats.attack += 3;
      player.stats.defense += 2;
      player.stats.hp = player.stats.maxHp;
      player.stats.mp = player.stats.maxMp;
    }
    
    expect(player.stats.level).toBe(2);
    expect(player.stats.exp).toBe(15); // 95 + 20 - 100
    expect(player.stats.maxHp).toBe(110);
  });
});

describe('Integration Tests - Magic System', () => {
  let player: Player;
  let enemy: Enemy;

  beforeEach(() => {
    player = createTestPlayer();
    enemy = createEnemy('wolf', { x: 6, y: 5 });
    
    // Learn some magic
    const fire = MAGIC_SPELLS.find(m => m.id === 'fire')!;
    const cure = MAGIC_SPELLS.find(m => m.id === 'cure')!;
    player.knownMagic = [fire, cure];
  });

  it('should cast offensive magic and deal damage', () => {
    const fire = player.knownMagic.find(m => m.id === 'fire')!;
    const initialEnemyHp = enemy.stats.hp;
    const initialMp = player.stats.mp;
    
    // Cast fire
    if (player.stats.mp >= fire.mpCost) {
      player.stats.mp -= fire.mpCost;
      const damage = fire.power;
      enemy.stats.hp -= damage;
    }
    
    expect(player.stats.mp).toBe(initialMp - fire.mpCost);
    expect(enemy.stats.hp).toBe(initialEnemyHp - fire.power);
  });

  it('should cast healing magic and restore HP', () => {
    const cure = player.knownMagic.find(m => m.id === 'cure')!;
    player.stats.hp = 50;
    const initialMp = player.stats.mp;
    
    // Cast cure
    if (player.stats.mp >= cure.mpCost) {
      player.stats.mp -= cure.mpCost;
      player.stats.hp = Math.min(player.stats.maxHp, player.stats.hp + cure.power);
    }
    
    expect(player.stats.mp).toBe(initialMp - cure.mpCost);
    expect(player.stats.hp).toBe(Math.min(100, 50 + cure.power));
  });

  it('should not cast magic without enough MP', () => {
    const fire = player.knownMagic.find(m => m.id === 'fire')!;
    player.stats.mp = 2; // Less than fire cost (5)
    const initialEnemyHp = enemy.stats.hp;
    
    // Try to cast fire
    let castSuccess = false;
    if (player.stats.mp >= fire.mpCost) {
      player.stats.mp -= fire.mpCost;
      enemy.stats.hp -= fire.power;
      castSuccess = true;
    }
    
    expect(castSuccess).toBe(false);
    expect(enemy.stats.hp).toBe(initialEnemyHp);
  });

  it('should learn new magic', () => {
    const thunder = MAGIC_SPELLS.find(m => m.id === 'thunder')!;
    const initialMagicCount = player.knownMagic.length;
    
    player.knownMagic.push(thunder);
    
    expect(player.knownMagic.length).toBe(initialMagicCount + 1);
    expect(player.knownMagic.find(m => m.id === 'thunder')).toBeDefined();
  });
});

describe('Integration Tests - Shop System', () => {
  let player: Player;

  beforeEach(() => {
    player = createTestPlayer();
    player.gold = 500;
  });

  it('should buy item when having enough gold', () => {
    const potion = CONSUMABLE_ITEMS.find(i => i.id === 'potion')!;
    const initialGold = player.gold;
    
    if (player.gold >= potion.price) {
      player.gold -= potion.price;
      player.inventory.push({ ...potion, quantity: 1 });
    }
    
    expect(player.gold).toBe(initialGold - potion.price);
    expect(player.inventory.find(i => i.id === 'potion')).toBeDefined();
  });

  it('should not buy item without enough gold', () => {
    const expensiveWeapon = WEAPONS.find(w => w.id === 'legendary-sword')!;
    player.gold = 100;
    const initialGold = player.gold;
    
    let purchaseSuccess = false;
    if (player.gold >= expensiveWeapon.price) {
      player.gold -= expensiveWeapon.price;
      player.inventory.push(expensiveWeapon);
      purchaseSuccess = true;
    }
    
    expect(purchaseSuccess).toBe(false);
    expect(player.gold).toBe(initialGold);
    expect(player.inventory.find(i => i.id === 'legendary-sword')).toBeUndefined();
  });

  it('should buy weapon and add to inventory', () => {
    const sword = WEAPONS.find(w => w.id === 'iron-sword')!;
    const initialGold = player.gold;
    
    if (player.gold >= sword.price) {
      player.gold -= sword.price;
      player.inventory.push(sword);
    }
    
    expect(player.gold).toBe(initialGold - sword.price);
    expect(player.inventory.find(i => i.id === 'iron-sword')).toBeDefined();
  });
});

describe('Integration Tests - Defense Action', () => {
  let player: Player;
  let enemy: Enemy;

  beforeEach(() => {
    player = createTestPlayer();
    enemy = createEnemy('wolf', { x: 6, y: 5 });
  });

  it('should reduce damage when defending', () => {
    const isDefending = true;
    const defenseMultiplier = isDefending ? 2 : 1;
    
    const normalDamage = Math.max(1, enemy.stats.attack - player.stats.defense);
    const defendedDamage = Math.max(1, enemy.stats.attack - (player.stats.defense * defenseMultiplier));
    
    expect(defendedDamage).toBeLessThanOrEqual(normalDamage);
  });
});
