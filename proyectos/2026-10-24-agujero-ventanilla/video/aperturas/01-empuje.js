// La otra apertura: ya entre las láminas, con el aire empujando la de fuera.
import { ventana } from "../mundo.js";

export const desde = 0;

export function dibuja(g, t) {
  ventana(g, t, "empuje");
}
