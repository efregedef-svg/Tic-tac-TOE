import Mark from './Mark';
import { IconCpu, IconHistory, IconPlay, IconSettings, IconShield, IconUsers } from './ui/Icons';

// Demo sequence for the hero board: X wins on the diagonal.
const DEMO = [
  { i: 0, s: 'X' },
  { i: 2, s: 'O' },
  { i: 4, s: 'X' },
  { i: 6, s: 'O' },
  { i: 8, s: 'X' },
];

function HeroBoard() {
  return (
    <div className="relative mx-auto w-52 animate-float sm:w-60">
      <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-violet-600/40 via-indigo-500/20 to-sky-400/40 blur-3xl" />
      <div className="glass-strong relative grid aspect-square grid-cols-3 gap-2 rounded-[1.75rem] p-3">
        {Array.from({ length: 9 }, (_, i) => {
          const step = DEMO.findIndex((d) => d.i === i);
          const winning = [0, 4, 8].includes(i);
          return (
            <div
              key={i}
              className={`grid place-items-center rounded-xl border ${
                winning ? 'border-cyan-300/30 bg-cyan-400/[0.07]' : 'border-white/[0.07] bg-white/[0.03]'
              }`}
            >
              {step >= 0 && (
                <span className="h-[66%] w-[66%]">
                  <Mark symbol={DEMO[step].s} delay={0.35 + step * 0.32} />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <p className="font-display text-2xl font-bold tabular-nums text-white">{value}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
    </div>
  );
}

export default function WelcomeScreen({ history, onPlay, onHistory, onSettings }) {
  const total = history.length;
  const draws = history.filter((h) => h.winner === 'draw').length;
  const vsCpuWins = history.filter((h) => h.mode === 'pvc' && h.winner !== 'draw' && !h.players?.[h.winner]?.isAi).length;

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8 text-center sm:py-12">
      <div className="animate-fade-up">
        <HeroBoard />
      </div>

      <div className="mt-10 animate-fade-up [animation-delay:120ms]">
        <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
          <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-violet-300" /> Neon Edition
        </span>
        <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">
          Tic <span className="text-gradient">Tac</span> Toe
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-slate-400 sm:text-lg">
          Challenge a friend on the same device, or test yourself against an AI that never loses on Hard.
        </p>
      </div>

      <div className="mt-9 flex w-full max-w-sm animate-fade-up flex-col gap-3 [animation-delay:220ms]">
        <button type="button" onClick={onPlay} className="btn-primary group w-full py-4 text-lg">
          <IconPlay className="h-5 w-5 transition-transform group-hover:scale-110" /> Play
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={onHistory} className="btn-ghost text-sm">
            <IconHistory className="h-4 w-4" /> History
          </button>
          <button type="button" onClick={onSettings} className="btn-ghost text-sm">
            <IconSettings className="h-4 w-4" /> Settings
          </button>
        </div>
      </div>

      <div className="mt-10 flex animate-fade-up flex-wrap items-center justify-center gap-2 [animation-delay:320ms]">
        {[
          { icon: <IconUsers className="h-3.5 w-3.5" />, text: 'Local multiplayer' },
          { icon: <IconCpu className="h-3.5 w-3.5" />, text: '3 AI levels' },
          { icon: <IconShield className="h-3.5 w-3.5" />, text: 'Unbeatable Hard mode' },
        ].map((f) => (
          <span key={f.text} className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-slate-300">
            {f.icon} {f.text}
          </span>
        ))}
      </div>

      {total > 0 && (
        <div className="glass mt-8 grid w-full max-w-sm animate-fade-up grid-cols-3 rounded-2xl px-4 py-4 [animation-delay:400ms]">
          <Stat value={total} label="Matches" />
          <Stat value={vsCpuWins} label="CPU beaten" />
          <Stat value={draws} label="Draws" />
        </div>
      )}
    </div>
  );
}
