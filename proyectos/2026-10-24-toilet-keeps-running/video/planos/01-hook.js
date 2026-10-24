// «Why does your toilet keep running?» «A leaky one wastes about two hundred gallons a day.»
// Fotograma 0: el chorro llena la pantalla. La cámara se abre al váter. En «gallons» el 200 se queda.
import * as k from "#kit";
import { v } from "#voz";
import { rutaCam, velo, viñeta } from "../mundo.js";
import { dibujaBano } from "../inodoro.js";

export const desde = 0;
export const entrada = "corte";

const f1 = v.frase(1), f2 = v.frase(2);
const Trun = f1.t("running"), Tgal = f2.t("gallons"), Twaste = f2.t("wastes");
const fin = v.frase(3).inicio;

const CAMS = [
  [0.02, { x: 210, y: 10, s: 2.55 }],
  [Trun, { x: 40, y: -90, s: 0.98 }],
  [Twaste, { x: 30, y: -70, s: 0.98 }],
  [fin - 0.05, { x: 30, y: -70, s: 0.98 }],
];

export function dibuja(g, t) {
  const cam = rutaCam(t, CAMS);
  const inunda = k.suave(k.tramo(t, Twaste, Tgal));
  g.save();
  ruta(g, cam);
  dibujaBano(g, t, { fuga: 1, inunda });
  g.restore();
  viñeta(g, 0.42);
  velo(g, 0.62);
  const n = Math.round(k.mez(0, 200, k.entra(k.tramo(t, Twaste, Tgal))));
  const al = k.suave(k.tramo(t, Twaste - 0.05, Twaste + 0.25));
  k.pastilla(g, 540, 1280, String(n), "gal / day", "120,210,255", al, 120);
}

function ruta(g, cam) {
  g.translate(540, 960);
  g.scale(cam.s, cam.s);
  g.translate(-cam.x, -cam.y);
}
