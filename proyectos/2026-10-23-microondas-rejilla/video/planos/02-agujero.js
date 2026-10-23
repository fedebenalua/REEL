// El agujero, el alfiler, el móvil y el rebote. El mismo microondas, sin corte.
import { v } from "#voz";
import { escena } from "../escena.js";

export const desde = () => v.frase(4).inicio;
export const entrada = "sigue";
export function dibuja(g, t) { escena(g, t); }
