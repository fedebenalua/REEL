// «Envíaselo a ese amigo que siempre llega a fin de mes con la cuenta a cero.»
// Vuelta al bar. Corte en «Envíaselo». La taza en la barra, con la cafetera encima echando café; al lado, la cartera
// abierta y vacía; una hormiga se lleva la última moneda y, en «cero», «0,00 €» en rojo. La cámara sube despacio hacia la
// cafetera, como al empezar.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, bar, barra, taza, cafetera, cartera, hormiga, moneda, velo, vineta, ROJO } from "../mundo.js";

export const desde = (v) => v.frase(8).inicio;

const { suave: su, tramo: tr, mez } = k;
const f8 = v.frase(8);
const T0 = f8.inicio, Tami = f8.t("amigo"), Tfin = f8.t("fin"), Tcero = f8.t("cero"), Dur = v.duracion;

export function dibuja(g, t) {
  bar(g, t);
  const u = su(tr(t, T0, Dur));
  vista(g, mez(0.95, 1.1, u), mez(-200, -120, u), mez(-60, -160, u));
  barra(g, 0);
  // la cartera vacía, a la izquierda
  g.save(); g.translate(-480, 230); g.scale(0.75, 0.75); cartera(g, { billetes: 0 }); g.restore();
  // la hormiga que se lleva la última moneda, de la cartera hacia la derecha
  const a = tr(t, T0 + 0.2, Tcero), x = mez(-420, 330, a);
  if (t < Dur) hormiga(g, x, 150, 1.5, t * 18, (c) => moneda(c, 0, -6, 30, 0.1, 1));
  // la taza y la cafetera
  taza(g, t, { humo: 1 });
  g.save(); g.translate(0, -340); cafetera(g); g.restore();
  sinVista(g);
  const p = su(tr(t, Tcero - 0.1, Tcero + 0.15));
  if (p > 0.01) { const s = 1 + 0.25 * k.pulso(t, Tcero + 0.05, 0.12); g.save(); g.translate(540, 1330); g.scale(s, s); k.pastilla(g, 0, 0, "0,00 €", "", ROJO, p, 130); g.restore(); }
  vineta(g, 0.5);
  velo(g, 0.5);
}
