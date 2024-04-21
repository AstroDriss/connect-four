const board = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

const COLS = 7;
const ROWS = 6;
const PLAYER1 = 1;
const PLAYER2 = 2;
let turn = PLAYER1;
let lastToPlayer = PLAYER1;
let winner;

const score = {
  [PLAYER1]: 0,
  [PLAYER2]: 0,
  tie: 0,
};
// ai
let isAI = true;
const scoreMap = {
  [PLAYER1]: -100,
  [PLAYER2]: 100,
  tie: 0,
};
// timer vars
let intervalId = null;
let time = 30;

let winningSpots = [];

const gameContainer = document.querySelector(".board");
const cols = document.querySelectorAll(".col");
const cells = document.querySelectorAll(".cell");
const timer = document.querySelector(".timer span");
const p1Score = document.querySelector(".p-1-score");
const p2Score = document.querySelector(".p-2-score");
const pauseDialog = document.querySelector(".pause-modal");

// ====== Variables END =======

cells.forEach((cell, i) => {
  cell.dataset.index = (i % ROWS) * ROWS + Math.floor(i / ROWS);
  cell.style.setProperty("--y", i % ROWS);
});

cols.forEach((col, j) => {
  col.addEventListener("mouseover", () => {
    gameContainer.style.setProperty("--hover-x", j);
  });
  col.addEventListener("focus", () => {
    gameContainer.style.setProperty("--hover-x", j);
  });

  col.addEventListener("click", () => {
    if (isAI && turn !== PLAYER1) return;

    for (let i = board.length - 1; i >= 0; i--) {
      if (board[i][j] === 0) return move(i, j);
    }
  });
});

function restart() {
  if (intervalId) clearInterval(intervalId);

  document.querySelector(".bg").classList.remove(`p-${winner}`);
  document.querySelector(".game-over").style.display = "none";
  document.querySelector(".timer").style.display = "flex";

  time = 30;
  lastToPlayer = lastToPlayer === PLAYER1 ? PLAYER2 : PLAYER1;
  switchTurn(lastToPlayer);

  play();
  timer.textContent = time;

  renderScore();

  board.map((row) => row.fill(0));

  while ((disc = document.querySelector(".disc"))) {
    disc.remove();
  }
}
restart();

function pause() {
  clearInterval(intervalId);

  pauseDialog.showModal();
}
function play() {
  intervalId = setInterval(() => {
    time--;
    if (time == 0) {
      switchTurn();
      time = 30;
    }

    timer.textContent = time;
  }, 1000);

  pauseDialog.close();
}

function move(i, j) {
  board[i][j] = turn;
  cells[i + j * 6].innerHTML = `<div class="disc p-${turn}"></div>`;

  winner = checkWin(i, j);
  if (!winner) switchTurn();
  else gameOver();
}

function switchTurn(newTurn) {
  turn = newTurn || (turn === PLAYER1 ? PLAYER2 : PLAYER1);
  document.body.dataset.turn = `p-${turn}`;
  time = 30;
  timer.textContent = time;

  if (isAI && turn === PLAYER2)
    setTimeout(() => move(...perfectSpot(board)), 500);
}

function renderScore() {
  p1Score.textContent = score[PLAYER1];
  p2Score.textContent = score[PLAYER2];
}

function gameOver() {
  clearInterval(intervalId);
  let message = "win";
  score[winner]++;
  renderScore();

  if (winner === "tie") message = "draw";

  if (winner !== "tie")
    document.querySelector(".player").textContent =
      winner === PLAYER1 ? "PLAYER 1" : "PLAYER 2";

  document.querySelector(".bg").classList.add(`p-${winner}`);
  document.querySelector(".message").textContent = message;

  highlightWinningDiscs();

  document.querySelector(".timer").style.display = "none";
  document.querySelector(".game-over").style.display = "flex";
}

function highlightWinningDiscs() {
  if (winningSpots.length === 0) return;

  winningSpots.forEach(({ x, y }) => {
    const disc = document.querySelector(`[data-index="${x * ROWS + y}"] .disc`);
    disc.classList.add("win");
  });
}

function checkWin(x, y) {
  const player = board[x][y];
  //   Horizontal
  for (let y = 0; y < COLS - 3; y++) {
    if (
      player !== 0 &&
      player === board[x][y] &&
      player === board[x][y + 1] &&
      player === board[x][y + 2] &&
      player === board[x][y + 3]
    ) {
      winningSpots = [
        { x, y },
        { x, y: y + 1 },
        { x, y: y + 2 },
        { x, y: y + 3 },
      ];
      return player;
    }
  }

  // Vertical
  for (let x = 0; x < ROWS - 3; x++) {
    if (
      player !== 0 &&
      player === board[x][y] &&
      player === board[x + 1][y] &&
      player === board[x + 2][y] &&
      player === board[x + 3][y]
    ) {
      winningSpots = [
        { x, y },
        { x: x + 1, y },
        { x: x + 2, y },
        { x: x + 3, y },
      ];
      return player;
    }
  }

  //   Diagonals from bottom-left to top-right
  for (let row = board.length - 1; row >= 3; row--) {
    for (let col = 0; col < board[row].length - 3; col++) {
      if (
        player !== 0 &&
        player === board[row][col] &&
        player === board[row - 1][col + 1] &&
        player === board[row - 2][col + 2] &&
        player === board[row - 3][col + 3]
      ) {
        winningSpots = [
          { x: row, y: col },
          { x: row - 1, y: col + 1 },
          { x: row - 2, y: col + 2 },
          { x: row - 3, y: col + 3 },
        ];
        return player;
      }
    }
  }

  //   Diagonals from top-left to bottom-right
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      if (
        player !== 0 &&
        player === board[row][col] &&
        player === board[row + 1][col + 1] &&
        player === board[row + 2][col + 2] &&
        player === board[row + 3][col + 3]
      ) {
        winningSpots = [
          { x: row, y: col },
          { x: row + 1, y: col + 1 },
          { x: row + 2, y: col + 2 },
          { x: row + 3, y: col + 3 },
        ];
        return player;
      }
    }
  }

  //   draw
  if (document.querySelectorAll(".disc").length === ROWS * COLS) return "tie";
}
