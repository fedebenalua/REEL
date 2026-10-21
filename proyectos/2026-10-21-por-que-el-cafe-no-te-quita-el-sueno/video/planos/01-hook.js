// «(la primera frase)»
// Lo que se ve, frase a frase, de la primera palabra a la última (lo mismo que dice plan.md).
import * as k from "#kit";
import { v } from "#voz";

export const desde = 0; // el primer plano empieza en 0; los demás, en la palabra que trae lo nuevo ("palabra" o "palabra#2")

export function dibuja(g, t) {
  // t: el segundo del vídeo. Todo se calcula desde t (nada se guarda de un fotograma al siguiente).
  // v.t("palabra"): cuándo se dice esa palabra.
  g.fillStyle = "#03050a"; g.fillRect(0, 0, 1080, 1920);
}
