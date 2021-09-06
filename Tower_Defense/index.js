//====================== Set Up Canvas ======================//
const canvas = document.getElementById("canvas1");
// ctx means context
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;



//====================== Global Variables ======================//
const cellSize = 100;
const cellGap = 3;
let enemiesInterval = 600;
let resourcesCount = 300; // initial given resource or money amount
let frame = 0;
let gameOver = false; 
let score = 0;
const winningScore = 10;

const gameGrid = [];
const defenders = [];
const enemies = [];
const enemyPositions = [];
const projectiles = [];
const resources = [];




//====================== Mouse ======================//
// x and y as coordinates
const mouse = {
    x: 10, 
    y: 10,
    width: 0.1,
    height: 0.1,
}
let canvasPostion = canvas.getBoundingClientRect();
// e = event
canvas.addEventListener("mousemove", function(e) {
    mouse.x = e.x - canvasPostion.left;
    mouse.y = e.y - canvasPostion.top;
});
canvas.addEventListener("mouseleave", function() {
    mouse.x = undefined;
    mouse.y = undefined;
})
// console.log(canvasPostion);



//====================== Game Board ======================//
const gameControlsBar = {
    width: canvas.width,
    height: cellSize,
}
class Cell {
    // x and y as coordinates
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw() {
        if (mouse.x && mouse.y && collision(this, mouse)) {
            ctx.strokeStyle = "black";
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

function createGrid() {
    for (let y = cellSize; y < canvas.height; y += cellSize) {
        for (let x = 0; x < canvas.width; x += cellSize) {
            gameGrid.push(new Cell(x, y));
        }
    }
}
createGrid();

function handleGameGrid() {
    for (let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw();
    }
}
// console.log(gameGrid)




//====================== Projectiles ======================//
class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.power = 20;
        this.speed = 5;
    }
    update() {
        this.x += this.speed;
    }
    draw() {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2); // to create a circle
        ctx.fill();
    }
}

function handleProjectiles() {
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].update();
        projectiles[i].draw();

        for (let j = 0; j < enemies.length; j++) {
            // if projectile hit enemy
            if (enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])) {
                enemies[j].health -= projectiles[i].power; // enemy's health gets deducted by projectile's power value
                projectiles.splice(i, 1); // remove 1 element at this index (projectile disperses)
                i--; // this makes sure the next element in the array doesn't get skipped
            }
        }

        // check if projectile has reached right side of screen but gives enemy chance to come 1 grid cell in
        if (projectiles[i] && projectiles[i].x > canvas.width - cellSize) {
            projectiles.splice(i, 1); // remove 1 element at this index (projectile disperses)
            i--; // this makes sure the next element in the array doesn't get skipped
        }
        // console.log(`Projectiles ${projectiles.length}`)
    }
}






//====================== Defenders ======================//
// class for creating new "defender" or "tower"
class Defender {
    // x and y as coordinates
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.shooting = false; // default state
        this.health = 100; // starting health
        this.projectiles = [];
        this.timer = 0;
    }
    draw() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "gold";
        ctx.font = "30px Orbitron";
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30); // health wrapped in Math.floor() so we only use whole numbers
    }
    update() {
        if (this.shooting == true) {
            this.timer++;
            if (this.timer % 100 === 0) {
                projectiles.push(new Projectile(this.x + 70, this.y + 50));
            }
        } else {
            this.timer = 0;
        }
    }
}

// snapping the placement to the closest grid space to the left
canvas.addEventListener("click", function() {
    // "%" (modulas) is an operator that returns the remainder if these 2 were divided (/)
    const gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap;
    const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
    if (gridPositionY < cellSize) { return }
    for (let i = 0; i < defenders.length; i++) {
        if (defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) { return }
    }
    let defenderCost = 100;
    if (resourcesCount >= defenderCost) {
        defenders.push(new Defender(gridPositionX, gridPositionY));
        resourcesCount -= defenderCost;
    }
});

function handleDefenders() {
    for (let i = 0; i < defenders.length; i++) {
        defenders[i].draw();
        defenders[i].update();

        // check to see if an enemy is in the defender's row, if so, shoot
        if (enemyPositions.indexOf(defenders[i].y) !== -1) {
            defenders[i].shooting = true;
        } else {
            defenders[i].shooting = false;
        }

        for (let j = 0; j < defenders.length; j++) {
            // check if an enemy has reached a defender
            if (defenders[i] && collision(defenders[i], enemies[j])) {
                enemies[j].movement = 0; // enemy stops moving
                defenders[i].health -= 0.2; // defender gets gradually damaged by enemy
            }
            // if defender is dead
            if (defenders[i] && defenders[i].health <= 0) {
                defenders.splice(i, 1); // remove 1 element at this index
                i--; // this makes sure the next element in the array doesn't get skipped
                enemies[j].movement = enemies[j].speed;
            }
        }
    }
}







//====================== Enemies ======================//
// class for creating new enemies
class Enemy {
    constructor(verticalPosition) {
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.speed = Math.random() * 0.2 + 0.4;
        this.movement = this.speed;
        this.health = 100;
        this.maxHealth = this.health; // this is defined twice because the damage needs to be stored by changing reducing health, helps with rewarding resources  
    }
    update() {
        this.x -= this.movement;
    }
    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.font = "30px Orbitron";
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30); // health wrapped in Math.floor() so we only use whole numbers
    }
}

function handleEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i].x < 0) {
            gameOver = true;
        }
        // check if enemy's health has reached 0 (damaged by projectiles)
        if (enemies[i].health <= 0) {
            let gainedResources = enemies[i].maxHealth / 10;
            resourcesCount += gainedResources; // rewards the player with resources for each vanquished foe
            score += gainedResources;
            const findThisIndex = enemyPositions.indexOf(enemies[i].y);
            enemyPositions.splice(findThisIndex, 1);
            enemies.splice(i, 1); // remove 1 element at this index
            i--; // this makes sure the next element in the array doesn't get skipped
            // console.log(enemyPositions)
        }
    }
    if (frame % enemiesInterval === 0 && score < winningScore) {
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap; // place enemies on their rows
        enemies.push(new Enemy(verticalPosition));
        enemyPositions.push(verticalPosition);
        if (enemiesInterval > 120) {enemiesInterval -= 50 } // speeds up the enemy spawn rate as time goes on
        // console.log(enemyPositions)
    }
}







//====================== Recources ======================//
const amounts = [20, 30, 40];
class Resource {
    constructor() {
        this.x = Math.random() * (canvas.width - cellSize);
        this.y = (Math.floor(Math.random() * 5) + 1) * cellSize + 25;
        this.width = cellSize * 0.6;
        this.height = cellSize * 0.6;
        this.amount = amounts[Math.floor(Math.random() * amounts.length)];
    }
    draw() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.font = "20px Orbitron";
        ctx.fillText(this.amount, this.x + 15, this.y + 25);
    }
}

function handleResources() {
    if (frame % 500 === 0 && score < winningScore) {
        resources.push(new Resource());
    }
    for (let i = 0; i < resources.length; i++) {
        resources[i].draw();

        if (resources[i] && mouse.x && mouse.y && collision(resources[i], mouse)) {
            resourcesCount += resources[i].amount;
            resources.splice(i, 1);
            i--;
        }
    }
}







//====================== Utilities ======================//
function handleGameSatus() {
    ctx.fillStyle = "gold";
    ctx.font = "30px Orbitron";
    ctx.fillText(`Score: ${score}`, 20, 40);
    ctx.fillText(`Resources: ${resourcesCount}`, 20, 80);
    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "90px Orbitron";
        ctx.fillText("GAME OVER", 135, 330);
    }
    if (score >= winningScore && enemies.length === 0) {
        ctx.fillStyle = "black";
        ctx.font = "70px Orbitron";
        ctx.fillText("LEVEL COMPLETE", 130, 300);
        ctx.font = "30px Orbitron";
        ctx.fillText(`YOU WIN, \n with ${score} points!`, 134, 340);
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, gameControlsBar.width, gameControlsBar.height);
    handleGameGrid();
    handleDefenders();
    handleResources();
    handleProjectiles();
    handleEnemies();
    handleGameSatus();
    frame++;
    // console.log(frame)
    if (!gameOver) { requestAnimationFrame(animate) };
}
animate();

//trying to see if a collision is true
function collision(first, second) {
    if (    !(  first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y)
    ) {
        return true;
    };
};

window.addEventListener("resize", function() {
    canvasPostion = canvas.getBoundingClientRect();
})