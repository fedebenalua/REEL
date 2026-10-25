// «And skip the chemical clog remover. The label says not for toilets.»
import * as k from "#kit";
import { v } from "#voz";
import { rutaCam, camara, fondo, quimico, aspa, velo, viñeta } from "../mundo.js";

const f11 = v.frase(11);
const Tchem = f11.t("chemical");
const Tlabel = f11.t("label");
const Tnot = f11.t("not");
const fin = v.frase(12).inicio;

export const desde = (voz) => voz.frase(11).inicio - 0.04;
export const entrada = "corte";

const CAMS = [
  [f11.inicio, { x: 180, y: 0, s: 1.15 }],
  [Tchem, { x: 40, y: 10, s: 1.35 }],
  [Tlabel, { x: 0, y: 20, s: 1.55 }],
  [fin, { x: 0, y: 20, s: 1.55 }],
];

export function dibuja(g, t) {
  const cam = rutaCam(t, CAMS);
  const x = k.claves([
    [f11.inicio, 260],
    [Tchem + 0.15, 0],
    [fin, 0],
  ], 0, 0)(t);
  const xAl = k.suave(k.tramo(t, Tnot - 0.05, Tnot + 0.18));
  g.save();
  camara(g, cam);
  fondo(g);
  quimico(g, x, 40, 1.35);
  g.restore();
  aspa(g, 780, 620, 1.15, xAl);
  viñeta(g, 0.4);
  velo(g, 0.78);
}
