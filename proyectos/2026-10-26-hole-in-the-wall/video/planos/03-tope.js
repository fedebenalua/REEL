// «A doorstop on the baseboard».
import { escenaTope, velo, viñeta } from "../mundo.js";

export const desde = "doorstop";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaTope(g, t);
  velo(g, 0.84);
  viñeta(g, 0.32);
}
