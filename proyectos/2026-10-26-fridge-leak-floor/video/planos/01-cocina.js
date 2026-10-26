// El charco, desde el primer fotograma, y la puerta por donde sale.
import { v } from "#voz";
import { HOOK, camara, charco, chorroPuerta, cocinaFondo, nevera, quieto, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = 0;
const fin = v.t("defrost") - 0.04;
const f1 = v.frase(1), f2 = v.frase(2);

export function dibuja(g, t) {
  const tq = quieto(t, fin);
  const cam = rutaCam(tq, [
    [0, HOOK],
    [f1.t("leaking"), { x: -90, y: 360, s: 2.35 }],
    [f1.t("floor"), { x: 10, y: 60, s: 1.02 }],
    [f2.t("twice"), { x: -40, y: 180, s: 1.2 }],
    [f2.t("door"), { x: -150, y: 400, s: 1.85 }],
    [fin - 0.22, { x: -140, y: 390, s: 1.8 }],
  ]);
  camara(g, cam);
  cocinaFondo(g);
  nevera(g, 1);
  chorroPuerta(g, tq, 1);
  charco(g, 260, tq, 0.15);
  velo(g, 0.9);
  viñeta(g, 0.34);
}
