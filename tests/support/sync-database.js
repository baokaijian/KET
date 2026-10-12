import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";

export const userA = "11111111-1111-4111-8111-111111111111";
export const userB = "22222222-2222-4222-8222-222222222222";
export async function createSyncDatabase() {
  const db = new PGlite();
  await db.exec(`
    create role anon;
    create role authenticated;
    create schema auth;
    create table auth.users(id uuid primary key);
    insert into auth.users values('${userA}'), ('${userB}');
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to authenticated, anon;
  `);
  await db.exec(await readFile(new URL("../../supabase/migrations/202610120001_account_sync.sql", import.meta.url), "utf8"));
  return db;
}
export function asUser(db, id, action, role = "authenticated") {
  return db.transaction(async (tx) => {
    await tx.exec(`set local role ${role}`);
    await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [id || ""]);
    return action(tx);
  });
}
export function databaseRemote(db, id) {
  return {
    async read(ids) {
      return asUser(db, id, async (tx) => (await tx.query("select public.read_learning($1::text[]) as result", [ids])).rows[0].result);
    },
    async commit(revision, snapshot, ids) {
      return asUser(db, id, async (tx) => (await tx.query("select public.commit_learning($1::bigint, $2::jsonb, $3::text[]) as result", [revision, JSON.stringify(snapshot), ids])).rows[0].result);
    },
  };
}
export function memoryStorage() {
  const items = new Map();
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => items.set(key, value),
    removeItem: (key) => items.delete(key),
    key: (index) => [...items.keys()][index] ?? null,
    get length() { return items.size; },
  };
}
