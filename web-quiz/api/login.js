import { sql } from "../lib/db.js";
import { createSession, handle, HttpError, isEmail, json, normalizeCode, normalizeEmail, readJson, sha256 } from "../lib/http.js";

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
  if (fails >= 8) throw new HttpError(429, "Demasiados intentos. Espera 15 minutos y vuelve a probar.");

  const [user] = await sql("select id, access_code_hash from users where email = $1", [email]);
  const ok = Boolean(user && user.access_code_hash === sha256(code));
  await sql("insert into login_attempts (email, ok) values ($1, $2)", [email, ok]);
  if (!ok) throw new HttpError(401, "El email o el código no coinciden.");

  const [active] = await sql(
    "select 1 from purchases where user_id = $1 and status = 'COMPLETED' and expires_at > now() limit 1",
    [user.id],
  );
  if (!active) throw new HttpError(402, "Tu plan ha terminado. Renuévalo para seguir entrando.");
  return json({ token: await createSession(user.id) });
});
