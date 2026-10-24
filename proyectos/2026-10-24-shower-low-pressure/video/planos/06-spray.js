// «Screw it back on to the right» y el chorro que vuelve.
import * as k from "#kit";
import { v } from "#voz";
import { ducha } from "../ducha.js";
import { camara, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = "Screw";
export const entrada = "corte";

const f10 = v.frase(10), f11 = v.frase(11);
const Tright = f10.t("right");
const Thand = f10.t("hand");
const Tspray = f11.t("spray");
const Tback = f11.t("back");
const Tmonth = f11.t("month");
const Taway = f11.t("away");
const fin = v.frase(12).inicio;

const giroFn = k.claves([
  [f10.inicio, -1.05],
  [Tright, -0.35],
  [Thand, 0],
  [fin, 0],
]);
const sueltaFn = k.claves([
  [f10.inicio, 1],
  [Tright, 0.25],
  [Thand - 0.05, 0],
  [fin, 0],
]);
const CAM = [
  [f10.inicio, { x: 30, y: 40, s: 1.45 }],
  [Thand, { x: 0, y: 10, s: 1.3 }],
  [Tspray, { x: 0, y: 80, s: 1.05 }],
  [Tback, { x: 0, y: 120, s: 0.92 }],
  [Tmonth, { x: 0, y: 40, s: 1.35 }],
  [Taway, { x: 0, y: 90, s: 1.0 }],
  [fin, { x: 0, y: 100, s: 0.98 }],
];

export function dibuja(g, t) {
  const chorroN = k.suave(k.tramo(t, Tspray - 0.05, Tback));
  const sube = k.suave(k.tramo(t, Tmonth - 0.05, Tmonth + 0.35));
  const baja = k.suave(k.tramo(t, Tmonth + 0.28, Taway));
  const costra = Math.max(0, sube * 0.9 - baja);
  const lavado = k.pulso(t, Tmonth + 0.42, 0.22);
  const flecha = k.suave(k.tramo(t, f10.inicio + 0.1, Tright - 0.1)) * (1 - k.suave(k.tramo(t, Thand - 0.1, Thand + 0.2)));
  g.save();
  camara(g, rutaCam(t, CAM));
  ducha(g, t, {
    costra, chorro: chorroN, goteo: chorroN > 0.2 ? 0 : 0.2,
    palanca: 1,
    giro: giroFn(t), suelta: sueltaFn(t),
    trapo: 0.8, guanteFijo: 1, guanteGiro: flecha > 0.05 || sueltaFn(t) > 0.05 ? 1 : 0,
    flecha, sentido: 1,
    lavado, lavadoY: k.mez(-80, 80, k.tramo(t, Tmonth + 0.2, Taway)),
  });
  g.restore();
  viñeta(g, 0.34);
  velo(g, 0.62);
}
