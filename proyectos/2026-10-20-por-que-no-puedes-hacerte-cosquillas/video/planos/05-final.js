// «No es que no tengas cosquillas: es que tu cerebro ya se sabe el chiste. Envíaselo a ese amigo que se retuerce en
// cuanto le tocas los pies.»
// Vuelta al pie (../pie.js). Corte en «No».
// - «tengas cosquillas»: la pluma de la sudadera roja: el pie se retuerce y saltan chispas.
// - «tu cerebro ya se sabe»: tu pluma (pijama), con un fantasma cian que va por delante por el mismo camino: «chiste», nada.
// - «Envíaselo...»: vuelve la roja; «retuerce»: chispas por toda la pantalla y la cámara se acerca como en el fotograma 0.
import * as k from "#kit";
import { v } from "#voz";
import { velo, vineta, CIAN } from "../mundo.js";
import { hacerMano, escenaPie } from "../pie.js";

export const desde = (v) => v.frase(10).inicio;

const { suave: su, tramo: tr } = k;
const f10 = v.frase(10), f11 = v.frase(11);
const T0 = f10.inicio, Tcos = f10.t("cosquillas"), Tes = f10.t("es", 2), Tchi = f10.t("chiste"), T11 = f11.inicio, Tret = f11.t("retuerce"), Fin = v.duracion;

const roja = hacerMano("roja", { esta: [[T0 - 1, T0 - 0.5, Tes - 0.7, Tes - 0.25], [T11 - 0.3, T11 + 0.15, 99, 100]], barre: [[T0 - 1, Tes - 0.55], [T11, Fin + 1]] });
const tuya = hacerMano("pijama", { esta: [[Tes - 0.3, Tes + 0.1, T11 - 0.55, T11 - 0.15]], barre: [[Tes, T11 - 0.5]] });
const MANOS = [tuya, roja];
const cosquillas = (ts, i) => i === 1 ? roja.barrido(ts) * (0.8 + 0.2 * su(tr(ts, Tret - 0.2, Tret + 0.2))) : 0;
const nivel = (t) => cosquillas(t, 1);

const cam = (t) => { const u = su(tr(t, T11, Fin)); return [Math.exp(k.mez(Math.log(0.72), Math.log(1.5), u)), k.mez(0, -20, u), k.mez(-130, -300, u)]; };

export function dibuja(g, t) {
  const q = Math.max(nivel(t), nivel(t - 0.12));
  escenaPie(g, t, cam(t), MANOS, {
    cosquillas, encoge: q * 0.9, agita: q, retuerce: nivel(t) * su(tr(t, Tret - 0.3, Tret + 0.2)),
    // el fantasma cian de tu pluma: lo que tu cerebro ya sabe, un poco por delante
    extra: (g2, t2) => {
      const al = tuya.barrido(t2) * su(tr(t2, Tes + 0.2, Tchi - 0.3));
      if (al <= 0.01) return;
      for (let i = 1; i <= 6; i++) { const [x, y] = tuya.punta(t2 + i * 0.03); k.brillo(g2, x, y, 300, CIAN, 0.55 * al); }
    },
  });
  vineta(g, 0.5);
  velo(g, 0.5);
}
