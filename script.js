let ground_y = window.innerHeight/2;
let player_y_pos = ground_y - 62;
let gameactive = true;

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let imgWidth = 50;
let imgHeight = 60;

class Player {
    constructor(x, y) {
        this.sx = 0;
        this.sy = 0;
        this.x = x;
        this.y = y;
        this.width = imgWidth;
        this.height = imgHeight;
        this.imgFlag = false;
        this.img = new Image();
        this.img.src = "assets/images/runningman.PNG";
        this.img.onload = () => {
            this.frameWidth = this.img.width/10;
            this.frameHeight = this.img.height/2;
            this.imgFlag = true;
        }
        this.starttime = new Date().getTime();
        this.counter = 0;
        this.dy = 0;
        this.jump = false;
        this.gravity = 15;
        this.dt = 0.09;
    }

    draw() {
        if (this.imgFlag) {
            ctx.drawImage(this.img,
                        this.sx,
                        this.sy,
                        this.frameWidth,
                        this.frameHeight,
                        this.x,
                        this.y,
                        this.width,
                        this.height);
            let now = new Date().getTime();
            if (now - this.starttime > 30) {
                this.starttime = new Date().getTime();
                if (gameactive) {
                    this.sx += this.frameWidth;
                    this.counter++;
                }
                if (this.counter == 9) {
                    this.counter = 0;
                    this.sx = 0;
                    if (this.sy == 0) {
                        this.sy = this.frameHeight;
                    } else {
                        this.sy = 0;
                    }
                }
            }
        }
    }

    update() {
        // Check if it's time to jump.
        if (this.jump) {
            this.jump = false;
            this.dy = -25;
        }

        this.y += this.dy;
        this.dy += Math.abs(this.dy)*this.dt + this.gravity*Math.pow(this.dt, 1);
        
        // Doesn't let the player reach beneath the platform.
        if (this.y >= player_y_pos) {
            this.y = player_y_pos;
            this.dy = 0;
        }
    }

    colliding(obj) {
        if (this.x + this.width >= obj.x && this.x + this.width <= obj.x + obj.width) {
            if (this.y + this.height > obj.y) {
                return true;
            }
        }
        if (this.x >= obj.x && this.x <= obj.x + obj.width) {
            if (this.y + this.width > obj.y) {
                return true;
            }
        }

    }
}

class Obstacle {
    constructor() {
        this.width = 30;
        this.height = 50;
        this.x = window.innerWidth;
        this.y = window.innerHeight/2 - this.height - 3;
        this.dx = -7;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x += this.dx;
        if (this.x < -this.width) {
            this.x = window.innerWidth;
        }
    }
}


let player = new Player(100, player_y_pos);
let obstacle = new Obstacle();


resize();
window.onresize = () => {
    resize();
};
canvas.style.backgroundColor = "white";

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


// Event listeners
document.addEventListener("keydown", keydownListener, false);

function keydownListener(e) {
    switch (e.keyCode) {
        case 32: // Sspace bar
            if (!player.jump) {
                if (player.y == player_y_pos) {
                    player.jump = true;
                }
            }
            break;
        case 13: // Enter key
            break;
    }
}

// Ground
function drawGound() {
    ctx.beginPath();
    ctx.moveTo(0, window.innerHeight/2);
    ctx.lineTo(window.innerWidth, window.innerHeight/2);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
}

function draw() {
    if (player.imgFlag) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGound();
        player.draw();
        obstacle.draw();
    }
}

function update() {
    if (player.imgFlag) {
        if (gameactive) {
            player.update();
            obstacle.update();
            if (player.colliding(obstacle)) {
                gameactive = false;
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
    fpsInterval = 1000/fps;
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

startAnimating(30);