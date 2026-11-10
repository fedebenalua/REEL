import { createHash, randomBytes, randomInt, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { sql } from "./db.js";

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export async function readJson(request, maxBytes = 20_000) {
  const text = await request.text();
  if (text.length > maxBytes) throw new HttpError(413, "Petición demasiado grande.");
  try {
    return JSON.parse(text || "{}");
  } catch {
    throw new HttpError(400, "JSON no válido.");
  }
}

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const handle = (fn) => async (request) => {
  try {
    return await fn(request);
  } catch (error) {
    if (error instanceof HttpError) return json({ error: error.message }, error.status);
    console.error("api error:", error?.message);
    return json({ error: "Algo ha fallado. Inténtalo de nuevo en un momento." }, 500);
  }
};

export const sha256 = (s) => createHash("sha256").update(s).digest("hex");

const scrypt = promisify(scryptCb);
const SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function newAccessCode() {
  const pick = () => Array.from({ length: 4 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
  return `BRIO-${pick()}-${pick()}-${pick()}`;
}
export const normalizeCode = (c) => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

export async function hashAccessCode(code) {
  const salt = randomBytes(16);
  const key = await scrypt(normalizeCode(code), salt, 32, SCRYPT);
  return `scrypt$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyAccessCode(code, stored) {
  if (typeof stored !== "string") return false;
  const [kind, saltB64, keyB64] = stored.split("$");
  if (kind !== "scrypt" || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, "base64url");
  const actual = await scrypt(normalizeCode(code), Buffer.from(saltB64, "base64url"), expected.length, SCRYPT);
  return timingSafeEqual(actual, expected);
}

export const normalizeEmail = (e) => String(e || "").trim().toLowerCase();
export const isEmail = (e) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/.test(e);

const SESSION_DAYS = 30;
const MAX_SESSIONS = 10;

export async function createSession(userId) {
  const token = randomBytes(32).toString("base64url");
  await sql(`delete from sessions where user_id = $1 and created_at < now() - interval '${SESSION_DAYS} days'`, [userId]);
  await sql(
    `delete from sessions where user_id = $1 and token_hash not in (
       select token_hash from sessions where user_id = $1 order by created_at desc limit ${MAX_SESSIONS - 1})`,
    [userId],
  );
  await sql("insert into sessions (token_hash, user_id) values ($1, $2)", [sha256(token), userId]);
  return token;
}

export async function endSessions(userId, { keepToken } = {}) {
  if (keepToken) await sql("delete from sessions where user_id = $1 and token_hash <> $2", [userId, sha256(keepToken)]);
  else await sql("delete from sessions where user_id = $1", [userId]);
}

export async function endSession(request) {
  const token = bearer(request);
  if (token) await sql("delete from sessions where token_hash = $1", [sha256(token)]);
}

export const bearer = (request) => {
  const auth = request.headers.get("authorization") || "";
  return auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
};

export async function sessionUser(request) {
  const token = bearer(request);
  if (!token) return null;
  const [user] = await sql(
    `select u.id, u.email from sessions s join users u on u.id = s.user_id
      where s.token_hash = $1 and s.created_at > now() - interval '${SESSION_DAYS} days'`,
    [sha256(token)],
  );
  return user || null;
}

export async function requireMember(request) {
  const token = bearer(request);
  if (!token) throw new HttpError(401, "Inicia sesión para continuar.");
  const rows = await sql(
    `select u.id, u.email, u.name, u.answers, p.plan_id, p.expires_at
       from sessions s
       join users u on u.id = s.user_id
       left join lateral (
         select plan_id, expires_at from purchases
          where user_id = u.id and status = 'COMPLETED'
          order by expires_at desc limit 1
       ) p on true
      where s.token_hash = $1 and s.created_at > now() - interval '${SESSION_DAYS} days'`,
    [sha256(token)],
  );
  const member = rows[0];
  if (!member) throw new HttpError(401, "Tu sesión ha caducado. Vuelve a entrar.");
  if (!member.expires_at || new Date(member.expires_at) < new Date()) {
    throw new HttpError(402, "Tu plan ha terminado. Renuévalo para seguir entrando.");
  }
  return member;
}
