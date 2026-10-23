// «Pero contar no vale si no sabe dónde está cada piso. Por eso, cuando lo instalan, hace un viaje de aprendizaje: sube
// entero y apunta cuántos pulsos hay hasta cada piso. Después, cuando el contador llega al número que apuntó para el
// piso cinco, sabe que ha llegado.»
// El edificio entero: los pisos pierden el número («?»), la cabina baja y sube apuntando cada piso en la tabla.
import { escena } from "../escena.js";
import { v } from "#voz";
export const desde = () => v.frase(5).inicio;
export const entrada = "sigue";
export function dibuja(g, t) { escena(g, t); }
