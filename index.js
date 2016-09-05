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
var game_players = [];

app.get('/game', function (req, res) {
    // var key = req.params.key;
    // console.log(key);
    // res.render('controller.html', {key:key});
    res.sendfile(__dirname + '/public/controller.html');

});

// Create a unique Socket.IO Room
var game_id = ( Math.random() * 100000 ) | 0;

io.sockets.on('connection', function (socket) {
    
    var addedUser = false;
    
    socket.on('game_start', function () {
        socket.emit('newGameCreated', {gameId: game_id, SocketId: socket.id});
        // Join the Room and wait for the players
        socket.join(game_id.toString());
    });

    socket.on('add user', function (player_name) { 
        if (addedUser) return;
        socket.username = player_name;
        game_players.push(socket.username);
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers

        });

        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers,
            game_players: game_players,
            game_id: game_id 
        });

        socket.on('left move', function () {
            socket.broadcast.emit('left move');
         });

        socket.on('right move', function () {
            socket.broadcast.emit('right move');
         }); 
        
    });

});
