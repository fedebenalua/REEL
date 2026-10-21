// «En Londres lo probaron con un robot: tú mueves una palanca, y él te pasa una espuma por la mano. Si va a la vez,
// casi nada. Si va dos décimas tarde, lo que dura un parpadeo, sí hace cosquillas.»
// Otro sitio: la mesa del laboratorio, vista desde arriba, con una sola cámara. Corte en «En».
// - «Londres»: la mesa con su lámpara; arriba tu mano izquierda (pijama) en la palanca, abajo tu palma derecha.
// - «robot»: el brazo del robot se despliega sobre tu palma con un trozo de espuma azul.
// - «palanca»: tu mano la mueve de un lado a otro; «espuma»: la espuma barre tu palma a la vez.
// - «a la vez»: el marcador dice «0 s»; la palma tranquila. «dos décimas»: el marcador pasa a «0,2 s» y la espuma va
//   detrás de donde debería (su fantasma cian, que va a la vez que la palanca, es lo que espera tu cerebro).
// - «parpadeo»: la pantalla parpadea (unos párpados la cierran y la abren). «sí hace cosquillas»: la palma se encoge y
//   saltan chispas. Todo se calma antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, palma, puno, chispas, velo, camino2D, CIAN } from "../mundo.js";

export const desde = (v) => v.frase(7).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f7 = v.frase(7), f8 = v.frase(8);
const T0 = f7.inicio, Tlon = f7.t("londres"), Trob = f7.t("robot"), Tmue = f7.t("mueves"), Tpal = f7.t("palanca"), Tesp = f7.t("espuma");
const Tvez = f8.t("vez"), Tnada = f8.t("nada"), Tdos = f8.t("dos"), Tdec = f8.t("decimas"), Tpar = f8.t("parpadeo"), Tsi = f8.t("si", 2), Tcos = f8.t("cosquillas"), Fin = v.frase(9).inicio;

// ---------------------------------------------------------------- dónde está cada cosa (mundo)
const PALMA = [-10, 1080];            // la muñeca de tu mano derecha; el centro de la palma, unos 200 más arriba
const CENTRO = [-10, 860];            // donde barre la espuma
const PAL = [-230, -40];             // el eje de la palanca
const BASE = [430, 330];              // la base del robot
const L1 = 400, L2 = 360;

// el movimiento: la palanca va de un lado a otro desde «mueves»; la espuma la sigue con el retraso
const anda = (t) => su(tr(t, Tmue - 0.1, Tmue + 0.35)) * (1 - su(tr(t, Fin - 1.0, Fin - 0.45)));
const fase = (t) => Math.sin(2 * Math.PI * 1.5 * t);
const lado = (t) => anda(t) * fase(t);                              // de -1 a 1
const retraso = (t) => 0.2 * su(tr(t, Tdec - 0.1, Tdec + 0.2));
const espumaOn = (t) => su(tr(t, Tesp - 0.25, Tesp + 0.1));
const foam = (t) => { const d = retraso(t), s = lado(t - d) * espumaOn(t); return [CENTRO[0] + 150 * s, CENTRO[1] - 20 * Math.abs(s)]; };
const fantasma = (t) => [CENTRO[0] + 150 * lado(t), CENTRO[1] - 20 * Math.abs(lado(t))];
// el robot se despliega en «robot»: de plegado junto a su base a con la espuma sobre la palma
const despliega = (t) => k.entra(tr(t, Trob - 0.3, Trob + 0.5));
const PLEGADO = [BASE[0] + 80, BASE[1] - 300];
const objetivo = (t) => { const u = despliega(t), f = foam(t); return [mez(PLEGADO[0], f[0], u), mez(PLEGADO[1], f[1] - 150, u)]; };
// las cosquillas: solo con retraso, y del todo en «sí hace cosquillas»
const cosq = (ts) => retraso(ts) / 0.2 * mez(0.25, 1, su(tr(ts, Tsi - 0.1, Tcos))) * anda(ts) * (1 - su(tr(ts, Tcos + 0.3, Fin - 1.05)));

const cam = camino2D([
  [T0, [0.7, 20, 440]], [Trob - 0.2, [0.72, 40, 430]], [Trob + 0.5, [0.76, 60, 430]],
  [Tmue - 0.1, [0.95, -130, 150]], [Tpal + 0.4, [0.95, -130, 130]],
  [Tesp - 0.1, [0.95, 0, 600]], [Tvez, [0.92, 0, 520]], [Tdos - 0.1, [0.95, 0, 560]], [Tcos, [1.15, 0, 720]], [Fin, [1.18, 0, 730]],
]);

// ---------------------------------------------------------------- la mesa
const vetas = k.ruido(512, 707, 4, 3, "lineas");
function mesa(g, t) {
  g.save(); sinVista(g);
  g.fillStyle = "#0d2a33"; g.fillRect(0, 0, 1080, 1920);
  g.restore();
  // el tablero, verde azulado de laboratorio, con una cuadrícula y la luz de la lámpara
  g.fillStyle = "#14525a"; g.fillRect(-1400, -1400, 2800, 3600);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(vetas, -1400, -1400, 2800, 3600); g.restore();
  g.strokeStyle = "rgba(160,240,230,0.1)"; g.lineWidth = 3;
  for (let x = -1400; x <= 1400; x += 160) { g.beginPath(); g.moveTo(x, -1400); g.lineTo(x, 2200); g.stroke(); }
  for (let y = -1400; y <= 2200; y += 160) { g.beginPath(); g.moveTo(-1400, y); g.lineTo(1400, y); g.stroke(); }
  const lu = g.createRadialGradient(0, 350, 100, 0, 350, 1500); lu.addColorStop(0, "rgba(255,226,170,0.38)"); lu.addColorStop(0.5, "rgba(255,200,140,0.12)"); lu.addColorStop(1, "rgba(0,10,20,0.55)");
  g.fillStyle = lu; g.fillRect(-1400, -1400, 2800, 3600);
}

// ---------------------------------------------------------------- piezas de metal
const BLANCO = ["#8a96a3", "#f6f8fb", "#c9d2dc", "#ffffff", "#7d8995"], NARANJA = ["#a34a12", "#ffb46a", "#e8752a", "#ffd0a0", "#8c3c0c"];
function eslabon(g, a, b, w, tono) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  g.save(); g.translate(a[0], a[1]); g.rotate(Math.atan2(dy, dx));
  g.save(); g.shadowColor = "rgba(0,10,15,0.55)"; g.shadowBlur = 40; g.shadowOffsetX = 25; g.shadowOffsetY = 35;
  k.redondo(g, -w / 2, -w / 2, L + w, w, w / 2); g.fillStyle = tono[0]; g.fill(); g.restore();
  k.redondo(g, -w / 2, -w / 2, L + w, w, w / 2);
  g.save(); g.rotate(Math.PI / 2); g.translate(0, 0); g.restore();
  const gr = g.createLinearGradient(0, -w / 2, 0, w / 2);
  gr.addColorStop(0, tono[4]); gr.addColorStop(0.2, tono[1]); gr.addColorStop(0.45, tono[2]); gr.addColorStop(0.6, tono[3]); gr.addColorStop(1, tono[0]);
  g.fillStyle = gr; g.fill();
  g.restore();
}
function junta(g, p, r) {
  g.beginPath(); g.arc(p[0], p[1], r, 0, 6.2832);
  const gr = g.createRadialGradient(p[0] - r * 0.35, p[1] - r * 0.35, r * 0.1, p[0], p[1], r);
  gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.5, "#9aa6b2"); gr.addColorStop(1, "#3d4650");
  g.fillStyle = gr; g.fill();
  g.beginPath(); g.arc(p[0], p[1], r * 0.4, 0, 6.2832); g.fillStyle = "#2a3038"; g.fill();
}
// la espuma: un trozo azul, mullido, con sus poros
const poros = k.ruido(128, 919, 12, 2, "manchas");
function espuma(g, x, y, al = 1, color = null) {
  g.save(); g.globalAlpha *= al;
  k.redondo(g, x - 70, y - 48, 140, 96, 42);
  if (color) { g.fillStyle = `rgba(${color},0.25)`; g.fill(); g.strokeStyle = `rgba(${color},0.9)`; g.lineWidth = 6; g.setLineDash([16, 12]); g.stroke(); g.restore(); return; }
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 30; g.shadowOffsetY = 26; g.fillStyle = "#2f7fe0"; g.fill(); g.restore();
  const gr = g.createRadialGradient(x - 25, y - 20, 5, x, y, 90); gr.addColorStop(0, "#9fd2ff"); gr.addColorStop(0.6, "#3b8ff0"); gr.addColorStop(1, "#1a4fa8");
  g.fillStyle = gr; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.55; g.drawImage(poros, x - 70, y - 48, 140, 96); g.restore();
  g.restore();
}

// ---------------------------------------------------------------- el parpadeo
function parpado(g, cierre) {
  if (cierre <= 0.001) return;
  g.save(); sinVista(g);
  const h = 980 * cierre;
  for (const s of [1, -1]) {
    g.save(); if (s < 0) { g.translate(0, 1920); g.scale(1, -1); }
    g.beginPath(); g.moveTo(-50, -10); g.lineTo(1130, -10); g.lineTo(1130, h - 60); g.quadraticCurveTo(540, h + 90, -50, h - 60); g.closePath();
    const gr = g.createLinearGradient(0, h - 300, 0, h + 60); gr.addColorStop(0, "#c98a72"); gr.addColorStop(0.8, "#a2604e"); gr.addColorStop(1, "#5a2c26");
    g.fillStyle = gr; g.fill();
    // las pestañas
    g.strokeStyle = "#1a0e0c"; g.lineWidth = 6; g.lineCap = "round";
    for (let i = 0; i <= 26; i++) { const x = -20 + i * 43, yb = h - 60 + 150 * (1 - Math.pow((x - 540) / 590, 2)) * 0.5; g.beginPath(); g.moveTo(x, yb); g.quadraticCurveTo(x + 8, yb + 30, x + 18 * Math.sign(x - 540 || 1), yb + 55); g.stroke(); }
    g.restore();
  }
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  mesa(g, t);
  // el cable de la palanca al robot, con datos que corren
  g.save(); g.lineCap = "round";
  g.strokeStyle = "#0a1418"; g.lineWidth = 26; g.beginPath(); g.moveTo(PAL[0], PAL[1]); g.bezierCurveTo(-650, 250, 750, -150, BASE[0], BASE[1]); g.stroke();
  g.strokeStyle = "#283a42"; g.lineWidth = 14; g.stroke();
  g.restore();
  // tu palma derecha (pijama)
  const q = Math.max(cosq(t), cosq(t - 0.1));
  g.save(); g.translate(PALMA[0], PALMA[1]); palma(g, t, { encoge: q * 0.8, agita: q }); g.restore();
  // la palanca: su base, el palo y tu mano izquierda que la mueve
  const ax = PAL[0] + 150 * lado(t), ay = PAL[1] - 120;
  g.save(); g.beginPath(); g.ellipse(PAL[0], PAL[1], 170, 120, 0, 0, 6.2832); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 40; g.shadowOffsetY = 30; g.fillStyle = "#2a3540"; g.fill(); g.restore();
  g.beginPath(); g.ellipse(PAL[0], PAL[1], 170, 120, 0, 0, 6.2832); k.metal(g, PAL[0] - 170, PAL[0] + 170, ["#3a4652", "#c8d2dc", "#6f7c88", "#e8eef4", "#33404c"]);
  eslabon(g, PAL, [ax, ay], 34, BLANCO);
  g.save(); g.translate(ax, ay); g.rotate(2.5); puno(g, "pijama", 0.85, 0); g.restore();
  // el robot: base, dos brazos y la muñeca con la espuma
  const T = objetivo(t), dx = T[0] - BASE[0], dy = T[1] - BASE[1], D = Math.min(L1 + L2 - 1, Math.hypot(dx, dy));
  const a = Math.atan2(dy, dx), b = Math.acos((L1 * L1 + D * D - L2 * L2) / (2 * L1 * D)), codo = [BASE[0] + L1 * Math.cos(a - b), BASE[1] + L1 * Math.sin(a - b)];
  g.save(); g.beginPath(); g.arc(BASE[0], BASE[1], 130, 0, 6.2832); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 50; g.shadowOffsetY = 30; g.fillStyle = "#333d48"; g.fill(); g.restore();
  g.beginPath(); g.arc(BASE[0], BASE[1], 130, 0, 6.2832); k.metal(g, BASE[0] - 130, BASE[0] + 130, ["#3a4652", "#c8d2dc", "#6f7c88", "#e8eef4", "#33404c"]);
  // el fantasma de la espuma (donde la espera tu cerebro), cuando hay retraso
  const fa = retraso(t) / 0.2 * anda(t) * (1 - su(tr(t, Tpar - 0.1, Tpar + 0.1))) ;
  const F = fantasma(t); if (fa > 0.01) { espuma(g, F[0], F[1], fa, CIAN); }
  const P = foam(t), u = despliega(t);
  eslabon(g, BASE, codo, 92, NARANJA); junta(g, BASE, 70);
  eslabon(g, codo, T, 74, BLANCO); junta(g, codo, 56);
  // la muñeca baja hasta la espuma
  const E = [mez(T[0], P[0], u), mez(T[1] + 40, P[1], u)];
  eslabon(g, T, [E[0], E[1] - 40], 40, BLANCO); junta(g, T, 40);
  espuma(g, E[0], E[1], 1);
  // las chispas de las cosquillas, donde toca la espuma
  chispas(g, t, (ts) => { const p = foam(ts); return [p[0], p[1] + 20]; }, cosq, { escala: 1.3, sem: 303 });
  sinVista(g);
  // los rótulos: dónde y cuándo; el retraso
  const lon = su(tr(t, Tlon - 0.1, Tlon + 0.2)) * (1 - su(tr(t, Trob + 0.6, Trob + 0.9)));
  if (lon > 0) k.etiqueta(g, 330, 560, "Londres · 1999", "255,220,150", lon, 52);
  const mr = su(tr(t, Tvez - 0.45, Tvez - 0.2)) * (1 - su(tr(t, Tpar - 0.05, Tpar + 0.05))) + su(tr(t, Tpar + 0.25, Tpar + 0.4)) * (1 - su(tr(t, Tcos + 0.5, Fin - 0.4)));
  const conRetraso = t > Tdec - 0.05;
  if (mr > 0) k.pastilla(g, 540, 640, conRetraso ? "0,2" : "0", "s", conRetraso ? "255,120,170" : "160,255,200", mr, 104);
  // el parpadeo
  const cierra = k.pulso(t, Tpar + 0.12, 0.09);
  parpado(g, Math.min(1, cierra * 1.15));
  velo(g, 0.45, "4,16,20");
}

export const momentos = { robot: Trob, parpadeo: Tpar, cosquillas: Tcos };
