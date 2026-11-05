import { useCallback, useEffect, useReducer, useState } from 'react';
import Board from './Board';
import Scoreboard from './Scoreboard';
import ResultOverlay from './ResultOverlay';
import Mark from '../Mark';
import { IconPlus, IconRestart } from '../ui/Icons';
import { createInitialState, gameReducer } from '../../lib/gameReducer';
import { getAiMove } from '../../lib/ai';
import { AI_SPEEDS } from '../../lib/constants';
import { difficultyLabel } from '../../lib/players';

function ThinkingDots() {
  return (
    <span className="inline-flex gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 animate-bounce-dot rounded-full bg-current" style={{ animationDelay: `${i * 0.16}s` }} />
      ))}
    </span>
  );
}

function TurnStatus({ result, turn, players, aiTurn, mode }) {
  let content;
  if (result?.winner === 'draw') {
    content = <span className="font-semibold text-slate-200">It's a draw</span>;
  } else if (result) {
    content = (
      <>
        <Mark symbol={result.winner} animate={false} className="h-5 w-5" strokeWidth={15} />
        <span className="font-semibold text-white">{players[result.winner].name} wins!</span>
      </>
    );
  } else {
    content = (
      <>
        <Mark symbol={turn} animate={false} className="h-5 w-5" strokeWidth={15} />
        <span className="text-slate-300">
          {aiTurn ? (
            <span className="inline-flex items-center gap-2">
              <span className="font-semibold text-white">Computer</span> is thinking <ThinkingDots />
            </span>
          ) : mode === 'pvc' ? (
            <span className="font-semibold text-white">Your move</span>
          ) : (
            <>
              <span className="font-semibold text-white">{players[turn].name}</span>'s turn
            </>
          )}
        </span>
      </>
    );
  }

  return (
    <div aria-live="polite" className="glass flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl px-4 py-3 text-sm sm:text-base">
      {content}
    </div>
  );
}

function RoundChips({ rounds, players }) {
  if (rounds.length === 0) {
    return <p className="text-sm text-slate-500">Round results will appear here.</p>;
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {rounds.map(({ round, winner }) => (
        <li
          key={round}
          title={winner === 'draw' ? `Round ${round}: draw` : `Round ${round}: ${players[winner].name}`}
          className="flex animate-pop items-center gap-1.5 rounded-full border border-white/10 bg-white/5 py-1 pl-1.5 pr-3 text-xs text-slate-300"
        >
          <span className="grid h-5 w-5 place-items-center rounded-full bg-white/5">
            {winner === 'draw' ? <span className="text-[11px] font-bold text-slate-400">=</span> : <Mark symbol={winner} animate={false} className="h-3.5 w-3.5" strokeWidth={16} />}
          </span>
          R{round}
        </li>
      ))}
    </ul>
  );
}

export default function GameScreen({ match, settings, play, onRecord, onNewGame, inputLocked }) {
  const { players, mode, difficulty } = match;
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialState('X'));
  const [showResult, setShowResult] = useState(false);
  const [rounds, setRounds] = useState([]);

  const { board, turn, result, scores, round, lastMove } = state;
  const aiTurn = !result && players[turn].isAi;
  const aiDelay = AI_SPEEDS.find((s) => s.value === settings.aiSpeed)?.delay ?? 550;

  // Placement sound for every accepted move.
  useEffect(() => {
    if (lastMove) play(lastMove.symbol === 'X' ? 'x' : 'o');
  }, [lastMove, play]);

  // Round finished: sound, history entry, then reveal the result card.
  useEffect(() => {
    if (!result) return undefined;
    const { winner } = result;
    const aiWon = winner !== 'draw' && players[winner].isAi;
    play(winner === 'draw' ? 'draw' : aiWon ? 'lose' : 'win');

    onRecord({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: new Date().toISOString(),
      mode,
      difficulty: mode === 'pvc' ? difficulty : null,
      players: {
        X: { name: players.X.name, isAi: players.X.isAi },
        O: { name: players.O.name, isAi: players.O.isAi },
      },
      winner,
      moves: board.filter(Boolean).length,
      round,
    });
    setRounds((r) => [...r, { round, winner }]);

    const t = setTimeout(() => setShowResult(true), 1100);
    return () => clearTimeout(t);
    // Runs once per finished round; `result` is a fresh object each time a game ends.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  // Computer move.
  useEffect(() => {
    if (!aiTurn) return undefined;
    const t = setTimeout(() => {
      const index = getAiMove(board, turn, difficulty);
      if (index !== null) dispatch({ type: 'MOVE', index });
    }, aiDelay);
    return () => clearTimeout(t);
  }, [aiTurn, board, turn, difficulty, aiDelay]);

  const handleCell = useCallback(
    (index) => {
      if (aiTurn || result || board[index] !== null) return;
      dispatch({ type: 'MOVE', index });
    },
    [aiTurn, result, board],
  );

  const restart = useCallback(() => {
    setShowResult(false);
    dispatch({ type: 'RESTART', alternate: settings.alternateStart });
    play('click');
  }, [settings.alternateStart, play]);

  const newGame = useCallback(() => {
    setShowResult(false);
    onNewGame();
  }, [onNewGame]);

  // Keyboard: 1–9 place a mark (reading order), R restarts.
  useEffect(() => {
    if (inputLocked || showResult) return undefined;
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.('input, textarea')) return;
      if (/^[1-9]$/.test(e.key)) handleCell(Number(e.key) - 1);
      else if (e.key === 'r' || e.key === 'R') restart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleCell, restart, inputLocked, showResult]);

  return (
    <div className="game-layout mx-auto w-full max-w-md animate-fade-up py-4 sm:py-6 lg:max-w-none lg:py-10">
      <section className="space-y-3 [grid-area:score]">
        <div className="flex items-center justify-between px-1">
          <span className="label">Round {round}</span>
          <span className="text-xs font-medium text-slate-400">
            {mode === 'pvc' ? `vs Computer · ${difficultyLabel(difficulty)}` : 'Player vs Player'}
          </span>
        </div>
        <Scoreboard players={players} scores={scores} turn={turn} finished={Boolean(result)} />
        <TurnStatus result={result} turn={turn} players={players} aiTurn={aiTurn} mode={mode} />
      </section>

      <section className="mx-auto w-full max-w-[440px] self-center [grid-area:board] lg:max-w-[540px]">
        <Board board={board} turn={turn} result={result} locked={aiTurn} onCellClick={handleCell} />
      </section>

      <section className="grid grid-cols-2 gap-3 [grid-area:controls]">
        <button type="button" onClick={restart} className="btn-ghost" title="Clear the board (R)">
          <IconRestart className="h-5 w-5" /> Restart
        </button>
        <button type="button" onClick={newGame} className="btn-primary py-3" title="Back to match setup — scores reset">
          <IconPlus className="h-5 w-5" /> New game
        </button>
      </section>

      <section className="glass rounded-2xl p-4 [grid-area:recent] lg:self-start">
        <div className="mb-3 flex items-center justify-between">
          <span className="label">This match</span>
          <span className="hidden text-[11px] text-slate-500 sm:inline">
            Keys <kbd className="rounded bg-white/10 px-1">1</kbd>–<kbd className="rounded bg-white/10 px-1">9</kbd> to play ·{' '}
            <kbd className="rounded bg-white/10 px-1">R</kbd> restart
          </span>
        </div>
        <RoundChips rounds={rounds} players={players} />
      </section>

      {showResult && result && (
        <ResultOverlay
          result={result}
          players={players}
          mode={mode}
          round={round}
          onPlayAgain={restart}
          onNewGame={newGame}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
}
