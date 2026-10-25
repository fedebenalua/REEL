// Dentro del mando: el martillo, las cuatro varillas.
import { C1, dibujaDentro } from "../mundo.js";

export const desde = C1;
export const entrada = "corte";

export function dibuja(g, t) {
  dibujaDentro(g, t);
}
