// Las cuatro ruedas. Una se queda más pequeña y gira más deprisa, y reposa antes de la mesa.
import * as k from "#kit";
import { v } from "#voz";
import { viaje, escena, recorrido } from "../mundo.js";

export const desde = "otros";
export const entrada = "corte";

const f5 = v.frase(5), f6 = v.frase(6);
const Tvueltas = f5.t("vueltas");
const Tpequena = f6.t("pequena");
const Tdeprisa = f6.t("deprisa");
const Tfin = v.frase(7).t("como");

const pos = viaje([
  [f5.inicio - 0.2, [-2.45, 1.55, 2.65]],
  [Tvueltas, [-2.15, 1.45, 2.55]],
  [Tpequena - 0.05, [-2.05, 1.35, 2.45]],
  [Tfin, [-2.05, 1.35, 2.45]],
]);
const mira = viaje([
  [f5.inicio - 0.2, [0.0, 0.28, 0.05]],
  [Tvueltas, [-0.1, 0.3, 0.05]],
  [Tpequena, [-0.15, 0.28, 0.1]],
  [Tfin, [-0.15, 0.28, 0.1]],
]);

const aplast = k.claves([
  [0, 0],
  [Tpequena - 0.05, 0],
  [Tdeprisa + 0.15, 1],
  [Tfin, 1],
]);
const vel = k.claves([
  [0, 5.2],
  [Tpequena, 5.2],
  [Tdeprisa + 0.2, 10.4],
  [Tdeprisa + 0.85, 10.4],
  [Tfin - 0.55, 0.35],
  [Tfin, 0.15],
]);

export function dibuja(g, t) {
  const cam = k.mira(pos(t), mira(t));
  const t0 = f5.inicio;
  const g0 = 0.4 + recorrido(t, t0, (s) => vel(Math.min(s, Tpequena)));
  const gHero = 0.4 + recorrido(t, t0, (s) => vel(s));
  const a = aplast(t);
  const velCamino = k.claves([[0, 2.2], [Tfin - 0.6, 2.2], [Tfin - 0.15, 0], [Tfin, 0]]);
  escena(g, cam, t, {
    aplast: [a, 0, 0, 0],
    giro: [gHero, g0 + 1.7, g0 + 3.1, g0 + 0.8],
    luz: 0,
    metros: recorrido(t, f5.inicio - 0.2, velCamino),
    velo: 0.4,
  });
}
