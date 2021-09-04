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
        if (collision(this, mouse)) {
            ctx.strokeStyle = "black";
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
function createGrid() {
    for(let y = cellSize; y < canvas.height; y += cellSize) {
        for(let x = 0; x < canvas.width; x += cellSize) {
            gameGrid.push(new Cell(x, y));
        }
    }
}
createGrid()
function handleGameGrid() {
    for(let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw();
    }
}
// console.log(gameGrid)




//====================== Projectiles ======================//


//====================== Towers ======================//


//====================== Enemies ======================//


//====================== Recources ======================//





//====================== Utilities ======================//
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, gameControlsBar.width, gameControlsBar.height);
    handleGameGrid();
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