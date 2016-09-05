
// Snake by Patrick OReilly and Richard Davey
// Twitter: @pato_reilly Web: http://patricko.byethost9.com

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update,render : render });

function preload() {

    game.load.image('ball','assets/shinyball.png');
    game.load.image('ball2','assets/pangball.png')

}

var snakeHead; //head of snake sprite
var snakeSection = new Array(); //array of sprites that make the snake body sections
var snakePath = new Array(); //arrary of positions(points) that have to be stored for the path the sections follow
var numSnakeSections = 3; //number of snake body sections
var snakeSpacer = 7; //parameter that sets the spacing between sections

var snake;

function create() {

    snake = game.add.group();
    //snake.enableBody = true;
    //snake.physicsBodyType = Phaser.Physics.ARCADE;
  
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.world.setBounds(0, 0, 800, 600);

    cursors = game.input.keyboard.createCursorKeys();

    snakeHead2 = game.add.sprite(100, 300, 'ball2');
    game.physics.enable(snakeHead2, Phaser.Physics.ARCADE);

    snakeHead = game.add.sprite(400, 300, 'ball');
    snakeHead.anchor.setTo(0.5, 0.5);
    game.physics.enable(snakeHead, Phaser.Physics.ARCADE);
    snake.add(snakeHead);
    //snakeHead.body.collideWorldBounds = true;
    //  Init snakeSection array
    for (var i = 1; i <= numSnakeSections-1; i++)
    {
        snakeSection[i] = game.add.sprite(400, 300, 'ball');
        //game.physics.enable(snakeSection[i], Phaser.Physics.ARCADE);
        //snakeSection[i].body.collideWorldBounds = true;
        snakeSection[i].anchor.setTo(0.5, 0.5);
        snake.add(snakeSection[i]);
    }
    //  Init snakePath array
    for (var i = 0; i <= numSnakeSections * snakeSpacer; i++)
    {
        snakePath[i] = new Phaser.Point(400, 300);
    }

    snakeHead.body.collideWorldBounds = true;
    snakeHead.body.bounce.set(1,1);

}

function update() {

    snakeHead.body.velocity.setTo(0, 0);
    snakeHead.body.angularVelocity = 0;

 
        snakeHead.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(snakeHead.angle, 300));
        // Everytime the snake head moves, insert the new location at the start of the array, 
        // and knock the last position off the end
        var part = snakePath.pop();

        part.setTo(snakeHead.x, snakeHead.y);

        snakePath.unshift(part);

        for (var i = 1; i <= numSnakeSections - 1; i++)
        {
            snakeSection[i].x = (snakePath[i * snakeSpacer]).x;
            snakeSection[i].y = (snakePath[i * snakeSpacer]).y;
        }


    if (cursors.left.isDown)
    {
        snakeHead.body.angularVelocity = -300;
    }
    else if (cursors.right.isDown)
    {
        snakeHead.body.angularVelocity = 300;
    }

  
   game.physics.arcade.collide(snakeHead, snakeHead2, collisionHandler, null, this);
}
function collisionHandler (obj1, obj2) 
{
    console.log("Collision detected");
    snakeHead3 = game.add.sprite(snakeHead2.x, snakeHead2.y, 'ball2');
    //snakeHead3.body.collideWorldBounds 
    snakeHead3.anchor.setTo(0.5, 0.5);
    snakeSection.push(snakeHead3);
    numSnakeSections++;
    snakePath.push(new Phaser.Point(snakeHead3.x, snakeHead3.y));
    snakeHead2.destroy();

    snake.add(snakeHead3);

}

//function checkOverlap(spriteA, spriteB) {

//    var boundsA = spriteA.getBounds();
//    var boundsB = spriteB.getBounds();

//    return Phaser.Rectangle.intersects(boundsA, boundsB);
//}


function render() {

    //game.debug.spriteInfo(snakeHead, 32, 32);

}






// var gameProperties = {
//     screenWidth: 640,
//     screenHeight: 480,
// };

// var states = {
//     game: "game",
// };

// var graphicAssets = {
//     ship:{URL:'ship.png', name:'ship'},
//     bullet:{URL:'bullet.png', name:'bullet'},    
    
//     asteroidLarge:{URL:'assets/asteroidLarge.png', name:'asteroidLarge'},
//     asteroidMedium:{URL:'assets/asteroidMedium.png', name:'asteroidMedium'},
//     asteroidSmall:{URL:'assets/asteroidSmall.png', name:'asteroidSmall'},
// };

// var shipProperties = {
//     startX: gameProperties.screenWidth * 0.5,
//     startY: gameProperties.screenHeight * 0.5,
//     acceleration: 300,
//     drag: 100,
//     maxVelocity: 300,
//     angularVelocity: 200,
// };

// var bulletProperties = {
//     speed: 400,
//     interval: 250,
//     lifeSpan: 2000,
//     maxCount: 30,
// }

// var gameState = function (game){
//     this.shipSprite;
    
//     this.key_left;
//     this.key_right;
//     this.key_thrust;
//     this.key_fire;
    
//     this.bulletGroup;
//     this.bulletInterval = 0;
// };

// gameState.prototype = {
    
//     preload: function () {
//         game.load.image(graphicAssets.asteroidLarge.name, graphicAssets.asteroidLarge.URL);
//         game.load.image(graphicAssets.asteroidMedium.name, graphicAssets.asteroidMedium.URL);
//         game.load.image(graphicAssets.asteroidSmall.name, graphicAssets.asteroidSmall.URL);
        
//         game.load.image(graphicAssets.bullet.name, graphicAssets.bullet.URL);
//         game.load.image(graphicAssets.ship.name, graphicAssets.ship.URL);
//     },
    
//     create: function () {
//         this.initGraphics();
//         this.initPhysics();
//         this.initKeyboard();
//     },

//     update: function () {
//         this.checkPlayerInput();
//         this.checkBoundaries(this.shipSprite);
//         this.bulletGroup.forEachExists(this.checkBoundaries, this);
//     },
    
//     initGraphics: function () {
//         this.shipSprite = game.add.sprite(shipProperties.startX, shipProperties.startY, graphicAssets.ship.name);
//         this.shipSprite.angle = -90;
//         this.shipSprite.anchor.set(0.5, 0.5);
        
//         this.bulletGroup = game.add.group();
//     },
    
//     initPhysics: function () {
//         game.physics.startSystem(Phaser.Physics.ARCADE);
        
//         game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
//         this.shipSprite.body.drag.set(shipProperties.drag);
//         this.shipSprite.body.maxVelocity.set(shipProperties.maxVelocity);
        
//         this.bulletGroup.enableBody = true;
//         this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
//         this.bulletGroup.createMultiple(bulletProperties.maxCount, graphicAssets.bullet.name);
//         this.bulletGroup.setAll('anchor.x', 0.5);
//         this.bulletGroup.setAll('anchor.y', 0.5);
//         this.bulletGroup.setAll('lifespan', bulletProperties.lifeSpan);
//     },
    
//     initKeyboard: function () {
//         this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
//         this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
//         this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
//         this.key_fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
//     },
    
//     checkPlayerInput: function () {
//         if (this.key_left.isDown) {
//             this.shipSprite.body.angularVelocity = -shipProperties.angularVelocity;
//         } else if (this.key_right.isDown) {
//             this.shipSprite.body.angularVelocity = shipProperties.angularVelocity;
//         } else {
//             this.shipSprite.body.angularVelocity = 0;
//         }
        
//         if (this.key_thrust.isDown) {
//             game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation, shipProperties.acceleration, this.shipSprite.body.acceleration);
//         } else {
//             this.shipSprite.body.acceleration.set(0);
//         }
        
//         if (this.key_fire.isDown) {
//             this.fire();
//         }
//     },
    
//     checkBoundaries: function (sprite) {
//         if (sprite.x < 0) {
//             sprite.x = game.width;
//         } else if (sprite.x > game.width) {
//             sprite.x = 0;
//         } 

//         if (sprite.y < 0) {
//             sprite.y = game.height;
//         } else if (sprite.y > game.height) {
//             sprite.y = 0;
//         }
//     },
    
//     fire: function () {
//         if (game.time.now > this.bulletInterval) {            
//             var bullet = this.bulletGroup.getFirstExists(false);
            
//             if (bullet) {
//                 var length = this.shipSprite.width * 0.5;
//                 var x = this.shipSprite.x + (Math.cos(this.shipSprite.rotation) * length);
//                 var y = this.shipSprite.y + (Math.sin(this.shipSprite.rotation) * length);
                
//                 bullet.reset(x, y);
//                 bullet.lifespan = bulletProperties.lifeSpan;
//                 bullet.rotation = this.shipSprite.rotation;
                
//                 game.physics.arcade.velocityFromRotation(this.shipSprite.rotation, bulletProperties.speed, bullet.body.velocity);
//                 this.bulletInterval = game.time.now + bulletProperties.interval;
//             }
//         }
//     },
// };

// var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
// game.state.add(states.game, gameState);
// game.state.start(states.game);