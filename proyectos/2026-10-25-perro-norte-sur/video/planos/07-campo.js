// «según el campo de ese día»: la brújula de ese paseo, ya quieta, llena el suelo.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(4).t("segun") - 0.04;

export function dibuja(g, t) {
  const a = v.frase(4).t("segun");
  const u = k.suave(k.tramo(t, a, a + 0.7));
  escena(g, t, {
    Z: k.mez(6.4, 5.3, u), cx: CX + 4, cy: k.mez(-70, -58, u),
    hora: 0.18,
    rosa: { x: CX, ang: 0, fuerza: 1, radio: k.mez(140, 168, u) },
    perro: { x: CX, agacha: 1, cola: 0.75 },
    ejes: [{ x: CX + 4, y: -44, ang: 0, largo: 90, fuerza: 0.85, ns: false }],
    velo: 0.46,
  });
}
