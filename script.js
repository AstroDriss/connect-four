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
// timer vars
let intervalId = null;
let time = 30;

let winningSpots = [];

const gameContainer = document.querySelector(".board");
const cols = document.querySelectorAll(".col");
const cells = document.querySelectorAll(".cell");
const gameOverDialog = document.querySelector(".game-over");
const timer = document.querySelector(".timer span");

// ====== Variables END =======

cells.forEach((cell, i) => {
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
    for (let i = board.length - 1; i >= 0; i--) {
      if (board[i][j] === 0) return play(i, j);
    }
  });
});

// timer
intervalId = setInterval(() => {
  time--;
  if (time == 0) {
    switchTurn();
    time = 30;
  }

  timer.textContent = time;
}, 1000);

function play(i, j) {
  board[i][j] = turn;
  cells[i + j * 6].innerHTML = `<div class="disc p-${turn}"></div>`;

  const winner = checkWin(i, j);
  if (!winner) switchTurn();
  else gameOver(winner);
}

function switchTurn() {
  turn = turn === PLAYER1 ? PLAYER2 : PLAYER1;
  document.body.dataset.turn = `p-${turn}`;
  time = 30;
  timer.textContent = time;
}

function gameOver(winner) {
  clearInterval(intervalId);
  let message = "";

  if (winner === PLAYER1) message = "Player 1 takes the Round";
  if (winner === PLAYER2) message = "Player 2 Takes the Round";
  if (winner === "tie") message = "draw";

  if (winner !== "tie")
    gameOverDialog.querySelector(".winner").classList.add(`p-${winner}`);
  gameOverDialog.querySelector(".message").textContent = message;

  gameOverDialog.showModal();
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
          { x: row + 1, y: col - 1 },
          { x: row + 2, y: col - 2 },
          { x: row + 3, y: col - 3 },
        ];
        return player;
      }
    }
  }

  //   draw
  if (document.querySelectorAll(".disc").length === ROWS * COLS) return "tie";
}
