// «Casi dos mil veces»: saltan las marcas alrededor de la rosa.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(3).inicio - 0.04;

export function dibuja(g, t) {
  const a = v.frase(3).t("mil");
  const u = k.entra(k.tramo(t, a - 0.05, a + 0.45));
  const ejes = [];
  for (let i = 0; i < 4; i++) {
    const ang = -0.9 + i * 0.55;
    ejes.push({ x: CX, y: -44, ang, largo: 58, fuerza: 0.16 * u, ns: false, color: "255,186,90" });
  }
  escena(g, t, {
    Z: 5.5, cx: CX, cy: -76,
    hora: 0.2,
    rosa: { x: CX, ang: 0.4, fuerza: 0.7, radio: 160 },
    perro: { x: CX, agacha: 1, cola: 0.7 },
    ejes,
    chip: { t0: a - 0.04, x: 300, y: 640, texto: "1.893", tam: 92, hasta: v.frase(3).t("media") },
    velo: 0.5,
  });
}
