// El coche de noche: la rueda baja, el interior vacío, el sensor y el testigo.
import * as k from "#kit";
import { v } from "#voz";
import { viaje, escena, interior, recorrido } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4);
const Taire = f1.t("aire");
const Tmira = f2.t("mira");
const Tdentro = f2.t("dentro");
const Tojos = f2.t("ojos");
const Tsensor = f3.t("sensor");
const Tvalvula = f3.t("valvula");
const Tradio = f3.t("radio");
const Tquinta = f4.t("quinta");
const Tenciende = f4.t("enciende");
const Tcorte = v.frase(5).t("otros");

const pos = viaje([
  [-0.45, [-1.05, 0.32, 1.28]],
  [0, [-1.55, 0.52, 1.85]],
  [0.9, [-1.35, 0.78, 2.55]],
  [Taire, [-0.85, 0.82, 2.85]],
  [f1.fin, [-0.7, 0.78, 2.7]],
  [Tmira, [-0.95, 0.7, 2.35]],
  [Tdentro, [-1.4, 0.46, 1.65]],
  [Tojos, [-1.35, 0.34, 1.32]],
  [Tcorte, [-1.35, 0.34, 1.32]],
]);
const mira = viaje([
  [-0.45, [-1.35, 0.18, 0.82]],
  [0, [-1.35, 0.28, 0.72]],
  [Taire, [-1.15, 0.48, 0.35]],
  [Tmira, [-1.25, 0.4, 0.5]],
  [Tdentro, [-1.35, 0.3, 0.78]],
  [Tojos, [-1.35, 0.28, 0.82]],
  [Tcorte, [-1.35, 0.28, 0.82]],
]);

const entra = k.claves([
  [0, 0],
  [Tdentro - 0.08, 0],
  [Tojos - 0.08, 1],
  [Tcorte, 1],
]);
const sensor = k.claves([
  [0, 0],
  [Tsensor - 0.08, 0],
  [Tvalvula + 0.25, 1],
  [Tcorte, 1],
]);
const panel = k.claves([
  [0, 0],
  [f3.t("manda") - 0.1, 0],
  [Tradio, 1],
  [Tcorte, 1],
]);
const anillos = k.claves([
  [0, 0],
  [Tradio - 0.05, 0],
  [Tradio + 1.15, 1],
  [Tcorte, 1],
]);
const quinta = k.claves([
  [0, 0],
  [Tquinta - 0.05, 0],
  [Tquinta + 0.45, 1],
  [Tcorte, 1],
]);
const luz = k.claves([
  [0, 0.15],
  [Tquinta, 0.25],
  [Tenciende, 1],
  [Tenciende + 0.28, 1],
  [Tcorte, 1],
]);
const quieto = k.claves([
  [0, 0],
  [Tenciende + 0.15, 0],
  [Tenciende + 0.55, 1],
  [Tcorte, 1],
]);
const giroExt = k.claves([
  [0, 2.4],
  [Tdentro, 2.4],
  [Tojos, 0.3],
  [Tcorte, 0],
]);

export function dibuja(g, t) {
  const cam = k.mira(pos(t), mira(t));
  const u = entra(t);
  const w = 2.2;
  const ang = t * w * (1 - quieto(Math.min(t, Tojos)));
  const g0 = ang + Math.sin(Math.min(t, 2.2) * 6) * 0.15 * (t < Tdentro ? 1 : 0);
  escena(g, cam, t, {
    aplast: [1, 0, 0, 0],
    giro: [g0, g0 + 1.2, g0 + 2.1, g0 + 0.6],
    luz: t < Tdentro ? 1 : 0,
    metros: recorrido(t, 0, giroExt),
    velo: t < Tdentro ? 0.35 : 0,
  });
  interior(g, t, u, {
    sensor: sensor(t),
    panel: panel(t),
    anillos: anillos(t) * k.de(t, Tradio + 0.85, Tradio + 1.7, 1, 0),
    quinta: quinta(t),
    luz: luz(t),
    quieto: quieto(t),
    giro: Math.min(t, Tenciende + 0.4) * 1.6,
  });
}
