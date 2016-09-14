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
        $('#gameURL').text("http://multiplair.herokuapp.com/game");
        $('#gameID').html("<h1>" + data.gameId + "</h1>")
        var key = data.gameId;
        
        var QR = '<a href="http://multiplair.herokuapp.com/game"><img src="https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=http://multiplair.herokuapp.com/game&choe=UTF-8" alt=""/></a>';

        $('#gameID').append(QR);
        // $('#qr').html(QR);

    });

    socket.on('user joined', function (data) {
        $('body').css( "padding-top", "0px" );
        $('#overlay').remove();
        $('#page_header').remove();
        $('#page_info').remove();
        $('#url_info').hide();
        $('canvas').css("display","block");
        $('#game_info').show();
        // $('#num_player').html("<p>" + data.numUsers + " players</p>");
        $('#player_list').empty();
        var playerCount = 0;
        for (var key in data.game_players) {
            if (data.game_players.hasOwnProperty(key)) {
                $('#player_list').append("<h3>" + data.game_players[key] + "</h3>");
                ++playerCount;
                
            }
        }
        $('#num_player').html("<h4>" + playerCount + " Players</h4>");
        // for (var i = 0; i < data.game_players.length; i++) {
        //     $('#player_list').append("<p>" + data.game_players[i] + "</p>");
        // }
        $('#game_id').html("<h1>Game Code: " + data.game_id + " </h1>")
    });

   
    
});
