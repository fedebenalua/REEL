// «How do you fix a hole in the wall?» y la pasta que se cae.
import { escenaPared, velo, viñeta } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

export function dibuja(g, t) {
  escenaPared(g, t);
  velo(g, 0.88);
  viñeta(g, 0.36);
}
