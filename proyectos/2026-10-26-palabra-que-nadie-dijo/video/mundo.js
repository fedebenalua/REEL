// Lo común: la noche, las fichas de palabras, el megáfono, el cuaderno, los botes.
import * as k from "#kit";

export const ORO = "255,186,64";
export const CIELO = "186,220,255";

export function noche(g, calor = 0) {
  const grd = g.createLinearGradient(0, 0, 0, 1920);
  grd.addColorStop(0, "#10081c");
  grd.addColorStop(0.42, "#1b1030");
  grd.addColorStop(1, "#07040f");
  g.fillStyle = grd;
  g.fillRect(0, 0, 1080, 1920);
  const r = g.createRadialGradient(540, 1180, 40, 540, 1280, 980);
  r.addColorStop(0, `rgba(255,150,70,${0.16 + calor})`);
  r.addColorStop(1, "rgba(255,150,70,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 1080, 1920);
}

const azL = k.azar(41);
export const LUCES = Array.from({ length: 48 }, () => ({
  p: [(azL() - 0.5) * 14, (azL() - 0.3) * 6, azL() * 8],
  s: 0.3 + azL(),
  c: azL() > 0.7 ? ORO : "180,170,255",
}));

export function luces(g, cam, al = 1) {
  for (const q of LUCES) {
    const P = k.proyecta(cam, q.p);
    if (!P || P.z > 12) continue;
    k.brillo(g, P.x, P.y, (k.F * 0.07 * q.s) / P.z, q.c, 0.35 * al * q.s);
  }
}

export function suelo(g, cam, y = -1.15) {
  const pts = [[-9, y, -3], [9, y, -3], [9, y, 9], [-9, y, 9]].map((p) => k.proyecta(cam, p));
  if (pts.some((p) => !p)) return;
  g.beginPath();
  pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
  g.closePath();
  const grd = g.createLinearGradient(0, 800, 0, 1920);
  grd.addColorStop(0, "#2a1844");
  grd.addColorStop(1, "#100814");
  g.fillStyle = grd;
  g.fill();
}

export function velo(g) {
  const vg = g.createLinearGradient(0, 180, 0, 620);
  vg.addColorStop(0, "rgba(8,4,16,0.78)");
  vg.addColorStop(1, "rgba(8,4,16,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 640);
  const vi = g.createRadialGradient(540, 1000, 420, 540, 1000, 1200);
  vi.addColorStop(0, "rgba(0,0,0,0)");
  vi.addColorStop(1, "rgba(0,0,0,0.38)");
  g.fillStyle = vi;
  g.fillRect(0, 0, 1080, 1920);
}

// Una ficha de palabra, de cara a la cámara. fantasma: oro y translúcida.
export function ficha(g, cam, pos, texto, { alto = 0.78, fantasma = 0, al = 1, ancho } = {}) {
  const P = k.proyecta(cam, pos);
  if (!P) return null;
  const h = (k.F * alto) / P.z;
  if (h < 6) return null;
  const w = h * (ancho || 2.15);
  const x = P.x - w / 2, y = P.y - h / 2;
  if (fantasma > 0.05) k.brillo(g, P.x, P.y, h * 1.7, ORO, 0.22 * al);
  g.save();
  g.globalAlpha *= al;
  g.shadowColor = fantasma > 0.4 ? "rgba(255,170,40,0.45)" : "rgba(0,0,0,0.45)";
  g.shadowBlur = h * 0.22;
  g.shadowOffsetY = h * 0.06;
  k.redondo(g, x, y, w, h, h * 0.16);
  const grd = g.createLinearGradient(x, y, x, y + h);
  if (fantasma > 0.05) {
    grd.addColorStop(0, `rgba(255,228,150,${0.35 + 0.6 * (1 - fantasma * 0.3)})`);
    grd.addColorStop(0.45, `rgba(255,176,50,${0.55 + 0.4 * (1 - fantasma)})`);
    grd.addColorStop(1, `rgba(150,70,10,${0.7})`);
  } else {
    grd.addColorStop(0, "#f4f8ff");
    grd.addColorStop(0.55, "#d5e6ff");
    grd.addColorStop(1, "#7ea4dc");
  }
  g.fillStyle = grd;
  g.fill();
  g.shadowColor = "transparent";
  g.shadowBlur = 0;
  k.redondo(g, x + h * 0.04, y + h * 0.04, w - h * 0.08, h * 0.42, h * 0.1);
  g.fillStyle = fantasma > 0.05 ? "rgba(255,255,230,0.28)" : "rgba(255,255,255,0.45)";
  g.fill();
  let tam = h * 0.4;
  g.font = `800 ${tam}px Figtree`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  const tw = g.measureText(texto).width;
  if (tw > w * 0.84) tam *= (w * 0.84) / tw;
  g.font = `800 ${tam}px Figtree`;
  g.lineWidth = Math.max(2, tam * 0.07);
  g.strokeStyle = fantasma > 0.05 ? "rgba(255,244,210,0.95)" : "rgba(255,255,255,0.4)";
  g.strokeText(texto, P.x, P.y + h * 0.04);
  g.fillStyle = fantasma > 0.05 ? "#3a2204" : "#12203c";
  g.fillText(texto, P.x, P.y + h * 0.04);
  g.restore();
  return { ...P, w, h };
}

export function megafono(g, x, y, s, abierto = 1) {
  g.save();
  g.translate(x, y);
  const boca = 0.22 + 0.34 * abierto;
  g.beginPath();
  g.moveTo(-s * 0.22, -s * 0.1);
  g.lineTo(s * 0.46, -s * boca);
  g.quadraticCurveTo(s * 0.62, 0, s * 0.46, s * boca);
  g.lineTo(-s * 0.22, s * 0.1);
  g.closePath();
  const grd = g.createLinearGradient(-s, -s, s, s);
  grd.addColorStop(0, "#8a5a28");
  grd.addColorStop(0.4, "#f0c27a");
  grd.addColorStop(0.7, "#a56b32");
  grd.addColorStop(1, "#5c3818");
  g.fillStyle = grd;
  g.fill();
  g.beginPath();
  g.ellipse(s * 0.5, 0, s * 0.12, s * boca, 0, 0, 6.28);
  g.fillStyle = "#2a1408";
  g.fill();
  g.beginPath();
  g.ellipse(s * 0.5, 0, s * 0.07, s * boca * 0.72, 0, 0, 6.28);
  g.fillStyle = abierto > 0.2 ? "rgba(255,210,140,0.35)" : "#1a0c06";
  g.fill();
  g.fillStyle = "#6a4220";
  k.redondo(g, -s * 0.48, -s * 0.11, s * 0.3, s * 0.22, s * 0.08);
  g.fill();
  g.restore();
}

export function cuaderno(g, x, y, w, h, { vacio = 0 } = {}) {
  g.save();
  g.shadowColor = "rgba(0,0,0,0.4)";
  g.shadowBlur = 28;
  g.shadowOffsetY = 16;
  k.redondo(g, x, y, w, h, 28);
  g.fillStyle = "#f6efe2";
  g.fill();
  g.shadowColor = "transparent";
  g.fillStyle = "#c4544a";
  g.fillRect(x, y, 22, h);
  g.strokeStyle = "rgba(190,170,140,0.8)";
  g.lineWidth = 2;
  for (let i = 1; i <= 6; i++) {
    const yy = y + h * (0.18 + i * 0.11);
    g.beginPath();
    g.moveTo(x + 48, yy);
    g.lineTo(x + w - 36, yy);
    g.stroke();
  }
  if (vacio > 0.02) {
    g.globalAlpha *= vacio;
    k.redondo(g, x + w * 0.28, y + h * 0.62, w * 0.5, h * 0.16, 12);
    g.strokeStyle = "rgba(180,60,40,0.9)";
    g.lineWidth = 6;
    g.stroke();
  }
  g.restore();
}

export function pluma(g, x, y, s, ang) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.fillStyle = "#1c2438";
  k.redondo(g, -s * 0.05, -s * 0.55, s * 0.16, s * 0.7, s * 0.08);
  g.fill();
  g.beginPath();
  g.moveTo(s * 0.03, s * 0.12);
  g.lineTo(s * 0.2, s * 0.55);
  g.lineTo(-s * 0.14, s * 0.55);
  g.closePath();
  g.fillStyle = "#e8b15a";
  g.fill();
  g.restore();
}

export function onda(g, x, y, r, al, color = "255,220,160") {
  if (al < 0.02 || r < 2) return;
  g.save();
  g.globalAlpha *= al;
  g.strokeStyle = `rgba(${color},0.9)`;
  g.lineWidth = 6;
  g.beginPath();
  g.arc(x, y, r, -0.8, 0.8);
  g.stroke();
  g.restore();
}

export function bote(g, x, y, w, h, nivel, color) {
  g.save();
  const top = y + h * (1 - nivel) * 0.78 + h * 0.08;
  k.redondo(g, x, y, w, h, w * 0.28);
  const vid = g.createLinearGradient(x, y, x + w, y);
  vid.addColorStop(0, "rgba(210,230,255,0.18)");
  vid.addColorStop(0.2, "rgba(255,255,255,0.28)");
  vid.addColorStop(0.5, "rgba(180,200,230,0.08)");
  vid.addColorStop(1, "rgba(40,60,100,0.22)");
  g.fillStyle = vid;
  g.fill();
  g.save();
  k.redondo(g, x + 8, y + 8, w - 16, h - 16, w * 0.24);
  g.clip();
  const liq = g.createLinearGradient(x, top, x, y + h);
  liq.addColorStop(0, `rgba(${color},0.95)`);
  liq.addColorStop(1, `rgba(${color},0.45)`);
  g.fillStyle = liq;
  g.fillRect(x, top, w, y + h - top);
  g.restore();
  g.beginPath();
  g.ellipse(x + w / 2, y + h * 0.08, w * 0.42, h * 0.045, 0, 0, 6.28);
  g.strokeStyle = "rgba(255,255,255,0.55)";
  g.lineWidth = 4;
  g.stroke();
  k.brillo(g, x + w * 0.5, (top + y + h) / 2, w * 0.9, color, 0.22 + nivel * 0.25);
  g.restore();
}

export function hilo(g, a, b, al, color = ORO) {
  if (!a || !b || al < 0.02) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.globalAlpha *= al;
  g.strokeStyle = `rgba(${color},0.9)`;
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(a.x, a.y);
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 40;
  g.quadraticCurveTo(mx, my, b.x, b.y);
  g.stroke();
  g.restore();
}

// Un fotograma de recuerdo, dibujado, sin foto real.
export function recuerdo(g, x, y, w, h, tipo, al = 1) {
  g.save();
  g.globalAlpha *= al;
  g.shadowColor = "rgba(0,0,0,0.35)";
  g.shadowBlur = 16;
  k.redondo(g, x, y, w, h, 18);
  g.fillStyle = "#f3ecdf";
  g.fill();
  g.shadowColor = "transparent";
  g.save();
  k.redondo(g, x + 10, y + 10, w - 20, h - 20, 12);
  g.clip();
  if (tipo === "cama") {
    g.fillStyle = "#3a2a68";
    g.fillRect(x, y, w, h);
    g.fillStyle = "#f2d7b0";
    k.redondo(g, x + w * 0.18, y + h * 0.42, w * 0.64, h * 0.28, 16);
    g.fill();
    g.fillStyle = "#fff6ea";
    k.redondo(g, x + w * 0.22, y + h * 0.28, w * 0.28, h * 0.2, 10);
    g.fill();
  } else if (tipo === "tarta") {
    g.fillStyle = "#2a4478";
    g.fillRect(x, y, w, h);
    g.fillStyle = "#f3f6ff";
    g.fillRect(x + w * 0.2, y + h * 0.48, w * 0.6, h * 0.28);
    g.fillStyle = "#ff8fb0";
    g.fillRect(x + w * 0.2, y + h * 0.4, w * 0.6, h * 0.12);
    k.brillo(g, x + w * 0.5, y + h * 0.32, 30, "255,220,120", 0.8);
  } else {
    g.fillStyle = "#14283f";
    g.fillRect(x, y, w, h);
    g.fillStyle = "#f6e7b0";
    g.beginPath();
    g.arc(x + w * 0.68, y + h * 0.32, Math.min(w, h) * 0.12, 0, 6.28);
    g.fill();
    g.strokeStyle = "#d7e6ff";
    g.lineWidth = 6;
    k.redondo(g, x + w * 0.22, y + h * 0.28, w * 0.4, h * 0.4, 8);
    g.stroke();
  }
  g.restore();
  g.restore();
}
