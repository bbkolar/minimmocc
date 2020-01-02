/*
This file must be called index.js because Nodemon looks for index.js 
*/

var express = require('express');

var socket = require('socket.io');

//////////////////////////////////






// App setup

var app = express();

var server = app.listen(3777, function() {
    console.log("Now listening to requests on port 3777");
})

//set static files
app.use(express.static('./'));

/* This code uses typical file serving
app.get( '/', function(req, res) {
    console.log('trying to load %s', __dirname + '/index.html');
    res.sendFile('index.html', {root: __dirname});
})

*/

var io = socket(server); // Want socket to io to work on the express server above

var latestPlayer;
var players = [];
var playerCount = 0; // most recently received game state received on server

io.on('connection', function(socket) { // instance of that particular socket
    // socket.id gives a unique socket connection id for each client
    console.log("made socket conection", socket.id);

    // game change
    socket.on("change", function(data) {
        console.log("in index.js change")
        players = JSON.parse(data); //array of JSON
        
        io.sockets.emit("change", JSON.stringify(players));
        console.log("all players " + JSON.stringify(players));
        console.log("sending out change");
    })

    socket.on("newPlayer", function(data) {
        //console.log("new player on server");
        //console.log("latest player = " + latestPlayer);
        //console.log(JSON.stringify(data));
        players.push(JSON.parse(data));
        latestPlayer = data;
        playerCount++;
        io.sockets.emit("change", JSON.stringify(players));
        console.log("Playercount = " + playerCount);
    }
    )
});