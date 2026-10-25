// «una de cada cinco horas de sol»: la losa del medio se enciende.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(8).t("una") - 0.04;

export function dibuja(g, t) {
  const a = v.frase(8).t("cinco");
  const u = k.suave(k.tramo(t, a - 0.12, a + 0.45));
  escena(g, t, {
    Z: 6.4, cx: CX, cy: -96,
    hora: 0.08,
    soles: u,
    perro: { x: CX, agacha: 1, cola: 0.9 },
    ejes: [{ x: CX + 4, y: -44, ang: 0, largo: 70, fuerza: 0.75 * u, ns: u > 0.7 }],
    velo: 0.45,
  });
}
