// «Eso sí: un centro de datos de IA gasta lo que cien mil casas;»
// Otro sitio: un centro de datos de noche, visto desde el aire. Corte en «Eso».
// - Fotograma 0: la nave grande, con su tejado lleno de ventiladores y sus filas de luces azules; la cámara gira
//   despacio a su alrededor.
// - «gasta»: por los cables que llegan de lejos corre la corriente hacia la nave.
// - «cien mil casas»: la cámara sube y se aleja, y alrededor se encienden miles de casas en una ola que sale de la
//   nave («100.000 casas»). Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { poligono, segmento, traza, velo } from "../mundo.js";

export const desde = v.frase(5).inicio;

const { suave, tramo } = k;
const f5 = v.frase(5);
const T0 = f5.inicio, Tgas = f5.t("gasta"), Tcien = f5.t("cien"), Tcas = f5.t("casas"), Tfin = f5.t("tu");

const camara = k.ruta([
  [T0, { pos: [-24, 13, 27], mira: [0, 0.5, 0] }],
  [Tgas - 0.1, { pos: [-17, 16, 28], mira: [0, 0.5, 0] }],
  [Tcas + 0.5, { pos: [-30, 230, 250], mira: [0, 0, -30] }],
  [Tfin, { pos: [-30, 236, 256], mira: [0, 0, -30] }],
]);

const BX = 16, BZ = 10, BH = 5;
const az = k.azar(777);
// las casas: manzanas alrededor de la nave, cada casa una luz cálida
const CASAS = (() => {
  const l = [];
  for (let n = 0; n < 1600; n++) {
    const a = az() * 6.283, d = 34 + Math.pow(az(), 0.7) * 520, cx = Math.cos(a) * d, cz = Math.sin(a) * d;
    for (let i = 0; i < 10; i++) l.push({ p: [cx + (i % 5) * 1.6 + az() * 0.4, 0.3, cz + Math.floor(i / 5) * 2.2], d: Math.hypot(cx, cz), b: 0.55 + az() * 0.5, c: az() < 0.75 ? "255,190,100" : "255,230,170" });
  }
  return l;
})();
// los cables que llegan a la nave desde lejos
const CABLES = Array.from({ length: 9 }, (_, i) => { const a = (i / 9) * 6.283 + 0.3; return { a, x0: Math.cos(a) * 560, z0: Math.sin(a) * 560 }; });
// los ventiladores del tejado
const VENT = []; for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) VENT.push([-BX + 3 + i * 5.2, -BZ + 3.5 + j * 6.5]);

function circuloEn(cam, cx, y, cz, r, n = 18) { const pts = []; for (let i = 0; i < n; i++) { const a = (i / n) * 6.283; pts.push([cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]); } return poligono(cam, pts); }

export function dibuja(g, t) {
  const cam = camara(t);
  // el cielo de noche y el suelo
  const sg = g.createLinearGradient(0, 0, 0, 1920); sg.addColorStop(0, "#060a16"); sg.addColorStop(1, "#0d1424");
  g.fillStyle = sg; g.fillRect(0, 0, 1080, 1920);
  const suelo = poligono(cam, [[-900, 0, -900], [900, 0, -900], [900, 0, 900], [-900, 0, 900]]);
  if (suelo) { traza(g, suelo); g.fillStyle = "#0a0d14"; g.fill(); }
  // las casas: apagadas (puntitos) hasta que llega la ola
  const R = k.mez(0, 600, suave(tramo(t, Tcien - 0.1, Tcas + 0.5)));
  g.save(); g.globalCompositeOperation = "lighter";
  for (const c of CASAS) {
    const P = k.proyecta(cam, c.p); if (!P || P.x < -20 || P.x > 1100 || P.y < -20 || P.y > 1940) continue;
    const on = suave(tramo(R - c.d, 0, 30)), tam = Math.min(30, Math.max(2, (k.F * 0.9) / P.z));
    const al = c.b * (0.08 + 0.92 * on) + 0.6 * on * Math.exp(-Math.pow((R - c.d - 15) / 15, 2));
    g.globalAlpha = Math.min(1, al);
    if (tam < 6) { g.fillStyle = `rgb(${c.c})`; g.fillRect(P.x - tam / 2, P.y - tam / 2, tam, tam); }
    else g.drawImage(k.halo(c.c), P.x - tam, P.y - tam, tam * 2, tam * 2);
  }
  g.restore();
  // los cables, con la corriente que corre hacia la nave
  const corre = suave(tramo(t, Tgas - 0.2, Tgas + 0.3));
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (const cb of CABLES) {
    const A = [cb.x0, 0.5, cb.z0], B = [Math.cos(cb.a) * (BX + 1), 0.5, Math.sin(cb.a) * (BZ + 1)], s = segmento(cam, A, B);
    if (!s) continue;
    g.strokeStyle = `rgba(90,180,255,${0.25 + 0.25 * corre})`; g.lineWidth = 3; g.beginPath(); g.moveTo(s[0].x, s[0].y); g.lineTo(s[1].x, s[1].y); g.stroke();
    if (corre > 0) for (let q = 0; q < 6; q++) {
      const u = (((t * 0.9 + q / 6) % 1) + 1) % 1, X = k.mezV(A, B, u), P = k.proyecta(cam, X);
      if (P) k.brillo(g, P.x, P.y, Math.min(120, (k.F * 6) / P.z), "cian", 0.9 * corre);
    }
  }
  g.restore();
  // la nave: paredes con filas de luces azules
  const W = (x, y, z) => [x, y, z];
  const caras = [
    { pts: [W(-BX, 0, BZ), W(BX, 0, BZ), W(BX, BH, BZ), W(-BX, BH, BZ)], n: [0, 0, 1] },
    { pts: [W(-BX, 0, -BZ), W(-BX, 0, BZ), W(-BX, BH, BZ), W(-BX, BH, -BZ)], n: [-1, 0, 0] },
    { pts: [W(BX, 0, -BZ), W(BX, 0, BZ), W(BX, BH, BZ), W(BX, BH, -BZ)], n: [1, 0, 0] },
    { pts: [W(-BX, 0, -BZ), W(BX, 0, -BZ), W(BX, BH, -BZ), W(-BX, BH, -BZ)], n: [0, 0, -1] },
  ];
  for (const c of caras) {
    const centro = [c.pts.reduce((s, p) => s + p[0], 0) / 4, BH / 2, c.pts.reduce((s, p) => s + p[2], 0) / 4];
    if (k.pto(c.n, k.res(cam.p, centro)) <= 0) continue;
    const P = poligono(cam, c.pts); if (!P) continue;
    traza(g, P); g.fillStyle = c.n[0] ? "#151b28" : "#1b2232"; g.fill();
    // las franjas de luz
    for (let f = 1; f <= 3; f++) {
      const y = f * 1.2, a = c.pts[0], b = c.pts[1], s = segmento(cam, [a[0], y, a[2]], [b[0], y, b[2]]);
      if (!s) continue;
      g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(80,170,255,${0.55 + 0.25 * Math.sin(t * 3 + f)})`; g.lineWidth = Math.max(2, (k.F * 0.18) / k.proyecta(cam, centro).z); g.beginPath(); g.moveTo(s[0].x, s[0].y); g.lineTo(s[1].x, s[1].y); g.stroke(); g.restore();
    }
  }
  // el tejado, con sus ventiladores
  const techo = poligono(cam, [W(-BX, BH, -BZ), W(BX, BH, -BZ), W(BX, BH, BZ), W(-BX, BH, BZ)]);
  if (techo) {
    traza(g, techo);
    const xs = techo.map((p) => p.x), ys = techo.map((p) => p.y);
    const tg = g.createLinearGradient(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)); tg.addColorStop(0, "#3a4252"); tg.addColorStop(1, "#1d222c");
    g.fillStyle = tg; g.fill();
    g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.4; g.drawImage(k.red, Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)); g.restore();
    g.strokeStyle = "rgba(120,190,255,0.5)"; g.lineWidth = 2; traza(g, techo); g.stroke();
  }
  for (const [vx, vz] of VENT) {
    const caja = poligono(cam, [W(vx - 2, BH + 0.05, vz - 2.5), W(vx + 2, BH + 0.05, vz - 2.5), W(vx + 2, BH + 0.05, vz + 2.5), W(vx - 2, BH + 0.05, vz + 2.5)]);
    if (caja) { traza(g, caja); g.fillStyle = "#2b3140"; g.fill(); g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 2; g.stroke(); }
    for (const dz of [-1.2, 1.2]) {
      const c = circuloEn(cam, vx, BH + 0.1, vz + dz, 0.95);
      if (!c) continue;
      traza(g, c); g.fillStyle = "#0b0e14"; g.fill();
      // las aspas, girando
      const C = k.proyecta(cam, [vx, BH + 0.1, vz + dz]);
      for (let b = 0; b < 4; b++) {
        const a = t * 9 + b * 1.571 + vx, s = segmento(cam, [vx, BH + 0.12, vz + dz], [vx + Math.cos(a) * 0.85, BH + 0.12, vz + dz + Math.sin(a) * 0.85]);
        if (s) { g.strokeStyle = "#5c6678"; g.lineWidth = Math.max(1.5, (k.F * 0.22) / C.z); g.beginPath(); g.moveTo(s[0].x, s[0].y); g.lineTo(s[1].x, s[1].y); g.stroke(); }
      }
      if (C) k.brillo(g, C.x, C.y, Math.min(200, (k.F * 2.6) / C.z), "cian", 0.35);
    }
  }
  // el resplandor de la nave
  const N = k.proyecta(cam, [0, BH, 0]);
  if (N) k.brillo(g, N.x, N.y, Math.min(2000, (k.F * 70) / N.z), "60,140,255", 0.35);
  k.pastilla(g, 540, 1300, "100.000", "casas", "255,205,120", suave(tramo(t, Tcas - 0.1, Tcas + 0.2)), 100);
  velo(g);
}
