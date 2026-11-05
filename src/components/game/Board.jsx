import Mark from '../Mark';

const cellCenter = (i) => ({ x: (i % 3) * 100 + 50, y: Math.floor(i / 3) * 100 + 50 });

function WinLine({ line, winner }) {
  const a = cellCenter(line[0]);
  const b = cellCenter(line[2]);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ext = 34;
  const x1 = a.x - (dx / len) * ext;
  const y1 = a.y - (dy / len) * ext;
  const x2 = b.x + (dx / len) * ext;
  const y2 = b.y + (dy / len) * ext;
  const [from, to] = winner === 'X' ? ['#a5f3fc', '#3b82f6'] : ['#f5d0fe', '#8b5cf6'];

  return (
    // The grid has a 12px gap, so extending the overlay by half a gap on each side makes cell centers land at 1/6, 1/2, 5/6.
    <div className="pointer-events-none absolute -inset-1.5 z-10">
      <svg viewBox="0 0 300 300" className="h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id="win-line-grad" gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="url(#win-line-grad)"
          strokeWidth="9"
          strokeLinecap="round"
          pathLength="1"
          className="draw-path win-line"
        />
      </svg>
    </div>
  );
}

function Cell({ index, value, turn, onClick, locked, isWinning, dimmed }) {
  const interactive = !value && !locked;
  const winTone = value === 'X' ? 'border-cyan-300/50 bg-cyan-400/10 shadow-glow-x' : 'border-fuchsia-300/50 bg-fuchsia-400/10 shadow-glow-o';

  return (
    <button
      type="button"
      onClick={() => onClick(index)}
      disabled={!interactive}
      aria-label={`Square ${index + 1}${value ? `, ${value}` : ', empty'}`}
      className={[
        'group relative flex items-center justify-center rounded-2xl border transition-all duration-300 sm:rounded-3xl',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/80',
        isWinning ? `${winTone} animate-win-pulse` : 'border-white/[0.08] bg-white/[0.035]',
        interactive ? 'cursor-pointer hover:border-white/20 hover:bg-white/[0.07] active:scale-95' : 'cursor-default',
        dimmed ? 'opacity-35' : '',
      ].join(' ')}
    >
      {value ? (
        <span className="h-[64%] w-[64%] animate-pop">
          <Mark symbol={value} />
        </span>
      ) : (
        interactive && (
          <span className="h-[56%] w-[56%] opacity-0 transition-opacity duration-200 group-hover:opacity-20">
            <Mark symbol={turn} animate={false} glow={false} />
          </span>
        )
      )}
    </button>
  );
}

export default function Board({ board, turn, result, locked, onCellClick }) {
  const winLine = result && result.winner !== 'draw' ? result.line : null;

  return (
    <div className="glass-strong relative rounded-[2rem] p-3 sm:p-4">
      <div className="pointer-events-none absolute inset-x-12 -top-px h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
      <div className="relative aspect-square w-full">
        <div className={`grid h-full w-full grid-cols-3 grid-rows-3 gap-3 ${result?.winner === 'draw' ? 'animate-shake' : ''}`}>
          {board.map((value, i) => (
            <Cell
              key={i}
              index={i}
              value={value}
              turn={turn}
              onClick={onCellClick}
              locked={locked || Boolean(result)}
              isWinning={winLine?.includes(i) ?? false}
              dimmed={Boolean(winLine) && !winLine.includes(i)}
            />
          ))}
        </div>
        {winLine && <WinLine line={winLine} winner={result.winner} />}
      </div>
    </div>
  );
}
