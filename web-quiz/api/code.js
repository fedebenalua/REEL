import { sql } from "../lib/db.js";
import { handle, json, newAccessCode, normalizeCode, requireMember, sha256 } from "../lib/http.js";

export const POST = handle(async (request) => {
  const m = await requireMember(request);
  const code = newAccessCode();
  await sql("update users set access_code_hash = $2 where id = $1", [m.id, sha256(normalizeCode(code))]);
  return json({ accessCode: code });
});
