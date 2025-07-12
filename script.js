const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_RADIUS = 30;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 6;
const AI_SPEED = 4;
const BALL_SPEED = 7;

let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: BALL_SPEED * (Math.random() < 0.5 ? 1 : -1),
    vy: BALL_SPEED * (Math.random() * 2 - 1)
};
let playerScore = 0;
let aiScore = 0;

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#fff4';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#0ff';
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = '#f0f';
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2, false);
    ctx.fillStyle = '#ff0';
    ctx.fill();
    ctx.font = '32px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(playerScore, canvas.width / 2 - 60, 40);
    ctx.fillText(aiScore, canvas.width / 2 + 30, 40);
}

function paddleCollision(px, py) {
    if (ball.x - BALL_RADIUS < px + PADDLE_WIDTH && ball.x + BALL_RADIUS > px) {
        if (ball.y + BALL_RADIUS > py && ball.y - BALL_RADIUS < py + PADDLE_HEIGHT) {

            ball.vx = -ball.vx;
            const hitPos = (ball.y - (py + PADDLE_HEIGHT/2)) / (PADDLE_HEIGHT/2);
            ball.vy += hitPos * 3;
            ball.vy = Math.max(Math.min(ball.vy, BALL_SPEED*1.5), -BALL_SPEED*1.5);
        }
    }
}

function moveAI() {
    let center = aiY + PADDLE_HEIGHT / 2;
    if (ball.y < center - 10) {
        aiY -= AI_SPEED;
    } else if (ball.y > center + 10) {
        aiY += AI_SPEED;
    }
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

function update() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y - BALL_RADIUS < 0) {
        ball.y = BALL_RADIUS;
        ball.vy = -ball.vy;
    }
    if (ball.y + BALL_RADIUS > canvas.height) {
        ball.y = canvas.height - BALL_RADIUS;
        ball.vy = -ball.vy;
    }

    paddleCollision(PLAYER_X, playerY);
    paddleCollision(AI_X, aiY);

    moveAI();

    if (ball.x - BALL_RADIUS < 0) {
        aiScore++;
        resetBall(-1);
    }
    if (ball.x + BALL_RADIUS > canvas.width) {
        playerScore++;
        resetBall(1);
    }
}

function resetBall(direction) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = BALL_SPEED * direction;
    ball.vy = BALL_SPEED * (Math.random() * 2 - 1);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();