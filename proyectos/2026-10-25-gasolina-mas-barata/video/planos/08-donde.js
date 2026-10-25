// «...importa dónde.» y «Sígueme para más trucos, o envíaselo a ese amigo que siempre llena en la autopista.»
// La calle de las dos gasolineras otra vez. Se entra con un corte en «importa» (la segunda).
// - «importa dónde»: cerca de la gasolinera verde (1,39); en «dónde» le cae encima una chincheta verde, que rebota.
// - «Sígueme para más trucos»: la cámara se aleja despacio hasta ver las dos, la verde y la roja (1,59).
// - «ese amigo que siempre llena en la autopista»: la roja se enciende, con un golpe de luz roja. Reposa hasta el final.
import * as k from "#kit";
import { v } from "#voz";
import { calle, chincheta, velo, VERDE, ROJO } from "../mundo.js";

export const desde = (vz) => vz.frase(8).t("importa", 2);

const { suave: su, tramo: tr, mez } = k;
const f8 = v.frase(8), f9 = v.frase(9);
const T0 = f8.t("importa", 2), Tdon = f8.t("donde"), Fin8 = f8.fin, Tsig = f9.inicio, Tami = f9.t("amigo"), Taut = f9.t("autopista"), Fin9 = f9.fin;
const Tcae = Tdon - 0.1;
export const momentos = { pin: Tcae + 0.3, roja: Taut };

export function dibuja(g, t) {
  const aleja = su(tr(t, Fin8 - 0.2, Tami + 0.3));
  const esc = mez(1.4, 1.0, aleja), cx = mez(300, 540, aleja), cy = mez(1080, 1020, aleja);
  const roja = su(tr(t, Taut - 0.1, Taut + 0.3));
  // la chincheta: cae sobre el tótem verde y rebota
  const u = tr(t, Tcae, Tcae + 0.55);
  const rebote = u <= 0 ? -1400 : -900 * Math.pow(1 - k.entra(Math.min(1, u / 0.55)), 2) - 60 * Math.abs(Math.sin(u * Math.PI * 2)) * (1 - u);
  calle(g, t, {
    esc, cx, cy,
    pA: 139, cA: VERDE, luzA: 1,
    pB: 159, cB: ROJO, luzB: 0.55 + 0.45 * roja,
    despues: (c) => {
      if (u > 0) { chincheta(c, 270, 830 + rebote, 1.2, VERDE); k.brillo(c, 270, 750 + rebote, 600, VERDE, 0.6 * Math.min(1, u * 3)); }
    },
  });
  // el golpe al llegar
  const px = 540 + (270 - cx) * esc, py = 1000 + (830 - cy) * esc;
  k.brillo(g, px, py, 1400, VERDE, 0.5 * k.pulso(t, Tcae + 0.45, 0.15));
  k.brillo(g, 540 + (810 - cx) * esc, 900, 1300, ROJO, 0.5 * k.pulso(t, Taut + 0.2, 0.18));
  velo(g, 0.55);
}
