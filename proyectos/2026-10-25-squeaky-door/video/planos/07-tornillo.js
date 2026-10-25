// «Still noisy? Tighten the screws. A warped frame needs a carpenter.»
import { velo, viñeta, escenaTornillo } from "../mundo.js";

export const desde = "Still";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaTornillo(g, t);
  velo(g, 0.8);
  viñeta(g, 0.4);
}
