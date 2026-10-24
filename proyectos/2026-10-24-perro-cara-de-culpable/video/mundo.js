// Lo que comparten los planos de este vídeo: el salón, el perro (de frente y sentado), el cojín destrozado, la galleta y
// la gente. Todo sale de perros/mundo.js; aquí solo lo que es de este vídeo.
import * as k from "#kit";
import { perroFrente, persona } from "../../../perros/mundo.js";
export * from "../../../perros/mundo.js";

const TAU = Math.PI * 2;
const { azar } = k;

// El sitio donde se sienta el perro (sobre la alfombra del salón) y donde caen las cosas.
export const OX = 420;
export const COJIN_X = 322;
export const GALLETA_X = 486;

const lin = (g, x0, y0, x1, y1, a, b) => { const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); return gr; };

// ---------------------------------------------------------------- el cojín del sofá, hecho trizas
export function cojinRoto(g, x, y = 0) {
  g.save(); g.translate(x, y);
  g.save(); g.globalAlpha = 0.3; g.fillStyle = "#3a1a10"; g.beginPath(); g.ellipse(2, 2, 54, 7, 0, 0, TAU); g.fill(); g.restore();
  // trozos de tela por el suelo
  g.fillStyle = "#e7694b";
  for (const [dx, dy, r, s] of [[-62, -1.5, 0.3, 1], [58, -1, -0.5, 0.8], [-70, -1, 0.9, 0.7], [66, -1.6, 0.2, 0.9]]) {
    g.save(); g.translate(dx, dy); g.rotate(r); g.scale(s, s); g.beginPath(); g.moveTo(-8, 1); g.lineTo(0, -4); g.lineTo(9, 1); g.closePath(); g.fill(); g.restore();
  }
  // el cuerpo del cojín, tumbado
  g.beginPath(); g.moveTo(-46, -6); g.bezierCurveTo(-44, -20, -16, -27, 4, -26); g.bezierCurveTo(28, -26, 46, -19, 48, -6); g.bezierCurveTo(46, 1, 30, 3, 0, 3); g.bezierCurveTo(-30, 3, -44, 1, -46, -6); g.closePath();
  g.fillStyle = lin(g, -40, -26, 40, 4, "#ffb090", "#cf4a33"); g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.18; g.drawImage(k.manchas, -50, -30, 100, 36); g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  g.strokeStyle = "rgba(255,230,210,0.5)"; g.lineWidth = 2; g.beginPath(); g.moveTo(-44, -8); g.bezierCurveTo(-30, -22, 10, -25, 44, -12); g.stroke();
  g.restore();
  // el roto, con el relleno saliendo
  g.beginPath(); g.moveTo(-14, -24); g.lineTo(-8, -17); g.lineTo(-2, -25); g.lineTo(4, -15); g.lineTo(10, -24); g.lineTo(16, -14); g.lineTo(6, -9); g.lineTo(-10, -9); g.closePath();
  g.fillStyle = "#7d2416"; g.fill();
  const puf = [[-10, -24, 9], [0, -29, 11], [10, -26, 9], [-3, -21, 8], [-16, -19, 6], [17, -20, 6]];
  for (const [px, py, r] of puf) {
    const gr = g.createRadialGradient(px - r * 0.3, py - r * 0.4, 0, px, py, r); gr.addColorStop(0, "#ffffff"); gr.addColorStop(1, "#e7e0d6");
    g.fillStyle = gr; g.beginPath(); g.arc(px, py, r, 0, TAU); g.fill();
  }
  g.restore();
}

// ---------------------------------------------------------------- las plumas del relleno, flotando y posándose
const PLUMAS = (() => {
  const az = azar(5151), L = [];
  for (let i = 0; i < 46; i++) {
    L.push({ x0: COJIN_X - 20 + az() * 60, y0: -30 - az() * 20, vx: (az() - 0.45) * 70, vy: -(30 + az() * 80), tb: -(0.2 + az() * 1.1), caida: 16 + az() * 14, sway: 6 + az() * 9, w: 2.4 + az() * 2, ph: az() * TAU, rot: az() * TAU, rest: -1 - az() * 5, restX: (az() - 0.5) * 60, s: 0.8 + az() * 0.7 });
  }
  return L;
})();
// Estallan al principio (antes del vídeo) y se van posando. alpha: para quitarlas del todo.
export function plumas(g, t, alpha = 1) {
  if (alpha <= 0.01) return;
  g.save(); g.globalAlpha *= alpha;
  for (const p of PLUMAS) {
    const e = t - p.tb;
    // un empujón hacia arriba que se frena, y luego cae despacio de un lado a otro
    const lanza = 1 - Math.exp(-e * 2.2);
    const px0 = p.x0 + p.vx * lanza * 0.6, py0 = p.y0 + p.vy * lanza * 0.7;
    const cae = Math.max(0, e - 0.6) * p.caida;
    let X = px0 + Math.sin(e * p.w + p.ph) * p.sway * Math.min(1, e), Y = py0 + cae;
    let rot = p.rot + Math.sin(e * p.w + p.ph) * 0.8;
    const suelo = p.rest;
    if (Y >= suelo) { Y = suelo; X = px0 + Math.sin(e * 0.5) * 0 + p.restX * 0.05; rot = p.rot * 0.2; }
    g.save(); g.translate(X, Y); g.rotate(rot); g.scale(p.s, p.s);
    g.fillStyle = "#fffaf0"; g.beginPath(); g.ellipse(0, 0, 5.2, 1.7, 0, 0, TAU); g.fill();
    g.strokeStyle = "rgba(190,175,150,0.8)"; g.lineWidth = 0.5; g.beginPath(); g.moveTo(-5, 0); g.lineTo(5, 0); g.stroke();
    g.restore();
  }
  g.restore();
}

// ---------------------------------------------------------------- la galleta
// En su plato, en el suelo. mordida: 0 entera .. 1 comida (solo quedan migas). destello: 0..1 un brillo que la señala.
export function galleta(g, x, y = 0, o = {}) {
  const { s = 1, comida = 0, destello = 0, t = 0 } = o;
  g.save(); g.translate(x, y); g.scale(s, s);
  g.save(); g.globalAlpha = 0.28; g.fillStyle = "#3a1a10"; g.beginPath(); g.ellipse(0, 1.5, 24, 4, 0, 0, TAU); g.fill(); g.restore();
  // el plato
  g.fillStyle = lin(g, -22, -4, 22, 2, "#ffffff", "#c9d2dd"); g.beginPath(); g.ellipse(0, -1.5, 22, 5.2, 0, 0, TAU); g.fill();
  g.fillStyle = "#eef2f7"; g.beginPath(); g.ellipse(0, -2.4, 15.5, 3.4, 0, 0, TAU); g.fill();
  if (comida < 0.5) {
    const gr = g.createLinearGradient(-14, -22, 14, -4); gr.addColorStop(0, "#f0c070"); gr.addColorStop(1, "#b9742c");
    g.fillStyle = gr; g.beginPath(); g.ellipse(0, -9.5, 13.5, 11.5, 0, 0, TAU); g.fill();
    g.save(); g.beginPath(); g.ellipse(0, -9.5, 13.5, 11.5, 0, 0, TAU); g.clip();
    g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.manchas, -16, -22, 32, 26); g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
    g.fillStyle = "rgba(255,240,200,0.5)"; g.beginPath(); g.ellipse(-5, -14.5, 6, 3, -0.4, 0, TAU); g.fill();
    g.fillStyle = "#4a2a14";
    for (const [cx, cy, r] of [[-5, -12, 2.2], [4, -14, 2], [5, -6, 2.3], [-7, -6, 1.8], [0, -9, 2.1], [8, -10, 1.5], [-2, -16, 1.4]]) { g.beginPath(); g.ellipse(cx, cy, r, r * 0.8, 0.3, 0, TAU); g.fill(); }
    g.restore();
    g.strokeStyle = "rgba(120,70,20,0.55)"; g.lineWidth = 1.2; g.beginPath(); g.ellipse(0, -9.5, 13.5, 11.5, 0, 0.2, Math.PI * 0.95); g.stroke();
  } else {
    g.fillStyle = "#c98a45";
    for (const [cx, cy, r] of [[-8, -4, 1.6], [-2, -3.4, 1.2], [5, -4.4, 1.8], [10, -3.6, 1.1], [-12, -3, 1], [1, -5, 1]]) { g.beginPath(); g.ellipse(cx, cy, r, r * 0.7, 0, 0, TAU); g.fill(); }
    g.fillStyle = "#4a2a14"; g.beginPath(); g.ellipse(-3, -4.5, 1, 0.7, 0, 0, TAU); g.fill();
  }
  if (destello > 0.01 && comida < 0.5) {
    k.brillo(g, 0, -10, 90 * (0.7 + 0.3 * destello), "255,226,150", 0.8 * destello);
    const a = destello * 0.9; g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = a; g.strokeStyle = "#fff6d0"; g.lineWidth = 1.4; g.lineCap = "round";
    const r = 7 + 4 * Math.sin(t * 6); g.beginPath(); g.moveTo(9, -18 - r); g.lineTo(9, -18 + r); g.moveTo(9 - r, -18); g.lineTo(9 + r, -18); g.stroke(); g.restore();
  }
  g.restore();
}

// ---------------------------------------------------------------- el enfado y el cariño del dueño (luz detrás de la persona)
export function auraEnfado(g, x, u, t = 0) {
  if (u <= 0.01) return;
  const l = 1 + 0.06 * Math.sin(t * 9);
  k.brillo(g, x + 6, -112, 250 * l, "255,64,40", 0.8 * u);
  k.brillo(g, x + 6, -112, 120 * l, "255,150,90", 0.4 * u);
}
export function auraCalida(g, x, u, t = 0) {
  if (u <= 0.01) return;
  k.brillo(g, x + 6, -112, 270, "255,196,110", 0.85 * u * (0.9 + 0.1 * Math.sin(t * 3)));
}

// ---------------------------------------------------------------- las batas de la investigadora
export const BATA = ["#ffffff", "#e6ecf5", "#aebace"];

// ---------------------------------------------------------------- una pareja pequeña: dueño y perro
// dedo: 0 regañando .. 1 con el brazo bajo y sonriendo. culpa: la cara del perro.
export function pareja(g, x, y, s, o) {
  const { t = 0, ablanda = 0, culpa = 1, fase = 0, chaqueta, pelo, cola = 0.4 } = o;
  g.save(); g.translate(x, y); g.scale(s, s);
  perroFrente(g, { x: 62, t: t + fase * 3, culpa, cola, cabeza: { mira: -0.9 } });
  const ang = Math.sin((t + fase) * 9) * 7;
  const reg = 1 - ablanda;
  auraEnfado(g, 0, 0.85 * reg, t);
  auraCalida(g, 0, ablanda, t);
  persona(g, {
    recto: 1, x: 0, dir: 1, paso: 0, t, chaqueta, pelo,
    inclina: 0.14 * reg - 0.04 * ablanda, boca: reg * (0.5 + 0.5 * Math.sin((t + fase) * 11)) * 0.6,
    mano: [26 + ang * reg, -118], tira: reg,
  });
  g.restore();
}
