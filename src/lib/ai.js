import { availableMoves, getWinner, isBoardFull, other } from './gameLogic.js';

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

/** Index of a move that wins immediately for `symbol`, or null. */
function findWinningMove(board, symbol) {
  for (const i of availableMoves(board)) {
    const next = board.slice();
    next[i] = symbol;
    if (getWinner(next)?.winner === symbol) return i;
  }
  return null;
}

/**
 * Minimax with alpha-beta pruning. Scores are depth-adjusted so the AI
 * prefers faster wins and slower losses.
 */
function minimax(board, player, aiSymbol, depth, alpha, beta) {
  const win = getWinner(board);
  if (win) return win.winner === aiSymbol ? 10 - depth : depth - 10;
  if (isBoardFull(board)) return 0;

  const maximizing = player === aiSymbol;
  let best = maximizing ? -Infinity : Infinity;

  for (const i of availableMoves(board)) {
    board[i] = player;
    const score = minimax(board, other(player), aiSymbol, depth + 1, alpha, beta);
    board[i] = null;

    if (maximizing) {
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, score);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) break;
  }
  return best;
}

/** Perfect play. Each root move is searched with a full window so ties are exact; picks randomly among equally optimal moves for variety. */
export function getBestMove(board, aiSymbol) {
  let bestScore = -Infinity;
  let bestMoves = [];

  for (const i of availableMoves(board)) {
    const next = board.slice();
    next[i] = aiSymbol;
    const score = minimax(next, other(aiSymbol), aiSymbol, 1, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [i];
    } else if (score === bestScore) {
      bestMoves.push(i);
    }
  }
  return bestMoves.length ? pickRandom(bestMoves) : null;
}

/**
 * easy   – mostly random, occasionally notices a winning move.
 * medium – always takes a win, usually blocks, otherwise plays optimally half the time.
 * hard   – full minimax: never loses.
 */
export function getAiMove(board, aiSymbol, difficulty) {
  const moves = availableMoves(board);
  if (moves.length === 0) return null;
  const human = other(aiSymbol);

  if (difficulty === 'easy') {
    if (Math.random() < 0.3) {
      const win = findWinningMove(board, aiSymbol);
      if (win !== null) return win;
    }
    return pickRandom(moves);
  }

  if (difficulty === 'medium') {
    const win = findWinningMove(board, aiSymbol);
    if (win !== null) return win;
    const block = findWinningMove(board, human);
    if (block !== null && Math.random() < 0.85) return block;
    return Math.random() < 0.5 ? getBestMove(board, aiSymbol) : pickRandom(moves);
  }

  return getBestMove(board, aiSymbol);
}
