// Since AI also changed the parts I had done while helping me, I cannot specify the parts exactly.

let bgImg, handImg, strawImg;
let gameFont;

let gameState = "intro";

// hand movement
const BASE_HAND_SPEED = 6;
let handX = 0;
let handSpeed = BASE_HAND_SPEED;

// straw state
let strawY = 0;
let strawFalling = false;
let strawLocked = false;
let strawDropX = 0;

// exact win position
let winX = 325;
let lockY = 70;

// confetti system
let confettis = [];
let confettiActive = false;

function preload() {
  // load game assets
  bgImg = loadImage("bg.png");
  handImg = loadImage("hand.png");
  strawImg = loadImage("straw.png");
  gameFont = loadFont("GreenFlame.ttf");
}

function setup() {
  // create canvas and set text style
  createCanvas(650, 650);
  textAlign(CENTER, CENTER);
  textFont(gameFont);
}

function draw() {
  background(0);
  image(bgImg, 0, 0, width, height);

  // show intro screen
  if (gameState === "intro") {
    drawIntro();
    return;
  }

  // move the hand to left and right
  if (gameState === "playing") {
    handX += handSpeed;
    if (handX > 60 || handX < -60) {
      handSpeed *= -1; // reverse direction at limits
    }
  }

  // drawing the hand
  image(handImg, handX, 0, width - 25, height);

  // make straw fall vertically
  if (strawFalling && !strawLocked) {
    strawY += 14;
  }

  // drawing the straw
  if (strawFalling) {
    image(strawImg, strawDropX, strawY, width - 30, height - 90);
  } else {
    image(strawImg, handX, strawY, width - 30, height - 90);
  }

  // lose if straw goes off screen
  if (strawY > height && gameState === "playing") {
    gameState = "lose";
  }

  // update and draw confetti particles
  if (confettiActive) {
    for (let i = confettis.length - 1; i >= 0; i--) {
      confettis[i].update();
      confettis[i].draw();

      // remove particle if off screen
      if (confettis[i].y > height + 20) {
        confettis.splice(i, 1);
      }
    }
  }

  drawResult();
}

function keyPressed() {
  // start game
  if (gameState === "intro" && key === " ") {
    gameState = "playing";
    return;
  }

  // reset after win or lose
  if ((gameState === "lose" || gameState === "win") && key === " ") {
    resetGame();
    return;
  }

  // drop the straw
  if (gameState === "playing" && key === " " && !strawFalling) {
    strawFalling = true;
    strawDropX = handX; // lock X position at drop moment

    let strawWorldX = strawDropX + width / 2;

    // win check
    if (strawWorldX === winX) {
      strawLocked = true;
      strawY = lockY;
      gameState = "win";

      startConfetti();
    }
  }
}

function drawIntro() {
  // dark overlay
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  // title text
  fill(255);
  textSize(72);
  text("DROP", width / 2, height / 2 - 130);

  // instructions
  textSize(26);
  text(
    "Press SPACE to release the straw.\nOnly a perfect drop wins.",
    width / 2,
    height / 2
  );

  // blinking start text
  let alpha = map(sin(frameCount * 0.1), -1, 1, 100, 255);
  fill(255, 220, 0, alpha);
  textSize(28);
  text("PRESS SPACE TO START", width / 2, height - 190);
}

function drawResult() {
  if (gameState === "win" || gameState === "lose") {
    // dark overlay
    fill(0, 0, 0, 140);
    rect(0, 0, width, height);

    fill(255);
    textSize(48);

    // result message
    if (gameState === "win") {
      text("YOU WIN!", width / 2, height / 2);
    } else {
      text("MISSED IT", width / 2, height / 2);
    }

    // blinking restart message
    let alpha = map(sin(frameCount * 0.1), -1, 1, 100, 255);
    fill(255, 220, 0, alpha);
    textSize(26);

    if (gameState === "win") {
      text("PRESS SPACE TO PLAY AGAIN", width / 2, height / 2 + 80);
    } else {
      text("PRESS SPACE TO TRY AGAIN", width / 2, height / 2 + 80);
    }
  }
}

function resetGame() {
  // reset all game variables
  handX = 0;
  handSpeed = BASE_HAND_SPEED;
  strawY = 0;
  strawFalling = false;
  strawLocked = false;
  strawDropX = 0;
  confettiActive = false;
  confettis = [];
  gameState = "playing";
}

// start confetti explosion
function startConfetti() {
  confettiActive = true;
  confettis = [];

  for (let i = 0; i < 200; i++) {
    confettis.push(new Confetti(width / 2, height / 3));
  }
}

// confetti particle class
class Confetti {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.size = random(6, 12);

    this.vx = random(-6, 6); // horizontal velocity
    this.vy = random(-10, -4); // initial upward burst

    this.gravity = 0.3;
    this.rotation = random(TWO_PI);
    this.rotSpeed = random(-0.2, 0.2);

    this.color = color(random(255), random(255), random(255));
  }
  

  update() {
    // apply gravity and movement
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
  }

  draw() {
    // draw rotating confetti piece
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    noStroke();
    fill(this.color);
    rectMode(CENTER);
    rect(0, 0, this.size, this.size / 2);
    pop();
  }
}
