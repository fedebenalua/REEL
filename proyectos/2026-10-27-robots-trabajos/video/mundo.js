// Lo que comparten los planos: el brazo, la persona de la fábrica, las chispas y el vuelo de la pregunta.
import * as k from "#kit";

export function velo(g) {
  const gr = g.createLinearGradient(0, 220, 0, 560);
  gr.addColorStop(0, "rgba(5,8,14,0.78)");
  gr.addColorStop(1, "rgba(5,8,14,0)");
  g.fillStyle = gr;
  g.fillRect(0, 220, 1080, 360);
}

const azCh = k.azar(77);
export const CHISPAS = Array.from({ length: 36 }, () => ({
  x: (azCh() - 0.42) * 2,
  h: 70 + azCh() * 160,
  v: 0.7 + azCh() * 1.4,
  p: azCh(),
  n: Math.floor(azCh() * 70),
  g: 1.5 + azCh() * 2.4,
}));

export function chispas(g, x, y, t, al = 1, semilla = 0) {
  if (al < 0.02) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  for (const c of CHISPAS) {
    const u = (t * c.v + c.p + semilla) % 1;
    const px = x + c.x * (26 + u * 90);
    const py = y - u * c.h + u * u * 36;
    const a = al * (1 - u) * (1 - u);
    g.fillStyle = `rgba(255,${150 + c.n},70,${a})`;
    g.fillRect(px, py, c.g, c.g * 1.6);
  }
  k.brillo(g, x, y, 70 + 18 * Math.sin(t * 18), "naranja", 0.55 * al);
  g.restore();
}

export function poseBrazo(t, fase = 0) {
  return {
    a1: -0.95 + 0.42 * Math.sin(t * 2.35 + fase),
    a2: 1.25 + 0.5 * Math.sin(t * 2.35 + fase + 0.85),
  };
}

// Origen en la base. Devuelve la punta en pantalla. s ≈ 1 ocupa unos 250 px.
export function brazo(g, x, y, s, t, fase = 0, al = 1) {
  if (al < 0.02 || s < 0.04) return { x, y };
  const { a1, a2 } = poseBrazo(t, fase);
  const L1 = 118 * s, L2 = 102 * s, sy = -30 * s;
  const ex = Math.sin(a1) * L1, ey = sy - Math.cos(a1) * L1;
  const tx = ex + Math.sin(a1 + a2) * L2, ty = ey - Math.cos(a1 + a2) * L2;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.beginPath();
  g.moveTo(-24 * s, 6 * s);
  g.lineTo(-15 * s, sy);
  g.lineTo(15 * s, sy);
  g.lineTo(24 * s, 6 * s);
  g.closePath();
  const bg = g.createLinearGradient(-24 * s, 0, 24 * s, 0);
  bg.addColorStop(0, "#161e2a");
  bg.addColorStop(0.42, "#93a6ba");
  bg.addColorStop(0.55, "#eef3f8");
  bg.addColorStop(1, "#10161f");
  g.fillStyle = bg;
  g.fill();
  g.beginPath();
  g.arc(0, sy, 16 * s, 0, 6.2832);
  g.fillStyle = "#0e7490";
  g.fill();
  g.beginPath();
  g.arc(0, sy, 6.5 * s, 0, 6.2832);
  g.fillStyle = "#67e8f9";
  g.fill();
  const miembro = (x0, y0, x1, y1, gros) => {
    const ang = Math.atan2(y1 - y0, x1 - x0);
    const largo = Math.hypot(x1 - x0, y1 - y0);
    g.save();
    g.translate(x0, y0);
    g.rotate(ang);
    k.redondo(g, 0, -gros / 2, largo, gros, gros / 2);
    const mg = g.createLinearGradient(0, -gros / 2, 0, gros / 2);
    mg.addColorStop(0, "#1c2738");
    mg.addColorStop(0.38, "#c5d2e0");
    mg.addColorStop(0.5, "#f7fafc");
    mg.addColorStop(1, "#141c28");
    g.fillStyle = mg;
    g.fill();
    g.strokeStyle = "#ff8a2a";
    g.lineWidth = Math.max(1.5, gros * 0.1);
    g.beginPath();
    g.moveTo(gros * 0.4, -gros * 0.18);
    g.lineTo(largo - gros * 0.3, -gros * 0.18);
    g.stroke();
    g.restore();
  };
  miembro(0, sy, ex, ey, 30 * s);
  g.beginPath();
  g.arc(ex, ey, 13 * s, 0, 6.2832);
  g.fillStyle = "#155e75";
  g.fill();
  g.beginPath();
  g.arc(ex, ey, 5 * s, 0, 6.2832);
  g.fillStyle = "#67e8f9";
  g.fill();
  miembro(ex, ey, tx, ty, 22 * s);
  g.save();
  g.translate(tx, ty);
  g.rotate(Math.atan2(ty - ey, tx - ex));
  const pinza = (8 + 7 * (0.5 + 0.5 * Math.sin(t * 3.1 + fase))) * s;
  g.fillStyle = "#d5e2ef";
  g.fillRect(-4 * s, -7 * s, 18 * s, 14 * s);
  g.fillRect(-3 * s, -pinza - 16 * s, 7 * s, 18 * s);
  g.fillRect(-3 * s, pinza - 2 * s, 7 * s, 18 * s);
  g.restore();
  g.restore();
  return { x: x + tx, y: y + ty };
}

// Persona de fábrica, pies en (x, y). h es la altura. paso 0..1 la aparta hacia lado.
export function operario(g, x, y, h, t, opts = {}) {
  const al = opts.al ?? 1, lado = opts.lado ?? 1, paso = opts.paso ?? 0;
  if (al < 0.02 || h < 8) return;
  const u = h / 250;
  g.save();
  g.globalAlpha *= al;
  g.translate(x + lado * paso * h * 0.62, y);
  g.translate(0, Math.sin(t * 2.6 + x * 0.01) * 2.4 * u);
  g.fillStyle = "rgba(0,0,0,0.38)";
  g.beginPath();
  g.ellipse(0, 8 * u, 48 * u, 13 * u, 0, 0, 6.2832);
  g.fill();
  const pierna = (sx) => {
    k.redondo(g, sx * 18 * u - 10 * u, -86 * u, 20 * u, 84 * u, 9 * u);
    g.fillStyle = "#1b2434";
    g.fill();
    k.redondo(g, sx * 18 * u - 12 * u, -18 * u, 30 * u, 18 * u, 6 * u);
    g.fillStyle = "#121820";
    g.fill();
  };
  pierna(-1);
  pierna(1);
  k.redondo(g, -36 * u, -176 * u, 72 * u, 100 * u, 18 * u);
  const vg = g.createLinearGradient(-36 * u, 0, 36 * u, 0);
  vg.addColorStop(0, "#c2410c");
  vg.addColorStop(0.38, "#ffb703");
  vg.addColorStop(0.7, "#ffe08a");
  vg.addColorStop(1, "#ea580c");
  g.fillStyle = vg;
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.9)";
  g.fillRect(-36 * u, -132 * u, 72 * u, 8 * u);
  g.save();
  g.translate(-30 * u, -158 * u);
  g.rotate(-0.4);
  k.redondo(g, -8 * u, 0, 16 * u, 72 * u, 8 * u);
  g.fillStyle = "#243049";
  g.fill();
  g.restore();
  g.save();
  g.translate(30 * u, -156 * u);
  g.rotate(0.55 + (opts.brazo ?? 0));
  k.redondo(g, -8 * u, 0, 16 * u, 74 * u, 8 * u);
  g.fillStyle = "#243049";
  g.fill();
  g.restore();
  g.beginPath();
  g.ellipse(0, -198 * u, 32 * u, 30 * u, 0, 0, 6.2832);
  const hg = g.createLinearGradient(-30 * u, -230 * u, 24 * u, -170 * u);
  hg.addColorStop(0, "#fff6c2");
  hg.addColorStop(0.5, "#ffd60a");
  hg.addColorStop(1, "#d97706");
  g.fillStyle = hg;
  g.fill();
  k.redondo(g, -24 * u, -196 * u, 48 * u, 16 * u, 7 * u);
  g.fillStyle = "#101828";
  g.fill();
  g.restore();
  k.brillo(g, x + lado * paso * h * 0.62, y - h * 0.86, h * 0.28, "amarilla", 0.35 * al);
}

export function panelCoche(g, x, y, s, calor = 1) {
  g.save();
  g.translate(x, y);
  k.redondo(g, -78 * s, -128 * s, 156 * s, 168 * s, 22 * s);
  const pg = g.createLinearGradient(-78 * s, -40 * s, 78 * s, 40 * s);
  pg.addColorStop(0, "#2c384c");
  pg.addColorStop(0.4, "#8ea0b8");
  pg.addColorStop(0.62, "#f3f7fb");
  pg.addColorStop(1, "#1e2838");
  g.fillStyle = pg;
  g.fill();
  g.strokeStyle = `rgba(255,150,50,${0.35 + 0.6 * calor})`;
  g.lineWidth = Math.max(3, 7 * s);
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-46 * s, -10 * s);
  g.quadraticCurveTo(0, 24 * s, 54 * s, 36 * s);
  g.stroke();
  g.restore();
}

export function oficio(g, tipo, x, y, s, t) {
  if (tipo === "coche") panelCoche(g, x, y - 0.15 * s, s * 0.9, 0.8 + 0.2 * Math.sin(t * 8));
  if (tipo === "cocina") {
    g.save();
    g.translate(x, y);
    k.redondo(g, -50 * s, -16 * s, 100 * s, 26 * s, 8 * s);
    g.fillStyle = "#2a2118";
    g.fill();
    g.beginPath();
    g.ellipse(0, -24 * s, 34 * s, 14 * s, 0, 0, 6.2832);
    g.fillStyle = "#e2e8f0";
    g.fill();
    g.restore();
    for (let i = 0; i < 5; i++) k.lengua(g, x + (i - 2) * 14 * s, y - 20 * s, 32 * s, 12 * s, t, i, "255,120,30", "255,214,120");
  }
  if (tipo === "mesa") {
    g.save();
    g.translate(x, y);
    k.redondo(g, -70 * s, -18 * s, 140 * s, 22 * s, 6 * s);
    g.fillStyle = "#9a6b3f";
    g.fill();
    g.fillStyle = "#f8fafc";
    g.save();
    g.rotate(-0.12);
    g.fillRect(-20 * s, -70 * s, 36 * s, 48 * s);
    g.restore();
    g.fillStyle = "#fde68a";
    g.beginPath();
    g.arc(40 * s, -48 * s, 10 * s, 0, 6.2832);
    g.fill();
    g.restore();
    k.brillo(g, x + 40 * s, y - 48 * s, 50 * s, "amarilla", 0.7);
  }
  if (tipo === "cajas") {
    const colores = ["#fb923c", "#38bdf8", "#facc15"];
    for (let i = 0; i < 3; i++) {
      const yy = y - i * 28 * s + Math.sin(t * 2 + i) * 1.5;
      k.redondo(g, x - 36 * s + i * 8 * s, yy - 26 * s, 70 * s, 28 * s, 4 * s);
      g.fillStyle = colores[i];
      g.fill();
    }
  }
  if (tipo === "obra") {
    for (let fila = 0; fila < 3; fila++) {
      for (let col = 0; col < 3 - (fila === 2 ? 1 : 0); col++) {
        const xx = x - 40 * s + col * 30 * s + (fila % 2) * 12 * s;
        const yy = y - 16 * s - fila * 18 * s;
        k.redondo(g, xx, yy, 28 * s, 16 * s, 2 * s);
        g.fillStyle = fila % 2 ? "#c2410c" : "#ea580c";
        g.fill();
      }
    }
  }
}

const TIPOS_VUELO = ["coche", "cocina", "mesa", "cajas", "obra"];

const azR = k.azar(19);
const RACHAS = Array.from({ length: 22 }, () => ({
  x: azR() * 1080,
  y0: azR() * 1920,
  v: 500 + azR() * 800,
  w: 1.6 + azR() * 2,
  c: azR() < 0.5 ? "255,186,90" : "120,220,255",
}));

// Un puesto enorme que cruza la pantalla. En t=0 ya está el primero, a tamaño completo.
export function fabricaVuelo(g, t) {
  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#070b16");
  fondo.addColorStop(0.4, "#141c30");
  fondo.addColorStop(1, "#24150d");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);
  g.fillStyle = "#1a120c";
  g.fillRect(0, 1480, 1080, 440);
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 240, 900, 520, "naranja", 0.22);
  k.brillo(g, 860, 860, 420, "cian", 0.18);
  g.restore();

  const raw = Math.min(TIPOS_VUELO.length - 1, Math.max(0, (t - 0.7) * 0.98));
  const base = Math.floor(raw + 1e-4);
  const frac = raw - base;
  const idx = base >= TIPOS_VUELO.length - 1 ? TIPOS_VUELO.length - 1 : base + (frac < 0.62 ? 0 : k.suave((frac - 0.62) / 0.38));
  const orden = TIPOS_VUELO.map((_, i) => i).sort((a, b) => Math.abs(b - idx) - Math.abs(a - idx));
  for (const i of orden) {
    const d = i - idx;
    if (Math.abs(d) > 1.05) continue;
    const x = 540 + d * 1300;
    const s = 4.2 / (1 + Math.abs(d) * 1.35);
    oficio(g, TIPOS_VUELO[i], x - 150, 1120, s, t + i);
    operario(g, x + 210, 1520, Math.min(640, s * 135), t, { paso: 0.12, lado: 1, brazo: -1.15 });
    const tip = brazo(g, x - 300, 1340, s * 0.88, t, i * 0.7);
    if (TIPOS_VUELO[i] === "coche") chispas(g, tip.x, tip.y, t, 0.95, i);
    else k.brillo(g, tip.x, tip.y, 34 * s, "cian", 0.45);
  }

  if (idx < TIPOS_VUELO.length - 1.05) {
    g.save();
    g.globalCompositeOperation = "lighter";
    g.lineCap = "round";
    for (const r of RACHAS) {
      const y = (r.y0 + t * r.v) % 2000 - 40;
      g.strokeStyle = `rgba(${r.c},0.22)`;
      g.lineWidth = r.w;
      g.beginPath();
      g.moveTo(r.x, y);
      g.lineTo(r.x - 22, y - 36);
      g.stroke();
    }
    g.restore();
  }
}

export function fondoNave(g) {
  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#0b101c");
  fondo.addColorStop(0.5, "#172033");
  fondo.addColorStop(1, "#2a160e");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 180, 430, 420, "naranja", 0.35);
  k.brillo(g, 900, 380, 360, "cian", 0.28);
  g.restore();
}
