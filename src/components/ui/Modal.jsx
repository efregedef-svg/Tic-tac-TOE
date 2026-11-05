import { useEffect, useRef } from 'react';
import { IconClose } from './Icons';

export default function Modal({ open, onClose, title, icon, children, footer }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 animate-fade-in bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="glass-strong relative flex max-h-[88dvh] w-full max-w-lg animate-scale-in flex-col overflow-hidden rounded-3xl outline-none"
      >
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/70 to-transparent" />
        <header className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            {icon && <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500/15 text-violet-300">{icon}</span>}
            <h2 className="font-display text-lg font-semibold">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="icon-btn h-9 w-9" aria-label="Close">
            <IconClose className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && <footer className="border-t border-white/5 px-5 py-4 sm:px-6">{footer}</footer>}
      </div>
    </div>
  );
}
