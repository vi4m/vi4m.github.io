const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: 0,
    speed: 0,
    rotation: 0,
    radius: 15 // Add collision radius
};

let circles = [];
for (let i = 0; i < 5; i++) {
    circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 20,
        angle: Math.random() * Math.PI * 2,
        speed: 0.02
    });
}

let rectangles = [];
let score = 0;

for (let i = 0; i < 5; i++) {
    rectangles.push({
        x: Math.random() * (canvas.width - 15),
        y: Math.random() * (canvas.height - 15),
        width: 15,
        height: 15
    });
}

let keys = {
    up: false,
    left: false,
    right: false
};

let isGameOver = false;
let gameOverScale = 1; // Scale factor for the Game Over text
let gameOverTimer = 0; // Timer to track Game Over duration

let gameState = 'playing'; // Possible states: 'playing', 'gameOver', 'waitingForRestart'

document.addEventListener('keydown', (e) => {
    if (gameState === 'playing') {
        switch (e.key) {
            case 'ArrowUp':
                keys.up = true;
                break;
            case 'ArrowLeft':
                keys.left = true;
                break;
            case 'ArrowRight':
                keys.right = true;
                break;
        }
    } else if (gameState === 'waitingForRestart') {
        if (e.key === ' ') {
            resetGame();
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (gameState === 'playing') {
        switch (e.key) {
            case 'ArrowUp':
                keys.up = false;
                break;
            case 'ArrowLeft':
                keys.left = false;
                break;
            case 'ArrowRight':
                keys.right = false;
                break;
        }
    }
});

let time = 0;

function update() {
    if (gameState === 'playing') {
        if (keys.up) {
            ship.speed += 0.05;
        } else {
            ship.speed *= 0.99;
        }

        if (keys.left) {
            ship.rotation = -0.05;
        } else if (keys.right) {
            ship.rotation = 0.05;
        } else {
            ship.rotation = 0;
        }

        ship.angle += ship.rotation;
        ship.x += Math.cos(ship.angle) * ship.speed;
        ship.y += Math.sin(ship.angle) * ship.speed;

        if (ship.x < 0) ship.x = canvas.width;
        if (ship.x > canvas.width) ship.x = 0;
        if (ship.y < 0) ship.y = canvas.height;
        if (ship.y > canvas.height) ship.y = 0;

        // Update circles
        circles.forEach(circle => {
            circle.angle += circle.speed;
            circle.x += Math.cos(circle.angle) * 2;
            circle.y += Math.sin(circle.angle) * 2;

            // Wrap around edges
            if (circle.x < 0) circle.x = canvas.width;
            if (circle.x > canvas.width) circle.x = 0;
            if (circle.y < 0) circle.y = canvas.height;
            if (circle.y > canvas.height) circle.y = 0;
        });

        // Collision detection
        circles.forEach(circle => {
            let dx = ship.x - circle.x;
            let dy = ship.y - circle.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < circle.radius + ship.radius) {
                isGameOver = true;
                gameState = 'gameOver';
            }
        });

        // Collision detection with rectangles
        rectangles = rectangles.filter(rect => {
            let distX = Math.abs(ship.x - rect.x - rect.width / 2);
            let distY = Math.abs(ship.y - rect.y - rect.height / 2);

            if (distX > (rect.width / 2 + ship.radius)) { return true; }
            if (distY > (rect.height / 2 + ship.radius)) { return true; }

            if (distX <= (rect.width / 2)) {
                score++;
                return false; // Remove rectangle
            }
            if (distY <= (rect.height / 2)) {
                score++;
                return false; // Remove rectangle
            }

            let dx = distX - rect.width / 2;
            let dy = distY - rect.height / 2;
            if ((dx * dx + dy * dy) <= (ship.radius * ship.radius)) {
                score++;
                return false; // Remove rectangle
            }

            return true; // Keep rectangle
        });

        // If all rectangles are collected, generate new ones
        if (rectangles.length === 0) {
            for (let i = 0; i < 5; i++) {
                rectangles.push({
                    x: Math.random() * (canvas.width - 15),
                    y: Math.random() * (canvas.height - 15),
                    width: 15,
                    height: 15
                });
            }
        }

        time += 0.016; // Increment time (assuming 60 FPS)
    } else if (gameState === 'gameOver') {
        if (gameOverTimer < 3) { // Limit to 3 seconds
            gameOverScale += 0.05; // Increase the scale factor
            gameOverTimer += 0.016; // Increment timer
        } else {
            gameState = 'waitingForRestart';
        }
    }
    // No update in 'waitingForRestart' state
}

function draw() {
    // Create animated gradient
    let redValue = Math.floor((Math.sin(time) + 1) * 127.5); // Oscillates between 0 and 255
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, `rgb(${redValue}, 0, 0)`);
    gradient.addColorStop(1, 'black');

    // Fill background with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    ctx.beginPath();
    // Draw ship
    ctx.moveTo(15, 0);
    ctx.lineTo(-10, 10);
    ctx.lineTo(-10, -10);
    ctx.closePath();
    ctx.strokeStyle = 'green'; // Change color to green
    ctx.stroke();
    ctx.restore();

    // Draw circles
    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.closePath();
    });

    // Draw rectangles
    rectangles.forEach(rect => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    });

    // Display score
    ctx.fillStyle = 'white';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + score, 10, 30);

    if (gameState === 'gameOver' || gameState === 'waitingForRestart') {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.translate(canvas.width / 2, canvas.height / 2);
        let scale = Math.min(gameOverScale, 4); // Cap the scale factor
        ctx.scale(scale, scale);
        ctx.font = '48px sans-serif';
        ctx.fillText('Game Over', 0, 0);
        ctx.restore();

        if (gameState === 'waitingForRestart') {
            // Display "Press play on tape"
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.font = '24px sans-serif';
            ctx.fillText('Press play on tape', canvas.width / 2, canvas.height / 2 + 60);
        }
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    // Reset game variables to initial state
    ship = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        angle: 0,
        speed: 0,
        rotation: 0,
        radius: 15
    };
    circles = [];
    for (let i = 0; i < 5; i++) {
        circles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 20,
            angle: Math.random() * Math.PI * 2,
            speed: 0.02
        });
    }
    rectangles = [];
    for (let i = 0; i < 5; i++) {
        rectangles.push({
            x: Math.random() * (canvas.width - 15),
            y: Math.random() * (canvas.height - 15),
            width: 15,
            height: 15
        });
    }
    keys = {
        up: false,
        left: false,
        right: false
    };
    isGameOver = false;
    gameOverScale = 1;
    gameOverTimer = 0;
    time = 0;
    score = 0;
    gameState = 'playing';
}

gameLoop();
