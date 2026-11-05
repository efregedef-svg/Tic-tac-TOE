import Mark from './Mark';
import { IconHistory, IconMute, IconSettings, IconVolume } from './ui/Icons';

export default function TopBar({ showBrand, soundOn, onHome, onToggleSound, onHistory, onSettings }) {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:pt-6">
      <button
        type="button"
        onClick={onHome}
        aria-label="Home"
        className={`group flex items-center gap-2.5 rounded-xl transition-opacity duration-300 ${showBrand ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        tabIndex={showBrand ? 0 : -1}
      >
        <span className="glass grid h-10 w-10 grid-cols-2 place-items-center gap-0 rounded-xl p-1.5 transition group-hover:border-white/20">
          <Mark symbol="X" animate={false} className="h-3.5 w-3.5" strokeWidth={18} />
          <Mark symbol="O" animate={false} className="h-3.5 w-3.5" strokeWidth={18} />
          <Mark symbol="O" animate={false} className="h-3.5 w-3.5" strokeWidth={18} />
          <Mark symbol="X" animate={false} className="h-3.5 w-3.5" strokeWidth={18} />
        </span>
        <span className="font-display text-lg font-bold tracking-tight">
          Tic<span className="text-gradient">Tac</span>Toe
        </span>
      </button>

      <nav className="flex items-center gap-2">
        <button type="button" onClick={onToggleSound} className="icon-btn" aria-label={soundOn ? 'Mute sound' : 'Unmute sound'} title={soundOn ? 'Mute' : 'Unmute'}>
          {soundOn ? <IconVolume /> : <IconMute />}
        </button>
        <button type="button" onClick={onHistory} className="icon-btn" aria-label="Match history" title="Match history">
          <IconHistory />
        </button>
        <button type="button" onClick={onSettings} className="icon-btn" aria-label="Settings" title="Settings">
          <IconSettings />
        </button>
      </nav>
    </header>
  );
}
