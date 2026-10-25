// «Cincuenta y dos perros»: sale el 52 y se acerca al tronco.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(11).inicio - 0.04;

export function dibuja(g, t) {
  const a = v.frase(11).t("cincuenta"), b = v.frase(11).t("pis");
  const u = k.suave(k.tramo(t, a, b - 0.25));
  escena(g, t, {
    Z: k.mez(5.2, 6.2, u), cx: k.mez(CX + 30, CX + 8, u), cy: -78,
    hora: 0.5,
    explanada: CX,
    tronco: CX + 62,
    valla: { x: CX, ang: 0, fuerza: 0.25 },
    perro: { x: k.mez(CX - 30, CX + 8, u), agacha: 0, marcha: 0.35 * (1 - u), fase: t * 1.4, cola: 0.45, dir: 1 },
    chip: { t0: a, x: 250, y: 680, texto: "52", tam: 120, color: "255,214,120", hasta: b },
    velo: 0.46,
  });
}
