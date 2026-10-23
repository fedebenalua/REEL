// «Para nada: esa curva es la línea recta.» … hasta «ciento setenta kilómetros más.»
// El mismo mapa: la hoja se curva hasta hacerse bola y la curva se endereza; la bola gira; vuelve a ser plana; otra vez
// bola, con el hilo.
import { escenaMapa } from "../escena.js";
import { v } from "#voz";
export const desde = () => v.frase(4).inicio;
export const entrada = "sigue";
export function dibuja(g, t) { escenaMapa(g, t); }
