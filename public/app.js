$(function($){
    
    var socket = io.connect();
    FastClick.attach(document.body);

    $('canvas').css("display","none");
    $('#url_info').hide();
    $('#game_info').hide();

    $('#btn_startGame').on('click', function(){
        socket.emit('game_start');
        $('#url_info').show();
        $('#btn_startGame').remove();
    });

    socket.on('newGameCreated', function (data) {
        $('#gameURL').text("http://localhost:3000/game");
        $('#gameID').html("<h2>" + data.gameId + "</h2>")
        // var key = data.gameId;
        
        // var QR = '<a href="http://192.168.1.70:3000/game/' + key + '"><img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=http://192.168.1.70:3000/game/' + key + '&choe=UTF-8" alt=""/></a>';

        // $('#gameID').html(QR);

    });

    socket.on('user joined', function (data) {
        $('#url_info').hide();
        $('canvas').css("display","block");
        $('#game_info').show();
        // $('#num_player').html("<p>" + data.numUsers + " players</p>");
        $('#player_list').empty();
        var playerCount = 0;
        for (var key in data.game_players) {
            if (data.game_players.hasOwnProperty(key)) {
                $('#player_list').append("<p>" + key + " -> " + data.game_players[key] + "</p>");
                ++playerCount;
                
            }
        }
        $('#num_player').html("<p>" + playerCount + " players</p>");
        // for (var i = 0; i < data.game_players.length; i++) {
        //     $('#player_list').append("<p>" + data.game_players[i] + "</p>");
        // }
        $('#game_id').html("<h1>Game Code: " + data.game_id + " </h1>")
    });

   
    
});
