import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AccountCache } from "../../src/sync/cache.js";
import { applyOperations, changesFor, PROGRESS_KEY } from "../../src/sync/merge.js";
import { emptyProgress, recordAnswer } from "../../src/utils/learningProgress.js";
import { asUser, createSyncDatabase, databaseRemote, memoryStorage, userA, userB } from "../support/sync-database.js";

let db;
beforeAll(async () => { db = await createSyncDatabase(); }, 30000);
afterAll(async () => { await db?.close(); });
const op = (before, after, id = crypto.randomUUID()) => ({ id, changes: changesFor(PROGRESS_KEY, before, after) });
const progress = (snapshot) => snapshot.values[PROGRESS_KEY];

function browser(user = userA, storage = memoryStorage(), remote = databaseRemote(db, user)) {
  const cache = new AccountCache(storage, remote);
  cache.setUser({ id: user });
  return cache;
}

describe("merge policies", () => {
  it("keeps independent words and does not invent mastery when a newer answer is wrong", () => {
    const date = new Date(2026, 9, 12, 12);
    const apple = recordAnswer(emptyProgress, "apple", true, date);
    const banana = recordAnswer(emptyProgress, "banana", true, date);
    let cloud = applyOperations(null, [op(emptyProgress, apple), op(emptyProgress, banana)]);
    expect(Object.keys(progress(cloud).memory)).toEqual(["apple", "banana"]);
    expect(progress(cloud).days["2026-10-12"]).toBe(2);
    const wrong = recordAnswer(apple, "apple", false, new Date(2026, 9, 13, 12));
    cloud = applyOperations(cloud, [op(apple, wrong), op(emptyProgress, apple)]);
    expect(progress(cloud).memory.apple.reading.lastCorrect).toBe(false);
    expect(progress(cloud).memory.apple.reading.step).toBe(0);
    expect(progress(cloud).review).toContain("apple");
    expect(progress(cloud).mastered).toEqual([]);
  });
  it("keeps both conflicting drafts including a cleared draft", () => {
    const original = { ...emptyProgress, drafts: { email: "Start" } };
    const a = { ...original, drafts: { email: "Browser A" } };
    const b = { ...original, drafts: { email: "Browser B" } };
    let cloud = applyOperations({ values: { [PROGRESS_KEY]: original } }, [op(original, a), op(original, b)]);
    expect(progress(cloud).drafts.email).toBe("Browser A");
    expect(cloud.conflicts.map((item) => item.text)).toEqual(["Browser B"]);
    cloud = applyOperations(cloud, [op(a, { ...a, drafts: { email: "" } })]);
    expect(progress(cloud).drafts.email).toBe("");
  });
  it("rebases an offline success on earlier cloud evidence without bypassing the due date", () => {
    const earlier = recordAnswer(emptyProgress, "apple", true, new Date(2026, 9, 12, 12));
    const later = recordAnswer(emptyProgress, "apple", true, new Date(2026, 9, 13, 12));
    const cloud = applyOperations({ values: { [PROGRESS_KEY]: earlier } }, [op(emptyProgress, later)]);
    expect(progress(cloud).memory.apple.reading.successDays).toEqual(["2026-10-12", "2026-10-13"]);
    const tooSoon = recordAnswer(emptyProgress, "apple", true, new Date(2026, 9, 12, 13));
    const earlyCloud = applyOperations({ values: { [PROGRESS_KEY]: earlier } }, [op(emptyProgress, tooSoon)]);
    expect(progress(earlyCloud).memory.apple.reading.successDays).toEqual(["2026-10-12"]);
    expect(progress(earlyCloud).memory.apple.reading.step).toBe(1);
  });
  it("never rolls an activity backwards after a stale upload", () => {
    const key = "sparks_activity_story";
    const before = { fingerprint: "same", stage: "quiz", index: 0, responses: [] };
    const farther = { ...before, index: 2, responses: [true, false] };
    const behind = { ...before, index: 1, responses: [true] };
    const snapshot = applyOperations({ values: { [key]: farther } }, [{ id: "late", changes: changesFor(key, before, behind) }]);
    expect(snapshot.values[key]).toEqual(farther);
  });
});

describe("durable sync against the actual PostgreSQL migration", () => {
  it("rebases concurrent browsers, deduplicates a lost response and imports guest data once", async () => {
    const a = browser(); const b = browser();
    await Promise.all([a.sync(), b.sync()]);
    const first = a.read(PROGRESS_KEY, emptyProgress);
    const second = b.read(PROGRESS_KEY, emptyProgress);
    a.write(PROGRESS_KEY, recordAnswer(first, "sync-a", true));
    b.write(PROGRESS_KEY, recordAnswer(second, "sync-b", false));
    await Promise.all([a.sync(), b.sync()]);
    await a.sync();
    expect(Object.keys(a.read(PROGRESS_KEY, emptyProgress).memory)).toEqual(expect.arrayContaining(["sync-a", "sync-b"]));
    expect(a.pending()).toEqual([]);
    const current = a.read(PROGRESS_KEY, emptyProgress);
    let loseReply = true;
    const real = databaseRemote(db, userA);
    a.remote = { read: real.read, async commit(...args) {
      const result = await real.commit(...args);
      if (loseReply) { loseReply = false; throw new Error("reply lost"); }
      return result;
    } };
    a.write(PROGRESS_KEY, recordAnswer(current, "lost-reply", true));
    await a.sync();
    expect(a.state.status).toBe("offline");
    expect(a.pending()).toHaveLength(1);
    const reloaded = browser(userA, a.storage);
    await reloaded.sync();
    expect(reloaded.pending()).toHaveLength(0);
    const day = Object.keys(current.days)[0];
    expect(reloaded.read(PROGRESS_KEY, emptyProgress).days[day]).toBe(current.days[day] + 1);
    const guestStorage = memoryStorage();
    guestStorage.setItem(PROGRESS_KEY, JSON.stringify({ ...emptyProgress, seen: ["guest"], days: { "2026-10-01": 7 } }));
    const migrated = browser(userA, guestStorage);
    migrated.importGuest(); await migrated.sync();
    migrated.importGuest(); await migrated.sync();
    expect(migrated.read(PROGRESS_KEY, emptyProgress).days["2026-10-01"]).toBe(7);
    expect(JSON.parse(guestStorage.getItem(PROGRESS_KEY)).seen).toEqual(["guest"]);
  });
  it("keeps offline work through reload and account switching", async () => {
    const offline = browser(userB, memoryStorage(), { read() { throw new Error("offline"); } });
    offline.write(PROGRESS_KEY, recordAnswer(emptyProgress, "offline-b", true));
    await offline.sync();
    expect(offline.state.status).toBe("offline");
    offline.setUser({ id: userA });
    expect(offline.read(PROGRESS_KEY, emptyProgress).seen).not.toContain("offline-b");
    const reloaded = browser(userB, offline.storage);
    await reloaded.sync();
    expect(reloaded.read(PROGRESS_KEY, emptyProgress).memory["offline-b"]).toBeTruthy();
    reloaded.setUser(null);
    expect(reloaded.read(PROGRESS_KEY, emptyProgress)).toEqual(emptyProgress);
  });
  it("does not install an in-flight response into another account", async () => {
    let finish;
    const a = browser(userA, memoryStorage(), { read: () => new Promise((resolve) => { finish = resolve; }) });
    const sync = a.sync();
    a.setUser(null);
    finish({ revision: 9, snapshot: { values: { [PROGRESS_KEY]: { ...emptyProgress, seen: ["private-a"] } }, conflicts: [] }, acknowledged: [] });
    await sync;
    expect(a.read(PROGRESS_KEY, emptyProgress).seen).toEqual([]);
    expect(a.storage.getItem(a.cacheKey(userA))).toBeNull();
  });
  it("preserves two tabs' operations and protects quota failure", async () => {
    const storage = memoryStorage();
    const a = browser(userB, storage); const b = browser(userB, storage);
    await a.sync(); b.emit();
    a.write(PROGRESS_KEY, recordAnswer(a.read(PROGRESS_KEY, emptyProgress), "tab-a", true));
    b.emit(); b.write(PROGRESS_KEY, recordAnswer(b.read(PROGRESS_KEY, emptyProgress), "tab-b", true));
    expect(a.pending()).toHaveLength(2);
    await Promise.all([a.sync(), b.sync()]); a.emit();
    expect(Object.keys(a.read(PROGRESS_KEY, emptyProgress).memory)).toEqual(expect.arrayContaining(["tab-a", "tab-b"]));
    const broken = memoryStorage();
    broken.setItem = () => { throw new Error("quota"); };
    const cache = browser(userA, broken);
    cache.write(PROGRESS_KEY, recordAnswer(emptyProgress, "quota", true));
    expect(cache.state.status).toBe("storage-error");
    expect(cache.read(PROGRESS_KEY, emptyProgress).memory.quota).toBeTruthy();
    expect(cache.pending()).toHaveLength(1);
  });
  it("enforces row isolation, RPC identity, stale revisions and malformed payloads", async () => {
    const remoteA = databaseRemote(db, userA);
    const account = await remoteA.read([]);
    expect((await remoteA.commit(account.revision - 1, account.snapshot, ["stale"])).ok).toBe(false);
    await expect(remoteA.commit(account.revision, {}, ["bad"])).rejects.toThrow("Invalid sync payload");
    const rows = await asUser(db, userB, (tx) => tx.query("select user_id from public.learning_accounts"));
    expect(rows.rows.map((row) => row.user_id)).toEqual([userB]);
    await expect(asUser(db, userB, (tx) => tx.query("update public.learning_accounts set revision = 0"))).rejects.toThrow(/permission denied/);
    await expect(asUser(db, null, (tx) => tx.query("select public.read_learning('{}')"), "anon")).rejects.toThrow(/permission denied/);
    await expect(asUser(db, null, (tx) => tx.query("select public.read_learning('{}')"))).rejects.toThrow(/Authentication required/);
  });
});
