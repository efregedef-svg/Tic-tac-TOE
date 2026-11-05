import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Mark from '../Mark';
import { IconCpu, IconEye, IconPlus, IconRestart, IconTrophy } from '../ui/Icons';

const CONFETTI_COLORS = ['#22d3ee', '#3b82f6', '#8b5cf6', '#e879f9', '#f0abfc', '#a5f3fc', '#facc15'];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.4 + Math.random() * 2,
        drift: (Math.random() - 0.5) * 260,
        spin: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 540),
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        w: 6 + Math.random() * 6,
        h: 10 + Math.random() * 8,
        round: Math.random() > 0.7,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            width: p.w,
            height: p.round ? p.w : p.h,
            background: p.color,
            borderRadius: p.round ? '999px' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
            '--spin': `${p.spin}deg`,
          }}
        />
      ))}
    </div>
  );
}

export default function ResultOverlay({ result, players, mode, round, onPlayAgain, onNewGame, onClose }) {
  const { winner } = result;
  const isDraw = winner === 'draw';
  const winnerPlayer = isDraw ? null : players[winner];
  const defeat = !isDraw && mode === 'pvc' && winnerPlayer.isAi;
  const victory = !isDraw && !defeat;

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const title = isDraw ? "It's a Draw" : defeat ? 'Defeat' : 'Victory!';
  const subtitle = isDraw
    ? 'Perfectly matched — nobody gave an inch.'
    : defeat
      ? `The computer takes round ${round}. Run it back?`
      : `${winnerPlayer.name} takes round ${round}.`;

  // Portaled to <body> so it sits above everything regardless of parent stacking contexts.
  return createPortal(
    <div className="fixed inset-0 z-40 overflow-y-auto" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fixed inset-0 animate-fade-in bg-ink-950/70 backdrop-blur-md" onClick={onClose} />
      {victory && <Confetti />}

      <div className="pointer-events-none relative flex min-h-full items-center justify-center p-4">
      <div className="glass-strong pointer-events-auto relative w-full max-w-sm animate-scale-in overflow-hidden rounded-[2rem] p-6 text-center sm:p-8">
        <div
          className={`pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 animate-glow-pulse rounded-full blur-3xl ${
            isDraw ? 'bg-slate-400/25' : defeat ? 'bg-rose-500/30' : winner === 'X' ? 'bg-cyan-400/35' : 'bg-fuchsia-500/35'
          }`}
        />

        <div className="relative mx-auto mb-5 flex h-24 items-center justify-center">
          {isDraw ? (
            <div className="flex items-center gap-1">
              <span className="h-16 w-16 animate-slide-left">
                <Mark symbol="X" animate={false} />
              </span>
              <span className="h-16 w-16 animate-slide-right">
                <Mark symbol="O" animate={false} />
              </span>
            </div>
          ) : (
            <div className="relative grid h-24 w-24 animate-trophy place-items-center rounded-3xl border border-white/10 bg-white/5">
              {defeat ? <IconCpu className="h-11 w-11 text-rose-300" /> : <IconTrophy className="h-11 w-11 text-amber-300 drop-shadow-[0_0_12px_rgba(252,211,77,0.6)]" />}
              <span className="absolute -bottom-3 -right-3 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-ink-800">
                <Mark symbol={winner} animate={false} className="h-6 w-6" strokeWidth={15} />
              </span>
            </div>
          )}
        </div>

        <h2
          className={`relative font-display text-4xl font-extrabold tracking-tight ${
            defeat ? 'text-rose-200' : isDraw ? 'text-slate-100' : 'bg-[linear-gradient(110deg,#a5f3fc,#c4b5fd,#f5d0fe,#a5f3fc)] bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer'
          }`}
        >
          {title}
        </h2>
        <p className="relative mt-2 text-slate-300">{subtitle}</p>

        <div className="relative mt-6 grid gap-3">
          <button type="button" onClick={onPlayAgain} className="btn-primary w-full" autoFocus>
            <IconRestart className="h-5 w-5" /> Play again
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={onNewGame} className="btn-ghost px-3 text-sm">
              <IconPlus className="h-4 w-4" /> New game
            </button>
            <button type="button" onClick={onClose} className="btn-ghost px-3 text-sm">
              <IconEye className="h-4 w-4" /> View board
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>,
    document.body,
  );
}
