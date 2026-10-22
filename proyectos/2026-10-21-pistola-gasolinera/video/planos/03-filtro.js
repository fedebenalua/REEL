// «Si sigues apretando, llenas el hueco que el depósito guarda para los vapores.»
// «Y la gasolina se mete en el filtro de carbón del coche, que solo aguanta vapor.»
// «Se empapa, se estropea, y cambiarlo cuesta cientos de euros.»
// El coche en corte (otro sitio: se entra con un corte en «Si»):
// - «Si sigues apretando»: la pistola en la boca, el gatillo apretado y la gasolina que sigue entrando; el depósito,
//   con su hueco azul de vapores arriba. «llenas el hueco»: la gasolina sube y se come el hueco; los vapores salen
//   apretados por el tubo de arriba.
// - «Y la gasolina se mete»: la cámara sigue el tubo hasta el filtro (granos de carbón con el vapor azul pegado); la
//   gasolina dorada sube por el tubo y entra. «solo aguanta vapor»: el carbón se ahoga.
// - «Se empapa»: lleno de gasolina; «se estropea»: se agrieta y se enciende en rojo; «cientos de euros»: 200-500 €.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";
import { escena } from "../escena.js";

export const desde = (vz) => vz.frase(7).inicio;

const { suave: su, tramo: tr, mez, entra } = k;
const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9);
const T0 = f7.inicio, Tapr = f7.t("apretando"), Thue = f7.t("hueco"), Tvap = f7.t("vapores");
const T8 = f8.inicio, Tmet = f8.t("mete"), Tfil = f8.t("filtro"), Tsol = f8.t("solo"), Tvap2 = f8.t("vapor");
const Temp = f9.t("empapa"), Test = f9.t("estropea"), Tcie = f9.t("cientos"), Fin = f9.fin;

const cam = m.camino2D([
  [T0 - 0.1, [0.8, 1110, -700]],
  [Thue, [0.98, 1330, -560]],
  [Tvap + 0.2, [1.02, 1380, -560]],
  [T8 + 0.1, [1.02, 1400, -560]],
  [Tfil, [1.9, 1960, -650]],
  [Tsol, [2.1, 2020, -650]],
  [Test, [2.3, 2030, -640]],
  [Fin + 0.1, [2.45, 2030, -620]],
]);

export function dibuja(g, t) {
  const c = cam(t);
  const llena = su(tr(t, Tapr, Tvap + 0.1));
  const liq = su(tr(t, T8 + 0.1, Tfil + 0.35));
  const empapa = 0.55 * su(tr(t, Tfil + 0.3, Tvap2 + 0.3)) + 0.45 * su(tr(t, Temp - 0.1, Temp + 0.6));
  const roto = entra(tr(t, Test - 0.05, Test + 0.5));
  const fluye = su(tr(t, Tapr - 0.1, Tapr + 0.1)) * (1 - su(tr(t, Tvap2, Tvap2 + 0.3)));
  escena(g, t, c, {
    cuello: { nivel: m.METIDO - 22, agita: 0.5 + 0.5 * fluye }, chorro: fluye,
    deposito: { nivel: mez(0.7, 1.02, llena), hueco: 1 - llena, agita: fluye },
    tubo: { liquido: liq, vapor: 0.6 + 0.4 * su(tr(t, Thue, Tvap)) - 0.9 * liq },
    filtro: { empapa, roto, gotas: 1 - su(tr(t, Fin - 1, Fin - 0.4)), vapor: (0.6 + 0.4 * su(tr(t, Thue, Tvap))) * (1 - empapa) },
    pistola: { flujo: fluye, gatillo: fluye, valvula: fluye },
    despues: (g) => {
      // el hueco del depósito, iluminado en «hueco»
      const D = m.DEPOSITO, yS = mez(D.y1, D.y0, mez(0.7, 1.02, llena));
      const p = k.pulso(t, Thue + 0.15, 0.3);
      if (p > 0.02 && yS > D.y0) { g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(${m.VAPOR},${0.35 * p})`; k.redondo(g, D.x0, D.y0, D.x1 - D.x0, yS - D.y0, 40); g.fill(); g.restore(); }
    },
  });
  // «cientos de euros»: la cifra llega y se queda
  const ap = entra(tr(t, Tcie - 0.1, Tcie + 0.25));
  if (ap > 0.01) k.pastilla(g, 540, mez(1420, 1300, ap), "200-500", "€", "255,120,100", ap, 120);
}
