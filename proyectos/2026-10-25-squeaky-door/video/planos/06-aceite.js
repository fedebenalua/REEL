// «Skip the cooking oil. It runs, and then it turns sticky.»
import { velo, viñeta, escenaAceite } from "../mundo.js";

export const desde = "Skip";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaAceite(g, t);
  velo(g, 0.8);
  viñeta(g, 0.4);
}
