// La pregunta, ya pasando: un vuelo entre puestos que un brazo está ocupando.
import * as k from "#kit";
import { v } from "#voz";
import { fabricaVuelo, velo } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

const Tcorte = v.frase(2).inicio;

export function dibuja(g, t) {
  const tt = Math.min(t, Tcorte - 0.26);
  fabricaVuelo(g, tt);
  velo(g);
}
