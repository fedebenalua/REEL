// El mismo mar, la misma tierra del sur, el mismo nombre en oro. Las letras se piden dentro del dibujo:
// si se miden al cargar el módulo, el render se queda sin Figtree.
import * as k from "#kit";
import { GlobalFonts } from "@napi-rs/canvas";

const ROMANAS = ["Noto Serif Display", "Noto Serif", "Liberation Serif", "DejaVu Serif"];
let romanaHecha = null;
export function romana() {
  if (!romanaHecha) {
    const hay = new Set(GlobalFonts.families.map((f) => f.family));
    const r = ROMANAS.find((f) => hay.has(f));
    romanaHecha = r ? `'${r}'` : "Figtree";
  }
  return romanaHecha;
}

export const hexRgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const mezHex = (a, b, u) => {
  const x = hexRgb(a), y = hexRgb(b);
  return `rgb(${x.map((c, i) => Math.round(c + (y[i] - c) * u)).join(",")})`;
};

export function velo(g, fuerza = 0.82) {
  const vg = g.createLinearGradient(0, 0, 0, 640);
  vg.addColorStop(0, `rgba(4,8,16,${fuerza})`);
  vg.addColorStop(0.55, `rgba(4,8,16,${fuerza * 0.55})`);
  vg.addColorStop(1, "rgba(4,8,16,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 680);
}

let grano = null;
function granoMar() {
  if (grano) return grano;
  grano = k.lienzo(540, 960);
  const c = grano.getContext("2d");
  const az = k.azar(1507);
  for (let i = 0; i < 3500; i++) {
    const x = az() * 540, y = az() * 960, a = 0.03 + az() * 0.05;
    c.fillStyle = az() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,30,60,${a})`;
    c.fillRect(x, y, 1.5, 1.5);
  }
  return grano;
}

// Silueta de la tierra del sur, con el origen en el centro y la unidad en vertical.
export function caminoSur(g, x, y, s) {
  g.beginPath();
  g.moveTo(x - 46 * s, y - 168 * s);
  g.bezierCurveTo(x - 8 * s, y - 205 * s, x + 78 * s, y - 198 * s, x + 118 * s, y - 148 * s);
  g.bezierCurveTo(x + 188 * s, y - 78 * s, x + 198 * s, y + 18 * s, x + 158 * s, y + 78 * s);
  g.bezierCurveTo(x + 108 * s, y + 138 * s, x + 58 * s, y + 188 * s, x + 18 * s, y + 248 * s);
  g.bezierCurveTo(x - 8 * s, y + 208 * s, x - 42 * s, y + 138 * s, x - 72 * s, y + 58 * s);
  g.bezierCurveTo(x - 102 * s, y - 12 * s, x - 92 * s, y - 92 * s, x - 58 * s, y - 142 * s);
  g.quadraticCurveTo(x - 38 * s, y - 162 * s, x - 46 * s, y - 168 * s);
  g.closePath();
}

export function caminoNorte(g, x, y, s) {
  g.beginPath();
  g.moveTo(x - 16 * s, y + 128 * s);
  g.bezierCurveTo(x - 78 * s, y + 96 * s, x - 132 * s, y + 28 * s, x - 118 * s, y - 48 * s);
  g.bezierCurveTo(x - 148 * s, y - 108 * s, x - 48 * s, y - 168 * s, x + 28 * s, y - 142 * s);
  g.bezierCurveTo(x + 118 * s, y - 150 * s, x + 162 * s, y - 48 * s, x + 128 * s, y + 8 * s);
  g.bezierCurveTo(x + 108 * s, y + 42 * s, x + 78 * s, y + 28 * s, x + 62 * s, y + 78 * s);
  g.bezierCurveTo(x + 48 * s, y + 122 * s, x + 8 * s, y + 148 * s, x - 16 * s, y + 128 * s);
  g.closePath();
}

function rellenoTierra(g, x, y, s, alto) {
  const gr = g.createLinearGradient(x - 80 * s, y - alto, x + 100 * s, y + alto);
  gr.addColorStop(0, "#b7e38a");
  gr.addColorStop(0.35, "#3aaa4e");
  gr.addColorStop(0.72, "#1d7a3a");
  gr.addColorStop(1, "#0e4d28");
  g.fillStyle = gr;
  g.fill();
  g.save();
  g.clip();
  const rg = g.createRadialGradient(x - 40 * s, y - alto * 0.35, 10, x, y, alto);
  rg.addColorStop(0, "rgba(255,255,220,0.28)");
  rg.addColorStop(1, "rgba(255,255,220,0)");
  g.fillStyle = rg;
  g.fillRect(x - 300 * s, y - alto * 1.4, 600 * s, alto * 2.8);
  g.restore();
  g.lineWidth = Math.max(3, 5 * s);
  g.strokeStyle = "#f2d48a";
  g.stroke();
}

export function tierraSur(g, x, y, s) {
  g.save();
  g.shadowColor = "rgba(0,10,20,0.45)";
  g.shadowBlur = 28 * s;
  g.shadowOffsetY = 16 * s;
  caminoSur(g, x, y + 8 * s, s);
  g.fillStyle = "rgba(0,20,30,0.35)";
  g.fill();
  g.shadowColor = "transparent";
  g.shadowBlur = 0;
  caminoSur(g, x, y, s);
  rellenoTierra(g, x, y, s, 220 * s);
  g.restore();
}

export function tierraNorte(g, x, y, s) {
  g.save();
  caminoNorte(g, x, y, s);
  rellenoTierra(g, x, y, s, 160 * s);
  g.restore();
}

export function viejoMundo(g, x, y, s) {
  g.save();
  const trozo = (dx, dy, rx, ry, a, b) => {
    g.beginPath();
    g.ellipse(x + dx * s, y + dy * s, rx * s, ry * s, a, 0, 6.2832);
    const gr = g.createLinearGradient(x + dx * s, y + (dy - ry) * s, x + dx * s, y + (dy + ry) * s);
    gr.addColorStop(0, b[0]);
    gr.addColorStop(1, b[1]);
    g.fillStyle = gr;
    g.fill();
    g.lineWidth = Math.max(2, 3 * s);
    g.strokeStyle = "#f6e2a8";
    g.stroke();
  };
  trozo(150, -20, 130, 108, -0.2, ["#f0c56a", "#c47a32"]);
  trozo(10, 70, 62, 150, 0.1, ["#e0a050", "#8d4e22"]);
  trozo(-20, -130, 58, 72, 0, ["#f6d78a", "#d09a40"]);
  g.restore();
}

export function cieloMar(g, t) {
  const cielo = g.createLinearGradient(0, 0, 0, 980);
  cielo.addColorStop(0, "#070b18");
  cielo.addColorStop(0.45, "#14284e");
  cielo.addColorStop(0.78, "#1c6490");
  cielo.addColorStop(1, "#0c3e66");
  g.fillStyle = cielo;
  g.fillRect(0, 0, 1080, 1920);
  const az = k.azar(7);
  g.fillStyle = "#fff";
  for (let i = 0; i < 40; i++) {
    const x = az() * 1080, y = az() * 620, r = az() * 1.6 + 0.4;
    g.globalAlpha = 0.35 + 0.4 * (0.5 + 0.5 * Math.sin(t * 0.8 + i));
    g.beginPath();
    g.arc(x, y, r, 0, 6.2832);
    g.fill();
  }
  g.globalAlpha = 1;
  const luna = 0.9 + 0.05 * Math.sin(t * 0.6);
  g.save();
  g.globalCompositeOperation = "lighter";
  const hg = g.createRadialGradient(180, 250, 0, 180, 250, 220);
  hg.addColorStop(0, `rgba(255,244,210,${0.55 * luna})`);
  hg.addColorStop(1, "rgba(255,244,210,0)");
  g.fillStyle = hg;
  g.beginPath();
  g.arc(180, 250, 220, 0, 6.2832);
  g.fill();
  g.restore();
  g.fillStyle = "#fff6d4";
  g.beginPath();
  g.arc(180, 250, 36, 0, 6.2832);
  g.fill();
  g.fillStyle = "rgba(20,40,70,0.18)";
  g.beginPath();
  g.arc(194, 242, 30, 0, 6.2832);
  g.fill();
  const mar = g.createLinearGradient(0, 860, 0, 1920);
  mar.addColorStop(0, "#1a7eab");
  mar.addColorStop(0.35, "#0c4f86");
  mar.addColorStop(1, "#061833");
  g.fillStyle = mar;
  g.fillRect(0, 900, 1080, 1020);
  g.save();
  g.globalAlpha = 0.35;
  g.drawImage(granoMar(), 0, 900, 1080, 1020);
  g.restore();
  g.save();
  g.globalCompositeOperation = "lighter";
  const ref = g.createLinearGradient(180, 300, 180, 1100);
  ref.addColorStop(0, "rgba(255,240,190,0)");
  ref.addColorStop(0.45, "rgba(255,240,190,0.16)");
  ref.addColorStop(1, "rgba(255,240,190,0)");
  g.fillStyle = ref;
  g.fillRect(120, 300, 120, 800);
  g.restore();
  g.strokeStyle = "rgba(190,230,255,0.25)";
  g.lineWidth = 3;
  for (let i = 0; i < 9; i++) {
    const y = 980 + i * 90;
    const fase = t * (0.35 + i * 0.02) + i;
    g.beginPath();
    for (let x = -20; x <= 1100; x += 24) {
      const yy = y + Math.sin(x * 0.02 + fase) * (5 + i);
      if (x < 0) g.moveTo(x, yy);
      else g.lineTo(x, yy);
    }
    g.stroke();
  }
}

export function barco(g, x, y, s, t, fase, luz) {
  const bob = Math.sin(t * 1.6 + fase) * 7 * s;
  g.save();
  g.translate(x, y + bob);
  g.shadowColor = "rgba(0,0,0,0.35)";
  g.shadowBlur = 12 * s;
  g.shadowOffsetY = 8 * s;
  const cas = g.createLinearGradient(0, -10 * s, 0, 40 * s);
  cas.addColorStop(0, "#a86830");
  cas.addColorStop(0.5, "#6b3a18");
  cas.addColorStop(1, "#3a1e0c");
  g.fillStyle = cas;
  g.beginPath();
  g.moveTo(-78 * s, -4 * s);
  g.quadraticCurveTo(-30 * s, 42 * s, 20 * s, 40 * s);
  g.quadraticCurveTo(78 * s, 36 * s, 96 * s, -6 * s);
  g.quadraticCurveTo(30 * s, 12 * s, -78 * s, -4 * s);
  g.fill();
  g.shadowBlur = 0;
  g.fillStyle = "#f0c14a";
  g.fillRect(-40 * s, 6 * s, 70 * s, 4 * s);
  g.strokeStyle = "#4a2c14";
  g.lineWidth = Math.max(2, 4 * s);
  g.beginPath();
  g.moveTo(-8 * s, 0);
  g.lineTo(-8 * s, -128 * s);
  g.moveTo(48 * s, -2 * s);
  g.lineTo(48 * s, -78 * s);
  g.stroke();
  const soplo = Math.sin(t * 1.3 + fase) * 10 * s;
  const vela = (x0, arriba, abajo, ancho) => {
    g.beginPath();
    g.moveTo(x0, arriba);
    g.quadraticCurveTo(x0 + ancho * 0.65 + soplo, (arriba + abajo) / 2, x0 + ancho * 0.15, abajo);
    g.quadraticCurveTo(x0 + ancho * 0.35 + soplo * 0.4, (arriba + abajo) / 2, x0, arriba);
    const vg = g.createLinearGradient(x0, arriba, x0 + ancho, abajo);
    vg.addColorStop(0, "#fffaf0");
    vg.addColorStop(0.7, "#f0e0bc");
    vg.addColorStop(1, "#d9c090");
    g.fillStyle = vg;
    g.fill();
  };
  vela(-4 * s, -122 * s, -28 * s, 78 * s);
  vela(52 * s, -74 * s, -18 * s, 48 * s);
  if (luz > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    g.globalAlpha = luz;
    const lg = g.createRadialGradient(70 * s, 4 * s, 0, 70 * s, 4 * s, 36 * s);
    lg.addColorStop(0, "rgba(255,200,80,0.9)");
    lg.addColorStop(1, "rgba(255,160,40,0)");
    g.fillStyle = lg;
    g.beginPath();
    g.arc(70 * s, 4 * s, 36 * s, 0, 6.2832);
    g.fill();
    g.fillStyle = "#ffe9a8";
    g.beginPath();
    g.arc(70 * s, 4 * s, 5 * s, 0, 6.2832);
    g.fill();
    g.restore();
  }
  g.restore();
}

export function palabraOro(g, texto, x, y, tam, al = 1) {
  if (al <= 0.015 || tam < 8) return;
  g.save();
  g.globalAlpha *= al;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `700 ${Math.round(tam)}px ${romana()}`;
  g.lineJoin = "round";
  g.miterLimit = 2;
  g.lineWidth = Math.max(2, tam * 0.045);
  g.strokeStyle = "#6b3208";
  g.strokeText(texto, x, y);
  const gr = g.createLinearGradient(x, y - tam * 0.55, x, y + tam * 0.55);
  gr.addColorStop(0, "#fff8dc");
  gr.addColorStop(0.42, "#ffd56a");
  gr.addColorStop(1, "#e08a14");
  g.fillStyle = gr;
  g.shadowColor = "rgba(255,180,40,0.55)";
  g.shadowBlur = tam * 0.22;
  g.fillText(texto, x, y);
  g.restore();
}

export function cinta(g, x, y, w, h, texto, abre, al = 1) {
  if (abre <= 0.02 || al <= 0.02) return;
  g.save();
  g.translate(x, y);
  g.scale(abre, 1);
  g.globalAlpha *= al;
  const gr = g.createLinearGradient(0, -h / 2, 0, h / 2);
  gr.addColorStop(0, "#ff5a4e");
  gr.addColorStop(0.45, "#d01218");
  gr.addColorStop(1, "#8e0c12");
  k.redondo(g, -w / 2, -h / 2, w, h, 18);
  g.fillStyle = gr;
  g.fill();
  g.fillStyle = "#f6d56a";
  g.fillRect(-w / 2, -h / 2, w, 8);
  g.fillRect(-w / 2, h / 2 - 8, w, 8);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `700 ${Math.round(h * 0.62)}px ${romana()}`;
  g.fillStyle = "#fff6d8";
  g.fillText(texto, 0, 2);
  g.restore();
}

export function medalla(g, x, y, r, texto, al = 1) {
  if (al <= 0.02) return;
  g.save();
  g.globalAlpha *= al;
  g.shadowColor = "rgba(0,0,0,0.4)";
  g.shadowBlur = 18;
  g.shadowOffsetY = 8;
  const cg = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.2, x, y, r);
  cg.addColorStop(0, "#fff1c2");
  cg.addColorStop(0.55, "#f0b22e");
  cg.addColorStop(1, "#a86a10");
  g.fillStyle = cg;
  g.beginPath();
  g.arc(x, y, r, 0, 6.2832);
  g.fill();
  g.shadowBlur = 0;
  g.strokeStyle = "#fff6d4";
  g.lineWidth = 4;
  g.beginPath();
  g.arc(x, y, r * 0.82, 0, 6.2832);
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `700 ${Math.round(r * 0.34)}px ${romana()}`;
  g.fillStyle = "#6b3a08";
  g.fillText(texto, x, y + 1);
  g.restore();
}

// Perfil en silueta, como una moneda: sin dedos ni cara de frente.
export function perfil(g, x, y, r) {
  g.save();
  g.translate(x, y);
  g.beginPath();
  g.arc(0, 0, r * 0.74, 0, 6.2832);
  g.clip();
  g.fillStyle = "#4a2a10";
  g.beginPath();
  g.moveTo(-r * 0.08, r * 0.78);
  g.lineTo(r * 0.02, r * 0.18);
  g.quadraticCurveTo(r * 0.16, r * 0.24, r * 0.26, r * 0.08);
  g.quadraticCurveTo(r * 0.14, r * 0.04, r * 0.2, -r * 0.02);
  g.lineTo(r * 0.42, -r * 0.1);
  g.lineTo(r * 0.18, -r * 0.18);
  g.quadraticCurveTo(r * 0.24, -r * 0.36, r * 0.02, -r * 0.46);
  g.quadraticCurveTo(-r * 0.22, -r * 0.5, -r * 0.28, -r * 0.22);
  g.quadraticCurveTo(-r * 0.34, r * 0.08, -r * 0.22, r * 0.38);
  g.lineTo(-r * 0.32, r * 0.78);
  g.closePath();
  g.fill();
  g.restore();
}

export function pluma(g, x, y, s, ang) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.strokeStyle = "#3a2414";
  g.lineWidth = 5 * s;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(150 * s, -16 * s);
  g.stroke();
  g.fillStyle = "#1c140e";
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(-26 * s, 10 * s);
  g.lineTo(-6 * s, -12 * s);
  g.fill();
  g.fillStyle = "#f7f1e6";
  g.beginPath();
  g.moveTo(36 * s, -8 * s);
  g.quadraticCurveTo(100 * s, -78 * s, 156 * s, -20 * s);
  g.quadraticCurveTo(110 * s, -8 * s, 40 * s, 18 * s);
  g.closePath();
  g.fill();
  g.strokeStyle = "rgba(90,60,30,0.35)";
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(40 * s, 2 * s);
  g.lineTo(150 * s, -16 * s);
  g.stroke();
  g.restore();
}

export function compas(g, x, y, s, abre) {
  g.save();
  g.translate(x, y);
  const a = 0.35 + abre * 0.45;
  g.strokeStyle = "#e8c56a";
  g.lineWidth = 10 * s;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(Math.sin(-a) * 150 * s, Math.cos(-a) * 150 * s);
  g.moveTo(0, 0);
  g.lineTo(Math.sin(a) * 150 * s, Math.cos(a) * 150 * s);
  g.stroke();
  g.fillStyle = "#fff1c4";
  g.beginPath();
  g.arc(0, 0, 16 * s, 0, 6.2832);
  g.fill();
  g.fillStyle = "#5c3a14";
  g.beginPath();
  g.arc(0, 0, 6 * s, 0, 6.2832);
  g.fill();
  g.restore();
}

export function libro(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.shadowColor = "rgba(0,0,0,0.4)";
  g.shadowBlur = 20;
  g.shadowOffsetY = 12;
  g.fillStyle = "#6e1c22";
  k.redondo(g, -150 * s, -100 * s, 300 * s, 200 * s, 12);
  g.fill();
  g.shadowBlur = 0;
  g.fillStyle = "#f6e7c8";
  k.redondo(g, -130 * s, -86 * s, 118 * s, 172 * s, 6);
  g.fill();
  k.redondo(g, 12 * s, -86 * s, 118 * s, 172 * s, 6);
  g.fill();
  g.strokeStyle = "rgba(90,60,30,0.35)";
  g.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    const yy = -50 * s + i * 24 * s;
    g.beginPath();
    g.moveTo(-110 * s, yy);
    g.lineTo(-28 * s, yy);
    g.moveTo(30 * s, yy);
    g.lineTo(112 * s, yy);
    g.stroke();
  }
  g.restore();
}
