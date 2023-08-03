let board;
let boardWidth = 400;
let boardHeight = 600;
let context;

let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
  img : null,
  x : doodlerX,
  y : doodlerY,
  width : doodlerWidth,
  height : doodlerHeight
}

let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -7;
let gravity = 0.3;

let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;

let highScore = 0;


window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  doodlerRightImg = new Image();
  doodlerRightImg.src = "images/doodler-right.png";
  doodler.img = doodlerRightImg;
  doodlerRightImg.onload = function() {
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
  }

  doodlerLeftImg = new Image();
  doodlerLeftImg.src = "images/doodler-left.png";

  platformImg = new Image();
  platformImg.src = "images/platform.png";

  velocityY = initialVelocityY
  placePlatforms();
  requestAnimationFrame(update);
  document.addEventListener("keydown", moveDoodler);
}

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    context.clearRect(0, 0, board.width, board.height);
    context.fillText("Game Over!", boardWidth/4, boardHeight*6/8);
    context.fillText(`Your score is: ${score}`, boardWidth/4, boardHeight*6/8 + 20);
    context.fillText("Press 'Space' to Restart", boardWidth/4, boardHeight*6/8 + 60);
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  doodler.x += velocityX;
  if (doodler.x > boardWidth - doodlerWidth) {
    doodler.x = boardWidth - doodlerWidth;
  } else if (doodler.x < 0) {
    doodler.x = 0;
  }

  velocityY += gravity;
  doodler.y += velocityY;
  if (doodler.y > board.height) {
    gameOver = true;
  }
  context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

  for (let i = 0; i < platformArray.length; i++) {
    let platform = platformArray[i];
    if (velocityY < 0 && doodler.y < boardHeight*3/4) {
      platform.y -= initialVelocityY
    }
    if (detectCollision(doodler, platform) && velocityY >= 0) {
      velocityY = initialVelocityY;
    }
    context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
  }

  while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
    platformArray.shift();
    newPlatform();
  }

  updateScore();
  context.fillStyle = "white";
  context.font = "16px sans-serif";
  context.fillText(score, 10, 20);
  context.fillText(highScore, 10, 40);
}


function moveDoodler(e) {
  if (e.code == "ArrowRight" || e.code == "KeyD") {
    velocityX = 4;
    doodler.img = doodlerRightImg;
  } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
    velocityX = -4;
    doodler.img = doodlerLeftImg;
  } else if (e.code == "Space" && gameOver) {
    doodler = {
      img : doodlerRightImg,
      x : doodlerX,
      y : doodlerY,
      width : doodlerWidth,
      height : doodlerHeight
    }

    velocityX = 0;
    velocityY = initialVelocityY;
    score = 0;
    maxScore = 0;
    gameOver = false;
    placePlatforms();
  }
}

function placePlatforms() {
  platformArray = [];

  let platform = {
    img : platformImg,
    x : boardWidth/2,
    y : boardHeight - 50,
    width : platformWidth,
    height : platformHeight
  }

  platformArray.push(platform);

  // platform = {
  //   img : platformImg,
  //   x : boardWidth/2,
  //   y : boardHeight - 150,
  //   width : platformWidth,
  //   height : platformHeight
  // }

  // platformArray.push(platform);

  for (let i = 0; i < 6; i++) {
    let randomX = Math.random() * boardWidth*3/4;
    let platform = {
      img : platformImg,
      x : randomX,
      y : boardHeight - 75*i - 150,
      width : platformWidth,
      height : platformHeight
    }

    platformArray.push(platform);
  }
}

function newPlatform() {
  let randomX = Math.random() * boardWidth*3/4;
  let platform = {
    img : platformImg,
    x : randomX,
    y : -platformHeight,
    width : platformWidth,
    height : platformHeight
  }

  platformArray.push(platform);
}

function detectCollision(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;

}

function updateScore() {
  let points = Math.floor(50*Math.random());
  if (velocityY < 0) {
    maxScore += points;
    if (score < maxScore) {
      score = maxScore;
    if (score > highScore) {
      highScore = score;
    }}
  } else if (velocityY >= 0) {
    maxScore -= points;
  }
}
