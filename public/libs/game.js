// Snake by Patrick OReilly and Richard Davey
// Twitter: @pato_reilly Web: http://patricko.byethost9.com
var game = new Phaser.Game(
  window.screen.availWidth * window.devicePixelRatio,
  window.screen.availHeight * window.devicePixelRatio, 
  Phaser.CANVAS, 
  '#game', 
  { preload: preload, create: create, update: update,render : render }
 );

var players = {};
var num = 100;
var icon_index = 1;
var snakeSpacer = 10;
var socket;
var backgroundMusic;
var shrinkSound;

 
var ballColors = {1 : 'blue',2: 'green',3: 'red',4: 'green',5: 'yellow',6: 'orange',7: 'brown',8: ''};
var targets = new LinkedList();

function preload() {



  // game.load.image(ballColors[1],'assets/orb-blue.png');
  // game.load.image(ballColors[2],'assets/orb-green.png');
  // game.load.image(ballColors[3],'assets/orb-red.png');
  // game.load.image(ballColors[4],'assets/orb-blue.png');
  // game.load.image(ballColors[5],'assets/orb-green.png');
  // game.load.image(ballColors[6],'assets/orb-red.png');
  // game.load.image(ballColors[7],'assets/orb-blue.png');
  // game.load.image(ballColors[8],'assets/orb-green.png');
  // game.load.image(ballColors[9],'assets/orb-red.png');
  // game.load.image(ballColors[10],'assets/orb-red.png');
  // game.load.image(ballColors[11],'assets/orb-blue.png');
  // game.load.image(ballColors[12],'assets/orb-green.png');
  // game.load.image(ballColors[13],'assets/orb-red.png');

  game.load.image(ballColors[1],'assets/tuna-icon.png');
  game.load.image(ballColors[2],'assets/Bee-icon.png');
  game.load.image(ballColors[3],'assets/Fish-icon.png');
  game.load.image(ballColors[4],'assets/seal-icon.png');
  game.load.image(ballColors[5],'assets/Snake-icon.png');
  game.load.image(ballColors[6],'assets/tropical-fish-icon.png');
  game.load.image(ballColors[7],'assets/whale-icon.png');

  game.load.audio('backgroundMusic', 'assets/supermario.mp3');
  game.load.audio('shrink', 'assets/shrink.wav');
  game.load.audio('hurry', 'assets/hurry.mp3');

  game.load.image("background", "assets/mario.jpg");
 
}
function getAlivePlayers() 
{

  var alivePlayers = Object.keys(players).map(function(playerKey) {

    if(players[playerKey].snakeHead.alive === true);
    return(playerKey);

  });

  return(alivePlayers);

}
function createNewPlayer(id,name,ballColorString,location)
{
  var snakeHead = generateSnakeHeadForPlayer(location,ballColorString);
  var snakeSection = new Array();
  var snakePath = new Array();
  var playerObject = createPlayerObject(name,ballColorString,snakeHead,snakeSection,snakePath);
  players[id] = playerObject;

}
function generateSnakeHeadForPlayer(location,ballColorString)
{
  var snakeHead = game.add.sprite(location.x, location.y, ballColorString);
  snakeHead.anchor.setTo(0.5, 0.5);
  game.physics.enable(snakeHead, Phaser.Physics.ARCADE);
  snakeHead.body.collideWorldBounds = true;
  //snakeHead.body.bounce.set(2);
  return snakeHead;
}

function createPlayerObject(name,ballColorString,snakeHead,snakeSection,snakePath)
{
  return({name: name, ballColor: ballColorString, snakeHead: snakeHead, snakeSection: snakeSection, snakePath: snakePath});
}

function createCollisionDetection()
{

  var playerKeyArray = Object.keys(players);
  for(x=0; x < playerKeyArray.length; x+=1)
  {
   for(y=(x+1); y < playerKeyArray.length; y+=1)
   {
     game.physics.arcade.collide(players[playerKeyArray[x]].snakeHead, players[playerKeyArray[y]].snakeHead, collisionCallback,null,this);
   }

  }

}
function create() {


  backgroundMusic = this.game.add.audio('backgroundMusic');
  shrinkSound = this.game.add.audio('shrink');
  hurryMusic = this.game.add.audio('hurry');

  backgroundMusic.volume = 0.3;
  backgroundMusic.loop = true;
  backgroundMusic.play();

  //game.stage.backgroundColor = "#2B2B2B";
  background = game.add.tileSprite(0, 0, 1920, 1200, "background");

  socket = io.connect();

  

  game.physics.startSystem(Phaser.Physics.ARCADE);

  game.world.setBounds(0, 0,
    window.screen.availWidth * window.devicePixelRatio, 
    window.screen.availHeight * window.devicePixelRatio);


  cursors = game.input.keyboard.createCursorKeys();

  //console log all of the players in the game
  Object.keys(players).forEach(key => {  
    console.log(players[key].name);
  });

  setEventHandlers();
}

var setEventHandlers = function () {
 
   socket.on('new player', onNewPlayerfunction);

}

var onNewPlayerfunction = function(data) {

  console.log("new player socket called many times!!!!!!!!");
  createNewPlayer(data.game_player_id, data.game_player_name, ballColors[icon_index],new Phaser.Point(300,300));
  targets.insertNodeAtTail(data.game_player_id);


 if(targets._length > 2) {

   if (backgroundMusic.isPlaying) {

      backgroundMusic.fadeOut();
      hurryMusic.loop = true;
      hurryMusic.fadeIn();
    }
  }

  num += 50;
  icon_index += 1;

}

function update() {

  Object.keys(players).forEach(key => {  
    players[key].snakeHead.body.velocity.setTo(0, 0);
    players[key].snakeHead.body.angularVelocity = 0;

    players[key].snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(players[key].snakeHead.angle, 300));
 
    //Part of the slither animation
    if (players[key].snakeSection.length > 0 && players[key].snakeHead.alive === true) {
      
      var part = players[key].snakePath.pop();
      part.setTo(players[key].snakeHead.x, players[key].snakeHead.y);
      players[key].snakePath.unshift(part);

      for (var i = 0; i < players[key].snakeSection.length; i++)
      {
        players[key].snakeSection[i].x = (players[key].snakePath[(i+1) * snakeSpacer]).x;
        players[key].snakeSection[i].y = (players[key].snakePath[(i+1) * snakeSpacer]).y;
      }

    }
  });

  socket.on('left move', function (data) {    
         players[data.player_id].snakeHead.body.angularVelocity = -300000;
         //players[data.player_id].snakeHead.body.velocity-3000000; 

  }); 

  socket.on('right move', function (data) {
         players[data.player_id].snakeHead.body.angularVelocity = 300000;
         //players[data.player_id].snakeHead.body.velocity.setTo(100,0);//300000;
  });     

  createCollisionDetection();

}
function getPlayerKeyFromSnakeHead(snakeHead)
{
  var playerKey;

  Object.keys(players).forEach(key => {
    if (players[key].snakeHead === snakeHead) {
      playerKey = key;
    }
  });

  return playerKey;
}
function appendSnakeSection(sectionKey, sectionToAppendKey)
{
    //Ugly code need to clean up
  var snakePathToAppend = [];
  var snakePathToAppend2 = [];
  var sectionObj = players[sectionKey];
  var sectionToAppendObj = players[sectionToAppendKey];

  shrinkSound.play();

  //-----duplicate sectionTobeAppended-----
  //add the snake head
  var copyOfSnakeHead = game.add.sprite(sectionToAppendObj.snakeHead.x,sectionToAppendObj.snakeHead.y,sectionToAppendObj.snakeHead.key);
  copyOfSnakeHead.anchor.setTo(0.5,0.5);
 
  sectionObj.snakeSection.push(copyOfSnakeHead);
  for(var i = 0; i <= (snakeSpacer*(1+sectionToAppendObj.snakeSection.length)); i++)
  {
    snakePathToAppend[i] = new Phaser.Point(sectionToAppendObj.snakeHead.x,sectionToAppendObj.snakeHead.y);
  }

  sectionObj.snakePath = sectionObj.snakePath.concat(snakePathToAppend);

  for(var x = 0; x < sectionToAppendObj.snakeSection.length; x++)
  {

    var section = game.add.sprite(sectionToAppendObj.snakeHead.x, sectionToAppendObj.snakeHead.y,sectionToAppendObj.snakeSection[x].key);
    snakePathToAppend2[x] = new Phaser.Point(sectionToAppendObj.snakeHead.x,sectionToAppendObj.snakeHead.y);
    section.anchor.setTo(0.5,0.5);
    sectionObj.snakeSection.push(section);
    sectionToAppendObj.snakeSection[x].kill();
  }
  sectionObj.snakePath = sectionObj.snakePath.concat(snakePathToAppend2);
  sectionToAppendObj.snakeHead.kill();

}
function collisionCallback(snakeHead1, snakeHead2) 
{

  var game_player_id_one = getPlayerKeyFromSnakeHead(snakeHead1);
  var game_player_id_two = getPlayerKeyFromSnakeHead(snakeHead2);

  game_player_one_node = targets.findNode(game_player_id_one);
  game_player_two_node = targets.findNode(game_player_id_two);

  if(targets._length > 2) {

    if(game_player_one_node.next.data == game_player_id_two)
    {
      targets.deleteNode(game_player_id_two);
      appendSnakeSection(game_player_id_one, game_player_id_two)
    }else if(game_player_two_node.next.data == game_player_id_one) {
      targets.deleteNode(game_player_id_one);
      appendSnakeSection(game_player_id_two, game_player_id_one)
    } 
  }

}
function render() {


}