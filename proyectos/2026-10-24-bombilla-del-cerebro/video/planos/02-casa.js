// Frases 5 a 7. Otro sitio: la casa de la historia que se cuenta.
import * as k from "#kit";
import { v } from "#voz";
import { casa, velo } from "../mundo.js";

export const desde = "seria";

const { suave: su, tramo: tr, mez } = k;
const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7);
const Tcuarto = f5.t("cuarto"), Tluce = f6.t("lucecita"), Tcasi = f7.t("casi"), Tgir = f7.t("giraria");
const Tquieto = f7.fin - 0.28;

function focoZoom(t) {
  const tc = Math.min(t, Tquieto);
  // casa entera → cuarto vivido → contador → casa entera
  const cuarto = { x: 700, y: 1180 };
  const cont = { x: 210, y: 1120 };
  const toda = { x: 540, y: 1040 };
  let f = { ...toda }, z = 1;
  const uC = su(tr(tc, f5.t("casa"), Tcuarto + 0.15));
  f = { x: mez(f.x, cuarto.x, uC), y: mez(f.y, cuarto.y, uC) };
  z = mez(z, 1.55, uC);
  const uL = su(tr(tc, f6.t("bombilla"), Tluce + 0.35));
  z = mez(z, 1.7, uL);
  const uCont = su(tr(tc, f7.inicio, f7.t("contador") + 0.25));
  f = { x: mez(f.x, cont.x, uCont), y: mez(f.y, cont.y, uCont) };
  z = mez(z, 1.85, uCont);
  const uVolver = su(tr(tc, Tgir + 0.15, Tgir + 0.55));
  f = { x: mez(f.x, toda.x, uVolver), y: mez(f.y, toda.y, uVolver) };
  z = mez(z, 1, uVolver);
  return { f, z };
}

function angulo(t) {
  const v0 = 7.5;
  if (t <= Tcasi) return v0 * t;
  const dur = Math.max(0.05, Tgir - Tcasi);
  const u = su(tr(t, Tcasi, Tgir));
  return v0 * Tcasi + v0 * dur * (u - u * u / 2);
}

export function dibuja(g, t) {
  const { f, z } = focoZoom(t);
  const lampara = 1 - su(tr(t, Tluce - 0.12, Tluce + 0.45));
  g.save();
  g.translate(540, 1000);
  g.scale(z, z);
  g.translate(-f.x, -f.y);
  casa(g, lampara, angulo(Math.min(t, Tgir + 0.05)), 0, 3);
  g.restore();
  velo(g, 0.7);
}
