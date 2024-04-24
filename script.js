/* --------------- DOM --------------- */
const ground = document.getElementById("ground");
const score = document.getElementById("score");




/* --------------- Global --------------- */
const lenCol = 20, sizeCell = 20;
let isGameOver = false;
let timerTime = 225;
let displayUpdateTimer;




/* --------------- Short Hand --------------- */
// get (x, y) in object
const vect = (x, y) => { return { x: x*sizeCell, y: y*sizeCell } };
// vector of 2vector's Addition(x+x, y+y)
const add = (a, b) => { return { x: a.x+b.x, y: a.y+b.y } };
// json stringify
const str = (data) => JSON.stringify(data);
// short hand of set (left, top)
const setPosition = (element, x, y) => {
    element.style.left = x +'px';
    element.style.top = y +'px';
};




/* --------------- Class --------------- */
class Snake {
    constructor() {
        this.direction = vect(1, 0);
        this.pos = [vect(10, 8), vect(9, 8), vect(8, 8)];
        // we call body part func with position, it will return a part of snake body
        this.body = [this.bodyPart(this.pos[0]), this.bodyPart(this.pos[1]), this.bodyPart(this.pos[2])];
        this.addNewSnakeBodyPart= false;
    };


    // it's draw the position of snake in DOM
    draw() {
        let pos;
        for (let i=0; i<this.pos.length; i++) {
            // getting position
            pos = this.pos[i];
            // update positon in DOM
            setPosition(this.body[i], pos.x, pos.y);
        };
    };


    // it will return a part of snake body in div
    bodyPart(pos) {
        // create part
        const part = document.createElement("div");
        // set positon
        setPosition(part, pos.x, pos.y);
        // add class
        part.className = "snake";
        // draw in DOM
        ground.appendChild(part);
        // return the part
        return part;
    };


    // move the snake
    move() {
        // new body move
        if (this.addNewSnakeBodyPart) {
            let copyPos = this.pos;
            copyPos.unshift(add(copyPos[0], this.direction));
            this.pos = copyPos;
            
            // position last item(-1)
            let pos = this.pos[this.pos.length-1];
            // push new snake body part to body
            this.body.push(this.bodyPart(pos));
            
            // make it false
            this.addNewSnakeBodyPart = false;
        }
        // old body move;
        else {
            let copyPos = this.pos.slice(0, this.pos.length-1);
            copyPos.unshift(add(copyPos[0], this.direction));
            this.pos = copyPos;
        };
    };
};


class Furit {
    constructor() { this.position() };


    // it's draw the position of snake in DOM
    draw() {
        // create furit div
        const drawFurit = document.createElement("div");
        // set positon
        setPosition(drawFurit, this.pos.x, this.pos.y);
        // add class
        drawFurit.className = "furit";

        // append in DOM
        ground.appendChild(drawFurit);
    };


    // create new furit & draw it
    newFurit() {
        // Remove the old furit
        document.getElementsByClassName("furit")[0].remove();

        // new positon
        this.position();
        // draw the new furit
        this.draw();
    };


    // getting randomize position
    position() {
        this.x = Math.floor(Math.random() *lenCol);
        this.y = Math.floor(Math.random() *lenCol);
        this.pos = vect(this.x, this.y);
    };
};


class Main {
    constructor() {
        this.furit = new Furit();
        this.snake = new Snake();
    };


    // update all things
    update() {
        this.snake.move();
        this.collision();
        if (!isGameOver) { this.snake.draw() };
    };


    // Collision
    collision() {
        // snake[0](head) eat furit, same postiton
        if (str(this.snake.pos[0]) ===str(this.furit.pos)) {
            // add new furit
            this.furit.newFurit()
            // add new body part of snake
            this.snake.addNewSnakeBodyPart = true;
            // update score
            score.innerText = Number(score.innerText) +1;
        };

        // snake[0](head) pass ground, than, game over
        if (
            (this.snake.pos[0].x === lenCol*sizeCell) ||
            (this.snake.pos[0].x === -sizeCell) ||
            (this.snake.pos[0].y === lenCol*sizeCell) ||
            (this.snake.pos[0].y === -sizeCell)
        ) { gameOver("Hit The Wall") };

        // snake hit it's own self
        let copyPos = this.snake.pos;
        copyPos = copyPos.slice(1, copyPos.length);
        copyPos.find(i => {
            // snake[0](head)
            if (str(this.snake.pos[0]) === str(i)) {
                // game over
                gameOver("Hit Own Self");
                // for the the traversing
                return true;
            };
        });
    };


    // controlling hole game keys
    keyController(event) {
        // why 'if' has 1more 'if':    if snake move -->    && we try to move --<    :: then, 2nd if prevent it
        if (event.key === "ArrowLeft") {
            if (str(this.snake.direction) !== str(vect(1, 0))) {
                this.snake.direction = vect(-1, 0);
            };
        } 
        else if (event.key === "ArrowRight") {
            if (str(this.snake.direction) !== str(vect(-1, 0))) {
                this.snake.direction = vect(1, 0);
            };
        } 
        else if (event.key === "ArrowUp") {
            if (str(this.snake.direction) !== str(vect(0, 1))) {
                this.snake.direction = vect(0, -1);
            };
        } 
        else if (event.key === "ArrowDown") {
            if (str(this.snake.direction) !== str(vect(0, -1))) {
                this.snake.direction = vect(0, 1);
            };
        };
    };
};




/* --------------- Function --------------- */
// game over
const gameOver = (whatHappened) => {
    // set game over true
    isGameOver = true;
    // clear interval
    clearInterval(displayUpdateTimer);
    // show game over in DOM
    document.getElementById("title").innerText = whatHappened;
};


// start game
const startGame = () => {
    // Instance of Main
    const main = new Main();
    // get 1 furit
    main.furit.draw();
    // display updating interval
    displayUpdateTimer = setInterval(() => { main.update() }, timerTime);

    // add keypress event listener to DOM
    document.addEventListener("keydown", (event) => { main.keyController(event) });
};




/* --------------- Run --------------- */
startGame();