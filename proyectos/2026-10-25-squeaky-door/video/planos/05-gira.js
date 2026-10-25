// «Push it back down, wipe the extra, and swing the door.»
import { velo, viñeta, escenaArreglo } from "../mundo.js";

export const desde = "Push";
export const entrada = "sigue";

export function dibuja(g, t) {
  escenaArreglo(g, t);
  velo(g, 0.78);
  viñeta(g, 0.36);
}
