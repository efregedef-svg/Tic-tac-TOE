import { useEffect, useState } from 'react';

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

function read(key, initial) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return initial;
    const parsed = JSON.parse(raw);
    // Merge objects with defaults so newly added preference keys get sane values.
    if (isPlainObject(initial)) return isPlainObject(parsed) ? { ...initial, ...parsed } : initial;
    if (Array.isArray(initial)) return Array.isArray(parsed) ? parsed : initial;
    return parsed;
  } catch {
    return initial;
  }
}

/** useState that persists to localStorage. Storage failures (private mode, quota) are ignored. */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => read(key, initial));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable — keep working in memory */
    }
  }, [key, value]);

  return [value, setValue];
}
