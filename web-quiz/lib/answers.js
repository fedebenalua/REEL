const CHOICES = {
  gender: ["mujer", "hombre"],
  age: ["18-29", "30-39", "40-49", "50+"],
  goal: ["perder", "tonificar", "energia", "habitos"],
  body: ["delgado", "medio", "relleno", "grande"],
  ideal: ["ahora", "1", "3", "mas", "nunca"],
  activity: ["1", "2", "3", "4"],
  water: ["1", "2", "3", "4"],
  sleep: ["5", "6", "7", "9"],
  event: ["vacaciones", "boda", "cumple", "deporte", "no"],
};
const MULTI = {
  zones: ["abdomen", "brazos", "piernas", "gluteos", "todo"],
  habits: ["noche", "dulce", "refrescos", "desayuno", "estres", "ninguno"],
};
const NUMBERS = { heightCm: [120, 240], weightKg: [30, 300], targetKg: [30, 300] };

export function cleanAnswers(input) {
  const a = input && typeof input === "object" ? input : {};
  const out = {};
  for (const [k, allowed] of Object.entries(CHOICES)) if (allowed.includes(a[k])) out[k] = a[k];
  for (const [k, allowed] of Object.entries(MULTI)) if (Array.isArray(a[k])) out[k] = a[k].filter((v) => allowed.includes(v));
  for (const [k, [lo, hi]] of Object.entries(NUMBERS)) {
    const n = Number(a[k]);
    if (Number.isFinite(n) && n >= lo && n <= hi) out[k] = Math.round(n * 10) / 10;
  }
  return out;
}
