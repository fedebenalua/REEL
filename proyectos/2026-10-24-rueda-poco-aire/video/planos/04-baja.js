// La rueda que gira más deprisa, las cuatro bajas a la vez, la vibración lenta, y el testigo otra vez.
import * as k from "#kit";
import { v } from "#voz";
import { viaje, escena, recorrido } from "../mundo.js";

export const desde = "si";
export const entrada = "corte";

const f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11), f12 = v.frase(12);
const Tbaja = f8.t("baja");
const Tigual = f9.t("igual");
const Tvibra = f10.t("vibra");
const Tlenta = f10.t("lenta");
const Tradio = f11.t("radio");
const Tvueltas = f11.t("vueltas");
const Ttestigo = f12.t("testigo");
const fin = v.duracion;

const pos = viaje([
  [f8.inicio - 0.2, [-1.7, 0.58, 1.72]],
  [Tbaja, [-1.55, 0.5, 1.55]],
  [f9.inicio, [-2.05, 1.15, 2.35]],
  [Tigual, [-2.4, 1.7, 2.85]],
  [f9.fin, [-2.35, 1.65, 2.75]],
  [Tvibra, [-1.7, 0.62, 1.85]],
  [Tlenta, [-1.55, 0.5, 1.62]],
  [f11.inicio, [-0.9, 0.95, 3.15]],
  [Tradio, [-0.55, 1.05, 3.55]],
  [Tvueltas, [-1.15, 0.7, 2.35]],
  [Ttestigo, [-1.35, 0.55, 1.95]],
  [fin, [-1.5, 0.5, 1.82]],
]);
const mira = viaje([
  [f8.inicio - 0.2, [-1.25, 0.28, 0.6]],
  [Tbaja, [-1.3, 0.3, 0.65]],
  [Tigual, [0.0, 0.28, 0]],
  [Tvibra, [-1.32, 0.3, 0.7]],
  [Tlenta, [-1.32, 0.26, 0.75]],
  [f11.inicio, [-0.5, 0.55, 0.2]],
  [Tvueltas, [-1.15, 0.35, 0.45]],
  [fin, [-1.35, 0.26, 0.72]],
]);

const aHero = k.claves([
  [0, 1],
  [Tigual - 0.1, 1],
  [fin, 1],
]);
const aResto = k.claves([
  [0, 0],
  [f9.inicio, 0],
  [Tigual + 0.35, 1],
  [fin, 1],
]);
const luz = k.claves([
  [0, 0],
  [Tbaja - 0.08, 0],
  [Tbaja + 0.28, 1],
  [fin, 1],
]);
function ond(t) {
  if (t < Tvibra) return 0;
  if (t < Tlenta) return k.de(t, Tvibra, Tlenta, 0, 0.16);
  if (t < f11.inicio) return k.de(t, Tlenta, f11.inicio, 0.16, 0.04);
  return k.de(t, f11.inicio, fin, 0.04, 0.02);
}
function freq(t) {
  if (t < Tvibra) return 6;
  if (t < Tlenta) return k.de(t, Tvibra, Tlenta, 6, 2.2);
  return 2.2;
}
const anillos = k.claves([
  [0, 0],
  [Tradio - 0.05, 0],
  [Tradio + 1.05, 1],
  [Tvueltas, 1],
  [fin, 1],
]);

export function dibuja(g, t) {
  const cam = k.mira(pos(t), mira(t));
  const wLento = 2.4, wRapido = 5.6;
  const tI = Tigual;
  // La delantera ya llega rápida. A partir de «igual», las cuatro llevan el mismo ritmo.
  const base = (t - f8.inicio) * wLento;
  const hero = (t < tI)
    ? (t - f8.inicio) * wRapido
    : (tI - f8.inicio) * wRapido + (t - tI) * wLento * 1.15;
  const otras = (t < tI)
    ? base
    : (tI - f8.inicio) * wLento + (t - tI) * wLento * 1.15;
  const a = aHero(t), b = aResto(t);
  const fase = t > Tvibra - 0.2 ? recorrido(t, Tvibra - 0.2, freq) : 0;
  const velCamino = k.claves([
    [f8.inicio, 1.6],
    [Tvibra, 1.2],
    [Tlenta, 0.55],
    [f11.inicio, 1.4],
    [fin, 1.6],
  ]);
  const ondas = anillos(t) * k.de(t, Tvueltas - 0.2, Tvueltas + 0.7, 1, 0);
  escena(g, cam, t, {
    aplast: [a, b, b, b],
    giro: [hero + 0.2, otras + 1.4, otras + 2.6, otras + 0.7],
    luz: luz(t),
    ond: ond(t),
    fase,
    anillos: Math.max(0, ondas),
    metros: recorrido(t, f8.inicio - 0.2, velCamino),
    velo: 0.45,
  });
}
