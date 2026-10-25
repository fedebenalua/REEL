// «Send this to that friend whose outlet just died.»
import { escenaAmigo } from "../mundo.js";

export const desde = "Send";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaAmigo(g, t);
}
