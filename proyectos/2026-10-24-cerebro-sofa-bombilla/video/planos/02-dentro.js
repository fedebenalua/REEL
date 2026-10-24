// Dentro de la bombilla: señales y mensajes. Corte en «dentro».
import { camDentro, dibujaMundo } from "../mundo.js";

export const desde = "dentro";
export const entrada = "corte";

export function dibuja(g, t) {
  dibujaMundo(g, t, camDentro(t), false);
}
