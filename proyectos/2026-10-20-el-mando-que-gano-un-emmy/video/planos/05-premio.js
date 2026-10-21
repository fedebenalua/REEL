// «…y en 1997 sus inventores se llevaron un Emmy.»
// La gala otra vez. Se entra con un corte en «en».
// - «1997»: la cifra, y dos focos que se encienden; «sus inventores»: bajo cada foco, una estatuilla dorada que sube;
//   «Emmy»: brillan las dos y cae el confeti.
import * as k from "#kit";
import { v } from "#voz";
import { camara, confeti, escenario, estatuilla, CAM0 } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f5 = v.frase(5);
export const desde = (vz) => vz.frase(5).t("en");
const T0 = f5.t("en"), Tano = f5.t("1997"), Tinv = f5.t("inventores"), Temm = f5.t("emmy"), Fin = v.frase(6).inicio;

export function dibuja(g, t) {
  g.save(); camara(g, { Z: 1.05 + 0.05 * su(tr(t, T0, Fin)), F: { x: 540, y: 1020 } });
  escenario(g, t, { foco: 0 });
  // los dos focos
  for (const [fx, d] of [[330, 0], [750, 0.15]]) {
    const al = su(tr(t, Tano - 0.1 + d, Tano + 0.1 + d));
    g.save(); g.globalCompositeOperation = "lighter";
    const cg = g.createLinearGradient(0, 0, 0, 1360); cg.addColorStop(0, `rgba(255,240,200,${0.05 * al})`); cg.addColorStop(1, `rgba(255,240,200,${0.25 * al})`);
    g.fillStyle = cg; g.beginPath(); g.moveTo(fx - 50, 200); g.lineTo(fx + 50, 200); g.lineTo(fx + 230, 1360); g.lineTo(fx - 230, 1360); g.closePath(); g.fill();
    g.restore();
    const sube = entra(tr(t, Tinv - 0.2 + d, Tinv + 0.3 + d));
    if (sube > 0) estatuilla(g, fx, mez(1700, 1330, sube), 560, t, 0.6 * k.pulso(t, Temm + 0.1, 0.25));
  }
  confeti(g, t, Temm - 0.2, su(tr(t, Temm - 0.2, Temm)));
  g.restore();
  k.pastilla(g, 540, 640, "1997", "", "255,215,140", su(tr(t, Tano - 0.1, Tano + 0.2)), 110);
  const vg = g.createLinearGradient(0, 200, 0, 560); vg.addColorStop(0, "rgba(10,4,12,0.55)"); vg.addColorStop(1, "rgba(10,4,12,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 560);
}

export const momentos = { emmy: Temm };
