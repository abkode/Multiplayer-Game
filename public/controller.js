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

             var deltaX = 0;
             var deltaY = 0;

            setInterval(function() {

                if(deltaX != joystick.deltaX() || deltaY != joystick.deltaY()) {

                    if(deltaX != joystick.deltaX()) {

                        deltaX = joystick.deltaX();

                    }
                    
                    if(deltaY != joystick.deltaY()) {

                        deltaY = joystick.deltaY();

                    }

                    socket.emit('move', {controller_id: id, deltaX: deltaX, deltaY: deltaY});
     
                }
              
            }, 250);

        });
        socket.on('update targets', function (data) {

            var targetId;
            var allplayers = data.allplayerobj;
            var targetObject = data.trg;
            var playerId = $('#controller_id').val();
            // debugger;
            for (var key in targetObject) {
                if (targetObject.hasOwnProperty(key)) {
                    if (key == playerId) {
                        targetId = targetObject[key];
                        // // vibration API supported
                        if (window.navigator && window.navigator.vibrate) { 
                            navigator.vibrate(1000) 
                        };
                    ;}
                    
                };
            };
            
            if (targetId != undefined) {
                $('#target').html("<h1>Target</h1> <br>");
                 $('#target').append("<img id='img_trg' src='../assets/target.png' />");    
                $('#target').append("<img src=" + allplayers[targetId].ballColor + " />");
                $('#target').append("<br><br><h1>You</h1>");
                $('#target').append("<img src=" + allplayers[playerId].ballColor + " />");
                // $('#target').append("<br><input type='button' id='btn_exit' value='exit'>");
            } else {
                $('canvas').remove();
                $('#target').empty();
                $('#target').html("<h1> Oh you died ! </h1>");
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

