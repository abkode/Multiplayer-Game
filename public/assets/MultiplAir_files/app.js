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
        // $('#gameURL').text("http://mpair.herokuapp.com/game");
        $('#gameURL').text("http://bit.do/mpair");
        var key = data.gameId;
        // var QR = '<a href="http://mpair.herokuapp.com/game"><img src="https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=http://mpair.herokuapp.com/game&choe=UTF-8" alt=""/></a>';
        var QR = '<a href="http://bit.do/mpair"><img src="https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=http://bit.do/mpair&choe=UTF-8" alt=""/></a>';
        $('#qr').html(QR);
        $('#gameID').html("<h1>" + data.gameId + "</h1>");
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
        $('#num_player').html("<h3><img src='assets/user_icon.png' />  " + playerCount + "</h3>");
        // for (var i = 0; i < data.game_players.length; i++) {
        //     $('#player_list').append("<p>" + data.game_players[i] + "</p>");
        // }
        $('#game_id').html("<h1>" + data.game_id + " <img src='assets/game_icon.png' width='100px' /></h1>");
        $('#game_id').append("<h2 style='text-shadow: 1px 1px 11px rgba(0, 0, 0, 0.7)'><span class='glyphicon glyphicon-link' aria-hidden='true'></span> http://bit.do/mpair</h2><br />");
    });

   
    
});
