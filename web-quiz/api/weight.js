import { sql } from "../lib/db.js";
import { handle, HttpError, json, readJson, requireMember } from "../lib/http.js";

export const POST = handle(async (request) => {
  const m = await requireMember(request);
  const body = await readJson(request, 1000);
  const kg = Math.round(Number(body.kg) * 10) / 10;
  if (!(kg >= 30 && kg <= 300)) throw new HttpError(400, "Escribe un peso entre 30 y 300 kg.");
  await sql(
    `insert into weights (user_id, logged_on, kg) values ($1, current_date, $2)
     on conflict (user_id, logged_on) do update set kg = excluded.kg`,
    [m.id, kg],
  );
  return json({ ok: true });
});
