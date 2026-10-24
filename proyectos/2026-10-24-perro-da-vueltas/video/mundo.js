// El salón, el parque y la sala de la prueba. El perro es el de perros/mundo.js.
import * as k from "#kit";
import {
  parque, salon, ponVista, sinVista, velo, vineta, perro, perroFrente, cam, sueloY, zf,
} from "../../../perros/mundo.js";

export * from "../../../perros/mundo.js";

const TAU = Math.PI * 2;
const { azar, lienzo, redondo, suave, tramo, mez } = k;

export const CX = 460;
export { parque, salon, ponVista, sinVista, velo, vineta, perro, perroFrente, cam };

// Un giro visto de lado: va y viene sobre un óvalo, más pequeño cuando pasa al fondo.
export function giro(u, vueltas, cx, radio = 74) {
  const uu = Math.max(0, Math.min(1, u));
  const ang = uu * vueltas * TAU;
  const lejos = (1 - Math.sin(ang)) * 0.5;
  return {
    x: cx + Math.cos(ang) * radio,
    dir: Math.sin(ang) >= 0 ? -1 : 1,
    ang,
    lejos,
    escala: 1 - lejos * 0.14,
    fase: ang * 0.95,
  };
}

export function sofaCerca(g, x) {
  g.save();
  const gr = g.createLinearGradient(0, -140, 0, -20);
  gr.addColorStop(0, "#5fe0d0");
  gr.addColorStop(1, "#178a7c");
  g.fillStyle = "#0e5c52";
  redondo(g, x + 18, -28, 16, 28, 4);
  g.fill();
  redondo(g, x + 250, -28, 16, 28, 4);
  g.fill();
  g.fillStyle = gr;
  redondo(g, x, -138, 286, 112, 28);
  g.fill();
  redondo(g, x - 6, -90, 50, 78, 18);
  g.fill();
  redondo(g, x + 242, -90, 50, 78, 18);
  g.fill();
  const cg = g.createLinearGradient(0, -70, 0, -28);
  cg.addColorStop(0, "#8cf0e2");
  cg.addColorStop(1, "#2eb8a8");
  g.fillStyle = cg;
  redondo(g, x + 36, -66, 104, 42, 14);
  g.fill();
  redondo(g, x + 148, -66, 104, 42, 14);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.2)";
  redondo(g, x + 10, -130, 266, 12, 6);
  g.fill();
  g.restore();
}

export function surco(g, cx, u, vueltas, radio, col, grosor = 7) {
  const angMax = Math.max(0.15, Math.min(1, u)) * vueltas * TAU;
  g.save();
  g.strokeStyle = col;
  g.lineWidth = grosor;
  g.lineCap = "round";
  g.lineJoin = "round";
  g.beginPath();
  const steps = Math.max(6, Math.floor(angMax / 0.2));
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * angMax;
    const x = cx + Math.cos(a) * radio;
    const y = 8 + Math.sin(a) * 11;
    if (i) g.lineTo(x, y);
    else g.moveTo(x, y);
  }
  g.stroke();
  g.restore();
}

// Varios anillos ya hechos (la lisa, uno; la de bultos, tres).
export function anillos(g, cx, n, fuerza, col) {
  g.save();
  g.strokeStyle = col;
  g.lineCap = "round";
  g.globalAlpha *= 0.35 + 0.55 * fuerza;
  for (let i = 0; i < n; i++) {
    g.lineWidth = 5 + i;
    g.beginPath();
    g.ellipse(cx, 9, 52 + i * 22, 12 + i * 3.2, 0, 0, TAU);
    g.stroke();
  }
  g.restore();
}

const TELA = (() => {
  const w = 480, h = 90, l = lienzo(w, h), g = l.getContext("2d");
  const az = azar(21);
  g.fillStyle = "#efe0c4";
  g.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 4) {
    g.strokeStyle = y % 8 === 0 ? "rgba(160,120,70,0.35)" : "rgba(255,248,230,0.45)";
    g.lineWidth = 1.4;
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(w, y);
    g.stroke();
  }
  for (let x = 0; x < w; x += 5) {
    g.strokeStyle = "rgba(120,80,40,0.18)";
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x + (az() - 0.5) * 2, h);
    g.stroke();
  }
  return l;
})();

export function alfombraLisa(g, x, w = 300, y = 16) {
  g.save();
  g.translate(x, y);
  g.fillStyle = "rgba(40,24,12,0.28)";
  g.beginPath();
  g.ellipse(6, 8, w * 0.48, 16, 0, 0, TAU);
  g.fill();
  const gr = g.createLinearGradient(-w / 2, -20, w / 2, 18);
  gr.addColorStop(0, "#f8edd8");
  gr.addColorStop(0.45, "#ead7b4");
  gr.addColorStop(1, "#c9ae82");
  g.fillStyle = gr;
  redondo(g, -w / 2, -18, w, 34, 12);
  g.fill();
  g.save();
  redondo(g, -w / 2, -18, w, 34, 12);
  g.clip();
  g.globalAlpha *= 0.55;
  g.drawImage(TELA, -w / 2, -24, w, 48);
  g.restore();
  g.strokeStyle = "rgba(255,250,240,0.9)";
  g.lineWidth = 3;
  redondo(g, -w / 2 + 7, -12, w - 14, 22, 8);
  g.stroke();
  g.strokeStyle = "#e7b15a";
  g.lineWidth = 2;
  redondo(g, -w / 2 + 3, -16, w - 6, 30, 11);
  g.stroke();
  g.restore();
}

const PELOS = (() => {
  const az = azar(9);
  const L = [];
  for (let i = 0; i < 90; i++) L.push({ x: (az() - 0.5) * 280, y: -az() * 16, h: 10 + az() * 16, c: az() });
  return L;
})();
const BOLAS = (() => {
  const az = azar(13);
  const L = [];
  for (let i = 0; i < 9; i++) L.push({ x: -120 + i * 30 + (az() - 0.5) * 10, r: 12 + az() * 12, h: 14 + az() * 12 });
  return L;
})();

export function alfombraBultos(g, x, aplasta, cercaX, w = 300) {
  g.save();
  g.translate(x, 18);
  g.fillStyle = "rgba(80,20,10,0.3)";
  g.beginPath();
  g.ellipse(4, 8, w * 0.5, 18, 0, 0, TAU);
  g.fill();
  const base = g.createLinearGradient(-w / 2, -30, w / 2, 16);
  base.addColorStop(0, "#ffb067");
  base.addColorStop(0.5, "#ff7a3c");
  base.addColorStop(1, "#e23b4a");
  g.fillStyle = base;
  redondo(g, -w / 2, -22, w, 40, 14);
  g.fill();
  g.save();
  redondo(g, -w / 2, -22, w, 40, 14);
  g.clip();
  for (const p of PELOS) {
    const apl = aplasta * (1 - Math.min(1, Math.abs(p.x - (cercaX - x)) / 70));
    const h = p.h * (1 - 0.75 * Math.max(0, apl));
    g.strokeStyle = p.c > 0.55 ? "#ffd27a" : p.c > 0.25 ? "#ff8a4a" : "#c4333a";
    g.lineWidth = 2.4;
    g.beginPath();
    g.moveTo(p.x, 8);
    g.quadraticCurveTo(p.x + 3, -h * 0.4, p.x + (p.c - 0.5) * 6, -h);
    g.stroke();
  }
  g.restore();
  for (const b of BOLAS) {
    const dist = Math.abs(b.x - (cercaX - x));
    const local = aplasta * (1 - Math.min(1, dist / 64));
    const h = b.h * (1 - 0.82 * Math.max(0, local));
    if (h < 3) continue;
    const gr = g.createRadialGradient(b.x - 4, -h, 2, b.x, -h * 0.3, b.r);
    gr.addColorStop(0, "#ffe09a");
    gr.addColorStop(0.45, "#ff8a3d");
    gr.addColorStop(1, "#c4323c");
    g.fillStyle = gr;
    g.beginPath();
    g.ellipse(b.x, -h * 0.35, b.r * (1 - 0.3 * local), h * 0.55, 0, 0, TAU);
    g.fill();
  }
  g.restore();
}

// Sala de la feria: otra luz que el salón, para que el corte se note.
export function sala(g, c) {
  sinVista(g);
  const yS = sueloY(c, 0.8);
  const pg = g.createLinearGradient(0, 0, 0, yS);
  pg.addColorStop(0, "#e7fff4");
  pg.addColorStop(0.55, "#b7ebdc");
  pg.addColorStop(1, "#8fd4c4");
  g.fillStyle = pg;
  g.fillRect(0, 0, 1080, yS + 8);
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.08;
  g.drawImage(k.manchas, 0, 0, 1080, yS);
  g.globalAlpha = 1;
  g.globalCompositeOperation = "source-over";
  ponVista(g, c, 0.5);
  const vx = c.cx - 40;
  g.fillStyle = "#fff";
  redondo(g, vx - 20, -340, 280, 200, 8);
  g.fill();
  const sg = g.createLinearGradient(0, -330, 0, -150);
  sg.addColorStop(0, "#9ad8ff");
  sg.addColorStop(1, "#e8fff6");
  g.fillStyle = sg;
  g.fillRect(vx, -320, 240, 170);
  g.fillStyle = "rgba(255,244,210,0.55)";
  g.beginPath();
  g.arc(vx + 180, -250, 36, 0, TAU);
  g.fill();
  g.strokeStyle = "#fff";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(vx + 120, -320);
  g.lineTo(vx + 120, -150);
  g.moveTo(vx, -235);
  g.lineTo(vx + 240, -235);
  g.stroke();
  sinVista(g);
  const fg = g.createLinearGradient(0, yS, 0, 1920);
  fg.addColorStop(0, "#f0d2a4");
  fg.addColorStop(0.4, "#e0b57e");
  fg.addColorStop(1, "#b88858");
  g.fillStyle = fg;
  g.fillRect(0, yS, 1080, 1920 - yS);
  g.save();
  g.beginPath();
  g.rect(0, yS, 1080, 1920 - yS);
  g.clip();
  g.strokeStyle = "rgba(90,50,20,0.22)";
  g.lineWidth = 2;
  const zA = zf(c, 0.75), zB = zf(c, 1.45);
  for (let i = -30; i <= 30; i++) {
    const X = c.cx + i * 42;
    g.beginPath();
    g.moveTo(540 + (X - c.cx) * zA, yS);
    g.lineTo(540 + (X - c.cx) * zB * 1.7, 1920);
    g.stroke();
  }
  g.restore();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.1;
  g.drawImage(k.red, 0, yS, 1080, 900);
  g.globalAlpha = 1;
  g.globalCompositeOperation = "source-over";
}

export function corral(g, x, w = 340) {
  g.save();
  g.translate(x, 0);
  g.strokeStyle = "#d7dde6";
  g.lineWidth = 3;
  g.lineCap = "round";
  for (const s of [-1, 1]) {
    g.beginPath();
    g.moveTo(s * w * 0.5, 4);
    g.lineTo(s * w * 0.5, -92);
    g.stroke();
  }
  g.strokeStyle = "#f4f7fb";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(-w * 0.5, -88);
  g.lineTo(w * 0.5, -88);
  g.stroke();
  g.strokeStyle = "rgba(80,100,120,0.35)";
  g.lineWidth = 1.4;
  for (let i = -3; i <= 3; i++) {
    const xx = i * (w / 8);
    g.beginPath();
    g.moveTo(xx, 2);
    g.lineTo(xx, -86);
    g.stroke();
  }
  g.restore();
}

const MATO = (() => {
  const l = lienzo(420, 320), g = l.getContext("2d");
  const az = azar(17);
  const blobs = [];
  for (let i = 0; i < 11; i++) blobs.push([70 + az() * 280, 150 + az() * 90, 48 + az() * 36]);
  for (const b of blobs) {
    const gr = g.createRadialGradient(b[0] - 12, b[1] - 16, 4, b[0], b[1], b[2]);
    gr.addColorStop(0, "#b6e86a");
    gr.addColorStop(0.55, "#3e9a32");
    gr.addColorStop(1, "#1c5a28");
    g.fillStyle = gr;
    g.beginPath();
    g.arc(b[0], b[1], b[2], 0, TAU);
    g.fill();
  }
  g.fillStyle = "rgba(8,20,8,0.55)";
  g.beginPath();
  g.ellipse(210, 168, 36, 22, 0, 0, TAU);
  g.fill();
  return l;
})();

export function arbusto(g, x) {
  g.save();
  g.drawImage(MATO, x - 150, -250, 300, 230);
  g.restore();
}

export function ojos(g, x, y, t, al) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha = al;
  const p = Math.sin(t * 2.4) * 1.1;
  for (const s of [-1, 1]) {
    g.fillStyle = "#14180c";
    g.beginPath();
    g.ellipse(x + s * 11, y, 9, 6, 0, 0, TAU);
    g.fill();
    const eg = g.createRadialGradient(x + s * 11 - 1, y - 1, 0.4, x + s * 11, y, 5);
    eg.addColorStop(0, "#f4ffb0");
    eg.addColorStop(0.6, "#b6e04a");
    eg.addColorStop(1, "#5a7a12");
    g.fillStyle = eg;
    g.beginPath();
    g.ellipse(x + s * 11, y, 4.6, 2.8, 0, 0, TAU);
    g.fill();
    g.fillStyle = "#10160a";
    g.beginPath();
    g.arc(x + s * 11 + p * s, y + 0.3, 1.5, 0, TAU);
    g.fill();
  }
  g.restore();
}

const BRINS = (() => {
  const az = azar(5);
  const L = [];
  for (let i = 0; i < 36; i++) L.push({ x: 220 + az() * 520, h: 16 + az() * 26, delante: az() > 0.5, k: az() });
  return L;
})();

export function hierba(g, t, delante, px) {
  g.save();
  for (const h of BRINS) {
    if (h.delante !== delante) continue;
    const cerca = 1 - Math.min(1, Math.abs(h.x - px) / 50);
    const sway = Math.sin(t * 2.2 + h.x * 0.02) * 4 + cerca * 14;
    g.strokeStyle = h.k > 0.5 ? "#8adf4a" : "#2f8a28";
    g.lineWidth = 2.6;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(h.x, 2);
    g.quadraticCurveTo(h.x + sway * 0.4, -h.h * 0.5, h.x + sway, -h.h);
    g.stroke();
  }
  g.restore();
}

// La manta hecha un bolo, que se aplasta cuando el perro da la vuelta.
const BOLAS_MANTA = (() => {
  const az = azar(31);
  const L = [];
  for (let i = 0; i < 7; i++) L.push({ x: -90 + i * 30, r: 16 + az() * 10, h: 18 + az() * 14 });
  return L;
})();

export function manta(g, x, aplasta) {
  g.save();
  g.translate(x, 6);
  g.fillStyle = "rgba(30,20,40,0.25)";
  g.beginPath();
  g.ellipse(0, 8, 120, 14, 0, 0, TAU);
  g.fill();
  for (const b of BOLAS_MANTA) {
    const h = b.h * (1 - 0.86 * aplasta);
    const gr = g.createRadialGradient(b.x - 6, -h, 2, b.x, -h * 0.2, b.r + 6);
    gr.addColorStop(0, "#fff1a8");
    gr.addColorStop(0.5, "#7d6cff");
    gr.addColorStop(1, "#3a2d88");
    g.fillStyle = gr;
    g.beginPath();
    g.ellipse(b.x, -h * 0.4, b.r, Math.max(4, h * 0.5), 0, 0, TAU);
    g.fill();
  }
  g.restore();
}

const MIGAS = (() => {
  const az = azar(44);
  const L = [];
  for (let i = 0; i < 16; i++) L.push({ a: az() * TAU, v: 20 + az() * 40, r: 2 + az() * 2.4, ph: az() });
  return L;
})();

export function migas(g, x, t, t0, fuerza) {
  if (fuerza < 0.04) return;
  g.save();
  for (const p of MIGAS) {
    const e = t - t0;
    if (e < 0) continue;
    const u = (e + p.ph) % 0.55 / 0.55;
    const px = x + Math.cos(p.a) * (8 + u * p.v);
    const py = -4 - u * (10 + p.v * 0.4);
    g.globalAlpha = (1 - u) * fuerza;
    g.fillStyle = u < 0.5 ? "#ffd27a" : "#e25a32";
    g.beginPath();
    g.arc(px, py, p.r, 0, TAU);
    g.fill();
  }
  g.globalAlpha = 1;
  g.restore();
}

// La misma persona de la casa, sentada en el sofá, entera y pequeña.
export function amigo(g, x, y, t) {
  const resp = Math.sin(t * 2.1) * 1.1;
  g.save();
  g.translate(x, y);
  g.fillStyle = "rgba(20,30,16,0.3)";
  g.beginPath();
  g.ellipse(18, 6, 52, 9, 0, 0, TAU);
  g.fill();
  const pata = (x0, y0, w, h) => {
    const gr = g.createLinearGradient(x0, y0, x0 + w, y0 + h);
    gr.addColorStop(0, "#6d82b0");
    gr.addColorStop(0.5, "#3b4a70");
    gr.addColorStop(1, "#243049");
    g.fillStyle = gr;
    redondo(g, x0, y0, w, h, 7);
    g.fill();
  };
  pata(6, -28, 40, 18);
  pata(16, -18, 38, 16);
  pata(38, -16, 15, 22);
  pata(50, -8, 14, 16);
  g.fillStyle = "#fff";
  redondo(g, 34, -2, 24, 9, 4);
  g.fill();
  redondo(g, 48, 2, 22, 9, 4);
  g.fill();
  g.fillStyle = "#d33a34";
  g.fillRect(34, 5, 24, 3);
  g.fillRect(48, 8, 22, 3);
  const tg = g.createLinearGradient(-20, -90, 22, -24);
  tg.addColorStop(0, "#ffb199");
  tg.addColorStop(0.42, "#ff7a62");
  tg.addColorStop(1, "#c43728");
  g.fillStyle = tg;
  redondo(g, -20, -92 + resp, 44, 70, 16);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.28)";
  redondo(g, -14, -86 + resp, 14, 40, 7);
  g.fill();
  g.fillStyle = "#e25540";
  redondo(g, 8, -58 + resp, 32, 13, 6);
  g.fill();
  g.fillStyle = "#efb98e";
  g.beginPath();
  g.ellipse(38, -52 + resp, 8, 5.5, 0.4, 0, TAU);
  g.fill();
  g.fillStyle = "#cc8f66";
  redondo(g, -6, -102 + resp, 14, 14, 4);
  g.fill();
  const hg = g.createRadialGradient(-4, -118 + resp, 2, 2, -108 + resp, 18);
  hg.addColorStop(0, "#f6c7a4");
  hg.addColorStop(1, "#e0a67c");
  g.fillStyle = hg;
  g.beginPath();
  g.ellipse(2, -112 + resp, 15, 16, 0, 0, TAU);
  g.fill();
  g.fillStyle = "#3a2417";
  g.beginPath();
  g.ellipse(-1, -122 + resp, 16, 10, -0.1, 0, TAU);
  g.fill();
  g.beginPath();
  g.ellipse(-12, -112 + resp, 5, 8, 0.2, 0, TAU);
  g.fill();
  g.fillStyle = "#2a160c";
  g.beginPath();
  g.arc(8, -112 + resp, 1.5, 0, TAU);
  g.fill();
  g.strokeStyle = "#a86b48";
  g.lineWidth = 1.2;
  g.beginPath();
  g.arc(9, -104 + resp, 4, 0.2, 1.1);
  g.stroke();
  g.restore();
}

export function rellena(g, al = 0.4) {
  velo(g, al);
  vineta(g, 0.22);
}

export function asienta(t, fin) {
  return suave(tramo(t, fin - 0.34, fin - 0.06));
}

export { suave, tramo, mez };
