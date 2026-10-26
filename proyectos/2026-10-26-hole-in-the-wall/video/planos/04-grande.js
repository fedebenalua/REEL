// «Bigger than six inches» y el cable.
import { escenaGrande, velo, viñeta } from "../mundo.js";

export const desde = "Bigger";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaGrande(g, t);
  velo(g, 0.86);
  viñeta(g, 0.4);
}
