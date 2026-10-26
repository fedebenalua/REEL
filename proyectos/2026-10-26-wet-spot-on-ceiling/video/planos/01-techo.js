// «Why is there a wet spot on my ceiling?» y el agua que corre por la madera hasta la bandeja.
import { escenaTecho, velo, viñeta } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

export function dibuja(g, t) {
  escenaTecho(g, t);
  velo(g);
  viñeta(g, 0.38);
}
