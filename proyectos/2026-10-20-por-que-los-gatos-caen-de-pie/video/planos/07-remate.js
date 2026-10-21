// «Así que no es magia: es un nivel en el oído y un cuerpo que gira por mitades.»
// El vacío azul otra vez, con el gato boca arriba. Se entra con un corte en «Así».
// - «no es magia»: el gato cae boca arriba, despacio, pataleando.
// - «un nivel en el oído»: en su oído se enciende el nivel, con la burbuja en un extremo; la cabeza gira hacia el
//   suelo y la burbuja vuelve al centro.
// - «un cuerpo que gira por mitades»: gira la mitad de delante (naranja) y luego la de atrás (azul); queda de pie y
//   quieto antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { gato, laberinto, medir, vacio, vuelta, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio;

const { suave: su, tramo: tr, mez } = k;
const f9 = v.frase(9);
const Tniv = f9.t("nivel"), Toido = f9.t("oido"), Tgira = f9.t("gira"), Tmit = f9.t("mitades"), Fin = f9.fin;

// la vuelta: la cabeza con el oído, luego las dos mitades
const uDe = (t) => 0.13 * su(tr(t, Toido - 0.2, Toido + 0.5)) + 0.87 * tr(t, Tgira - 0.15, Tmit + 0.55);

export function dibuja(g, t) {
  vacio(g, t, 0.5, 40);
  const u = uDe(t), st = vuelta(u);
  const luzF = su(tr(t, Tgira - 0.2, Tgira + 0.1)) * (1 - su(tr(t, Tmit, Tmit + 0.4)));
  const luzA = su(tr(t, Tmit - 0.25, Tmit)) * (1 - su(tr(t, Tmit + 0.45, Tmit + 0.8)));
  const e = { x: 445, y: 980, esc: 330, ang: -0.1 * (1 - su(tr(t, Tgira, Tmit + 0.5))), t, ...st, luzF, luzA, patalea: 0.5 * (1 - su(tr(t, Tgira - 0.4, Tgira))) };
  const r = gato(g, e);
  // el nivel del oído, encima de la cabeza
  const al = su(tr(t, Tniv - 0.15, Tniv + 0.2)) * (1 - su(tr(t, Tgira + 0.1, Tgira + 0.5)));
  if (al > 0.01) {
    const c = su(tr(t, Toido - 0.2, Toido + 0.5));
    g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, r.oido[0], r.oido[1], 500, "255,210,120", 0.5 * al); g.restore();
    laberinto(g, r.oido[0] - 20, r.oido[1] - 40, 190, (Math.PI + 0.2) * (1 - c), 1, al, t);
  }
  vineta(g, 0.45);
  velo(g, 0.45);
}
