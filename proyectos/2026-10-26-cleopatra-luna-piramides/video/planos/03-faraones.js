// «Porque Egipto duró muchísimo: cuando ella reinaba, ya llevaba unos 3.000 años de faraones.» «Y ella vio...»
// Otro sitio: una avenida al atardecer con dos filas de máscaras de oro de faraón sobre pedestales, con antorchas, que
// se pierde en el horizonte. Se entra con un corte en «Egipto».
// - «Egipto duró muchísimo»: la cámara vuela por la avenida a toda velocidad, pasando faraón tras faraón.
// - «cuando ella reinaba»: llega al final, donde está la moneda de Cleopatra, de pie, enorme.
// - «ya llevaba unos 3.000 años de faraones»: la cámara gira alrededor de la moneda y se ve detrás la avenida entera,
//   faraones hasta el horizonte, con el sol poniéndose al fondo. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { MASCARA, moneda } from "../mundo.js";

export const desde = "egipto";

const { suave: su, tramo: tr, mez, mezV, proyecta, F } = k;
const f7 = v.frase(7);
const T0 = f7.t("egipto"), Trei = f7.t("reinaba"), Tya = f7.t("ya"), Tfar = f7.t("faraones"), Fin = f7.fin;

const PASO = 4, N = 36, XF = 2.3;
const ZC = -N * PASO - 4, CENTRO = [0, 1.75, ZC];     // la moneda, al final de la avenida
const SOL = [0, 4, 600];

const zVuelo = k.curva([[T0, 8], [Trei + 0.05, ZC + 11]], -75, 0);
const ang = k.claves([[Trei + 0.35, 0], [Tfar - 0.1, Math.PI]]);
const dist = k.claves([[Trei + 0.35, 11], [Tfar - 0.1, 7.2]]), alto = k.curva([[Trei + 0.35, 0], [(Trei + Tfar) / 2 + 0.1, 4.2], [Tfar - 0.1, 1.6]], 0, 0);
const lado = k.claves([[Trei + 0.35, 0], [Tfar - 0.1, 1.3]]);
function camara(t) {
  if (t < Trei + 0.35) { const z = zVuelo(Math.min(t, Trei + 0.05)); return k.mira([0, 1.75, z], [0, 1.65, z - 10]); }
  const a = ang(t), p = k.orbita(a, dist(t), alto(t), CENTRO), u = su(tr(t, Trei + 0.35, Tfar - 0.1));
  p[0] += lado(t);
  return k.mira(p, mezV(CENTRO, [0, 1.3, ZC + 40], u));
}

// el cielo del atardecer y el suelo, según dónde quede el horizonte
function fondo(g, cam) {
  const d = [cam.e.f[0], 0, cam.e.f[2]], L = Math.hypot(d[0], d[2]) || 1;
  const H = proyecta(cam, [cam.p[0] + (d[0] / L) * 2000, cam.p[1], cam.p[2] + (d[2] / L) * 2000]);
  const yh = H ? H.y : 960, haciaSol = Math.max(0, d[2] / L);
  const gr = g.createLinearGradient(0, yh - 1400, 0, yh);
  gr.addColorStop(0, "#1d1640"); gr.addColorStop(0.55, k.mezColor("#4a2a6a", "#7a3b62", haciaSol)); gr.addColorStop(0.85, k.mezColor("#b35a52", "#ec8a4a", haciaSol)); gr.addColorStop(1, k.mezColor("#e8955a", "#ffc070", haciaSol));
  g.fillStyle = gr; g.fillRect(0, 0, 1080, Math.max(0, yh + 2));
  const sg = g.createLinearGradient(0, yh, 0, 1920);
  sg.addColorStop(0, "#c98a54"); sg.addColorStop(0.25, "#8a5634"); sg.addColorStop(1, "#3a2216");
  g.fillStyle = sg; g.fillRect(0, yh, 1080, 1920 - yh);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.16; g.drawImage(k.manchas, 0, yh, 1080, 1920 - yh); g.restore();
  const S = proyecta(cam, SOL);
  if (S) { k.brillo(g, S.x, S.y, 1500, "255,170,90", 0.8); k.brillo(g, S.x, S.y, 260, "255,240,200", 1); }
  else k.brillo(g, 540, yh, 1600, "255,150,80", 0.25);
  return yh;
}

function camino(g, cam) {
  for (let i = -2; i < N + 3; i++) {
    const fw = cam.e.f;
    let za = 6 - i * PASO, zb = za - PASO;
    // lo que queda detrás de la cámara se recorta (si no, la baldosa más cercana aparece y desaparece)
    if (fw[2] < -0.5) { const lim = cam.p[2] - 0.4; if (zb >= lim) continue; za = Math.min(za, lim); }
    else if (fw[2] > 0.5) { const lim = cam.p[2] + 0.4; if (za <= lim) continue; zb = Math.max(zb, lim); }
    const q = [[-1.3, za], [1.3, za], [1.3, zb], [-1.3, zb]].map(([x, z]) => proyecta(cam, [x, 0, z]));
    if (q.some((p) => !p)) continue;
    g.beginPath(); g.moveTo(q[0].x, q[0].y); for (const p of q.slice(1)) g.lineTo(p.x, p.y); g.closePath();
    g.fillStyle = i % 2 ? "rgba(214,170,118,0.95)" : "rgba(196,152,104,0.9)"; g.fill();
    g.strokeStyle = "rgba(90,55,30,0.5)"; g.lineWidth = 2; g.stroke();
  }
}

function faraon(g, cam, x, z, t, i) {
  const P = proyecta(cam, [x, 1.0, z]);
  if (!P || P.z > 260 || P.z < 1.2) return;
  const s = F / P.z;
  // el pedestal
  const zf = z + 0.55 * Math.sign(cam.p[2] - z);
  const a = proyecta(cam, [x - 0.55, 1.0, zf]), b = proyecta(cam, [x + 0.55, 0, zf]);
  if (a && b) {
    const gr = g.createLinearGradient(0, a.y, 0, b.y); gr.addColorStop(0, "#7a5a40"); gr.addColorStop(1, "#3a2618");
    g.fillStyle = gr; g.fillRect(Math.min(a.x, b.x), a.y, Math.abs(b.x - a.x), b.y - a.y);
    g.fillStyle = "rgba(255,210,150,0.35)"; g.fillRect(Math.min(a.x, b.x), a.y, Math.abs(b.x - a.x), Math.max(1, s * 0.04));
  }
  // la máscara
  const h = 1.45 * s, w = h * (400 / 520), M = proyecta(cam, [x, 1.0 + 0.72, z]);
  if (M) g.drawImage(MASCARA, M.x - w / 2, M.y - h / 2, w, h);
  // la antorcha, entre uno y otro
  const A = proyecta(cam, [x * 1.22, 2.35, z - PASO / 2]);
  if (A) {
    const fl = 0.8 + 0.2 * Math.sin(t * 13 + i * 2.1) * Math.sin(t * 7.3 + i);
    k.brillo(g, A.x, A.y, s * 1.6 * fl, "255,150,60", 0.75);
    k.brillo(g, A.x, A.y, s * 0.35, "255,235,180", 0.9);
  }
}

export function dibuja(g, t) {
  const cam = camara(t);
  fondo(g, cam);
  camino(g, cam);
  const cosas = [];
  for (let i = 0; i < N; i++) for (const x of [-XF, XF]) {
    const z = -i * PASO, P = proyecta(cam, [x, 1.5, z]);
    if (P) cosas.push({ z: P.z, dibuja: () => faraon(g, cam, x, z, t, i * 2 + (x > 0)) });
  }
  const C = proyecta(cam, CENTRO);
  if (C) cosas.push({ z: C.z, dibuja: () => {
    const r = (F * 1.05) / C.z, base = proyecta(cam, [0, 0, ZC]);
    if (base) { g.fillStyle = "#4a3020"; g.fillRect(C.x - r * 0.5, C.y + r * 0.9, r, Math.max(0, base.y - C.y - r * 0.9)); }
    k.brillo(g, C.x, C.y, r * 4, "255,200,110", 0.5);
    const giro = Math.atan2(cam.p[0] - CENTRO[0], cam.p[2] - CENTRO[2]);
    const g2 = Math.cos(giro) < 0 ? giro - Math.PI : giro;
    moneda(g, C.x, C.y, r, g2, 0.5);
  } });
  k.deLejosACerca(cosas);
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(20,12,40,0.5)"); vg.addColorStop(1, "rgba(20,12,40,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
