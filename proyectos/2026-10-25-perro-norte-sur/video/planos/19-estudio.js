// «otro estudio no lo encontró»: el eje intenta clavarse y se apaga.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(10).t("estudio") - 0.04;

export function dibuja(g, t) {
  const a = v.frase(10).t("estudio"), b = v.frase(10).fin;
  const sube = k.suave(k.tramo(t, a, a + 0.35));
  const baja = k.suave(k.tramo(t, a + 0.55, b - 0.25));
  escena(g, t, {
    Z: 6.1, cx: CX, cy: -72,
    hora: 0.55,
    explanada: CX,
    valla: { x: CX, ang: 0.6, fuerza: 0.2 },
    rosa: { x: CX, ang: -0.65, fuerza: 0.4, radio: 130 },
    perro: { x: CX, agacha: 0, cola: 0.3, ang: 0.12 * Math.sin(t * 1.6) },
    ejes: [{ x: CX, y: -44, ang: 0, largo: 80, fuerza: sube * (1 - baja) * 0.7, ns: false, color: "255,190,90" }],
    velo: 0.48,
  });
}
