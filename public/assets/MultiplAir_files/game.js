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
var battleMusic;
var captureSound;
var SPAWN_PLAYER_SEPERATION = 200;


 
var ballColors = {1 : 'assets/pokomon/azumarill.png',
  2: 'assets/pokomon/charizard.png',
  3: 'assets/pokomon/pikachu.png',
  4: 'assets/pokomon/bulbasaur.png',
  5: 'assets/pokomon/camerupt.png',
  6: 'assets/pokomon/chansey.png',
  7: 'assets/pokomon/clefable.png',
  8: 'assets/pokomon/croconaw.png',
  9: 'assets/pokomon/dedenne.png',
  10: 'assets/pokomon/deoxys.png',
  11: 'assets/pokomon/gengar.png',
  12: 'assets/pokomon/golduck.png',
  13: 'assets/pokomon/golem.png',
  14: 'assets/pokomon/grotle.png',
  15: 'assets/pokomon/growlithe.png',
  16: 'assets/pokomon/ivysaur.png',
  17: 'assets/pokomon/purugly.png',
  18: 'assets/pokomon/quiladin.png',
  19: 'assets/pokomon/shiftry.png',
  20: 'assets/pokomon/slurpuff.png',
  21: 'assets/pokomon/snorlax.png',
  22: 'assets/pokomon/squirtle.png',
  23: 'assets/pokomon/teddiursa.png',
  24: 'assets/pokomon/wartortle.png',
  25: 'assets/pokomon/whirlipede.png',
  26: 'assets/pokomon/zhubat.png',
  27: 'assets/pokomon/starmie.png',
  28: 'assets/pokomon/mewtwo.png',
  29: 'assets/pokomon/gyarados.png',
  30: 'assets/pokomon/zapdos.png',
  31: 'assets/pokomon/electabuzz.png',
  32: 'assets/pokomon/caterpie.png',
  33: 'assets/pokomon/diglett.png',
  34: 'assets/pokomon/kecleon.png',
  35: 'assets/pokomon/dwebble.png',
  36: 'assets/pokomon/mew.png',
  37: 'assets/pokomon/swalot.png',
  38: 'assets/pokomon/slowpoke.png',
  39: 'assets/pokomon/simisage.png',
  40: 'assets/pokomon/onix.png',
  41: 'assets/pokomon/burmy.png',
  42: 'assets/pokomon/pansear.png',
  43: 'assets/pokomon/kangaskhan.png',
  44: 'assets/pokomon/tympole.png',
  45: 'assets/pokomon/seaking.png',
  46: 'assets/pokomon/goodra.png',
  47: 'assets/pokomon/dewott.png',
  48: 'assets/pokomon/riolu.png',
  49: 'assets/pokomon/hoppip.png',
  50: 'assets/pokomon/magby.png'
 
};
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

  game.load.image(ballColors[1],'assets/pokomon/azumarill.png');
  game.load.image(ballColors[2],'assets/pokomon/charizard.png');
  game.load.image(ballColors[3],'assets/pokomon/pikachu.png');
  game.load.image(ballColors[4],'assets/pokomon/bulbasaur.png');
  game.load.image(ballColors[5],'assets/pokomon/camerupt.png');
  game.load.image(ballColors[6],'assets/pokomon/chansey.png');
  game.load.image(ballColors[7],'assets/pokomon/clefable.png');
  game.load.image(ballColors[8],'assets/pokomon/croconaw.png');
  game.load.image(ballColors[9],'assets/pokomon/dedenne.png');
  game.load.image(ballColors[10],'assets/pokomon/deoxys.png');
  game.load.image(ballColors[11],'assets/pokomon/gengar.png');
  game.load.image(ballColors[12],'assets/pokomon/golduck.png');
  game.load.image(ballColors[13],'assets/pokomon/golem.png');
  game.load.image(ballColors[14],'assets/pokomon/grotle.png');
  game.load.image(ballColors[15],'assets/pokomon/growlithe.png');
  game.load.image(ballColors[16],'assets/pokomon/ivysaur.png');
  game.load.image(ballColors[17],'assets/pokomon/purugly.png');
  game.load.image(ballColors[18],'assets/pokomon/quiladin.png');
  game.load.image(ballColors[19],'assets/pokomon/shiftry.png');
  game.load.image(ballColors[20],'assets/pokomon/slurpuff.png');
  game.load.image(ballColors[21],'assets/pokomon/snorlax.png');
  game.load.image(ballColors[22],'assets/pokomon/squirtle.png');
  game.load.image(ballColors[23],'assets/pokomon/teddiursa.png');
  game.load.image(ballColors[24],'assets/pokomon/wartortle.png');
  game.load.image(ballColors[25],'assets/pokomon/whirlipede.png');
  game.load.image(ballColors[26],'assets/pokomon/zhubat.png');
  game.load.image(ballColors[27],'assets/pokomon/starmie.png');
  game.load.image(ballColors[28],'assets/pokomon/mewtwo.png');
  game.load.image(ballColors[29],'assets/pokomon/gyarados.png');
  game.load.image(ballColors[30],'assets/pokomon/zapdos.png');
  game.load.image(ballColors[31],'assets/pokomon/electabuzz.png');
  game.load.image(ballColors[32],'assets/pokomon/caterpie.png');
  game.load.image(ballColors[33],'assets/pokomon/diglett.png');
  game.load.image(ballColors[34],'assets/pokomon/kecleon.png');
  game.load.image(ballColors[35],'assets/pokomon/dwebble.png');
  game.load.image(ballColors[36],'assets/pokomon/mew.png');
  game.load.image(ballColors[37],'assets/pokomon/swalot.png');
  game.load.image(ballColors[38],'assets/pokomon/slowpoke.png');
  game.load.image(ballColors[39],'assets/pokomon/simisage.png');
  game.load.image(ballColors[40],'assets/pokomon/onix.png');
  game.load.image(ballColors[41],'assets/pokomon/burmy.png');
  game.load.image(ballColors[42],'assets/pokomon/pansear.png');
  game.load.image(ballColors[43],'assets/pokomon/kangaskhan.png');
  game.load.image(ballColors[44],'assets/pokomon/tympole.png');
  game.load.image(ballColors[45],'assets/pokomon/seaking.png');
  game.load.image(ballColors[46],'assets/pokomon/goodra.png');
  game.load.image(ballColors[47],'assets/pokomon/dewott.png');
  game.load.image(ballColors[48],'assets/pokomon/riolu.png');
  game.load.image(ballColors[49],'assets/pokomon/hoppip.png');
  game.load.image(ballColors[50],'assets/pokomon/magby.png');
  game.load.audio('backgroundMusic', 'assets/music/PokemonMainTheme.mp3');
  game.load.audio('captureSoundEffect', 'assets/music/PokemonCapture.mp3');
  game.load.audio('battleMusic', 'assets/music/PokemonBattle.mp3');

  game.load.image('background', 'assets/mario.jpg');
 
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
  var snakeHead = generateSnakeHeadForPlayer(location,ballColorString, name);
  var snakeSection = new Array();
  var snakePath = new Array();
  var playerObject = createPlayerObject(name,ballColorString,snakeHead,snakeSection,snakePath);
  // var playerObject = createPlayerObject(name,ballColorString);
  players[id] = playerObject;

}
function generateSnakeHeadForPlayer(location,ballColorString, name)
{
  var snakeHead = game.add.sprite(location.x, location.y, ballColorString);
  var playerLabelStyle = { font: "30px Arial", fill: "#ffffff", align: "center" };  
  var label_name = game.add.text(0, -42, name, playerLabelStyle);
  label_name.anchor.set(0.5);

  snakeHead.addChild(label_name);

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

function getAllPlayers(playerObj) {
  var allplayers = {};
  for(var id in playerObj){
    var playertemp = playerObj[id];
    var player = {name: playertemp.name, ballColor: playertemp.ballColor};
    allplayers[id] = player;
    // console.log(newplayers);
  }
return allplayers;
 
}

function create() {

  backgroundMusic = this.game.add.audio('backgroundMusic');
  captureSound = this.game.add.audio('captureSoundEffect');
  battleMusic = this.game.add.audio('battleMusic');

  backgroundMusic.volume = 0.3;
  captureSound.volume = 2;

  backgroundMusic.loop = true;
  battleMusic.loop = true;

  backgroundMusic.play();

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
  //  socket.emit('player created', onNewPlayerfunction); 
   socket.on('new player', onNewPlayerfunction);
   socket.on('move', onMove);
   socket.on('disconnected client',onDisconnectedClient);

}
var onDisconnectedClient = function (data) {
  // console.log(data.client_id); 
  // console.log("client id:  ",targets.findNode(data.client_id));
  // if (targets.findNode(data.client_id) !== undefined)
  // {

    console.log(targets);
    targets.deleteNode(data.client_id);
    console.log(targets);
    var snakeBodySprites = players[data.client_id].snakeSection;

    snakeBodySprites.forEach(body => {  
      body.kill();
    });
    var snakeHead = players[data.client_id].snakeHead.kill();

    var trg = targets.flattenTargets(); 
    var allplayerobj = getAllPlayers(players);
    
    socket.emit('targets', {trg: trg, allplayerobj: allplayerobj});  

  // }
}


var onMove = function (movement_data) {
  //debugger;
  // console.log('controller id from game:  ' + movement_data.controller_id);
  // console.log('controller x from game:  ' + movement_data.deltaX);
  // console.log('controller y from game:  ' + movement_data.deltaY);
  players[movement_data.controller_id].snakeHead.body.velocity.setTo(movement_data.deltaX*5,movement_data.deltaY*5);
}  
function generateRandomPointGivenSeperation(x,y,seperation)
{

  do {

    genRandX = game.world.randomX;
    genRandY = game.world.randomY;

  } while(((Math.abs(genRandX - x) < seperation) && (Math.abs(genRandX - x) < seperation)))

  return new Phaser.Point(genRandX, genRandY);

}
function generatePlayerSpawnPoint()
{

  if(targets._length == 0) {

    return new Phaser.Point(game.world.randomX, game.world.randomY);

  }else if(targets._length == 1) {
    // console.log(players[targets.head.data].snakeHead.x);
    // console.log(players[targets.head.data].snakeHead.y);
    return(generateRandomPointGivenSeperation(players[targets.head.data].snakeHead.x,players[targets.head.data].snakeHead.y,SPAWN_PLAYER_SEPERATION));

  } else {

    var phaserPoint;

    do {

      phaserPoint = generateRandomPointGivenSeperation(players[targets.head.data].snakeHead.x,players[targets.head.data].snakeHead.y,SPAWN_PLAYER_SEPERATION);

    } while( (Math.abs((players[targets.tail.data].snakeHead.x - phaserPoint.x)) < SPAWN_PLAYER_SEPERATION) && (Math.abs((players[targets.tail.data].snakeHead.y - phaserPoint.y)) < SPAWN_PLAYER_SEPERATION));

    // console.log(players[targets.head.data].snakeHead.x);
    // console.log(players[targets.head.data].snakeHead.y);

    // console.log(players[targets.head.data].snakeHead.x);
    // console.log(players[targets.head.data].snakeHead.y);
    return(phaserPoint);

  } 
  
    
}

var onNewPlayerfunction = function(data) {


  console.log("new player socket called");
  var spawnPoint = generatePlayerSpawnPoint();

  console.log(spawnPoint.x,spawnPoint.y);

  //createNewPlayer(data.game_player_id, data.game_player_name, ballColors[icon_index],new Phaser.Point(game.world.randomX, game.world.randomY));

  createNewPlayer(data.game_player_id, data.game_player_name, ballColors[icon_index],spawnPoint);

  targets.insertNodeAtTail(data.game_player_id);
 
  var trg = targets.flattenTargets(); 
  var allplayerobj = getAllPlayers(players);
  socket.emit('targets', {trg: trg, allplayerobj: allplayerobj});

 if(targets._length > 2) {

   if (backgroundMusic.isPlaying) {
      backgroundMusic.stop();
      battleMusic.play();
    }
  }
  // num += 50;
  icon_index += 1;
}

function update() {

  Object.keys(players).forEach(key => {  
    //players[key].snakeHead.body.velocity.setTo(0, 0);
    //players[key].snakeHead.body.angularVelocity = 0;
    //players[key].snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(players[key].snakeHead.angle, 300));
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

  captureSound.play();
  //-----duplicate sectionTobeAppended-----
  //add the snake head
  var copyOfSnakeHead = game.add.sprite(sectionToAppendObj.snakeHead.x,sectionToAppendObj.snakeHead.y,sectionToAppendObj.snakeHead.key);

  copyOfSnakeHead.scale.setTo(0.6, 0.6);
  copyOfSnakeHead.anchor.setTo(0.2,0.2);
 
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
    section.scale.setTo(0.6, 0.6);
    section.anchor.setTo(0.2,0.2);
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
      appendSnakeSection(game_player_id_one, game_player_id_two);
        // var trg = targets.flattenTargets();  
        // socket.emit('targets', trg);
        var trg = targets.flattenTargets(); 
        var allplayerobj = getAllPlayers(players);
        socket.emit('targets', {trg: trg, allplayerobj: allplayerobj});


    }else if(game_player_two_node.next.data == game_player_id_one) {
      targets.deleteNode(game_player_id_one);
      appendSnakeSection(game_player_id_two, game_player_id_one)
        
        // var trg = targets.flattenTargets();  
        // socket.emit('targets', trg);
        var trg = targets.flattenTargets(); 
        var allplayerobj = getAllPlayers(players);
        socket.emit('targets', {trg: trg, allplayerobj: allplayerobj});    
    }

  } 

  if(targets._length < 3) {

    if (battleMusic.isPlaying) {
      battleMusic.stop();
      backgroundMusic.play();

    }
  }

}
function render() {

};

