// «el lomo se quedaba de norte a sur»: el eje se enciende y salen N y S.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(5).t("quedaba") - 0.04;

export function dibuja(g, t) {
  const a = v.frase(5).t("quedaba");
  const u = k.suave(k.tramo(t, a, a + 0.55));
  escena(g, t, {
    Z: k.mez(7.2, 8.6, u), cx: CX + 2, cy: k.mez(-50, -62, u),
    hora: 0.16,
    rosa: { x: CX, ang: 0, fuerza: 1, radio: 140 },
    perro: { x: CX, agacha: 1, cola: 0.95 },
    ejes: [{ x: CX + 4, y: -44, ang: 0, largo: 84, fuerza: 0.4 + 0.6 * u, ns: u > 0.55, plano: 0.9 }],
    velo: 0.5,
  });
}
