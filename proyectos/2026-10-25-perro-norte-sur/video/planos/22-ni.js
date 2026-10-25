// «En la caca, ni la valla ni el norte»: las dos líneas se apagan.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(12).inicio - 0.04;

export function dibuja(g, t) {
  const a = v.frase(12).t("ni"), b = v.frase(13).inicio;
  const u = k.suave(k.tramo(t, a, a + 0.7));
  escena(g, t, {
    Z: 6.5, cx: CX, cy: -68,
    hora: 0.5,
    explanada: CX,
    valla: { x: CX + 20, ang: 0.75, fuerza: 0.7 * (1 - u) },
    rosa: { x: CX, ang: -0.8, fuerza: 0.55 * (1 - u), radio: 130 },
    perro: { x: CX, agacha: 1, cola: 0.4 },
    ejes: [
      { x: CX, y: -44, ang: 0.75, largo: 76, fuerza: 0.4 * (1 - u), ns: false, color: "255,186,80" },
      { x: CX, y: -44, ang: -0.8, largo: 76, fuerza: 0.4 * (1 - u), ns: false, color: "120,186,255" },
    ],
    velo: 0.5,
  });
  void b;
}
