// «Las de ahora hablan de casi todo, y en 2025 una sacó nota de medalla de oro en la Olimpiada de Matemáticas.»
// El chip de la IA otra vez, de cerca y de frente, encendido. Corte en «Las».
// - «hablan de casi todo»: del núcleo salen burbujas de conversación, una tras otra, cada una con una pregunta
//   distinta, y se quedan flotando alrededor.
// - «2025»: el año. «sacó nota de medalla de oro»: las burbujas se apartan y baja una medalla de oro enorme colgada de
//   su cinta, que se balancea; en «oro», un brillo la cruza.
// - «Matemáticas»: x², ÷, ×, ±, = y % giran a su alrededor. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { CIELO, chip, velo } from "../mundo.js";

export const desde = "las";

const { suave, tramo, entra } = k;
const f4 = v.frase(4);
const T0 = f4.inicio, Thab = f4.t("hablan"), Ttod = f4.t("todo"), T25 = f4.t("2025"), Tsac = f4.t("saco"), Tmed = f4.t("medalla"), Toro = f4.t("oro"), Tmat = f4.t("matematicas"), Tfin = v.frase(5).inicio;

const camara = k.ruta([
  [T0, { pos: [0, 12, 19], mira: [0, 3.5, 0] }],
  [Tfin - 0.4, { pos: [0, 10.5, 16.5], mira: [0, 3.8, 0] }],
]);

const BURBUJAS = [
  { txt: "¿Por qué el cielo es azul?", c: ["#3fb4ff", "#1665c9"], p: [-1.9, 9.2, 2] },
  { txt: "Tradúceme esto al inglés", c: ["#b07bff", "#5b2fc4"], p: [2.0, 7.4, 3] },
  { txt: "Hazme una receta con lo que tengo", c: ["#ff7aa8", "#c2275f"], p: [-0.4, 5.7, 5] },
  { txt: "Resume este libro", c: ["#4fe0a0", "#14905a"], p: [2.5, 9.8, 0] },
  { txt: "Ayúdame con los deberes", c: ["#ffb54a", "#c96a0c"], p: [-2.6, 8.0, -1] },
  { txt: "Escríbeme un poema", c: ["#5fd7ff", "#1a7fae"], p: [1.6, 4.6, 7] },
];
const tB = (i) => Thab - 0.1 + i * ((Ttod + 0.35 - Thab) / BURBUJAS.length);

function burbuja(g, x, y, esc, b, al) {
  if (al <= 0.003) return;
  g.save(); g.globalAlpha = al; g.translate(x, y); g.scale(esc, esc);
  g.font = "700 40px Figtree";
  const w = g.measureText(b.txt).width + 64, h = 84;
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 30; g.shadowOffsetY = 12;
  const bg = g.createLinearGradient(0, -h / 2, 0, h / 2); bg.addColorStop(0, b.c[0]); bg.addColorStop(1, b.c[1]);
  g.fillStyle = bg; k.redondo(g, -w / 2, -h / 2, w, h, 40); g.fill();
  g.beginPath(); g.moveTo(-w / 2 + 50, h / 2 - 4); g.lineTo(-w / 2 + 34, h / 2 + 26); g.lineTo(-w / 2 + 84, h / 2 - 4); g.closePath(); g.fill();
  g.shadowColor = "rgba(0,0,0,0)"; g.shadowBlur = 0; g.shadowOffsetY = 0;
  // el brillo de arriba, como un plástico
  const hg = g.createLinearGradient(0, -h / 2, 0, 0); hg.addColorStop(0, "rgba(255,255,255,0.45)"); hg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = hg; k.redondo(g, -w / 2 + 6, -h / 2 + 4, w - 12, h / 2, 34); g.fill();
  g.fillStyle = "#ffffff"; g.textBaseline = "middle"; g.textAlign = "center"; g.fillText(b.txt, 0, 2);
  g.restore();
}

const SIMBOLOS = ["x²", "÷", "×", "±", "=", "%"];

function medalla(g, x, y, R, t) {
  // la cinta: dos tiras que suben hasta arriba
  for (const [dx, c0, c1] of [[-1, "#1f5fd0", "#0d2f78"], [1, "#e23b3b", "#7c1414"]]) {
    g.beginPath(); g.moveTo(x + dx * R * 0.18, y - R * 0.86); g.lineTo(x + dx * R * 0.62, -40); g.lineTo(x + dx * R * 0.18 + dx * R * 0.6 - dx * R * 0.6 + dx * R * 0.02, -40); g.lineTo(x - dx * R * 0.2, y - R * 0.86); g.closePath();
    const cg = g.createLinearGradient(x - R, 0, x + R, 0); cg.addColorStop(0, c0); cg.addColorStop(0.5, c1); cg.addColorStop(1, c0);
    g.fillStyle = cg; g.fill();
  }
  // la anilla
  g.lineWidth = R * 0.07; g.strokeStyle = "#e9c25a"; g.beginPath(); g.arc(x, y - R * 1.02, R * 0.12, 0, Math.PI * 2); g.stroke();
  // el disco: borde de oro, cara un poco más honda, una estrella en relieve y laureles
  g.save();
  g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 50; g.shadowOffsetY = 24;
  g.beginPath(); g.arc(x, y, R, 0, Math.PI * 2);
  const og = g.createLinearGradient(x - R, y - R, x + R, y + R);
  og.addColorStop(0, "#fff1b0"); og.addColorStop(0.3, "#f2c14a"); og.addColorStop(0.6, "#a8711a"); og.addColorStop(0.85, "#f7d36c"); og.addColorStop(1, "#7a4d0c");
  g.fillStyle = og; g.fill();
  g.restore();
  g.beginPath(); g.arc(x, y, R * 0.82, 0, Math.PI * 2);
  const ig = g.createRadialGradient(x - R * 0.3, y - R * 0.35, R * 0.05, x, y, R * 0.9);
  ig.addColorStop(0, "#ffe9a0"); ig.addColorStop(0.5, "#d9a232"); ig.addColorStop(1, "#8c5a12");
  g.fillStyle = ig; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.red, x - R, y - R, 2 * R, 2 * R); g.restore();
  // laureles
  for (const s of [-1, 1]) for (let i = 0; i < 9; i++) {
    const a = Math.PI / 2 + s * (0.35 + i * 0.27), px = x + Math.cos(a) * R * 0.66, py = y + Math.sin(a) * R * 0.66;
    g.save(); g.translate(px, py); g.rotate(a + s * 0.9);
    g.fillStyle = "#b37d1c"; g.beginPath(); g.ellipse(0, 0, R * 0.075, R * 0.03, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = "rgba(255,240,180,0.6)"; g.beginPath(); g.ellipse(-R * 0.01, -R * 0.008, R * 0.05, R * 0.012, 0, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  // la estrella
  g.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? R * 0.17 : R * 0.42; g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
  g.closePath();
  const sg = g.createLinearGradient(x - R * 0.4, y - R * 0.4, x + R * 0.4, y + R * 0.4); sg.addColorStop(0, "#fff6c8"); sg.addColorStop(0.5, "#e9b23e"); sg.addColorStop(1, "#8a5a10");
  g.fillStyle = sg; g.fill(); g.strokeStyle = "rgba(90,55,5,0.6)"; g.lineWidth = 3; g.stroke();
  // el brillo que la cruza en «oro»
  const u = tramo(t, Toro - 0.15, Toro + 0.45);
  if (u > 0 && u < 1) {
    g.save(); g.beginPath(); g.arc(x, y, R, 0, Math.PI * 2); g.clip(); g.globalCompositeOperation = "lighter";
    const bx = x - R * 1.4 + u * R * 2.8, bg = g.createLinearGradient(bx - 90, 0, bx + 90, 0);
    bg.addColorStop(0, "rgba(255,255,255,0)"); bg.addColorStop(0.5, "rgba(255,250,220,0.75)"); bg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = bg; g.translate(bx, y); g.rotate(0.35); g.translate(-bx, -y); g.fillRect(bx - 90, y - R * 1.5, 180, R * 3);
    g.restore();
  }
}

export function dibuja(g, t) {
  const cam = camara(t);
  k.fondo(g, cam);
  k.estrellas(g, cam, null, CIELO, 0.6);
  // un suelo de luz bajo el chip
  const N = k.proyecta(cam, [0, 0, 0]);
  if (N) k.brillo(g, N.x, N.y, 1800, "60,140,255", 0.35);
  chip(g, cam, [0, 0, 0], Math.min(t, Tfin - 0.5), { luz: 1.2 + 0.4 * suave(tramo(t, Thab - 0.2, Thab + 0.2)) });
  // las burbujas: salen del núcleo y se quedan flotando; se apartan cuando baja la medalla
  const aparta = suave(tramo(t, Tsac - 0.3, Tmed + 0.2));
  const orden = BURBUJAS.map((b, i) => ({ b, i })).sort((a, c) => a.b.p[2] - c.b.p[2]);
  for (const { b, i } of orden) {
    const u = entra(tramo(t, tB(i), tB(i) + 0.45));
    if (u <= 0) continue;
    const flota = [Math.sin(t * 1.1 + i) * 0.25, Math.sin(t * 1.4 + i * 2) * 0.3, 0];
    const fuera = [b.p[0] * 1.9, b.p[1] + 4, b.p[2] + 4];
    const X = k.sum(k.mezV(k.mezV([0, 0.6, 0], b.p, u), fuera, aparta), flota), P = k.proyecta(cam, X);
    if (!P) continue;
    burbuja(g, P.x, P.y, Math.min(1.25, (k.F * 0.15) / P.z) * (0.4 + 0.6 * u), b, Math.min(1, u * 2) * (1 - aparta));
  }
  // el año
  k.pastilla(g, 540, 1340, "2025", "", "255,225,140", suave(tramo(t, T25 - 0.1, T25 + 0.15)) * (1 - suave(tramo(t, Tmed, Tmed + 0.3))), 100);
  // la medalla: baja desde arriba y se balancea hasta pararse
  const baja = tramo(t, Tsac - 0.05, Tmed + 0.25);
  if (baja > 0) {
    const y = k.mez(-420, 900, entra(baja)), s = t - (Tmed + 0.25);
    const giro = s > 0 ? 0.12 * Math.exp(-s * 2.2) * Math.sin(s * 6) : 0.12 * (1 - baja);
    g.save(); g.translate(540, -40); g.rotate(giro); g.translate(-540, 40);
    k.brillo(g, 540, y, 1100, "255,200,90", 0.45 * suave(baja));
    medalla(g, 540, y, 255, t);
    g.restore();
  }
  // los símbolos de las matemáticas, que giran alrededor
  const sim = suave(tramo(t, Tmat - 0.25, Tmat + 0.25));
  if (sim > 0) {
    g.save(); g.font = "800 96px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
    SIMBOLOS.forEach((c, i) => {
      const a = (i / SIMBOLOS.length) * Math.PI * 2 + 0.6 * suave(tramo(t, Tmat - 0.25, Tfin - 0.35)), x = 540 + Math.cos(a) * 400, y = 900 + Math.sin(a) * 330;
      g.globalAlpha = sim; g.shadowColor = "rgba(255,210,120,0.9)"; g.shadowBlur = 30; g.fillStyle = "#fff4d6"; g.fillText(c, x, y);
    });
    g.restore();
  }
  velo(g);
}
