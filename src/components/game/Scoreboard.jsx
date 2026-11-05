import Mark from '../Mark';
import { IconCpu } from '../ui/Icons';
import { difficultyLabel } from '../../lib/players';

function PlayerCard({ symbol, player, score, active }) {
  const accent =
    symbol === 'X'
      ? { ring: 'ring-cyan-300/50 shadow-glow-x', line: 'via-cyan-300', text: 'text-cyan-200' }
      : { ring: 'ring-fuchsia-300/50 shadow-glow-o', line: 'via-fuchsia-300', text: 'text-fuchsia-200' };

  return (
    <div
      className={`glass relative min-w-0 overflow-hidden rounded-2xl p-3 transition-all duration-300 sm:p-4 ${
        active ? `ring-1 ${accent.ring}` : 'opacity-75'
      }`}
    >
      {active && <span className={`absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent ${accent.line} to-transparent`} />}
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 sm:h-9 sm:w-9">
          <Mark symbol={symbol} animate={false} className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={15} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white" title={player.name}>
            {player.name}
          </p>
          <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:text-[11px]">
            {player.isAi ? (
              <>
                <IconCpu className="h-3 w-3" /> {difficultyLabel(player.difficulty)}
              </>
            ) : (
              `Player ${symbol}`
            )}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <span key={score} className={`animate-pop font-display text-3xl font-bold tabular-nums sm:text-4xl ${accent.text}`}>
          {score}
        </span>
        <span className="mb-1 text-[11px] uppercase tracking-wider text-slate-500">wins</span>
      </div>
    </div>
  );
}

export default function Scoreboard({ players, scores, turn, finished }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-2 sm:gap-3">
      <PlayerCard symbol="X" player={players.X} score={scores.X} active={!finished && turn === 'X'} />
      <div className="glass flex w-16 flex-col items-center justify-center rounded-2xl px-2 py-3 sm:w-20">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Draws</span>
        <span key={scores.draw} className="mt-1 animate-pop font-display text-2xl font-bold tabular-nums text-slate-200 sm:text-3xl">
          {scores.draw}
        </span>
      </div>
      <PlayerCard symbol="O" player={players.O} score={scores.O} active={!finished && turn === 'O'} />
    </div>
  );
}
