import { useCallback, useRef } from 'react';
import { playSound } from '../lib/sound';

/** Returns a stable `play(name)` that respects the current sound settings. */
export function useSound(settings) {
  const ref = useRef(settings);
  ref.current = settings;

  return useCallback((name) => {
    const { sound, volume } = ref.current;
    if (sound) playSound(name, volume);
  }, []);
}
