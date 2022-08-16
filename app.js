const scoreDiv = document.querySelector(".score");
const score = document.querySelector(".current-score");
const highScore = document.querySelector(".high-score");
const gameArea = document.querySelector(".game-area");
const startScreen = document.querySelector(".start-screen");

// ********************* GAME SOUNDS ********************
let carIgnitionSound = new Audio("game-sounds/mixkit-car-ignition-1535.wav");
let carRunningSound = new Audio("game-sounds/mixkit-passing-car-and-urban-ambience-1554.wav");
let carCrashSound = new Audio("game-sounds/mixkit-car-explosion-debris-1562.wav");
carIgnitionSound.play();


// **************** PAUSE-SCREEN ******************
const pauseDiv = document.createElement("div");
pauseDiv.classList.add("hide");
pauseDiv.textContent = "Game is paused";
pauseDiv.classList.add("pause-screen");
gameArea.appendChild(pauseDiv);


let hsVal = localStorage.getItem("highScoreVal");
if (hsVal === null) {
    localStorage.setItem("highScoreVal", 0);
}
highScore.textContent = "High-Score : " + localStorage.getItem("highScoreVal");

let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
let player = { speed: 10 };
let lastPaintTime = 0;
let lastScore = 0;
let pauseGame = false;

startScreen.addEventListener("click", start);
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e) {
    keys[e.key] = true;
}
function keyUp(e) {
    keys[e.key] = false;
}


function collide(playerCar, opponentCar) {
    pr = playerCar.getBoundingClientRect();
    or = opponentCar.getBoundingClientRect();
    return !((pr.bottom < or.top) || (pr.top > or.bottom) || (pr.left > or.right) || (pr.right < or.left))
}


// ***************** MOVING THE ROAD LINES FUNCTION *******************
function moveLines() {
    let lines = document.querySelectorAll(".road-line");
    lines.forEach((item) => {
        if (item.y > 900) {
            item.y -= 900;
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    })
}


// ***************** MOVING THE ENEMY CARS  FUNCTION ******************
function moveEnemyCars(myCar) {
    let enemyCars = document.querySelectorAll(".enemy-car-div");
    enemyCars.forEach(function (car) {
        if (collide(myCar, car)) {
            console.log("BUSTED !!!!!");
            carCrashSound.play();
            carRunningSound.pause();
            player.start = false;
            startScreen.textContent = "Game Over"
            startScreen.style.top = "15rem";
            startScreen.classList.remove("hide");
            if (player.score > hsVal) {
                localStorage.setItem("highScoreVal", player.score);
                highScore.textContent = "High-Score : " + player.score;
            }
        }
        if (car.y > 900) {
            car.y -= 900;
            car.style.left = Math.floor(Math.random() * 580) + "px";
        }
        car.y += player.speed;
        car.style.top = car.y + "px";
    })
}





function gameplay(ctime) {
    let car = document.querySelector(".car-div");
    let roadDimmension = gameArea.getBoundingClientRect();
    if (player.start) {
        carRunningSound.play();
        // ************* MOVING THE ROAD LINES **************
        moveLines();

        // ************* MOVING THE ENEMY CARS **************
        moveEnemyCars(car);
        if (keys.ArrowUp && player.y > 150) {
            player.y -= player.speed;
        }
        if (keys.ArrowDown && player.y < (roadDimmension.bottom - 120)) {
            player.y += player.speed;
        } if (keys.ArrowLeft && player.x > 0) {
            player.x -= player.speed;
        } if (keys.ArrowRight && player.x < (roadDimmension.width - 78)) {
            player.x += player.speed;
        }
        car.style.top = player.y + "px";
        car.style.left = player.x + "px";

        if (ctime - lastPaintTime > 300) {
            player.score++;
            lastPaintTime = ctime;
        }
        score.textContent = "Score : " + player.score;

        if (player.score - lastScore > 100) {
            player.speed += 2;
            lastScore = player.score;
        }
        if (pauseGame === false) {
            window.requestAnimationFrame(gameplay);
        }

    }
}

// ******************* START GAME *****************
function start() {
    carIgnitionSound.pause();
    startScreen.classList.add("hide");
    gameArea.innerHTML = "";
    gameArea.appendChild(pauseDiv);
    player.start = true;

    // ************** ROAD LINES ***************
    for (let i = 0; i < 6; i++) {
        let roadLine = document.createElement("div");
        roadLine.classList.add("road-line");
        roadLine.y = i * 180;
        roadLine.style.top = roadLine.y + "px";
        gameArea.appendChild(roadLine);
    }


    // ************** PLAYER CAR ***************
    let car = document.createElement("div");
    car.classList.add("car-div");
    gameArea.appendChild(car);


    // ************** ENEMY CARS ***************
    for (let i = 0; i < 3; i++) {
        let enemyCar = document.createElement("div");
        enemyCar.classList.add("enemy-car-div");
        enemyCar.y = i * 300;
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.left = Math.floor(Math.random() * 580) + "px";
        gameArea.appendChild(enemyCar);
    }
    player.x = car.offsetLeft;
    player.y = car.offsetTop;


    // ************* INITIALIZING THE SCORE ***********
    player.score = 0;
    scoreDiv.style.height = "12rem";
    window.requestAnimationFrame(gameplay);
}





// *************** WHEN GAME IS PAUSED **************************
document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
        if (pauseGame === true) {
            pauseGame = false;
            console.log("Pause is false");
            pauseDiv.classList.add("hide");
            gameplay();
        }
        else if (pauseGame === false) {
            pauseGame = true;
            console.log("Pause is true");
            pauseDiv.classList.remove("hide");
        }

    }
})

