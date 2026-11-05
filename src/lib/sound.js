// Tiny synthesized sound effects via the Web Audio API — no audio files needed.

let ctx = null;

function getContext() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(c, { freq, to, type = 'sine', start = 0, duration = 0.15, gain = 0.2 }) {
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const amp = c.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + duration);

  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(Math.max(gain, 0.0002), t0 + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(amp).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

const arpeggio = (freqs, { type = 'triangle', step = 0.08, duration = 0.2, gain = 0.15, last } = {}) =>
  freqs.map((freq, i) => ({
    freq,
    type,
    start: i * step,
    duration: i === freqs.length - 1 && last ? last : duration,
    gain,
  }));

const SOUNDS = {
  click: [{ freq: 900, type: 'triangle', duration: 0.05, gain: 0.07 }],
  toggle: [{ freq: 660, to: 990, type: 'triangle', duration: 0.09, gain: 0.1 }],
  x: [{ freq: 520, to: 880, type: 'triangle', duration: 0.14, gain: 0.17 }],
  o: [{ freq: 460, to: 280, type: 'sine', duration: 0.18, gain: 0.22 }],
  start: arpeggio([392, 523.25, 659.25], { step: 0.07, duration: 0.18, gain: 0.13 }),
  win: [
    ...arpeggio([523.25, 659.25, 783.99, 1046.5], { step: 0.09, duration: 0.2, gain: 0.15, last: 0.55 }),
    { freq: 2093, type: 'sine', start: 0.36, duration: 0.4, gain: 0.04 },
  ],
  lose: arpeggio([392, 349.23, 311.13, 261.63], { type: 'sawtooth', step: 0.13, duration: 0.22, gain: 0.05, last: 0.5 }),
  draw: [
    { freq: 440, type: 'sine', duration: 0.2, gain: 0.14 },
    { freq: 415.3, type: 'sine', start: 0.18, duration: 0.32, gain: 0.14 },
  ],
};

export function playSound(name, volume = 0.7) {
  const notes = SOUNDS[name];
  if (!notes || volume <= 0) return;
  const c = getContext();
  if (!c) return;
  notes.forEach((note) => tone(c, { ...note, gain: note.gain * volume }));
}
