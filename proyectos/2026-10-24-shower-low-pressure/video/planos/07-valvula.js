// «If every tap is weak, open the main valve all the way.»
import * as k from "#kit";
import { v } from "#voz";
import { camara, rutaCam, velo, viñeta } from "../mundo.js";
import { llaves } from "../piezas.js";

export const desde = "every";
export const entrada = "corte";

const f = v.frase(12);
const Tvalve = f.t("valve");
const Tway = f.t("way");
const Talready = f.t("already");
const Tplumber = f.t("plumber");
const fin = v.frase(13).inicio;

const angFn = k.claves([
  [f.inicio, -1.15],
  [Tvalve, -1.05],
  [Tway, -0.02],
  [Talready, -0.02],
  [fin, -0.02],
]);
const fuerzaFn = k.claves([
  [f.inicio, 0],
  [Tway - 0.12, 0.05],
  [Tway + 0.35, 1],
  [fin, 1],
]);
const CAM = [
  [f.inicio, { x: 0, y: -60, s: 1.4 }],
  [Tvalve - 0.2, { x: 0, y: -20, s: 1.2 }],
  [Tvalve + 0.15, { x: 0, y: 340, s: 1.45 }],
  [Tway + 0.15, { x: 0, y: 180, s: 1.05 }],
  [Talready, { x: 140, y: 420, s: 1.25 }],
  [fin, { x: 180, y: 460, s: 1.15 }],
];

export function dibuja(g, t) {
  const tel = k.suave(k.tramo(t, Talready + 0.05, Tplumber));
  const empuje = k.suave(k.tramo(t, Talready, Talready + 0.25)) * (1 - k.suave(k.tramo(t, Tplumber, Tplumber + 0.25)));
  const temblor = Math.sin(t * 26) * 0.045 * empuje;
  g.save();
  camara(g, rutaCam(t, CAM));
  llaves(g, t, {
    fuerza: fuerzaFn(t),
    ang: angFn(t) + temblor,
    guante: k.suave(k.tramo(t, Tvalve - 0.1, Tvalve + 0.15)),
    telefono: tel,
  });
  g.restore();
  viñeta(g, 0.4);
  velo(g, 0.66);
}
