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
    
    socket.on('targets', function (data) {   
        socket.broadcast.emit('update targets', data);
        // socket.broadcast.emit('update targets',  trg );
    });

    socket.on('game_start', function () {
        game_players = {};
        socket.emit('newGameCreated', {gameId: game_id, SocketId: socket.id});
        socket.join(game_id.toString());
    });

    socket.on('add user', function (data) { 
        if (data.game_id == game_id) {
            console.log("add user called!!!!!!!!!!!!!!!!!!!!");
            if (addedUser) return;
            // var player_id = ( Math.random() * 1000 ) | 0;
            var player_id = socket.id;
            socket.username = data.player_name;
            game_players[player_id] = data.player_name;
            numUsers = numUsers + 1;
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

            socket.on('death player', function (data) {
                delete game_players[data.player_id];
                numUsers = numUsers - 1;
                socket.broadcast.emit('user joined', {
                    numUsers: numUsers,
                    game_players: game_players,
                    game_id: game_id 
                });
                
            }); 

            socket.on('move', function (controller_data) {
                // console.log('move called!');
                // console.log('controller_id',controller_data.controller_id);
                // console.log('server deltaX',controller_data.deltaX);
                // console.log('server deltaY',controller_data.deltaY);
                socket.broadcast.emit('move', controller_data);
            });
                //{controller_id: controller_id, deltaX: joystick.deltaX(), deltaY: joystick.deltaY()});
            socket.on('left move', function (controller_id) {
                socket.broadcast.emit('left move', {player_id: controller_id});
            });
            socket.on('right move', function (controller_id) {
                socket.broadcast.emit('right move', {player_id: controller_id});
            }); 
               socket.on('disconnect', function () {
                    console.log('disconnected !!!!!!!!');
                    delete game_players[socket.id];
                    numUsers = numUsers - 1;
                    console.log(numUsers);
                    socket.broadcast.emit('user joined', {
                        numUsers: numUsers,
                        game_players: game_players,
                        game_id: game_id 
                    });
                    var client_id = socket.id;
                    socket.broadcast.emit('disconnected client', {
                        client_id: client_id
                    });

                });
        }else {
             socket.emit('Wrong Game ID');
        };
    });



});

