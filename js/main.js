//=========================================================================================//
//                                    Player Class                                         //  
//=========================================================================================//

class Player {
    hp = 100;
    mp = 100;
    maxHp = 100

    criticalChance = 0.05;
    missChance = 0.025;
    dodgeChance = 0.025;


    isDead = false;

    constructor() {

    }

    attack(target) {
        console.log ("the player attacks") 

        if(Math.random() < this.missChance) {
            console.log("Big Swing, No Ding")
            return
        }

        if(Math.random() < target.dodgeChance) {
            console.log(`The ${target.enemyName} evaded your attack`)
            return
        }

        let damageAmount = rollNumber(20, 5)

        if(Math.random() < this.criticalChance) {
            damageAmount *= 1.5
            console.log("You landed a critical hit")
        } 

        target.applyDamage(damageAmount);
    }
    defend() {

    }
    useSkill(skill) {

    }

    applyDamage(damageAmount) {
        //player's hp = enemy damage * a bunch of if's
        damageAmount = Math.round(damageAmount)

        this.hp -= damageAmount 
        this.hp = Math.max(0, this.hp)

        document.querySelector(".player_health").innerText = this.hp + "/" + this.maxHp;

        console.log(`The player takes ${damageAmount} damage, players health is now ${this.hp}` )

        if(this.hp <= 0) {
            this.isDead = true
            console.log("The Player perishes")
        }
    }    
}







//=========================================================================================//
//                                    Enemy Class                                          //
//=========================================================================================//

class Enemy {

    hp = 100
    maxHp = 100

    isDead = false;

    criticalChance = 0.05;
    missChance = 0.025;
    dodgeChance = 0.025;
    enemyName = "Enemy"

    constructor() {

    }


    attack(target) {
        console.log (`the ${this.enemyName} attacks`)

        if(Math.random() < this.missChance) {
            console.log("Big Swing, No Ding")
            return
        }

        if(Math.random() < target.dodgeChance) {
            console.log("The Player evaded your attack"/* replace player name with ${LOL} */)
            return
        }

        let damageAmount = rollNumber(20, 5)

        if(Math.random() < this.criticalChance) {
            damageAmount *= 1.5
            console.log(`The ${this.enemyName} landed a critical hit`)
        }

        target.applyDamage(damageAmount);
    }

    defend() {

    }
    useSkill(skill) {
        
    }

    applyDamage(damageAmount) {
        //player's hp = enemy damage * a bunch of if's
        damageAmount = Math.round(damageAmount)

        this.hp -= damageAmount 
        this.hp = Math.max(0, this.hp)

        document.querySelector(".enemy_health").innerText = this.hp + "/" + this.maxHp;
        
        console.log(`The ${this.enemyName} takes ${damageAmount} damage, ${this.enemyName} health is now ${this.hp}` )

        if(this.hp <= 0) {
            this.isDead = true
            console.log(`The ${this.enemyName} perishes`)
        }
    } 

}






//=========================================================================================//
//                              Other Player Turn Options                                  //          
//=========================================================================================//

let playerRun = function() {
    console.log("you are too useless")
}

let PlayerDefend = function() {
    console.log("you dont have legs, gotta earn em")
}

















//=========================================================================================//
//                                   Combat Class                                          // 
//=========================================================================================//

//track combabtants
//track tirn order
//handle combat turns
//handle combat beggining, end
class Combat {

    player;
    enemy;

    isEnded;

    whosTurn;

    constructor(player, enemy) {
        this.player = player;
        this.enemy = enemy;

        this.whosTurn = this.player;
    }

    endTurn() {
        //check to what is dead
        if(this.player.isDead) {
            this.isEnded = true;
        }
        if(this.enemy.isDead) {
            this.isEnded = true;
        }

        if(this.isEnded === true) {
            console.log("Combat Ends")
            return;
        }

        //set next turn
        if(this.whosTurn == this.player) {
            this.whosTurn = this.enemy
            console.log("Enemy's Turn")
            this.enemyAttack();
        } else {
            this.whosTurn = this.player
            console.log("Player's Turn")
        }
    }

    playerAttack = function() {
        if(this.isEnded) {
            return
        }
        this.player.attack(enemy);
        
        //done with code
        combat.endTurn();
    }

    enemyAttack = function() {
        enemy.attack(player);

        combat.endTurn();
    }

}








//=========================================================================================//
//                                      Initiate                                           //
//=========================================================================================//

const player = new Player();
const enemy = new Enemy();
const combat = new Combat(player, enemy);

enemy.enemyName = "Ogre"
document.querySelector(".enemy_name").innerText = enemy.enemyName;
















//=========================================================================================//
//                                   Common Functions                                      //
//=========================================================================================//

const rollNumber = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}