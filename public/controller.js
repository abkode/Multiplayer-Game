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
                container: document.getElementById('gamePad'),
                mouseSupport: true,
                stationaryBase: true,
                baseX: 175,
                baseY: 200,
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
                }, 100);

        });
        socket.on('update targets', function (data) {

            var targetId;
            var allplayers = data.allplayerobj;
            var targetObject = data.trg;
            var playerId = $('#controller_id').val();
            
            for (var key in targetObject) {
                if (targetObject.hasOwnProperty(key)) {
                    if (key == playerId) {
                        targetId = targetObject[key];
                        if (window.navigator && window.navigator.vibrate) { 
                            navigator.vibrate(600) 
                        };
                    ;}
                    
                };
            };
    
            if (targetId !== undefined && targetId !== " ") {
                console.log(allplayers, targetId, allplayers[targetId]);

                $('#target').empty();
                $('#target').append("<div class='row'><div class='col-xs-6 text-center'><div style='padding-right:10px; text-align:center'>You <img src=" + allplayers[playerId].ballColor + " style='border:3px solid white; width:130px' /></div></div><div class='col-xs-6 text-center'><div style='padding-right:40px; text-align:center'>Target<img src=" + allplayers[targetId].ballColor + " style='border:3px solid red; width:130px' /></div></div></div>");
                
            }else {
                $('canvas').remove();
                $('#target').empty();
                $('#target').append("<h1> Oh you died ! </h1>");
                $('#target').append("<input type='button' id='btn_restart' class='btn btn-primary' value='Play it again'><br/>");
                socket.emit('death player', {player_id: playerId});

                $(document).on('click touchstart', '#btn_restart', function () {
                    location.reload();
                });
            };
         });

        });

        socket.on('Wrong Game ID', function (data) {
            $('#error_msg').html("<span style='color:red'> Invalid game ID, Try again! </span>");
        });



});

