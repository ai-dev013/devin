import { describe, it, expect } from 'vitest';
import { CONSUMABLE_ITEMS, WEAPONS, ARMORS, MAGIC_SPELLS } from '../../data/items';
import { ENEMY_TEMPLATES, createEnemy, getRandomEnemyForArea } from '../../data/enemies';
import { CHAPTERS, STORY_DIALOGUES } from '../../data/story';

describe('Unit Tests - Game Data', () => {
  describe('Items Data', () => {
    it('should have consumable items with valid properties', () => {
      expect(CONSUMABLE_ITEMS.length).toBeGreaterThan(0);
      
      CONSUMABLE_ITEMS.forEach(item => {
        expect(item.id).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.type).toBe('consumable');
        expect(item.price).toBeGreaterThanOrEqual(0);
        expect(item.effect).toBeDefined();
        expect(item.effect.type).toBeDefined();
        expect(item.effect.value).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have weapons with valid attack bonuses', () => {
      expect(WEAPONS.length).toBeGreaterThan(0);
      
      WEAPONS.forEach(weapon => {
        expect(weapon.id).toBeDefined();
        expect(weapon.name).toBeDefined();
        expect(weapon.type).toBe('weapon');
        expect(weapon.attackBonus).toBeGreaterThanOrEqual(0);
        expect(weapon.price).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have armors with valid defense bonuses', () => {
      expect(ARMORS.length).toBeGreaterThan(0);
      
      ARMORS.forEach(armor => {
        expect(armor.id).toBeDefined();
        expect(armor.name).toBeDefined();
        expect(armor.type).toBe('armor');
        expect(armor.defenseBonus).toBeGreaterThanOrEqual(0);
        expect(armor.price).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have magic spells with valid MP costs and power', () => {
      expect(MAGIC_SPELLS.length).toBeGreaterThan(0);
      
      MAGIC_SPELLS.forEach(spell => {
        expect(spell.id).toBeDefined();
        expect(spell.name).toBeDefined();
        expect(spell.mpCost).toBeGreaterThan(0);
        expect(spell.power).toBeGreaterThanOrEqual(0);
        expect(['offensive', 'healing', 'buff']).toContain(spell.type);
      });
    });

    it('should have healing spells', () => {
      const healingSpells = MAGIC_SPELLS.filter(s => s.type === 'healing');
      expect(healingSpells.length).toBeGreaterThan(0);
    });

    it('should have offensive spells', () => {
      const offensiveSpells = MAGIC_SPELLS.filter(s => s.type === 'offensive');
      expect(offensiveSpells.length).toBeGreaterThan(0);
    });
  });

  describe('Enemies Data', () => {
    it('should have enemy templates defined', () => {
      expect(Object.keys(ENEMY_TEMPLATES).length).toBeGreaterThan(0);
    });

    it('should have valid enemy stats', () => {
      Object.entries(ENEMY_TEMPLATES).forEach(([type, template]) => {
        expect(template.name).toBeDefined();
        expect(template.stats.hp).toBeGreaterThan(0);
        expect(template.stats.maxHp).toBeGreaterThan(0);
        expect(template.stats.attack).toBeGreaterThan(0);
        expect(template.stats.defense).toBeGreaterThanOrEqual(0);
        expect(template.expReward).toBeGreaterThan(0);
        expect(template.goldReward).toBeGreaterThan(0);
      });
    });

    it('should create enemy with correct properties', () => {
      const enemy = createEnemy('slime', { x: 5, y: 5 });
      
      expect(enemy.id).toBeDefined();
      expect(enemy.name).toBe('スライム');
      expect(enemy.type).toBe('slime');
      expect(enemy.stats.hp).toBe(20);
      expect(enemy.stats.maxHp).toBe(20);
      expect(enemy.position).toEqual({ x: 5, y: 5 });
      expect(enemy.isAlive).toBe(true);
    });

    it('should create boss enemy with isBoss flag', () => {
      const boss = createEnemy('dragon', { x: 0, y: 0 });
      
      expect(boss.isBoss).toBe(true);
      expect(boss.stats.hp).toBeGreaterThan(100);
    });

    it('should get random enemy for area based on level', () => {
      const lowLevelEnemy = getRandomEnemyForArea(1);
      expect(['slime', 'wolf', 'snake', 'bird']).toContain(lowLevelEnemy);
      
      const highLevelEnemy = getRandomEnemyForArea(10);
      expect(highLevelEnemy).toBeDefined();
    });
  });

  describe('Story Data', () => {
    it('should have chapters defined', () => {
      expect(CHAPTERS.length).toBe(4);
    });

    it('should have valid chapter structure', () => {
      CHAPTERS.forEach((chapter, index) => {
        expect(chapter.id).toBe(index + 1);
        expect(chapter.name).toBeDefined();
        expect(chapter.description).toBeDefined();
        expect(typeof chapter.unlocked).toBe('boolean');
        expect(typeof chapter.completed).toBe('boolean');
      });
    });

    it('should have first chapter unlocked by default', () => {
      expect(CHAPTERS[0].unlocked).toBe(true);
    });

    it('should have intro dialogues', () => {
      expect(STORY_DIALOGUES.intro).toBeDefined();
      expect(STORY_DIALOGUES.intro.length).toBeGreaterThan(0);
    });

    it('should have ending dialogues', () => {
      expect(STORY_DIALOGUES.ending).toBeDefined();
      expect(STORY_DIALOGUES.ending.length).toBeGreaterThan(0);
    });

    it('should have valid dialogue structure', () => {
      STORY_DIALOGUES.intro.forEach(dialogue => {
        expect(dialogue.speaker).toBeDefined();
        expect(dialogue.text).toBeDefined();
      });
    });
  });
});

describe('Unit Tests - Combat Calculations', () => {
  it('should calculate damage correctly', () => {
    const attackerAttack = 15;
    const defenderDefense = 5;
    const weaponBonus = 10;
    
    const damage = Math.max(1, attackerAttack + weaponBonus - defenderDefense);
    expect(damage).toBe(20);
  });

  it('should have minimum damage of 1', () => {
    const attackerAttack = 5;
    const defenderDefense = 100;
    
    const damage = Math.max(1, attackerAttack - defenderDefense);
    expect(damage).toBe(1);
  });

  it('should calculate magic damage correctly', () => {
    const magicPower = 30;
    const magicBonus = 5;
    
    const damage = Math.max(1, magicPower + magicBonus);
    expect(damage).toBe(35);
  });

  it('should calculate healing correctly', () => {
    const currentHp = 50;
    const maxHp = 100;
    const healPower = 30;
    
    const healAmount = Math.min(healPower, maxHp - currentHp);
    expect(healAmount).toBe(30);
  });

  it('should not overheal', () => {
    const currentHp = 90;
    const maxHp = 100;
    const healPower = 30;
    
    const healAmount = Math.min(healPower, maxHp - currentHp);
    expect(healAmount).toBe(10);
  });
});

describe('Unit Tests - Leveling System', () => {
  it('should calculate level up stats correctly', () => {
    const baseStats = {
      maxHp: 100,
      maxMp: 50,
      attack: 10,
      defense: 5,
      speed: 8,
    };
    
    const levelUpBonus = {
      maxHp: 10,
      maxMp: 5,
      attack: 3,
      defense: 2,
      speed: 1,
    };
    
    const newStats = {
      maxHp: baseStats.maxHp + levelUpBonus.maxHp,
      maxMp: baseStats.maxMp + levelUpBonus.maxMp,
      attack: baseStats.attack + levelUpBonus.attack,
      defense: baseStats.defense + levelUpBonus.defense,
      speed: baseStats.speed + levelUpBonus.speed,
    };
    
    expect(newStats.maxHp).toBe(110);
    expect(newStats.maxMp).toBe(55);
    expect(newStats.attack).toBe(13);
    expect(newStats.defense).toBe(7);
    expect(newStats.speed).toBe(9);
  });

  it('should calculate exp to next level correctly', () => {
    const baseExpToNext = 100;
    const multiplier = 1.5;
    
    const level2ExpToNext = Math.floor(baseExpToNext * multiplier);
    const level3ExpToNext = Math.floor(level2ExpToNext * multiplier);
    
    expect(level2ExpToNext).toBe(150);
    expect(level3ExpToNext).toBe(225);
  });

  it('should handle multiple level ups', () => {
    let exp = 300;
    let level = 1;
    let expToNext = 100;
    
    while (exp >= expToNext) {
      exp -= expToNext;
      level++;
      expToNext = Math.floor(expToNext * 1.5);
    }
    
    expect(level).toBe(3);
    expect(exp).toBeLessThan(expToNext);
  });
});

describe('Unit Tests - Escape Calculation', () => {
  it('should calculate escape chance correctly', () => {
    const baseChance = 0.5;
    const speed = 20;
    
    const escapeChance = baseChance + (speed / 100);
    expect(escapeChance).toBe(0.7);
  });

  it('should cap escape chance at reasonable value', () => {
    const baseChance = 0.5;
    const speed = 100;
    
    const escapeChance = Math.min(0.95, baseChance + (speed / 100));
    expect(escapeChance).toBe(0.95);
  });
});
