// «Así que parece, en campo abierto y con la brújula quieta.» Vuelve el campo.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(13).inicio - 0.04;

export function dibuja(g, t) {
  const a = v.frase(13).t("brujula");
  const u = k.suave(k.tramo(t, v.frase(13).inicio, a));
  escena(g, t, {
    Z: k.mez(5.2, 6.8, u), cx: CX, cy: k.mez(-84, -60, u),
    hora: 0.14,
    rosa: { x: CX, ang: 0, fuerza: 0.4 + 0.6 * u, radio: 150 },
    perro: { x: CX, agacha: 1, cola: 0.9 },
    ejes: [{ x: CX + 4, y: -44, ang: 0, largo: 90, fuerza: u, ns: u > 0.65, plano: 0.9 }],
    velo: 0.48,
  });
}
