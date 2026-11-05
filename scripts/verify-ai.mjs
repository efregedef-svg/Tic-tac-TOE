// Exhaustively plays every possible human move sequence against the Hard AI
// (as both X and O) and asserts the AI never loses. Run: node scripts/verify-ai.mjs
import { getAiMove } from '../src/lib/ai.js';
import { availableMoves, emptyBoard, getResult, other } from '../src/lib/gameLogic.js';

let games = 0;
let losses = 0;

function explore(board, turn, aiSymbol) {
  const result = getResult(board);
  if (result) {
    games += 1;
    if (result.winner === other(aiSymbol)) losses += 1;
    return;
  }
  if (turn === aiSymbol) {
    const move = getAiMove(board, aiSymbol, 'hard');
    const next = board.slice();
    next[move] = aiSymbol;
    explore(next, other(turn), aiSymbol);
  } else {
    for (const i of availableMoves(board)) {
      const next = board.slice();
      next[i] = turn;
      explore(next, other(turn), aiSymbol);
    }
  }
}

for (const ai of ['X', 'O']) explore(emptyBoard(), 'X', ai);
console.log(`Hard AI: ${games} complete games explored, ${losses} losses.`);
process.exit(losses === 0 ? 0 : 1);
