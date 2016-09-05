$(function($){
    
    var socket = io.connect();
    $('#controller').hide();

    $('#btn_start').on('click', function(){
        var player_name = $('#input_player_name').val();
        var gameID_user = $('#input_game_id').val();
        socket.emit('add user', player_name);
        // $('#user_form').remove();
    });

     socket.on('login', function (data) { 
         $('#user_form').remove();
         $('#controller').show();
     });    

     $('#btn_left').on('click', function(){
          socket.emit('left move');
     });
     $('#btn_right').on('click', function(){
          socket.emit('right move');
     });

    
});
