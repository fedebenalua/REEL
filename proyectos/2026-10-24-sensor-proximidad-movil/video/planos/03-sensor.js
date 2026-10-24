// Dentro del sensor: la luz sale, rebota en la piel y vuelve. Si vuelve mucha, hay algo muy cerca.
// La cámara sale del agujero en «apaga» y se ve la pantalla apagarse. El dedo toca y no pasa nada.
// Quieto antes de «así».
import * as k from "#kit";
import { v } from "#voz";
import { SENSOR, TEL, dedo, dentro, fondo, telefono, velo } from "../mundo.js";

export const desde = "sale";

const { suave: su, tramo: tr, mez } = k;
const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7);
const Tsale = f5.t("sale"), Treb = f5.t("rebota"), Tvue = f5.t("vuelve");
const Tcerca = f6.t("cerca"), Tape = f7.t("apaga"), Ttoq = f7.t("toques");

function cerca(t) {
  if (t < f6.inicio) return 0.12;
  return su(tr(t, f6.inicio + 0.05, Tcerca + 0.05));
}
function saleU(t) {
  return su(tr(t, Tsale - 0.02, Treb + 0.05));
}
function vuelveU(t) {
  return su(tr(t, Treb + 0.15, Tvue + 0.12));
}
function al(t) {
  const ida = saleU(t) * 0.9;
  const vuelta = vuelveU(t);
  const hero = Math.max(ida, vuelta);
  const sigue = su(tr(t, Tvue + 0.15, Tvue + 0.4));
  const seVa = 1 - su(tr(t, Tape - 0.7, Tape - 0.28));
  return (hero * (1 - sigue) + sigue * (0.7 + 0.3 * cerca(t))) * seVa;
}
function zoom(t) {
  const acerca = t < Treb ? mez(5.1, 4.35, su(tr(t, Tsale, Treb))) : mez(4.35, 5.15, su(tr(t, f6.inicio, Tcerca)));
  const salir = su(tr(t, Tape - 0.7, Tape - 0.08));
  return mez(acerca, 0.07, salir);
}
function encendida(t) {
  if (t < Tape - 0.02) return 1;
  return 1 - su(tr(t, Tape - 0.02, Tape + 0.38));
}
function toque(t) {
  if (t < Tape + 0.7) return 0;
  return k.entra(tr(t, Tape + 0.75, Ttoq - 0.05));
}

export function dibuja(g, t) {
  const e = encendida(t), z = zoom(t);
  fondo(g, 0.25);
  telefono(g, TEL.x, TEL.y, TEL.esc, -0.02, t, e, z < 0.2 ? 0.15 : 0);
  const u = z < 1.3 ? toque(t) : 0;
  dedo(g, TEL.x + 20, TEL.y - 80, u);
  if (u > 0.8 && t < Ttoq + 0.42) {
    const p = su(tr(t, Ttoq - 0.05, Ttoq + 0.32));
    g.save();
    g.globalAlpha = (1 - p) * 0.55;
    g.fillStyle = "rgba(255,255,255,0.95)";
    g.beginPath();
    g.arc(TEL.x + 20, TEL.y - 60, 50 + p * 320, 0, 6.2832);
    g.fill();
    g.restore();
  }
  if (z > 0.12) {
    g.save();
    g.translate(SENSOR.x, SENSOR.y);
    g.scale(z, z);
    g.translate(-220, -350);
    g.beginPath();
    k.redondo(g, 0, 0, 440, 700, 40);
    g.clip();
    dentro(g, t, cerca(t), saleU(t), vuelveU(t), al(t));
    g.restore();
  }
  velo(g, 0.8);
}
