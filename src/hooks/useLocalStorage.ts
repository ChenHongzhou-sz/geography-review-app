import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const rawValue = window.localStorage.getItem(key);
      return rawValue ? (JSON.parse(rawValue) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((currentValue: T) => T)) => {
    setStoredValue((currentValue) => {
      const nextValue =
        typeof value === "function"
          ? (value as (currentValue: T) => T)(currentValue)
          : value;

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
      }

      return nextValue;
    });
  };

  return [storedValue, setValue] as const;
}
