// «How do you fix a squeaky door in thirty seconds?» y el pasador seco.
// Fotograma 0: la bisagra llena la pantalla, la puerta ya se mueve y saltan chispas.
import { velo, viñeta, escenaChirrido } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

export function dibuja(g, t) {
  escenaChirrido(g, t);
  velo(g, 0.84);
  viñeta(g, 0.4);
}
