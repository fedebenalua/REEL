// «Sand it lightly» y el anillo que se transparenta.
import { escenaPintura, velo, viñeta } from "../mundo.js";

export const desde = "Sand";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaPintura(g, t);
  velo(g, 0.88);
  viñeta(g, 0.34);
}
