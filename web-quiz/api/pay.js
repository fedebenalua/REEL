import { sql } from "../lib/db.js";
import { createSession, handle, HttpError, isEmail, json, newAccessCode, normalizeCode, normalizeEmail, readJson, sha256 } from "../lib/http.js";
import { CURRENCY, findPlan } from "../lib/plans.js";
import { createPayment } from "../lib/square.js";
import { cleanAnswers } from "../lib/answers.js";

export const POST = handle(async (request) => {
  const body = await readJson(request);
  const plan = findPlan(body.planId);
  if (!plan) throw new HttpError(400, "Elige un plan.");
  const email = normalizeEmail(body.email);
  if (!isEmail(email)) throw new HttpError(400, "Escribe un email válido.");
  const sourceId = String(body.sourceId || "");
  if (!sourceId || sourceId.length > 500) throw new HttpError(400, "Faltan los datos de la tarjeta.");
  const name = String(body.name || "").trim().slice(0, 60);
  const answers = cleanAnswers(body.answers);

  const payment = await createPayment({
    sourceId,
    verificationToken: typeof body.verificationToken === "string" ? body.verificationToken.slice(0, 2000) : undefined,
    amountCents: plan.priceCents,
    currency: CURRENCY,
    email,
    note: `Brío · ${plan.name}`,
    referenceId: plan.id,
  });
  if (!payment.ok) return json({ error: payment.message, code: payment.code }, 402);

  const code = newAccessCode();
  const [user] = await sql(
    `insert into users (email, name, answers, access_code_hash) values ($1, $2, $3, $4)
     on conflict (email) do update set
       name = case when excluded.name <> '' then excluded.name else users.name end,
       answers = case when excluded.answers <> '{}'::jsonb then excluded.answers else users.answers end,
       access_code_hash = excluded.access_code_hash
     returning id`,
    [email, name, JSON.stringify(answers), sha256(normalizeCode(code))],
  );
  const [current] = await sql(
    "select max(expires_at) as until from purchases where user_id = $1 and status = 'COMPLETED' and expires_at > now()",
    [user.id],
  );
  const start = current?.until ? new Date(current.until) : new Date();
  const expires = new Date(start.getTime() + plan.days * 864e5);
  await sql(
    `insert into purchases (user_id, plan_id, amount_cents, currency, square_payment_id, status, environment, receipt_url, expires_at)
     values ($1, $2, $3, $4, $5, 'COMPLETED', $6, $7, $8)`,
    [user.id, plan.id, plan.priceCents, CURRENCY, payment.id, payment.environment, payment.receiptUrl, expires.toISOString()],
  );
  const token = await createSession(user.id);
  return json({ token, accessCode: code, email, plan: plan.name, expiresAt: expires.toISOString(), receiptUrl: payment.receiptUrl });
});
