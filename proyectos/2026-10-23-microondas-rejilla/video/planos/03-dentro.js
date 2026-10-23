// Las palomitas, la onda que se queda dentro, y la cara pegada al cristal.
// Al final la cámara vuelve a meterse en la rejilla, como al principio.
import { v } from "#voz";
import { escena } from "../escena.js";

export const desde = () => v.frase(8).inicio;
export const entrada = "sigue";
export function dibuja(g, t) { escena(g, t); }
