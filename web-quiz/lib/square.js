const env = () => {
  const v = process.env.SQUARE_ENVIRONMENT?.trim().toLowerCase();
  return v === "production" || v === "sandbox" ? v : null;
};

const LOOPBACK = new Set(["127.0.0.1", "localhost", "[::1]"]);

// Demo payments only exist inside scripts/dev-server.mjs: it sets the in-process flag,
// refuses to start with a database or Square token, and only listens on loopback.
function demoAllowed(request) {
  if (globalThis.__BRIO_LOCAL_DEV_SERVER__ !== true) return false;
  if (process.env.DATABASE_URL?.trim() || process.env.SQUARE_ACCESS_TOKEN?.trim()) return false;
  try {
    return LOOPBACK.has(new URL(request.url).hostname);
  } catch {
    return false;
  }
}

export function squareConfig(request) {
  const environment = env();
  const applicationId = process.env.SQUARE_APPLICATION_ID?.trim() || "";
  const locationId = process.env.SQUARE_LOCATION_ID?.trim() || "";
  const hasToken = Boolean(process.env.SQUARE_ACCESS_TOKEN?.trim());
  const configured = Boolean(environment && applicationId && locationId && hasToken);
  const demo = !configured && demoAllowed(request);
  return { environment, applicationId, locationId, configured, demo };
}

const ERROR_TEXT = {
  CARD_DECLINED: "Tu banco ha rechazado la tarjeta. Prueba con otra o contacta con tu banco.",
  GENERIC_DECLINE: "Tu banco ha rechazado la tarjeta. Prueba con otra o contacta con tu banco.",
  INSUFFICIENT_FUNDS: "La tarjeta no tiene fondos suficientes.",
  CVV_FAILURE: "El código de seguridad (CVV) no es correcto.",
  ADDRESS_VERIFICATION_FAILURE: "El código postal no coincide con el de la tarjeta.",
  INVALID_EXPIRATION: "La fecha de caducidad no es válida.",
  EXPIRATION_FAILURE: "La fecha de caducidad no es válida.",
  INVALID_CARD: "Los datos de la tarjeta no son válidos.",
  CARD_EXPIRED: "La tarjeta ha caducado.",
  VERIFY_CVV_FAILURE: "El código de seguridad (CVV) no es correcto.",
  VERIFY_AVS_FAILURE: "El código postal no coincide con el de la tarjeta.",
  TRANSACTION_LIMIT: "La tarjeta ha superado su límite de operaciones.",
};

export async function createPayment(request, { idempotencyKey, sourceId, verificationToken, amountCents, currency, email, note, referenceId }) {
  const cfg = squareConfig(request);
  if (cfg.demo) {
    if (sourceId === "demo-ok") return { ok: true, id: `demo_${idempotencyKey}`, status: "COMPLETED", receiptUrl: null, environment: "demo" };
    return { ok: false, code: "CARD_DECLINED", message: ERROR_TEXT.CARD_DECLINED };
  }
  if (!cfg.configured) return { ok: false, code: "NOT_CONFIGURED", message: "Los pagos todavía no están activados en esta web." };

  const base = cfg.environment === "production" ? "https://connect.squareup.com" : "https://connect.squareupsandbox.com";
  const body = {
    source_id: sourceId,
    idempotency_key: idempotencyKey,
    amount_money: { amount: amountCents, currency },
    location_id: cfg.locationId,
    autocomplete: true,
    buyer_email_address: email,
    note,
    reference_id: referenceId,
  };
  if (verificationToken) body.verification_token = verificationToken;
  const res = await fetch(`${base}/v2/payments`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN.trim()}`,
      "content-type": "application/json",
      "square-version": "2025-01-23",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  const payment = data.payment;
  if (res.ok && payment && payment.status === "COMPLETED") {
    return { ok: true, id: payment.id, status: payment.status, receiptUrl: payment.receipt_url || null, environment: cfg.environment };
  }
  const code = data.errors?.[0]?.code || payment?.status || `HTTP_${res.status}`;
  return { ok: false, code, message: ERROR_TEXT[code] || "No hemos podido completar el pago. Revisa los datos e inténtalo de nuevo." };
}
