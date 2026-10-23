// «Así que el piloto no se ha perdido: va por el camino más corto de una Tierra redonda, y el viento hace el resto.»
// El mismo mapa: se hace bola, gira entera y el avión la cruza empujado por el viento.
import { escenaRecord } from "../escena2.js";
import { v } from "#voz";
export const desde = () => v.frase(12).inicio;
export const entrada = "sigue";
export function dibuja(g, t) { escenaRecord(g, t); }
