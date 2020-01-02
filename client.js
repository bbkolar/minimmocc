/**
 * Player class used to store a player and its location, as well as handle all player
 * interactions
 * 
 * 
 * TODO:
 * 
 * Add player boundaries
 * Add timer on keydown events so movement of square feels cleaner
 * To add diagonal movement, add array of all currently pressed down keys (added on keydown, removed on keyup)
 * 
 * 
 * LOOKINTOS
 * 
 * request pointer lock
 * https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
 * */



console.log("top of page");
var socket = io.connect('http://localhost:3777');


class Game {
    players = [];

    // you populate a game with your first player before server gives you the rest
    constructor(ctx) {
        console.log("Game Created");
        this.gameCanvas = ctx;

        console.log("new PLayer " + socket.id);
        socket.emit("newPlayer", JSON.stringify(new Player(ctx, 20, 20, socket.id))); // everytime new player is added, send message containing the id



        new Player(ctx, 20, 20, socket.id)
        
    }

    receiveUpdate(ctx) {
        
        
        console.log("received update");
        
        this.players.forEach( function(p) {
            p.drawPlayer(ctx);
        })

        console.log(this.players);
    }

    updateGame(ctx) {
        
        
        this.players.forEach( function(p) {
            p.drawPlayer(ctx);
        })

        console.log("updating game... in client.js");
        
        socket.emit("change", JSON.stringify(this.players)); // emit change event and this players version with update
    }

}

class Player {
    id;
    xCoordinate;
    yCoordinate;
    height;
    width;
    message; 

    constructor(ctx, x, y, clientSocket, txt = "hi") {
        console.log("New Player Created");
        this.id = clientSocket;
        this.xCoordinate = x;
        this.yCoordinate = y;
        this.height = 20;
        this.width = 20;
        this.playerCanvas = ctx;
        this.message = new Message(txt, this.xCoordinate, this.yCoordinate);
    }

    moveUp() {
        this.yCoordinate -= 10;
        this.message.yCoordinate -= 10;
        
    }

    moveRight() {
        this.xCoordinate += 10;
        this.message.xCoordinate += 10;
        
    }

    moveLeft() {
        this.xCoordinate -= 10;
        this.message.xCoordinate -= 10;
    }

    moveDown() {
        this.yCoordinate += 10;
        this.message.yCoordinate += 10;
    }

    changeBothCoordinates(newX, newY) {
        this.xCoordinate = newX;
        this.yCoordinate = newY;
    }

    drawPlayer(ctx, colour = "#f00") {
        ctx.fillStyle = colour;
        ctx.fillRect(this.xCoordinate, this.yCoordinate, 20, 20);
        this.message.postMessage(ctx);
        

    }

    playerDeath(ctx) {
        this.drawPlayer(ctx, "#fff");    
    }

    isHit(x, y, ctx) {
        console.log(this.xCoordinate);
        console.log(this.yCoordinate);
        

        if (x > this.xCoordinate && x < this.xCoordinate + this.width && y > this.yCoordinate && y < this.yCoordinate + this.height) {
            return true;
        }
        else {
            return false;
        }
    }



    sendMessage(message) {
        this.message.text = message;
    }

}

class Message {
    text;
    xCoordinate;
    yCoordinate;

    constructor(txt, x, y) {
        this.text = txt;
        this.xCoordinate = x;
        this.yCoordinate = y;
    }

 

    postMessage(ctx) {
        console.log(this.text);
        console.log("message being posted");
        ctx.font = "12px Arial";
        ctx.fillText(this.text, this.xCoordinate, this.yCoordinate,);  
    }
}


// Create game
console.log("about to try to connect");
socket.on('connect', () => {

// Use as JS 'Main' Function to allow all DOM elements to load
console.log("ionside connect, but before load");

    console.log("ionside connect, after load");
    
    
    // Set Graphics Context
    var c = document.getElementById("viewport");
    var ctx = c.getContext("2d");
    
    // Function used to align canvas coords
    function alignCanvasCoordsY(clientX, clientY) {
        // get canvas elements
        var rect= c.getBoundingClientRect()
        let canvasX = rect.left;
        let canvasY = rect.top;
    
        // adjust with canvas size
        let cx = clientX - canvasX;
        let cy = clientY - canvasY;
    
        console.log("CX: " + cx + " CY: " + cy);
        return [cx, cy]; // return both synced elements
    }
   

   

     

    
    var g = new Game(ctx);
    //g.players.push(p1);

    // Add blank player with fake id for now
    //g.players.push(new Player(ctx, 50, 50, 44))
     //update game immediately when new player arrives

    document.addEventListener("click", function(e) {
        var canvasValues = alignCanvasCoordsY(e.clientX, e.clientY);
        let x = canvasValues[0];
        let y = canvasValues[1];
        
        if(p1.isHit(x, y, ctx)) {
                p1.playerDeath(ctx);
                window.setTimeout(function() {
                    p1.changeBothCoordinates(0, 0);
                    ctx.clearRect(0, 0, c.width, c.height);
                    p1.drawPlayer(ctx);
                }, 1000);
            }
        })
        

    // Add movement event listeners
    document.addEventListener("keydown", function(e) {

        switch(e.keyCode) {
            case 37:
                console.log("Left");
                g.players.find(p => p.id == socket.id).moveLeft();
                ctx.clearRect(0, 0, c.width, c.height);
                g.updateGame(ctx);
                break;

            case 38:
                console.log("Up");
                g.players.find(p => p.id == socket.id).moveUp();
                ctx.clearRect(0, 0, c.width, c.height);
                g.updateGame(ctx);
                break;

            case 39:
                console.log("Right");
                g.players.find(p => p.id == socket.id).moveRight();
                ctx.clearRect(0, 0, c.width, c.height);
                g.updateGame(ctx);
                break;
            
            case 40:
                console.log("Down");
                g.players.find(p => p.id == socket.id).moveDown();
                ctx.clearRect(0, 0, c.width, c.height);
                g.updateGame(ctx);
                break;
        }

       
    })

    // Add event listener for message send
    let messageForm = document.getElementById("messageForm");

    messageForm.addEventListener("submit", function(e) {
        e.preventDefault();
        let msg = document.getElementById("message").value;
        document.getElementById("message").value = "";
        
        g.players.find(p => p.id == socket.id).sendMessage(msg);
        
        //p1.drawPlayer(ctx);
        g.updateGame(ctx);
    })


// listen for socket events
console.log("about to listen for sockets");
socket.on("change", function(data) {
    console.log("EVERYBODY RECEIVED THAT");
    

    data = JSON.parse(data);
    console.log(data);
   
   //ctx.clearRect(0, 0, c.width, c.height);

    g.players = [];

   data.forEach((p) => {
       console.log(p.id);
       console.log(p.message.text);
       g.players.push(new Player(ctx, p.xCoordinate, p.yCoordinate, p.id, p.message.text));
   })

   ctx.clearRect(0, 0, c.width, c.height);
    g.receiveUpdate(ctx, data);
}) 

/* socket.on("newPlayer", function (data) {
    console.log("new player on client");
} ); */

/*
socket.on("addNewPlayer", function(data) {
    data = JSON.parse(data);
    console.log(data);

    
    g.players = [];
    data.forEach((p) => {
        g.players.push(new Player(ctx, data.xCoordinate, data.yCoordinate, data.id));
    })
    

    console.log("New player added.");

    g.players.forEach((p) => console.log(p));
})
*/




});