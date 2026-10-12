import { useCallback, useRef, useSyncExternalStore } from "react";
import { accountCache } from "../sync/account.js";

export function safeReadStorage(key, fallback) {
  return accountCache.read(key, fallback);
}
export function safeWriteStorage(key, value) {
  return accountCache.write(key, value);
}
export function useLocalStorageState(key, fallback) {
  const initial = useRef(fallback);
  const value = useSyncExternalStore(accountCache.subscribe, () => accountCache.read(key, initial.current));
  const setValue = useCallback((next) => {
    const previous = accountCache.read(key, initial.current);
    accountCache.write(key, typeof next === "function" ? next(previous) : next);
  }, [key]);
  return [value, setValue];
}
