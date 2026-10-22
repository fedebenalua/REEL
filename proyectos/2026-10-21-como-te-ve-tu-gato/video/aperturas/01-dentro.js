// La otra apertura del hook (sustituye a planos/01-ojo.js).
// «¿Cómo te ve tu gato cuando te mira?»: desde el fotograma 0 estamos dentro de la pupila de tu gato, viéndote a ti,
// enorme, con la mano tendida; la cámara sale disparada hacia atrás por la pupila, que se cierra en raja, hasta ver su
// cara entera en «gato». En «mira» la pupila se abre de golpe y la cámara vuelve a lanzarse dentro (sigue 02-salon).
import * as k from "#kit";
import { v } from "#voz";
import { ancla, cara, enPupila, ESC_DENTRO, fondoCasa, OJOS } from "../mundo.js";
import { vistaGato } from "../salon.js";

export const desde = 0;

const { suave: su, tramo: tr, mez } = k;
const f1 = v.frase(1);
const Tgato = f1.t("gato"), Tcuando = f1.t("cuando"), Tmira = f1.t("mira"), Tpara = v.frase(2).inicio;
const OJO = OJOS[0], CARA = [0, 110];
const Tdive = Tmira + 0.12, Tdentro = Tpara - 0.1, Tsale = Tgato + 0.15;

function camara(t) {
  if (t <= Tdive) {
    const u = tr(t, 0.28, Tsale + 0.1), w = su(u);
    const esc = Math.exp(mez(Math.log(ESC_DENTRO), Math.log(0.92), w) + Math.log(1.05 / 0.92) * su(tr(t, Tsale, Tdive)));
    return { esc, F: [mez(OJO[0], CARA[0], su(tr(u, 0.35, 1))), mez(OJO[1], CARA[1], su(tr(u, 0.35, 1)))] };
  }
  const u = tr(t, Tdive, Tdentro), w = Math.pow(u, 2.2);
  return { esc: Math.exp(mez(Math.log(1.05), Math.log(ESC_DENTRO), w)), F: [mez(CARA[0], OJO[0], su(Math.min(1, u * 1.6))), mez(CARA[1], OJO[1], su(Math.min(1, u * 1.6)))] };
}

export function dibuja(g, t) {
  fondoCasa(g);
  const { esc, F } = camara(t);
  const [x, y] = ancla(esc, F);
  // la pupila: redonda dentro, se cierra en raja al salir, y se abre otra vez en «mira»
  const pupila = t < Tmira - 0.05 ? mez(1, 0.3, su(tr(t, 0.35, Tsale + 0.1))) : mez(0.3, 1, su(tr(t, Tmira - 0.05, Tmira + 0.18)));
  const tieso = su(tr(t, Tcuando - 0.1, Tcuando + 0.25));
  const vela = t < Tdive ? su(tr(t, 0.28, 0.45)) : 1 - su(tr(t, Tdentro - 0.12, Tdentro));
  cara(g, t, x, y, esc, {
    pupila, orejas: [mez(0.2, -0.08, tieso) + 0.06 * k.pulso(t, Tcuando + 0.3, 0.12), mez(0.2, -0.08, tieso)],
    dentro: (c, px, py) => enPupila(c, px, py, (caja) => vistaGato(c, t, { caja, saluda: t < Tsale ? t + 0.3 : 0 }), vela),
    cornea: 1 - tr(esc, 3, 7),
  });
  if (t < 0.28) vistaGato(g, t, { Z: 1 + 0.04 * t / 0.28, saluda: t + 0.3 }); else if (t > Tdentro) vistaGato(g, t, {});
}
