// «En cinco parques de ciudad»: otro sitio, la valla ya está, la brújula no coincide.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(10).inicio - 0.04;

export function dibuja(g, t) {
  const a = v.frase(10).inicio;
  const u = k.suave(k.tramo(t, a, a + 0.7));
  escena(g, t, {
    Z: k.mez(6.6, 7.2, u), cx: CX, cy: -72,
    hora: 0.55,
    sitio: "ciudad",
    explanada: CX,
    valla: { x: CX + 16, ang: 0.7, fuerza: 0.85 },
    rosa: { x: CX - 16, ang: -0.85, fuerza: 0.7, radio: 120 },
    perro: { x: CX - 8, agacha: 0, marcha: 0, cola: 0.4, ang: -0.04 },
    chip: { t0: v.frase(10).t("cinco") - 0.02, x: 240, y: 660, texto: "5", tam: 110, color: "255,176,90", hasta: v.frase(10).t("estudio") },
    velo: 0.42,
  });
}
