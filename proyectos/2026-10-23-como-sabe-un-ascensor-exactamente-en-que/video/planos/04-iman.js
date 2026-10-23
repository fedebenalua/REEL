// «Pero contar puede descuadrarse, así que en cada piso hay un imán. Tres sensores del ascensor lo notan al pasar, y lo
// frenan hasta dejarlo a menos de un milímetro del suelo.»
// La cuenta se descuadra; aparecen los imanes y la cámara se mete en uno: los tres sensores lo notan y la cabina frena.
import { escena } from "../escena.js";
import { v } from "#voz";
export const desde = () => v.frase(8).inicio;
export const entrada = "sigue";
export function dibuja(g, t) { escena(g, t); }
