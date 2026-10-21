// «Envíaselo a ese amigo que siempre pierde el mando.»
// Otro sitio: el sofá, de cerca, con el mando (el de antes) atascado entre los cojines. Se entra con un corte en
// «Envíaselo». Una sola cámara, que se acerca despacio.
// - «Envíaselo a ese amigo»: el mando asoma la punta entre los cojines, con la tele alumbrando el sofá desde arriba.
// - «que siempre pierde»: una mano entra rebuscando entre los cojines y va sacando cosas (una moneda, un bolígrafo,
//   palomitas), todo menos el mando.
// - «el mando»: la mano se retira y el mando, ahí delante, se asoma un poco más y destella la lucecita.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta, tejido } from "../mundo.js";
import { mandoHoy, IR } from "../objetosHoy.js";

export const desde = (vz) => vz.frase(11).inicio;

const { suave: su, tramo: tr, mez, azar, redondo } = k;
const f = v.frase(11);
const T0 = f.inicio, Tamigo = f.t("amigo"), Tsiem = f.t("siempre"), Tpierde = f.t("pierde"), Tmando = f.t("mando"), Tfin = v.duracion;

const cam = camino2D([[T0, [1.0, 540, 960]], [Tfin, [1.1, 540, 1000]]]);

// un cojín con su borde, su luz y su tela. Centrado en (0,0), de w × h.
function cojin(g, w, h, r, c0, c1, c2) {
  g.save();
  g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = 40; g.shadowOffsetY = 22;
  redondo(g, -w / 2, -h / 2, w, h, r); g.fillStyle = c2; g.fill(); g.shadowColor = "rgba(0,0,0,0)";
  redondo(g, -w / 2, -h / 2, w, h, r);
  const gr = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); gr.addColorStop(0, c0); gr.addColorStop(0.55, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fill();
  g.save(); redondo(g, -w / 2, -h / 2, w, h, r); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.28; g.drawImage(tejido, -w / 2, -h / 2, w, h);
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  const hl = g.createRadialGradient(-w * 0.22, -h * 0.28, 10, -w * 0.1, -h * 0.1, w * 0.7); hl.addColorStop(0, "rgba(255,255,255,0.26)"); hl.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = hl; g.fillRect(-w / 2, -h / 2, w, h);
  g.restore();
  redondo(g, -w / 2 + 2, -h / 2 + 2, w - 4, h - 4, r); g.strokeStyle = "rgba(255,255,255,0.2)"; g.lineWidth = 4; g.stroke();
  g.restore();
}

// lo que sale volando: moneda, bolígrafo, palomitas, clip
const AZ = azar(404);
const COSAS = [
  { t0: Tamigo + 0.5, tipo: "moneda", x: 330, y: 1130, vx: -260, vy: -1250 },
  { t0: Tsiem + 0.05, tipo: "boli", x: 300, y: 1140, vx: 330, vy: -1350 },
  { t0: Tsiem + 0.45, tipo: "palomita", x: 290, y: 1130, vx: -420, vy: -1180 },
  { t0: Tpierde + 0.05, tipo: "palomita", x: 280, y: 1130, vx: 120, vy: -1450 },
  { t0: Tpierde + 0.3, tipo: "moneda", x: 300, y: 1140, vx: 520, vy: -1100 },
  { t0: Tpierde + 0.5, tipo: "palomita", x: 270, y: 1135, vx: -150, vy: -1300 },
].map((c) => ({ ...c, giro: (AZ() - 0.5) * 14 }));
function cosa(g, c, t) {
  const d = t - c.t0; if (d < 0) return;
  const x = c.x + c.vx * d, y = c.y + c.vy * d + 0.5 * 2900 * d * d;
  if (y > 1700) return;
  g.save(); g.translate(x, y); g.rotate(c.giro * d);
  if (c.tipo === "moneda") { g.beginPath(); g.ellipse(0, 0, 34, Math.abs(34 * Math.cos(c.giro * d * 1.3)) + 4, 0, 0, 6.2832); const cg = g.createRadialGradient(-8, -8, 2, 0, 0, 36); cg.addColorStop(0, "#fff3b0"); cg.addColorStop(1, "#c98a1a"); g.fillStyle = cg; g.fill(); g.strokeStyle = "#8a5a0a"; g.lineWidth = 4; g.stroke(); }
  else if (c.tipo === "boli") { redondo(g, -70, -9, 140, 18, 9); const bg = g.createLinearGradient(0, -9, 0, 9); bg.addColorStop(0, "#5aa8ff"); bg.addColorStop(1, "#1a4a9a"); g.fillStyle = bg; g.fill(); g.fillStyle = "#e8ecf1"; g.fillRect(52, -7, 20, 14); }
  else { for (const [dx, dy, r] of [[-12, 4, 17], [12, 6, 15], [0, -12, 16]]) { g.beginPath(); g.arc(dx, dy, r, 0, 6.2832); const pg = g.createRadialGradient(dx - 5, dy - 5, 2, dx, dy, r); pg.addColorStop(0, "#fffdf0"); pg.addColorStop(1, "#e8c870"); g.fillStyle = pg; g.fill(); } }
  g.restore();
}

// la mano que rebusca, desde la izquierda
function mano(g, t, al) {
  if (al <= 0.01) return;
  const wig = Math.sin(t * 15) * 14, hx = mez(-120, 235, su(tr(t, Tamigo + 0.1, Tamigo + 0.45))) + wig * 0.5, hy = 1120 + Math.sin(t * 11) * 12;
  const sa = mez(0, 1, al);
  g.save(); g.translate(-900 * (1 - sa), 700 * (1 - sa));
  g.lineCap = "round";
  g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 140; g.beginPath(); g.moveTo(-420, 1750); g.lineTo(hx - 120, hy + 50); g.stroke();
  g.strokeStyle = "#e0a53a"; g.lineWidth = 128; g.beginPath(); g.moveTo(-420, 1750); g.lineTo(hx - 120, hy + 50); g.stroke();
  g.fillStyle = "#c98a45"; g.beginPath(); g.ellipse(hx - 70, hy + 30, 70, 60, -0.4, 0, 6.2832); g.fill();
  const pg = g.createLinearGradient(0, hy - 60, 0, hy + 60); pg.addColorStop(0, "#f6cba4"); pg.addColorStop(1, "#dc9f78");
  g.fillStyle = pg; g.beginPath(); g.ellipse(hx - 20, hy, 78, 62, -0.3, 0, 6.2832); g.fill();
  for (let i = 0; i < 4; i++) { g.strokeStyle = "rgba(60,25,10,0.35)"; g.lineWidth = 36; g.beginPath(); g.moveTo(hx + 30, hy - 30 + i * 22); g.lineTo(hx + 100 + wig, hy - 36 + i * 22); g.stroke(); g.strokeStyle = pg; g.lineWidth = 31; g.beginPath(); g.moveTo(hx + 30, hy - 30 + i * 22); g.lineTo(hx + 100 + wig, hy - 36 + i * 22); g.stroke(); }
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // la pared, con la luz azul de la tele
  const bg = g.createLinearGradient(0, -200, 0, 900); bg.addColorStop(0, "#0a1630"); bg.addColorStop(1, "#050810"); g.fillStyle = bg; g.fillRect(-300, -400, 1680, 1400);
  k.brillo(g, 540, 40, 2200, "90,150,255", 0.5);
  // el sofá y sus cojines de respaldo
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 60;
  redondo(g, -80, 520, 1240, 1200, 90); const sg = g.createLinearGradient(0, 520, 0, 1700); sg.addColorStop(0, "#1d6070"); sg.addColorStop(1, "#0a2a34"); g.fillStyle = sg; g.fill(); g.restore();
  g.save(); g.translate(285, 880); g.rotate(-0.04); cojin(g, 500, 520, 90, "#ffd070", "#e0a53a", "#8a5a14"); g.restore();
  g.save(); g.translate(800, 890); g.rotate(0.05); cojin(g, 500, 520, 90, "#ff9a7a", "#e0583a", "#7a2410"); g.restore();
  // la grieta oscura entre el respaldo y el asiento
  const gr = g.createLinearGradient(0, 1060, 0, 1180); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.5, "rgba(0,0,0,0.85)"); gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr; g.fillRect(-80, 1040, 1240, 160);
  // el mando, asomando, un poco más en «mando»
  const asoma = su(tr(t, Tmando - 0.05, Tmando + 0.45)) * 40;
  g.save(); g.translate(540, 700 - asoma); g.rotate(0.13); g.scale(0.74, 0.74); g.translate(0, -260);
  const dest = k.pulso(t, Tmando + 0.18, 0.1);
  mandoHoy(g, t, { led: dest });
  g.restore();
  // los cojines del asiento, delante del mando
  g.save(); g.translate(270, 1370); g.rotate(-0.012 - 0.02 * su(tr(t, Tamigo + 0.2, Tamigo + 0.5)) * Math.abs(Math.sin(t * 12)) * (t < Tmando - 0.1 ? 1 : 0)); cojin(g, 560, 470, 100, "#3a9aa8", "#25707e", "#0f3a44"); g.restore();
  g.save(); g.translate(810, 1370); g.rotate(0.01); cojin(g, 560, 470, 100, "#3a9aa8", "#25707e", "#0f3a44"); g.restore();
  // lo que sale volando y la mano
  for (const c of COSAS) cosa(g, c, t);
  mano(g, t, su(tr(t, Tamigo + 0.05, Tamigo + 0.4)) * (1 - su(tr(t, Tmando - 0.35, Tmando + 0.1))));
  sinVista(g);
  const d = t - (Tmando + 0.18);
  if (d > 0) k.fogonazo(g, 540 + 14, 760 - 50, d, 420, "255,170,190");
  velo(g, 0.5);
  vineta(g, 0.5);
}

export const momentos = { destello: Tmando + 0.18 };
