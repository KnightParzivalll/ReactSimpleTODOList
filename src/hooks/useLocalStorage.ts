import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored) as T;
      } catch (error) {
        console.warn(`Failed to parse localStorage key "${key}":`, error);
        return initial;
      }
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
