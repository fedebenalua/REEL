// «Hold the arm still...» y «If the arm starts turning, stop...»
import * as k from "#kit";
import { v } from "#voz";
import { ducha } from "../ducha.js";
import { alarma, camara, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = "Hold";
export const entrada = "corte";

const f5 = v.frase(5), f6 = v.frase(6);
const Tstill = f5.t("still");
const Tcloth = f5.t("cloth");
const Tstuck = f5.t("stuck");
const Ttwist = f5.t("twist");
const Tleft = f5.t("left");
const Tturn = f6.t("turning");
const Tstop = f6.t("stop");
const Tcall = f6.t("call");
const Tplumber = f6.t("plumber");
const fin = v.frase(7).inicio;

const giroFn = k.claves([
  [f5.inicio, 0],
  [Ttwist, -0.2],
  [Tleft, -1.2],
  [f5.fin, -1.2],
  [fin, -1.2],
]);
const sueltaFn = k.claves([
  [f5.inicio, 0],
  [Tleft - 0.04, 0.02],
  [f5.fin - 0.18, 1],
  [fin, 1],
]);
const brazoFn = k.claves([
  [f5.inicio, 0],
  [f6.t("starts"), 0],
  [Tturn + 0.08, 0.32],
  [Tstop + 0.22, 0],
  [fin, 0],
]);
const CAM = [
  [f5.inicio, { x: -20, y: -80, s: 1.25 }],
  [Ttwist, { x: 20, y: 20, s: 1.4 }],
  [Tleft, { x: 30, y: 80, s: 1.45 }],
  [f6.inicio, { x: 10, y: 40, s: 1.15 }],
  [Tplumber, { x: 80, y: 120, s: 1.05 }],
  [fin, { x: 80, y: 140, s: 1.02 }],
];

export function dibuja(g, t) {
  const giro = giroFn(t);
  const suelta = sueltaFn(t);
  const giroBrazo = brazoFn(t);
  const trapo = k.suave(k.tramo(t, Tcloth - 0.08, Tstuck + 0.1));
  const fijo = k.suave(k.tramo(t, f5.inicio, Tstill));
  const gira = k.suave(k.tramo(t, Ttwist - 0.15, Ttwist + 0.2));
  const flecha = k.suave(k.tramo(t, Ttwist, Tleft - 0.12)) * (1 - k.suave(k.tramo(t, Tleft, Tleft + 0.28)));
  const tel = k.suave(k.tramo(t, Tcall, Tplumber + 0.1));
  g.save();
  camara(g, rutaCam(t, CAM));
  ducha(g, t, {
    costra: 1, goteo: 0.35, palanca: 1,
    giro, suelta, giroBrazo, trapo,
    guanteFijo: fijo, guanteGiro: gira,
    flecha, sentido: -1, telefono: tel,
  });
  g.restore();
  alarma(g, k.pulso(t, Tstop, 0.16));
  viñeta(g, 0.4);
  velo(g, 0.68);
}
