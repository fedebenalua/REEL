// «Now the button turns nothing.»
// Otro salón. Al final, en «up», vuelve el dial del principio, girando hasta el mismo encuadre.
import * as k from "#kit";
import { v } from "#voz";
import { camaraNueva, camaraVieja, escenaNueva, escenaVieja } from "../mundo.js";

export const desde = "now";
export const entrada = "corte";

export function dibuja(g, t) {
  escenaNueva(g, t, camaraNueva(t));
  const vuelve = k.suave(k.tramo(t, v.frase(12).t("up") - 0.05, v.frase(12).fin + 0.15));
  if (vuelve > 0.01) {
    g.save();
    g.globalAlpha = vuelve;
    escenaVieja(g, t - v.duracion, camaraVieja(0));
    g.restore();
  }
}
