const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector("#score");

const blockWidth = 100;
const blockHeight = 20;

const boardWidth = 670;
const boardHeight = 300;

const userStart = [305, 10];
let userCurrentPosition = userStart;

const ballStart = [350, 40];
let ballCurrentPos = ballStart;
const ballDiameter = 20;

let xDirection = -2;
let yDirection = 2;

let timerId;
let score = 0;

// create block
class Block {
  // bottom and left
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis];
    this.bottomRight = [xAxis + blockWidth, yAxis];
    this.topLeft = [xAxis, yAxis + blockHeight];
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
  }
}

// all blocks
const blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(560, 270),

  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(560, 240),

  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
  new Block(560, 210),
];

// draw all blocks
function addBlocks() {
  for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    // get x axis value (bottomLeft[0])
    block.style.left = blocks[i].bottomLeft[0] + "px";
    // get y axis value (bottomLeft[1])
    block.style.bottom = blocks[i].bottomLeft[1] + "px";
    grid.appendChild(block);
  }
}
addBlocks();

// add user
const user = document.createElement("div");
user.classList.add("user");
grid.appendChild(user);
drawUser();

// draw user
function drawUser() {
  user.style.left = userCurrentPosition[0] + "px";
  user.style.bottom = userCurrentPosition[1] + "px";
}
// draw ball
function drawBall() {
  ball.style.left = ballCurrentPos[0] + "px";
  ball.style.bottom = ballCurrentPos[1] + "px";
}

// move user
function moveUser(e) {
  switch (e.key) {
    case "ArrowLeft":
      if (userCurrentPosition[0] > 0) {
        userCurrentPosition[0] -= 10;
        drawUser();
      }
      break;
    case "ArrowRight":
      if (userCurrentPosition[0] < boardWidth - blockWidth) {
        userCurrentPosition[0] += 10;
        drawUser();
      }
      break;

    default:
      break;
  }
}

document.addEventListener("keydown", moveUser);

// create ball
const ball = document.createElement("div");
ball.classList.add("ball");
drawBall();
grid.appendChild(ball);

// move the ball
function moveBall() {
  ballCurrentPos[0] += xDirection;
  ballCurrentPos[1] += yDirection;
  drawBall();
  checkForCollisions();
}
timerId = setInterval(moveBall, 14);

// check for collisions
function checkForCollisions() {
  // check for block collisions

  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPos[0] > blocks[i].bottomLeft[0] &&
      ballCurrentPos[0] < blocks[i].bottomRight[0] &&
      ballCurrentPos[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPos[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll(".block"));
      allBlocks[i].classList.remove("block");
      blocks.splice(i, 1);
      changeDirection();
      score++;
      scoreDisplay.innerHTML = score;

      // check for win
      if (blocks.length === 0) {
        scoreDisplay.innerHTML = "Just stop already , no more walls to hit ";
        clearInterval(timerId);
        document.removeEventListener("keydown", moveUser);
      }
    }
  }

  // check for user collisions
  if (
    ballCurrentPos[0] > userCurrentPosition[0] &&
    ballCurrentPos[0] < userCurrentPosition[0] + blockWidth &&
    ballCurrentPos[1] > userCurrentPosition[1] &&
    ballCurrentPos[1] < userCurrentPosition[1] + blockHeight
  ) {
    changeDirection();
  }
  if (
    ballCurrentPos[0] >= boardWidth - ballDiameter ||
    ballCurrentPos[1] >= boardHeight - ballDiameter ||
    ballCurrentPos[0] <= 0
  ) {
    // check for wall collisions
    changeDirection();
  }
  // check for game over
  if (ballCurrentPos[1] <= 0) {
    clearInterval(timerId);
    scoreDisplay.innerHTML = "Lost !";
    document.removeEventListener("keydown", moveUser);
  }
}

function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2;
    return;
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2;
    return;
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2;
    return;
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2;
    return;
  }
}
