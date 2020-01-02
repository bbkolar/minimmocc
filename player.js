class Player {
    xCoordinate;
    yCoordinate;

    constructor(x, y) {
        this.xCoordinate = x;
        this.yCoordinate = y;
    }

    drawPlayer(ctx) {
        console.log("New Player Created");
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, 25, 25);
    }

}