// «Close the door, and pull just one pin. All of them, and the door drops.»
import { velo, viñeta, escenaUna } from "../mundo.js";

export const desde = "Close";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaUna(g, t);
  velo(g, 0.8);
  viñeta(g, 0.4);
}
