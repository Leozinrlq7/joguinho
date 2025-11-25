const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ------------------ MENU / PERSONAGENS ------------------
let playerImgSrc = "img/cr7-front.png";      
let obstacleImgSrc = "img/messi-back.png";   
let playerName = "cr7";                      

// Sons de pulo e colisão
let jumpSound = new Audio("audio/jump-cr7.mp3");
let hitSound = new Audio("audio/hit-cr7.mp3");

//  ÁUDIO DE FUNDO DIFERENTE PARA CR7 e MESSI
let hypeMusicMessi = new Audio("audio/ankara-messi.mp3");
let hypeMusicCR7 = new Audio("audio/choose-cr7.mp3");

hypeMusicMessi.loop = true;
hypeMusicCR7.loop = true;
hypeMusicMessi.volume = 0.5;
hypeMusicCR7.volume = 0.5;

// 🎉 ÁUDIOS ESPECIAIS FINAL DO JOGO
let winAudioMessi = new Audio("audio/messi-win.mp3");
let winAudioCR7 = new Audio("audio/cr7-win.mp3");

// 🎉 IMAGENS ESPECIAIS FINAL DO JOGO
let winImgMessi = new Image();
let winImgCR7 = new Image();

winImgMessi.src = "img/messi-final.png";
winImgCR7.src = "img/cr7-final.png";

let showWinScreen = false;

// ------------------ ESCOLHA PERSONAGEM ------------------
function chooseCharacter(choice) {
    if (choice === "cr7") {
        playerImgSrc = "img/cr7-front.png";      
        obstacleImgSrc = "img/messi-front.png";  
        playerName = "cr7";
        jumpSound.src = "audio/jump-cr7.mp3";
        hitSound.src = "audio/hit-messi.mp3";
        
    } else if (choice === "messi") {
        playerImgSrc = "img/messi-back.png";    
        obstacleImgSrc = "img/cr7-back.png";     
        playerName = "messi";
        jumpSound.src = "audio/jump-messi.mp3";
        hitSound.src = "audio/hit-cr7.mp3";
    }

    playerImg.src = playerImgSrc;
    obstacleImg.src = obstacleImgSrc;

    document.getElementById("menu").style.display = "none";

    loop();
    spawnObstacle();
}

// ------------------ IMAGENS ------------------
const playerImg = new Image();
playerImg.src = playerImgSrc;

const obstacleImg = new Image();
obstacleImg.src = obstacleImgSrc;

// ------------------ PLAYER ------------------
const player = {
    x: 50,
    y: 200,
    width: 200,
    height: 280,
    dy: 0,
    gravity: 0.4,
    jump: -15,
    grounded: false
};

// ------------------ GAME STATE ------------------
let obstacles = [];
let score = 0;
let gameOver = false;

// ------------------ OBSTÁCULOS ------------------
function spawnObstacle() {
    if (!gameOver && document.getElementById("menu").style.display === "none") {

        obstacles.push({
            x: canvas.width,
            y: canvas.height - 10 - 100,
            width: 100,
            height: 100,
            speed: 5 + score * 0.8  
        });

        let interval = Math.max(700, 1700 - score * 20);
        setTimeout(spawnObstacle, interval);
    }
}

// ------------------ CONTROLES ------------------
document.addEventListener("keydown", (e) => {
    const key = e.code;

    if (showWinScreen) return;

    if (
        (key === "Space" || key === "ArrowUp" || key === "KeyW") &&
        player.grounded &&
        document.getElementById("menu").style.display === "none"
    ) {

        if (
            (playerName === "messi" && hypeMusicMessi.paused) ||
            (playerName === "cr7" && hypeMusicCR7.paused)
        ) {
            jumpSound.currentTime = 0;
            jumpSound.play();
        }

        player.dy = player.jump;
        player.grounded = false;
    }

    if (
        (key === "ArrowDown" || key === "KeyS") &&
        !player.grounded &&
        document.getElementById("menu").style.display === "none"
    ) {
        player.dy = 5;
    }
});

// ------------------ NOVA HITBOX ------------------
function collides(p, o) {
    const hitboxWidth = p.width * 0.60;
    const hitboxHeight = p.height * 0.75;

    const hitboxX = p.x + (p.width - hitboxWidth) / 2;
    const hitboxY = p.y + (p.height - hitboxHeight) / 2;

    return (
        hitboxX < o.x + o.width &&
        hitboxX + hitboxWidth > o.x &&
        hitboxY < o.y + o.height &&
        hitboxY + hitboxHeight > o.y
    );
}

// ------------------ WIN GAME ------------------
function triggerWinScreen() {
    gameOver = true;
    showWinScreen = true;
    obstacles = [];

    hypeMusicMessi.pause();
    hypeMusicCR7.pause();

    if (playerName === "messi") {
        winAudioMessi.play();
    } else {
        winAudioCR7.play();
    }

    setTimeout(() => {
        document.location.reload();
    }, 5200);
}

// ------------------ UPDATE ------------------
function update() {
    if (gameOver) return;

    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height >= canvas.height - 10) {
        player.y = canvas.height - 10 - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    obstacles.forEach((obs, i) => {
        obs.x -= obs.speed;

        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            score++;
            document.getElementById("score").innerText = "Score: " + score;

            if (score === 10) {
                if (playerName === "messi") {
                    hypeMusicMessi.currentTime = 0;
                    hypeMusicMessi.play();
                } 
                if (playerName === "cr7") {
                    hypeMusicCR7.currentTime = 0;
                    hypeMusicCR7.play();
                }
            }

            if (score >= 15) {
                triggerWinScreen();
            }
        }

        if (collides(player, obs) && !showWinScreen) {
            hypeMusicMessi.pause();
            hypeMusicCR7.pause();

            hitSound.currentTime = 0;
            hitSound.play();

            gameOver = true;

            setTimeout(() => {
                alert("Game Over! Pontuação: " + score);
                document.location.reload();
            }, 300);
        }
    });
}

// ------------------ DRAW ------------------
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showWinScreen) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        let img = playerName === "messi" ? winImgMessi : winImgCR7;

        ctx.drawImage(img, canvas.width/2 - 200, canvas.height/2 - 200, 400, 400);
        return;
    }

    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    obstacles.forEach(obs => {
        ctx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);
    });
}

// ------------------ GAME LOOP ------------------
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}
