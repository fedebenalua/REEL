import { sql } from "../lib/db.js";
import { bearer, endSessions, handle, hashAccessCode, json, newAccessCode, requireMember } from "../lib/http.js";

export const POST = handle(async (request) => {
  const m = await requireMember(request);
  const code = newAccessCode();
  await sql("update users set access_code_hash = $2 where id = $1", [m.id, await hashAccessCode(code)]);
  await endSessions(m.id, { keepToken: bearer(request) });
  return json({ accessCode: code });
});
