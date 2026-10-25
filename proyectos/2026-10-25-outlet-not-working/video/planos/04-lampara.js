// Desenchufar y probar una lámpara que sí funciona.
import { escenaLampara } from "../mundo.js";

export const desde = "Unplug";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaLampara(g, t);
}
