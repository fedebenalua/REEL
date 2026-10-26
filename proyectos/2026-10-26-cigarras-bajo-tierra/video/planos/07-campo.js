// «¿Y para qué tanta espera? Para salir todas a la vez: hasta un millón y medio en poco más de medio campo de fútbol.»
// Otro sitio: un campo de fútbol de noche, con la Luna. Se entra con un corte en «¿Y».
// - «¿Y para qué tanta espera?»: a ras de hierba, delante de la cámara, los agujeros del suelo; la hierba se mueve.
// - «Para salir todas a la vez»: en «salir», de cada agujero sale una ninfa a la vez, cerca y hasta el fondo.
// - «hasta un millón y medio»: «1,5 millones».
// - «en poco más de medio campo de fútbol»: la cámara sube de golpe hasta ver el campo entero desde arriba: la mitad,
//   cubierta de ninfas; la otra, vacía.
import * as k from "#kit";
import { v } from "#voz";
import { ninfa, sinVista, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio;

const { suave: su, tramo: tr, mez, azar, F, proyecta, mira } = k;
const f9 = v.frase(9);
const T0 = f9.inicio, Tsal = f9.t("salir"), Tmil = f9.t("millon"), Tpoco = f9.t("poco"), Tcam = f9.t("campo"), Tfut = f9.t("futbol"), Fin = f9.fin;
const sube0 = Tpoco - 0.1, sube1 = Tfut + 0.45;
export const salen = Tsal + 0.02;

// el campo: 68 m de ancho (x) por 105 de largo (z); la mitad de cerca (z > 0) es la de las ninfas
const ANCHO = 68, LARGO = 105;
const az = azar(9090);
// las ninfas de lejos: puntos por toda la mitad de cerca
const PUNTOS = Array.from({ length: 15000 }, () => ({ x: (az() - 0.5) * ANCHO, z: az() * LARGO / 2, r: az(), d: az() * 0.5 }));
// las de cerca, delante de la cámara, con sus agujeros
const CAM0 = [3, 0.13, 24];
const CERCA = [
  [3.0, 23.74, 0.0], [2.87, 23.62, 0.12], [3.15, 23.56, 0.05], [2.7, 23.2, 0.2], [3.32, 23.1, 0.08], [2.98, 23.05, 0.15],
  [2.5, 22.7, 0.1], [3.55, 22.8, 0.22], [3.1, 22.5, 0.18], [2.75, 22.2, 0.06], [3.4, 22.1, 0.25], [2.3, 21.8, 0.12],
].map(([x, z, d]) => ({ x, z, d }));
for (let i = 0; i < 520; i++) CERCA.push({ x: CAM0[0] + (az() - 0.5) * 7, z: 23.0 - Math.pow(az(), 0.8) * 9, d: az() * 0.4 });
const HIERBA = Array.from({ length: 2600 }, () => ({ x: CAM0[0] + (az() - 0.5) * 4, z: CAM0[2] - 0.12 - Math.pow(az(), 1.6) * 7, h: 0.02 + az() * 0.03, a: (az() - 0.5) * 0.7, c: az() }));
const ESTRELLAS = Array.from({ length: 160 }, () => ({ x: az() * 1080, y: az() * 900, r: 0.8 + az() * 2, f: az() * 6 }));

function camara(t) {
  const s = su(tr(t, sube0, sube1));
  const empuja = su(tr(t, T0, sube0)) * 0.04;
  const baja = su(tr(t, T0 - 0.4, salen + 0.15));
  const h0 = Math.exp(mez(Math.log(0.55), Math.log(CAM0[1]), baja));
  const h = Math.exp(mez(Math.log(h0), Math.log(92), s));
  const pos = [mez(CAM0[0], 0, s), h, mez(CAM0[2] - empuja, 12.5, Math.pow(s, 0.6))];
  const obj = [mez(CAM0[0], 0, s), 0, mez(CAM0[2] - empuja - 1.25, 10.5, Math.pow(s, 0.5))];
  return mira(pos, obj);
}
// un trozo de suelo (rectángulo en x, z) proyectado, recortado para que quede delante de la cámara
function quad(g, cam, x0, x1, z0, z1, color) {
  const zmax = cam.p[1] < 3 ? cam.p[2] - 0.03 : 1e9;
  z1 = Math.min(z1, zmax); if (z1 <= z0) return;
  const P = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].map(([x, z]) => proyecta(cam, [x, 0, z]));
  if (P.some((p) => !p)) return;
  g.fillStyle = color; g.beginPath(); P.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y))); g.closePath(); g.fill();
}
// una línea blanca del campo, partida en trozos para que tenga perspectiva
function linea(g, cam, pts) {
  g.strokeStyle = "rgba(235,245,255,0.85)"; g.lineCap = "round";
  for (let i = 1; i < pts.length; i++) {
    const a = proyecta(cam, [pts[i - 1][0], 0, pts[i - 1][1]]), b = proyecta(cam, [pts[i][0], 0, pts[i][1]]);
    if (!a || !b) continue;
    g.lineWidth = Math.max(1.2, F * 0.12 / ((a.z + b.z) / 2));
    g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
  }
}
const seg = (x0, z0, x1, z1, n = 12) => Array.from({ length: n + 1 }, (_, i) => [mez(x0, x1, i / n), mez(z0, z1, i / n)]);
const arco = (cx, cz, r, a0, a1, n = 40) => Array.from({ length: n + 1 }, (_, i) => { const a = mez(a0, a1, i / n); return [cx + Math.cos(a) * r, cz + Math.sin(a) * r]; });
const H = LARGO / 2, A = ANCHO / 2;
const LINEAS = [
  seg(-A, -H, A, -H), seg(-A, H, A, H), seg(-A, -H, -A, H, 40), seg(A, -H, A, H, 40), seg(-A, 0, A, 0, 24),
  arco(0, 0, 9.15, 0, 6.2832, 60),
  ...[-1, 1].flatMap((s) => [seg(-20.16, s * H, -20.16, s * (H - 16.5)), seg(20.16, s * H, 20.16, s * (H - 16.5)), seg(-20.16, s * (H - 16.5), 20.16, s * (H - 16.5)),
    seg(-9.16, s * H, -9.16, s * (H - 5.5)), seg(9.16, s * H, 9.16, s * (H - 5.5)), seg(-9.16, s * (H - 5.5), 9.16, s * (H - 5.5))]),
];

export function dibuja(g, t) {
  const cam = camara(t);
  sinVista(g);
  // el cielo de noche, hasta el horizonte
  const hz = proyecta(cam, [cam.p[0], 0, cam.p[2] - 1e5]);
  const yH = hz ? hz.y : -100;
  g.fillStyle = "#06101f"; g.fillRect(0, 0, 1080, 1920);
  if (yH > 0) {
    const sg = g.createLinearGradient(0, yH - 900, 0, yH); sg.addColorStop(0, "#0a1636"); sg.addColorStop(1, "#24407a");
    g.fillStyle = sg; g.fillRect(0, 0, 1080, yH);
    for (const e of ESTRELLAS) { const y = yH - 900 + e.y; if (y > yH - 40) continue; g.fillStyle = `rgba(230,240,255,${0.5 + 0.4 * Math.sin(t * 3 + e.f)})`; g.fillRect(e.x, y, e.r, e.r); }
    k.brillo(g, 820, yH - 520, 700, "200,220,255", 0.8);
    const lg = g.createRadialGradient(805, yH - 535, 5, 820, yH - 520, 80); lg.addColorStop(0, "#ffffff"); lg.addColorStop(1, "#cfdcff");
    g.fillStyle = lg; g.beginPath(); g.arc(820, yH - 520, 78, 0, 6.2832); g.fill();
    // los árboles del fondo, a contraluz
    g.fillStyle = "#050a14";
    g.beginPath(); g.moveTo(0, yH + 2);
    for (let x = 0; x <= 1080; x += 30) g.lineTo(x, yH - 40 - 50 * Math.abs(Math.sin(x * 0.013)) - 30 * Math.abs(Math.sin(x * 0.041)));
    g.lineTo(1080, yH + 2); g.closePath(); g.fill();
  }
  // el césped, en franjas
  const yTop = Math.max(0, yH);
  const cg = g.createLinearGradient(0, yTop, 0, 1920); cg.addColorStop(0, "#185530"); cg.addColorStop(1, "#1d6234");
  g.fillStyle = cg; g.fillRect(0, yTop, 1080, 1920 - yTop);
  quad(g, cam, -A - 6, A + 6, -H - 6, H + 6, "#17502a");
  for (let i = 0; i < 14; i++) quad(g, cam, -A, A, -H + i * 7.5, -H + i * 7.5 + 7.5, i % 2 ? "#1d6234" : "#185530");
  for (const L of LINEAS) linea(g, cam, L);
  // la luz de la Luna sobre el césped
  g.save(); g.globalCompositeOperation = "lighter";
  const mg = g.createLinearGradient(0, yTop, 0, 1920); mg.addColorStop(0, "rgba(80,120,200,0.18)"); mg.addColorStop(1, "rgba(80,120,200,0)");
  g.fillStyle = mg; g.fillRect(0, yTop, 1080, 1920 - yTop); g.restore();
  // las ninfas de lejos: salen en «salir» (de cerca a lejos, casi a la vez)
  const sal = (d) => su(tr(t, salen + d * 0.4, salen + d * 0.4 + 0.3));
  const alto = cam.p[1] > 2;
  for (const p of PUNTOS) {
    const u = sal(p.d); if (u <= 0) continue;
    const q = proyecta(cam, [p.x, 0, p.z]); if (!q || (!alto && q.z < 7) || q.y < yH - 2 || q.y > 1930 || q.x < -10 || q.x > 1090) continue;
    const r = Math.max(1.6, F * 0.02 / q.z) * (alto ? 1.4 : 1) * u;
    g.fillStyle = p.r < 0.5 ? "#6a3c1a" : "#8a5428"; g.beginPath(); g.arc(q.x, q.y, r, 0, 6.2832); g.fill();
    if (p.r > 0.75) { g.fillStyle = "#ff3a2a"; g.fillRect(q.x, q.y - r * 0.6, Math.max(1, r * 0.6), Math.max(1, r * 0.6)); }
  }
  // la hierba de cerca y las ninfas de cerca, de lejos a cerca
  const cosas = [];
  if (!alto || cam.p[1] < 6) {
    for (const b of HIERBA) {
      const q = proyecta(cam, [b.x, 0, b.z]); if (!q) continue;
      cosas.push({ z: q.z, dibuja() {
        const hh = F * b.h / q.z, s = Math.sin(t * 2 + b.x * 9) * 0.1;
        if (hh < 1.5) return;
        g.strokeStyle = k.mezColor("#1d5a26", "#5fae4a", b.c); g.lineWidth = Math.max(1, hh * 0.035); g.lineCap = "round";
        g.beginPath(); g.moveTo(q.x, q.y); g.quadraticCurveTo(q.x + (b.a + s) * hh * 0.5, q.y - hh * 0.5, q.x + (b.a + s) * hh, q.y - hh); g.stroke();
      } });
    }
    for (const n of CERCA) {
      const q = proyecta(cam, [n.x, 0, n.z]); if (!q) continue;
      const L = F * 0.045 / q.z;
      if (L < 3 || q.x < -L || q.x > 1080 + L) continue;
      cosas.push({ z: q.z - 0.001, dibuja() {
        // el agujero
        g.fillStyle = "#0a0603"; g.beginPath(); g.ellipse(q.x, q.y, L * 0.28, L * 0.08, 0, 0, 6.2832); g.fill();
        g.strokeStyle = "rgba(140,100,60,0.7)"; g.lineWidth = Math.max(1, L * 0.02); g.stroke();
        // antes de salir, asoman la cabeza y tiemblan, esperando
        const asoma = su(tr(t, T0 + 0.5 + n.d, T0 + 1.2 + n.d)) * (0.16 + 0.06 * Math.sin(t * 9 + n.x * 23));
        const u = Math.max(sal(n.d), asoma); if (u <= 0) return;
        // la ninfa, que sale de él
        g.save(); g.beginPath(); g.rect(q.x - L, q.y - L * 1.4, L * 2, L * 1.4 + L * 0.04); g.clip();
        ninfa(g, q.x, q.y + L * mez(0.55, -0.12, u), L, -1.15, t + n.x * 3, { tono: 1, pico: 0 });
        g.restore();
        if (u < 1 && L > 30) { g.fillStyle = `rgba(120,80,45,${1 - u})`; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.45; g.beginPath(); g.arc(q.x + Math.cos(a) * L * 0.5 * u, q.y + Math.sin(a) * L * 0.4 * u, L * 0.03, 0, 6.2832); g.fill(); } }
      } });
    }
  }
  k.deLejosACerca(cosas);
  // la cifra
  const am = su(tr(t, Tmil - 0.1, Tmil + 0.2));
  k.pastilla(g, 540, mez(760, 700, am), "1,5 millones", "", "255,190,110", am, 104);
  velo(g, 0.5, "4,8,18");
}

export const momentos = { salen };
