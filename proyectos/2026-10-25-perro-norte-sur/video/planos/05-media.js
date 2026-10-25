// «La media no señalaba ningún sitio»: los ejes se quedan cruzados, ninguno manda.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(3).t("media") - 0.04;

export function dibuja(g, t) {
  const a = v.frase(3).t("media"), b = v.frase(4).inicio;
  const u = k.suave(k.tramo(t, a, a + 0.9));
  const quieto = k.suave(k.tramo(t, b - 0.45, b - 0.12));
  const ejes = [];
  for (let i = 0; i < 4; i++) {
    const base = -0.95 + i * 0.6;
    const ang = base + (1 - quieto) * Math.sin(t * 1.3 + i) * 0.05;
    ejes.push({ x: CX, y: -44, ang, largo: 64, fuerza: 0.22 + 0.12 * u, ns: false, color: "255,170,90" });
  }
  escena(g, t, {
    Z: k.mez(5.5, 6.1, u), cx: CX - 6, cy: -74,
    hora: 0.22,
    rosa: { x: CX, ang: 0.5, fuerza: 0.45, radio: 150 },
    perro: { x: CX, agacha: 1, cola: 0.45 },
    ejes,
    velo: 0.5,
  });
}
