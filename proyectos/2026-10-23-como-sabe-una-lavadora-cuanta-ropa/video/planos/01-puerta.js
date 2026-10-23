// «¿Cómo sabe tu lavadora cuánta ropa has metido?»
// Fotograma 0: pegados al cristal, la ropa ya gira. La cámara se echa atrás. En «ropa» una camiseta golpea el cristal.
import * as k from "#kit";
import { v } from "#voz";
import { fotograma, tiempoQuieto } from "../mundo.js";

export const desde = 0;
const f = v.frase(1);
const corte = v.frase(2).inicio - 0.04;

export function dibuja(g, t) {
  const tm = tiempoQuieto(t, corte);
  const zoom = k.mez(2.45, 1.0, k.suave(k.tramo(tm, 0.2, f.t("metido") - 0.05)));
  const est = {
    pala: 1.1 + tm * 5,
    alrededor: 1,
    carga: 0, agua: 0, tm, corriente: 0, tope: 0.2, arco: 0, valvula: 1,
    golpe: k.tramo(tm, f.t("ropa") - 0.02, f.t("ropa") + 0.38),
  };
  fotograma(g, { x: 540, y: 1100, z: zoom }, est, "frente");
}
