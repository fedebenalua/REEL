// «en el pis mandaba la valla, no el norte»: la pata ya está alta, el cuerpo sigue la valla.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(11).t("pis") - 0.04;

export function dibuja(g, t) {
  const a = v.frase(11).t("valla");
  const u = k.suave(k.tramo(t, a - 0.1, a + 0.4));
  escena(g, t, {
    Z: k.mez(6.4, 7.1, u), cx: CX + 6, cy: -70,
    hora: 0.48,
    explanada: CX,
    tronco: CX + 58,
    valla: { x: CX - 16, ang: 0, fuerza: 0.5 + 0.5 * u },
    rosa: { x: CX - 24, ang: 1.05, fuerza: 0.85, radio: 118 },
    perro: { x: CX - 6, agacha: 0, pataAlta: 1, cola: 0.75, ang: 0.04 },
    ejes: [
      { x: CX - 6, y: -40, ang: 0, largo: 78, fuerza: 0.55 + 0.4 * u, ns: false, color: "255,210,80" },
      { x: CX + 8, y: -78, ang: 1.15, largo: 52, fuerza: 0.9, ns: true, plano: 0.55, color: "120,200,255" },
    ],
    velo: 0.48,
  });
}
