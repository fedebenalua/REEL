// «¿Cómo te ve tu gato cuando te mira?»
// - Fotograma 0: pegados al ojo de tu gato, ámbar y verde, con la pupila en raja; la cámara se aleja deprisa hasta ver
//   la cara entera en «gato».
// - «cuando te mira»: levanta las orejas hacia ti y en «mira» la pupila se abre de golpe, redonda; dentro se ve el
//   salón contigo. La cámara se lanza dentro de la pupila hasta que lo que hay dentro llena la pantalla (sigue en
//   02-salon, sin corte).
import * as k from "#kit";
import { v } from "#voz";
import { ancla, cara, enPupila, ESC_DENTRO, fondoCasa, OJOS } from "../mundo.js";
import { vistaGato } from "../salon.js";

export const desde = 0;

const { suave: su, tramo: tr, mez } = k;
const f1 = v.frase(1);
const Tgato = f1.t("gato"), Tcuando = f1.t("cuando"), Tmira = f1.t("mira"), Tpara = v.frase(2).inicio;
const OJO = OJOS[0], CARA = [0, 110];
const Tdive = Tmira + 0.1, Tdentro = Tpara - 0.2;

// la escala (en log) y adónde mira la cámara
const escLog = k.claves([[0, Math.log(7.5)], [Tgato + 0.2, Math.log(0.92)], [Tdive, Math.log(1.05)]]);
export function camara(t) {
  if (t <= Tdive) {
    const u = su(tr(t, 0.05, Tgato + 0.2));
    return { esc: Math.exp(escLog(t)), F: [mez(OJO[0], CARA[0], u), mez(OJO[1], CARA[1], u)] };
  }
  const u = tr(t, Tdive, Tdentro), w = Math.pow(u, 2.2);
  return { esc: Math.exp(mez(Math.log(1.05), Math.log(ESC_DENTRO), w)), F: [mez(CARA[0], OJO[0], su(Math.min(1, u * 1.6))), mez(CARA[1], OJO[1], su(Math.min(1, u * 1.6)))] };
}

export function dibuja(g, t) {
  fondoCasa(g);
  const { esc, F } = camara(t);
  const [x, y] = ancla(esc, F);
  const pupila = mez(0.3, 1, su(tr(t, Tmira - 0.05, Tmira + 0.18)));
  const tieso = su(tr(t, Tcuando - 0.1, Tcuando + 0.25));
  cara(g, t, x, y, esc, {
    pupila, orejas: [mez(0.2, -0.08, tieso) + 0.06 * k.pulso(t, Tcuando + 0.3, 0.12), mez(0.2, -0.08, tieso)],
    dentro: (c, px, py) => enPupila(c, px, py, (caja) => vistaGato(c, t, { caja }), 1 - su(tr(t, Tdentro - 0.12, Tdentro))),
    cornea: 1 - tr(esc, 3, 7),
  });
  // dentro de la pupila, al final, solo se ve el salón
  if (t > Tdentro) vistaGato(g, t, {});
}
