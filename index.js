// Setup basic express server

var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var port = process.env.PORT || 3000;


server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

var numUsers = 0;
var game_players = {};

app.get('/game', function (req, res) {
    res.sendfile(__dirname + '/public/controller.html');
});

// Create a unique Socket.IO Room
var game_id = ( Math.random() * 100000 ) | 0;

io.sockets.on('connection', function (socket) {
    
    var addedUser = false;
    
    socket.on('game_start', function () {
        socket.emit('newGameCreated', {gameId: game_id, SocketId: socket.id});
        socket.join(game_id.toString());
    });

    socket.on('add user', function (player_name) { 
        if (addedUser) return;
        var player_id = ( Math.random() * 1000 ) | 0;
        socket.username = player_name;
        game_players[player_id] = player_name;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers,
            game_player_id: player_id
        });
        socket.broadcast.emit('new player', {
            game_player_name: socket.username,
            game_player_id: player_id
        });


        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers,
            game_players: game_players,
            game_id: game_id 
        });

        socket.on('left move', function (controller_id) {
            socket.broadcast.emit('left move', {player_id: controller_id});
         });

        socket.on('right move', function (controller_id) {
            socket.broadcast.emit('right move', {player_id: controller_id});
         }); 
        
    });

});