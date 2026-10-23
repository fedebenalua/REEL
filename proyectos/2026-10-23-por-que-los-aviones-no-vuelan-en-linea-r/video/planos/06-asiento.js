// «Envíaselo a ese amigo que mira el mapa del asiento y cree que el piloto se ha equivocado.»
import { escenaAsiento } from "../asiento.js";
import { v } from "#voz";
export const desde = () => v.frase(13).inicio;
export const entrada = "corte";
export function dibuja(g, t) { escenaAsiento(g, t); }
