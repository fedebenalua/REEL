// «Así que tus cosquillas siguen ahí: tu cerebro solo apaga lo que haces tú.»
// «Síguenos, o envíaselo a ese amigo que siempre dice que él no empezó.»
// - Tu palma otra vez. Entra el dedo rojo y le hace círculos: revientan las chispas («siguen ahí»).
// - «tu cerebro»: el rojo se va y vuelve tu dedo azul a hacer lo mismo; en «tú» las chispas se apagan en humo gris.
// - El cierre: la cámara se aleja un poco; tu dedo sigue con sus círculos, sin chispas. Asoma el dedo rojo y, en
//   «empezó», toca la palma: revientan las chispas otra vez.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, ROJO, chispas, dedo, fondoMorado, humo, palma, velo, vineta } from "../mundo.js";

export const desde = (v) => v.frase(10).inicio;
export const entrada = "corte";

const { suave: su, tramo: tr, mez, entra, sale } = k;
const f10 = v.frase(10), f11 = v.frase(11);
const T0 = f10.inicio, Tsig = f10.t("siguen"), Tahi = f10.t("ahi"), Tcer = f10.t("cerebro"), Tapa = f10.t("apaga"), Ttu = f10.t("tu#2");
const Tsi = f11.inicio, Tami = f11.t("amigo"), Tdic = f11.t("dice"), Temp = f11.t("empezo"), Tfin = f11.fin;

const cx = 540, cy = 1160, s = 1.3;
const R = 85 * s, ox = cx + 10 * s, oy = cy - 10 * s;
const enCirculo = (t, w, fase) => [ox + R * Math.cos(w * t + fase), oy + R * 0.7 * Math.sin(w * t + fase)];

export function dibuja(g, t) {
  fondoMorado(g, t);
  // el cierre: la cámara se aleja un poco
  const z = mez(1, 0.9, su(tr(t, Tsi, Tdic)));
  g.save(); g.translate(540, 1100); g.scale(z, z); g.translate(-540, -1100);
  // el dedo rojo: entra por la izquierda, hace círculos y se va; en el cierre vuelve y, en «empezó», toca la palma
  const rEntra = entra(tr(t, T0, T0 + 0.45)), rSale = sale(tr(t, Tcer - 0.1, Tcer + 0.35));
  const rAsoma = entra(tr(t, Tami - 0.2, Tami + 0.5)), rToca = entra(tr(t, Temp - 0.25, Temp + 0.05));
  // el dedo azul: entra por la derecha y hace círculos hasta el final
  const aEntra = entra(tr(t, Tcer + 0.05, Tcer + 0.5));
  const inRojo = 1.45 * su(tr(t, T0 + 0.2, Tsig)) * (1 - su(tr(t, Tcer - 0.2, Tcer + 0.1)));
  const inAzul = 0.4 * su(tr(t, Tapa - 0.3, Tapa)) * (1 - su(tr(t, Ttu - 0.15, Ttu + 0.15)));
  const inFinal = 1.3 * su(tr(t, Temp - 0.05, Temp + 0.25));
  const encoge = 0.6 * Math.min(1, inRojo + inFinal), tiembla = 0.9 * Math.max(0, inRojo + inFinal - 0.3);
  palma(g, cx, cy, s, t, { estilo: AZUL, encoge, tiembla });
  const [rxC, ryC] = enCirculo(t, 15, 0);
  let rx = mez(-500, rxC, rEntra), ry = mez(1250, ryC, rEntra);
  rx = mez(rx, -500, rSale); ry = mez(ry, 1300, rSale);
  let rAng = -0.6;
  if (t > Tsi) {
    const toque = [cx - 120 * s + 14 * Math.sin(t * 20) * inFinal, cy + 40 * s];
    rx = mez(mez(-500, cx - 260 * s, rAsoma), toque[0], rToca); ry = mez(mez(1300, cy + 150 * s, rAsoma), toque[1], rToca);
    rAng = -0.5;
  }
  const [axC, ayC] = enCirculo(t, 15, 2.0);
  const ax = mez(1600, axC, aEntra), ay = mez(1500, ayC, aEntra);
  // las chispas y el humo
  if (t < Tcer) chispas(g, t, rx, ry, inRojo, s * 0.9);
  else chispas(g, t, ax, ay, inAzul, s * 0.9);
  if (inFinal > 0.01) chispas(g, t + 0.2, rx, ry, inFinal, s * 0.9);
  humo(g, ax, ay - 20, tr(t, Ttu - 0.1, Ttu + 0.6), s);
  if (rx > -400) dedo(g, rx, ry, rAng, s * 0.95, ROJO);
  if (ax < 1500) dedo(g, ax, ay, -2.45, s * 0.95, AZUL);
  g.restore();
  vineta(g); velo(g, 0.35);
}
