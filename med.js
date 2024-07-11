const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const PLAYER_SIZE = 50;
const ENEMY_SIZE = 30;
const BULLET_SIZE = 5;
const ENEMY_SPEED = 2;  // Easy level speed
const BULLET_SPEED = 7;  // Easy level speed
const PLAYER_SPEED = 15;

let playerX = canvas.width / 2 - PLAYER_SIZE / 2;
let playerY = canvas.height - PLAYER_SIZE - 10;

let enemies = [];
for (let i = 0; i < 10; i++) {
    let enemy = {
        x: Math.random() * (canvas.width - ENEMY_SIZE),
        y: Math.random() * (canvas.height / 2 - ENEMY_SIZE),
        size: ENEMY_SIZE,
    };
    enemies.push(enemy);
}

let bullets = [];
let score = 0;

function drawPlayer() {
    ctx.fillStyle = 'green';
    ctx.fillRect(playerX, playerY, PLAYER_SIZE, PLAYER_SIZE);
}

function drawEnemies() {
    ctx.fillStyle = 'red';
    for (let enemy of enemies) {
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
    }
}

function drawBullets() {
    ctx.fillStyle = 'white';
    for (let bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.size, bullet.size);
    }
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function update() {
    // Move enemies
    for (let enemy of enemies) {
        enemy.y += ENEMY_SPEED;
        if (enemy.y > canvas.height) {
            enemy.y = 0;
            enemy.x = Math.random() * (canvas.width - ENEMY_SIZE);
        }
    }

    // Move bullets
    for (let bullet of bullets) {
        bullet.y -= BULLET_SPEED;
        if (bullet.y < 0) {
            bullets.splice(bullets.indexOf(bullet), 1);
        }
    }

    // Check collisions
    for (let enemy of enemies) {
        for (let bullet of bullets) {
            if (
                bullet.x < enemy.x + enemy.size &&
                bullet.x + bullet.size > enemy.x &&
                bullet.y < enemy.y + enemy.size &&
                bullet.y + bullet.size > enemy.y
            ) {
                enemies.splice(enemies.indexOf(enemy), 1);
                bullets.splice(bullets.indexOf(bullet), 1);
                score++;
                enemies.push({
                    x: Math.random() * (canvas.width - ENEMY_SIZE),
                    y: Math.random() * (canvas.height / 2 - ENEMY_SIZE),
                    size: ENEMY_SIZE,
                });
            }
        }
    }

    // Check player collision
    for (let enemy of enemies) {
        if (
            playerX < enemy.x + enemy.size &&
            playerX + PLAYER_SIZE > enemy.x &&
            playerY < enemy.y + enemy.size &&
            playerY + PLAYER_SIZE > enemy.y
        ) {
            window.location.href = `gameover.html?score=${score}`;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawEnemies();
    drawBullets();
    drawScore();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && playerX > 0) {
        playerX -= PLAYER_SPEED;
    }
    if (event.key === 'ArrowRight' && playerX < canvas.width - PLAYER_SIZE) {
        playerX += PLAYER_SPEED;
    }
    if (event.key === ' ') {
        bullets.push({
            x: playerX + PLAYER_SIZE / 2 - BULLET_SIZE / 2,
            y: playerY,
            size: BULLET_SIZE,
        });
    }
});

// Mobile controls
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const shootButton = document.getElementById('shootButton');

leftButton.addEventListener('touchstart', () => {
    if (playerX > 0) {
        playerX -= PLAYER_SPEED;
    }
});

rightButton.addEventListener('touchstart', () => {
    if (playerX < canvas.width - PLAYER_SIZE) {
        playerX += PLAYER_SPEED;
    }
});

shootButton.addEventListener('touchstart', () => {
    bullets.push({
        x: playerX + PLAYER_SIZE / 2 - BULLET_SIZE / 2,
        y: playerY,
        size: BULLET_SIZE,
    });
});

canvas.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    const touchX = touch.clientX;

    if (touchX < canvas.width / 2) {
        if (playerX > 0) {
            playerX -= PLAYER_SPEED;
        }
    } else {
        if (playerX < canvas.width - PLAYER_SIZE) {
            playerX += PLAYER_SPEED;
        }
    }

    bullets.push({
        x: playerX + PLAYER_SIZE / 2 - BULLET_SIZE / 2,
        y: playerY,
        size: BULLET_SIZE,
    });
});

gameLoop();
