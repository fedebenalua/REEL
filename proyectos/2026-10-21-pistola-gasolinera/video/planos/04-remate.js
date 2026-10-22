// «Así que no hay ningún cable: la propia gasolina cierra la pistola. En el primer clac, para.»
// Se vuelve a la pistola de cristal metida en el coche (corte en «Así»):
// - «no hay ningún cable»: la cámara recorre la pistola de cristal del cuerpo a la punta: tubos y gasolina, nada más.
// - «la propia gasolina»: la gasolina sube por el cuello; «cierra»: tapa la punta y clac, fogonazo, el chorro se para.
// - «En el primer clac, para»: el gatillo se suelta y la pistola sale de la boca.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";
import { escena } from "../escena.js";

export const desde = (vz) => vz.frase(10).inicio;

const { suave: su, tramo: tr, mez, entra } = k;
const f = v.frase(10);
const T0 = f.inicio, Tcab = f.t("cable"), Tpro = f.t("propia"), Tcie = f.t("cierra"), Ten = f.t("en"), Tpar = f.t("para"), Fin = f.fin;
const Tclac = Tcie + 0.05;
const pis = (x, y) => { const p = m.dePistola({ x, y }); return [p.x, p.y]; };
const NIV_TAPA = m.METIDO - 22;

const cam = m.camino2D([
  [T0 - 0.1, [2.5, ...pis(-150, -20)]],
  [Tcab + 0.3, [2.7, ...pis(20, 10)]],
  [Tpro + 0.1, [3.6, m.PUNTA.x + 10, m.PUNTA.y + 30]],
  [Tclac + 0.4, [3.4, m.PUNTA.x, m.PUNTA.y + 10]],
  [Ten, [3.2, m.PUNTA.x - 20, m.PUNTA.y - 10]],
  [Tpar + 0.5, [1.45, pis(-60, 20)[0] - 150, pis(-60, 20)[1] - 140]],
  [Fin + 0.2, [1.43, pis(-60, 20)[0] - 150, pis(-60, 20)[1] - 140]],
]);

export function dibuja(g, t) {
  const c = cam(t);
  const fluye = 1 - su(tr(t, Tclac - 0.02, Tclac + 0.05));
  const nivel = mez(330, NIV_TAPA, Math.pow(tr(t, T0 + 0.6, Tclac), 1.2));
  const cierra = entra(tr(t, Tclac - 0.04, Tclac + 0.05));
  const sale = 230 * su(tr(t, Tpar - 0.1, Tpar + 0.45));
  escena(g, t, c, {
    cuello: { nivel, agita: 0.3 + 0.7 * fluye }, chorro: sale > 1 ? 0 : fluye,
    deposito: { nivel: 0.9, hueco: 0.6 },
    manguera: { corre: fluye, sale },
    pistola: { flujo: fluye, aire: 1 - cierra, gatillo: 1 - cierra, muelle: cierra, membrana: 0.6 * cierra, valvula: 1 - cierra, sale },
  });
  const [Z, cx, cy] = c;
  m.destello(g, 540 + (m.PUNTA.x - cx) * Z, 960 + (m.PUNTA.y - cy) * Z, 0.9 * k.pulso(t, Tclac + 0.03, 0.07), "255,236,190");
}
