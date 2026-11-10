import { sql } from "../lib/db.js";
import { handle, HttpError, json, readJson, requireMember } from "../lib/http.js";

const GUIDE_IDS = new Set(["plato", "proteina", "entreno", "pasos", "sueno", "antojos"]);
const TASK = /^(r21:(?:[1-9]|1\d|2[01])|r28:(?:[1-9]|1\d|2[0-8])):[0-2]$/;
const validItem = (item) => TASK.test(item) || (item.startsWith("guide:") && GUIDE_IDS.has(item.slice(6)));

export const POST = handle(async (request) => {
  const m = await requireMember(request);
  const body = await readJson(request, 1000);
  const item = String(body.item || "");
  if (!validItem(item)) throw new HttpError(400, "Tarea no válida.");
  if (body.done) {
    await sql("insert into progress (user_id, item) values ($1, $2) on conflict do nothing", [m.id, item]);
  } else {
    await sql("delete from progress where user_id = $1 and item = $2", [m.id, item]);
  }
  return json({ ok: true });
});
