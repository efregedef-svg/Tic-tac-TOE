export const STORAGE_KEYS = {
  settings: 'neon-ttt:settings:v1',
  setup: 'neon-ttt:setup:v1',
  history: 'neon-ttt:history:v1',
};

export const DEFAULT_SETTINGS = {
  sound: true,
  volume: 0.7,
  alternateStart: true,
  aiSpeed: 'normal',
};

export const DEFAULT_SETUP = {
  mode: 'pvc', // 'pvc' | 'pvp'
  difficulty: 'medium', // 'easy' | 'medium' | 'hard'
  p1Name: '',
  p2Name: '',
  p1Symbol: 'X',
};

export const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', desc: 'Casual moves, plenty of mistakes.' },
  { id: 'medium', label: 'Medium', desc: 'Blocks threats, sometimes slips.' },
  { id: 'hard', label: 'Hard', desc: 'Minimax. It never loses.' },
];

export const AI_SPEEDS = [
  { value: 'fast', label: 'Fast', delay: 250 },
  { value: 'normal', label: 'Normal', delay: 550 },
  { value: 'relaxed', label: 'Relaxed', delay: 950 },
];

export const MAX_HISTORY = 50;
export const NAME_MAX = 16;
