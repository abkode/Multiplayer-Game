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
app.use(express.static(__dirname + '/pub_2'));

var numUsers = 0;
var game_players = [];

app.get('/game', function (req, res) {
    // var key = req.params.key;
    // console.log(key);
    // res.render('controller.html', {key:key});
    res.sendfile(__dirname + '/pub_2/controller.html');

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

// Chatroom

// var numUsers = 0;

// io.on('connection', function (socket) {
//   var addedUser = false;

//   // when the client emits 'new message', this listens and executes
//   socket.on('new message', function (data) {
//     // we tell the client to execute 'new message'
//     socket.broadcast.emit('new message', {
//       username: socket.username,
//       message: data
//     });
//   });

//   // when the client emits 'add user', this listens and executes
//   socket.on('add user', function (username) {
//     if (addedUser) return;

//     // we store the username in the socket session for this client
//     socket.username = username;
//     ++numUsers;
//     addedUser = true;
//     socket.emit('login', {
//       numUsers: numUsers
//     });
//     // echo globally (all clients) that a person has connected
//     socket.broadcast.emit('user joined', {
//       username: socket.username,
//       numUsers: numUsers
//     });
//   });

//   // when the client emits 'typing', we broadcast it to others
//   socket.on('typing', function () {
//     socket.broadcast.emit('typing', {
//       username: socket.username
//     });
//   });

//   // when the client emits 'stop typing', we broadcast it to others
//   socket.on('stop typing', function () {
//     socket.broadcast.emit('stop typing', {
//       username: socket.username
//     });
//   });

//   // when the user disconnects.. perform this
//   socket.on('disconnect', function () {
//     if (addedUser) {
//       --numUsers;

//       // echo globally that this client has left
//       socket.broadcast.emit('user left', {
//         username: socket.username,
//         numUsers: numUsers
//       });
//     }
//   });
// });