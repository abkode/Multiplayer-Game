$(function($){
    
    var socket = io.connect();
    $('#controller').hide();

    $('#btn_start').on('click', function(){
        var player_name = $('#input_player_name').val();
        var gameID_user = $('#input_game_id').val();
        socket.emit('add user', player_name);
        
        socket.on('login', function (data) { 
            $('#user_form').remove();
            $('#controller').show();

            var joystick = new VirtualJoystick({
                // container: document.getElementById('controller'),
                mouseSupport: true,
                // stationaryBase: true,
                // baseX: 175,
                // baseY: 200,
                // limitStickTravel: true,
                // stickRadius: 100
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
            
            for (var key in targetObject) {
                if (targetObject.hasOwnProperty(key)) {
                    if (key == playerId) {
                        targetId = targetObject[key];
                    }
                    
                }
            }
            
            $('#target').html("<img src=" + allplayers[targetId].ballColor + " />");
            $('#target').append("<h1>You are:</h1>");
            $('#target').append("<img src=" + allplayers[playerId].ballColor + " />");

         });
       
   
        });

    });

    // $('#btn_left').on('click', function(){
    //     $("body").trigger({
    //             type: 'keydown',
    //             which: 37,
    //             keyCode: 37
    //         });
    // });
    // $('#btn_right').on('click', function(){
    //     $("body").trigger({
    //             type: 'keydown',
    //             which: 39,
    //             keyCode: 39
    //         });
    // });

     // $("body").keydown(function(e) {
     //     if(e.keyCode == 37) { // left 
     //        var controller_id =  $('#controller_id').val();
     //        socket.emit('left move', controller_id);
     //     }
     //     else if(e.keyCode == 39) { // right
     //        var controller_id =  $('#controller_id').val();
     //        socket.emit('right move', controller_id);
     //     }
     //  });
    

// });
