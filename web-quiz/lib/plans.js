// Must match the currency of the Square location that takes the payment.
export const CURRENCY = (process.env.SQUARE_CURRENCY?.trim().toUpperCase() || "USD").slice(0, 3);

export const PLANS = [
  { id: "semana", name: "Plan de 7 días", days: 7, priceCents: 978, note: "ideal para probar" },
  { id: "mes", name: "Plan de 1 mes", days: 30, priceCents: 1949, popular: true, note: "30 días" },
  { id: "trimestre", name: "Plan de 3 meses", days: 90, priceCents: 3693, note: "90 días" },
];

export const findPlan = (id) => PLANS.find((p) => p.id === id);
