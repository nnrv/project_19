var backgroundImg, background, invisibleGround;
var boy_running, boy_jumping, boy_collided, boy, ghost, ghostImg ;
var rock1,rock2, rocksGroup, goldImg, goldGroup;

var score, treasure;

var restartImg, gameoverImg, restart,gameover;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload() {
backgroundImg = loadImage("background.png");
boy_running = loadAnimation("runner1.png","runner2.png");
boy_collided = loadAnimation("runner3.png");
ghostImg =  loadImage("ghost2.png");
rock1 = loadImage("rock1.png");
rock2 = loadImage("rock2.png");
goldImg = loadImage("gold.png");
restartImg = loadImage("restart.png");
gameoverImg = loadImage("gameover.png");
}

function setup() {
 createCanvas(730,900);
 background = createSprite(100,100);
 background.addImage("background", backgroundImg);
 background.x= background.width/2;

 boy = createSprite(300,270,50,50);
 boy.addAnimation("running",boy_running);
 boy.addAnimation("collided",boy_collided);
 boy.scale = 1;

 ghost = createSprite(50,240,50,50);
 ghost.addAnimation("ghost",ghostImg);
 ghost.scale = 0.3;

 restart = createSprite(365,170,50,50);
 restart.addAnimation("restart",restartImg);
 restart.scale = 0.5;

 gameover = createSprite(365,150,50,50);
 gameover.addAnimation("gameover",gameoverImg);
 gameover.scale = 1;

 rocksGroup = createGroup();
 goldGroup = createGroup();

 invisibleGround = createSprite(400,310,800,10);
 invisibleGround.visible = false;

 ghost.setCollider("rectangle",0,0,ghost.width,ghost.height);
 //  ghost.debug = true;

 score = 0;
 treasure = 0;
}

function draw() {
 
 if(gameState === PLAY){
 
 gameover.visible = false;
 restart.visible = false;

 background.velocityX = -(6 +3*score/100);

 score = score + Math.round(getFrameRate()/60);

 if(background.x < 0){
     background.x = background.width/2;
 }

 if(keyDown("up_arrow") && boy.y >=100 ){
    boy.velocityY = -12;
 }

 boy.velocityY = boy.velocityY + 0.8;
 
 if(goldGroup.isTouching(rocksGroup)){
     goldGroup.destroyEach();
 }
 
 spawnRocks();
 spawnGold();
 
 if(ghost.isTouching(rocksGroup) && ghost.y >=100 ){
  ghost.velocityY = -12;  
 }

 ghost.velocityY = ghost.velocityY + 0.8;

 if(goldGroup.isTouching(boy)){
  treasure = treasure + 100;
  goldGroup.destroyEach();
 }

 if(rocksGroup.isTouching(boy) || ghost.isTouching(boy)){
  gameState = END;
 }
 }
 else if (gameState === END){
  background.velocityX = 0;
  boy.velocityY = 0;
  
  boy.changeAnimation("collided", boy_collided);

  gameover.visible = true;
  restart.visible = true;

  rocksGroup.setLifetimeEach(-1);
  goldGroup.setLifetimeEach(-1);

  rocksGroup.setVelocityEach(0);
  goldGroup.setVelocityEach(0);
  
 }

 boy.collide(invisibleGround);
 ghost.collide(invisibleGround);

 if(mousePressedOver(restart)){
    reset();
  }

 drawSprites();

 textSize(20);
 text ("score:" + score,500,50);
 textSize(20);
 text("treasure:" + treasure,500,70);
}


function reset(){
gameState = PLAY;
restart.visible = false;
gameover.visible = false;
goldGroup.destroyEach();
rocksGroup.destroyEach();
boy.changeAnimation("running", boy_running);
score = 0;
treasure = 0;
  
}

function spawnRocks(){
if(frameCount % 80 === 0){
var rock = createSprite(500,300,50,50);
rock.velocityX = -(6 + score/100);
    
var rand = Math.round(random(1,2));
 switch(rand){
  case 1: rock.addImage(rock1);
  break;
  case 2: rock.addImage(rock2);
  break;
  default: break;
 }

 rock.scale = 0.1;
 rock.lifetime = 680;

 rock.depth = boy.depth;
 boy.depth = boy.depth + 1;

 rock.depth = ghost.depth;
 ghost.depth = ghost.depth + 1;

 rocksGroup.add(rock);
 }
}

function spawnGold(){
if(frameCount % 80 === 0){
var gold = createSprite(700,300,50,50);
gold.x = Math.round(random(500,700));
gold.addImage(goldImg);
gold.scale = 0.1;
gold.velocityX = -3;
gold.lifetime = 680;

gold.depth = boy.depth;
boy.depth = boy.depth + 1;

gold.depth = ghost.depth;
ghost.depth = ghost.depth + 1;

goldGroup.add(gold);
}
}