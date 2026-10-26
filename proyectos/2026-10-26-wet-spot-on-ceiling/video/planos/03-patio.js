// El tubo blanco de fuera: se tira de la baba, la manguera se deja, el vinagre después.
import { escenaPatio, velo, viñeta } from "../mundo.js";

export const desde = "outside";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaPatio(g, t);
  velo(g, 0.88);
  viñeta(g, 0.32);
}
