// «En tu misma ciudad, una gasolinera puede cobrarte veinte céntimos más por litro que otra.»
// La calle de noche, con dos gasolineras una frente a otra. Se entra con un corte en «En».
// - «En tu misma ciudad»: las dos, con su tótem a 1,39; la cámara se acerca despacio.
// - «una gasolinera»: la de la derecha se enciende en rojo.
// - «veinte céntimos más»: su precio sube rodando hasta 1,59 y salta «+20 céntimos».
// - «que otra»: la de la izquierda se ilumina en verde. Reposa hasta el corte.
import * as k from "#kit";
import { v } from "#voz";
import { calle, velo, VERDE, ROJO } from "../mundo.js";

export const desde = (vz) => vz.frase(2).inicio;

const { suave: su, tramo: tr, mez } = k;
const f2 = v.frase(2);
const T0 = f2.inicio, Tgas = f2.t("gasolinera"), Tvei = f2.t("veinte"), Tcen = f2.t("centimos"), Totra = f2.t("otra"), Fin = f2.fin;
export const momentos = { rojo: Tgas, sube: Tvei, otra: Totra };

export function dibuja(g, t) {
  const rojo = su(tr(t, Tgas - 0.1, Tgas + 0.4));
  const sube = k.entra(tr(t, Tvei - 0.05, Tvei + 0.6));
  const verde = su(tr(t, Totra - 0.15, Totra + 0.3));
  // la cámara: se acerca despacio y, en «que otra», mira hacia la izquierda
  const esc = mez(1, 1.1, su(tr(t, T0, Fin)));
  const cx = mez(540, 560, rojo) - 50 * verde;
  calle(g, t, {
    esc, cx, cy: 1020,
    pA: 139, cA: VERDE, luzA: 0.55 + 0.45 * verde,
    pB: [1, mez(3, 5, sube), 9], cB: k.mezRgb(VERDE, ROJO, Math.max(rojo, sube)), luzB: 0.55 + 0.45 * rojo,
  });
  k.brillo(g, 810, 900, 1300, ROJO, 0.35 * k.pulso(t, Tvei + 0.55, 0.18));
  k.brillo(g, 250, 900, 1300, VERDE, 0.35 * k.pulso(t, Totra + 0.2, 0.2));
  // «+20 céntimos»
  const p = k.entra(tr(t, Tcen - 0.1, Tcen + 0.2));
  if (p > 0) k.pastilla(g, 540, mez(700, 640, p), "+20", "céntimos/litro", ROJO, p, 104);
  velo(g, 0.55);
}
