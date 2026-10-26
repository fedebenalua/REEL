// El cierre: la misma mancha del principio, la gota a punto de caer otra vez.
import { escenaCierre, velo, viñeta } from "../mundo.js";

export const desde = "want";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaCierre(g, t);
  velo(g);
  viñeta(g, 0.4);
}
