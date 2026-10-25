// «Ordenaron los paseos después»: los ejes cruzados se apartan y queda uno.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(4).inicio - 0.04;

export function dibuja(g, t) {
  const a = v.frase(4).inicio, b = v.frase(4).t("segun");
  const u = k.suave(k.tramo(t, a + 0.05, b - 0.28));
  const ejes = [];
  for (let i = 0; i < 5; i++) {
    const base = -1.05 + i * 0.48;
    const seQueda = i === 2;
    ejes.push({
      x: CX, y: -44, largo: 86,
      ang: k.mez(base, seQueda ? 0 : base * 1.35, u),
      fuerza: seQueda ? 0.35 + 0.6 * u : 0.4 * (1 - u),
      ns: false,
      color: seQueda ? "255,210,70" : "255,150,90",
    });
  }
  escena(g, t, {
    Z: 5.8, cx: CX, cy: -72,
    hora: 0.22,
    rosa: { x: CX, ang: k.mez(0.45, 0, u), fuerza: 0.4 + 0.5 * u, radio: 150 },
    perro: { x: CX, agacha: 1, cola: 0.6 },
    ejes,
    velo: 0.48,
  });
}
