import { applyOperations, changesFor, syncedKey } from "./merge.js";

const emptySnapshot = () => ({ values: {}, conflicts: [] });
export class AccountCache {
  constructor(storage, remote, { uuid = () => crypto.randomUUID(), now = () => Date.now() } = {}) {
    this.storage = storage;
    this.remote = remote;
    this.uuid = uuid;
    this.now = now;
    this.listeners = new Set();
    this.user = null;
    this.generation = 0;
    this.views = new Map();
    this.volatile = new Map();
    this.state = { user: null, status: "guest", pending: 0, lastSynced: null, conflicts: [] };
  }
  subscribe = (listener) => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
  getState = () => this.state;
  readJSON(key, fallback) {
    try {
      const raw = this.storage.getItem(key);
      if (raw === null) return fallback;
      try { return JSON.parse(raw); } catch { return typeof fallback === "string" ? raw : typeof fallback === "number" && Number.isFinite(Number(raw)) ? Number(raw) : fallback; }
    } catch { return fallback; }
  }
  cacheKey(id = this.user?.id) { return `sparks_sync_cache_v1:${id}`; }
  prefix(id = this.user?.id) { return `sparks_sync_outbox_v1:${id}:`; }
  pending(id = this.user?.id) {
    const operations = new Map(this.volatile);
    const prefix = this.prefix(id);
    try {
      for (let index = 0; index < this.storage.length; index++) {
        const key = this.storage.key(index);
        if (key?.startsWith(prefix)) {
          const operation = this.readJSON(key, null);
          if (operation?.id && Array.isArray(operation.changes)) operations.set(key, operation);
        }
      }
    } catch { /* A storage failure is surfaced when writing. */ }
    return [...operations.entries()].filter(([key]) => key.startsWith(prefix)).map(([, op]) => op).sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));
  }
  snapshot() {
    if (!this.user) return emptySnapshot();
    const cached = this.readJSON(this.cacheKey(), { snapshot: emptySnapshot() });
    return applyOperations(cached.snapshot, this.pending());
  }
  emit(patch = {}) {
    this.views.clear();
    const snapshot = this.snapshot();
    this.state = { ...this.state, user: this.user, pending: this.user ? this.pending().length : 0, conflicts: snapshot.conflicts, ...patch };
    for (const listener of this.listeners) listener();
  }
  setUser(user) {
    if (this.user?.id === user?.id) return;
    this.generation++;
    this.user = user || null;
    this.emit({ status: user ? "pending" : "guest", lastSynced: null });
  }
  read(key, fallback) {
    if (!this.views.has(key)) {
      const value = this.user && syncedKey(key) ? this.snapshot().values[key] ?? fallback : this.readJSON(key, fallback);
      this.views.set(key, value);
    }
    return this.views.get(key);
  }
  enqueue(changes, id = this.uuid()) {
    if (!changes.length) return;
    const operation = { id, at: this.now(), changes };
    const key = `${this.prefix()}${id}`;
    // Separate keys prevent two tabs from replacing a shared pending queue.
    try { this.storage.setItem(key, JSON.stringify(operation)); }
    catch { this.volatile.set(key, operation); this.emit({ status: "storage-error" }); return; }
    this.emit({ status: "pending" });
  }
  write(key, value) {
    if (JSON.stringify(this.read(key, undefined)) === JSON.stringify(value)) return true;
    if (!this.user || !syncedKey(key)) {
      try { this.storage.setItem(key, JSON.stringify(value)); this.emit(); return true; }
      catch { this.views.set(key, value); this.state = { ...this.state, status: "storage-error" }; for (const listener of this.listeners) listener(); return false; }
    }
    this.enqueue(changesFor(key, this.read(key, undefined), value));
    return this.state.status !== "storage-error";
  }
  importGuest() {
    if (!this.user) return;
    let guestId = this.readJSON("sparks_guest_import_id", null);
    if (!guestId) {
      guestId = this.uuid();
      this.storage.setItem("sparks_guest_import_id", JSON.stringify(guestId));
    }
    const changes = [];
    for (let index = 0; index < this.storage.length; index++) {
      const key = this.storage.key(index);
      if (key && syncedKey(key)) changes.push(...changesFor(key, undefined, this.readJSON(key, undefined)));
    }
    // Stable import ID also survives a reply lost after a successful commit.
    this.enqueue(changes, `import-${guestId}`);
  }
  async sync() {
    if (!this.user || !this.remote) return;
    if (this.running) return this.running;
    const userId = this.user.id;
    const generation = this.generation;
    const active = () => this.generation === generation && this.user?.id === userId;
    this.running = (async () => {
      this.emit({ status: "syncing" });
      try {
        // CAS retries rebase durable operations on the latest cloud snapshot.
        for (let attempt = 0; attempt < 6; attempt++) {
          const batch = this.pending(userId).slice(0, 100);
          const cloud = await this.remote.read(batch.map((op) => op.id));
          if (!active()) return;
          const acknowledged = new Set(cloud.acknowledged);
          const fresh = batch.filter((op) => !acknowledged.has(op.id));
          const next = applyOperations(cloud.snapshot, fresh);
          const result = fresh.length ? await this.remote.commit(cloud.revision, next, fresh.map((op) => op.id)) : { ok: true, ...cloud };
          if (!active()) return;
          if (!result.ok) continue;
          // Persist baseline first; a storage failure leaves all operations for
          // an idempotent retry instead of losing their acknowledgement.
          const cached = JSON.stringify({ revision: result.revision, snapshot: result.snapshot });
          if (this.storage.getItem(this.cacheKey(userId)) !== cached) this.storage.setItem(this.cacheKey(userId), cached);
          for (const op of batch) {
            const key = `${this.prefix(userId)}${op.id}`;
            this.storage.removeItem(key);
            this.volatile.delete(key);
          }
          this.emit({ status: this.pending().length ? "pending" : "synced", lastSynced: this.now() });
          if (!this.pending().length) return;
        }
        if (active()) this.emit({ status: "pending" });
      } catch (error) {
        if (active()) this.emit({ status: error.code === "401" || error.status === 401 ? "auth-error" : "offline" });
      }
    })();
    try { await this.running; } finally {
      this.running = null;
      if (this.generation !== generation && this.user) void this.sync();
    }
  }
}
