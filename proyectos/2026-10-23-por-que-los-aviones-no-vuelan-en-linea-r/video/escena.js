// La Tierra del principio al «Pero hay más»: el mapa con el avión (hook), la bola que lo endereza, el mapa otra vez, la
// bola con su hilo y los dos caminos. Una sola cámara continua que va del mapa a la bola con la voz.
import * as k from "#kit";
import * as geo from "./geo.js";
import { avance, GC, RUMBO, MADRID, NUEVAYORK, N, T, vistaMapa, velo, avionEnMapa, suave, tramo, mez, lim, KM_GC, KM_RUMBO } from "./mundo.js";
const fmt = k.fmt;

// Los segundos de esta parte
const T_CRECE0 = T.hilo - 0.1, T_CRECE1 = T.york7 + 0.45;       // el hilo sale de Madrid y llega a Nueva York
const T_TENSA0 = T.globo + 0.55, T_TENSA1 = T.sube7 + 0.75;      // se tensa y sube
const T_AVION0 = T.avion7 - 0.05, T_AVION1 = T.f8 + 1.0;         // el avión va por el hilo
const T_RAYAS = T.f8 + 0.12;                                      // vuelve la recta del mapa
const T_KM_GC = T.f8 + 0.95, T_KM_RUMBO = T.mapa8 + 0.1, T_170 = T.ciento - 0.05;

function hiloVibrando(t) {
  const w = suave(tramo(t, T_TENSA0, T_TENSA1));
  const base = geo.mezclaRutas(RUMBO, GC, w);
  const dt = t - T_TENSA1;
  if (dt <= 0) return base;
  const A = 0.012 * Math.exp(-dt * 5.5) * Math.cos(dt * 38);
  if (Math.abs(A) < 0.0004) return base;
  return base.map((p, i) => geo.entre(p, { lam: p.lam, phi: p.phi + A * Math.sin((Math.PI * i) / N) }, 1));
}

export function escenaMapa(g, t) {
  const V = vistaMapa(t);
  geo.fondoMar(g, V, t);
  geo.dibujaTierra(g, V, t);

  // la «recta» del mapa: de rayas, desde el principio; se apaga mientras se enseña el hilo y vuelve en «recta del mapa»
  const alRayas = t < 20 ? 1 - suave(tramo(t, 18.75, 19.2)) : suave(tramo(t, T_RAYAS, T_RAYAS + 0.4));
  geo.lineaRayas(g, V, RUMBO, "255,255,255", t > 20 ? 9 : 8, lim(alRayas, 0, 1), 36, 28, 0, N, 0);

  // el camino del avión: el rastro hasta donde ha llegado, y entero después; se apaga cuando aparece el hilo
  const iAv = t < 9.6 ? avance(t) * N : N;
  const alRuta = (1 - suave(tramo(t, 18.75, 19.2))) * (t < 20 ? 1 : 0);
  geo.lineaLuz(g, V, GC, "255,164,48", 11, alRuta, 0, iAv);
  // en «arco», el camino late un momento
  if (t > T.arco - 0.2 && t < T.arco + 0.9) {
    const b = Math.exp(-Math.pow((t - T.arco - 0.15) / 0.28, 2));
    geo.lineaLuz(g, V, GC, "255,230,160", 16, 0.9 * b, 0, N, false);
  }

  // el hilo: sale de Madrid siguiendo la recta del mapa, se tensa y sube hasta el camino más corto
  if (t > T_CRECE0 && t < 28.6) {
    const crece = suave(tramo(t, T_CRECE0, T_CRECE1));
    const pts = hiloVibrando(t);
    const glow = suave(tramo(t, T_TENSA1, T_TENSA1 + 0.6));
    geo.lineaLuz(g, V, pts, "255,164,48", 10, glow * 0.9, 0, N * crece, false);
    geo.hilo(g, V, pts, 8, 1, 0, N * crece);
  }

  // las dos ciudades
  const popM = suave(tramo(t, T.madrid, T.madrid + 0.3)), popN = suave(tramo(t, T.york, T.york + 0.3));
  const zoom = t > 19;
  geo.marca(g, V, MADRID, "Madrid", popM, { dx: -100, dy: zoom ? -70 : -62, rad: zoom ? 22 : 16 });
  geo.marca(g, V, NUEVAYORK, "Nueva York", popN, { dx: 120, dy: zoom ? -70 : -62, rad: zoom ? 22 : 16 });

  // el avión: el hook, hasta que llega; y luego sobre el hilo
  if (t < 10.5) {
    const tam = mez(470, 270, suave(tramo(t, 0, 3.7)));
    const alabeo = 0.22 * Math.sin(Math.PI * lim(tramo(t, T.sube, T.enorme + 1.4), 0, 1));
    avionEnMapa(g, V, GC, iAv, tam, { alabeo, al: 1 - suave(tramo(t, 10.1, 10.5)) });
  } else if (t > T_AVION0 && t < 25.4) {
    const u = suave(tramo(t, T_AVION0, T_AVION1));
    avionEnMapa(g, V, GC, u * N, 215, { al: suave(tramo(t, T_AVION0, T_AVION0 + 0.15)) * (1 - suave(tramo(t, T_AVION1 + 0.2, T_AVION1 + 0.6))) });
  }

  // los kilómetros de cada camino
  if (t > T_KM_GC && t < 28.6) {
    k.pastilla(g, 540, 800, fmt(KM_GC), "km", "255,200,110", suave(tramo(t, T_KM_GC, T_KM_GC + 0.3)), 78);
  }
  if (t > T_KM_RUMBO && t < 28.6) {
    k.pastilla(g, 540, 1160, fmt(KM_RUMBO), "km", "255,255,255", suave(tramo(t, T_KM_RUMBO, T_KM_RUMBO + 0.3)), 78);
  }
  if (t > T_170 && t < 28.6) {
    // lo que se ha alargado: la separación entre los dos caminos, marcada, y su cifra
    const a = suave(tramo(t, T_170, T_170 + 0.28)), esc = 1 + 0.12 * Math.exp(-Math.pow((t - T_170 - 0.3) / 0.18, 2));
    const m1 = GC[N >> 1], m2 = RUMBO[N >> 1], o1 = geo.proyecta(V, m1.lam, m1.sp, m1.cp, m1.my), o2 = geo.proyecta(V, m2.lam, m2.sp, m2.cp, m2.my);
    const yb = o1[1] + (o2[1] - o1[1]) * suave(tramo(t, T_170, T_170 + 0.4));
    g.save();
    g.globalAlpha = a; g.lineCap = "round";
    g.strokeStyle = "rgba(255,90,70,0.35)"; g.lineWidth = 26; g.beginPath(); g.moveTo(540, o1[1]); g.lineTo(540, yb); g.stroke();
    g.strokeStyle = "rgb(255,96,76)"; g.lineWidth = 9; g.stroke();
    g.restore();
    g.save(); g.translate(540, 1335); g.scale(esc, esc); g.translate(-540, -1335);
    k.pastilla(g, 540, 1335, "+170", "km", "255,110,90", a, 112);
    g.restore();
  }
  velo(g, t < 3.7 ? 0.62 : 0.72);
}
