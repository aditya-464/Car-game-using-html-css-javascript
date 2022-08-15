const score = document.querySelector(".current-score");
const highScore = document.querySelector(".high-score");
const gameArea = document.querySelector(".game-area");
const startScreen = document.querySelector(".start-screen");

let hsVal = localStorage.getItem("highScoreVal");
if (hsVal === null) {
    localStorage.setItem("highScoreVal", 0);
}
highScore.textContent = "High-Score : " + localStorage.getItem("highScoreVal");

let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
let player = { speed: 10 };
lastPaintTime = 0;

startScreen.addEventListener("click", start);
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e) {
    // e.preventDefault();
    keys[e.key] = true;
}
function keyUp(e) {
    // e.preventDefault();
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
            player.start = false;
            startScreen.textContent = "Game Over"
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
        window.requestAnimationFrame(gameplay);
    }
}

function start() {
    startScreen.classList.add("hide");
    gameArea.innerHTML = "";
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
    window.requestAnimationFrame(gameplay);
}