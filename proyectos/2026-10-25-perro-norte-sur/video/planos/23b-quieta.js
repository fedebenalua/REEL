// «con la brújula quieta»: más cerca, el eje ya clavado.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(13).t("y") - 0.04;

export function dibuja(g, t) {
  const a = v.frase(13).t("brujula");
  const u = k.suave(k.tramo(t, a - 0.15, a + 0.35));
  escena(g, t, {
    Z: k.mez(6.6, 8.2, u), cx: CX + 2, cy: k.mez(-62, -54, u),
    hora: 0.14,
    rosa: { x: CX, ang: 0, fuerza: 1, radio: 136 },
    perro: { x: CX, agacha: 1, cola: 0.95 },
    ejes: [{ x: CX + 4, y: -44, ang: 0, largo: 84, fuerza: 1, ns: true, plano: 0.9 }],
    velo: 0.5,
  });
}
