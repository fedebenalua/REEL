// «A wad of paper is stuck in the bend under the bowl.»
import * as k from "#kit";
import { v } from "#voz";
import { rutaCam, camara, fondo, trampa, velo, viñeta } from "../mundo.js";

const f3 = v.frase(3);
const Tpaper = f3.t("paper");
const Tbend = f3.t("bend");
const fin = v.frase(4).inicio;

export const desde = (voz) => voz.frase(3).inicio - 0.04;
export const entrada = "corte";

const CAMS = [
  [f3.inicio - 0.04, { x: -40, y: 40, s: 1.05 }],
  [Tpaper, { x: -10, y: 90, s: 1.25 }],
  [Tbend, { x: 30, y: 150, s: 1.55 }],
  [Tbend + 0.55, { x: 20, y: 140, s: 1.48 }],
  [fin, { x: 20, y: 140, s: 1.48 }],
];

export function dibuja(g, t) {
  const cam = rutaCam(t, CAMS);
  const empuje = 0.35 + 0.65 * k.suave(k.tramo(t, Tpaper, Tbend + 0.15));
  const quieto = k.tramo(t, fin - 0.34, fin - 0.1);
  g.save();
  camara(g, cam);
  fondo(g);
  trampa(g, t, { empuje: empuje * (1 - quieto * 0.4), quieto });
  g.restore();
  viñeta(g, 0.45);
  velo(g, 0.82);
}
