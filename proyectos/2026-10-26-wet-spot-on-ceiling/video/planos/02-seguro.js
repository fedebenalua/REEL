// «Stay out from under a bulge.» El bulto, la luz que no se toca, el aire que se apaga.
import { escenaSeguro, velo, viñeta } from "../mundo.js";

export const desde = "stay";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaSeguro(g, t);
  velo(g, 0.86);
  viñeta(g, 0.36);
}
