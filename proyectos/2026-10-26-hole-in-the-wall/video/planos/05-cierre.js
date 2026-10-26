// «Send this to that friend» y el golpe que enlaza con el primero.
import { escenaCierre, velo, viñeta } from "../mundo.js";

export const desde = "Send";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaCierre(g, t);
  velo(g, 0.88);
  viñeta(g, 0.36);
}
