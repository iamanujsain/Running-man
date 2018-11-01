let ground_y = window.innerHeight / 2;
let player_y_pos = ground_y - 62;
let gameactive = true;

let PLAYER_COUNT = 50;

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let imgWidth = 50;
let imgHeight = 60;

let players = [];
for (let i = 0; i < PLAYER_COUNT; i++) {
    players.push(new Player(100, player_y_pos));
}
let obstacle = new Obstacle();


resize();
window.onresize = () => {
    resize();
};

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


// Event listeners
// document.addEventListener("keydown", keydownListener, false);

// function keydownListener(e) {
//     switch (e.keyCode) {
//         case 32: // Space bar
//             if (!player.jump) {
//                 if (player.y == player_y_pos) {
//                     player.jump = true;
//                 }
//             }
//             break;
//         case 13: // Enter key
//             break;
//     }
// }

// // Ground
// function drawGound() {
//     ctx.beginPath();
//     ctx.moveTo(0, window.innerHeight/2);
//     ctx.lineTo(window.innerWidth, window.innerHeight/2);
//     ctx.strokeStyle = "green";
//     ctx.lineWidth = 3;
//     ctx.stroke();
//     ctx.closePath();
// }
// 

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    obstacle.draw();
    for (let i = 0; i < players.length; i++) {
        players[i].draw();
    }
}

function update() {
    if (gameactive) {
        obstacle.update();
        for (let i = 0; i < players.length; i++) {
            players[i].update();
            players[i].think(obstacle);
            if (players[i].colliding(obstacle)) {
                console.log("Hit");
                players.splice(i, 1);
                gameactive = true;
            }
        }
    }
}

function main() {
    update();
    draw();
}

let fps;
let frameCount = 0;
let fpsInterval, now, then, elasped;

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = new Date().getTime();
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    now = new Date().getTime();
    elasped = now - then;
    if (elasped > fpsInterval) {
        then = now - (elasped % fpsInterval);
        main();
    }
}

startAnimating(60);