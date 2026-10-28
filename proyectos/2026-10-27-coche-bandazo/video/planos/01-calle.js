// El hook: el parabrisas helado llena la pantalla y la cámara sale al coche. Luego el termómetro
// quieto y el coche que pasa de hielo a brasa.
import * as k from "#kit";
import { v } from "#voz";
import { calle, faroles, puntoTermometro, velo } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

const f1 = v.frase(1);
const f2 = v.frase(2);
const CERCA = { pos: [0.0, 1.0, -0.98], mira: [0.0, 1.02, -0.42] };
const HERO = { pos: [-1.45, 0.92, -2.85], mira: [0.15, 0.78, 0.15] };
const BASE = { pos: [-1.345, 0.941, -2.797], mira: [0.15, 0.78, 0.15] };
const TERMO = { pos: [-0.85, 0.95, -2.7], mira: [0.7, 0.85, 0.0] };
const VUELTA = { pos: [-1.45, 0.92, -2.85], mira: [0.15, 0.78, 0.15] };

function cam(t) {
  const sale = k.entra(k.tramo(t, 0, 1.55));
  if (t < 3.85) {
    const orbita = k.suave(k.tramo(t, 1.3, 3.85));
    const pos = k.mezV(k.mezV(CERCA.pos, HERO.pos, sale), BASE.pos, orbita);
    const mira = k.mezV(CERCA.mira, HERO.mira, sale);
    return k.mira(pos, mira);
  }
  const aTermo = k.suave(k.tramo(t, f2.t("aire") - 0.05, f2.t("mueve")));
  const aCoche = k.suave(k.tramo(t, f2.t("coche"), f2.t("extremos") - 0.15));
  const u = aTermo * (1 - aCoche);
  const pos = k.mezV(BASE.pos, TERMO.pos, u);
  const mira = k.mezV(BASE.mira, TERMO.mira, u);
  const asienta = k.suave(k.tramo(t, f2.t("extremos") - 0.05, f2.finDe("extremos") + 0.15));
  return k.mira(k.mezV(pos, VUELTA.pos, asienta * (1 - u)), k.mezV(mira, VUELTA.mira, asienta * (1 - u)));
}

function estado(t) {
  const a = f2.t("va"), b = f2.t("extremos"), c = f2.finDe("extremos") + 0.15, d = f2.fin - 0.28;
  if (t < a) return { calor: 0, escarcha: 1 };
  if (t < b) {
    const u = k.suave(k.tramo(t, a, b));
    return { calor: u, escarcha: 1 - u };
  }
  if (t < c) return { calor: 1, escarcha: 0 };
  const u = k.suave(k.tramo(t, c, d));
  return { calor: 1 - u, escarcha: u };
}

export function dibuja(g, t) {
  const c = cam(t);
  const e = estado(t);
  calle(g, c, { ...e, dia: 0, conTermometro: true });
  faroles(g, c);
  const p = puntoTermometro(c);
  const num = k.suave(k.tramo(t, f2.t("aire"), f2.t("aire") + 0.35));
  if (p && num > 0.05) k.pastilla(g, Math.max(240, Math.min(780, p.x)), Math.max(700, Math.min(1180, p.y - 30)), "+2", "°C", "255,90,90", num, 78);
  velo(g, 0.45 + 0.35 * (1 - k.tramo(t, 0, 1.1)) * e.escarcha);
}
