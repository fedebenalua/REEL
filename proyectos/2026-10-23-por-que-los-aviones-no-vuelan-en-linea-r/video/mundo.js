// Lo que comparten los planos: la Tierra (mapa y bola), la ruta Madrid–Nueva York, el avión y sus sombras, y la cámara
// del mapa, que pasa de mapa plano a bola con la voz.
import * as k from "#kit";
import { v } from "#voz";
import * as geo from "./geo.js";
import { dibujaAvion, desdeArriba } from "./avion.js";

export const { suave, tramo, mez, claves, curva } = k;
export const lim = (x, a, b) => Math.max(a, Math.min(b, x));

// ---------------------------------------------------------------- las ciudades y las rutas
export const MADRID = geo.punto(-3.7038, 40.4168);
export const NUEVAYORK = geo.punto(-73.7781, 40.6413);
export const LONDRES = geo.punto(-0.4543, 51.47);
export const GC = geo.circuloMaximo(MADRID, NUEVAYORK, 240);   // el camino más corto
export const RUMBO = geo.rumbo(MADRID, NUEVAYORK, 240);          // la «recta» del mapa
export const KM_GC = 5762, KM_RUMBO = 5932; // FlyDirectFrom: círculo máximo y rumbo constante
// el punto más al norte del camino más corto: el centro de la bola y del mapa
export const APICE = GC.reduce((m, p) => (p.phi > m.phi ? p : m), GC[0]);
export const LON_C = APICE.lam / geo.D, LAT_C = APICE.phi / geo.D;
export const N = GC.length - 1;

// ---------------------------------------------------------------- tiempos de la voz
const f = (n) => v.frase(n);
export const T = {
  recta: f(1).t("recta"), madrid: f(2).t("madrid"), york: f(2).t("york"), altura: f(2).t("altura"), sube: f(2).t("sube"), curva: f(2).t("curva"),
  enorme: f(2).t("enorme"), perdido: f(3).t("perdido"), nada: f(4).t("nada"), esa: f(4).t("esa"), recta4: f(4).t("recta"),
  tierra: f(5).t("tierra"), bola: f(5).t("bola"), mapa: f(5).t("mapa"), plano: f(5).t("plano"),
  f6: f(6).inicio, arco: f(6).t("arco"), hilo: f(7).t("hilo"), tenso: f(7).inicio, globo: f(7).t("globo"), york7: f(7).t("york"), sube7: f(7).t("sube"), avion7: f(7).t("avion"),
  f8: f(8).inicio, mapa8: f(8).t("mapa"), rodeo: f(8).t("rodeo"), ciento: f(8).t("ciento"), setenta: f(8).t("setenta"), mas: f(8).t("mas"),
  f9: f(9).inicio, f10: f(10).inicio, f11: f(11).inicio, f12: f(12).inicio, f13: f(13).inicio,
};

// ---------------------------------------------------------------- la cámara del mapa (la Tierra, de plano a bola y vuelta)
// El avión va por la ruta: cuánto ha recorrido (0 a 1) en cada segundo.
export const avance = curva([[0, 0], [3.0, 0.16], [T.sube, 0.34], [T.enorme + 0.3, 0.7], [T.perdido + 1.05, 1]], 0.045, 0);
const unaPos = (i) => { const j = lim(Math.floor(i), 0, N - 1); return geo.entre(GC[j], GC[j + 1], lim(i - j, 0, 1)); };

// La hoja se hace bola en «recta» (la curva se endereza), vuelve a ser plana en «plano» y otra vez bola en «arco».
export const uBola = (t) => {
  if (t < 14.55) return suave(tramo(t, 10.15, 12.3));
  if (t < 16.45) return 1 - suave(tramo(t, 14.55, 15.95));
  return suave(tramo(t, 16.45, 18.25));
};
// cuánto ha girado la bola alrededor de su eje (grados)
export const giro = (t) => 140 * suave(tramo(t, 12.55, 14.5)) * (1 - suave(tramo(t, 14.6, 15.95)));
// el tamaño de la bola: se acerca (hasta ser un trozo de mundo) para ver el hilo
export const radio = (t) => mez(440, 920, suave(tramo(t, 18.75, 19.75)));

export function vistaMapa(t) {
  const u = uBola(t);
  // el hook: la cámara persigue al avión y se aleja hasta ver Madrid y Nueva York
  const w = suave(tramo(t, 0, 3.6));
  const p = unaPos(avance(Math.min(t, 3.6)) * N);
  const lon0 = mez(p.lam / geo.D + 0.8, LON_C, w) + giro(t), lat0 = mez(p.phi / geo.D, LAT_C, w) - 3 * suave(tramo(t, 18.75, 19.75));
  const s = Math.exp(curva([[0, Math.log(2200)], [1.7, Math.log(1550)], [3.7, Math.log(760)]], undefined, 0)(Math.min(t, 3.7)));
  return geo.vista({ lon0, lat0, s, R: radio(t), u, cx: 540, cy: 1010 - 20 * suave(tramo(t, 18.75, 19.75)) });
}

// ---------------------------------------------------------------- dibujar el mapa y el avión
export function velo(g, al = 0.72, alto = 700) {
  if (al <= 0.01) return;
  g.save();
  const vg = g.createLinearGradient(0, 0, 0, alto);
  vg.addColorStop(0, `rgba(2,8,28,${al})`); vg.addColorStop(0.55, `rgba(2,8,28,${al * 0.7})`); vg.addColorStop(1, "rgba(2,8,28,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, alto);
  g.restore();
}

// El avión sobre un mapa (o una bola): visto desde arriba, con su sombra en el mar.
export function avionEnMapa(g, V, rutaPts, i, tam, { alabeo = 0, al = 1, elev = 1.2 } = {}) {
  const P = geo.sobreRuta(V, rutaPts, i);
  if (V.u > 0.0005 && !P.vis) return P;
  const Rm = desdeArriba(P.ang, elev, alabeo);
  dibujaAvion(g, P.x, P.y, tam, Rm, { sombra: { dx: tam * 0.06, dy: tam * 0.13, al: 0.32 * al }, al });
  return P;
}
