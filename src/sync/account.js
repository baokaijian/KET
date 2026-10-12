import { createClient } from "@supabase/supabase-js";
import { AccountCache } from "./cache.js";

export const syncLabels = {
  guest: "当前使用本浏览器记录",
  pending: "记录已保存，等待同步",
  syncing: "正在同步学习记录…",
  synced: "学习记录已同步",
  offline: "同步暂未完成，记录保留在本浏览器，联网后重试",
  "auth-error": "登录已过期，请重新登录；待同步记录已保留",
  "storage-error": "浏览器无法保存缓存，请立即同步并检查存储空间；刷新可能丢失未同步记录",
};

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const accountConfigured = Boolean(url && key);
export const supabase = accountConfigured ? createClient(url, key, {
  auth: { storageKey: "sparks_auth_v1", detectSessionInUrl: true, flowType: "pkce" },
  global: { fetch: (url, options = {}) => fetch(url, { ...options, signal: options.signal ? AbortSignal.any([options.signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000) }) },
}) : null;
const remote = supabase && {
  async read(ids) {
    const { data, error, status } = await supabase.rpc("read_learning", { p_operation_ids: ids });
    if (error) throw Object.assign(error, { status });
    return data;
  },
  async commit(revision, snapshot, ids) {
    const { data, error, status } = await supabase.rpc("commit_learning", { p_revision: revision, p_snapshot: snapshot, p_operation_ids: ids });
    if (error) throw Object.assign(error, { status });
    return data;
  },
};
const storage = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: (key) => localStorage.removeItem(key),
  key: (index) => localStorage.key(index),
  get length() { return localStorage.length; },
};
export const accountCache = new AccountCache(storage, remote);
let started = false;
export function startAccountSync() {
  if (started) return;
  started = true;
  let timer;
  accountCache.subscribe(() => {
    clearTimeout(timer);
    if (accountCache.user && accountCache.state.status === "pending") timer = setTimeout(() => void accountCache.sync(), 700);
  });
  window.addEventListener("storage", (event) => {
    if (event.key?.startsWith("sparks_")) {
      accountCache.emit();
      if (accountCache.user) void accountCache.sync();
    }
  });
  window.addEventListener("online", () => void accountCache.sync());
  window.addEventListener("focus", () => void accountCache.sync());
  document.addEventListener("visibilitychange", () => { if (!document.hidden) void accountCache.sync(); });
  setInterval(() => { if (!document.hidden) void accountCache.sync(); }, 30000);
  if (supabase) supabase.auth.onAuthStateChange((event, session) => {
    // Supabase owns an auth lock here; defer all network calls out of callback.
    const recovery = Boolean(session && (accountCache.state.recovery || event === "PASSWORD_RECOVERY"));
    accountCache.setUser(session?.user || null);
    accountCache.emit({ recovery });
    if (session) setTimeout(() => void accountCache.sync(), 0);
  });
}

export async function signOutAccount() {
  await accountCache.sync();
  const result = await supabase?.auth.signOut({ scope: "local" });
  if (result?.error) throw result.error;
  accountCache.setUser(null);
  accountCache.emit({ recovery: false });
}
