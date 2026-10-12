// Test-only Auth transport. RPCs execute the unchanged production SQL migration.
import { createServer } from "node:http";
import { createHmac } from "node:crypto";
import { createSyncDatabase, databaseRemote, userA, userB } from "./sync-database.js";

const db = await createSyncDatabase();
const users = [
  { id: userA, email: "parent-a@example.test", password: "TestPass123!" },
  { id: userB, email: "parent-b@example.test", password: "TestPass123!" },
];
const sign = (text) => createHmac("sha256", "test-only-signing-key").update(text).digest("base64url");
function token(user) {
  const body = `${Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")}.${Buffer.from(JSON.stringify({ sub: user.id, email: user.email, role: "authenticated", exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url")}`;
  return `${body}.${sign(body)}`;
}
function publicUser(user) { return { id: user.id, email: user.email, aud: "authenticated", role: "authenticated", app_metadata: { provider: "email", providers: ["email"] }, user_metadata: {}, created_at: "2026-10-12T00:00:00Z" }; }
const server = createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5180");
  response.setHeader("Access-Control-Allow-Headers", "authorization, apikey, content-type, content-profile, x-client-info, x-supabase-api-version");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Content-Type", "application/json");
  const send = (status, data) => { response.statusCode = status; response.end(JSON.stringify(data)); };
  if (request.method === "OPTIONS") return send(204, null);
  if (request.url === "/health") return send(200, { ok: true });
  try {
    let raw = "";
    for await (const chunk of request) raw += chunk;
    const body = raw ? JSON.parse(raw) : {};
    if (request.url.startsWith("/auth/v1/token") || request.url === "/auth/v1/signup") {
      const user = body.refresh_token ? users.find((item) => `refresh-${item.id}` === body.refresh_token) : users.find((item) => item.email === body.email && item.password === body.password);
      if (!user) return send(400, { code: "invalid_credentials", msg: "Invalid credentials" });
      return send(200, { access_token: token(user), refresh_token: `refresh-${user.id}`, expires_in: 3600, token_type: "bearer", user: publicUser(user) });
    }
    const bearer = request.headers.authorization?.slice(7);
    const parts = bearer?.split(".") || [];
    const signed = parts.length === 3 && sign(`${parts[0]}.${parts[1]}`) === parts[2];
    const claims = signed ? JSON.parse(Buffer.from(parts[1], "base64url")) : {};
    const user = claims.exp > Date.now() / 1000 && users.find((item) => item.id === claims.sub);
    if (!user) return send(401, { code: "401", message: "Authentication required" });
    if (request.url === "/auth/v1/user") return send(200, publicUser(user));
    if (request.url.startsWith("/auth/v1/logout")) return send(204, null);
    const remote = databaseRemote(db, user.id);
    if (request.url === "/rest/v1/rpc/read_learning") return send(200, await remote.read(body.p_operation_ids));
    if (request.url === "/rest/v1/rpc/commit_learning") return send(200, await remote.commit(body.p_revision, body.p_snapshot, body.p_operation_ids));
    send(404, { message: "Not found" });
  } catch (error) { send(400, { message: error.message }); }
});
server.listen(54321, "127.0.0.1", () => console.log("Sync test backend ready"));
process.on("SIGTERM", () => server.close(() => void db.close()));
