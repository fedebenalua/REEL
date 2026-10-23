// «En 2020, uno cruzó de Nueva York a Londres en menos de cinco horas, con un viento de cola de más de cuatrocientos
// kilómetros por hora.»
import { escenaRecord } from "../escena2.js";
import { v } from "#voz";
export const desde = () => v.frase(11).inicio;
export const entrada = "corte";
export function dibuja(g, t) { escenaRecord(g, t); }
