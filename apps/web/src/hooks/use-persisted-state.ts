import { useEffect, useState } from "react";

export default function usePersistedState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved) as T;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  });

  useEffect(() => {
    const timeout = setTimeout(
      () => localStorage.setItem(key, JSON.stringify(state)),
      300
    );
    return () => clearTimeout(timeout);
  }, [key, state]);

  return [state, setState] as const;
}
