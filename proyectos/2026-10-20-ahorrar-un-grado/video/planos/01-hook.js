// «¿Quieres ahorrar dinero en casa con un solo gesto? Baja un grado el termostato de la calefacción. Uno solo: de veintidós a veintiuno.»
// Un solo sitio: la pared con un termostato enorme que tira billetes por todas partes.
// - desde el fotograma 0: el termostato a 22, rojo, y los billetes volando.
// - «gesto»: sube un dedo desde abajo. «grado»: se queda sobre la flecha de bajar.
// - «veintiuno»: pulsa; la cifra rueda de 22 a 21, el calor se enfría y los billetes dejan de irse.
import * as k from "#kit";
import { v } from "#voz";
import { gancho, velo, vineta } from "../mundo.js";

export const desde = 0;
export function dibuja(g, t) {
  gancho(g, t);
  velo(g, 0.4);
  vineta(g, 0.45);
}
export const momentos = {};
