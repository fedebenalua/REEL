// La mesa: la moneda y el plato recorren el mismo camino. La pequeña da más vueltas. Paran antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { mesa } from "../mundo.js";

export const desde = "como#2";
export const entrada = "corte";

const f7 = v.frase(7);
const Tmoneda = f7.t("moneda");
const Tcamino = f7.t("camino");
const Tfin = v.frase(8).inicio;

const camino = k.claves([
  [f7.inicio, 0],
  [Tmoneda, 40],
  [Tcamino - 0.15, 920],
  [Tcamino + 0.35, 980],
  [Tfin, 980],
]);

export function dibuja(g, t) {
  mesa(g, t, { madera: camino(t) * 0.35, giro: camino(t) });
}
