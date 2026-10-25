// «Y el campo solo está tan quieto»: se abre el suelo y entran las losas.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(8).inicio - 0.04;

export function dibuja(g, t) {
  const a = v.frase(8).inicio;
  const u = k.suave(k.tramo(t, a, a + 0.8));
  escena(g, t, {
    Z: k.mez(7.2, 6.2, u), cx: CX, cy: -92,
    hora: 0.12,
    rosa: { x: CX, ang: 0, fuerza: 0.2, radio: 110 },
    soles: 0.15,
    perro: { x: CX, agacha: 1, cola: 0.6 },
    velo: 0.46,
  });
}
