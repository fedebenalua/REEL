// «Once a year. Hard water, every six months. The tank cooks itself.»
import * as k from "#kit";
import { v } from "#voz";
import { hoja, interior } from "../cosas.js";
import { camara, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = (voz) => voz.frase(13).inicio;
export const entrada = "corte";

const f = v.frase(13);
const Ty = f.t("year");
const Tm = f.t("months");
const Tc = f.t("cooks");
const fin = v.frase(14).inicio;
const CAM = [
  [f.inicio, { x: 0, y: -40, s: 1.05 }],
  [Ty, { x: 0, y: 20, s: 1.12 }],
  [Tm, { x: 0, y: 160, s: 1.35 }],
  [Tc, { x: 0, y: 240, s: 1.48 }],
  [fin, { x: 0, y: 250, s: 1.46 }],
];

export function dibuja(g, t) {
  const cae = k.sale(k.tramo(t, Ty - 0.05, Ty + 0.7)) * 1400;
  const costra = k.mez(0.35, 1, k.suave(k.tramo(t, f.t("hard"), Tm)));
  const calor = k.suave(k.tramo(t, Tm + 0.15, Tc + 0.15));
  g.save();
  camara(g, rutaCam(t, CAM));
  interior(g, t, { pop: 0.15 + calor * 0.2, corona: 0, jolt: 0, calor, costra });
  hoja(g, 0, -80, cae);
  g.restore();
  viñeta(g, 0.42);
  velo(g, 0.72);
}
