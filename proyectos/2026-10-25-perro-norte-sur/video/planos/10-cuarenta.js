// «Cuarenta y tres perros»: sale el 43.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(6).inicio - 0.04;

export function dibuja(g, t) {
  const a = v.frase(6).t("cuarenta");
  const u = k.suave(k.tramo(t, a, a + 0.55));
  escena(g, t, {
    Z: k.mez(8.2, 5.6, u), cx: CX - 10, cy: -70,
    hora: 0.2,
    rosa: { x: CX, ang: 0, fuerza: 0.9, radio: 150 },
    perro: { x: CX, agacha: 1, cola: 0.85 },
    ejes: [{ x: CX + 4, y: -44, ang: 0, largo: 88, fuerza: 1, ns: true }],
    chip: { t0: a, x: 250, y: 680, texto: "43", tam: 130, color: "255,210,90", hasta: v.frase(6).t("eje") },
    velo: 0.5,
  });
}
