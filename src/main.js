const instruction = document.querySelector("#instruction-text");
const logo = document.querySelector("#logo");
const gameboard = document.querySelector("#game-board");
const score = document.querySelector("#score");
const highScore = document.querySelector("#highScore");

//Game variables
const gridSize = 20;
let snake = [{ x: 8, y: 8 }]
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Utils
function isSnakeCollision({ x, y }) {
    return snake.some(s => s.x === x || s.y === y);
}

function generateFood() {

    const x = Math.floor((Math.random() * gridSize)) + 1;
    const y = Math.floor((Math.random() * gridSize)) + 1;

    if (isSnakeCollision({ x, y })) {
        generateFood();
    }

    return { x, y }
}

function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

// ----------------------------------------
// ----------------------------------------
// ----------------------------------------

// Game functions

function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1
    }
}

// Set position of snake or food
function setPosition(element, { x, y }) {
    element.style.gridColumn = x
    element.style.gridRow = y
}

//Draw Snake
function drawSnake() {
    snake.forEach(segment => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        gameboard.appendChild(snakeElement);

    })
}

function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        gameboard.appendChild(foodElement);
    }
}

function moveSnake() {
    const head = { ...snake[0] }
    switch (direction) {
        case 'right': head.x++;
            break;
        case 'left': head.x--;
            break;
        case 'up': head.y--;
            break;
        case 'down': head.y++;
            break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed()
    } else {
        snake.pop();
    }

    draw();
}

//Draw game snake, food
function draw() {
    gameboard.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}



function startGame() {
    gameStarted = true;
    instruction.style.display = 'none';
    logo.style.display = 'none';


    gameInterval = setInterval(() => {
        moveSnake();
        draw();
        checkCollision();
    }, gameSpeedDelay);
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame()
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}
function resetGame() {
    updateHighScore()
    gameStarted = false;
    clearInterval(gameInterval)
    const val = confirm('Do you want to start again?')
    if (val) {
        snake = [{ x: 8, y: 8 }]
        direction = 'right';
        startGame()
    } else {
        instruction.style.display = 'block';
        logo.style.display = 'block';
    }
}

// Key Listener
document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(e) {
    const keyPressed = e.key;

    if (keyPressed == ' ' && !gameStarted) startGame()
    else {
        switch (keyPressed) {
            case 'ArrowUp':
                if (validateDirections(direction, keyPressed)) {
                    direction = 'up';
                }
                break;
            case 'ArrowDown':
                if (validateDirections(direction, keyPressed)) {
                    direction = 'down';
                }
                break;
            case 'ArrowLeft':
                if (validateDirections(direction, keyPressed)) {
                    direction = 'left';
                }
                break;
            case 'ArrowRight':
                if (validateDirections(direction, keyPressed)) {
                    direction = 'right';
                }
                break;
        }
    }
}

function validateDirections(current, newDirection) {
    console.log(current, newDirection)
    if (current === 'up' && newDirection === 'ArrowDown') return false;
    if (current === 'down' && newDirection === 'ArrowUp') return false;
    if (current === 'left' && newDirection === 'ArrowRight') return false;
    if (current === 'right' && newDirection === 'ArrowLeft') return false;
    return true;
}

function updateHighScore() {
    const newHighScore = Math.max(highScore, score)
    highScore.textContent === newHighScore
}

function updateScore() {
    score.textContent = (snake.length - 1).toString().padStart(3, '0')
}