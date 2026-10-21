// El cuerpo de luz: tu cerebro de luz de perfil (mirando a la izquierda), con su franja del tacto (oro cuando siente,
// cian cuando el cerebelo la predice), el cerebelo atrás abajo, y el nervio que baja hasta tu mano. Coordenadas del
// mundo: el cerebro en (0, 0), de unos 900 px de ancho; la mano, unos 2400 px más abajo.
import * as k from "#kit";
import { ORO, CIAN } from "./mundo.js";

const { azar, lienzo, mez } = k;

export const CEREBELO = [270, 215], TALAMO = [40, 40];
export function caminoCerebro(g) {
  g.beginPath();
  g.moveTo(-430, 40);
  g.bezierCurveTo(-470, -120, -360, -330, -170, -380);
  g.bezierCurveTo(20, -430, 260, -390, 380, -260);
  g.bezierCurveTo(470, -160, 470, 0, 410, 90);
  g.bezierCurveTo(360, 160, 280, 170, 200, 150);
  g.bezierCurveTo(120, 200, 0, 230, -100, 200);
  g.bezierCurveTo(-200, 170, -260, 120, -330, 140);
  g.bezierCurveTo(-400, 150, -430, 110, -430, 40);
  g.closePath();
}
const caminoCerebelo = (g) => { g.beginPath(); g.ellipse(CEREBELO[0], CEREBELO[1], 135, 82, 0.15, 0, 6.2832); };

// ---------------------------------------------------------------- el cerebro, dibujado una vez
const OX = 560, OY = 500;
const CEREBRO_IMG = (() => {
  const l = lienzo(1120, 1000), c = l.getContext("2d");
  c.translate(OX, OY);
  // el tronco
  c.beginPath(); c.moveTo(130, 160); c.bezierCurveTo(150, 260, 150, 380, 140, 480); c.lineTo(205, 480); c.bezierCurveTo(215, 380, 220, 260, 215, 150); c.closePath();
  let gr = c.createLinearGradient(130, 0, 215, 0); gr.addColorStop(0, "#2a1046"); gr.addColorStop(0.5, "#6a3a9a"); gr.addColorStop(1, "#2a1046"); c.fillStyle = gr; c.fill();
  // el cerebelo: rayado, morado
  caminoCerebelo(c); c.save(); c.clip();
  gr = c.createRadialGradient(240, 190, 10, 270, 215, 150); gr.addColorStop(0, "#7a3fb0"); gr.addColorStop(1, "#2a0f44"); c.fillStyle = gr; c.fillRect(100, 100, 340, 240);
  c.globalCompositeOperation = "lighter"; c.lineWidth = 4;
  for (let i = -9; i <= 9; i++) { c.strokeStyle = `rgba(200,150,255,${0.35 + 0.15 * Math.cos(i)})`; c.beginPath(); c.moveTo(130, 215 + i * 9); c.bezierCurveTo(220, 200 + i * 10, 320, 235 + i * 9, 420, 225 + i * 9); c.stroke(); }
  c.restore();
  c.lineWidth = 4; c.strokeStyle = "rgba(210,170,255,0.7)"; caminoCerebelo(c); c.stroke();
  // la corteza: oscura por dentro, con los pliegues de luz
  caminoCerebro(c); c.save(); c.clip();
  gr = c.createRadialGradient(-60, -120, 40, 0, -60, 520); gr.addColorStop(0, "#4a1660"); gr.addColorStop(0.7, "#260a3a"); gr.addColorStop(1, "#13051f"); c.fillStyle = gr; c.fillRect(-560, -500, 1120, 1000);
  c.globalCompositeOperation = "lighter"; c.lineCap = "round"; c.lineJoin = "round";
  const az = azar(313);
  for (let pas = 0; pas < 2; pas++) {
    const a2 = azar(313);
    for (let i = 0; i < 95; i++) {
      let x = -440 + a2() * 880, y = -400 + a2() * 620, ang = a2() * 6.28;
      const L = 8 + Math.floor(a2() * 10), col = a2() < 0.7 ? "255,120,200" : "180,140,255";
      c.strokeStyle = pas === 0 ? `rgba(${col},0.22)` : `rgba(${col},0.75)`; c.lineWidth = pas === 0 ? 16 : 3.5;
      c.beginPath(); c.moveTo(x, y);
      for (let j = 0; j < L; j++) { ang += (a2() - 0.5) * 1.9; x += Math.cos(ang) * 26; y += Math.sin(ang) * 26; c.lineTo(x, y); }
      c.stroke();
    }
  }
  void az;
  // la sombra del borde, para que tenga volumen
  c.globalCompositeOperation = "source-over";
  gr = c.createRadialGradient(-80, -160, 200, 0, -40, 560); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(5,0,15,0.6)"); c.fillStyle = gr; c.fillRect(-560, -500, 1120, 1000);
  c.restore();
  c.lineWidth = 7; c.strokeStyle = "rgba(255,170,230,0.85)"; caminoCerebro(c); c.stroke();
  return l;
})();
const halo = (() => { const l = lienzo(1400, 1300), c = l.getContext("2d"); c.translate(700, 650); c.filter = "blur(40px)"; c.lineWidth = 60; c.strokeStyle = "rgba(255,90,190,0.55)"; caminoCerebro(c); c.stroke(); return l; })();

// Las chispas que corren por dentro
const PUNTOS = (() => { const az = azar(91), l = []; while (l.length < 60) { const x = -420 + az() * 840, y = -380 + az() * 580; l.push({ x, y, f: az() * 6, v: 0.6 + az() }); } return l; })();

export function cerebro(g, t, { brillo = 1 } = {}) {
  g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha *= 0.7 * brillo; g.drawImage(halo, -700, -650); g.restore();
  g.save(); g.globalAlpha *= mez(0.55, 1, brillo); g.drawImage(CEREBRO_IMG, -OX, -OY); g.restore();
  g.save(); caminoCerebro(g); g.clip();
  for (const p of PUNTOS) { const a = Math.pow(Math.max(0, Math.sin(t * 2 * p.v + p.f)), 6); k.brillo(g, p.x, p.y, 70, "255,170,230", a * 0.8 * brillo); }
  g.restore();
}

// ---------------------------------------------------------------- la franja del tacto
// Una banda curva de arriba a abajo por el medio del cerebro (donde se siente lo que toca la piel).
const F0 = [70, -400], F1 = [-120, -190], F2 = [-150, 150];
export const franja = (u) => { const a = (1 - u) * (1 - u), b = 2 * u * (1 - u), c = u * u; return [a * F0[0] + b * F1[0] + c * F2[0], a * F0[1] + b * F1[1] + c * F2[1]]; };
export const FRANJA_MEDIO = franja(0.45);
// oro, cian: cuánto se enciende de cada color (0 a 1). La luz de cosquilla: un zigzag que vibra a lo largo de la banda.
export function bandaTacto(g, t, { base = 1, oro = 0, cian = 0 } = {}) {
  g.save(); g.lineCap = "round"; g.lineJoin = "round";
  const camino = () => { g.beginPath(); for (let i = 0; i <= 30; i++) { const [x, y] = franja(i / 30); i ? g.lineTo(x, y) : g.moveTo(x, y); } };
  camino(); g.strokeStyle = `rgba(255,150,210,${0.22 * base})`; g.lineWidth = 70; g.stroke();
  g.globalCompositeOperation = "lighter";
  for (const [c, a, fase] of [[CIAN, cian, 0], [ORO, oro, 1.7]]) {
    if (a <= 0.01) continue;
    camino(); g.strokeStyle = `rgba(${c},${0.16 * Math.min(1.2, a)})`; g.lineWidth = 120 * (0.6 + 0.4 * Math.min(1.5, a)); g.stroke();
    // el zigzag de la cosquilla
    g.strokeStyle = `rgba(${c},${0.95 * Math.min(1, a)})`; g.lineWidth = 9;
    g.beginPath();
    for (let i = 0; i <= 60; i++) {
      const u = i / 60, [x, y] = franja(u), [x2, y2] = franja(Math.min(1, u + 0.01)), dx = x2 - x, dy = y2 - y, n = Math.hypot(dx, dy) || 1;
      const w = (i % 2 ? 1 : -1) * 34 * a * (0.7 + 0.3 * Math.sin(t * 25 + i + fase));
      const px = x - (dy / n) * w, py = y + (dx / n) * w; i ? g.lineTo(px, py) : g.moveTo(px, py);
    }
    g.stroke();
    for (let i = 0; i < 4; i++) { const [x, y] = franja(0.12 + i * 0.25); k.brillo(g, x, y, 240 * Math.min(1.6, a), c, 0.3 * Math.min(1, a)); }
  }
  g.restore();
}

// ---------------------------------------------------------------- el nervio
// De la franja (s = 1) al tálamo, al tronco, cuello abajo hasta la palma de la mano (s = 0).
const PALMA_NERVIO = [-40, 2420];
const NODOS = [PALMA_NERVIO, [-60, 2050], [20, 1500], [140, 900], [175, 520], [170, 260], TALAMO, F1];
const catmull = (p0, p1, p2, p3, u) => { const u2 = u * u, u3 = u2 * u; return [0, 1].map((j) => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u3)); };
const NERVIO = (() => {
  const l = [];
  for (let i = 0; i < NODOS.length - 1; i++) {
    const p0 = NODOS[Math.max(0, i - 1)], p1 = NODOS[i], p2 = NODOS[i + 1], p3 = NODOS[Math.min(NODOS.length - 1, i + 2)];
    for (let j = 0; j < 24; j++) l.push(catmull(p0, p1, p2, p3, j / 24));
  }
  l.push(NODOS[NODOS.length - 1]);
  const d = [0]; for (let i = 1; i < l.length; i++) d.push(d[i - 1] + Math.hypot(l[i][0] - l[i - 1][0], l[i][1] - l[i - 1][1]));
  return { p: l, d, L: d[d.length - 1] };
})();
// El punto del nervio en s (0 en la mano, 1 en la franja) y su dirección.
export function enNervio(s) {
  const D = Math.max(0, Math.min(1, s)) * NERVIO.L; let i = 1; while (i < NERVIO.d.length - 1 && NERVIO.d[i] < D) i++;
  const u = (D - NERVIO.d[i - 1]) / (NERVIO.d[i] - NERVIO.d[i - 1] || 1), a = NERVIO.p[i - 1], b = NERVIO.p[i];
  return { x: mez(a[0], b[0], u), y: mez(a[1], b[1], u), dx: b[0] - a[0], dy: b[1] - a[1] };
}
export function nervio(g, t, al = 1) {
  g.save(); g.lineCap = "round"; g.lineJoin = "round";
  const camino = (hasta = 1) => { g.beginPath(); const n = Math.floor((NERVIO.p.length - 1) * hasta); NERVIO.p.slice(0, n + 1).forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); };
  camino(); g.strokeStyle = `rgba(120,140,255,${0.18 * al})`; g.lineWidth = 60; g.stroke();
  g.globalCompositeOperation = "lighter";
  camino(); g.strokeStyle = `rgba(150,170,255,${0.55 * al})`; g.lineWidth = 16; g.stroke();
  camino(); g.strokeStyle = `rgba(230,235,255,${0.7 * al})`; g.lineWidth = 4; g.stroke();
  // fibras que corren despacio
  for (let i = 0; i < 18; i++) { const s = ((t * 0.08 + i / 18) % 1), P = enNervio(s); k.brillo(g, P.x, P.y, 60, "170,190,255", 0.5 * al); }
  g.restore();
}
// Un pulso de cosquilla que va por el nervio, en s, de tamaño tam (1 normal) y su color.
export function pulso(g, t, s, tam, color = ORO, al = 1) {
  if (al <= 0.01 || tam <= 0.01) return;
  const P = enNervio(s), n = Math.hypot(P.dx, P.dy) || 1, tx = P.dx / n, ty = P.dy / n;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; g.lineJoin = "round";
  k.brillo(g, P.x, P.y, 520 * tam, color, 0.9 * al);
  g.strokeStyle = `rgba(${color},${al})`; g.lineWidth = 10 * Math.sqrt(tam);
  g.beginPath();
  for (let i = -8; i <= 8; i++) { const w = (i % 2 ? 1 : -1) * 38 * tam * Math.cos((i / 8) * 1.4) * (0.8 + 0.2 * Math.sin(t * 30 + i)); const x = P.x - tx * i * 16 * tam - ty * w, y = P.y - ty * i * 16 * tam + tx * w; i > -8 ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.stroke();
  g.strokeStyle = `rgba(255,255,255,${0.8 * al})`; g.lineWidth = 3; g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- la copia del cerebelo
// Del cerebelo al tálamo y a la franja: u de 0 (en el cerebelo) a 1 (en la franja).
export function enCopia(u) {
  const P = [CEREBELO, [150, 120], TALAMO, F1], i = Math.min(2, Math.floor(u * 3)), w = u * 3 - i;
  return [mez(P[i][0], P[i + 1][0], k.suave(w)), mez(P[i][1], P[i + 1][1], k.suave(w))];
}
// Un zigzag de luz (una cosquilla «dibujada»), centrado en (x, y), de ancho w, de color c, con transparencia al.
export function garabato(g, t, x, y, w, c, al = 1, fase = 0) {
  if (al <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; g.lineJoin = "round";
  k.brillo(g, x, y, w * 2.6, c, 0.7 * al);
  g.strokeStyle = `rgba(${c},${al})`; g.lineWidth = Math.max(4, w * 0.07);
  g.beginPath();
  for (let i = 0; i <= 10; i++) { const u = i / 10, yy = y + (i % 2 ? 1 : -1) * w * 0.22 * Math.sin(Math.PI * u) * (0.8 + 0.2 * Math.sin(t * 22 + i + fase)); const xx = x - w / 2 + w * u; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
  g.stroke();
  g.restore();
}

// La barra del volumen: diez rayas, de abajo arriba, encendidas hasta n (puede ser decimal). En (x, y) su base.
export function volumen(g, x, y, n, al = 1, color = ORO) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  k.redondo(g, x - 70, y - 690, 140, 720, 34); g.fillStyle = "rgba(10,6,24,0.75)"; g.fill();
  g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 3; g.stroke();
  for (let i = 0; i < 10; i++) {
    const on = Math.max(0, Math.min(1, n - i)), yy = y - 30 - i * 66, w = 70 + i * 4;
    k.redondo(g, x - w / 2, yy - 44, w, 44, 12);
    g.fillStyle = on > 0 ? `rgba(${k.mezRgb("60,50,80", color, on)},1)` : "rgba(60,50,80,0.8)"; g.fill();
    if (on > 0.3) k.brillo(g, x, yy - 22, 160, color, 0.35 * on);
  }
  g.restore();
}

// ---------------------------------------------------------------- el fondo
const POLVO = (() => { const az = azar(55), l = []; for (let i = 0; i < 90; i++) l.push({ x: az() * 1080, y: az() * 1920, r: 1 + az() * 3, f: az() * 6 }); return l; })();
export function fondoLuz(g, t, dy = 0) {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  const bg = g.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, "#090722"); bg.addColorStop(0.5, "#120a34"); bg.addColorStop(1, "#06051a");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  const rg = g.createRadialGradient(540, 900, 50, 540, 900, 1100); rg.addColorStop(0, "rgba(110,50,160,0.35)"); rg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = rg; g.fillRect(0, 0, 1080, 1920);
  for (const p of POLVO) { const y = ((p.y - dy * 0.15) % 1920 + 1920) % 1920; g.fillStyle = `rgba(190,180,255,${0.25 + 0.2 * Math.sin(t + p.f)})`; g.beginPath(); g.arc(p.x, y, p.r, 0, 6.2832); g.fill(); }
  g.restore();
}
