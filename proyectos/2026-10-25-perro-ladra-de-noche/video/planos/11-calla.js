// «Y de noche la casa calla, así que no se tapa.» La tele se apaga y el pitido fino se queda solo.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(9).inicio;
const f = v.frase(9);
const fin = v.frase(10).inicio;

export function dibuja(g, t) {
  const calla = k.suave(k.tramo(t, f.t("casa"), f.t("calla") + 0.15));
  const queda = k.suave(k.tramo(t, f.t("no"), f.t("tapa") + 0.1));
  const c = {
    Z: k.claves([[f.inicio, 3.8], [f.t("calla"), 4.1], [fin - 0.1, 4.3]])(t),
    cx: k.claves([[f.inicio, 360], [f.t("tapa"), 430], [fin - 0.1, 440]])(t),
    cy: -72,
  };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.tele(g, 180, 1 - calla);
  m.lado(g, 470, t, { dir: -1 });
  m.ondas(g, 250, -90, t, { radio: 55, fuerza: 1 - calla, color: "255,170,70", n: 3, grosor: 5 });
  m.ondas(g, 430, -70, t, { radio: 28, fuerza: 0.25 + queda, color: "180,220,255", n: 4 });
  m.rellena(g, 0.4);
}
