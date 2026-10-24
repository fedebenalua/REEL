// «Want the full step-by-step...» Vuelve al cordón del fotograma 0.
import * as k from "#kit";
import { v } from "#voz";
import { escenaCostura, estadoCero, velo, viñeta } from "../mundo.js";

export const desde = "Want";
export const entrada = "corte";

const T0 = v.frase(13).inicio;

export function dibuja(g, t) {
  const fin = v.duracion;
  const llega = k.tramo(t, T0, fin - 0.85);
  const cero = estadoCero();
  const e = {
    cam: {
      x: k.mez(-120, cero.cam.x, llega),
      y: k.mez(90, cero.cam.y, llega),
      s: k.mez(1.12, cero.cam.s, llega),
    },
    moho: k.mez(0.42, cero.moho, llega),
    limpio: 0,
    abierto: 0,
    seccion: 0,
    raices: 0,
    gota: 0,
  };
  escenaCostura(g, t, e);
  viñeta(g, 0.4);
  velo(g, 0.8);
}
