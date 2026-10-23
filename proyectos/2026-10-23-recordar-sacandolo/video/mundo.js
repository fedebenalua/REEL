// La mesa, las fichas y el cuarto. Lo que sale en más de un plano se dibuja aquí, siempre igual.
import * as k from "#kit";

const az = k.azar(23);
export const MOTAS = Array.from({ length: 48 }, () => ({
  x: az() * 1080, y: az() * 1920, s: 1.4 + az() * 2.6, f: az() * 6.28, v: 12 + az() * 28,
}));

const TINTA = ["#ff4d3a", "#ffb703", "#3d8bfd", "#ffd60a", "#14b8a6", "#5cdb5c", "#c77dff", "#ff7b54", "#ff4d6d", "#22d3ee"];

function icono(dibuja) {
  const c = k.lienzo(256, 256);
  const g = c.getContext("2d");
  g.translate(128, 128);
  dibuja(g);
  return c;
}

function vela(g, color, x, y, s) {
  g.fillStyle = color;
  g.beginPath(); g.arc(x, y, s, 0, 6.2832); g.fill();
}

export const ICONOS = [
  icono((g) => { // barco
    g.fillStyle = TINTA[0];
    g.beginPath(); g.moveTo(-78, 6); g.quadraticCurveTo(-20, 62, 70, 8); g.lineTo(48, 8); g.quadraticCurveTo(0, 36, -58, 6); g.closePath(); g.fill();
    g.fillStyle = "#ffe8e2";
    g.beginPath(); g.moveTo(-4, 10); g.lineTo(-4, -78); g.lineTo(58, 6); g.closePath(); g.fill();
    g.fillStyle = TINTA[0]; g.fillRect(-8, -78, 8, 92);
  }),
  icono((g) => { // sol
    g.strokeStyle = TINTA[1]; g.lineWidth = 14; g.lineCap = "round";
    for (let i = 0; i < 10; i++) { const a = i / 10 * 6.2832; g.beginPath(); g.moveTo(Math.cos(a) * 48, Math.sin(a) * 48); g.lineTo(Math.cos(a) * 92, Math.sin(a) * 92); g.stroke(); }
    g.fillStyle = "#ffe566"; g.beginPath(); g.arc(0, 0, 42, 0, 6.2832); g.fill();
    g.fillStyle = "#fff6c2"; g.beginPath(); g.arc(-12, -12, 14, 0, 6.2832); g.fill();
  }),
  icono((g) => { // casa
    g.fillStyle = TINTA[2];
    g.beginPath(); g.moveTo(0, -84); g.lineTo(86, -8); g.lineTo(64, -8); g.lineTo(64, 70); g.lineTo(-64, 70); g.lineTo(-64, -8); g.lineTo(-86, -8); g.closePath(); g.fill();
    g.fillStyle = "#d7e8ff"; k.redondo(g, -22, 18, 44, 52, 6); g.fill();
    g.fillStyle = "#fff1b0"; k.redondo(g, 16, -4, 26, 26, 4); g.fill();
  }),
  icono((g) => { // llave
    g.fillStyle = TINTA[3];
    g.beginPath(); g.arc(-28, -8, 36, 0, 6.2832); g.fill();
    g.fillStyle = "#3a2a00"; g.beginPath(); g.arc(-28, -8, 14, 0, 6.2832); g.fill();
    g.fillStyle = TINTA[3]; g.fillRect(2, -16, 86, 18);
    g.fillRect(58, 2, 14, 28); g.fillRect(78, 2, 14, 20);
  }),
  icono((g) => { // pez
    g.fillStyle = TINTA[4];
    g.beginPath(); g.ellipse(-8, 0, 70, 36, 0, 0, 6.2832); g.fill();
    g.beginPath(); g.moveTo(52, 0); g.lineTo(96, -32); g.lineTo(96, 32); g.closePath(); g.fill();
    g.fillStyle = "#08332f"; g.beginPath(); g.arc(-36, -6, 7, 0, 6.2832); g.fill();
    g.fillStyle = "#d9fff8"; g.beginPath(); g.ellipse(-10, 8, 22, 8, -0.4, 0, 6.2832); g.fill();
  }),
  icono((g) => { // árbol
    g.fillStyle = "#8a4b22"; k.redondo(g, -12, 10, 24, 70, 6); g.fill();
    g.fillStyle = TINTA[5];
    g.beginPath(); g.arc(0, -18, 48, 0, 6.2832); g.fill();
    g.beginPath(); g.arc(-32, 8, 32, 0, 6.2832); g.fill();
    g.beginPath(); g.arc(34, 6, 30, 0, 6.2832); g.fill();
    g.fillStyle = "#e9ffc8"; g.beginPath(); g.arc(-16, -30, 12, 0, 6.2832); g.fill();
  }),
  icono((g) => { // luna
    g.fillStyle = TINTA[6];
    g.beginPath();
    g.arc(-6, 0, 62, Math.PI * 0.55, Math.PI * 1.45, false);
    g.arc(22, -4, 48, Math.PI * 1.45, Math.PI * 0.55, true);
    g.closePath();
    g.fill();
    g.fillStyle = "#f3e1ff";
    g.beginPath(); g.arc(-24, -18, 10, 0, 6.2832); g.fill();
  }),
  icono((g) => { // taza
    g.fillStyle = TINTA[7];
    k.redondo(g, -58, -28, 100, 86, 16); g.fill();
    g.fillStyle = "#fff"; g.beginPath(); g.ellipse(-8, -28, 42, 16, 0, 0, 6.2832); g.fill();
    g.fillStyle = "#ffd8c8"; g.beginPath(); g.ellipse(-8, -28, 28, 9, 0, 0, 6.2832); g.fill();
    g.strokeStyle = TINTA[7]; g.lineWidth = 12; g.beginPath(); g.arc(48, 8, 24, -1.2, 1.2); g.stroke();
  }),
  icono((g) => { // campana
    g.fillStyle = TINTA[8];
    g.beginPath(); g.moveTo(-70, 36); g.quadraticCurveTo(-74, -20, 0, -78); g.quadraticCurveTo(74, -20, 70, 36); g.closePath(); g.fill();
    g.fillRect(-78, 32, 156, 16);
    g.beginPath(); g.arc(0, 52, 14, 0, 6.2832); g.fill();
    g.fillStyle = "#ffe0e6"; g.beginPath(); g.ellipse(-16, -20, 16, 22, -0.4, 0, 6.2832); g.fill();
  }),
  icono((g) => { // libro
    g.fillStyle = TINTA[9]; k.redondo(g, -70, -56, 140, 112, 10); g.fill();
    g.fillStyle = "#e7fbff"; k.redondo(g, -58, -46, 116, 92, 6); g.fill();
    g.fillStyle = TINTA[9]; g.fillRect(-6, -46, 10, 92);
    g.fillStyle = "#7ad7ea";
    g.fillRect(-48, -24, 32, 8); g.fillRect(12, -24, 32, 8);
    g.fillRect(-48, -4, 26, 8); g.fillRect(12, -4, 28, 8);
  }),
];

export function cuarto(g, t, calor = 1) {
  const bg = g.createLinearGradient(0, 0, 200, 1920);
  bg.addColorStop(0, "#2a1744");
  bg.addColorStop(0.42, "#140c22");
  bg.addColorStop(1, "#1c0d12");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalAlpha = 0.45;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -40, -40, 1160, 2000);
  g.restore();
  g.save();
  g.globalCompositeOperation = "lighter";
  const lg = g.createRadialGradient(240, 280, 20, 320, 640, 980);
  lg.addColorStop(0, `rgba(255,196,120,${0.42 * calor})`);
  lg.addColorStop(0.35, `rgba(255,140,70,${0.14 * calor})`);
  lg.addColorStop(1, "rgba(255,120,60,0)");
  g.fillStyle = lg;
  g.fillRect(0, 0, 1080, 1920);
  const lg2 = g.createRadialGradient(860, 1500, 10, 800, 1500, 700);
  lg2.addColorStop(0, "rgba(90,60,180,0.20)");
  lg2.addColorStop(1, "rgba(90,60,180,0)");
  g.fillStyle = lg2;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
  for (const m of MOTAS) {
    const y = (m.y - t * m.v + 4000) % 1920;
    const a = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.6 + m.f));
    g.fillStyle = `rgba(255,226,190,${a})`;
    g.beginPath(); g.arc(m.x + Math.sin(t * 0.7 + m.f) * 8, y, m.s, 0, 6.28); g.fill();
  }
}

// Mesa de madera, grande, con canto y veta. y0 es el borde de atrás.
export function mesa(g, y0 = 1080) {
  g.save();
  g.beginPath();
  g.moveTo(-80, y0);
  g.lineTo(1160, y0 + 36);
  g.lineTo(1240, 2000);
  g.lineTo(-160, 2000);
  g.closePath();
  const w = g.createLinearGradient(0, y0, 80, 1920);
  w.addColorStop(0, "#f0b56a");
  w.addColorStop(0.18, "#c47a3a");
  w.addColorStop(0.55, "#8d4e22");
  w.addColorStop(1, "#5c2e12");
  g.fillStyle = w;
  g.fill();
  g.save();
  g.clip();
  g.globalAlpha = 0.28;
  g.strokeStyle = "#4a240e";
  g.lineWidth = 3;
  for (let i = 0; i < 18; i++) {
    const y = y0 + 30 + i * 58;
    g.beginPath(); g.moveTo(-100, y); g.bezierCurveTo(300, y - 16, 700, y + 22, 1200, y - 8); g.stroke();
  }
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.35;
  g.drawImage(k.red, 0, y0, 1080, 900);
  g.restore();
  // canto frontal
  g.fillStyle = "#3d1e0c";
  g.fillRect(0, 1860, 1080, 60);
  g.restore();
  // lámpara, arriba a la izquierda, fuera del subtítulo lo importante no, la lámpara puede asomar
  g.save();
  g.translate(150, 210);
  g.fillStyle = "#2a2118";
  g.fillRect(-8, 40, 16, 90);
  k.redondo(g, -70, -20, 140, 70, 20);
  const lm = g.createLinearGradient(-70, -20, 70, 50);
  lm.addColorStop(0, "#6a5640"); lm.addColorStop(0.5, "#f2d2a4"); lm.addColorStop(1, "#3a2c20");
  g.fillStyle = lm; g.fill();
  g.restore();
}

export function velo(g, fuerza = 0.72) {
  const vg = g.createLinearGradient(0, 180, 0, 560);
  vg.addColorStop(0, `rgba(10,6,18,${fuerza})`);
  vg.addColorStop(1, "rgba(10,6,18,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 580);
}

function tic(g, x, y, s, al) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  const e = 0.85 + 0.15 * al;
  g.scale(e, e);
  g.fillStyle = "#18a34a";
  g.beginPath(); g.arc(0, 0, s, 0, 6.2832); g.fill();
  g.strokeStyle = "#ffffff";
  g.lineWidth = Math.max(3, s * 0.18);
  g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath();
  g.moveTo(-s * 0.42, s * 0.02);
  g.lineTo(-s * 0.08, s * 0.36);
  g.lineTo(s * 0.46, -s * 0.36);
  g.stroke();
  g.restore();
}

// Una ficha. x,y centro. w ancho. olvido 0..1 la apaga. check 0..1. fuego 0..1 un brillo.
export function carta(g, x, y, w, o = {}) {
  if (w < 3) return;
  const al = o.al ?? 1;
  if (al < 0.015) return;
  const h = w * 1.32;
  const olvido = o.olvido || 0;
  const giro = o.giro || 0;
  g.save();
  g.translate(x, y);
  g.rotate(giro);
  g.globalAlpha *= al;
  g.save();
  g.shadowColor = "rgba(0,0,0,0.5)";
  g.shadowBlur = Math.max(8, w * 0.16);
  g.shadowOffsetY = w * 0.07;
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.12);
  g.fillStyle = k.mezColor("#fff8ee", "#b9b3aa", olvido);
  g.fill();
  g.restore();
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.12);
  const gr = g.createLinearGradient(-w / 2, -h / 2, w * 0.4, h * 0.5);
  gr.addColorStop(0, k.mezColor("#fffdf8", "#d5d0c8", olvido));
  gr.addColorStop(0.55, k.mezColor("#ffe0bf", "#b7b1a8", olvido));
  gr.addColorStop(1, k.mezColor("#f0c48a", "#9c978f", olvido));
  g.fillStyle = gr;
  g.fill();
  g.save();
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.12);
  g.clip();
  g.globalAlpha *= 0.22 * (1 - olvido);
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.red2, -w / 2, -h / 2, w, h);
  g.restore();
  g.lineWidth = Math.max(2, w * 0.018);
  g.strokeStyle = `rgba(90,48,18,${0.28 + 0.2 * (1 - olvido)})`;
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.12);
  g.stroke();
  const s = w * 0.66;
  g.save();
  g.globalAlpha *= 1 - olvido * 0.82;
  g.drawImage(ICONOS[(o.icono || 0) % 10], -s / 2, -s / 2 - h * 0.02, s, s);
  g.restore();
  if ((o.check || 0) > 0.02) tic(g, w * 0.28, -h * 0.34, w * 0.16, o.check);
  // brillo de papel
  g.save();
  g.globalCompositeOperation = "screen";
  const rg = g.createLinearGradient(-w / 2, -h / 2, w / 2, 0);
  rg.addColorStop(0, "rgba(255,255,255,0.28)");
  rg.addColorStop(0.4, "rgba(255,255,255,0)");
  g.fillStyle = rg;
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.12);
  g.fill();
  g.restore();
  g.restore();
  const fuego = o.fuego || 0;
  if (fuego > 0.02) k.brillo(g, x, y, w * 1.15, o.brilloColor || "255,196,90", fuego * al);
}

// Reverso oscuro, para cuando se tapan.
export function reverso(g, x, y, w, o = {}) {
  if (w < 3) return;
  const al = o.al ?? 1;
  if (al < 0.015) return;
  const h = w * 1.32;
  g.save();
  g.translate(x, y);
  g.rotate(o.giro || 0);
  g.globalAlpha *= al;
  g.save();
  g.shadowColor = "rgba(0,0,0,0.5)";
  g.shadowBlur = w * 0.14;
  g.shadowOffsetY = w * 0.06;
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.12);
  g.fillStyle = "#241848";
  g.fill();
  g.restore();
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.12);
  const gr = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  gr.addColorStop(0, "#3a2a78");
  gr.addColorStop(1, "#1a1038");
  g.fillStyle = gr;
  g.fill();
  g.strokeStyle = "rgba(255,210,120,0.85)";
  g.lineWidth = Math.max(3, w * 0.035);
  k.redondo(g, -w * 0.36, -h * 0.38, w * 0.72, h * 0.76, w * 0.08);
  g.stroke();
  g.fillStyle = "rgba(255,210,120,0.9)";
  g.beginPath(); g.arc(0, 0, w * 0.08, 0, 6.2832); g.fill();
  g.restore();
}

// Un mazo visto de canto: varias fichas apiladas. h es el grosor.
export function mazo(g, x, y, w, grosor, o = {}) {
  const n = Math.max(3, Math.round(grosor));
  for (let i = n; i >= 0; i--) {
    const yy = y + (i - n / 2) * (w * 0.045);
    carta(g, x, yy, w, { ...o, icono: (o.icono || 0) + i, giro: (o.giro || 0) + i * 0.004, al: o.al ?? 1 });
  }
}
