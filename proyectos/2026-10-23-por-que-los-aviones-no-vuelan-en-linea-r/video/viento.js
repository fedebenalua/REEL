// La corriente en chorro sobre el Atlántico: un río de viento del oeste al este, más fuerte en el centro, hecho de
// hebras que corren (se ve igual sobre el mapa plano que sobre la bola, porque cada punto es una latitud y una longitud).
import * as k from "#kit";
import * as geo from "./geo.js";

const { suave, tramo, mez, curva, azar } = k;

// la latitud del centro del chorro según la longitud (grados)
export const centro = curva([[-130, 33], [-100, 35], [-78, 39], [-58, 47], [-38, 53], [-18, 52.5], [2, 48.5], [30, 44]]);
const sigma = 4.6;
export const perfil = (d) => Math.exp(-(d * d) / (2 * sigma * sigma));
const LON0 = -112, LON1 = 28, ANCHO = LON1 - LON0;

const az = azar(77);
const HEBRAS = [];
for (let i = 0; i < 150; i++) {
  // la distancia al centro, más a menudo cerca (como una campana)
  const d = ((az() + az() + az() + az()) / 4 - 0.5) * 2 * 13;
  HEBRAS.push({ d, fase: az(), v: 6 + 17 * (0.2 + 0.8 * perfil(d)) * (0.75 + 0.5 * az()), larga: 5 + 9 * az(), ancho: 1.8 + 3.4 * az(), t0: az() });
}

const pto = (lon, lat) => geo.punto(lon, lat);
const Q = [0, 0, 1];

// V: la vista (mapa o bola). al: lo visible que es; entra: cuánto se ha formado (0 a 1); color base de las hebras.
export function dibujaViento(g, V, t, { al = 1, entra = 1, banda = 0.5, grosor = 1, quita = null } = {}) {
  if (al <= 0.004) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round"; g.lineJoin = "round";
  // la banda de luz del chorro (un camino ancho y suave)
  if (banda > 0.004) {
    const cs = []; for (let lo = LON0; lo <= LON1; lo += 2) cs.push(pto(lo, centro(lo)));
    g.beginPath(); geo.trazaLinea(g, V, cs);
    g.strokeStyle = `rgba(255,170,70,${0.10 * banda * al * entra})`; g.lineWidth = 220 * grosor; g.stroke();
    g.strokeStyle = `rgba(255,190,90,${0.13 * banda * al * entra})`; g.lineWidth = 120 * grosor; g.stroke();
    g.strokeStyle = `rgba(255,220,140,${0.14 * banda * al * entra})`; g.lineWidth = 50 * grosor; g.stroke();
  }
  for (let h = 0; h < HEBRAS.length; h++) {
    const H = HEBRAS[h];
    const a0 = tramo(entra, H.t0 * 0.8, H.t0 * 0.8 + 0.2);
    if (a0 <= 0.01) continue;
    let cabeza = LON0 + ((H.fase * ANCHO + H.v * t) % ANCHO);
    const cola = H.larga;
    let prev = null;
    const M = 12;
    for (let j = 0; j <= M; j++) {
      let lon = cabeza - (cola * j) / M;
      if (lon < LON0) break;
      const lat = centro(lon) + H.d;
      const p = pto(lon, lat), o = geo.proyecta(V, p.lam, p.sp, p.cp, p.my, Q);
      const x = o[0], y = o[1], vis = o[2];
      if (V.u > 0.0005 && !vis) { prev = null; continue; }
      if (prev) {
        const u = 1 - j / M;
        // se apaga en los extremos de su recorrido y por la cola
        const borde = Math.min(1, (cabeza - LON0) / 8, (LON1 - lon) / 8);
        const c = perfil(H.d);
        const r = Math.round(mez(160, 255, c)), gg = Math.round(mez(225, 214, c)), b = Math.round(mez(255, 120, c));
        g.strokeStyle = `rgba(${r},${gg},${b},${al * a0 * Math.max(0, borde) * Math.pow(1 - j / M, 1.4) * (0.35 + 0.65 * c)})`;
        g.lineWidth = H.ancho * grosor * (0.5 + 0.7 * u);
        g.beginPath(); g.moveTo(prev[0], prev[1]); g.lineTo(x, y); g.stroke();
      }
      prev = [x, y];
    }
  }
  g.restore();
}
