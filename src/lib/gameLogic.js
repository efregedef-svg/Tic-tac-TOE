export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const emptyBoard = () => Array(9).fill(null);

export const other = (symbol) => (symbol === 'X' ? 'O' : 'X');

export const availableMoves = (board) =>
  board.reduce((moves, cell, i) => (cell === null ? [...moves, i] : moves), []);

/** Returns { winner: 'X' | 'O', line: [a, b, c] } or null. */
export function getWinner(board) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

export const isBoardFull = (board) => board.every((cell) => cell !== null);

/** Returns a finished result ({ winner: 'X' | 'O' | 'draw', line }) or null while the game is still going. */
export function getResult(board) {
  const win = getWinner(board);
  if (win) return win;
  if (isBoardFull(board)) return { winner: 'draw', line: [] };
  return null;
}
