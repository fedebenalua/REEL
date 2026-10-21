// La otra apertura (en lugar de planos/01-torre.js). «¿Sabías que el café de cada mañana...?»
// El bar (../cafe.js). Fotograma 0: pegados al chorro de la cafetera, que echa café con monedas en la taza, y las
// monedas rebosan; «cada mañana»: las tazas se apilan una encima de otra, cada vez más deprisa, y la cámara sube con la
// torre; el contador llega a 475 € en «euros».
import { escenaCafe } from "../cafe.js";

export const desde = 0;
export function dibuja(g, t) { escenaCafe(g, t, "taza"); }
