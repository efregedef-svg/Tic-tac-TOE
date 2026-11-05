import { useEffect, useState } from 'react';

export function Toggle({ checked, onChange, label, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 disabled:opacity-40 ${
        checked ? 'border-transparent bg-gradient-to-r from-violet-500 to-sky-500' : 'border-white/10 bg-white/10'
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-[22px] w-[22px] rounded-full bg-white shadow-md transition-transform duration-300 ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  );
}

export function Segmented({ options, value, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/70 ${
              active ? 'bg-white/15 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** A destructive button that needs a second tap within 3s to fire. */
export function ConfirmButton({ onConfirm, children, confirmLabel = 'Tap again to confirm', disabled, className = 'btn-danger' }) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return undefined;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);

  return (
    <button
      type="button"
      disabled={disabled}
      className={`${className} ${armed ? 'animate-shake ring-1 ring-rose-400/60' : ''}`}
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else {
          setArmed(true);
        }
      }}
    >
      {armed ? confirmLabel : children}
    </button>
  );
}
