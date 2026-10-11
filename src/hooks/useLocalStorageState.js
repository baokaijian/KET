import { useEffect, useState } from "react";

export function safeReadStorage(key, fallback) {
  let raw;
  try {
    raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    if (raw === undefined) return fallback;
    if (typeof fallback === "string") return raw ?? fallback;
    if (typeof fallback === "number") {
      const numeric = Number(raw);
      return Number.isFinite(numeric) ? numeric : fallback;
    }
    console.warn(`Failed to read ${key} from localStorage:`, error);
    return fallback;
  }
}

export function safeWriteStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to write ${key} to localStorage:`, error);
  }
}

export function useLocalStorageState(key, fallback) {
  const [value, setValue] = useState(() => safeReadStorage(key, fallback));

  useEffect(() => {
    safeWriteStorage(key, value);
  }, [key, value]);

  return [value, setValue];
}
