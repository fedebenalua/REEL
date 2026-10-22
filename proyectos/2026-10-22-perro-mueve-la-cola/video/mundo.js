// El parque, el perro de espaldas (su derecha es la derecha de la pantalla) y la gente.
import * as k from "#kit";

const { azar, suave, tramo, mez, entra, lienzo, brillo } = k;

export const PERIODO = 0.74;
const DUR = 46.8;

// El golpe de apertura: en el 0 ya se está moviendo hacia el lado largo, y en «lado» (2,16 s) está en el extremo.
const uApertura = k.claves([
  [-0.45, 0.05],
  [0, 0.7],
  [0.24, 1],
  [0.62, 0.05],
  [1.05, -0.72],
  [1.5, 0.12],
  [1.95, 1],
  [2.62, 1],
  [3.2, 0],
]);

export function unidad(t) {
  if (t < 3.2) return uApertura(t);
  return Math.sin(((t - 3.25) / PERIODO) * Math.PI * 2);
}

// sesgo de -1 (más a su izquierda) a 1 (más a su derecha). Devuelve radianes: + a la derecha de la pantalla.
export function extension(sesgo) {
  const s = Math.max(-1, Math.min(1, sesgo));
  return {
    der: 0.36 + 0.82 * (s * 0.5 + 0.5),
    izq: 0.36 + 0.82 * (-s * 0.5 + 0.5),
  };
}

export function angulo(t, sesgo) {
  const u = Math.max(-1, Math.min(1, unidad(t)));
  const { der, izq } = extension(sesgo);
  return u >= 0 ? u * der : u * izq;
}

// Al final, la misma fase que al principio, para que el último fotograma lleve al primero.
export function anguloCierre(t, sesgo, sesgo0) {
  const b = suave(tramo(t, DUR - 1.35, DUR - 0.45));
  return mez(angulo(t, sesgo), angulo(t - DUR, sesgo0), b);
}

export function rastro(t, sesgo, n = 5) {
  const a = [];
  for (let i = n; i >= 1; i--) a.push(angulo(t - i * 0.018, sesgo));
  return a;
}

const bufs = [];
export function conAlfa(g, al, fn) {
  if (al <= 0.015) return;
  if (al >= 0.985) { fn(g); return; }
  const b = bufs.pop() || lienzo(1080, 1920);
  const c = b.getContext("2d");
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  c.globalCompositeOperation = "source-over";
  c.clearRect(0, 0, 1080, 1920);
  fn(c);
  g.save();
  g.globalAlpha *= al;
  g.drawImage(b, 0, 0);
  g.restore();
  bufs.push(b);
}

export function velo(g, al = 0.62) {
  if (al <= 0.02) return;
  const vg = g.createLinearGradient(0, 40, 0, 620);
  vg.addColorStop(0, `rgba(4,12,28,${al})`);
  vg.addColorStop(0.55, `rgba(4,12,28,${al * 0.55})`);
  vg.addColorStop(1, "rgba(4,12,28,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 640);
}

function bulto(g, x, y, rx, ry, luz, medio, sombra, rot = 0) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.beginPath();
  g.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  const gr = g.createRadialGradient(-rx * 0.38, -ry * 0.42, rx * 0.08, rx * 0.1, ry * 0.05, Math.max(rx, ry) * 1.15);
  gr.addColorStop(0, luz);
  gr.addColorStop(0.5, medio);
  gr.addColorStop(1, sombra);
  g.fillStyle = gr;
  g.fill();
  g.restore();
}

function textura(g, x, y, w, h, al, modo = "multiply") {
  g.save();
  g.globalCompositeOperation = modo;
  g.globalAlpha *= al;
  g.drawImage(k.manchas, x, y, w, h);
  g.restore();
}

// ---- parque ----
const azF = azar(7);
const FLORES = Array.from({ length: 14 }, () => ({
  x: 80 + azF() * 920,
  y: 980 + azF() * 520,
  c: azF() > 0.5 ? "#ff5d7a" : azF() > 0.5 ? "#ffd23a" : "#ffffff",
  r: 8 + azF() * 10,
  f: azF() * 6,
}));

export function parque(g, cam, t, frio = 0) {
  const { z, fx, fy } = cam;
  const X = (x) => 540 + (x - fx) * z;
  const Y = (y) => 960 + (y - fy) * z;
  const hor = Y(900);
  const y0 = Math.min(hor - 900, -20);
  const cielo = g.createLinearGradient(0, y0, 0, Math.max(hor, y0 + 40));
  cielo.addColorStop(0, mezColor("#071a40", "#0c2448", frio));
  cielo.addColorStop(0.42, mezColor("#1d6ec8", "#24507a", frio));
  cielo.addColorStop(0.78, mezColor("#8fd0f2", "#6a88a4", frio));
  cielo.addColorStop(1, mezColor("#ffc27a", "#c49278", frio));
  g.fillStyle = cielo;
  g.fillRect(0, 0, 1080, 1920);

  const solX = X(880), solY = Y(560);
  brillo(g, solX, solY, 640 * z, frio > 0.4 ? "160,190,220" : "255,214,150", 0.85 * (1 - frio * 0.35));
  brillo(g, solX, solY, 160 * z, "blanca", 0.7);

  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 3; i++) {
    const cx = X(180 + i * 340 + Math.sin(t * 0.15 + i) * 30);
    const cy = Y(280 + i * 40);
    const r = (90 + i * 30) * z;
    g.fillStyle = `rgba(255,255,255,${0.18 - frio * 0.08})`;
    g.beginPath();
    g.ellipse(cx, cy, r * 1.6, r * 0.7, 0, 0, Math.PI * 2);
    g.ellipse(cx + r * 0.7, cy + r * 0.1, r, r * 0.62, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();

  arbol(g, X(140), Y(900), 1.15 * z, t);
  arbol(g, X(980), Y(930), 0.85 * z, t + 2);

  const hierba = g.createLinearGradient(0, hor - 10, 0, 1920);
  hierba.addColorStop(0, mezColor("#8ed64e", "#6a9a58", frio));
  hierba.addColorStop(0.35, mezColor("#2fa844", "#2c6a40", frio));
  hierba.addColorStop(1, mezColor("#166b32", "#143c28", frio));
  g.fillStyle = hierba;
  g.fillRect(0, hor - 8, 1080, 2000);
  g.save();
  g.beginPath();
  g.rect(0, hor - 8, 1080, 2000);
  g.clip();
  textura(g, -40, hor, 1200, 980, 0.3);
  g.restore();

  // sendero
  g.save();
  g.beginPath();
  g.moveTo(X(430), hor);
  g.quadraticCurveTo(X(480), Y(1200), X(520), 2000);
  g.lineTo(X(760), 2000);
  g.quadraticCurveTo(X(680), Y(1200), X(620), hor);
  g.closePath();
  const camino = g.createLinearGradient(0, hor, 0, 1800);
  camino.addColorStop(0, "#e7c48a");
  camino.addColorStop(1, "#c49255");
  g.fillStyle = camino;
  g.fill();
  g.restore();

  for (const f of FLORES) {
    const x = X(f.x + Math.sin(t * 1.4 + f.f) * 6), y = Y(f.y);
    if (y < hor - 10 || y > 1960) continue;
    g.fillStyle = "#2f8a3a";
    g.fillRect(x - 2, y, 4, 16 * z);
    g.fillStyle = f.c;
    g.beginPath();
    g.arc(x, y, f.r * z, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#ffe27a";
    g.beginPath();
    g.arc(x, y, f.r * z * 0.38, 0, Math.PI * 2);
    g.fill();
  }
}

function arbol(g, x, y, s, t) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  const tronco = g.createLinearGradient(-18, 0, 22, 0);
  tronco.addColorStop(0, "#6a3d22");
  tronco.addColorStop(0.5, "#a86a3c");
  tronco.addColorStop(1, "#4a2814");
  g.fillStyle = tronco;
  g.beginPath();
  g.moveTo(-16, 20);
  g.lineTo(-24, 210);
  g.lineTo(24, 210);
  g.lineTo(16, 20);
  g.fill();
  const copas = [[0, -20, 150], [-70, 30, 110], [78, 24, 100], [10, -90, 100]];
  for (const [cx, cy, r] of copas) {
    const gr = g.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy + Math.sin(t + cx) * 4, r);
    gr.addColorStop(0, "#b6f06a");
    gr.addColorStop(0.45, "#3aaa3e");
    gr.addColorStop(1, "#176826");
    g.fillStyle = gr;
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

function mezColor(a, b, u) {
  return k.mezColor(a, b, Math.max(0, Math.min(1, u)));
}

// ---- cola ----
function trazoCola(g, ang, al, anchoMul) {
  g.save();
  g.rotate(-ang);
  g.globalAlpha *= al;
  const n = 18;
  const iz = [], de = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const y = -u * 390;
    const x = Math.sin(u * 2.4) * 16;
    const w = (34 * (1 - u * 0.78) + 5) * anchoMul;
    const u2 = Math.min(1, u + 0.04);
    const y2 = -u2 * 390;
    const x2 = Math.sin(u2 * 2.4) * 16;
    const dx = x2 - x, dy = y2 - y, L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L;
    iz.push([x + nx * w, y + ny * w]);
    de.push([x - nx * w, y - ny * w]);
  }
  g.beginPath();
  iz.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
  for (let i = de.length - 1; i >= 0; i--) g.lineTo(de[i][0], de[i][1]);
  g.closePath();
  g.lineJoin = "round";
  g.lineWidth = 8;
  g.strokeStyle = "#7a3e12";
  g.stroke();
  const gr = g.createLinearGradient(0, 0, 24, -390);
  gr.addColorStop(0, "#b86a22");
  gr.addColorStop(0.35, "#f0a83e");
  gr.addColorStop(0.75, "#ffd27a");
  gr.addColorStop(1, "#fff1cf");
  g.fillStyle = gr;
  g.fill();
  g.clip();
  textura(g, -120, -420, 260, 450, 0.28);
  const br = g.createLinearGradient(-20, -40, 40, -360);
  br.addColorStop(0, "rgba(255,255,255,0)");
  br.addColorStop(0.4, "rgba(255,244,214,0.5)");
  br.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = br;
  g.fillRect(-140, -430, 280, 450);
  g.restore();
}

// Perro de espaldas. (x, y) es la base de la cola. s es la escala.
export function perroDetras(g, x, y, s, o = {}) {
  const ang = o.ang || 0;
  const paso = o.paso || 0;
  const giro = o.giro || 0;
  g.save();
  g.translate(x, y - paso * 46 * s);
  g.scale(s * (1 - paso * 0.04), s * (1 - paso * 0.04));
  g.rotate(ang * 0.06);

  // sombra
  g.save();
  g.globalAlpha *= 0.28;
  g.fillStyle = "#06220f";
  g.beginPath();
  g.ellipse(10, 250, 150, 28, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();

  // patas
  pata(g, -78, 70);
  pata(g, 62, 70);

  // cuerpo
  bulto(g, 0, 40, 148, 118, "#ffd59a", "#e3923a", "#a85a18");
  g.save();
  g.beginPath();
  g.ellipse(0, 40, 148, 118, 0, 0, Math.PI * 2);
  g.clip();
  textura(g, -160, -90, 330, 250, 0.32);
  g.restore();
  bulto(g, 0, -70, 112, 130, "#ffe0b0", "#e89b40", "#b26520");
  g.save();
  g.beginPath();
  g.ellipse(0, -70, 112, 130, 0, 0, Math.PI * 2);
  g.clip();
  textura(g, -130, -210, 270, 290, 0.26);
  g.restore();

  // cabeza
  g.save();
  g.translate(giro * 28, 0);
  bulto(g, 0, -250, 86, 80, "#ffe3b4", "#e79a3c", "#a85e1c");
  // orejas
  oreja(g, -70, -280, -0.5);
  oreja(g, 74, -278, 0.45);
  // hocico asomando si gira la cara
  if (Math.abs(giro) > 0.04) {
    const hx = giro * 70;
    bulto(g, hx, -230, 36, 28, "#fff4e4", "#f0c48a", "#d9a06a");
    g.fillStyle = "#1c140f";
    g.beginPath();
    g.ellipse(hx + giro * 10, -236, 10, 7, 0, 0, Math.PI * 2);
    g.fill();
    // un ojo
    const ex = hx + (giro > 0 ? -8 : 8);
    ojo(g, ex, -268, 1, o.t || 0);
  }
  // mitades del cerebro, vistas desde atrás: la izquierda del perro queda a la izquierda
  if (o.brilloL > 0.02) mitad(g, -1, o.brilloL, "255,196,70");
  if (o.brilloR > 0.02) mitad(g, 1, o.brilloR, "90,190,255");
  g.restore();

  // collar
  g.save();
  g.translate(0, -168);
  const col = g.createLinearGradient(-50, 0, 50, 0);
  col.addColorStop(0, "#c4322a");
  col.addColorStop(0.5, "#ff6a4a");
  col.addColorStop(1, "#9a241c");
  g.fillStyle = col;
  g.beginPath();
  g.ellipse(0, 0, 48, 16, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#ffe08a";
  g.beginPath();
  g.arc(0, 8, 7, 0, Math.PI * 2);
  g.fill();
  g.restore();

  // la cola por delante, para que el golpe se vea entero; el lomo tapa solo la raíz
  const rast = o.rastro || [];
  for (let i = 0; i < rast.length; i++) {
    const a = (i + 1) / (rast.length + 1);
    trazoCola(g, rast[i], 0.18 * a, 1.05);
  }
  trazoCola(g, ang, 1, 1);
  bulto(g, 0, 28, 70, 48, "#ffd59a", "#e3923a", "#a85a18");

  if (o.nervio > 0.02) nervio(g, o.nervio, o.nervioHacia || 1);
  g.restore();
}

function pata(g, x, y) {
  g.save();
  g.translate(x, y);
  const gr = g.createLinearGradient(-16, 0, 18, 0);
  gr.addColorStop(0, "#d98a38");
  gr.addColorStop(0.45, "#f6c27a");
  gr.addColorStop(1, "#a86420");
  g.fillStyle = gr;
  k.redondo(g, -18, 0, 36, 168, 16);
  g.fill();
  bulto(g, 0, 168, 26, 14, "#f2d2a4", "#c48448", "#8a5424");
  g.restore();
}

function oreja(g, x, y, rot) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  bulto(g, 0, 36, 28, 58, "#ffd7a2", "#d4843a", "#8d4c16");
  bulto(g, 0, 48, 14, 34, "#ffb7c2", "#e08a98", "#c46a78");
  g.restore();
}

function ojo(g, x, y, s, t) {
  const cierra = parpadeo(t, 1.2);
  g.save();
  g.translate(x, y);
  g.scale(s, s * (1 - 0.85 * cierra));
  g.fillStyle = "#fffaf2";
  g.beginPath();
  g.ellipse(0, 0, 16, 18, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#3a2414";
  g.beginPath();
  g.arc(2, 1, 8, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#1a100c";
  g.beginPath();
  g.arc(2, 1, 4.5, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#fff";
  g.beginPath();
  g.arc(-2, -4, 3, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

function parpadeo(t, sem) {
  const c = (t * 0.37 + sem) % 3.8;
  if (c < 3.55) return 0;
  return Math.sin(((c - 3.55) / 0.25) * Math.PI);
}

function mitad(g, lado, al, rgb) {
  g.save();
  g.globalCompositeOperation = "lighter";
  g.globalAlpha *= 0.85 * al;
  const x = lado * 32;
  const gr = g.createRadialGradient(x, -256, 6, x, -250, 110);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.25, `rgba(${rgb},1)`);
  gr.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = gr;
  g.beginPath();
  g.ellipse(x, -252, 78, 90, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

function nervio(g, al, hacia) {
  g.save();
  g.globalCompositeOperation = "lighter";
  g.globalAlpha *= al;
  g.lineCap = "round";
  const x1 = hacia > 0 ? -36 : 36;
  const x2 = hacia > 0 ? 34 : -34;
  const col = hacia > 0 ? "255,196,70" : "90,190,255";
  g.strokeStyle = `rgba(${col},0.95)`;
  g.lineWidth = 26;
  g.beginPath();
  g.moveTo(x1, -230);
  g.quadraticCurveTo(hacia * -20, -120, x2, -8);
  g.stroke();
  g.lineWidth = 6;
  g.strokeStyle = "rgba(255,255,255,0.8)";
  g.stroke();
  brillo(g, x2, -6, 70, col, 0.8);
  g.restore();
}

// Perro de frente, el que impone. (x, y) pecho.
export function perroFrente(g, x, y, s, o = {}) {
  const t = o.t || 0;
  const resp = 1 + Math.sin(t * 1.6) * 0.012;
  g.save();
  g.translate(x, y);
  g.scale(s * resp, s);
  // sombra
  g.save();
  g.globalAlpha *= 0.3;
  g.fillStyle = "#04140c";
  g.beginPath();
  g.ellipse(0, 210, 150, 26, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
  // pecho
  bulto(g, 0, 40, 150, 170, "#6a5344", "#3a2c24", "#1a120e");
  g.save();
  g.beginPath();
  g.ellipse(0, 40, 150, 170, 0, 0, Math.PI * 2);
  g.clip();
  textura(g, -170, -140, 360, 380, 0.4);
  // mancha clara del pecho
  bulto(g, 0, 80, 70, 90, "#f2d7b0", "#d7b088", "#b88860");
  g.restore();
  // patas delanteras
  pataFrente(g, -78, 90, "#4a382c");
  pataFrente(g, 62, 90, "#3a2c22");
  // cabeza
  bulto(g, 0, -150, 108, 96, "#6e5644", "#3c2e24", "#1c1410");
  g.save();
  g.beginPath();
  g.ellipse(0, -150, 108, 96, 0, 0, Math.PI * 2);
  g.clip();
  textura(g, -120, -260, 250, 220, 0.35);
  g.restore();
  // hocico
  bulto(g, 0, -116, 52, 40, "#1a120e", "#0e0b09", "#050403");
  g.fillStyle = "#2a211c";
  g.beginPath();
  g.ellipse(-16, -122, 8, 12, 0.2, 0, Math.PI * 2);
  g.ellipse(16, -122, 8, 12, -0.2, 0, Math.PI * 2);
  g.fill();
  // ojos
  ojoFiero(g, -40, -168, t);
  ojoFiero(g, 40, -168, t + 0.4);
  // cejas
  g.strokeStyle = "#1a120e";
  g.lineWidth = 8;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-62, -196);
  g.quadraticCurveTo(-40, -208, -18, -192);
  g.moveTo(62, -196);
  g.quadraticCurveTo(40, -208, 18, -192);
  g.stroke();
  // orejas erguidas
  orejaErguida(g, -78, -230, -0.25);
  orejaErguida(g, 78, -230, 0.25);
  g.restore();
}

function pataFrente(g, x, y, color) {
  g.save();
  g.translate(x, y);
  g.fillStyle = color;
  k.redondo(g, -20, 0, 42, 150, 16);
  g.fill();
  bulto(g, 0, 148, 28, 14, "#5a4638", "#2c221c", "#1a120e");
  g.restore();
}

function ojoFiero(g, x, y, t) {
  const cierra = parpadeo(t, 2.4);
  g.save();
  g.translate(x, y);
  g.scale(1, 1 - 0.9 * cierra);
  g.fillStyle = "#f4e2b0";
  g.beginPath();
  g.ellipse(0, 0, 18, 16, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#c9862a";
  g.beginPath();
  g.arc(0, 0, 8, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#140e0a";
  g.beginPath();
  g.arc(0, 0, 4, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#fff";
  g.beginPath();
  g.arc(-3, -4, 2.6, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

function orejaErguida(g, x, y, rot) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.beginPath();
  g.moveTo(-22, 30);
  g.quadraticCurveTo(-28, -40, 0, -78);
  g.quadraticCurveTo(26, -36, 22, 30);
  g.closePath();
  const gr = g.createLinearGradient(-20, -70, 20, 30);
  gr.addColorStop(0, "#5a4032");
  gr.addColorStop(1, "#241810");
  g.fillStyle = gr;
  g.fill();
  g.beginPath();
  g.moveTo(-10, 22);
  g.quadraticCurveTo(-12, -24, 0, -52);
  g.quadraticCurveTo(12, -22, 10, 22);
  g.fillStyle = "#e7b08a";
  g.fill();
  g.restore();
}

// Perro de perfil, mirando a la derecha. (x, y) es el pecho.
export function perroLado(g, x, y, s, t = 0) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.save();
  g.globalAlpha *= 0.3;
  g.fillStyle = "#0a1020";
  g.beginPath();
  g.ellipse(20, 150, 170, 22, 0, 0, Math.PI * 2);
  g.fill();
  g.restore();
  // patas
  for (const px of [-70, -20, 80, 130]) {
    g.fillStyle = "#c4843c";
    k.redondo(g, px, 20, 28, 120, 12);
    g.fill();
  }
  bulto(g, 20, -10, 150, 78, "#ffd7a4", "#e0923c", "#a85e1e");
  g.save();
  g.beginPath();
  g.ellipse(20, -10, 150, 78, 0, 0, Math.PI * 2);
  g.clip();
  textura(g, -140, -100, 320, 190, 0.3);
  g.restore();
  // cabeza
  bulto(g, 168, -50, 62, 52, "#ffe0b4", "#e89a40", "#b06820");
  bulto(g, 214, -36, 34, 22, "#fff0dc", "#f0c898", "#d8a878");
  g.fillStyle = "#1a120e";
  g.beginPath();
  g.ellipse(236, -40, 9, 6, 0, 0, Math.PI * 2);
  g.fill();
  oreja(g, 150, -100, 0.4);
  ojo(g, 188, -62, 0.85, t);
  // cola corta de este, quieta, para que no compita
  g.strokeStyle = "#e8a24a";
  g.lineWidth = 16;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-120, -20);
  g.quadraticCurveTo(-160, -70, -150, -110);
  g.stroke();
  g.restore();
}

// Persona de frente. (x, y) pies.
export function personaCara(g, x, y, s, o = {}) {
  const t = o.t || 0;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  // piernas
  pantalon(g, -28, -200);
  pantalon(g, 16, -200);
  // torso
  g.save();
  g.translate(0, -330);
  const cam = g.createLinearGradient(-80, -120, 80, 40);
  cam.addColorStop(0, o.color || "#149e96");
  cam.addColorStop(0.5, o.claro || "#3fd0c4");
  cam.addColorStop(1, o.sombra || "#0c6e68");
  g.fillStyle = cam;
  k.redondo(g, -78, -130, 156, 200, 36);
  g.fill();
  g.restore();
  // cuello
  bulto(g, 0, -430, 22, 28, "#f6c7a4", "#e0a67e", "#c48462");
  // cabeza
  bulto(g, 0, -500, 58, 66, "#ffd8b8", "#f0b48e", "#d4926e");
  // pelo
  g.save();
  g.beginPath();
  g.arc(0, -520, 58, Math.PI, 0);
  g.quadraticCurveTo(48, -500, 52, -470);
  g.lineTo(-52, -470);
  g.quadraticCurveTo(-48, -500, -58, -520);
  g.fillStyle = o.pelo || "#3a2418";
  g.fill();
  const pg = g.createLinearGradient(-40, -560, 20, -500);
  pg.addColorStop(0, "rgba(255,255,255,0.18)");
  pg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = pg;
  g.fill();
  g.restore();
  // cara
  ojo(g, -20, -508, 0.7, t);
  ojo(g, 22, -508, 0.7, t + 0.3);
  g.strokeStyle = "#c47a62";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(0, -496);
  g.lineTo(0, -478);
  g.stroke();
  g.strokeStyle = "#a84848";
  g.lineWidth = 4;
  g.lineCap = "round";
  g.beginPath();
  if (o.sonrisa) {
    g.moveTo(-18, -466);
    g.quadraticCurveTo(0, -448, 20, -466);
  } else {
    g.moveTo(-14, -464);
    g.quadraticCurveTo(0, -456, 16, -464);
  }
  g.stroke();
  // pulgar
  if (o.pulgar > 0.02) pulgar(g, 78, -360, o.pulgar);
  g.restore();
}

function pantalon(g, x, y) {
  g.save();
  g.translate(x, y);
  const gr = g.createLinearGradient(-16, 0, 18, 0);
  gr.addColorStop(0, "#1c2838");
  gr.addColorStop(0.5, "#3a4c62");
  gr.addColorStop(1, "#141c28");
  g.fillStyle = gr;
  k.redondo(g, -16, 0, 34, 170, 12);
  g.fill();
  bulto(g, 2, 168, 20, 12, "#2a3344", "#1a2030", "#0e1218");
  g.restore();
}

function pulgar(g, x, y, al) {
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.rotate(-0.4);
  bulto(g, 0, 0, 16, 48, "#ffd2ae", "#e8a882", "#c88868");
  bulto(g, 0, -48, 18, 16, "#ffe0c4", "#f0b898", "#d89878");
  g.restore();
}

// Persona de espaldas, para la mano derecha. (x, y) pies.
export function personaEspaldas(g, x, y, s, o = {}) {
  const saludo = o.saludo || 0;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  pantalon(g, -26, -200);
  pantalon(g, 18, -200);
  // torso
  g.save();
  g.translate(0, -340);
  const cam = g.createLinearGradient(-90, -140, 90, 40);
  cam.addColorStop(0, "#b85a18");
  cam.addColorStop(0.45, "#ffb15a");
  cam.addColorStop(1, "#d07a28");
  g.fillStyle = cam;
  k.redondo(g, -90, -150, 180, 230, 40);
  g.fill();
  textura(g, -90, -150, 180, 230, 0.18);
  g.restore();
  // cabeza por detrás
  bulto(g, 0, -530, 62, 70, "#6a4632", "#3a2418", "#24140e");
  // mitad izquierda de SU cabeza (izquierda de la pantalla, porque lo vemos de espaldas)
  if (o.brillo > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    brillo(g, -28, -540, 120, "255,196,70", o.brillo);
    g.restore();
  }
  // brazo derecho, el de la pantalla: sube y saluda
  g.save();
  g.translate(86, -470);
  g.rotate(k.mez(0.9, -2.55, saludo));
  const br = g.createLinearGradient(-22, 0, 22, 0);
  br.addColorStop(0, "#d4843a");
  br.addColorStop(0.5, "#ffc27a");
  br.addColorStop(1, "#c46a28");
  g.fillStyle = br;
  k.redondo(g, -22, 0, 44, 210, 18);
  g.fill();
  g.translate(0, 214);
  bulto(g, 0, 8, 34, 28, "#ffe0c4", "#f0b48e", "#d4926c");
  for (let i = -1; i <= 1; i++) {
    g.save();
    g.translate(i * 16, -8);
    g.rotate(-0.5);
    bulto(g, 0, -22, 9, 24, "#ffe6cc", "#f2c0a0", "#d8a080");
    g.restore();
  }
  g.restore();
  g.restore();
}

export function corazon(g, x, y, s, al = 1) {
  if (al <= 0.02 || s <= 0.02) return;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.globalAlpha *= al;
  brillo(g, 0, 10, 280, "255,60,80", 0.55);
  g.beginPath();
  g.moveTo(0, 78);
  g.bezierCurveTo(-130, 10, -90, -90, 0, -36);
  g.bezierCurveTo(90, -90, 130, 10, 0, 78);
  g.closePath();
  const gr = g.createRadialGradient(-20, -20, 8, 0, 10, 120);
  gr.addColorStop(0, "#ffd0d4");
  gr.addColorStop(0.35, "#ff3b55");
  gr.addColorStop(1, "#9a1028");
  g.fillStyle = gr;
  g.fill();
  g.restore();
}

export function arcos(g, x, y, radio, sesgo, al) {
  if (al <= 0.02) return;
  const { der, izq } = extension(sesgo);
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.lineCap = "round";
  g.lineWidth = Math.max(22, radio * 0.08);
  g.strokeStyle = "rgba(255,196,60,0.95)";
  g.beginPath();
  g.arc(0, 0, radio, -Math.PI / 2, -Math.PI / 2 + der);
  g.stroke();
  g.strokeStyle = "rgba(90,190,255,0.95)";
  g.beginPath();
  g.arc(0, 0, radio, -Math.PI / 2 - izq, -Math.PI / 2);
  g.stroke();
  const punta = (a, col) => {
    brillo(g, Math.cos(a) * radio, Math.sin(a) * radio, 36, col, 0.9);
  };
  punta(-Math.PI / 2 + der, "255,196,60");
  punta(-Math.PI / 2 - izq, "90,190,255");
  g.restore();
}

export function marco(g, al) {
  if (al <= 0.02) return;
  g.save();
  g.globalAlpha *= al;
  g.strokeStyle = "rgba(255,255,255,0.9)";
  g.lineWidth = 8;
  k.redondo(g, 90, 530, 900, 900, 36);
  g.stroke();
  g.fillStyle = "#ff3040";
  g.beginPath();
  g.arc(160, 590, 16, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

export function cuarto(g, t) {
  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#f6d7b0");
  fondo.addColorStop(0.45, "#f0b07a");
  fondo.addColorStop(1, "#c47a48");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);
  // ventana de luz
  g.save();
  g.globalCompositeOperation = "lighter";
  brillo(g, 820, 420, 700, "255,220,170", 0.45);
  g.restore();
  // suelo
  const suelo = g.createLinearGradient(0, 1200, 0, 1920);
  suelo.addColorStop(0, "#e0a060");
  suelo.addColorStop(1, "#a86830");
  g.fillStyle = suelo;
  g.fillRect(0, 1280, 1080, 700);
  g.save();
  g.globalAlpha = 0.25;
  for (let i = 0; i < 8; i++) {
    g.strokeStyle = "#8a4e22";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(0, 1320 + i * 70);
    g.lineTo(1080, 1320 + i * 70 + Math.sin(t + i) * 4);
    g.stroke();
  }
  g.restore();
}

export function anochecer(g, t) {
  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#12082a");
  fondo.addColorStop(0.4, "#2a1860");
  fondo.addColorStop(0.72, "#5a3478");
  fondo.addColorStop(1, "#1a1030");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);
  brillo(g, 780, 280, 220, "blanca", 0.55);
  g.fillStyle = "#f4f0ff";
  g.beginPath();
  g.arc(780, 280, 36, 0, Math.PI * 2);
  g.fill();
  const az = azar(3);
  g.fillStyle = "#fff";
  for (let i = 0; i < 40; i++) {
    const x = az() * 1080, y = az() * 900;
    g.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + i));
    g.fillRect(x, y, 3, 3);
  }
  g.globalAlpha = 1;
  // suelo
  const suelo = g.createLinearGradient(0, 1100, 0, 1920);
  suelo.addColorStop(0, "#2a1848");
  suelo.addColorStop(1, "#100818");
  g.fillStyle = suelo;
  g.fillRect(0, 1180, 1080, 800);
}

export function rafagas(g, t, al) {
  if (al <= 0.02) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.globalAlpha *= al;
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + t * 0.4;
    const r0 = 180 + (i % 5) * 40;
    const r1 = r0 + 220;
    g.strokeStyle = `rgba(255,220,160,${0.15 + (i % 3) * 0.08})`;
    g.lineWidth = 6;
    g.beginPath();
    g.moveTo(540 + Math.cos(a) * r0, 980 + Math.sin(a) * r0);
    g.lineTo(540 + Math.cos(a) * r1, 980 + Math.sin(a) * r1);
    g.stroke();
  }
  g.restore();
}

export { entra, suave, tramo, mez };
