function minimax(board, isMax, i = 0, j = 0, depth) {
  const win = checkWin(i, j);
  if (win) return scoreMap[win];
  if (depth === 0) return evaluateBoard(board, PLAYER2); // Heuristic evaluation for terminal states

  if (isMax) {
    let bestScore = -Infinity;

    for (let col = 0; col < COLS; col++) {
      const row = getValidMove(col);
      if (row) {
        board[row][col] = PLAYER2;
        let score = minimax(board, false, row, col, depth - 1);
        board[row][col] = 0;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;

    for (let col = 0; col < COLS; col++) {
      const row = getValidMove(col);
      if (row) {
        board[row][col] = PLAYER1;
        let score = minimax(board, true, row, col, depth - 1);
        board[row][col] = 0;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function perfectSpot() {
  let bestScore = -Infinity;
  let bestMove = [0, 0];

  for (let col = 0; col < COLS; col++) {
    const row = getValidMove(col);
    if (row) {
      board[row][col] = PLAYER2;
      let score = minimax(board, false, row, col, 2);
      board[row][col] = 0;
      if (score > bestScore) {
        bestScore = score;
        bestMove = [row, col];
      }
    }
  }

  return bestMove;
}

function getValidMove(col) {
  for (let i = ROWS - 1; i >= 0; i--) {
    if (board[i][col] === 0) return i;
  }
}

function evaluateBoard(board, myPiece, last) {
  let score = 0;

  // Analyze horizontal threats
  for (const row of board) {
    score += countThreats(row, 4, myPiece) * 100;
    score += countThreats(row, 3, myPiece) * 10;
    score += countThreats(row, 2, myPiece) * 1;
  }

  // Analyze vertical threats (transpose the board and reuse horizontal check)
  const transposedBoard = transpose(JSON.parse(JSON.stringify(board)));
  for (const row of transposedBoard) {
    score += countThreats(row, 4, myPiece) * 100;
    score += countThreats(row, 3, myPiece) * 10;
    score += countThreats(row, 2, myPiece) * 1;
  }
  score += countThreats(transposedBoard[3], 1, myPiece) * 1;

  // Analyze diagonal threats (check both directions)
  for (let row = 0; row < board.length - 3; row++) {
    for (let col = 0; col < board[0].length - 3; col++) {
      const diagRight = [];
      const diagLeft = [];
      for (let i = 0; i < 4; i++) {
        diagRight.push(board[row + i]?.[col + i] || ""); // Optional chaining for undefined cells
        diagLeft.push(board[row + i]?.[col - i] || "");
      }
      score += countThreats(diagRight, 4, myPiece) * 100;
      score += countThreats(diagLeft, 4, myPiece) * 100;
      score += countThreats(diagRight, 3, myPiece) * 10;
      score += countThreats(diagLeft, 3, myPiece) * 10;
      score += countThreats(diagRight, 2, myPiece) * 1;
      score += countThreats(diagLeft, 2, myPiece) * 1;
    }
  }

  if (!last) {
    // Consider opponent's threats (negate the score for minimizing player)
    const opponentPiece = myPiece === PLAYER1 ? PLAYER2 : PLAYER1;
    score -= evaluateBoard(board, opponentPiece, true);
  }

  return score;
}

function countThreats(chain, length, piece) {
  let count = 0;
  let consecutive = 0;
  for (const element of chain) {
    if (element === piece) {
      consecutive++;
      if (consecutive === length) {
        count++;
      }
    } else {
      consecutive = 0;
    }
  }
  return count;
}
function transpose(board) {
  const transposed = [];
  for (let col = 0; col < board[0].length; col++) {
    transposed.push([]);
    for (let row = 0; row < board.length; row++) {
      transposed[col].push(board[row][col]);
    }
  }
  return transposed;
}
