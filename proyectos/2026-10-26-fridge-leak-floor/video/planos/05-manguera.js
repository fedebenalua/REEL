// La fuga de detrás es el latiguillo: se cierra la llave.
import * as k from "#kit";
import { v } from "#voz";
import { camara, detras, quieto, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = "leak";
const fin = v.t("stir") - 0.04;
const f8 = v.frase(8);

export function dibuja(g, t) {
  const tq = quieto(t, fin);
  const cerrado = k.suave(k.tramo(tq, f8.t("shut"), f8.t("valve") + 0.2));
  const cam = rutaCam(tq, [
    [f8.t("leak"), { x: 120, y: 80, s: 1.25 }],
    [f8.t("hose"), { x: 140, y: 140, s: 1.55 }],
    [f8.t("shut"), { x: -420, y: 10, s: 1.45 }],
    [fin - 0.22, { x: -440, y: 20, s: 1.4 }],
  ]);
  camara(g, cam);
  detras(g, tq, cerrado);
  velo(g, 0.86);
  viñeta(g, 0.32);
}
