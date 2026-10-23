// «Así que no pesa la colada: siente lo que le cuesta levantarla.»
// La ropa vuelve a subir a un lado y el motor se enciende, y se queda.
import * as k from "#kit";
import { v } from "#voz";
import { fotograma, tiempoQuieto } from "../mundo.js";

export const desde = "asi";
const f = v.frase(9);
const corte = v.frase(10).inicio - 0.04;
const ABAJO = Math.PI / 2, ARRIBA = -0.42;

export function dibuja(g, t) {
  const tm = tiempoQuieto(t, corte);
  const sube = k.suave(k.tramo(tm, f.t("siente") - 0.1, f.t("levantarla") - 0.05));
  const pala = k.mez(ABAJO, ARRIBA, sube);
  const corriente = k.suave(k.tramo(tm, f.t("cuesta") - 0.05, f.t("levantarla")));
  const cam = {
    x: k.mez(500, 640, sube),
    y: k.mez(1020, 1080, sube),
    z: 1,
  };
  fotograma(g, cam, {
    pala, alrededor: 0, vel: 0, carga: 1, agua: 0, tm, corriente, tope: 0, arco: 0, valvula: 1, golpe: 0,
  }, "corte");
}
