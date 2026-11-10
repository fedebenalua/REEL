import { sql } from "../lib/db.js";
import { timingSafeEqual } from "node:crypto";
import { createSession, handle, hashAccessCode, HttpError, isEmail, json, newAccessCode, normalizeEmail, readJson, sessionUser, sha256 } from "../lib/http.js";
import { CURRENCY, findPlan } from "../lib/plans.js";
import { createPayment } from "../lib/square.js";
import { cleanAnswers } from "../lib/answers.js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const SECRET = /^[A-Za-z0-9_-]{43}$/;
const EMAIL_TAKEN = "Ya existe una cuenta Brío con este email. Entra en tu zona con tu código para ampliar tu plan.";

export const POST = handle(async (request) => {
  const body = await readJson(request);
  const plan = findPlan(body.planId);
  if (!plan) throw new HttpError(400, "Elige un plan.");
  const checkoutId = String(body.checkoutId || "").toLowerCase();
  if (!UUID.test(checkoutId)) throw new HttpError(400, "Vuelve a abrir la pantalla de pago.");
  const sourceId = String(body.sourceId || "");
  if (!sourceId || sourceId.length > 500) throw new HttpError(400, "Faltan los datos de la tarjeta.");
  // checkoutId doubles as the Square idempotency key, so it is not secret; the
  // checkoutSecret never leaves this server and the buyer's browser.
  const secret = String(body.checkoutSecret || "");
  if (!SECRET.test(secret)) throw new HttpError(400, "Vuelve a abrir la pantalla de pago.");

  await sql("delete from checkouts where status = 'failed' and created_at < now() - interval '1 day'");
  const [{ pending }] = await sql("select count(*)::int as pending from checkouts where status = 'pending' and created_at > now() - interval '2 minutes'");
  if (pending >= 50) throw new HttpError(429, "Hay muchos pagos en curso. Inténtalo de nuevo en un minuto.");

  const [fresh] = await sql(
    "insert into checkouts (id, plan_id, amount_cents, currency, secret_hash) values ($1, $2, $3, $4, $5) on conflict (id) do nothing returning id",
    [checkoutId, plan.id, plan.priceCents, CURRENCY, sha256(secret)],
  );
  if (!fresh) return replay(request, checkoutId, plan, body, secret);

  // The buyer is either the signed-in member (renewal) or a new, unclaimed email.
  const member = await sessionUser(request);
  let userId, createdAccount = false, email;
  if (member) {
    userId = member.id;
    email = member.email;
  } else {
    email = normalizeEmail(body.email);
    if (!isEmail(email)) return fail(checkoutId, 400, "Escribe un email válido.");
    const [{ fails }] = await sql(
      "select count(*)::int as fails from checkouts where email = $1 and status = 'failed' and created_at > now() - interval '1 hour'",
      [email],
    );
    if (fails >= 5) return fail(checkoutId, 429, "Demasiados intentos de pago con este email. Espera una hora y vuelve a probar.");
    await sql("update checkouts set email = $2 where id = $1", [checkoutId, email]);
    await sql("insert into users (email) values ($1) on conflict (email) do nothing", [email]);
    const [reserved] = await sql(
      `update users set reserved_by = $2, reserved_at = now()
        where email = $1 and access_code_hash is null
          and (reserved_by is null or reserved_at < now() - interval '15 minutes')
        returning id`,
      [email, checkoutId],
    );
    if (!reserved) return fail(checkoutId, 409, EMAIL_TAKEN);
    userId = reserved.id;
    createdAccount = true;
  }
  await sql("update checkouts set user_id = $2, created_account = $3 where id = $1", [checkoutId, userId, createdAccount]);
  return charge(request, checkoutId, plan, { userId, createdAccount, email, body });
});

async function charge(request, checkoutId, plan, { userId, createdAccount, email, body }) {
  const payment = await createPayment(request, {
    idempotencyKey: checkoutId,
    sourceId: String(body.sourceId),
    verificationToken: typeof body.verificationToken === "string" ? body.verificationToken.slice(0, 2000) : undefined,
    amountCents: plan.priceCents,
    currency: CURRENCY,
    email,
    note: `Brío · ${plan.name}`,
    referenceId: plan.id,
  });
  if (!payment.ok) {
    if (createdAccount) await releaseReservation(userId, checkoutId);
    return fail(checkoutId, 402, payment.message, payment.code);
  }

  const [done] = await sql(
    "update checkouts set status = 'completed', square_payment_id = $2 where id = $1 and status = 'pending' returning id",
    [checkoutId, payment.id],
  );
  if (!done) return replay(request, checkoutId, plan, body, String(body.checkoutSecret));

  const [current] = await sql(
    "select max(expires_at) as until from purchases where user_id = $1 and status = 'COMPLETED' and expires_at > now()",
    [userId],
  );
  const start = current?.until ? new Date(current.until) : new Date();
  const expires = new Date(start.getTime() + plan.days * 864e5);
  await sql(
    `insert into purchases (user_id, plan_id, amount_cents, currency, square_payment_id, status, environment, receipt_url, expires_at)
     values ($1, $2, $3, $4, $5, 'COMPLETED', $6, $7, $8) on conflict (square_payment_id) do nothing`,
    [userId, plan.id, plan.priceCents, CURRENCY, payment.id, payment.environment, payment.receiptUrl, expires.toISOString()],
  );

  let accessCode = null;
  if (createdAccount) {
    accessCode = newAccessCode();
    const [claimed] = await sql(
      `update users set access_code_hash = $3, name = $4, answers = $5, reserved_by = null, reserved_at = null
        where id = $1 and reserved_by = $2 and access_code_hash is null returning id`,
      [userId, checkoutId, await hashAccessCode(accessCode), String(body.name || "").trim().slice(0, 60), JSON.stringify(cleanAnswers(body.answers))],
    );
    if (!claimed) {
      console.error("pay: paid checkout lost its email reservation", checkoutId);
      throw new HttpError(500, "Pago recibido, pero no hemos podido crear tu acceso. Escríbenos y lo resolvemos.");
    }
  }
  return json({
    token: await createSession(userId),
    accessCode,
    renewed: !createdAccount,
    plan: plan.name,
    expiresAt: expires.toISOString(),
    receiptUrl: payment.receiptUrl,
  });
}

const sameSecret = (secret, hash) => {
  if (typeof hash !== "string" || !SECRET.test(secret)) return false;
  const a = Buffer.from(sha256(secret), "hex"), b = Buffer.from(hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
};

// Same checkout again: never charge twice. Only the browser holding the checkoutSecret
// gets anything back, and only one replay of a completed checkout can open a session.
async function replay(request, checkoutId, plan, body, secret) {
  const [found] = await sql("select secret_hash, plan_id from checkouts where id = $1", [checkoutId]);
  if (!found || !sameSecret(secret, found.secret_hash) || found.plan_id !== plan.id) {
    throw new HttpError(409, "Vuelve a abrir la pantalla de pago.");
  }
  const [c] = await sql(
    `update checkouts set attempt_at = case when status = 'pending' and attempt_at < now() - interval '60 seconds' then now() else attempt_at end
      where id = $1 returning *, (attempt_at = now()) as reclaimed`,
    [checkoutId],
  );
  if (c.status === "failed") return json({ error: c.error_message || "El pago no se completó.", retryWithNewCheckout: true }, 402);
  if (c.status === "pending") {
    if (!c.reclaimed || !c.user_id) throw new HttpError(409, "Tu pago se está procesando. Espera unos segundos y vuelve a intentarlo.");
    // An earlier attempt stopped mid-charge: Square returns that same payment for the same idempotency key.
    const [u] = await sql("select email from users where id = $1", [c.user_id]);
    return charge(request, checkoutId, plan, { userId: c.user_id, createdAccount: c.created_account, email: u?.email, body });
  }
  const [claim] = await sql(
    `update checkouts set session_issued = true
      where id = $1 and status = 'completed' and not session_issued and created_at > now() - interval '15 minutes'
      returning id`,
    [checkoutId],
  );
  if (!claim) return json({ alreadyPaid: true, error: "Este pago ya está completado. Entra en tu zona Brío con tu email y tu código." }, 409);
  const [purchase] = await sql("select expires_at from purchases where square_payment_id = $1", [c.square_payment_id]);
  return json({
    token: await createSession(c.user_id),
    accessCode: null,
    codeAvailableInZone: c.created_account,
    renewed: !c.created_account,
    plan: plan.name,
    expiresAt: purchase?.expires_at,
    receiptUrl: null,
  });
}

async function releaseReservation(userId, checkoutId) {
  await sql("update users set reserved_by = null, reserved_at = null where id = $1 and reserved_by = $2", [userId, checkoutId]);
  await sql(
    `delete from users u where u.id = $1 and u.access_code_hash is null and u.reserved_by is null
       and not exists (select 1 from purchases p where p.user_id = u.id)
       and not exists (select 1 from sessions s where s.user_id = u.id)`,
    [userId],
  );
}

async function fail(checkoutId, status, message, code) {
  await sql("update checkouts set status = 'failed', error_message = $2 where id = $1", [checkoutId, message]);
  return json({ error: message, code, retryWithNewCheckout: true }, status);
}
