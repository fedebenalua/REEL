// «Toilet clogged, and there's no plunger?» «Don't flush it again...»
// Fotograma 0: el borde ya está soltando una cortina de agua.
import * as k from "#kit";
import { v } from "#voz";
import { rutaCam, camara, fondo, taza, guante, velo, viñeta } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

const f1 = v.frase(1), f2 = v.frase(2);
const Tclog = f1.t("clogged");
const Tplug = f1.t("plunger");
const Tflush = f2.t("flush");
const Tagain = f2.t("again");
const Twater = f2.t("water");
const Trim = f2.t("rim");
const fin = v.frase(3).inicio;

const CAMS = [
  [0, { x: 60, y: 170, s: 2.85 }],
  [Tclog, { x: 60, y: 90, s: 1.85 }],
  [Tplug, { x: 50, y: 30, s: 1.08 }],
  [Tflush, { x: -30, y: -40, s: 1.28 }],
  [Twater, { x: 70, y: 90, s: 1.4 }],
  [Trim + 0.5, { x: 55, y: 70, s: 1.12 }],
  [fin, { x: 55, y: 70, s: 1.12 }],
];

export function dibuja(g, t) {
  const cam = rutaCam(t, CAMS);
  const ola = k.suave(k.tramo(t, Tflush, Twater));
  const cae = k.suave(k.tramo(t, Trim, Trim + 0.55));
  const rebose = Math.max(0, 0.92 * (1 - cae) + ola * 0.55 * (1 - cae));
  const quieto = k.tramo(t, fin - 0.32, fin - 0.08);
  const maneta = k.suave(k.tramo(t, Tflush - 0.05, Tagain));
  const charco = k.suave(k.tramo(t, Twater, Trim + 0.2));
  g.save();
  camara(g, cam);
  fondo(g);
  taza(g, t, 60, 10, 1, { nivel: 1, rebose, maneta, charco, quieto });
  const mano = k.suave(k.tramo(t, Tflush - 0.35, Tflush + 0.1)) * (1 - k.suave(k.tramo(t, Tagain + 0.15, Tagain + 0.45)));
  guante(g, -150, -180, -0.6 + maneta * 0.5, 1.15, mano);
  g.restore();
  viñeta(g, 0.4);
  velo(g, 0.8);
}
