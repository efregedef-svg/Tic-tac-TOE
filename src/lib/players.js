import { DEFAULT_SETUP, DIFFICULTIES, NAME_MAX } from './constants.js';
import { other } from './gameLogic.js';

const clean = (name, fallback) => (name || '').trim().slice(0, NAME_MAX) || fallback;

export const difficultyLabel = (id) => DIFFICULTIES.find((d) => d.id === id)?.label ?? 'Medium';

/** Guards against stale or hand-edited values coming from localStorage. */
export function normalizeSetup(setup = {}) {
  return {
    mode: setup.mode === 'pvp' ? 'pvp' : 'pvc',
    difficulty: DIFFICULTIES.some((d) => d.id === setup.difficulty) ? setup.difficulty : DEFAULT_SETUP.difficulty,
    p1Name: typeof setup.p1Name === 'string' ? setup.p1Name.slice(0, NAME_MAX) : '',
    p2Name: typeof setup.p2Name === 'string' ? setup.p2Name.slice(0, NAME_MAX) : '',
    p1Symbol: setup.p1Symbol === 'O' ? 'O' : 'X',
  };
}

/** Maps a setup form to { X: player, O: player }. */
export function buildPlayers(setup) {
  const s = normalizeSetup(setup);
  const p1 = { name: clean(s.p1Name, s.mode === 'pvc' ? 'You' : 'Player 1'), isAi: false };
  const p2 =
    s.mode === 'pvc'
      ? { name: 'Computer', isAi: true, difficulty: s.difficulty }
      : { name: clean(s.p2Name, 'Player 2'), isAi: false };
  return { [s.p1Symbol]: p1, [other(s.p1Symbol)]: p2 };
}
