//====================== Set Up Canvas ======================//
const canvas = document.getElementById("canvas1");
// ctx = context
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;



//====================== Global Variables ======================//
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];
const defenders = [];
const enemies = [];
const enemyPositions = [];
let enemiesInterval = 600;
let resourcesCount = 300; // initial given resource or money amount
let frame = 0;
let gameOver = false; // starts as false only to have state changed by end, this helps optimization




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
createGrid()

function handleGameGrid() {
    for (let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw();
    }
}
// console.log(gameGrid)




//====================== Projectiles ======================//




//====================== Defenders ======================//
// class for creating new "defender" or "tower"
class Defender {
    // x and y as coordinates
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
        this.shooting = false; // default state
        this.health = 100; // starting health
        this.projectiles = [];
        this.timer = 0;
    }
    draw() {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "gold";
        ctx.font = "30px Arial"
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30) // health wrapped in Math.floor() so we only use whole numbers
    }
}

// snapping the placement to the closest grid space to the left
canvas.addEventListener("click", function() {
    // "%" (modulas) is an operator that returns the remainder if these 2 were divided (/)
    const gridPositionX = mouse.x - (mouse.x % cellSize)
    const gridPositionY = mouse.y - (mouse.y % cellSize)
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
        defenders[i].draw()
    }
}







//====================== Enemies ======================//
// class for creating new enemies
class Enemy {
    constructor(verticalPosition) {
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = cellSize;
        this.height = cellSize;
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
        ctx.font = "30px Arial"
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30) // health wrapped in Math.floor() so we only use whole numbers
    }
}

function handleEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i].x < 0) {
            gameOver = true;
        }
    }
    if (frame % enemiesInterval ===0) {
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize // place enemies on their rows
        enemies.push(new Enemy(verticalPosition))
        enemyPositions.push(verticalPosition)
        if (enemiesInterval > 120) {enemiesInterval -= 50 } // speeds up the enemy spawn rate as time goes on
    }
}







//====================== Recources ======================//





//====================== Utilities ======================//
function handleGameSatus() {
    ctx.fillStyle = "gold";
    ctx.font = "30px Arial";
    ctx.fillText(`Resources: ${resourcesCount}`, 20, 60)
    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "60px Arial";
        ctx.fillText("GAME OVER", 135, 330)
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, gameControlsBar.width, gameControlsBar.height);
    handleGameGrid();
    handleDefenders();
    handleEnemies();
    handleGameSatus();
    frame++;
    // console.log(frame)
    if (!gameOver) { requestAnimationFrame(animate) };
}
animate();

//trying to see if a collision is true
function collision(first, second) {
    if (
        !(
            first.x > second.x + second.width ||
            first.x + first.width < second.x ||
            first.y > second.y + second.height ||
            first.y + first.height < second.y
        )
    ) {
        return true
    };
};