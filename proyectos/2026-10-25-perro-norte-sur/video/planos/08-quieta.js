// «Con la brújula quieta»: el temblor se apaga y reposa.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(5).inicio - 0.04;

export function dibuja(g, t) {
  const a = v.frase(5).inicio, b = v.frase(5).t("quedaba");
  const u = k.suave(k.tramo(t, a, a + 1.05));
  const ang = Math.sin((t - a) * 8) * 0.22 * (1 - u);
  escena(g, t, {
    Z: 6.2, cx: CX + 20, cy: -64,
    hora: 0.16,
    rosa: { x: CX, ang, fuerza: 0.7 + 0.3 * u, radio: 150 },
    perro: { x: CX, agacha: 1, cola: 0.7 },
    ejes: [{ x: CX + 4, y: -44, ang, largo: 88, fuerza: 0.55 + 0.35 * u, ns: false, plano: 0.9 }],
    velo: 0.48,
  });
  void b;
}
