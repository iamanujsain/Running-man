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
            this.frameWidth = this.img.width / 10;
            this.frameHeight = this.img.height / 2;
            this.imgFlag = true;
        }
        this.starttime = new Date().getTime();
        this.counter = 0;
        this.dy = 0;
        this.jump = false;
        this.gravity = 15;
        this.dt = 0.09;
        this.brain = new NeuralNetwork(2, 3, 1);
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
        this.dy += Math.abs(this.dy) * this.dt + this.gravity * Math.pow(this.dt, 1);

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

    think(obj) {
        let d = 0;
        let obstacle_dist = obj.x - this.x;
        if (obstacle_dist > 0) {
            d = obstacle_dist;
        }
        let brain_inputs = [d, this.y];
        let brain_outputs =  this.brain.predict(brain_inputs);
        if (brain_outputs[0] > 0.5) {
            if(!this.jump){
                if (this.y == player_y_pos) {
                    this.jump = true;
                }
            }
        }
    }

}