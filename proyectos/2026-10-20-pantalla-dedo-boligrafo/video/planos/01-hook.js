// «¿Por qué la pantalla de tu móvil detecta tu dedo, pero no un bolígrafo? / Y, en cambio, sí detecta una salchicha.»
// El móvil enorme, de frente, sobre un fondo morado. Una cámara que se acerca un poco.
// - desde el primer fotograma: un dedo toca la pantalla y estalla en luz; vuelve a tocar en «dedo».
// - «bolígrafo»: toca el bolígrafo, dos veces, y no pasa nada: una cruz roja.
// - «salchicha»: la salchicha toca y la pantalla estalla de luz.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, gancho, velo, vineta } from "../mundo.js";

export const desde = 0;
const FIN = v.frase(2).fin + 0.04;
const cam = camino2D([[0, [1.0, 0, 0]], [FIN, [1.08, 0, 30]]]);

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  gancho(g, t);
  sinVista(g);
  velo(g, 0.4);
  vineta(g, 0.5);
}
export const momentos = { bolígrafo: v.frase(1).t("boligrafo"), salchicha: v.frase(2).t("salchicha") };
