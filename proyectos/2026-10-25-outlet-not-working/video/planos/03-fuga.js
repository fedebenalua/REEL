// El botón en otra habitación, y la fuga que apaga lo que va detrás.
import { escenaFuga } from "../mundo.js";

export const desde = "button";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaFuga(g, t);
}
