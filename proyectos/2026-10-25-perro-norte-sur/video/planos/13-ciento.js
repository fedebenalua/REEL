// «más de un dos por ciento... desaparecía»: sale el 2 % y el eje se apaga.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(7).t("dos") - 0.04;

export function dibuja(g, t) {
  const a = v.frase(7).t("dos"), fin = v.frase(7).fin;
  const u = k.suave(k.tramo(t, a + 0.15, fin - 0.35));
  escena(g, t, {
    Z: 6.3, cx: CX, cy: -68,
    hora: 0.35,
    rosa: { x: CX, ang: 0.48 + 0.25 * u, fuerza: 1 - 0.75 * u, radio: 150 },
    perro: { x: CX, agacha: 1, cola: 0.4 },
    ejes: [{ x: CX + 4, y: -44, ang: 0.48, largo: 88, fuerza: 0.85 * (1 - u), ns: false, plano: 0.9, color: "255,160,70" }],
    chip: { t0: a - 0.02, x: 300, y: 680, texto: "2", unidad: "%", tam: 118, color: "255,160,70", hasta: v.frase(8).inicio },
    velo: 0.5,
  });
}
