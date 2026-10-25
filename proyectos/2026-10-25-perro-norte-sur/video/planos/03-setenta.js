// «Setenta perros... dos años.» Sale el 70. La cámara se abre al parque.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(2).t("setenta") - 0.04;

export function dibuja(g, t) {
  const a = v.frase(2).t("setenta");
  const u = k.suave(k.tramo(t, a, a + 0.8));
  escena(g, t, {
    Z: k.mez(8.2, 5.4, u), cx: CX + 10, cy: k.mez(-52, -78, u),
    hora: 0.2,
    rosa: { x: CX, ang: 0, fuerza: 0.85, radio: 150 },
    perro: { x: CX, agacha: 1, cola: 0.8 },
    ejes: [{ x: CX + 4, y: -44, ang: 0, largo: 86, fuerza: 0.7, ns: true }],
    chip: { t0: a - 0.02, x: 780, y: 1180, texto: "70", tam: 120, hasta: v.frase(3).inicio },
    velo: 0.48,
  });
}
