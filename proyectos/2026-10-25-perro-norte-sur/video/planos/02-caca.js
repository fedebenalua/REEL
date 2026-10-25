// «para hacer caca»: el plano corto del cuerpo ya alineado, quieto.
import * as k from "#kit";
import { v } from "#voz";
import { CX, escena } from "../mundo.js";

export const desde = (v) => v.frase(1).t("sur") - 0.04;

export function dibuja(g, t) {
  const a = v.frase(1).t("sur"), b = v.frase(2).inicio;
  const u = k.suave(k.tramo(t, a, a + 0.7));
  escena(g, t, {
    Z: k.mez(7.6, 8.4, u), cx: CX + 8, cy: k.mez(-46, -58, u),
    hora: 0.16,
    rosa: { x: CX, ang: 0, fuerza: 1, radio: 132 },
    perro: { x: CX, agacha: 1, cola: 0.95 },
    ejes: [{ x: CX + 4, y: -44, ang: 0, largo: 78, fuerza: 1, ns: true, plano: 0.9 }],
    velo: 0.5,
  });
  void b;
}
