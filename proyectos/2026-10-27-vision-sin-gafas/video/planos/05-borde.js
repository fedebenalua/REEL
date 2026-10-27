// Más pequeño: la luz se dobla en el borde y se oscurece. Frase 9.
import * as k from "#kit";
import { v } from "#voz";
import { borde } from "../mundo.js";

const f9 = v.frase(9);
export const desde = "pequeño";

export function dibuja(g, t) {
  const hr = k.claves([
    [f9.inicio, 210],
    [f9.t("borde"), 92],
    [f9.t("oscurece"), 70],
    [f9.fin, 70],
  ]);
  const anillos = k.claves([
    [f9.t("luz"), 0.05],
    [f9.t("dobla"), 0.55],
    [f9.t("borde"), 1],
    [f9.fin, 1],
  ]);
  const oscuro = k.suave(k.tramo(t, f9.t("todo"), f9.fin - 0.12));
  borde(g, { hr: hr(t), anillos: anillos(t), oscuro });
}
