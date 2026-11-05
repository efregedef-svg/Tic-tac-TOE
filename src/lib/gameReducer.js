import { emptyBoard, getResult, other } from './gameLogic.js';

export function createInitialState(starter = 'X') {
  return {
    board: emptyBoard(),
    turn: starter,
    starter,
    result: null, // { winner: 'X' | 'O' | 'draw', line }
    scores: { X: 0, O: 0, draw: 0 },
    round: 1,
    lastMove: null, // { index, symbol, id }
  };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'MOVE': {
      const { index } = action;
      // Hard guard: never overwrite a square, never move after the game is decided.
      if (state.result || !Number.isInteger(index) || index < 0 || index > 8 || state.board[index] !== null) {
        return state;
      }
      const board = state.board.slice();
      board[index] = state.turn;
      const result = getResult(board);
      return {
        ...state,
        board,
        result,
        turn: result ? state.turn : other(state.turn),
        scores: result ? { ...state.scores, [result.winner]: state.scores[result.winner] + 1 } : state.scores,
        lastMove: { index, symbol: state.turn, id: (state.lastMove?.id ?? 0) + 1 },
      };
    }

    case 'RESTART': {
      // Restarting a finished round advances to the next round; restarting mid-round just clears the board.
      const finished = Boolean(state.result);
      const starter = finished && action.alternate ? other(state.starter) : state.starter;
      return {
        ...state,
        board: emptyBoard(),
        turn: starter,
        starter,
        result: null,
        round: finished ? state.round + 1 : state.round,
        lastMove: null,
      };
    }

    default:
      return state;
  }
}
