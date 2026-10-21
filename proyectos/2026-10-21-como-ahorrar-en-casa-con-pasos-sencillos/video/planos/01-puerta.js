// «¿Sabías que tu lavadora no gasta la luz en lavar, sino en calentar el agua? Y no es lo único que pagas sin darte
// cuenta. Cuatro pasos para gastar menos en casa.»
// El lavadero (el hook entero en ../hook.js). Fotograma 0: pegados a la puerta de la lavadora, el agua y la ropa dan
// vueltas; «calentar»: el agua se pone al rojo, hierve, el cristal se empaña y las monedas que caen se deshacen en vapor.
// Frase 2: la cámara se aleja; la lavadora echa vapor y monedas por arriba; «Cuatro pasos»: la hucha y cuatro monedas.
import { dibujaHook } from "../hook.js";

export const desde = 0;
export function dibuja(g, t) { dibujaHook(g, t, "puerta"); }
