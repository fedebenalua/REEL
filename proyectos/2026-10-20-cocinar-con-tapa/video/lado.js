// «¿Sabías que cocinar sin tapa te sube la factura...? Aunque subas el fuego, el agua nunca pasa de cien grados. Todo lo
// que le echas de más se escapa convertido en vapor.»
// Un sitio: la olla de cristal, sin tapa, en su cocina. Una sola cámara que viaja:
// - Fotograma 0: encima del agua, que hierve a lo loco, con la llama rugiendo debajo y el vapor saliendo; la cámara
//   se aleja hasta ver la olla entera y en «factura» sale una fuente de monedas con el vapor.
// - «Aunque»: la cámara entra al agua; llega la sonda con su «100 °C»; «subas»: la llama sube de golpe y el número no
//   se mueve; «cien»: la pastilla late dorada.
// - «Todo lo que le echas de más»: el calor de más sube en brasas por el agua y sale con el vapor; en «vapor», el chorro
//   se lo lleva todo, y la cámara sube con él.
import * as k from "#kit";
import { v } from "#voz";
import { vista, camino2D, fondoCocina, olla, velo, sinVista } from "./mundo.js";

const { tramo: tr, suave: su, claves } = k;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tfactura = f1.t("factura"), Tsubas = f2.t("subas"), Tmax = f2.t("maximo"), Tcien = f2.t("cien");
const Tmas = f3.t("mas"), Tvapor = f3.t("vapor");

export const cam = camino2D([
  [0, [1.7, 540, 850]], [Tfactura + 0.2, [1.1, 540, 960]], [f2.inicio - 0.1, [1.1, 540, 960]],
  [Tsubas + 0.6, [1.4, 560, 1000]], [f3.inicio - 0.05, [1.4, 560, 1000]],
  [Tvapor + 0.4, [0.88, 540, 620]], [f3.fin + 0.2, [0.88, 540, 620]],
]);
const llama = claves([[0, 1.15], [Tsubas - 0.05, 1.15], [Tmax, 1.55], [f3.fin + 1, 1.55]]);
const calor = claves([[0, 0.25], [Tmas, 0.25], [Tvapor, 0.9], [f3.fin + 1, 0.9]]);

export function estado(t) {
  const calma = su(tr(t, f3.fin - 0.15, f3.fin + 0.2));   // antes del corte, lo que se mueve se calma
  return {
    llama: llama(t) * (1 - 0.25 * calma), hierve: 1 - 0.5 * calma, vapor: (0.8 + 0.2 * tr(t, Tsubas, Tmax)) * (1 - 0.6 * calma), brasas: su(tr(t, Tmas - 0.1, Tmas + 0.7)) * (1 - 0.5 * calma),
    calor: calor(t), monedas: { desde: Tfactura - 0.12, hasta: Tfactura + 0.9, n: 34 }, sonda: su(tr(t, f2.inicio + 0.05, f2.inicio + 0.35)),
  };
}

export function dibuja(g, t) {
  const c = cam(t), o = estado(t);
  vista(g, c[0], c[1], c[2]);
  fondoCocina(g, 0.5 + 0.7 * o.llama);
  olla(g, t, o);
  // la sonda y su lectura: 100 °C, quieta aunque la llama sube
  sinVista(g);
  const al = su(tr(t, f2.inicio + 0.25, f2.inicio + 0.6)) * (1 - su(tr(t, Tmas - 0.2, Tmas + 0.1)));
  const late = k.pulso(t, Tcien + 0.05, 0.16);
  k.pastilla(g, 540, 640, "100", "°C", k.mezRgb("255,255,255", "255,214,92", late), al, 118 + 26 * late);
  velo(g, 0.9);
}

export const momentos = { monedas: Tfactura, sube: Tsubas, cien: Tcien, vapor: Tvapor };
