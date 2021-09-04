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
let resourcesCount = 300; // initial given resource or money amount




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


//====================== Recources ======================//





//====================== Utilities ======================//
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, gameControlsBar.width, gameControlsBar.height);
    handleGameGrid();
    handleDefenders();
    requestAnimationFrame(animate);
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