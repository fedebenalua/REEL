// El parque, el tronco, el chorro y la puerta. El perro es el de perros/mundo.js.
import * as k from "#kit";
import { parque, perro, ponVista, posePataAlta, sinVista, velo, vineta } from "../../../perros/mundo.js";

const TAU = Math.PI * 2;
export { parque, perro, ponVista, sinVista, velo, vineta };

export const CHICO = { x: 0, s: 1 };
export const GRANDE = { x: -520, s: 1.48 };

export const troncoX = (quien) => quien.x + 52 * quien.s;
export const bordeTronco = (quien) => troncoX(quien) - 23 * quien.s;

// Dónde cae la pata levantada, sin dibujar (la cámara lo usa antes que el perro).
export function pataPrevista(quien, alta) {
  const p = posePataAlta(alta).P;
  return [quien.x + p[0] * quien.s, (p[1] + 1.4 * alta) * quien.s];
}
export function inglePrevista(quien) {
  return [quien.x + 8 * quien.s, -27 * quien.s];
}

const corteza = (() => {
  const w = 320, h = 980, l = k.lienzo(w, h), g = l.getContext("2d");
  const tg = g.createLinearGradient(0, 0, w, 0);
  tg.addColorStop(0, "#4a2814"); tg.addColorStop(0.18, "#a86a38"); tg.addColorStop(0.42, "#e0a56a");
  tg.addColorStop(0.62, "#8a4e28"); tg.addColorStop(1, "#2c160c");
  g.fillStyle = tg; g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.45;
  g.drawImage(k.manchas, 0, 0, w, h); g.drawImage(k.red, -20, 0, w + 40, h);
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  const az = k.azar(41);
  g.strokeStyle = "rgba(40,18,8,0.35)"; g.lineCap = "round";
  for (let i = 0; i < 16; i++) {
    const x = 24 + (i / 15) * (w - 48) + (az() - 0.5) * 10;
    g.lineWidth = 2 + az() * 3; g.beginPath(); g.moveTo(x, 0);
    for (let y = 0; y <= h; y += 40) g.lineTo(x + Math.sin(y * 0.02 + i) * 7, y);
    g.stroke();
  }
  // un brillo largo, del lado de la luz
  const lg = g.createLinearGradient(40, 0, 140, 0);
  lg.addColorStop(0, "rgba(255,220,170,0)"); lg.addColorStop(0.5, "rgba(255,226,180,0.45)"); lg.addColorStop(1, "rgba(255,220,170,0)");
  g.fillStyle = lg; g.fillRect(30, 0, 120, h);
  // musgo abajo
  g.globalAlpha = 0.85;
  for (let i = 0; i < 14; i++) {
    const x = 30 + az() * (w - 60), y = h - 30 - az() * 80, r = 10 + az() * 16;
    const mg = g.createRadialGradient(x, y, 1, x, y, r);
    mg.addColorStop(0, "#b6e06a"); mg.addColorStop(1, "rgba(40,90,30,0)");
    g.fillStyle = mg; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  }
  g.globalAlpha = 1;
  return l;
})();

const copa = (() => {
  const w = 640, h = 420, l = k.lienzo(w, h), g = l.getContext("2d");
  const az = k.azar(77);
  const blobs = [];
  for (let i = 0; i < 14; i++) blobs.push([80 + az() * (w - 160), 40 + az() * (h - 120), 50 + az() * 55]);
  for (const b of blobs) {
    const gr = g.createRadialGradient(b[0] - b[2] * 0.3, b[1] - b[2] * 0.35, b[2] * 0.1, b[0], b[1], b[2]);
    gr.addColorStop(0, "#d6f58a"); gr.addColorStop(0.45, "#3eae3a"); gr.addColorStop(1, "#146028");
    g.fillStyle = gr; g.beginPath(); g.arc(b[0], b[1], b[2], 0, TAU); g.fill();
  }
  g.globalAlpha = 0.9;
  for (let i = 0; i < 20; i++) {
    const b = blobs[i % blobs.length];
    g.fillStyle = i % 3 === 0 ? "#ffe27a" : "#ff8fb8";
    g.beginPath(); g.arc(b[0] + (az() - 0.5) * b[2], b[1] + (az() - 0.5) * b[2], 4.5, 0, TAU); g.fill();
  }
  g.globalAlpha = 1;
  return l;
})();

export function arbol(g, x, s = 1) {
  const alto = 430 * s, ancho = 54 * s;
  g.save();
  g.drawImage(copa, x - 150 * s, -alto - 70 * s, 300 * s, 200 * s);
  g.drawImage(corteza, x - ancho / 2, -alto, ancho, alto + 12);
  // la base, un poco de tierra
  g.fillStyle = "rgba(60,40,20,0.35)"; g.beginPath(); g.ellipse(x, 2, ancho * 0.7, 5 * s, 0, 0, TAU); g.fill();
  g.restore();
}

export function mancha(g, x, y, al, opts = {}) {
  if (al < 0.02) return;
  const fresco = opts.fresco ?? 1, sem = opts.sem ?? 1;
  g.save();
  g.globalAlpha *= al;
  g.fillStyle = fresco > 0.5 ? "rgba(120,78,20,0.55)" : "rgba(90,70,50,0.4)";
  g.beginPath(); g.ellipse(x + 1, y, 7.5 * (opts.s || 1), 14 * (opts.s || 1), 0.15, 0, TAU); g.fill();
  g.strokeStyle = fresco > 0.5 ? "rgba(255,214,70,0.95)" : "rgba(180,150,90,0.55)";
  g.lineWidth = 1.4; g.stroke();
  if (fresco > 0.4) {
    g.strokeStyle = "rgba(230,170,40,0.75)"; g.lineWidth = 1.8; g.lineCap = "round";
    g.beginPath(); g.moveTo(x, y + 10); g.quadraticCurveTo(x - 2, y + 22, x + 1, y + 30 + sem); g.stroke();
    k.brillo(g, x, y, 22 * (opts.s || 1), "255,200,60", 0.55 * fresco);
  }
  g.restore();
}

function puntoCurva(a, c, b, u) {
  const v = 1 - u;
  return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]];
}

// Chorro de oro, de la ingle a la corteza. al 0..1. No es un fogonazo: es el hilo que sigue ahí.
export function chorro(g, a, b, t, al = 1) {
  if (al < 0.03 || !a || !b) return;
  const arco = Math.min(a[1], b[1]) - 16 - Math.abs(b[0] - a[0]) * 0.15;
  const c = [(a[0] + b[0]) / 2 - 4, arco];
  g.save();
  g.globalAlpha *= al;
  g.lineCap = "round"; g.lineJoin = "round";
  g.strokeStyle = "rgba(255,170,30,0.4)"; g.lineWidth = 6.2;
  g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(c[0], c[1], b[0], b[1]); g.stroke();
  g.strokeStyle = "#fff3b0"; g.lineWidth = 2.3;
  g.setLineDash([4, 5.5]); g.lineDashOffset = -((t * 26) % 40);
  g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(c[0], c[1], b[0], b[1]); g.stroke();
  g.setLineDash([]);
  const az = k.azar(12);
  for (let i = 0; i < 7; i++) {
    const u = (i / 7 + t * 0.85) % 1;
    const p = puntoCurva(a, c, b, u);
    g.fillStyle = i % 2 ? "#ffe56a" : "#fff8d0";
    g.beginPath(); g.arc(p[0], p[1], 1.3 + az() * 0.8, 0, TAU); g.fill();
  }
  g.restore();
  // el salpicado, en el golpe
  g.save();
  g.globalAlpha *= al;
  const az2 = k.azar(91);
  for (let i = 0; i < 8; i++) {
    const ang = -2.4 + az2() * 2.2, u = (t * 1.3 + i * 0.17) % 1, lejos = (6 + az2() * 14) * u;
    g.fillStyle = "rgba(255,220,80,0.9)";
    g.beginPath(); g.arc(b[0] + Math.cos(ang) * lejos, b[1] + Math.sin(ang) * lejos * 0.65, 1.5 * (1 - u), 0, TAU); g.fill();
  }
  k.brillo(g, b[0], b[1], 26, "255,196,50", 0.8 * al);
  g.restore();
}

export function charco(g, x, y, al) {
  if (al < 0.02) return;
  g.save(); g.globalAlpha *= al;
  g.fillStyle = "rgba(230,170,40,0.55)"; g.beginPath(); g.ellipse(x, y, 16, 5.5, 0, 0, TAU); g.fill();
  g.fillStyle = "rgba(255,230,140,0.8)"; g.beginPath(); g.ellipse(x - 3, y - 1, 6, 2.2, 0, 0, TAU); g.fill();
  g.restore();
}

// El recibidor: pared, puerta y suelo. La raya se dibuja encima, en el plano.
const pared = (() => {
  const l = k.lienzo(64, 64), g = l.getContext("2d");
  g.fillStyle = "#ffe1c4"; g.fillRect(0, 0, 64, 64);
  g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 2;
  for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(0, i * 16); g.lineTo(64, i * 16); g.stroke(); }
  return l;
})();

export function recibidor(g, c) {
  sinVista(g);
  const cielo = g.createLinearGradient(0, 0, 0, 1920);
  cielo.addColorStop(0, "#ffd0a4"); cielo.addColorStop(0.45, "#fff6ea"); cielo.addColorStop(1, "#f0c49a");
  g.fillStyle = cielo; g.fillRect(0, 0, 1080, 1920);
  // sol de la ventana, a la izquierda
  k.brillo(g, 140, 620, 900, "255,214,150", 0.55);
  ponVista(g, c);
  // suelo de madera
  g.fillStyle = "#e7b56a"; g.fillRect(c.cx - 800, 0, 1600, 400);
  g.save(); g.beginPath(); g.rect(c.cx - 800, 0, 1600, 400); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.28; g.drawImage(k.red, c.cx - 400, 0, 800, 400);
  g.globalAlpha = 0.35; g.strokeStyle = "rgba(120,70,30,0.5)"; g.lineWidth = 1.2;
  for (let x = c.cx - 800; x < c.cx + 800; x += 28) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 40, 400); g.stroke(); }
  g.restore();
  // zócalo
  g.fillStyle = "#fffaf4"; g.fillRect(c.cx - 800, -8, 1600, 10);
}

export function puerta(g, x) {
  const w = 78, h = 168, iz = x - w / 2;
  // marco
  g.fillStyle = "#fffdf8"; g.fillRect(iz - 8, -h - 8, w + 16, h + 16);
  g.fillStyle = "#f4efe6"; g.fillRect(iz - 5, -h - 5, w + 10, 8);
  // hoja
  const pg = g.createLinearGradient(iz, 0, iz + w, 0);
  pg.addColorStop(0, "#ffb067"); pg.addColorStop(0.4, "#f0833a"); pg.addColorStop(1, "#c4541c");
  g.fillStyle = pg; k.redondo(g, iz, -h, w, h, 4); g.fill();
  // vidrio
  g.fillStyle = "#b9e6ff"; g.fillRect(iz + 14, -h + 16, w - 28, 52);
  g.fillStyle = "rgba(255,255,255,0.45)"; g.fillRect(iz + 18, -h + 20, 16, 40);
  // paneles
  g.strokeStyle = "rgba(120,40,10,0.35)"; g.lineWidth = 2;
  g.strokeRect(iz + 12, -h + 80, w - 24, 36);
  g.strokeRect(iz + 12, -h + 122, w - 24, 32);
  // pomo
  const pg2 = g.createRadialGradient(iz + w - 16, -h + 96, 1, iz + w - 16, -h + 96, 6);
  pg2.addColorStop(0, "#fff4c4"); pg2.addColorStop(1, "#e0a020");
  g.fillStyle = pg2; g.beginPath(); g.arc(iz + w - 16, -h + 96, 4.2, 0, TAU); g.fill();
  // una planta, al otro lado, para que haya color
  const mx = x - 78;
  g.fillStyle = "#f07a3a"; g.fillRect(mx - 10, -16, 20, 16);
  g.fillStyle = "#2f9a3a";
  for (const [dx, dy, r] of [[0, -28, 12], [-10, -20, 9], [10, -22, 9], [0, -40, 8]]) {
    g.beginPath(); g.arc(mx + dx, dy, r, 0, TAU); g.fill();
  }
}

export function raya(g, x, y, al, ancho = 54) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha *= al;
  g.strokeStyle = "#ff3d6e"; g.lineWidth = 2.4; g.lineCap = "round";
  g.beginPath(); g.moveTo(x, y); g.lineTo(x + ancho, y); g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 0.8;
  g.beginPath(); g.moveTo(x, y - 0.8); g.lineTo(x + ancho * 0.7, y - 0.8); g.stroke();
  g.restore();
}

export function marco(g) {
  vineta(g, 0.32);
  velo(g, 0.62);
}
