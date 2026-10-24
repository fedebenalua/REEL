// La lámina de dentro, contada con el protector del móvil.
import { v } from "#voz";
import { dibujaMovil } from "../mundo.js";

export const desde = "movil";

export function dibuja(g, t) {
  dibujaMovil(g, t);
}
