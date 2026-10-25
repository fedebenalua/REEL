// «solo si el norte no tiembla»: la flecha tiembla y el eje se sale.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(9).t("solo") - 0.04;

export function dibuja(g, t) {
  const a = v.frase(9).t("solo"), b = v.frase(10).inicio;
  const u = k.suave(k.tramo(t, a + 0.2, a + 1.15));
  escena(g, t, {
    Z: 5.4, cx: CX + 10, cy: -76,
    hora: 0.32,
    mapa: { x: CX - 95, abre: 1, tiembla: u, tam: 0.5 },
    perro: { x: CX + 55, agacha: 1, cola: 0.35 },
    ejes: [{ x: CX + 55, y: -44, ang: 0.34 * u, largo: 72, fuerza: 0.85 * (1 - 0.45 * u), ns: u < 0.35, plano: 0.85 }],
    velo: 0.5,
  });
  void b;
}
