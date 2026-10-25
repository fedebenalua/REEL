// La aguja está cruzada y, en el primer segundo, se clava a lo largo del lomo.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = 0;

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, 0.04, 0.85));
  const ang = (1 - u) * 1.05;
  escena(g, t, {
    Z: k.mez(10.2, 7.6, u), cx: k.mez(CX - 36, CX + 4, u), cy: -46,
    hora: 0.16,
    rosa: { x: CX, ang, fuerza: 0.55 + 0.45 * u, radio: 132 },
    perro: { x: CX, agacha: 1, cola: 0.95 },
    ejes: [{ x: CX + 4, y: -44, ang, largo: 78, fuerza: 0.35 + 0.65 * u, ns: u > 0.78, plano: 0.9 }],
    velo: 0.55,
  });
}
