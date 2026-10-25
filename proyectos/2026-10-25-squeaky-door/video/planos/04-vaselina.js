// «Wipe the grit off, and coat the pin with petroleum jelly.»
import { velo, viñeta, escenaArreglo } from "../mundo.js";

export const desde = "Wipe";
export const entrada = "sigue";

export function dibuja(g, t) {
  escenaArreglo(g, t);
  velo(g, 0.8);
  viñeta(g, 0.38);
}
