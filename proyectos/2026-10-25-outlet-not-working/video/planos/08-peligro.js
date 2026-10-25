// No se abre. Si quema, está negro, zumba o no se queda, electricista.
import { escenaPeligro } from "../mundo.js";

export const desde = "Don't";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaPeligro(g, t);
}
