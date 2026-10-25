// «No todos los estudios lo confirman»: un segundo eje se apaga; el del campo se queda.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(14).inicio - 0.04;

export function dibuja(g, t) {
  const a = v.frase(14).inicio, b = v.frase(14).fin;
  const u = k.suave(k.tramo(t, a + 0.15, b - 0.4));
  escena(g, t, {
    Z: 7.4, cx: CX + 4, cy: -58,
    hora: 0.14,
    rosa: { x: CX, ang: 0, fuerza: 1, radio: 140 },
    perro: { x: CX, agacha: 1, cola: 0.85 },
    ejes: [
      { x: CX + 4, y: -44, ang: 0.7, largo: 80, fuerza: 0.55 * (1 - u), ns: false, color: "255,140,90", plano: 0.85 },
      { x: CX + 4, y: -44, ang: 0, largo: 86, fuerza: 1, ns: true, plano: 0.9 },
    ],
    velo: 0.5,
  });
}
