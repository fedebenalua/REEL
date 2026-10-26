// Lluvia, baño o techo combado: la escalera se queda en el suelo y entra quien sabe.
import { escenaCasa, velo, viñeta } from "../mundo.js";

export const desde = "wet#2";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaCasa(g, t);
  velo(g, 0.86);
  viñeta(g, 0.34);
}
