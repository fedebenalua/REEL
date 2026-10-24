// Cámara, materiales y piezas que comparten los planos de este váter.
import * as k from "#kit";

const { mez, suave: su, tramo: tr, azar } = k;
export const W = 1080, H = 1920;

export const camara = (g, c) => { g.translate(540, 960); g.scale(c.s, c.s); g.translate(-c.x, -c.y); };
export const mezCam = (a, b, u) => ({ x: mez(a.x, b.x, u), y: mez(a.y, b.y, u), s: Math.exp(mez(Math.log(a.s), Math.log(b.s), u)) });
export function rutaCam(t, lista) {
  if (t <= lista[0][0]) return lista[0][1];
  for (let i = 0; i < lista.length - 1; i++) {
    const [t0, a] = lista[i], [t1, b] = lista[i + 1];
    if (t <= t1) return mezCam(a, b, su(tr(t, t0, t1)));
  }
  return lista[lista.length - 1][1];
}
export const aPant = (c, x, y) => [540 + (x - c.x) * c.s, 960 + (y - c.y) * c.s];

export const PORCELANA = [[0, "#9eb4c4"], [0.22, "#f7fbfe"], [0.55, "#e7eef4"], [0.82, "#c5d4e0"], [1, "#8ea6b8"]];
export const CROMO = [[0, "#3a4652"], [0.16, "#8b9aab"], [0.34, "#f5fafc"], [0.52, "#b7c4d0"], [0.74, "#5c6d7c"], [1, "#2e3944"]];
export const GOMA = [[0, "#8e1610"], [0.35, "#ff5a48"], [0.62, "#c42018"], [1, "#6e100c"]];
export const GOMA_VIEJA = [[0, "#2a1814"], [0.4, "#5a382e"], [0.7, "#3a221c"], [1, "#1a0e0c"]];
export const LATON = [[0, "#6a4010"], [0.3, "#f0cc6a"], [0.55, "#c48a22"], [1, "#5a340c"]];

export function gradH(g, x0, x1, stops) {
  const gr = g.createLinearGradient(x0, 0, x1, 0);
  for (const [o, c] of stops) gr.addColorStop(o, c);
  return gr;
}
export function gradV(g, y0, y1, stops) {
  const gr = g.createLinearGradient(0, y0, 0, y1);
  for (const [o, c] of stops) gr.addColorStop(o, c);
  return gr;
}

export function velo(g, a = 0.55) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createLinearGradient(0, 220, 0, 560);
  gr.addColorStop(0, `rgba(3,12,20,${a})`);
  gr.addColorStop(1, "rgba(3,12,20,0)");
  g.fillStyle = gr;
  g.fillRect(0, 200, 1080, 400);
  g.restore();
}
export function viñeta(g, a = 0.38) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createRadialGradient(540, 980, 360, 540, 980, 1180);
  gr.addColorStop(0, "rgba(0,0,0,0)");
  gr.addColorStop(1, `rgba(0,0,0,${a})`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

// Azulejo turquesa, con la luz de la ventana a la izquierda. Cubre de sobra el encuadre.
export function bano(g, sueloY = 520) {
  const pared = g.createLinearGradient(-900, -1200, 700, 800);
  pared.addColorStop(0, "#1aa0b4");
  pared.addColorStop(0.45, "#0e7490");
  pared.addColorStop(1, "#083848");
  g.fillStyle = pared;
  g.fillRect(-2200, -2200, 4400, 4400);
  g.strokeStyle = "rgba(210,255,248,0.16)";
  g.lineWidth = 5;
  for (let x = -1800; x <= 1800; x += 168) {
    g.beginPath(); g.moveTo(x, -1800); g.lineTo(x, 1800); g.stroke();
  }
  for (let y = -1800; y <= 1800; y += 128) {
    g.beginPath(); g.moveTo(-1800, y); g.lineTo(1800, y); g.stroke();
  }
  const luz = g.createRadialGradient(-620, -780, 30, -200, -200, 1100);
  luz.addColorStop(0, "rgba(255,255,255,0.28)");
  luz.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = luz;
  g.fillRect(-2200, -2200, 4400, 4400);
  g.fillStyle = gradV(g, sueloY - 20, sueloY + 500, [[0, "#0f6a72"], [1, "#08383e"]]);
  g.fillRect(-2200, sueloY, 4400, 1800);
  g.fillStyle = "rgba(255,255,255,0.16)";
  g.fillRect(-2200, sueloY, 4400, 8);
}

// Un chorro de agua, de y0 a y1, ancho w, con vetas que bajan.
export function chorro(g, x, y0, y1, w, t, al = 1) {
  if (al < 0.03 || y1 <= y0 || w < 2) return;
  g.save();
  g.globalAlpha *= al;
  const onda = Math.sin(t * 16) * w * 0.12;
  g.beginPath();
  g.moveTo(x - w * 0.28, y0);
  g.bezierCurveTo(x - w * 0.15 + onda, y0 + (y1 - y0) * 0.35, x - w * 0.45 - onda, y0 + (y1 - y0) * 0.7, x - w * 0.5, y1);
  g.lineTo(x + w * 0.5, y1);
  g.bezierCurveTo(x + w * 0.45 - onda, y0 + (y1 - y0) * 0.7, x + w * 0.15 + onda, y0 + (y1 - y0) * 0.35, x + w * 0.28, y0);
  g.closePath();
  g.fillStyle = gradH(g, x - w * 0.5, x + w * 0.5, [[0, "#0a4ec8"], [0.35, "#8ad8ff"], [0.6, "#2f8ef0"], [1, "#083888"]]);
  g.fill();
  g.globalCompositeOperation = "lighter";
  const n = 5;
  for (let i = 0; i < n; i++) {
    const p = (t * 1.6 + i / n) % 1;
    const y = y0 + (y1 - y0) * p;
    g.fillStyle = `rgba(230,250,255,${0.28 * (1 - p)})`;
    g.fillRect(x - w * 0.12, y, w * 0.18, Math.max(8, (y1 - y0) * 0.08));
  }
  g.restore();
}

// Gotas ya en el aire en el fotograma 0: cada una nace según su fase.
const SEM = azar(11);
const GOTAS = Array.from({ length: 16 }, () => ({
  ang: SEM() * 6.2 - 3.1, v: 0.55 + SEM() * 0.7, f: SEM(), r: 8 + SEM() * 10,
}));
export function salpicar(g, x, y, t, al = 1, esc = 1) {
  if (al < 0.03) return;
  for (const d of GOTAS) {
    const p = (t * 1.35 * d.v + d.f) % 1;
    const px = x + Math.sin(d.ang) * 280 * esc * p;
    const py = y - (420 * esc * p - 520 * esc * p * p) * (0.45 + d.v * 0.4);
    if (py > y + 30) continue;
    gota(g, px, py, d.r * esc, al * (1 - p), 1 + p * 0.4);
  }
  const anillo = (t * 1.1) % 1;
  g.save();
  g.globalAlpha *= al * (1 - anillo) * 0.7;
  g.strokeStyle = "rgba(210,245,255,0.9)";
  g.lineWidth = 6 * esc;
  g.beginPath();
  g.ellipse(x, y, 40 * esc + 180 * esc * anillo, 14 * esc + 36 * esc * anillo, 0, 0, 6.28);
  g.stroke();
  g.restore();
}

export function gota(g, x, y, r, al = 1, est = 1) {
  if (al < 0.03 || r < 1) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.scale(1, est);
  g.beginPath();
  g.moveTo(0, -r * 1.7);
  g.bezierCurveTo(r, -r * 0.4, r, r * 0.8, 0, r);
  g.bezierCurveTo(-r, r * 0.8, -r, -r * 0.4, 0, -r * 1.7);
  const gr = g.createRadialGradient(-r * 0.3, -r * 0.2, r * 0.1, 0, r * 0.2, r * 1.2);
  gr.addColorStop(0, "rgba(210,245,255,0.95)");
  gr.addColorStop(0.5, "rgba(70,170,240,0.92)");
  gr.addColorStop(1, "rgba(10,70,190,0.95)");
  g.fillStyle = gr;
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.8)";
  g.beginPath();
  g.ellipse(-r * 0.28, -r * 0.15, r * 0.16, r * 0.4, 0.4, 0, 6.28);
  g.fill();
  g.restore();
}

// Lámina de agua dentro de un rectángulo, con la superficie ondeando.
export function lamina(g, x, y, w, h, t, al = 1) {
  if (al < 0.03 || h < 2 || w < 2) return;
  g.save();
  g.globalAlpha *= al;
  g.beginPath();
  g.moveTo(x, y + h);
  g.lineTo(x + w, y + h);
  g.lineTo(x + w, y);
  const pasos = 8;
  for (let i = pasos; i >= 0; i--) {
    const u = i / pasos;
    g.lineTo(x + w * u, y + Math.sin(t * 5 + u * 8) * 5);
  }
  g.closePath();
  g.fillStyle = gradV(g, y, y + h, [[0, "rgba(150,220,255,0.92)"], [0.35, "rgba(40,140,230,0.9)"], [1, "rgba(8,70,170,0.94)"]]);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.fillRect(x + 10, y + 2, w * 0.35, 4);
  g.restore();
}

// Guante de goma amarillo. rot 0: dedos hacia arriba.
export function guante(g, x, y, rot, esc = 1, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  const cuerpo = () => {
    g.beginPath();
    g.moveTo(-38, 30);
    g.bezierCurveTo(-62, -40, -48, -120, -22, -150);
    g.lineTo(28, -150);
    g.bezierCurveTo(56, -120, 64, -30, 46, 36);
    g.quadraticCurveTo(10, 58, -38, 30);
    g.closePath();
  };
  cuerpo();
  g.fillStyle = gradH(g, -64, 64, [[0, "#c4920e"], [0.35, "#ffe07a"], [0.7, "#f0b422"], [1, "#a87808"]]);
  g.fill();
  g.save();
  cuerpo();
  g.clip();
  g.fillStyle = "rgba(255,255,255,0.45)";
  g.fillRect(-8, -150, 14, 200);
  g.restore();
  g.beginPath();
  g.moveTo(-34, -6);
  g.bezierCurveTo(-100, -30, -108, 36, -60, 52);
  g.bezierCurveTo(-28, 60, -16, 24, -28, 4);
  g.fillStyle = gradH(g, -108, -16, [[0, "#b8880c"], [0.5, "#ffe48a"], [1, "#d8a020"]]);
  g.fill();
  g.fillStyle = gradH(g, -56, 56, [[0, "#9a700c"], [0.4, "#ffe9a0"], [1, "#b88810"]]);
  k.redondo(g, -54, 28, 112, 36, 14);
  g.fill();
  g.restore();
}

// Arco con punta. ccw true = al revés de las agujas del reloj (el ángulo de canvas mengua).
export function arco(g, x, y, r, desde, hasta, ccw, al, color = "#ffd15a") {
  if (al < 0.03) return;
  g.save();
  g.globalAlpha *= al;
  g.strokeStyle = color;
  g.lineWidth = Math.max(10, r * 0.1);
  g.lineCap = "round";
  g.beginPath();
  g.arc(x, y, r, desde, hasta, ccw);
  g.stroke();
  const a = hasta;
  // tangente: el ángulo crece en sentido horario
  let tx = -Math.sin(a), ty = Math.cos(a);
  if (ccw) { tx = -tx; ty = -ty; }
  const px = -ty, py = tx;
  const hx = x + Math.cos(a) * r, hy = y + Math.sin(a) * r;
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(hx + tx * 34, hy + ty * 34);
  g.lineTo(hx - tx * 14 + px * 18, hy - ty * 14 + py * 18);
  g.lineTo(hx - tx * 14 - px * 18, hy - ty * 14 - py * 18);
  g.closePath();
  g.fill();
  g.restore();
}
