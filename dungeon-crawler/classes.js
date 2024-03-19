class Character {
    constructor(name, health, maxHealth, magic, maxMagic, source, attacks, spells) {
        this.name = name;
        this.health = health;   //Int
        this.maxHealth = maxHealth; //Int
        this.magic = magic;     //Int
        this.maxMagic = maxMagic; //Int
        this.source = source;   //String
        this.attacks = attacks; //Array
        this.spells = spells;   //Array
    }
}

class Attack {
    constructor (name, power) {
        this.name = name;       //String
        this.power = power;     //Int
    }
}

class Spell {
    constructor (name, power, cost) {
        this.name = name;       //String
        this.power = power;     //Int
        this.cost = cost;       //Int
    }
}

class Enemy {
    constructor (name, health, source, attacks) {
        this.name = name;       //String 
        this.health = health;   //Int
        this.source = source;   //String
        this.attacks = attacks; //Array
    }
}

//Used to know what is visible to the player
class Visible {
    constructor () {
        this.leftD11 = null;  
        this.leftD12 = null; 
        this.leftD22 = null;  
        this.rightD11 = null; 
        this.rightD12 = null; 
        this.rightD22 = null; 
        this.centerD1 = null; 
        this.centerD2 = null; 
        this.centerD3 = null; 
        this.back = null;
    }
}




const EnemyList = [
    () => new Enemy(
        "Goblin",
        10,
        "",
        [new Attack("Smash", 5)]
    ),
    
    () => new Enemy(
        "Undead",
        12,
        "",
        [new Attack("Punch", 6)]
    ),

    () => new Enemy(
        "Dragon",
        15,
        "",
        [new Attack("Fire", 8)]
    ),

    () => new Enemy(
        "Boss",
        25,
        "",
        [new Attack("Slash", 7), new Attack("Smash", 5)]
    )
]

