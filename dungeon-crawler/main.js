
const locations = ["town","shop","inn","bar","dungeon"];

//menu - town menus
//walk - walk in dungeon
//battle - battle menus
//inventory - inventory menu
//charselect - which character to use items/heal spell on

const states = ["menu","walk","battle","inventory","charselect", "boss"];

//different menus
const townMenu = ["Inn","Shop","Bar","Depart"]
const innMenu = ["Rest","Leave"]
const shopMenu = ["Potion", "MP Potion", "Leave"]
const barMenu = ["Old man", "Barkeep", "Bartender", "Leave"]
const battleMenu = ["Attack", "Magic", "Items"];
var attackMenu = [];
var targetMenu = [];
var magicMenu = [];
var itemMenu = [];

const items = ["H","M"]
//H is hp potion
//M is mp potion



facingSequence = ["up", "right", "down", "left"];

//MODEL
model = {
    facing: 0,
    visible: new Visible(),
    position: {x: 14, y: 6},
    encounterChance: 0,        //Increments to increase chance of an enemy encounter
	
	money: 100, //money player hasAttribute
	inventory: [], //inventory items
	inventoryLimit: 12, //inventory size
    characters: [new Character("Warrior", 20, 20, 10, 10, "", [new Attack("Slash", 7)], []), new Character("Mage", 16, 16, 22, 22, "", [new Attack("Smack", 4)], [new Spell("Fire", 9, 5)])],
	
    //For combat
    currentTurn: null,
    battleCycle: [],
    enemies: [],
    lost: false,
    clear: false,
    chosenAttack: null,
	
	state: states[0], //states control what arrows do, if they move character or change menu selection
	location: locations[0], //location controls what background is drawn
	menu: townMenu, //current menu, menus are arrays. state defines how its drawn later
	selected: 0, //index of selection on menu
	currLine: null, //current line of text to display
	combatLine: null //text lines for combat
}





//This function updates the visible object in the model everytime a new 'move' is made.
//Notice that this requires the map to have a 3 block 'buffer zone' around it to avoid going out of range.
function updateVisible () {
    if (model.facing == 0) {
        model.visible.leftD11 = {x: model.position.x - 1, y: model.position.y - 1}
        model.visible.leftD12 = {x: model.position.x - 2, y: model.position.y - 1}
        model.visible.leftD22 = {x: model.position.x - 2, y: model.position.y - 2}
        model.visible.rightD11 = {x: model.position.x - 1, y: model.position.y + 1}
        model.visible.rightD12 = {x: model.position.x - 2, y: model.position.y + 1}
        model.visible.rightD22 = {x: model.position.x - 2, y: model.position.y + 2}
        model.visible.centerD1 = {x: model.position.x - 1, y: model.position.y}
        model.visible.centerD2 = {x: model.position.x - 2, y: model.position.y}
        model.visible.centerD3 = {x: model.position.x - 3, y: model.position.y}
        model.visible.back = {x: model.position.x + 1, y: model.position.y}
    }
	
    else if (model.facing == 1) {
        model.visible.leftD11 = {x: model.position.x - 1, y: model.position.y + 1}
        model.visible.leftD12 = {x: model.position.x - 1, y: model.position.y + 2}
        model.visible.leftD22 = {x: model.position.x - 2, y: model.position.y + 2}
        model.visible.rightD11 = {x: model.position.x + 1, y: model.position.y + 1}
        model.visible.rightD12 = {x: model.position.x + 1, y: model.position.y + 2}
        model.visible.rightD22 = {x: model.position.x + 2, y: model.position.y + 2}
        model.visible.centerD1 = {x: model.position.x, y: model.position.y + 1}
        model.visible.centerD2 = {x: model.position.x, y: model.position.y + 2}
        model.visible.centerD3 = {x: model.position.x, y: model.position.y + 3}
        model.visible.back = {x: model.position.x, y: model.position.y - 1}

    }
    else if (model.facing == 3) {
        model.visible.leftD11 = {x: model.position.x + 1, y: model.position.y - 1}
        model.visible.leftD12 = {x: model.position.x + 1, y: model.position.y - 2}
        model.visible.leftD22 = {x: model.position.x + 2, y: model.position.y - 2}
        model.visible.rightD11 = {x: model.position.x - 1, y: model.position.y - 1}
        model.visible.rightD12 = {x: model.position.x - 1, y: model.position.y - 2}
        model.visible.rightD22 = {x: model.position.x - 2, y: model.position.y - 2}
        model.visible.centerD1 = {x: model.position.x, y: model.position.y - 1}
        model.visible.centerD2 = {x: model.position.x, y: model.position.y - 2}
        model.visible.centerD3 = {x: model.position.x, y: model.position.y - 3}
        model.visible.back = {x: model.position.x, y: model.position.y + 1}
    }
    else if (model.facing == 2) {
        model.visible.leftD11 = {x: model.position.x + 1, y: model.position.y + 1}
        model.visible.leftD12 = {x: model.position.x + 2, y: model.position.y + 1}
        model.visible.leftD22 = {x: model.position.x + 2, y: model.position.y + 2}
        model.visible.rightD11 = {x: model.position.x + 1, y: model.position.y - 1}
        model.visible.rightD12 = {x: model.position.x + 2, y: model.position.y - 1}
        model.visible.rightD22 = {x: model.position.x + 2, y: model.position.y - 2}
        model.visible.centerD1 = {x: model.position.x + 1, y: model.position.y}
        model.visible.centerD2 = {x: model.position.x + 2, y: model.position.y}
        model.visible.centerD3 = {x: model.position.x + 3, y: model.position.y}
        model.visible.back = {x: model.position.x - 1, y: model.position.y}

    }
	
}


//Updates the player position and facing direction based on user interaction
function updatePosition(direction) {
    if (direction == 'forward' && map[model.visible.centerD1.x][model.visible.centerD1.y] != "W") {
		
		if (map[model.visible.centerD1.x][model.visible.centerD1.y] == "E")
		{
			model.state = states[0]
			model.location = locations[0]
			model.facing = (model.facing + 2) % facingSequence.length 
			model.menu = townMenu
			//change to town 
			
			
			//change direction to face opposite of town for when you reenter the dungeon
			//code pending
		}
		else if (model.visible.centerD1.x == 4 && model.visible.centerD1.y == 7) { //Boss position
            model.combatLine = "Boss appears!";
            model.state = states[5];
            bossCombat();
        }
        else {
            model.position.x = model.visible.centerD1.x;
            model.position.y = model.visible.centerD1.y;
            model.encounterChance += 5;
            if (Math.floor(Math.random() * (100 - 0) + 0) < model.encounterChance) {
				model.combatLine = "Enemies appear!"
                model.encounterChance = 0;
                model.state = states[2];
                combat();
            }
		}
    }
    else if (direction == 'backward' && map[model.visible.back.x][model.visible.back.y] != "W") {
		
		if (map[model.visible.back.x][model.visible.back.y] == "E")
		{
			model.state = states[0]
			model.location = locations[0]
			model.menu = townMenu
			
			//change to town 
			
		
			//change direction to face opposite of town for when you reenter the dungeon
			//code pending
            
		}
		else {
            model.position.x = model.visible.back.x;
            model.position.y = model.visible.back.y;
            model.encounterChance += 5;
            if (Math.floor(Math.random() * (100 - 0) + 0) < model.encounterChance) {
				model.combatLine = "Enemies appear!"
                model.encounterChance = 0;
                model.state = states[2];
                combat();
            }
		}
    }
    else if (direction == 'left') {
        model.facing = model.facing - 1
        if (model.facing < 0) {
            model.facing = facingSequence.length - 1;
        }
    }
    else if (direction == 'right') {
        model.facing = (model.facing + 1) % facingSequence.length
    }
}

//Initiates combat by populating the field 
function combat() {
    model.menu = battleMenu;
    
    for (var i = 0; i < model.characters.length; i++) {
        if (model.characters[i].health > 0) {
            model.battleCycle.push(model.characters[i]);
        }
    }

    generateEnemies();

    for (var i = 0; i < model.enemies.length; i++) {
        model.battleCycle.push(model.enemies[i]);
    }

    model.currentTurn = 0;
    turn();

}

//Initiates boss by adding it to the field
function bossCombat() {
    model.menu = battleMenu;

    for (var i = 0; i < model.characters.length; i++) {
        if (model.characters[i].health > 0) {
            model.battleCycle.push(model.characters[i]);
        }
    }

    model.battleCycle.push(EnemyList[3]());

    model.currentTurn = 0;
    turn();

}

//Generates a set of up to two enemies using EnemyList as reference
function generateEnemies() {
    var enemyCount = Math.round(Math.random() * (3 - 2) + 2);
    for (var i = 1; i < enemyCount; i++) {
        var enemy = Math.round(Math.random() * (2 - 0) + 0);
        model.enemies.push(EnemyList[enemy]());
    }
}

//Counts how many friends are on the field
function friendlyCount() {
    var friends = 0;
    for (var i = 0; i < model.battleCycle.length; i++) {
        if (model.battleCycle[i] instanceof Character) {
            friends += 1;
        }
    }
    return friends;
}


function turn() {
    if (model.battleCycle[model.currentTurn] instanceof Enemy) {
        enemyTurn();
    }
}


//Takes health away from enemy or character. Stats are ignored for now.
function attack(target, attack) {
	model.combatLine = attack.name + "ed " + model.battleCycle[target].name + "! Took " + attack.power + " damage!";
    model.battleCycle[target].health = model.battleCycle[target].health - attack.power;
    if (model.battleCycle[target].health <= 0) {
        model.battleCycle[target].health = 0;
        model.battleCycle.splice(target, 1);
    }  
    model.currentTurn = (model.currentTurn + 1) % model.battleCycle.length;
    if (!enemiesStillAlive()) {
        if (model.state == 'boss') {
            model.clear = true;
        }
        model.battleCycle = [];
        model.enemies = [];
        model.state = states[1];
        model.money += Math.floor(Math.random() * 30)+ 10;
    }
    if (!alliesStillAlive()) {
        model.lost = true;
        model.battleCycle = [];
        model.enemies = [];
        model.state = states[1];
    }

    turn();
}

//Similar to attack, but with spells
function spell(target, spell) {
    if (model.battleCycle[model.currentTurn].magic > spell.cost) {
        model.battleCycle[target].health = model.battleCycle[target].health - spell.power;
	    model.combatLine = spell.name+" cast on "+model.battleCycle[target].name+"! Took "+spell.power+" damage!"
        model.battleCycle[model.currentTurn].magic = model.battleCycle[model.currentTurn].magic - spell.cost;
        if (model.battleCycle[target].health <= 0) {
            model.battleCycle[target].health = 0;
            model.battleCycle.splice(target, 1)
        }  
        model.currentTurn = (model.currentTurn + 1) % model.battleCycle.length;
        if (!enemiesStillAlive()) {
            if (model.state == 'boss') {
                model.clear = true;
            }
            model.battleCycle = [];
            model.enemies = [];
            model.state = states[1];
		    model.money += Math.floor(Math.random() * 30)+ 10;
        }
        if (!alliesStillAlive()) {
            model.lost = true;
        }
        turn();
    }
    else {
        model.combatLine = "Not enough MP!"
    }
}

//Item usage
function item(target, item) {
    if (item.includes('Potion')) {
        model.characters[target].health += 10;
        if (model.characters[target].health > model.characters[target].maxHealth) {model.characters[target].health = model.characters[target].maxHealth}
        model.combatLine = "Potion given to " + model.characters[target].name;
		model.inventory.splice(model.inventory.indexOf('H'), 1);
    }
    else if (item.includes('Elixir')) {
        model.characters[target].magic += 10;
        if (model.characters[target].magic > model.characters[target].maxMagic) {model.characters[target].magic= model.characters[target].maxMagic}
        model.combatLine = "Elixir given to " + model.characters[target].name;
		model.inventory.splice(model.inventory.indexOf('M'), 1);
    }
    if (model.state == 'battle') {
        model.currentTurn = (model.currentTurn + 1) % model.battleCycle.length;
        turn();
    }
}


//Adds Attack options to combat menu
function populateAttackMenu () {
    attackMenu = [];
    for (var i = 0; i < model.battleCycle[model.currentTurn].attacks.length; i++) {
        attackMenu.push(model.battleCycle[model.currentTurn].attacks[i].name);
    }
    attackMenu.push('Back');
}


//Adds Target options to combat menu
function populateTargetMenu(type) {
    targetMenu = [];
    if (type == 'attack') {
        for (var i = 0; i < model.battleCycle.length; i++) {
            if (model.battleCycle[i] instanceof Enemy) {
                targetMenu.push(model.battleCycle[i].name);
            }
        }
    }
    else {
        for (var i = 0; i < model.battleCycle.length; i++) {
            if (model.battleCycle[i] instanceof Character) {
                targetMenu.push(model.battleCycle[i].name);
            }
        }
    }
    targetMenu.push('Back');
}


//Adds Spell options to combat menu
function populateMagicMenu() {
    magicMenu = [];
    for (var i = 0; i < model.battleCycle[model.currentTurn].spells.length; i++) {
        magicMenu.push(model.battleCycle[model.currentTurn].spells[i].name);
    }
    magicMenu.push('Back');
}


//Adds Item options to combat menu
function populateItemMenu() {
    itemMenu = [];
    healthPotions = 0;
    magicPotions = 0;
    for (var i = 0; i < model.inventory.length; i++) {
        if (model.inventory[i] == "H") {
            healthPotions += 1;
        }
        else {
            magicPotions += 1;
        }
    }
    if (healthPotions != 0) {
        itemMenu.push("Potion x" + String(healthPotions));
    }
    if (magicPotions != 0) {
        itemMenu.push("Elixir x" + String(magicPotions));
    }
    itemMenu.push('Back');
}


//Targets a random character and attacks
function enemyTurn() {
    characterTargets = [];
    for (var i = 0; i < model.battleCycle.length; i++) {
        if (model.battleCycle[i] instanceof Character) {
            characterTargets.push(i);
        }
    }
    characterTarget = Math.round(Math.random() * (characterTargets[characterTargets.length - 1] - characterTargets[0]) + characterTargets[0]);

    //Could add randomized attack here, if there were more enemy attacks
    attack(characterTarget, model.battleCycle[model.currentTurn].attacks[0]);
}


function enemiesStillAlive() {
    for (var i = 0; i < model.battleCycle.length; i++) {
        if (model.battleCycle[i] instanceof Enemy) {
            return true;
        }
    }
    return false;
}
     
function alliesStillAlive() {
    for (var i = 0; i < model.characters.length; i++) {
        if (model.characters[i].health > 0) {
            return true;
        }
    }
    return false;
}

//MAP
var map = [["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "S", "S", "S", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "S", "S", "S", "W", "W", "W"],
            ["W", "W", "W", "S", "W", "W", "W", "S", "W", "W", "W", "W"],
            ["W", "W", "W", "S", "S", "S", "S", "S", "W", "W", "W", "W"],
            ["W", "W", "W", "S", "W", "S", "W", "W", "W", "W", "W", "W"], 
            ["W", "W", "W", "S", "W", "S", "W", "S", "W", "W", "W", "W"],
            ["W", "W", "W", "S", "W", "S", "S", "S", "W", "W", "W", "W"],
            ["W", "W", "W", "S", "W", "W", "S", "W", "W", "W", "W", "W"],
            ["W", "W", "W", "S", "S", "S", "S", "S", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "W", "S", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "W", "S", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "E", "S", "S", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
            ["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"]];
			
			

        


