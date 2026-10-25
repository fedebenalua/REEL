// «Flush once, and the water spirals down.»
import * as k from "#kit";
import { v } from "#voz";
import { rutaCam, camara, fondo, taza, velo, viñeta } from "../mundo.js";

const f9 = v.frase(9);
const Tonce = f9.t("once");
const Tsp = f9.t("spirals");
const fin = v.frase(10).inicio;

export const desde = (voz) => voz.frase(9).inicio - 0.04;
export const entrada = "corte";

const CAMS = [
  [f9.inicio, { x: 50, y: 10, s: 1.4 }],
  [Tsp, { x: 70, y: 70, s: 1.85 }],
  [Tsp + 0.5, { x: 70, y: 55, s: 1.6 }],
  [fin, { x: 70, y: 55, s: 1.6 }],
];

const nivel = k.claves([
  [f9.inicio, 0.94],
  [Tsp, 0.8],
  [Tsp + 0.55, 0.32],
  [fin, 0.32],
], 0, 0);

export function dibuja(g, t) {
  const cam = rutaCam(t, CAMS);
  const maneta = k.suave(k.tramo(t, f9.inicio, Tonce + 0.05));
  const remolino = k.claves([
    [f9.inicio, 0.2],
    [Tsp, 1],
    [Tsp + 0.45, 0.7],
    [fin - 0.28, 0],
    [fin, 0],
  ], 0, 0)(t);
  const quieto = k.tramo(t, fin - 0.32, fin - 0.1);
  g.save();
  camara(g, cam);
  fondo(g);
  taza(g, t, 70, 20, 1.05, { nivel: nivel(t), rebose: 0, maneta, remolino, quieto });
  g.restore();
  viñeta(g, 0.4);
  velo(g, 0.8);
}
