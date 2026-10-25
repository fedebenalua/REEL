// «Creen que así calibra el mapa»: el mapa se abre bajo el perro, con su norte.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(9).inicio - 0.04;

export function dibuja(g, t) {
  const a = v.frase(9).inicio, b = v.frase(9).t("solo");
  const u = k.suave(k.tramo(t, a, Math.min(b - 0.2, a + 1.1)));
  escena(g, t, {
    Z: k.mez(6.4, 5.2, u), cx: CX + 16, cy: -78,
    hora: 0.2,
    mapa: { x: CX - 95, abre: 0.55 + 0.45 * u, tiembla: 0, tam: 0.5 },
    perro: { x: CX + 55, agacha: 1, cola: 0.85 },
    ejes: [{ x: CX + 55, y: -44, ang: 0, largo: 72, fuerza: 0.85, ns: true }],
    velo: 0.5,
  });
}
