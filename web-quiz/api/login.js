import { sql } from "../lib/db.js";
import { createSession, handle, hashAccessCode, HttpError, isEmail, json, normalizeCode, normalizeEmail, readJson, sha256, verifyAccessCode } from "../lib/http.js";

export const POST = handle(async (request) => {
  const body = await readJson(request, 2000);
  const email = normalizeEmail(body.email);
  const code = normalizeCode(body.code);
  if (!isEmail(email) || code.length < 8) throw new HttpError(400, "Escribe tu email y tu código de acceso.");

  await sql("delete from login_attempts where at < now() - interval '1 day'");
  const [{ fails }] = await sql(
    "select count(*)::int as fails from login_attempts where email = $1 and not ok and at > now() - interval '15 minutes'",
    [email],
  );
  const [{ recent }] = await sql(
    "select count(*)::int as recent from login_attempts where not ok and at > now() - interval '15 minutes'",
  );
  if (recent >= 300) throw new HttpError(429, "Hay demasiados intentos ahora mismo. Vuelve a probar en unos minutos.");
  if (fails >= 8) throw new HttpError(429, "Demasiados intentos. Espera 15 minutos y vuelve a probar.");

  const [user] = await sql("select id, access_code_hash from users where email = $1", [email]);
  const stored = user?.access_code_hash;
  const legacy = typeof stored === "string" && /^[0-9a-f]{64}$/.test(stored);
  const ok = Boolean(user) && (legacy ? stored === sha256(code) : await verifyAccessCode(code, stored));
  if (ok && legacy) await sql("update users set access_code_hash = $2 where id = $1", [user.id, await hashAccessCode(code)]);
  await sql("insert into login_attempts (email, ok) values ($1, $2)", [email, ok]);
  if (!ok) throw new HttpError(401, "El email o el código no coinciden.");

  const [active] = await sql(
    "select 1 from purchases where user_id = $1 and status = 'COMPLETED' and expires_at > now() limit 1",
    [user.id],
  );
  if (!active) throw new HttpError(402, "Tu plan ha terminado. Renuévalo para seguir entrando.");
  return json({ token: await createSession(user.id) });
});
