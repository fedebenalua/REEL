// La cabeza, las siete cosas y los cajones: lo mismo en el gancho y en el remate.
import * as k from "#kit";

const { azar, redondo } = k;

export function fondo(g, t, tono = "indigo") {
  const g0 = g.createLinearGradient(0, 0, 0, 1920);
  if (tono === "rio") {
    g0.addColorStop(0, "#041018");
    g0.addColorStop(0.45, "#072033");
    g0.addColorStop(1, "#031018");
  } else if (tono === "oro") {
    g0.addColorStop(0, "#3a1c08");
    g0.addColorStop(0.5, "#4a240c");
    g0.addColorStop(1, "#1a0c06");
  } else if (tono === "mesa") {
    g0.addColorStop(0, "#120818");
    g0.addColorStop(0.5, "#1a0c22");
    g0.addColorStop(1, "#0a0612");
  } else {
    g0.addColorStop(0, "#14082a");
    g0.addColorStop(0.42, "#1b0d3a");
    g0.addColorStop(1, "#070414");
  }
  g.fillStyle = g0;
  g.fillRect(0, 0, 1080, 1920);
  const luz = g.createRadialGradient(540, 780, 80, 540, 900, 980);
  const luzC = tono === "rio" ? "40,140,180" : tono === "oro" ? "255,150,40" : "150,70,220";
  luz.addColorStop(0, `rgba(${luzC},0.22)`);
  luz.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = luz;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalCompositeOperation = "lighter";
  for (const p of POLVO) {
    const y = (p.y0 + t * p.v) % 2100 - 80;
    const x = p.x + Math.sin(t * 0.6 + p.f) * 16;
    g.fillStyle = `rgba(${p.c},${0.15 + 0.2 * Math.sin(t * 2 + p.f)})`;
    g.beginPath();
    g.arc(x, y, p.r, 0, 6.3);
    g.fill();
  }
  g.restore();
}

const azP = azar(41);
const POLVO = Array.from({ length: 48 }, () => ({
  x: azP() * 1080,
  y0: azP() * 2000,
  v: 18 + azP() * 36,
  r: 1.2 + azP() * 2.4,
  f: azP() * 6,
  c: azP() < 0.5 ? "210,170,255" : "140,210,255",
}));

export function velo(g, al = 0.72) {
  const vg = g.createLinearGradient(0, 140, 0, 640);
  vg.addColorStop(0, `rgba(8,4,16,${al})`);
  vg.addColorStop(0.55, `rgba(8,4,16,${al * 0.55})`);
  vg.addColorStop(1, "rgba(8,4,16,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 680);
}

export function sombra(g, x, y, s, al = 0.4) {
  g.save();
  g.fillStyle = `rgba(0,0,0,${al})`;
  g.beginPath();
  g.ellipse(x, y + s * 0.92, s * 0.72, s * 0.2, 0, 0, 6.3);
  g.fill();
  g.restore();
}

function limon(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.rotate(-0.35);
  const gr = g.createRadialGradient(-s * 0.28, -s * 0.3, s * 0.08, 0, 0, s);
  gr.addColorStop(0, "#fff6b0");
  gr.addColorStop(0.42, "#f2c41a");
  gr.addColorStop(1, "#b86d08");
  g.fillStyle = gr;
  g.beginPath();
  g.ellipse(0, 0, s * 0.98, s * 0.7, 0, 0, 6.3);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.28)";
  for (let i = 0; i < 14; i++) {
    const a = i * 1.3, r = s * (0.15 + (i % 5) * 0.12);
    g.beginPath();
    g.ellipse(Math.cos(a) * r, Math.sin(a) * r * 0.7, s * 0.035, s * 0.02, a, 0, 6.3);
    g.fill();
  }
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.beginPath();
  g.ellipse(-s * 0.28, -s * 0.22, s * 0.28, s * 0.14, -0.6, 0, 6.3);
  g.fill();
  g.fillStyle = "#2f9a3a";
  g.beginPath();
  g.ellipse(s * 0.15, -s * 0.62, s * 0.28, s * 0.12, -0.8, 0, 6.3);
  g.fill();
  g.restore();
}

function llave(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.rotate(0.5);
  const gr = g.createLinearGradient(-s, -s, s, s);
  gr.addColorStop(0, "#fff1c4");
  gr.addColorStop(0.45, "#e2a84a");
  gr.addColorStop(1, "#8a5a16");
  g.fillStyle = gr;
  g.strokeStyle = "#5c3a0c";
  g.lineWidth = s * 0.06;
  g.beginPath();
  g.arc(-s * 0.15, -s * 0.15, s * 0.48, 0, 6.3);
  g.fill();
  g.stroke();
  g.fillStyle = "#1a0e08";
  g.beginPath();
  g.arc(-s * 0.15, -s * 0.15, s * 0.2, 0, 6.3);
  g.fill();
  redondo(g, s * 0.15, -s * 0.08, s * 1.15, s * 0.28, s * 0.08);
  g.fillStyle = gr;
  g.fill();
  g.fillRect(s * 0.85, s * 0.12, s * 0.22, s * 0.32);
  g.fillRect(s * 1.1, s * 0.12, s * 0.18, s * 0.24);
  g.fillStyle = "rgba(255,255,255,0.45)";
  g.beginPath();
  g.ellipse(-s * 0.32, -s * 0.32, s * 0.14, s * 0.08, -0.6, 0, 6.3);
  g.fill();
  g.restore();
}

function vaso(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.beginPath();
  g.moveTo(-s * 0.62, -s * 0.7);
  g.lineTo(s * 0.62, -s * 0.7);
  g.lineTo(s * 0.46, s * 0.78);
  g.lineTo(-s * 0.46, s * 0.78);
  g.closePath();
  const gr = g.createLinearGradient(-s, 0, s, 0);
  gr.addColorStop(0, "rgba(190,230,255,0.35)");
  gr.addColorStop(0.4, "rgba(255,255,255,0.16)");
  gr.addColorStop(1, "rgba(120,180,220,0.4)");
  g.fillStyle = gr;
  g.fill();
  g.strokeStyle = "rgba(230,250,255,0.85)";
  g.lineWidth = s * 0.07;
  g.stroke();
  g.beginPath();
  g.moveTo(-s * 0.5, s * 0.05);
  g.lineTo(s * 0.5, s * 0.05);
  g.lineTo(s * 0.42, s * 0.7);
  g.lineTo(-s * 0.42, s * 0.7);
  g.closePath();
  g.fillStyle = "#ff7a2a";
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.fillRect(-s * 0.34, -s * 0.55, s * 0.1, s * 1.15);
  g.restore();
}

function libro(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.rotate(-0.12);
  redondo(g, -s * 0.7, -s * 0.85, s * 1.45, s * 1.7, s * 0.12);
  g.fillStyle = "#f4efe4";
  g.fill();
  redondo(g, -s * 0.85, -s * 0.9, s * 1.5, s * 1.75, s * 0.14);
  const gr = g.createLinearGradient(-s, 0, s, 0);
  gr.addColorStop(0, "#3a4fd4");
  gr.addColorStop(0.5, "#6d86ff");
  gr.addColorStop(1, "#2436a8");
  g.fillStyle = gr;
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.fillRect(-s * 0.55, -s * 0.55, s * 0.9, s * 0.12);
  g.fillStyle = "#ffd36a";
  g.fillRect(-s * 0.7, -s * 0.15, s * 0.28, s * 1.0);
  g.restore();
}

function manzana(g, x, y, s) {
  g.save();
  g.translate(x, y);
  const gr = g.createRadialGradient(-s * 0.3, -s * 0.35, s * 0.1, 0, 0, s);
  gr.addColorStop(0, "#ff8d8d");
  gr.addColorStop(0.5, "#ef2d3a");
  gr.addColorStop(1, "#8e1020");
  g.fillStyle = gr;
  g.beginPath();
  g.arc(0, s * 0.05, s * 0.82, 0, 6.3);
  g.fill();
  g.fillStyle = "#5a3018";
  g.fillRect(-s * 0.06, -s * 0.95, s * 0.1, s * 0.28);
  g.fillStyle = "#3aaa48";
  g.beginPath();
  g.ellipse(s * 0.22, -s * 0.78, s * 0.28, s * 0.12, 0.8, 0, 6.3);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.4)";
  g.beginPath();
  g.ellipse(-s * 0.28, -s * 0.22, s * 0.22, s * 0.12, -0.7, 0, 6.3);
  g.fill();
  g.restore();
}

function pelota(g, x, y, s) {
  g.save();
  g.translate(x, y);
  const gr = g.createRadialGradient(-s * 0.3, -s * 0.35, s * 0.05, 0, 0, s);
  gr.addColorStop(0, "#e9fff8");
  gr.addColorStop(0.4, "#3ef0c8");
  gr.addColorStop(1, "#0b8f78");
  g.fillStyle = gr;
  g.beginPath();
  g.arc(0, 0, s * 0.86, 0, 6.3);
  g.fill();
  g.strokeStyle = "rgba(8,60,50,0.65)";
  g.lineWidth = s * 0.07;
  g.beginPath();
  g.arc(0, 0, s * 0.86, 0.4, 2.2);
  g.stroke();
  g.beginPath();
  g.arc(0, 0, s * 0.86, 2.6, 4.6);
  g.stroke();
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.beginPath();
  g.ellipse(-s * 0.28, -s * 0.3, s * 0.22, s * 0.12, -0.6, 0, 6.3);
  g.fill();
  g.restore();
}

function taza(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.strokeStyle = "#f2f2f4";
  g.lineWidth = s * 0.12;
  g.beginPath();
  g.arc(s * 0.62, s * 0.05, s * 0.32, -1.2, 1.2);
  g.stroke();
  const gr = g.createLinearGradient(-s, 0, s, 0);
  gr.addColorStop(0, "#fff");
  gr.addColorStop(0.5, "#d5d8e0");
  gr.addColorStop(1, "#8e93a0");
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(-s * 0.55, -s * 0.55);
  g.lineTo(s * 0.55, -s * 0.55);
  g.lineTo(s * 0.42, s * 0.7);
  g.quadraticCurveTo(0, s * 0.95, -s * 0.42, s * 0.7);
  g.closePath();
  g.fill();
  g.fillStyle = "#6b3a22";
  g.beginPath();
  g.ellipse(0, -s * 0.48, s * 0.42, s * 0.14, 0, 0, 6.3);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.7)";
  g.fillRect(-s * 0.38, -s * 0.35, s * 0.1, s * 0.85);
  g.restore();
}

function zapato(g, x, y, s) {
  g.save();
  g.translate(x, y);
  const gr = g.createLinearGradient(0, -s, 0, s);
  gr.addColorStop(0, "#ff7ad8");
  gr.addColorStop(1, "#b01278");
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(-s * 0.85, s * 0.35);
  g.lineTo(-s * 0.7, -s * 0.15);
  g.quadraticCurveTo(-s * 0.2, -s * 0.85, s * 0.15, -s * 0.35);
  g.lineTo(s * 0.85, -s * 0.15);
  g.quadraticCurveTo(s * 1.05, s * 0.15, s * 0.7, s * 0.4);
  g.closePath();
  g.fill();
  g.fillStyle = "#2a1020";
  g.fillRect(-s * 0.9, s * 0.32, s * 1.85, s * 0.22);
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.beginPath();
  g.ellipse(-s * 0.2, -s * 0.28, s * 0.22, s * 0.08, -0.4, 0, 6.3);
  g.fill();
  g.restore();
}

export const DIBUJOS = [limon, llave, vaso, libro, manzana, pelota, taza];
export const RGB = ["245,197,66", "232,177,90", "90,190,255", "90,120,255", "239,45,58", "62,240,200", "230,232,238"];
export function cosa(g, i, x, y, s) {
  sombra(g, x, y, s, 0.38);
  DIBUJOS[i % 7](g, x, y, s);
}
export function octava(g, x, y, s) {
  sombra(g, x, y, s, 0.38);
  zapato(g, x, y, s);
}

export function cabeza(g, x, y, s, al = 1) {
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.fillStyle = "rgba(18,8,36,0.92)";
  g.beginPath();
  g.moveTo(-s * 1.15, s * 1.35);
  g.quadraticCurveTo(-s * 0.95, s * 0.72, -s * 0.42, s * 0.62);
  g.lineTo(s * 0.42, s * 0.62);
  g.quadraticCurveTo(s * 0.95, s * 0.72, s * 1.15, s * 1.35);
  g.closePath();
  g.fill();
  const gr = g.createRadialGradient(-s * 0.25, -s * 0.45, s * 0.15, 0, -s * 0.05, s * 1.2);
  gr.addColorStop(0, "rgba(120,70,190,0.72)");
  gr.addColorStop(0.55, "rgba(36,16,72,0.88)");
  gr.addColorStop(1, "rgba(10,4,22,0.4)");
  g.fillStyle = gr;
  g.beginPath();
  g.ellipse(0, -s * 0.08, s * 0.86, s * 1.05, 0, 0, 6.3);
  g.fill();
  g.fillStyle = "rgba(48,22,82,0.95)";
  g.beginPath();
  g.ellipse(-s * 0.86, s * 0.02, s * 0.18, s * 0.32, 0, 0, 6.3);
  g.ellipse(s * 0.86, s * 0.02, s * 0.18, s * 0.32, 0, 0, 6.3);
  g.fill();
  g.strokeStyle = "rgba(230,200,255,0.9)";
  g.lineWidth = Math.max(8, s * 0.028);
  g.beginPath();
  g.ellipse(0, -s * 0.08, s * 0.86, s * 1.05, 0, 0, 6.3);
  g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.22)";
  g.lineWidth = Math.max(3, s * 0.01);
  g.beginPath();
  g.ellipse(-s * 0.16, -s * 0.28, s * 0.52, s * 0.66, -0.15, 3.5, 5.7);
  g.stroke();
  g.restore();
}

export function cajon(g, x, y, s, rgb, abierto = 0) {
  g.save();
  g.translate(x, y);
  const w = s * 1.35, h = s * 1.05;
  sombra(g, 0, h * 0.15, s, 0.45);
  redondo(g, -w / 2, -h / 2, w, h, s * 0.16);
  const gr = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  gr.addColorStop(0, `rgba(${rgb},0.95)`);
  gr.addColorStop(1, "rgba(12,8,20,0.92)");
  g.fillStyle = gr;
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.4)";
  g.lineWidth = 4;
  g.stroke();
  if (abierto > 0.02) {
    g.fillStyle = `rgba(8,6,14,${0.85 * abierto})`;
    redondo(g, -w * 0.38, -h * 0.42 - abierto * s * 0.15, w * 0.76, h * 0.42, 10);
    g.fill();
  }
  g.fillStyle = "rgba(255,255,255,0.8)";
  redondo(g, -s * 0.16, -s * 0.06, s * 0.32, s * 0.1, 6);
  g.fill();
  g.restore();
}

export function numero(g, x, y, texto, rgb, tam, al = 1) {
  if (al <= 0.01) return;
  g.save();
  g.globalAlpha *= al;
  g.font = `800 ${Math.round(tam)}px Figtree`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.shadowColor = "rgba(0,0,0,0.55)";
  g.shadowBlur = 24;
  g.shadowOffsetY = 10;
  g.lineWidth = Math.max(2, tam * 0.045);
  g.strokeStyle = "rgba(8,6,16,0.85)";
  g.strokeText(texto, x, y);
  g.shadowColor = `rgba(${rgb},0.85)`;
  g.shadowBlur = tam * 0.18;
  g.shadowOffsetY = 0;
  g.fillStyle = "#fff8ea";
  g.fillText(texto, x, y);
  g.restore();
}

export function cartel(g, x, y, texto, rgb, tam) {
  g.save();
  g.font = `800 ${tam}px Figtree`;
  const w = g.measureText(texto).width + tam * 0.7;
  const h = tam * 1.25;
  redondo(g, x - w / 2, y - h / 2, w, h, tam * 0.22);
  g.fillStyle = "rgba(8,6,16,0.78)";
  g.fill();
  g.strokeStyle = `rgba(${rgb},0.8)`;
  g.lineWidth = 4;
  g.stroke();
  g.fillStyle = `rgb(${rgb})`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.shadowColor = `rgba(${rgb},0.8)`;
  g.shadowBlur = 18;
  g.fillText(texto, x, y + tam * 0.04);
  g.restore();
}
