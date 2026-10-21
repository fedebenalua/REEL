// «¿Y el violeta? Rebota todavía más, pero el Sol da menos y tus ojos lo ven peor.»
// Otro sitio: tres escenas una debajo de otra, y la cámara baja de una a la siguiente con la voz (sin cortes).
// - «¿Y el violeta? Rebota todavía más»: un fotón violeta rebota de molécula en molécula, muchas más veces que el azul.
// - «pero el Sol da menos»: el Sol manda dos haces: el azul, ancho y fuerte; el violeta, finísimo y apagado.
// - «y tus ojos lo ven peor»: un ojo enorme: el azul llega y lo enciende; el violeta apenas se nota.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, VIOLETA, molecula, foton, largoRuta, fondoNoche, sol } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;

const { suave: su, tramo: tr, mez, azar, pulso } = k;
const f = v.frase(8);
const T0 = f.inicio, Tvio = f.t("violeta"), Treb = f.t("rebota"), TSol = f.t("sol"), Tda = f.t("da"), Tmenos = f.t("menos"), Tojos = f.t("ojos"), Tven = f.t("ven"), Tpeor = f.t("peor"), Fin = f.fin;

const VIO = "170,100,255";
const camY = k.claves([[T0, 700], [TSol - 0.5, 700], [TSol + 0.1, 1520], [Tmenos + 0.25, 1520], [Tojos - 0.5, 1520], [Tojos + 0.2, 2250], [Fin, 2250]]);

// ---- escena A: las moléculas y el fotón violeta
const Rm = 46, CA = 720;
const MOLS = [[330, CA - 90], [520, CA + 40], [700, CA - 130], [430, CA + 150], [650, CA + 180], [300, CA + 60], [800, CA + 20], [560, CA - 200]];
const SEC = [0, 1, 3, 4, 2, 5, 7, 6];
function rutaVioleta() {
  const pts = [[-60, MOLS[0][1]]]; let prev = pts[0]; const hits = [];
  for (const i of SEC) {
    const M = MOLS[i], dx = prev[0] - M[0], dy = prev[1] - M[1], L = Math.hypot(dx, dy) || 1;
    const p = [M[0] + (dx / L) * Rm * 1.7, M[1] + (dy / L) * Rm * 1.7];
    pts.push(p); hits.push(i); prev = p;
  }
  pts.push([1300, 200]);
  return { pts, hits };
}
const VR = rutaVioleta();
const VEL = 1700, TV0 = Tvio + 0.12;
const tHit = (n) => TV0 + largoRuta(VR.pts.slice(0, n + 2)) / VEL;
// un azul que rebota solo dos veces, para comparar, más suave
const AZR = [[-60, CA + 220], [MOLS[3][0] - Rm * 1.7, CA + 220], [MOLS[3][0] - 110, CA + 360], [-60, CA + 520]];

function escenaA(g, t) {
  const lleno = pulso(t, Treb + 0.2, 0.5);
  MOLS.forEach((m, i) => {
    const n = VR.hits.indexOf(i), glow = n >= 0 ? pulso(t, tHit(n), 0.1) : 0;
    molecula(g, m[0] + Math.sin(t * 1.3 + i) * 6, m[1] + Math.cos(t * 1.1 + i * 2) * 6, Rm, i * 0.9 + t * 0.5, 1, glow, VIO);
  });
  foton(g, VR.pts, (t - TV0) * VEL, VIO, 520, 190);
  foton(g, AZR, (t - (TV0 - 0.05)) * 1100, AZUL, 200, 110, 0.55);
  // el contador: cuántas veces rebota
  const n = VR.hits.filter((_, i) => t > tHit(i)).length;
  if (n > 0) k.pastilla(g, 540, CA - 330, String(n), n === 1 ? "rebote" : "rebotes", VIO, su(tr(t, tHit(0), tHit(0) + 0.15)), 120);
}

// ---- escena B: el Sol manda menos violeta
const CB = 1500;
function escenaB(g, t) {
  const ap = su(tr(t, TSol - 0.2, TSol + 0.3));
  sol(g, 770, CB - 250, 88 * ap, ap, 0.7);
  const haz = su(tr(t, Tda - 0.05, Tda + 0.45)), menos = su(tr(t, Tmenos - 0.1, Tmenos + 0.4));
  g.save(); g.globalCompositeOperation = "lighter";
  // el azul: ancho y fuerte
  const B = [[620, CB - 150], [720, CB - 120], [420, CB + 280], [250, CB + 240]];
  // el violeta: finísimo y apagado
  const Vi = [[800, CB - 130], [830, CB - 105], [560, CB + 300], [520, CB + 280]];
  const quad = (Q, col, al) => {
    const gr = g.createLinearGradient(Q[0][0], Q[0][1], Q[2][0], Q[2][1]); gr.addColorStop(0, `rgba(${col},${al})`); gr.addColorStop(1, `rgba(${col},${al * 0.6})`);
    g.fillStyle = gr; g.beginPath(); g.moveTo(Q[0][0], Q[0][1]);
    const e = haz; for (let i = 1; i < 4; i++) g.lineTo(mez(Q[0][0], Q[i][0], e), mez(Q[0][1], Q[i][1], e)); g.closePath(); g.fill();
  };
  quad(B, AZUL, 0.9); quad(Vi, VIO, mez(0.9, 0.5, menos));
  g.restore();
  // lo que llega: un charco de luz grande (azul) y uno pequeño y apagado (violeta)
  k.brillo(g, 340, CB + 300, 560, AZUL, 0.9 * haz);
  k.brillo(g, 545, CB + 320, mez(380, 150, menos), VIO, mez(0.8, 0.45, menos) * haz);
}

// ---- escena C: el ojo
const CC = 2250;
function ojo(g, cx, cy, t, azulLlega, vioLlega) {
  g.save(); g.translate(cx, cy);
  const alm = () => { g.beginPath(); g.moveTo(-420, 0); g.bezierCurveTo(-200, -300, 200, -300, 420, 0); g.bezierCurveTo(200, 300, -200, 300, -420, 0); g.closePath(); };
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 50; alm(); g.fillStyle = "#f3f5ff"; g.fill(); g.shadowBlur = 0;
  g.save(); alm(); g.clip();
  const sg = g.createRadialGradient(0, 0, 100, 0, 0, 440); sg.addColorStop(0, "rgba(255,255,255,0)"); sg.addColorStop(1, "rgba(110,120,170,0.55)"); g.fillStyle = sg; g.fillRect(-450, -320, 900, 640);
  // el iris
  const ig = g.createRadialGradient(0, 0, 40, 0, 0, 175); ig.addColorStop(0, "#5a9be0"); ig.addColorStop(0.6, "#2b6fb8"); ig.addColorStop(1, "#14365f");
  g.fillStyle = ig; g.beginPath(); g.arc(0, 0, 175, 0, 6.2832); g.fill();
  g.globalCompositeOperation = "screen"; g.strokeStyle = "rgba(180,220,255,0.35)"; g.lineWidth = 3;
  for (let i = 0; i < 36; i++) { const a = (i / 36) * 6.2832; g.beginPath(); g.moveTo(Math.cos(a) * 62, Math.sin(a) * 62); g.lineTo(Math.cos(a) * 168, Math.sin(a) * 168); g.stroke(); }
  g.globalCompositeOperation = "source-over";
  g.fillStyle = "#04060c"; g.beginPath(); g.arc(0, 0, 70, 0, 6.2832); g.fill();
  // la luz que entra, que enciende la pupila
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 0, 0, 440, AZUL, 0.95 * azulLlega); k.brillo(g, 0, 0, 440 * (0.5 + 0.5 * vioLlega), VIO, 0.5 * vioLlega);
  g.globalCompositeOperation = "source-over";
  g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.arc(-50, -60, 22, 0, 6.2832); g.fill();
  g.restore();
  alm(); g.strokeStyle = "#1a1030"; g.lineWidth = 16; g.lineJoin = "round"; g.stroke();
  g.restore();
}
function escenaC(g, t) {
  const ap = su(tr(t, Tojos - 0.3, Tojos + 0.2));
  const azulLlega = su(tr(t, Tojos + 0.1, Tven + 0.1)), vio = su(tr(t, Tven, Tpeor + 0.1)) * (1 - 0.8 * su(tr(t, Tpeor, Fin)));
  g.save(); g.globalAlpha = ap; ojo(g, 540, CC, t, azulLlega, 0.35 * vio); g.restore();
  // los dos rayos que llegan: el azul, grueso; el violeta, finito
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  const a = su(tr(t, Tojos + 0.05, Tven + 0.15)), b = su(tr(t, Tven - 0.05, Tpeor));
  g.strokeStyle = `rgba(${AZUL},${0.85 * a})`; g.lineWidth = 56; g.beginPath(); g.moveTo(-60, CC - 40); g.lineTo(mez(-60, 470, a), mez(CC - 40, CC - 8, a)); g.stroke();
  g.strokeStyle = `rgba(${VIO},${0.45 * b})`; g.lineWidth = 14; g.beginPath(); g.moveTo(-60, CC + 60); g.lineTo(mez(-60, 470, b), mez(CC + 60, CC + 10, b)); g.stroke();
  g.restore();
}

export function dibuja(g, t) {
  fondoNoche(g, "#0a0420", "#2b1166", 960);
  g.save(); g.translate(0, 960 - camY(t));
  g.save(); g.globalAlpha = 1 - su(tr(t, TSol - 0.45, TSol + 0.25)); escenaA(g, t); g.restore();
  escenaB(g, t); escenaC(g, t);
  g.restore();
  const vg = g.createLinearGradient(0, 200, 0, 650); vg.addColorStop(0, "rgba(10,4,32,0.6)"); vg.addColorStop(1, "rgba(10,4,32,0)"); g.fillStyle = vg; g.fillRect(0, 0, 1080, 650);
}
