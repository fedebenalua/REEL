// «Envíaselo a ese amigo al que su perro lo saca a pasear a él.»
// El parque del principio (corte en «Envíaselo»): el perro tira y la persona va detrás, echada hacia atrás.
// La cámara empieza abierta (los dos) y se acerca al perro durante toda la frase; el último fotograma vuelve a ser
// el primero del vídeo (se funde en el último medio segundo con el fotograma 0).
import * as k from "#kit";
import { v } from "#voz";
import { lienzo } from "#kit";
import { dibuja as hook } from "./01-hook.js";

export const desde = (vz) => vz.frase(11).inicio;

const { suave: su, tramo: tr } = k;
const T0 = v.frase(11).inicio, Tpasear = v.frase(11).t("pasear"), FinV = v.duracion ?? 48.4;
let capa = null;

export function dibuja(g, t) {
  const tau = 0.5 + (t - T0), u = su(tr(t, Tpasear - 1.3, FinV));
  const Z = Math.exp(k.mez(Math.log(3.1), Math.log(6.2), u)), w = 1 - u;
  hook(g, tau, { Z, w });
  const f = su(tr(t, FinV - 0.5, FinV));
  if (f > 0.001) {
    if (!capa) capa = lienzo(1080, 1920);
    hook(capa.getContext("2d"), 0);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = f; g.drawImage(capa, 0, 0); g.restore();
  }
}
