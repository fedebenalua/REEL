// «Never boiling. That can crack the bowl.»
import * as k from "#kit";
import { v } from "#voz";
import { rutaCam, camara, fondo, taza, tetera, aspa, grieta, guante, velo, viñeta, fogon } from "../mundo.js";

const f8 = v.frase(8);
const Tboil = f8.t("boiling");
const Tcrack = f8.t("crack");
const fin = v.frase(9).inicio;

export const desde = (voz) => voz.frase(8).inicio - 0.04;
export const entrada = "corte";

const CAMS = [
  [f8.inicio, { x: 20, y: 0, s: 1.15 }],
  [Tcrack, { x: 40, y: 20, s: 1.22 }],
  [Tcrack + 0.4, { x: 30, y: 10, s: 1.12 }],
  [fin, { x: 30, y: 10, s: 1.12 }],
];

export function dibuja(g, t) {
  const cam = rutaCam(t, CAMS);
  const tip = k.claves([
    [f8.inicio, 0.55],
    [Tboil, 0.85],
    [Tcrack, 0.15],
    [Tcrack + 0.35, -0.05],
    [fin, -0.05],
  ], 0, 0)(t);
  const kx = k.claves([
    [f8.inicio, 40],
    [Tboil, 10],
    [Tcrack + 0.32, 240],
    [fin, 240],
  ], 0, 0)(t);
  const xAl = k.claves([
    [f8.inicio, 0],
    [Tboil, 1],
    [Tcrack, 1],
    [fin, 1],
  ], 0, 0)(t);
  const gri = k.pulso(t, Tcrack + 0.05, 0.16);
  const quieto = k.tramo(t, fin - 0.3, fin - 0.08);
  g.save();
  camara(g, cam);
  fondo(g, 0.25);
  fogon(g, -20, 250, t, 0.8);
  taza(g, t, 200, 80, 0.85, { nivel: 0.94, rebose: 0, quieto: 1 });
  grieta(g, 250, 120, gri);
  tetera(g, kx, -20, tip, t, 1);
  guante(g, kx - 90, 20, -0.8, 1.15, 1);
  g.restore();
  aspa(g, 860, 780, 0.85, xAl);
  viñeta(g, 0.42);
  velo(g, 0.78);
}
