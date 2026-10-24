// «Send this to that friend whose toilet won't stop running.»
// El mismo váter del principio. La cámara entra en el chorro hasta el encuadre del fotograma 0.
import * as k from "#kit";
import { v } from "#voz";
import { rutaCam, velo, viñeta } from "../mundo.js";
import { dibujaBano } from "../inodoro.js";

export const desde = (vx) => vx.frase(11).inicio - 2 / 60;
export const entrada = "corte";

const f = v.frase(11);
const Trun = f.t("running");
const CAMS = [
  [f.inicio, { x: 40, y: -100, s: 0.98 }],
  [Trun, { x: 210, y: 10, s: 2.55 }],
  [v.duracion, { x: 210, y: 10, s: 2.55 }],
];

export function dibuja(g, t) {
  g.save();
  const cam = rutaCam(t, CAMS);
  g.translate(540, 960);
  g.scale(cam.s, cam.s);
  g.translate(-cam.x, -cam.y);
  dibujaBano(g, t, { fuga: 1, inunda: 1 });
  g.restore();
  viñeta(g, 0.42);
  velo(g, 0.62);
}
