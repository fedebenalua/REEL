// «Casi 3.000 expertos dan, de media, un cincuenta por ciento a que hacia 2047 hagan cualquier tarea mejor que
// nosotros. Pero no se ponen de acuerdo.»
// Otro sitio: una carretera de luz que va hacia el futuro, con sus años. Corte en «Casi».
// - «3.000 expertos»: llueven 3.000 puntos de luz, uno por experto, que caen sobre el año que cada uno espera y se
//   amontonan.
// - «cincuenta por ciento»: la mitad que cae antes de 2047 se pone de oro («50 %»). «2047»: se enciende el arco de
//   2047 y la cámara avanza hacia él.
// - «Pero no se ponen de acuerdo»: la cámara sube: los puntos van desde muy cerca hasta lo más lejos; los de las
//   puntas laten. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { CIELO, velo } from "../mundo.js";

const f6 = v.frase(6), f7 = v.frase(7);
export const desde = f6.inicio;

const { suave, tramo, mez } = k;
const T0 = f6.inicio, T3000 = f6.t("3000"), Tcin = f6.t("cincuenta"), T47 = f6.t("2047"), Thag = f6.t("hagan"), Tpero = f7.inicio, Tacu = f7.t("acuerdo"), Tfin = f7.t("y");

const K = 6, zDe = (y) => -(y - 2025) * K;
const camara = k.ruta([
  [T0, { pos: [0, 24, 42], mira: [0, 0, -110] }],
  [T47 - 0.2, { pos: [0, 30, 26], mira: [0, 2, -130] }],
  [Thag + 0.6, { pos: [48, 42, -20], mira: [0, 6, -140] }],
  [Tpero + 0.1, { pos: [52, 44, -24], mira: [0, 6, -145] }],
  [Tacu + 0.5, { pos: [-95, 150, -40], mira: [0, 0, -250] }],
  [Tfin, { pos: [-97, 152, -42], mira: [0, 0, -252] }],
]);

// los 3.000 puntos: el año que espera cada uno, muy repartido, con la mitad antes de 2047
const az = k.azar(2047);
const gauss = () => { let s = 0; for (let i = 0; i < 6; i++) s += az(); return (s - 3) / Math.sqrt(0.5); };
const PUNTOS = (() => {
  const l = [], cuenta = {};
  for (let i = 0; i < 3000; i++) {
    const y = Math.max(2026, Math.min(2160, 2023 + 24 * Math.exp(0.95 * gauss())));
    const b = Math.floor(y), n = (cuenta[b] = (cuenta[b] || 0) + 1) - 1;
    l.push({ y, n, b });
  }
  return l.map((p) => {
    const col = p.n % 13, fila = Math.floor(p.n / 13);
    const X = [-7.8 + col * 1.3 + (az() - 0.5) * 0.4, 0.5 + fila * 1.05, zDe(p.b) - az() * K * 0.9];
    return { ...p, X, t: T3000 - 0.1 + az() * 1.7, h: 50 + az() * 40, punta: p.y < 2029 || p.y > 2110 };
  });
})();
const ANOS = [2030, 2040, 2050, 2060, 2070, 2080, 2090, 2100];

function linea(g, cam, A, B, color, w) {
  const a = k.proyecta(cam, A), b = k.proyecta(cam, B);
  if (!a || !b) return;
  g.strokeStyle = color; g.lineWidth = w; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
}

export function dibuja(g, t) {
  const cam = camara(t);
  k.fondo(g, cam);
  k.estrellas(g, cam, null, CIELO, 0.7);
  // el suelo y la carretera
  const H = k.proyecta(cam, [cam.p[0], 0, cam.p[2] - 8000]);
  if (H) { const sg = g.createLinearGradient(0, H.y - 60, 0, 1920); sg.addColorStop(0, "rgba(20,30,60,0)"); sg.addColorStop(0.05, "#0d1426"); sg.addColorStop(1, "#05070d"); g.fillStyle = sg; g.fillRect(0, H.y - 60, 1080, 1980 - H.y); k.brillo(g, 540, H.y, 2200, "80,120,255", 0.2); }
  const pts = [[-10, 0, 30], [10, 0, 30], [10, 0, -1000], [-10, 0, -1000]].map((p) => k.proyecta(cam, p));
  if (pts.every(Boolean)) {
    g.beginPath(); g.moveTo(pts[0].x, pts[0].y); for (const p of pts.slice(1)) g.lineTo(p.x, p.y); g.closePath();
    const rg = g.createLinearGradient(0, pts[2].y, 0, pts[0].y); rg.addColorStop(0, "#101a33"); rg.addColorStop(1, "#1a2a50"); g.fillStyle = rg; g.fill();
  }
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  linea(g, cam, [-10, 0, 30], [-10, 0, -1000], "rgba(110,200,255,0.8)", 4);
  linea(g, cam, [10, 0, 30], [10, 0, -1000], "rgba(110,200,255,0.8)", 4);
  for (let y = 2026; y < 2170; y += 2) linea(g, cam, [0, 0, zDe(y)], [0, 0, zDe(y) - K * 0.9], "rgba(200,230,255,0.35)", 3);
  g.restore();
  // los años, de pie a la izquierda
  g.save(); g.textAlign = "center"; g.textBaseline = "alphabetic";
  for (const a of ANOS) {
    const P = k.proyecta(cam, [-14, 0.2, zDe(a)]); if (!P || P.z < 3) continue;
    const tam = Math.min(110, (k.F * 3) / P.z); if (tam < 9) continue;
    g.font = `800 ${tam}px Figtree`; g.fillStyle = "rgba(190,215,255,0.8)"; g.fillText(String(a), P.x, P.y);
  }
  g.restore();
  // el arco de 2047
  const arco = suave(tramo(t, T47 - 0.15, T47 + 0.3)), za = zDe(2047) - K;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  const col = `rgba(255,${Math.round(mez(170, 210, arco))},${Math.round(mez(255, 110, arco))},${0.35 + 0.6 * arco})`;
  const pa = k.proyecta(cam, [0, 0, za]), ancho = pa ? Math.max(3, (k.F * 0.7) / pa.z) : 3;
  linea(g, cam, [-11, 0, za], [-11, 17, za], col, ancho); linea(g, cam, [11, 0, za], [11, 17, za], col, ancho); linea(g, cam, [-12, 17, za], [12, 17, za], col, ancho);
  const top = k.proyecta(cam, [0, 17, za]);
  if (top) k.brillo(g, top.x, top.y, (k.F * 40) / top.z, "255,200,110", 0.5 * arco);
  g.restore();
  if (top && top.z > 3) {
    const tam = Math.min(150, (k.F * 4.2) / top.z);
    g.save(); g.font = `800 ${tam}px Figtree`; g.textAlign = "center"; g.textBaseline = "bottom";
    g.shadowColor = `rgba(255,200,110,${arco})`; g.shadowBlur = 30; g.fillStyle = `rgba(255,${Math.round(mez(220, 235, arco))},${Math.round(mez(255, 170, arco))},${0.5 + 0.5 * arco})`;
    g.fillText("2047", top.x, top.y - tam * 0.15); g.restore();
  }
  // los puntos: caen, se amontonan y se ponen de oro los de antes de 2047
  const oro = (p) => suave(tramo(t, Tcin - 0.1 + (p.y - 2026) * 0.025, Tcin + 0.15 + (p.y - 2026) * 0.025)) * (p.y <= 2047 ? 1 : 0);
  const late = suave(tramo(t, Tpero, Tacu)) * (0.5 + 0.5 * Math.sin((t - Tpero) * 9));
  g.save(); g.globalCompositeOperation = "lighter";
  for (const p of PUNTOS) {
    const u = tramo(t, p.t, p.t + 0.55); if (u <= 0) continue;
    const y = p.X[1] + p.h * (1 - u * u) + (u >= 1 ? 0 : 0);
    const P = k.proyecta(cam, [p.X[0], y, p.X[2]]); if (!P || P.x < -30 || P.x > 1110 || P.y < -30 || P.y > 1950) continue;
    const o = oro(p), color = o > 0.5 ? "255,200,90" : "120,220,255", tam = Math.min(34, Math.max(5, (k.F * 0.85) / P.z));
    g.globalAlpha = Math.min(1, 0.85 + (p.punta ? 0.6 * late : 0));
    g.drawImage(k.halo(color), P.x - tam, P.y - tam, tam * 2, tam * 2);
    if (p.punta && late > 0.05) k.brillo(g, P.x, P.y, tam * 5, color, 0.5 * late);
  }
  g.restore();
  k.pastilla(g, 540, 1300, "50", "%", "255,205,110", suave(tramo(t, Tcin - 0.1, Tcin + 0.2)) * (1 - suave(tramo(t, T47 + 0.6, T47 + 0.9))), 104);
  velo(g);
}
