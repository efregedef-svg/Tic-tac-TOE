import { useState } from 'react';
import Mark from './Mark';
import { IconArrowLeft, IconBolt, IconCpu, IconLeaf, IconPlay, IconShield, IconUsers } from './ui/Icons';
import { DIFFICULTIES, NAME_MAX } from '../lib/constants';
import { normalizeSetup } from '../lib/players';
import { other } from '../lib/gameLogic';

const DIFFICULTY_ICONS = {
  easy: <IconLeaf className="h-5 w-5" />,
  medium: <IconBolt className="h-5 w-5" />,
  hard: <IconShield className="h-5 w-5" />,
};

function OptionCard({ selected, onClick, icon, title, desc }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`group relative flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 active:scale-[0.98] ${
        selected
          ? 'border-violet-400/50 bg-gradient-to-br from-violet-500/20 to-sky-500/10 shadow-glow'
          : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
      }`}
    >
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${
          selected ? 'bg-violet-500/25 text-violet-100' : 'bg-white/5 text-slate-400 group-hover:text-slate-200'
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-semibold text-white">{title}</span>
        <span className="mt-0.5 block text-sm leading-snug text-slate-400">{desc}</span>
      </span>
      <span
        className={`absolute right-3 top-3 h-2.5 w-2.5 rounded-full transition-all ${
          selected ? 'bg-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.9)]' : 'bg-white/10'
        }`}
      />
    </button>
  );
}

function Section({ label, hint, children }) {
  return (
    <fieldset className="space-y-3">
      <legend className="label mb-3">{label}</legend>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </fieldset>
  );
}

function NameField({ id, label, value, onChange, placeholder, symbol }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-300">
        <Mark symbol={symbol} animate={false} className="h-4 w-4" strokeWidth={16} />
        {label}
      </label>
      <input
        id={id}
        className="input"
        value={value}
        maxLength={NAME_MAX}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function SetupScreen({ initial, onStart, onBack, play }) {
  const [form, setForm] = useState(() => normalizeSetup(initial));
  const set = (patch) => {
    play('click');
    setForm((f) => ({ ...f, ...patch }));
  };
  const setName = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const isPvc = form.mode === 'pvc';
  const p2Symbol = other(form.p1Symbol);

  const submit = (e) => {
    e.preventDefault();
    onStart({ ...form, p1Name: form.p1Name.trim(), p2Name: form.p2Name.trim() });
  };

  return (
    <div className="mx-auto w-full max-w-2xl animate-fade-up py-6 sm:py-10">
      <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 rounded-lg text-sm text-slate-400 transition hover:text-white">
        <IconArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Match setup</h1>
      <p className="mt-2 text-slate-400">Pick a mode, name your players and choose your side.</p>

      <form onSubmit={submit} className="glass-strong mt-8 space-y-8 rounded-3xl p-5 sm:p-8">
        <Section label="Game mode">
          <div className="grid gap-3 sm:grid-cols-2">
            <OptionCard
              selected={isPvc}
              onClick={() => set({ mode: 'pvc' })}
              icon={<IconCpu className="h-5 w-5" />}
              title="Vs Computer"
              desc="Solo play against the AI."
            />
            <OptionCard
              selected={!isPvc}
              onClick={() => set({ mode: 'pvp' })}
              icon={<IconUsers className="h-5 w-5" />}
              title="Vs Friend"
              desc="Two players, one device."
            />
          </div>
        </Section>

        {isPvc && (
          <Section label="Difficulty">
            <div className="grid gap-3 sm:grid-cols-3">
              {DIFFICULTIES.map((d) => (
                <OptionCard
                  key={d.id}
                  selected={form.difficulty === d.id}
                  onClick={() => set({ difficulty: d.id })}
                  icon={DIFFICULTY_ICONS[d.id]}
                  title={d.label}
                  desc={d.desc}
                />
              ))}
            </div>
          </Section>
        )}

        <Section label={isPvc ? 'Your symbol' : 'Player 1 symbol'} hint="X makes the first move of the match.">
          <div className="grid grid-cols-2 gap-3">
            {['X', 'O'].map((s) => {
              const selected = form.p1Symbol === s;
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => set({ p1Symbol: s })}
                  className={`flex items-center justify-center gap-3 rounded-2xl border py-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 active:scale-[0.98] ${
                    selected
                      ? s === 'X'
                        ? 'border-cyan-300/50 bg-cyan-400/10 shadow-glow-x'
                        : 'border-fuchsia-300/50 bg-fuchsia-400/10 shadow-glow-o'
                      : 'border-white/10 bg-white/[0.03] opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className="h-10 w-10">
                    <Mark key={`${s}-${selected}`} symbol={s} animate={selected} />
                  </span>
                  <span className="text-left">
                    <span className="block font-display text-lg font-bold">Play {s}</span>
                    <span className="block text-xs text-slate-400">{s === 'X' ? 'Moves first' : 'Moves second'}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        <Section label="Players">
          <div className="grid gap-4 sm:grid-cols-2">
            <NameField
              id="p1-name"
              label={isPvc ? 'Your name' : 'Player 1'}
              value={form.p1Name}
              onChange={setName('p1Name')}
              placeholder={isPvc ? 'You' : 'Player 1'}
              symbol={form.p1Symbol}
            />
            {isPvc ? (
              <div>
                <p className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Mark symbol={p2Symbol} animate={false} className="h-4 w-4" strokeWidth={16} />
                  Opponent
                </p>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-slate-300">
                  <IconCpu className="h-4 w-4 text-violet-300" />
                  Computer · {DIFFICULTIES.find((d) => d.id === form.difficulty)?.label}
                </div>
              </div>
            ) : (
              <NameField id="p2-name" label="Player 2" value={form.p2Name} onChange={setName('p2Name')} placeholder="Player 2" symbol={p2Symbol} />
            )}
          </div>
        </Section>

        <button type="submit" className="btn-primary w-full py-4 text-lg">
          <IconPlay className="h-5 w-5" /> Start match
        </button>
      </form>
    </div>
  );
}
