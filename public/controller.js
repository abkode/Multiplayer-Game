$(function($){
    
    var socket = io.connect();
    $('#controller').hide();

    $('#btn_start').on('click', function(){
        var player_name = $('#input_player_name').val();
        var gameID_user = $('#input_game_id').val();
        socket.emit('add user', {player_name: player_name, game_id: gameID_user});
        
        socket.on('login', function (data) { 
            $('#user_form').remove();
            $('#controller').show();

            var joystick = new VirtualJoystick({
                // container: document.getElementById('controller'),
                mouseSupport: true,
                // stationaryBase: true,
                // baseX: 175,
                // baseY: 200,
                limitStickTravel: true,
                stickRadius: 100
            });

            var id = data.game_player_id;
            $('#controller_id').val(id);

             setInterval(function() {
                var outputEl  = document.getElementById('result');
                socket.emit('move', {controller_id: id, deltaX: joystick.deltaX(), deltaY: joystick.deltaY()});
                //console.log( joystick.deltaX(), joystick.deltaY())
            // outputEl.innerHTML  = '<b>Result:</b> '
            //   + ' dx:'+joystick.deltaX()
            //   + ' dy:'+joystick.deltaY()
            //   + (joystick.right() ? ' right'  : '')s
            //   + (joystick.up()  ? ' up'   : '')
            //   + (joystick.left()  ? ' left' : '')
            //   + (joystick.down()  ? ' down'   : '') 
            },  1/10 * 1000);

        });
        socket.on('update targets', function (data) {
            var targetId;
            var allplayers = data.allplayerobj;
            var targetObject = data.trg;
            var playerId = $('#controller_id').val();
            debugger;
            for (var key in targetObject) {
                if (targetObject.hasOwnProperty(key)) {
                    if (key == playerId) {
                        targetId = targetObject[key];
                    }
                    
                }
            }
            
            if (targetId != undefined) {
                $('#target').html("Your Target <br>");    
                $('#target').append("<img src=" + allplayers[targetId].ballColor + " />");
                $('#target').append("<h1>You are:</h1>");
                $('#target').append("<img src=" + allplayers[playerId].ballColor + " />");
                // $('#target').append("<br><input type='button' id='btn_exit' value='exit'>");
            } else {
                $('canvas').remove();
                $('#target').empty();
                $('#target').html("<h1> Oh you death ! </h1>");
                $('#target').append("<input type='button' id='btn_restart' value='Play it again'>");
                socket.emit('death player', {player_id: playerId});
            };
            
         });

        });

        $(document).on('click touchstart', '#btn_restart', function () {
            location.reload();
        });

        // $(document).on('click touchstart', '#btn_exit', function () {
        //     // location.reload();
        //     // socket.emit('death player', {player_id: playerId});
        // });

        socket.on('Wrong Game ID', function (data) {
            $('#error_msg').html("<span style='color:red'> Invalid game ID, Try again! </span>");
        });

    });

