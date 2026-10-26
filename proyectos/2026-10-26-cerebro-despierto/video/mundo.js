// Lo que comparten los planos: el mismo cerebro, el mismo guante, la misma lámpara.
import * as k from "#kit";

const az = k.azar(26);

function dentro(x, y) {
  const izq = ((x + 0.22) / 0.62) ** 2 + (y / 0.78) ** 2 < 1;
  const der = ((x - 0.26) / 0.58) ** 2 + ((y + 0.02) / 0.74) ** 2 < 1;
  const fre = (x / 0.72) ** 2 + ((y + 0.42) / 0.42) ** 2 < 1;
  const oc = ((x) / 0.5) ** 2 + ((y - 0.55) / 0.32) ** 2 < 1;
  return (izq || der || fre) && !oc;
}

export const GIRI = [];
for (let n = 0; n < 4000 && GIRI.length < 22; n++) {
  const x = (az() - 0.5) * 1.7, y = (az() - 0.5) * 1.55;
  if (!dentro(x, y)) continue;
  if (Math.abs(x) < 0.07) continue;
  if (GIRI.some((g) => (g.x - x) ** 2 + (g.y - y) ** 2 < 0.028)) continue;
  GIRI.push({ x, y, rx: 0.11 + az() * 0.05, ry: 0.06 + az() * 0.028, a: (az() - 0.5) * 1.1 });
}

const azV = k.azar(77);
export const VASOS = [];
for (let i = 0; i < 7; i++) {
  VASOS.push({
    x: (azV() - 0.5) * 1.1, y: -0.55 + azV() * 1.1,
    dx: 0.15 + azV() * 0.35, dy: 0.2 + azV() * 0.4, lado: azV() < 0.5 ? -1 : 1,
  });
}

export function velo(g, fuerza = 0.72) {
  const vg = g.createLinearGradient(0, 180, 0, 560);
  vg.addColorStop(0, `rgba(3,8,12,${fuerza})`);
  vg.addColorStop(0.62, `rgba(3,8,12,${fuerza * 0.55})`);
  vg.addColorStop(1, "rgba(3,8,12,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 620);
}

export function quirofano(g, t) {
  const f = g.createLinearGradient(0, 0, 0, 1920);
  f.addColorStop(0, "#07161c");
  f.addColorStop(0.45, "#0e3a40");
  f.addColorStop(1, "#061014");
  g.fillStyle = f;
  g.fillRect(0, 0, 1080, 1920);
  const luz = g.createRadialGradient(540, 220, 20, 540, 780, 980);
  luz.addColorStop(0, "rgba(255,228,186,0.55)");
  luz.addColorStop(0.35, "rgba(255,200,140,0.14)");
  luz.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = luz;
  g.fillRect(0, 0, 1080, 1920);
  // paños
  g.fillStyle = "#0a3d3a";
  g.beginPath();
  g.moveTo(0, 420); g.quadraticCurveTo(180, 520, 0, 1920); g.lineTo(0, 420); g.fill();
  g.fillStyle = "#08322f";
  g.beginPath();
  g.moveTo(1080, 380); g.quadraticCurveTo(860, 640, 1080, 1920); g.lineTo(1080, 380); g.fill();
  g.fillStyle = "#115850";
  g.beginPath();
  g.moveTo(0, 1500); g.quadraticCurveTo(540, 1320, 1080, 1560); g.lineTo(1080, 1920); g.lineTo(0, 1920); g.fill();
  // motas en el haz, para que la luz se note viva
  g.save();
  g.globalCompositeOperation = "lighter";
  const mota = k.azar(3);
  for (let i = 0; i < 18; i++) {
    const x = 280 + mota() * 520, y0 = mota() * 1600, v = 40 + mota() * 70;
    const y = (y0 + t * v) % 1500 + 200;
    g.fillStyle = `rgba(255,236,210,${0.15 + mota() * 0.2})`;
    g.beginPath(); g.arc(x, y, 2 + mota() * 2.5, 0, 6.28); g.fill();
  }
  g.restore();
}

export function lampara(g, al = 1) {
  g.save();
  g.translate(540, 250);
  g.globalAlpha = al;
  const aro = g.createRadialGradient(0, 0, 40, 0, 0, 150);
  aro.addColorStop(0, "#fff6e4");
  aro.addColorStop(0.45, "#f0d7a4");
  aro.addColorStop(0.7, "#8a7350");
  aro.addColorStop(1, "rgba(40,30,20,0)");
  g.fillStyle = aro;
  g.beginPath(); g.arc(0, 0, 150, 0, 6.28); g.fill();
  g.strokeStyle = "#d9c39a";
  g.lineWidth = 10;
  g.beginPath(); g.arc(0, 0, 78, 0, 6.28); g.stroke();
  k.brillo(g, 540, 250, 420, "blanca", 0.55 * al);
  g.restore();
}

function trazoCerebro(g, cx, cy, S) {
  g.beginPath();
  g.ellipse(cx - S * 0.22, cy, S * 0.58, S * 0.74, -0.08, 0, 6.28);
  g.ellipse(cx + S * 0.24, cy + S * 0.02, S * 0.54, S * 0.7, 0.1, 0, 6.28);
  g.ellipse(cx, cy - S * 0.28, S * 0.62, S * 0.4, 0, 0, 6.28);
}

export function craneo(g, cx, cy, S) {
  g.save();
  g.beginPath();
  g.ellipse(cx, cy + S * 0.04, S * 1.28, S * 1.08, 0, 0, 6.28);
  g.ellipse(cx, cy, S * 0.98, S * 0.86, 0, 0, 6.28, true);
  const h = g.createLinearGradient(cx - S, cy - S, cx + S, cy + S);
  h.addColorStop(0, "#f7f1e4");
  h.addColorStop(0.45, "#e2d2b8");
  h.addColorStop(1, "#b89a78");
  g.fillStyle = h;
  g.fill("evenodd");
  g.globalAlpha = 0.35;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, cx - S * 1.3, cy - S * 1.1, S * 2.6, S * 2.2);
  g.restore();
  // labio interior, sombra
  g.save();
  g.strokeStyle = "rgba(60,40,28,0.45)";
  g.lineWidth = S * 0.06;
  g.beginPath();
  g.ellipse(cx, cy, S * 0.98, S * 0.86, 0, 0, 6.28);
  g.stroke();
  g.restore();
}

const SURCOS = [
  [[-0.62, -0.05], [-0.28, -0.28], [0.02, -0.08]],
  [[-0.5, 0.22], [-0.18, 0.02], [0.08, 0.28]],
  [[-0.35, -0.48], [-0.05, -0.22], [0.22, -0.42]],
  [[0.12, -0.15], [0.38, 0.08], [0.22, 0.38]],
  [[0.28, -0.48], [0.55, -0.18], [0.42, 0.12]],
  [[-0.15, 0.35], [0.12, 0.55], [0.4, 0.32]],
  [[-0.55, -0.42], [-0.72, -0.1], [-0.48, 0.18]],
  [[0.05, -0.62], [0.28, -0.55], [0.5, -0.35]],
];

// Cerebro visto desde arriba, macizo, con surcos. S es el ancho de un hemisferio.
export function cerebro(g, cx, cy, S, o = {}) {
  const pres = o.presion || 0;
  const tx = o.tx ?? 0.18, ty = o.ty ?? -0.02;
  const corte = o.corte || 0;
  const brilloExtra = o.brillo || 0;
  g.save();
  g.translate(0, 0);
  // sombra
  g.fillStyle = "rgba(0,0,0,0.38)";
  g.beginPath();
  g.ellipse(cx + S * 0.06, cy + S * 0.16, S * 0.95, S * 0.62, 0, 0, 6.28);
  g.fill();
  g.save();
  trazoCerebro(g, cx, cy, S);
  g.clip();
  const base = g.createRadialGradient(cx - S * 0.35, cy - S * 0.4, S * 0.1, cx, cy + S * 0.1, S * 1.35);
  base.addColorStop(0, "#ffc3c6");
  base.addColorStop(0.45, "#e85b6c");
  base.addColorStop(1, "#7c1c30");
  g.fillStyle = base;
  g.fillRect(cx - S * 2, cy - S * 2, S * 4, S * 4);
  g.globalAlpha = 0.28;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.red, cx - S * 1.4, cy - S * 1.2, S * 2.8, S * 2.4);
  g.restore();

  g.save();
  trazoCerebro(g, cx, cy, S);
  g.clip();
  g.strokeStyle = "rgba(90,16,32,0.72)";
  g.lineWidth = Math.max(4, S * 0.045);
  g.lineCap = "round";
  for (const s of SURCOS) {
    g.beginPath();
    g.moveTo(cx + s[0][0] * S, cy + s[0][1] * S);
    g.quadraticCurveTo(cx + s[1][0] * S, cy + s[1][1] * S, cx + s[2][0] * S, cy + s[2][1] * S);
    g.stroke();
  }
  g.strokeStyle = "rgba(255,210,210,0.35)";
  g.lineWidth = Math.max(2, S * 0.02);
  for (const s of SURCOS) {
    g.beginPath();
    g.moveTo(cx + s[0][0] * S, cy + (s[0][1] - 0.06) * S);
    g.quadraticCurveTo(cx + s[1][0] * S, cy + (s[1][1] - 0.06) * S, cx + s[2][0] * S, cy + (s[2][1] - 0.06) * S);
    g.stroke();
  }
  if (pres > 0.02) {
    const px = cx + tx * S, py = cy + ty * S, r = S * 0.22 * pres;
    const hg = g.createRadialGradient(px, py, 2, px, py, r);
    hg.addColorStop(0, "rgba(90,10,24,0.55)");
    hg.addColorStop(1, "rgba(90,10,24,0)");
    g.fillStyle = hg;
    g.beginPath(); g.arc(px, py, r, 0, 6.28); g.fill();
  }
  // cisura
  g.strokeStyle = "rgba(70,12,24,0.75)";
  g.lineWidth = Math.max(3, S * 0.035);
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(cx + S * 0.02, cy - S * 0.7);
  g.bezierCurveTo(cx + S * 0.08, cy - S * 0.2, cx - S * 0.06, cy + S * 0.2, cx + S * 0.01, cy + S * 0.68);
  g.stroke();
  // vasos finos
  g.strokeStyle = "rgba(160,30,48,0.55)";
  g.lineWidth = Math.max(1.5, S * 0.012);
  for (const v of VASOS) {
    g.beginPath();
    g.moveTo(cx + v.x * S, cy + v.y * S);
    g.quadraticCurveTo(cx + (v.x + v.lado * v.dx) * S, cy + (v.y + v.dy * 0.4) * S, cx + (v.x + v.lado * v.dx * 0.3) * S, cy + (v.y + v.dy) * S);
    g.stroke();
  }
  // brillo húmedo
  g.globalCompositeOperation = "screen";
  g.fillStyle = `rgba(255,220,220,${0.22 + brilloExtra})`;
  g.beginPath();
  g.ellipse(cx - S * 0.22, cy - S * 0.28, S * 0.36, S * 0.16, -0.6, 0, 6.28);
  g.fill();
  if (corte > 0.02) {
    g.globalCompositeOperation = "source-over";
    const ancho = S * 0.05 * corte;
    g.strokeStyle = "#4a1020";
    g.lineWidth = ancho;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(cx - S * 0.05, cy + S * 0.02);
    g.quadraticCurveTo(cx + S * 0.05, cy + S * 0.08, cx + S * 0.02, cy + S * 0.22);
    g.stroke();
    g.strokeStyle = "rgba(255,180,180,0.35)";
    g.lineWidth = ancho * 0.35;
    g.stroke();
  }
  g.restore();
  g.restore();
}

// Dos dedos de guante. (x, y) es la yema que toca.
export function guante(g, x, y, S, hunde = 0) {
  g.save();
  g.translate(x, y + hunde);
  g.rotate(0.7);
  const piel = g.createLinearGradient(-S * 0.3, 0, S * 0.4, S);
  piel.addColorStop(0, "#f4fdff");
  piel.addColorStop(0.35, "#9ad8ee");
  piel.addColorStop(1, "#2a7f9e");
  for (const ox of [-S * 0.16, S * 0.18]) {
    g.save();
    g.translate(ox, 0);
    k.redondo(g, -S * 0.16, 0, S * 0.32, S * 1.25, S * 0.16);
    g.fillStyle = piel;
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.7)";
    k.redondo(g, -S * 0.05, S * 0.08, S * 0.08, S * 0.7, 6);
    g.fill();
    g.restore();
  }
  g.fillStyle = piel;
  k.redondo(g, -S * 0.42, S * 0.85, S * 0.95, S * 0.7, S * 0.2);
  g.fill();
  g.restore();
}

export function ojo(g, x, y, S, abierto = 1) {
  const a = Math.max(0.04, Math.min(1, abierto));
  g.save();
  g.translate(x, y);
  // cuenca
  g.fillStyle = "#f0c2a8";
  g.beginPath();
  g.ellipse(0, 8, S * 1.15, S * 0.85, 0, 0, 6.28);
  g.fill();
  g.save();
  g.beginPath();
  g.ellipse(0, 0, S, S * 0.62 * a + S * 0.04, 0, 0, 6.28);
  g.clip();
  g.fillStyle = "#fffaf6";
  g.fillRect(-S * 1.2, -S, S * 2.4, S * 2);
  // iris
  const ig = g.createRadialGradient(-S * 0.08, -S * 0.05, S * 0.05, 0, 0, S * 0.38);
  ig.addColorStop(0, "#8a5a32");
  ig.addColorStop(0.55, "#3d6b45");
  ig.addColorStop(1, "#1b3324");
  g.fillStyle = ig;
  g.beginPath(); g.arc(0, 0, S * 0.38, 0, 6.28); g.fill();
  g.fillStyle = "#14080a";
  g.beginPath(); g.arc(0, 0, S * 0.16, 0, 6.28); g.fill();
  g.fillStyle = "rgba(255,255,255,0.9)";
  g.beginPath(); g.arc(-S * 0.12, -S * 0.12, S * 0.07, 0, 6.28); g.fill();
  g.restore();
  // párpados
  g.fillStyle = "#e7b197";
  g.beginPath();
  g.ellipse(0, -S * 0.15 * (1 - a), S * 1.05, S * 0.55, 0, Math.PI, 0);
  g.fill();
  if (a < 0.95) {
    g.fillStyle = "#e7b197";
    g.beginPath();
    g.ellipse(0, S * 0.05, S * 1.05, S * 0.7 * (1 - a) + 2, 0, 0, Math.PI);
    g.fill();
  }
  // ceja
  g.strokeStyle = "#3a241c";
  g.lineWidth = S * 0.14;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-S * 0.9, -S * 0.85);
  g.quadraticCurveTo(0, -S * 1.25, S * 0.95, -S * 0.7);
  g.stroke();
  g.restore();
}

export function boca(g, x, y, S, habla = 0) {
  const h = Math.max(0.08, habla);
  g.save();
  g.translate(x, y);
  g.fillStyle = "#c46b62";
  g.beginPath();
  g.ellipse(0, 0, S * 0.7, S * 0.28 + h * S * 0.55, 0, 0, 6.28);
  g.fill();
  g.fillStyle = "#6e2430";
  g.beginPath();
  g.ellipse(0, h * S * 0.15, S * 0.42, S * 0.12 + h * S * 0.38, 0, 0, 6.28);
  g.fill();
  if (h > 0.35) {
    g.fillStyle = "#f4d6cc";
    k.redondo(g, -S * 0.28, -S * 0.05, S * 0.56, S * 0.16, 4);
    g.fill();
  }
  g.restore();
}

export function cara(g, x, y, S, abierto, habla) {
  g.save();
  // piel de la cara, solo lo que asoma bajo el paño: frente, ojo, boca
  const pg = g.createLinearGradient(x - S, y - S, x + S, y + S);
  pg.addColorStop(0, "#ffd2ba");
  pg.addColorStop(0.5, "#f0b090");
  pg.addColorStop(1, "#d08868");
  g.fillStyle = pg;
  g.beginPath();
  g.ellipse(x, y + S * 0.15, S * 1.35, S * 1.7, 0, 0, 6.28);
  g.fill();
  g.globalAlpha = 0.3;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, x - S * 1.4, y - S, S * 2.8, S * 2.6);
  g.restore();
  ojo(g, x, y - S * 0.15, S * 0.72, abierto);
  boca(g, x, y + S * 0.85, S * 0.55, habla);
}

export function dedo(g, x, y, S, corte = 0) {
  g.save();
  g.translate(x, y);
  const pg = g.createLinearGradient(-S * 0.45, 0, S * 0.5, 0);
  pg.addColorStop(0, "#d08868");
  pg.addColorStop(0.35, "#f6c2a4");
  pg.addColorStop(0.7, "#ffd8c4");
  pg.addColorStop(1, "#c98462");
  g.fillStyle = pg;
  k.redondo(g, -S * 0.42, -S * 1.15, S * 0.84, S * 2.5, S * 0.42);
  g.fill();
  // uña
  g.fillStyle = "#f7e6dc";
  k.redondo(g, -S * 0.28, -S * 1.22, S * 0.56, S * 0.48, S * 0.2);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.7)";
  k.redondo(g, -S * 0.16, -S * 1.12, S * 0.18, S * 0.28, 8);
  g.fill();
  // pliegue
  g.strokeStyle = "rgba(140,70,55,0.45)";
  g.lineWidth = S * 0.03;
  g.beginPath();
  g.moveTo(-S * 0.36, S * 0.15);
  g.quadraticCurveTo(0, S * 0.28, S * 0.36, S * 0.12);
  g.stroke();
  g.globalAlpha = 0.35;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.red, -S * 0.5, -S * 1.2, S, S * 2.6);
  g.restore();
  if (corte > 0.02) {
    g.save();
    g.translate(x, y - S * 0.15);
    g.strokeStyle = `rgba(160,30,40,${corte})`;
    g.lineWidth = S * 0.035;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(-S * 0.22, 0);
    g.quadraticCurveTo(0, S * 0.08, S * 0.2, -S * 0.02);
    g.stroke();
    g.restore();
  }
}

export function papel(g, x, y, S, ang = -0.4) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  const pg = g.createLinearGradient(0, -S * 0.35, 0, S * 0.35);
  pg.addColorStop(0, "#ffffff");
  pg.addColorStop(1, "#e4e0d8");
  g.fillStyle = pg;
  k.redondo(g, -S * 0.15, -S * 0.55, S * 1.3, S * 1.05, 8);
  g.fill();
  // filo
  g.fillStyle = "#c8c2b6";
  g.fillRect(-S * 0.15, -S * 0.04, S * 0.08, S * 0.5);
  g.restore();
}

const azC = k.azar(404);
export const CELULAS = Array.from({ length: 64 }, () => ({
  x: (azC() - 0.5) * 1300,
  y: (azC() - 0.5) * 2100,
  r: 78 + azC() * 110,
  t: azC(),
}));
export const ALARMAS = Array.from({ length: 7 }, (_, i) => ({
  x: -180 + (i % 3) * 180 + (azC() - 0.5) * 30,
  y: 620 - i * 200,
}));

export function campoPiel(g, t, pulsoHasta) {
  const f = g.createLinearGradient(0, 0, 0, 1920);
  f.addColorStop(0, "#7a3040");
  f.addColorStop(0.5, "#e39a86");
  f.addColorStop(1, "#f3c2ae");
  g.fillStyle = f;
  g.fillRect(0, 0, 1080, 1920);
  for (const c of CELULAS) {
    const y = 960 + c.y * 0.55;
    const x = 540 + c.x * 0.55;
    const r = c.r;
    const cg = g.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    cg.addColorStop(0, c.t > 0.5 ? "#ffd0c4" : "#f0a090");
    cg.addColorStop(1, "#c46868");
    g.fillStyle = cg;
    g.beginPath(); g.arc(x, y, r, 0, 6.28); g.fill();
    g.strokeStyle = "rgba(120,40,50,0.35)";
    g.lineWidth = 3;
    g.stroke();
  }
  ALARMAS.forEach((a, i) => {
    const x = 540 + a.x, y = 960 + a.y * 0.55;
    const on = k.suave(k.tramo(t, pulsoHasta + i * 0.16, pulsoHasta + i * 0.16 + 0.22));
    g.save();
    g.translate(x, y);
    g.fillStyle = on ? "#ffd36a" : "#8a5a4a";
    g.beginPath(); g.arc(0, 0, 28, 0, 6.28); g.fill();
    g.strokeStyle = on ? "#fff4d0" : "#5c332c";
    g.lineWidth = 6;
    g.beginPath(); g.arc(0, 0, 46, 0, 6.28); g.stroke();
    g.restore();
    if (on) k.brillo(g, x, y, 160, "amarilla", 0.8);
  });
}

export function manzana(g, x, y, S, abre = 0) {
  const sep = abre * S * 0.42;
  const mitad = (lado) => {
    g.save();
    g.translate(x + lado * sep, y);
    g.beginPath();
    g.moveTo(0, -S * 0.72);
    g.bezierCurveTo(lado * S * 0.95, -S * 0.7, lado * S * 0.95, S * 0.55, 0, S * 0.78);
    g.closePath();
    const cg = g.createLinearGradient(lado * S, -S, -lado * S * 0.2, S);
    cg.addColorStop(0, "#ff5a4a");
    cg.addColorStop(0.5, "#d4252c");
    cg.addColorStop(1, "#7e1018");
    g.fillStyle = cg;
    g.fill();
    if (abre > 0.05) {
      g.fillStyle = "#f6e2b8";
      g.beginPath();
      g.moveTo(0, -S * 0.55);
      g.lineTo(0, S * 0.6);
      g.lineTo(-lado * S * 0.08 * abre, S * 0.15);
      g.fill();
    }
    g.fillStyle = "rgba(255,255,255,0.35)";
    g.beginPath();
    g.ellipse(lado * S * 0.28, -S * 0.22, S * 0.16, S * 0.28, lado * 0.5, 0, 6.28);
    g.fill();
    g.restore();
  };
  mitad(-1);
  mitad(1);
  if (abre < 0.2) {
    g.strokeStyle = "#6b3a22";
    g.lineWidth = S * 0.06;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(x, y - S * 0.72);
    g.quadraticCurveTo(x + S * 0.05, y - S * 0.95, x + S * 0.02, y - S * 1.05);
    g.stroke();
    g.fillStyle = "#3e8f45";
    g.beginPath();
    g.ellipse(x + S * 0.18, y - S * 0.98, S * 0.16, S * 0.08, 0.6, 0, 6.28);
    g.fill();
  }
}

export function llave(g, x, y, S, ang = 0.4) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  const m = g.createLinearGradient(-S * 0.2, 0, S * 0.3, 0);
  m.addColorStop(0, "#8a6a2e");
  m.addColorStop(0.4, "#f2de98");
  m.addColorStop(0.7, "#d4b15a");
  m.addColorStop(1, "#7a5a28");
  g.strokeStyle = m;
  g.lineWidth = S * 0.2;
  g.beginPath(); g.arc(-S * 0.15, 0, S * 0.32, 0, 6.28); g.stroke();
  g.lineWidth = S * 0.08;
  g.strokeStyle = "rgba(255,255,255,0.65)";
  g.beginPath(); g.arc(-S * 0.22, -S * 0.08, S * 0.32, 3.6, 5.4); g.stroke();
  g.fillStyle = m;
  k.redondo(g, 0, -S * 0.1, S * 0.95, S * 0.2, 6);
  g.fill();
  g.fillRect(S * 0.55, -S * 0.1, S * 0.1, S * 0.32);
  g.fillRect(S * 0.75, -S * 0.1, S * 0.1, S * 0.24);
  g.restore();
}

export function manoPaciente(g, x, y, S, sube) {
  g.save();
  g.translate(x, y - sube);
  const pg = g.createLinearGradient(0, 0, 0, S);
  pg.addColorStop(0, "#ffd0b8");
  pg.addColorStop(1, "#e09878");
  g.fillStyle = pg;
  // palma
  k.redondo(g, -S * 0.45, 0, S * 0.9, S * 0.7, S * 0.3);
  g.fill();
  for (let i = 0; i < 4; i++) {
    k.redondo(g, -S * 0.4 + i * S * 0.22, -S * 0.55, S * 0.18, S * 0.7, S * 0.09);
    g.fill();
  }
  g.restore();
}

export function sonda(g, x, y, S, al = 1) {
  g.save();
  g.translate(x, y);
  g.globalAlpha = al;
  g.strokeStyle = "#d5dde6";
  g.lineWidth = S * 0.08;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(-S * 0.15, -S);
  g.stroke();
  g.strokeStyle = "#9aa6b4";
  g.lineWidth = S * 0.035;
  g.beginPath();
  g.moveTo(-S * 0.08, -S * 0.02);
  g.lineTo(-S * 0.22, -S * 0.95);
  g.moveTo(S * 0.02, 0);
  g.lineTo(-S * 0.08, -S * 0.95);
  g.stroke();
  g.restore();
}

export function anillo(g, x, y, r, on, color = "255,210,90") {
  g.save();
  g.strokeStyle = on > 0.4 ? `rgba(${color},${0.4 + on * 0.6})` : "rgba(80,40,40,0.55)";
  g.lineWidth = 7;
  g.beginPath(); g.arc(x, y, r, 0, 6.28); g.stroke();
  g.fillStyle = on > 0.4 ? `rgba(${color},${on})` : "rgba(40,20,24,0.35)";
  g.beginPath(); g.arc(x, y, r * 0.38, 0, 6.28); g.fill();
  if (on > 0.5) k.brillo(g, x, y, r * 3.2, "amarilla", on * 0.7);
  g.restore();
}

export function lamina(g, x, y, w, h, color, al = 1) {
  g.save();
  g.globalAlpha = al;
  const lg = g.createLinearGradient(x, y, x, y + h);
  lg.addColorStop(0, color[0]);
  lg.addColorStop(1, color[1]);
  g.fillStyle = lg;
  k.redondo(g, x, y, w, h, 28);
  g.fill();
  g.globalAlpha = al * 0.35;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.red, x, y, w, h);
  g.restore();
}

export function brazo(g, x, y, S) {
  g.save();
  g.translate(x, y);
  const pg = g.createLinearGradient(0, -S * 0.4, 0, S * 0.45);
  pg.addColorStop(0, "#f6c2a6");
  pg.addColorStop(0.5, "#e8a888");
  pg.addColorStop(1, "#c47c60");
  g.fillStyle = pg;
  k.redondo(g, -S * 1.5, -S * 0.38, S * 3.1, S * 0.76, S * 0.38);
  g.fill();
  // mano al final
  g.beginPath();
  g.ellipse(S * 1.35, 0, S * 0.42, S * 0.55, 0, 0, 6.28);
  g.fill();
  g.globalAlpha = 0.3;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.red, -S * 1.5, -S * 0.4, S * 3.2, S * 0.9);
  g.restore();
}

export function cuarto(g) {
  const f = g.createLinearGradient(0, 0, 0, 1920);
  f.addColorStop(0, "#2a140e");
  f.addColorStop(0.5, "#5a2a22");
  f.addColorStop(1, "#1a0c0a");
  g.fillStyle = f;
  g.fillRect(0, 0, 1080, 1920);
  const l = g.createRadialGradient(780, 420, 20, 700, 500, 700);
  l.addColorStop(0, "rgba(255,196,120,0.45)");
  l.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = l;
  g.fillRect(0, 0, 1080, 1920);
}

export function busto(g, x, y, S, aprieta = 1) {
  g.save();
  // camiseta
  g.fillStyle = "#1f6f78";
  g.beginPath();
  g.moveTo(x - S * 1.5, y + S * 2.4);
  g.quadraticCurveTo(x, y + S * 0.9, x + S * 1.5, y + S * 2.4);
  g.lineTo(x + S * 1.8, y + S * 3.2);
  g.lineTo(x - S * 1.8, y + S * 3.2);
  g.fill();
  // cuello
  const pg = g.createLinearGradient(x - S, y, x + S, y + S);
  pg.addColorStop(0, "#ffd2ba");
  pg.addColorStop(1, "#e09a78");
  g.fillStyle = pg;
  k.redondo(g, x - S * 0.28, y + S * 0.7, S * 0.56, S * 0.7, 20);
  g.fill();
  // cabeza
  g.beginPath();
  g.ellipse(x, y, S * 0.92, S * 1.12, 0, 0, 6.28);
  g.fill();
  // pelo
  g.fillStyle = "#2a1c16";
  g.beginPath();
  g.ellipse(x, y - S * 0.35, S * 0.96, S * 0.78, 0, Math.PI, 0);
  g.fill();
  g.globalAlpha = 0.28;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, x - S, y - S, S * 2, S * 2.2);
  g.restore();
  // ojos cerrados, ceño
  g.save();
  g.translate(x, y);
  g.strokeStyle = "#3a241c";
  g.lineWidth = S * 0.06;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-S * 0.38, -S * 0.05);
  g.quadraticCurveTo(-S * 0.22, S * 0.02, -S * 0.08, -S * 0.04);
  g.moveTo(S * 0.08, -S * 0.04);
  g.quadraticCurveTo(S * 0.22, S * 0.02, S * 0.38, -S * 0.05);
  g.moveTo(-S * 0.42, -S * 0.28);
  g.quadraticCurveTo(-S * 0.22, -S * 0.42, -S * 0.02, -S * 0.26);
  g.moveTo(S * 0.02, -S * 0.26);
  g.quadraticCurveTo(S * 0.22, -S * 0.42, S * 0.42, -S * 0.28);
  g.stroke();
  g.restore();
  // manos en las sienes
  const hx = S * (0.95 + 0.08 * aprieta);
  const mano = (lado) => {
    g.save();
    g.translate(x + lado * hx, y - S * 0.05);
    g.fillStyle = "#f0b090";
    g.beginPath();
    g.ellipse(0, 0, S * 0.38, S * 0.48, lado * 0.4, 0, 6.28);
    g.fill();
    for (let i = 0; i < 3; i++) {
      g.beginPath();
      g.ellipse(lado * S * 0.05, -S * 0.35 - i * S * 0.02, S * 0.1, S * 0.28, lado * (0.5 + i * 0.15), 0, 6.28);
      g.fill();
    }
    g.restore();
  };
  mano(-1);
  mano(1);
}

export function fundaRoja(g, x, y, S, al) {
  g.save();
  g.globalAlpha = al;
  g.strokeStyle = "rgba(255,60,50,0.9)";
  g.lineWidth = S * 0.08;
  g.beginPath();
  g.ellipse(x, y, S * 0.98, S * 1.15, 0, 0, 6.28);
  g.stroke();
  k.brillo(g, x, y - S * 0.2, S * 2.2, "roja", al * 0.45);
  g.restore();
}
