// La otra apertura: el mando ya apunta, y la cámara sube por el haz hasta el techo.
import { escena } from "../mundo.js";

export const desde = 0;

export function dibuja(g, t) {
  escena(g, t, "mando");
}
