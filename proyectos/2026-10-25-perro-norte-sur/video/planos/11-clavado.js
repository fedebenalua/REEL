// «con el eje casi clavado»: el abanico se cierra sobre el norte-sur y se queda.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(6).t("eje") - 0.04;

export function dibuja(g, t) {
  const a = v.frase(6).t("eje"), b = v.frase(7).inicio;
  const u = k.suave(k.tramo(t, a, a + 0.7));
  const abierto = k.mez(0.42, 0.14, u);
  escena(g, t, {
    Z: 6.4, cx: CX, cy: -66,
    hora: 0.18,
    rosa: { x: CX, ang: 0, fuerza: 1, radio: 156 },
    perro: { x: CX, agacha: 1, cola: 0.9 },
    ejes: [
      { x: CX + 4, y: -44, ang: -abierto, largo: 92, fuerza: 0.35, ns: false, color: "120,186,255", plano: 0.9 },
      { x: CX + 4, y: -44, ang: abierto, largo: 92, fuerza: 0.35, ns: false, color: "255,140,80", plano: 0.9 },
      { x: CX + 4, y: -44, ang: 0, largo: 96, fuerza: 1, ns: true, plano: 0.9 },
    ],
    velo: 0.48,
  });
  void b;
}
