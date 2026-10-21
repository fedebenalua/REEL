// «¿Por qué no puedes hacerte cosquillas a ti mismo? Si te las hace otro, te mueres de risa. Si te las haces tú, nada.»
// El pie, con una sola cámara (el sitio, en ../pie.js).
// - Fotograma 0: la pluma ya barre la planta del pie, los dedos se encogen y saltan chispas de oro y rosa; en
//   «cosquillas», la lluvia más fuerte.
// - «a ti mismo»: la cámara se aleja y se ve quién sujeta la pluma: tu mano, con el pijama; las chispas se apagan y los
//   dedos se relajan.
// - «otro»: entra por la izquierda la mano de la sudadera roja con su pluma; «mueres de risa»: el pie se retuerce y
//   revientan las chispas. «tú»: la roja se va y la tuya hace lo mismo: «nada», ni una chispa.
import * as k from "#kit";
import { v } from "#voz";
import { velo, vineta } from "../mundo.js";
import { hacerMano, escenaPie } from "../pie.js";

export const desde = 0;

const { suave: su, tramo: tr, pulso } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tcos = f1.t("cosquillas"), Tti = f1.t("ti"), Tmis = f1.t("mismo");
const Totro = f2.t("otro"), Tmue = f2.t("mueres"), Trisa = f2.t("risa"), Tsi2 = f2.t("si", 2), Ttu = f2.t("tu"), Tnada = f2.t("nada"), Fin = v.frase(3).inicio;

// la tuya: barre desde el fotograma 0; se aparta en «otro» y vuelve en «haces»
const tuya = hacerMano("pijama", {
  esta: [[-1, -0.5, Totro - 0.45, Totro - 0.05], [Tsi2 - 0.1, Ttu - 0.1, 99, 100]],
  barre: [[-1, Tti + 0.35], [Ttu - 0.15, Tnada + 0.45]],
});
const roja = hacerMano("roja", { esta: [[Totro - 0.5, Totro - 0.05, Tsi2 - 0.2, Tsi2 + 0.25]], barre: [[Totro - 0.1, Tsi2]] });
const MANOS = [tuya, roja];

// cuántas chispas: con la tuya, solo hasta que se ve que es tuya; con la roja, todas (más en «risa»)
const cosquillas = (ts, i) => i === 0 ? tuya.barrido(ts) * (1 - su(tr(ts, Tti - 0.1, Tmis))) : roja.barrido(ts) * (0.75 + 0.25 * su(tr(ts, Tmue, Trisa)));
const nivel = (t) => Math.max(cosquillas(t, 0), cosquillas(t, 1));

const cam = (t) => {
  const aleja = su(tr(t, Tti - 0.05, Tmis + 0.45)), llega = k.entra(tr(t, 0, 0.8));
  return [Math.exp(k.mez(Math.log(k.mez(2.1, 1.5, llega)), Math.log(0.72), aleja)), k.mez(-20, 0, aleja), k.mez(-300, -130, aleja)];
};

export function dibuja(g, t) {
  const q = nivel(t), q2 = nivel(t - 0.12);
  escenaPie(g, t, cam(t), MANOS, {
    cosquillas,
    encoge: Math.max(q, q2) * 0.9,
    agita: Math.max(q, q2),
    retuerce: cosquillas(t, 1) * (0.4 + 0.6 * su(tr(t, Tmue - 0.2, Trisa))),
  });
  // «nada»: el pie se queda quieto y la escena se enfría un poco
  const frio = su(tr(t, Tnada - 0.2, Tnada + 0.3));
  if (frio > 0) { g.fillStyle = `rgba(20,30,60,${0.22 * frio})`; g.fillRect(0, 0, 1080, 1920); }
  vineta(g, 0.5);
  velo(g, 0.5);
}

export const momentos = { cosquillas: Tcos, risa: Trisa, nada: Tnada, fin: Fin };
