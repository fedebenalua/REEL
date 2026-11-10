import { sql } from "../lib/db.js";
import { handle, json, requireMember } from "../lib/http.js";
import { findPlan } from "../lib/plans.js";

export const GET = handle(async (request) => {
  const m = await requireMember(request);
  const progress = await sql("select item, done_at from progress where user_id = $1 order by done_at", [m.id]);
  const weights = await sql(
    "select to_char(logged_on, 'YYYY-MM-DD') as day, kg::float as kg from weights where user_id = $1 order by logged_on",
    [m.id],
  );
  return json({
    email: m.email,
    name: m.name,
    answers: m.answers,
    plan: findPlan(m.plan_id)?.name || m.plan_id,
    expiresAt: m.expires_at,
    progress,
    weights,
  });
});
