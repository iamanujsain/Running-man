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