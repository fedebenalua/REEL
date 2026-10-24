// Otra apertura: la bolsa viene de frente y crece hasta llenar la cortina. Se queda la de dentro
// (planos/01-hook.js), que ya está en la caída desde el fotograma 0.
import { escena } from "../mundo.js";

export const desde = 0;

export function dibuja(g, t) {
  escena(g, t, "frente");
}
