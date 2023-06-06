const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const rows = 35;
const cols = 35;
let foodCollected = false;
const cellWidth = canvas.width / rows;
const cellHeight = canvas.height / cols;
let direction;
let score = 1;
let snake = [{ x: 3, y: 3 }];
let food = { x: 11, y: 11 };

function AddCell(x, y) {
    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
}

function PlaceFood() {
    food.x = Math.floor(Math.random() * cols);
    food.y = Math.floor(Math.random() * rows);

    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === food.x && snake[i].y === food.y) {
            PlaceFood();
            break;
        }
    }
}

function HandleKeyDown(e) {
    if (e.keyCode === 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (e.keyCode === 40 && direction !== 'UP') {
        direction = 'DOWN';
    } else if (e.keyCode === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (e.keyCode === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    }
}

function ShiftSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'UP':
            head.y--;
            break;
        case 'DOWN':
            head.y++;
            break;
        case 'RIGHT':
            head.x++;
            break;
        case 'LEFT':
            head.x--;
            break;
    }

    snake.unshift(head);
    if (!foodCollected) {
        snake.pop();
    } else {
        foodCollected = false;
    }
}

function CheckCollision() {
    const [head, ...tail] = snake;

    if (
        head.x < 0 ||
        head.x >= cols ||
        head.y < 0 ||
        head.y >= rows ||
        tail.some((part) => part.x === head.x && part.y === head.y)
    ) {
        PlaceFood();
        snake = [{ x: 3, y: 3 }];
        Object.freeze(snake[0]);
        score = 1;
    }
}

function GameLoop() {
    CheckCollision();
    ShiftSnake();

    if (snake[0].x === food.x && snake[0].y === food.y) {
        PlaceFood();
        foodCollected = true;
    }
}

function Draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'yellow';
    AddCell(food.x, food.y);

    ctx.fillStyle = 'green';
    snake.forEach((part) => AddCell(part.x, part.y));

    requestAnimationFrame(Draw);
}

document.addEventListener('keydown', HandleKeyDown);
setInterval(GameLoop, 80);
Draw();