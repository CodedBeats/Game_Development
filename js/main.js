//=========================================================================================//
//                                    Player Class                                         //  
//=========================================================================================//

class Player {
    name = "Player";
    hp = 100;
    mp = 100;
    maxHp = 100

    criticalChance = 0.05;
    missChance = 0.025;
    dodgeChance = 0.025;

    statsEffects = {};


    isDead = false;

    constructor(name) {
        this.name = name;
    }


    updateDOM() {
        let hpPercent = (this.hp * 100) / this.maxHp;

        if(hpPercent >= 50) {
            document.querySelector(".player-health").setAttribute("style","background-color: green");
        } else if(hpPercent >= 25) {
            document.querySelector(".player-health").setAttribute("style","background-color: orange");
        } else if(hpPercent >= 10) {
            document.querySelector(".player-health").setAttribute("style","background-color: red");
        }

        document.querySelector(".player-health").innerText = this.hp + "/" + this.maxHp;
    }

    attack(target) {
        combatLog (`${this.name} attacks`) 

        if(Math.random() < this.missChance) {
            combatLog("Big Swing, No Ding")
            return
        }

        if(Math.random() < target.dodgeChance) {
            combatLog(`The ${target.name} evaded your attack`)
            return
        }

        let damageAmount = rollNumber(20, 5)

        if(Math.random() < this.criticalChance) {
            damageAmount *= 1.5
            combatLog("You landed a critical hit")
        } 

        target.applyDamage(damageAmount);
    }


    defend() {
        combatLog (`${this.name} defends`)

        this.statsEffects.defending = true;
    }


    useSkill(skill) {

    }

    applyDamage(damageAmount) {
        //player's hp = enemy damage * a bunch of if's
        damageAmount = Math.round(damageAmount)

        this.hp -= damageAmount 
        this.hp = Math.max(0, this.hp)

        this.updateDOM()

        const hpPercent = (this.hp * 100) / this.maxHp;

        combatLog(`The player takes ${damageAmount} damage, players health is now ${this.hp}` )

        if(this.hp <= 0) {
            this.isDead = true
            combatLog(`${this.name} perishes`)
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
    dmgMax = 20;
    dmgMin = 1;
    name = "Enemy"

    statsEffects = {};

    isWindingUp = false;
    windUpTarget = null;

    constructor(name, hp, dmgMin, dmgMax) {
        this.name = name;
        this.hp = hp;
        this.dmgMin = dmgMin;
        this.dmgMax = dmgMax;
 
    }

    updateDOM() {
        const hpPercent = (this.hp * 100) / this.maxHp;

        if(hpPercent >= 50) {
            document.querySelector("#enemy-stats").setAttribute("style","background-color: green");
        } else if(hpPercent >= 10) {
            document.querySelector("#enemy-stats").setAttribute("style","background-color: orange");
        } else {
            document.querySelector("#enemy-stats").setAttribute("style","background-color: red");
        }

        document.querySelector("#enemy-stats").innerText = this.hp + "/" + this.maxHp;
    }

    
    slowPunch(target) {
        if(this.isWindingUp == false) {
            this.isWindingUp = true;
            this.windUpTarget = target;
            combatLog(`${this.name} is winding up`)
            return
        }
        this.isWindingUp = false;
        let damageAmount = this.windUpTarget.maxHp / 3;
        this.windUpTarget.applyDamage(damageAmount);
        combatLog(`${this.name} deliveres a powerful blow of `)
    }


    attack(target) {
        combatLog (`the ${this.name} attacks`)

        if(Math.random() < this.missChance) {
            combatLog("Big Swing, No Ding")
            return
        }

        if(Math.random() < target.dodgeChance) {
            combatLog(`${this.name} evaded your attack`/* replace player name with ${LOL} */)
            return
        }

        let damageAmount = rollNumber(this.dmgMax, this.dmgMin)

        if(Math.random() < this.criticalChance) {
            damageAmount *= 1.5
            combatLog(`The ${this.name} landed a critical hit`)
        }

        target.applyDamage(damageAmount);
    }


    defend() {
        combatLog (`the ${this.name} defends`)

        this.statsEffects.defending = true;
    }


    useSkill(skill) {
        
    }

    applyDamage(damageAmount) {
        if(this.statsEffects.defending == true) {
            damageAmount *= 0.6;
        }

        damageAmount = Math.round(damageAmount)
        this.hp -= damageAmount 
        this.hp = Math.max(0, this.hp)

        this.updateDOM()
        
        combatLog(`The ${this.name} takes ${damageAmount} damage, ${this.name} health is now ${this.hp}` )

        if(this.hp <= 0) {
            this.isDead = true
            combatLog(`The ${this.name} perishes`)
        }
    } 

}






//=========================================================================================//
//                              Other Player Turn Options                                  //          
//=========================================================================================//

let playerRun = function() {
    combatLog("you are too useless")
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
            combatLog("Combat Ends")
            return;
        }

        //set next turn
        if(this.whosTurn == this.player) {
            this.whosTurn = this.enemy
            combatLog("Enemy's Turn")
            this.enemyTurn();
        } else {
            this.whosTurn = this.player
            combatLog(`${this.player.name}'s Turn`)
            this.playerTurn();
        }
    }

    playerTurn = function(action) {
        if(this.isEnded == true) {
            return
        }

        if(action == "attack") {
            this.player.attack(enemy);
        } 
        else if(action == "defend") {
            this.player.defend();
        }
        
        
        //done with code
        combat.endTurn();
    }

//                                             Enemy Turn
    enemyTurn = function() {
        if(this.enemy.isWindingUp = true) {
            enemy.slowPunch()
            combat.endTurn();
            return
        } 
        let slowPunchChance = math.Random() < 0.2;
        if(slowPunchChance == true) {
            enemy.slowPunch(player);
        } 
        else if(this.enemy.hp < 30) {
            enemy.defend(player);
        } else {
            enemy.attack(player);
        }
        
        combat.endTurn();
    }

}



 




//=========================================================================================//
//                                      Initiate                                           //
//=========================================================================================//

const player = new Player("Mr Kool");
const enemy = new Enemy("Kobold", 100, 1, 20, 10);
const combat = new Combat(player, enemy);

document.querySelector("#enemy-name").innerText = enemy.name;
















//=========================================================================================//
//                                   Common Functions                                      //
//=========================================================================================//

const rollNumber = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

const combatLog = function(logText) {
    console.log(logText)
    //  document.querySelector("#log-output").innerHTML += logText + "<br>";
    document.querySelector("#log-output").innerHTML = logText + "<br>" + document.querySelector("#log-output").innerHTML 
}











//=========================================================================================//
//          Test            Test           Test             Test             Test          //
//=========================================================================================//


