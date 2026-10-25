// «Still stuck, or the tub gurgles too? Stop, and call a plumber.»
import * as k from "#kit";
import { v } from "#voz";
import { rutaCam, camara, fondo, banera, guante, telefono, cubo, velo, viñeta } from "../mundo.js";

const f10 = v.frase(10);
const Tgurg = f10.t("gurgles");
const Tstop = f10.t("stop");
const Tplum = f10.t("plumber");
const fin = v.frase(11).inicio;

export const desde = (voz) => voz.frase(10).inicio - 0.04;
export const entrada = "corte";

const CAMS = [
  [f10.inicio, { x: 0, y: 80, s: 1.15 }],
  [Tgurg, { x: 0, y: 40, s: 1.35 }],
  [Tstop, { x: 40, y: 20, s: 1.15 }],
  [Tplum, { x: 160, y: 10, s: 1.18 }],
  [Tplum + 0.4, { x: 170, y: 10, s: 1.18 }],
  [fin, { x: 170, y: 10, s: 1.18 }],
];

export function dibuja(g, t) {
  const cam = rutaCam(t, CAMS);
  const burbuja = k.claves([
    [f10.inicio, 0.15],
    [Tgurg, 0.95],
    [Tgurg + 0.35, 0.15],
    [fin, 0],
  ], 0, 0)(t);
  const mano = k.claves([
    [f10.inicio, 180],
    [Tstop - 0.1, 40],
    [Tstop + 0.35, 260],
    [fin, 280],
  ], 0, 0)(t);
  const manoAl = 1 - k.suave(k.tramo(t, Tplum - 0.1, Tplum + 0.25));
  const tel = k.suave(k.tramo(t, Tplum - 0.12, Tplum + 0.28));
  const quieto = k.tramo(t, fin - 0.32, fin - 0.1);
  g.save();
  camara(g, cam);
  fondo(g);
  banera(g, t, { burbuja: burbuja * (1 - quieto * 0.5), quieto });
  cubo(g, mano + 80, 40, 0.7, 0.8, 0.4 * (1 - k.tramo(t, Tstop, Tstop + 0.3)));
  guante(g, mano, 10, -0.3, 1.15, manoAl);
  telefono(g, 220, 40, 1.35, tel);
  g.restore();
  viñeta(g, 0.42);
  velo(g, 0.8);
}
