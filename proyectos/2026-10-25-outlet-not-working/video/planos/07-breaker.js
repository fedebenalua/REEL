// Sigue muerto: el automático del todo a off y luego a on.
import { escenaBreaker } from "../mundo.js";

export const desde = "Still";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaBreaker(g, t);
}
