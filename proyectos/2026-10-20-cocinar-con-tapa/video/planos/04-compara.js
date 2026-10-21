// «Resultado: hasta un 25 % menos de gas o luz cada vez que cocinas. Así que el secreto no es más fuego: es una tapa.
// Sígueme para más consejos como este.»
// Otro sitio: dos ollas, una al lado de la otra, en la misma cocina. Se entra con un corte en «Resultado».
// - Izquierda, sin tapa: llama grande, vapor y brasas que se escapan. Derecha, con tapa: llama pequeña y todo dentro.
// - «hasta un 25 % menos de gas o luz»: encima de cada olla cae una pila de monedas (lo que gasta): 8 la de sin tapa y 6
//   la de con tapa; en «25», la pastilla «−25 %».
// - «no es más fuego»: la llama de la izquierda se dispara y se va una fuente de monedas con su vapor.
// - «es una tapa»: la cámara se acerca a la de la tapa, que brilla en «tapa».
// - «Sígueme»: la olla con tapa en primer plano, tranquila, con su llama baja y sus seis monedas.
import * as k from "#kit";
import { v } from "#voz";
import { vista, camino2D, fondoCocina, olla, pilaMonedas, velo, sinVista } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;

const { tramo: tr, suave: su, claves } = k;
const f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10);
const T0 = f8.inicio, T25 = f8.t("25"), Tmenos = f8.t("menos"), Tfuego = f9.t("fuego"), Tuna = f9.t("una"), Ttapa = f9.t("tapa");
const XL = 270, XR = 810, ESC = 0.55, YB = 1160;
const Tes = f9.t("fuego") + 0.72;                        // el segundo «es» de la frase

const cam = camino2D([
  [T0, [1.15, 540, 960]], [Tes - 0.05, [1.15, 540, 960]],
  [Ttapa + 0.1, [1.5, 800, 880]], [f10.fin + 1, [1.5, 800, 880]],
]);
// cuándo cae cada moneda: abajo a arriba. 8 a la izquierda, 6 a la derecha, más despacio.
const monedasIzq = Array.from({ length: 8 }, (_, i) => T0 + 0.75 + i * 0.26);
const monedasDer = Array.from({ length: 6 }, (_, i) => T0 + 0.75 + i * 0.34);

const llamaIzq = claves([[T0, 1.2], [Tfuego - 0.1, 1.2], [Tfuego + 0.35, 1.55], [f10.fin + 1, 1.55]]);

export function dibuja(g, t) {
  const c = cam(t);
  vista(g, c[0], c[1], c[2]);
  fondoCocina(g, 0.9);
  // la de sin tapa (izquierda): el calor y las monedas se van con el vapor
  olla(g, t, { x: XL, y: YB, esc: ESC, llama: llamaIzq(t), hierve: 1, vapor: 1, brasas: 1, calor: 0.5, sonda: 0, monedas: t > Tfuego - 0.1 ? { desde: Tfuego - 0.05, hasta: Tfuego + 1.1, n: 22 } : null });
  // la de con tapa (derecha): todo se queda dentro
  olla(g, t, { x: XR, y: YB, esc: ESC, llama: 0.3, hierve: 0.9, vapor: 0.6, brasas: 0.8, calor: 0.7, tapaDy: 0, cubre: 1, niebla: 0.5, gotas: { t0: T0 - 5 }, sonda: 0 });
  // las pilas de monedas, encima de cada olla
  pilaMonedas(g, XL, 735, monedasIzq, t, 66);
  pilaMonedas(g, XR, 735, monedasDer, t, 66);
  // el brillo de la tapa de la derecha cuando la voz la nombra
  const brilla = k.pulso(t, Ttapa + 0.05, 0.22);
  if (brilla > 0.02) { k.brillo(g, XR, 860, 560, "amarilla", 0.7 * brilla); k.brillo(g, XR - 70, 835, 200, "blanca", 0.8 * brilla); }
  // el −25 % entre las dos pilas
  sinVista(g);
  const a = su(tr(t, T25 - 0.02, T25 + 0.25)) * (1 - su(tr(t, f9.t("secreto") + 0.1, f9.t("secreto") + 0.5)));
  const pul = k.pulso(t, Tmenos + 0.05, 0.14);
  if (a > 0.01) k.pastilla(g, 540, 640, "−25", "%", k.mezRgb("120,255,160", "255,255,255", pul), a, 112 + 16 * pul);
  velo(g, 0.85);
}

export const momentos = { menos: Tmenos, fuego: Tfuego, tapa: Ttapa };
