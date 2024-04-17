const board = [
  ["", "", "", "", "", "", ""],
  ["", "", "", "", "", "", ""],
  ["", "", "", "", "", "", ""],
  ["", "", "", "", "", "", ""],
  ["", "", "", "", "", "", ""],
  ["", "", "", "", "", "", ""],
];

const COLS = 7;
const ROWS = 6;
const PLAYER1 = "x";
const PLAYER2 = "o";
let turn = PLAYER1;

const gameContainer = document.querySelector(".board");
const cols = document.querySelectorAll(".col");
const cells = document.querySelectorAll(".cell");

cells.forEach((cell, i) => {
  // cell.style.setProperty("--x", Math.floor(i / ROWS));
  cell.style.setProperty("--y", i % ROWS);
});

cols.forEach((col, j) => {
  col.addEventListener("mouseover", (e) => {
    gameContainer.style.setProperty("--hover-x", j);
  });

  col.addEventListener("click", (e) => {
    for (let i = board.length - 1; i >= 0; i--) {
      if (board[i][j] === "") return play(i, j);
    }
  });
});

function play(i, j) {
  board[i][j] = turn;
  cells[i + j * 6].innerHTML = `<div class="disc ${turn}"></div>`;

  const winner = checkWin(i, j);
  if (!winner) turn = turn === PLAYER1 ? PLAYER2 : PLAYER1;
  else if (winner === "tie") alert("draw");
  else alert(winner);
}

function checkWin(x, y) {
  const player = board[x][y];
  //   Horizontal
  for (let y = 0; y < COLS - 3; y++) {
    if (
      player !== "" &&
      player === board[x][y] &&
      player === board[x][y + 1] &&
      player === board[x][y + 2] &&
      player === board[x][y + 3]
    ) {
      return player;
    }
  }

  // Vertical
  for (let x = 0; x < ROWS - 3; x++) {
    if (
      player !== "" &&
      player === board[x][y] &&
      player === board[x + 1][y] &&
      player === board[x + 2][y] &&
      player === board[x + 3][y]
    ) {
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
        return player;
      }
    }
  }

  //   draw
  if (document.querySelectorAll(".disc").length === ROWS * COLS) return "tie";
}
