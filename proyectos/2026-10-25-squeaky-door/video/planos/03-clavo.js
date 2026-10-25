// El clavo, el pomo y el pasador que sale. Sigue en el mismo sitio hasta que la puerta gira.
import { velo, viñeta, escenaArreglo } from "../mundo.js";

export const desde = "Tap";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaArreglo(g, t);
  velo(g, 0.8);
  viñeta(g, 0.38);
}
