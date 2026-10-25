// «Send this to that friend whose door squeaks every morning.»
import { velo, viñeta, escenaManana } from "../mundo.js";

export const desde = "Send";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaManana(g, t);
  velo(g, 0.72);
  viñeta(g, 0.34);
}
