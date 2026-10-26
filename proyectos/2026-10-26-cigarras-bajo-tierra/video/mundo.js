// Lo que comparten los planos: la cigarra adulta (la de aquí, gris y de alas moteadas, y la de diecisiete años, negra
// de ojos rojos y venas naranjas), su ninfa, el árbol de verano y su suelo en corte, con las raíces y las cámaras de
// las ninfas. Todo en 2D, en coordenadas del mundo (px a zoom 1); vista() pone la cámara.
//
// El mundo del árbol: la superficie del suelo en y = 0; el tronco en x = 0 sube hasta y = -2300; la ninfa de aquí,
// en NINFA_A; la de diecisiete años, más honda, en NINFA_B.
import * as k from "#kit";

const { azar, lienzo, mez, suave: su, tramo: tr } = k;
// Como k.mezColor, pero devuelve "#rrggbb" (para poder volver a mezclarlo).
const mh = (a, b, u) => "#" + k.mezColor(a, b, u).match(/\d+/g).map((c) => (+c).toString(16).padStart(2, "0")).join("");

// ---------------------------------------------------------------- la cámara 2D
// Mira al punto (cx, cy) del mundo con zoom Z: lo que está en (cx, cy) sale en el centro de la pantalla.
export function vista(g, Z, cx, cy, ang = 0) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.translate(540, 960); if (ang) g.rotate(ang); g.scale(Z, Z); g.translate(-cx, -cy);
}
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
// Una cámara que pasa por claves [t, [Z, cx, cy]] sin tirones (el zoom, en log, para que se aleje con ritmo parejo).
export function camino2D(claves) {
  const Zs = k.claves(claves.map(([t, c]) => [t, Math.log(c[0])])), X = k.claves(claves.map(([t, c]) => [t, c[1]])), Y = k.claves(claves.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}
// Lo que se ve del mundo con esa cámara: [x0, y0, x1, y1].
export const ventana = (Z, cx, cy) => [cx - 540 / Z, cy - 960 / Z, cx + 540 / Z, cy + 960 / Z];

// Un velo oscuro arriba, detrás del subtítulo.
export function velo(g, al = 0.5, color = "8,5,3") {
  if (al <= 0.01) return;
  g.save(); sinVista(g);
  const vg = g.createLinearGradient(0, 160, 0, 720);
  vg.addColorStop(0, `rgba(${color},${al})`); vg.addColorStop(0.6, `rgba(${color},${al * 0.65})`); vg.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 720); g.restore();
}
export function vineta(g, al = 0.55) {
  g.save(); sinVista(g);
  const vg = g.createRadialGradient(540, 960, 560, 540, 960, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920); g.restore();
}

// ---------------------------------------------------------------- texturas
// La corteza: vetas verticales oscuras y grietas, en gris (se tiñe al pintarla con "multiply").
export const corteza = (() => {
  const W = 512, H = 1024, l = lienzo(W, H), c = l.getContext("2d"), az = azar(77);
  c.fillStyle = "#d8d8d8"; c.fillRect(0, 0, W, H);
  // cada veta se dibuja también una altura más arriba: así la textura se repite hacia abajo sin juntas
  for (let i = 0; i < 300; i++) {
    const x = az() * W, w = 2 + az() * 10, y0 = az() * H, L = 120 + az() * 600, pts = [];
    let xx = x;
    for (let y = y0; y < y0 + L; y += 30) { xx += (az() - 0.5) * 8; pts.push([xx, y]); }
    const a = 0.25 + az() * 0.5, luz = az() < 0.4 ? 0.25 + az() * 0.3 : 0;
    for (const dy of [0, -H]) {
      c.strokeStyle = `rgba(40,40,40,${a})`; c.lineWidth = w; c.lineCap = "round";
      c.beginPath(); pts.forEach(([px, py], j) => (j ? c.lineTo(px, py + dy) : c.moveTo(px, py + dy))); c.stroke();
      if (luz) { c.strokeStyle = `rgba(255,255,255,${luz})`; c.lineWidth = w * 0.4; c.beginPath(); pts.forEach(([px, py], j) => (j ? c.lineTo(px + w * 0.9, py + dy) : c.moveTo(px + w * 0.9, py + dy))); c.stroke(); }
    }
  }
  return l;
})();
// La tierra: grumos y granos, en gris.
export const grano = (() => {
  const W = 768, l = lienzo(W, W), c = l.getContext("2d"), az = azar(91);
  c.fillStyle = "#c4c4c4"; c.fillRect(0, 0, W, W);
  // cada grano se dibuja también al otro lado de los bordes: la textura se repite sin juntas
  for (let i = 0; i < 3200; i++) {
    const x = az() * W, y = az() * W, r = 0.8 + Math.pow(az(), 3) * 8, b = az(), e = 0.6 + az() * 0.4, an = az() * 3;
    c.fillStyle = b < 0.55 ? `rgba(20,20,20,${0.25 + az() * 0.45})` : `rgba(255,255,255,${0.2 + az() * 0.45})`;
    for (const dx of [-W, 0, W]) for (const dy of [-W, 0, W]) {
      if (x + dx < -10 || x + dx > W + 10 || y + dy < -10 || y + dy > W + 10) continue;
      c.beginPath(); c.ellipse(x + dx, y + dy, r, r * e, an, 0, 6.2832); c.fill();
    }
  }
  return l;
})();

// ---------------------------------------------------------------- el cielo de verano
export function cielo(g, x0, y0, x1, y1, t, tono = 0) {
  const sg = g.createLinearGradient(0, y0, 0, Math.min(y1, 0));
  sg.addColorStop(0, k.mezColor("#1d6fd8", "#ff7a3c", tono)); sg.addColorStop(0.65, k.mezColor("#5fb4ff", "#ffb35a", tono)); sg.addColorStop(1, k.mezColor("#cfeeff", "#ffe0a0", tono));
  g.fillStyle = sg; g.fillRect(x0, y0, x1 - x0, Math.min(y1, 0) - y0);
}

// ---------------------------------------------------------------- el árbol
const azH = azar(1234);
// Las hojas de la copa: manchas de hojas alrededor de la parte alta del tronco.
const HOJAS = Array.from({ length: 150 }, () => {
  const a = azH() * 6.2832, r = Math.sqrt(azH());
  return { x: Math.cos(a) * r * 900, y: -2350 + Math.sin(a) * r * 520, s: 70 + azH() * 120, f: azH() * 6, c: azH() };
});
HOJAS.sort((a, b) => a.y - b.y);
const FLORES = Array.from({ length: 220 }, () => {
  const h = HOJAS[Math.floor(azH() * HOJAS.length)];
  return { x: h.x + (azH() - 0.5) * h.s * 1.6, y: h.y + (azH() - 0.5) * h.s, s: 42 + azH() * 40, f: azH() * 6, r: azH() };
});
// Las ramas gruesas que salen del tronco hacia la copa.
const RAMAS = [[-1, -1750, -700, -2250, 46], [1, -1900, 760, -2300, 42], [-1, -2100, -420, -2550, 32], [1, -2150, 360, -2600, 30]];

export function tronco(g, t, x0 = -95, x1 = 95, ytop = -2400, ybot = 40) {
  g.save();
  g.beginPath();
  g.moveTo(x0, ytop); g.lineTo(x1, ytop);
  g.lineTo(x1, ybot - 140); g.quadraticCurveTo(x1 + 10, ybot - 20, x1 + 110, ybot); g.lineTo(x0 - 110, ybot); g.quadraticCurveTo(x0 - 10, ybot - 20, x0, ybot - 140);
  g.closePath();
  const tg = g.createLinearGradient(x0 - 60, 0, x1 + 60, 0);
  tg.addColorStop(0, "#2a170c"); tg.addColorStop(0.28, "#8a5a34"); tg.addColorStop(0.45, "#b07a4a"); tg.addColorStop(0.75, "#5a3519"); tg.addColorStop(1, "#1e1008");
  g.fillStyle = tg; g.fill();
  g.clip();
  g.globalCompositeOperation = "multiply";
  for (let y = ytop; y < ybot; y += 1024 * 0.9) g.drawImage(corteza, x0 - 120, y, (x1 - x0) + 240, 1024 * 0.9);
  g.globalCompositeOperation = "source-over";
  // la luz del sol por la izquierda
  const lg = g.createLinearGradient(x0, 0, x1, 0);
  lg.addColorStop(0, "rgba(255,210,140,0)"); lg.addColorStop(0.32, "rgba(255,210,140,0.28)"); lg.addColorStop(0.5, "rgba(255,210,140,0)");
  g.fillStyle = lg; g.fillRect(x0 - 120, ytop, x1 - x0 + 240, ybot - ytop);
  g.restore();
}
export function ramas(g) {
  for (const [, y0, x1, y1, w] of RAMAS) {
    g.save();
    g.beginPath(); g.moveTo(0, y0 + w); g.quadraticCurveTo(x1 * 0.35, y0 - 60, x1, y1); g.lineTo(x1, y1 - w * 0.5); g.quadraticCurveTo(x1 * 0.35, y0 - 60 - w * 1.6, 0, y0 - w);
    g.closePath();
    const rg = g.createLinearGradient(0, y0 - w, 0, y0 + w); rg.addColorStop(0, "#a06a3e"); rg.addColorStop(1, "#2a160a");
    g.fillStyle = rg; g.fill();
    g.restore();
  }
}
// La copa. flor: 0 a 1, cuánto ha florecido (rosa). verde: 1 verano; 0, sin hojas (invierno). t: para que se mueva.
// La copa, hecha de hojas sueltas (cada mata de hojas, con su luz desde arriba a la izquierda), dibujada una vez.
const COPA_X = -1250, COPA_Y = -3150;
const copaImg = (() => {
  const l = lienzo(2500, 1650), c = l.getContext("2d"), az = azar(4545);
  c.translate(-COPA_X, -COPA_Y);
  for (const h of HOJAS) {
    // la sombra de la mata
    const sg = c.createRadialGradient(h.x, h.y, h.s * 0.2, h.x, h.y, h.s * 1.25);
    sg.addColorStop(0, "rgba(8,40,10,0.85)"); sg.addColorStop(1, "rgba(8,40,10,0)");
    c.fillStyle = sg; c.beginPath(); c.arc(h.x, h.y, h.s * 1.25, 0, 6.2832); c.fill();
    const n = Math.round(h.s * 0.45);
    for (let i = 0; i < n; i++) {
      const a = az() * 6.2832, r = Math.sqrt(az()) * h.s, x = h.x + Math.cos(a) * r, y = h.y + Math.sin(a) * r * 0.85;
      const luz = Math.max(0, Math.min(1, 0.55 - (x - h.x) / h.s * 0.25 - (y - h.y) / h.s * 0.45 + (az() - 0.5) * 0.35 + (h.c - 0.5) * 0.3));
      const L = 26 + az() * 22, an = az() * 6.2832;
      c.save(); c.translate(x, y); c.rotate(an);
      c.fillStyle = k.mezColor("#13501a", "#9be35a", luz);
      c.beginPath(); c.moveTo(-L / 2, 0); c.quadraticCurveTo(0, -L * 0.32, L / 2, 0); c.quadraticCurveTo(0, L * 0.32, -L / 2, 0); c.fill();
      c.strokeStyle = `rgba(0,30,0,${0.35})`; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-L / 2, 0); c.lineTo(L / 2, 0); c.stroke();
      c.restore();
    }
  }
  return l;
})();
export function copa(g, t, verde = 1, flor = 0) {
  g.save();
  if (verde > 0.01) {
    g.globalAlpha = Math.min(1, verde * 1.3);
    g.drawImage(copaImg, COPA_X + Math.sin(t * 1.1) * 5, COPA_Y + Math.cos(t * 0.9) * 3);
  }
  g.globalAlpha = 1;
  if (flor > 0.01) for (const f of FLORES) {
    const s = f.s * su(tr(flor, f.r * 0.4, f.r * 0.4 + 0.6));
    if (s < 1) continue;
    const x = f.x + Math.sin(t * 1.3 + f.f) * 6, y = f.y;
    for (let p = 0; p < 5; p++) {
      const a = p * 1.2566 + f.f, px = x + Math.cos(a) * s * 0.55, py = y + Math.sin(a) * s * 0.55;
      g.fillStyle = "#ffc6dc"; g.beginPath(); g.arc(px, py, s * 0.5, 0, 6.2832); g.fill();
    }
    g.fillStyle = "#ff6fa3"; g.beginPath(); g.arc(x, y, s * 0.3, 0, 6.2832); g.fill();
  }
  g.restore();
}

// ---------------------------------------------------------------- el suelo en corte
// Dónde está cada ninfa (su centro) y su largo: cada una agarrada a su raíz, con el pico hacia ella.
export const NINFA_A = [112, 712], LA = 300;
export const NINFA_B = [-498, 1590], LB = 380;
const azR = azar(4321);
// Una raíz: puntos [x, y] con su grosor, de la base del tronco hacia abajo; ramitas que salen de ella.
function raiz(puntos, w0, w1) { return { puntos, w0, w1 }; }
export const RAICES = [
  raiz([[60, 20], [160, 260], [210, 520], [250, 760], [300, 1100], [420, 1500]], 46, 8),
  raiz([[-50, 20], [-180, 380], [-260, 900], [-320, 1400], [-330, 1650], [-300, 2100]], 50, 10),
  raiz([[-80, 10], [-420, 160], [-700, 420], [-900, 760]], 34, 5),
  raiz([[90, 10], [460, 140], [760, 360], [980, 640]], 30, 5),
  raiz([[0, 30], [20, 500], [-40, 1000], [40, 1500], [0, 2200]], 34, 6),
  raiz([[-260, 900], [-560, 1150], [-760, 1500]], 18, 4),
  raiz([[250, 760], [480, 900], [700, 1200]], 16, 4),
];
for (let i = 0; i < 26; i++) {
  const base = RAICES[Math.floor(azR() * 5)], j = 1 + Math.floor(azR() * (base.puntos.length - 2)), [x, y] = base.puntos[j];
  const a = (azR() < 0.5 ? -1 : 1) * (0.4 + azR() * 0.9) + Math.PI / 2, L = 120 + azR() * 320;
  const pts = [[x, y]]; let px = x, py = y, aa = a;
  for (let s = 0; s < 4; s++) { aa += (azR() - 0.5) * 0.6; px += Math.cos(aa) * L / 4; py += Math.abs(Math.sin(aa)) * L / 4; pts.push([px, py]); }
  RAICES.push(raiz(pts, 10 + azR() * 6, 1.5));
}
const PIEDRAS = Array.from({ length: 140 }, () => ({ x: -1600 + azR() * 3200, y: 60 + azR() * 3000, r: 10 + Math.pow(azR(), 2) * 50, a: azR() * 3, c: azR() }));

// El trazo de una raíz, como una cinta que adelgaza, con su luz.
function cinta(g, pts, w0, w1, relleno, conLuz = true) {
  const n = pts.length, izq = [], der = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
    const w = mez(w0, w1, i / (n - 1)) / 2, nx = -dy / d, ny = dx / d;
    izq.push([pts[i][0] + nx * w, pts[i][1] + ny * w]); der.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
  }
  const camino = (L) => { g.moveTo(L[0][0], L[0][1]); for (let i = 1; i < n - 1; i++) { const m = [(L[i][0] + L[i + 1][0]) / 2, (L[i][1] + L[i + 1][1]) / 2]; g.quadraticCurveTo(L[i][0], L[i][1], m[0], m[1]); } g.lineTo(L[n - 1][0], L[n - 1][1]); };
  g.beginPath(); camino(izq); const r = der.slice().reverse(); g.lineTo(r[0][0], r[0][1]); for (let i = 1; i < n - 1; i++) { const m = [(r[i][0] + r[i + 1][0]) / 2, (r[i][1] + r[i + 1][1]) / 2]; g.quadraticCurveTo(r[i][0], r[i][1], m[0], m[1]); } g.lineTo(r[n - 1][0], r[n - 1][1]); g.closePath();
  g.fillStyle = relleno; g.fill();
  if (conLuz) { g.save(); g.beginPath(); camino(izq); g.strokeStyle = "rgba(255,190,120,0.55)"; g.lineWidth = Math.max(2, w0 * 0.12); g.stroke(); g.restore(); }
}
export function dibujaRaiz(g, R, relleno = "#7a4a26") { cinta(g, R.puntos, R.w0, R.w1, relleno); }
// Un camino por puntos: en(s) da el punto a s px del principio; largo, lo que mide.
export function recorrido(pts) {
  const largos = [0];
  for (let i = 1; i < pts.length; i++) largos.push(largos[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const largo = largos[largos.length - 1];
  const en = (s) => {
    s = Math.max(0, Math.min(largo, s));
    let i = 1; while (i < largos.length - 1 && largos[i] < s) i++;
    const u = (s - largos[i - 1]) / (largos[i] - largos[i - 1] || 1);
    return [mez(pts[i - 1][0], pts[i][0], u), mez(pts[i - 1][1], pts[i][1], u)];
  };
  return { en, largo };
}

// La tierra, de y = 0 hacia abajo, entre x0 y x1 (y hasta y1). luz: el brillo cálido de las cámaras.
export function tierra(g, x0, y0, x1, y1, t) {
  if (y1 <= 0) return;
  const a = Math.max(0, y0);
  const sg = g.createLinearGradient(0, 0, 0, 3200);
  sg.addColorStop(0, "#6b4024"); sg.addColorStop(0.04, "#57331c"); sg.addColorStop(0.3, "#4a2a16"); sg.addColorStop(0.6, "#5a3a1c"); sg.addColorStop(1, "#2e1a0c");
  g.fillStyle = sg; g.fillRect(x0, a, x1 - x0, y1 - a);
  // las capas
  g.save(); g.globalAlpha = 0.35;
  for (const [yy, h, c] of [[420, 160, "#7a4d26"], [1180, 220, "#3a2010"], [2050, 260, "#7a5428"], [2700, 200, "#2a160a"]]) {
    if (yy + h < a || yy > y1) continue;
    const lg = g.createLinearGradient(0, yy, 0, yy + h); lg.addColorStop(0, "rgba(0,0,0,0)"); lg.addColorStop(0.5, c); lg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = lg; g.fillRect(x0, yy, x1 - x0, h);
  }
  g.restore();
  // la textura de grano
  g.save(); g.beginPath(); g.rect(x0, a, x1 - x0, y1 - a); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.9;
  const T = 900, i0 = Math.floor(x0 / T), i1 = Math.ceil(x1 / T), j0 = Math.floor(a / T), j1 = Math.ceil(y1 / T);
  for (let i = i0; i < i1; i++) for (let j = j0; j < j1; j++) g.drawImage(grano, i * T, j * T, T, T);
  // las manchas grandes, una sola vez sobre todo el suelo (sin juntas)
  g.globalAlpha = 0.55; g.drawImage(k.manchas, -2600, -200, 5200, 3800);
  g.restore();
  // las piedras
  for (const p of PIEDRAS) {
    if (p.x + p.r < x0 || p.x - p.r > x1 || p.y + p.r < a || p.y - p.r > y1) continue;
    const pg = g.createRadialGradient(p.x - p.r * 0.35, p.y - p.r * 0.4, p.r * 0.1, p.x, p.y, p.r * 1.1);
    pg.addColorStop(0, k.mezColor("#c9a27a", "#9a8a80", p.c)); pg.addColorStop(1, k.mezColor("#3a2414", "#2a2420", p.c));
    g.fillStyle = pg; g.beginPath(); g.ellipse(p.x, p.y, p.r, p.r * 0.7, p.a, 0, 6.2832); g.fill();
  }
}
// La hierba del borde del suelo, a contraluz.
const HIERBA = Array.from({ length: 700 }, () => ({ x: -2400 + azR() * 4800, h: 30 + azR() * 70, a: (azR() - 0.5) * 0.6, c: azR() }));
export function hierba(g, x0, x1, t) {
  g.save(); g.lineCap = "round";
  for (const b of HIERBA) {
    if (b.x < x0 - 60 || b.x > x1 + 60) continue;
    const s = Math.sin(t * 2 + b.x * 0.01) * 0.08;
    g.strokeStyle = k.mezColor("#2f7a1f", "#9fe060", b.c); g.lineWidth = 7;
    g.beginPath(); g.moveTo(b.x, 4); g.quadraticCurveTo(b.x + (b.a + s) * b.h * 0.5, -b.h * 0.5, b.x + (b.a + s) * b.h, -b.h); g.stroke();
  }
  g.restore();
}
// La cámara de una ninfa: un hueco ovalado en la tierra, más oscuro, con borde de luz cálida.
export function hueco(g, x, y, rx, ry, al = 1) {
  g.save(); g.globalAlpha *= al;
  const hg = g.createRadialGradient(x, y - ry * 0.2, rx * 0.2, x, y, rx * 1.05);
  hg.addColorStop(0, "#2a160a"); hg.addColorStop(0.85, "#170b05"); hg.addColorStop(1, "#5a361c");
  g.fillStyle = hg; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 6.2832); g.fill();
  g.strokeStyle = "rgba(255,180,110,0.35)"; g.lineWidth = 6; g.beginPath(); g.ellipse(x, y, rx, ry, 0, Math.PI * 0.95, Math.PI * 2.05); g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- la ninfa
// De lado, mirando a la derecha, centrada en (x, y), de largo L px. tono: 0 la de aquí (marrón dorado), 1 la de
// diecisiete años (más oscura, de ojos rojos). palida: 0 a 1, recién mudada (blanca). t: para que respire.
// pico: 0 a 1, cuánto ha clavado el pico hacia delante y abajo (en la raíz).
export function ninfa(g, x, y, L, ang = 0, t = 0, { tono = 0, palida = 0, pico = 0, ojos = null, al = 1 } = {}) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(L, L); g.globalAlpha *= al;
  const resp = 1 + Math.sin(t * 2.4) * 0.015;
  const base = mh(mh("#c78a4c", "#8e5226", tono), "#f3ead6", palida);
  const claro = mh(mh("#f6cc8a", "#d89a58", tono), "#ffffff", palida);
  const osc = mh(mh("#4a2610", "#2a1205", tono), "#c9b89a", palida);
  const lw = 0.011;
  const bola = (px, py, rx, ry, rot = 0) => {
    const gr = g.createRadialGradient(px - rx * 0.3, py - ry * 0.6, Math.min(rx, ry) * 0.05, px, py, Math.max(rx, ry) * 1.08);
    gr.addColorStop(0, claro); gr.addColorStop(0.5, base); gr.addColorStop(1, osc);
    g.fillStyle = gr; g.beginPath(); g.ellipse(px, py, rx, ry, rot, 0, 6.2832); g.fill();
  };
  const seg = (ax, ay, bx, by, w, conLuz = true) => {
    g.strokeStyle = osc; g.lineWidth = w; g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke();
    g.strokeStyle = base; g.lineWidth = w * 0.62; g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke();
    if (conLuz) { g.strokeStyle = claro; g.lineWidth = w * 0.22; g.beginPath(); g.moveTo(ax, ay - w * 0.18); g.lineTo(bx, by - w * 0.18); g.stroke(); }
  };
  g.lineCap = "round"; g.lineJoin = "round";
  // las patas de atrás y del medio, del lado de lejos (más oscuras)
  g.globalAlpha *= 0.75;
  seg(-0.04, 0.1, -0.16, 0.22, 0.03, false); seg(-0.16, 0.22, -0.3, 0.27, 0.025, false);
  seg(0.06, 0.12, 0.02, 0.24, 0.03, false); seg(0.02, 0.24, 0.1, 0.29, 0.025, false);
  g.globalAlpha /= 0.75;
  // el abdomen: corto y ancho, con sus anillos, que respira
  g.save(); g.translate(-0.2, 0.04); g.scale(1, resp);
  bola(0, 0, 0.3, 0.165, 0.06);
  g.save(); g.beginPath(); g.ellipse(0, 0, 0.3, 0.165, 0.06, 0, 6.2832); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.45; g.drawImage(k.manchas, -0.35, -0.2, 0.7, 0.4); g.globalAlpha /= 0.45; g.globalCompositeOperation = "source-over";
  for (let i = 0; i < 6; i++) {
    const sx = -0.24 + i * 0.075;
    g.strokeStyle = osc; g.lineWidth = lw * 1.5; g.beginPath(); g.moveTo(sx, -0.2); g.quadraticCurveTo(sx + 0.04, 0, sx, 0.2); g.stroke();
    g.strokeStyle = claro; g.globalAlpha *= 0.5; g.lineWidth = lw * 0.9; g.beginPath(); g.moveTo(sx + 0.014, -0.15); g.quadraticCurveTo(sx + 0.05, -0.03, sx + 0.03, 0.06); g.stroke(); g.globalAlpha /= 0.5;
  }
  g.restore();
  g.restore();
  // el tórax, grande y jorobado
  bola(0.1, -0.02, 0.22, 0.195, -0.12);
  g.strokeStyle = osc; g.lineWidth = lw; g.globalAlpha *= 0.6; g.beginPath(); g.moveTo(0.22, -0.17); g.quadraticCurveTo(0.17, -0.02, 0.24, 0.12); g.stroke(); g.globalAlpha /= 0.6;
  // los muñones de las alas: una funda oscura que baja por el costado
  g.beginPath(); g.moveTo(0.2, -0.13); g.quadraticCurveTo(0.06, -0.2, -0.1, -0.1); g.quadraticCurveTo(-0.24, -0.0, -0.22, 0.08); g.quadraticCurveTo(-0.08, 0.06, 0.04, 0.02); g.quadraticCurveTo(0.14, -0.02, 0.2, -0.13); g.closePath();
  const ag = g.createLinearGradient(0, -0.2, 0, 0.08); ag.addColorStop(0, claro); ag.addColorStop(0.35, base); ag.addColorStop(1, osc);
  g.fillStyle = ag; g.fill(); g.strokeStyle = osc; g.lineWidth = lw; g.stroke();
  g.strokeStyle = osc; g.globalAlpha *= 0.5; g.beginPath(); g.moveTo(0.14, -0.12); g.quadraticCurveTo(0.0, -0.1, -0.16, 0.04); g.stroke(); g.globalAlpha /= 0.5;
  // la cabeza: roma, con la cara abombada y rayada
  bola(0.3, 0.03, 0.115, 0.135, 0.15);
  g.save(); g.beginPath(); g.ellipse(0.35, 0.06, 0.07, 0.1, 0.25, 0, 6.2832); g.clip();
  bola(0.35, 0.06, 0.07, 0.1, 0.25);
  g.strokeStyle = osc; g.lineWidth = lw * 0.8;
  for (let i = 0; i < 6; i++) { const yy = -0.02 + i * 0.03; g.beginPath(); g.moveTo(0.29, yy); g.quadraticCurveTo(0.36, yy - 0.012, 0.43, yy + 0.01); g.stroke(); }
  g.restore();
  // las antenas
  g.strokeStyle = osc; g.lineWidth = 0.008; g.beginPath(); g.moveTo(0.36, -0.07); g.quadraticCurveTo(0.42, -0.12, 0.47, -0.11); g.stroke();
  // el ojo, arriba
  const ojo = ojos ?? (tono > 0.5 ? "225,35,30" : "240,228,205");
  const oc = ojo.split(",").map(Number);
  const og = g.createRadialGradient(0.305, -0.085, 0.003, 0.31, -0.075, 0.042);
  og.addColorStop(0, "#ffffff"); og.addColorStop(0.28, `rgb(${ojo})`); og.addColorStop(1, `rgb(${oc.map((c) => Math.round(c * 0.3)).join(",")})`);
  g.fillStyle = og; g.beginPath(); g.ellipse(0.31, -0.075, 0.042, 0.036, -0.3, 0, 6.2832); g.fill();
  // el pico (bajo la cara, hacia atrás; se clava hacia delante)
  const px = mez(0.24, 0.46, pico), py = mez(0.24, 0.26, pico);
  g.strokeStyle = osc; g.lineWidth = 0.024; g.beginPath(); g.moveTo(0.36, 0.15); g.quadraticCurveTo(mez(0.3, 0.42, pico), 0.22, px, py); g.stroke();
  // las patas de delante: el muslo hinchado, con dientes, y el gancho de cavar
  g.save(); g.translate(0.3, 0.19); g.rotate(0.55);
  bola(0, 0, 0.12, 0.05);
  g.fillStyle = osc;
  for (let i = 0; i < 4; i++) { const sx = -0.03 + i * 0.035; g.beginPath(); g.moveTo(sx - 0.012, 0.04); g.lineTo(sx, 0.08); g.lineTo(sx + 0.012, 0.04); g.fill(); }
  g.restore();
  seg(0.39, 0.25, 0.5, 0.2, 0.034);
  seg(0.5, 0.2, 0.55, 0.13, 0.022);
  g.fillStyle = osc;
  for (let i = 0; i < 3; i++) { const u = 0.2 + i * 0.3, sx = mez(0.39, 0.5, u), sy = mez(0.25, 0.2, u); g.beginPath(); g.moveTo(sx - 0.01, sy + 0.008); g.lineTo(sx + 0.004, sy + 0.045); g.lineTo(sx + 0.014, sy + 0.004); g.fill(); }
  // el brillo de la cutícula
  g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.6;
  g.fillStyle = "rgba(255,240,210,0.85)";
  g.beginPath(); g.ellipse(0.06, -0.165, 0.08, 0.02, -0.3, 0, 6.2832); g.fill();
  g.beginPath(); g.ellipse(-0.22, -0.085, 0.12, 0.018, 0.08, 0, 6.2832); g.fill();
  g.beginPath(); g.ellipse(0.27, -0.06, 0.03, 0.012, -0.6, 0, 6.2832); g.fill();
  g.restore();
}
// La piel vacía que deja al mudar: la misma forma, translúcida y rajada por la espalda.
export function piel(g, x, y, L, ang = 0, al = 1) {
  g.save(); g.globalAlpha *= al;
  ninfa(g, x, y, L, ang, 0, { palida: 0.35, al: 0.7, ojos: "200,170,120" });
  g.translate(x, y); g.rotate(ang); g.scale(L, L);
  g.strokeStyle = "rgba(30,15,5,0.85)"; g.lineWidth = 0.02; g.beginPath(); g.moveTo(0.3, -0.08); g.lineTo(0.15, -0.2); g.lineTo(-0.02, -0.17); g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- la cigarra adulta
// Vista desde arriba, con la cabeza hacia arriba (-y), centrada en (x, y), de largo L px (de la cabeza a la punta de
// las alas). tipo: 0 la de aquí (gris parda, alas con manchas); 1 la de diecisiete años (negra, ojos rojos, venas
// naranjas). canta: 0 a 1 (vibra). alas: 0 plegadas; 1 abiertas en vuelo (se ven borrosas).
export function cigarra(g, x, y, L, ang = 0, t = 0, { tipo = 0, canta = 0, alas = 0, al = 1 } = {}) {
  g.save(); g.translate(x, y); g.rotate(ang);
  const vib = canta * Math.sin(t * 90) * 0.004;
  g.scale(L * (1 + vib), L * (1 - vib)); g.globalAlpha *= al;
  const cuerpoC = tipo ? ["#4a4a52", "#16141a", "#050407"] : ["#c8b8a0", "#6e604e", "#2a2219"];
  const vena = tipo ? "rgba(255,130,30,0.95)" : "rgba(60,45,30,0.85)";
  const ojo = tipo ? "235,40,30" : "170,150,120";
  g.lineCap = "round"; g.lineJoin = "round";
  // las patas
  g.strokeStyle = cuerpoC[2]; g.lineWidth = 0.022;
  for (const s of [-1, 1]) for (const [ax, ay, bx, by, cx, cy] of [[0.07, -0.2, 0.17, -0.26, 0.2, -0.36], [0.08, -0.12, 0.2, -0.1, 0.26, -0.02], [0.07, -0.04, 0.18, 0.04, 0.22, 0.14]]) {
    g.beginPath(); g.moveTo(s * ax, ay); g.lineTo(s * bx, by); g.lineTo(s * cx, cy); g.stroke();
  }
  // el abdomen (se ve entre las alas)
  const bg = g.createLinearGradient(-0.12, 0, 0.12, 0); bg.addColorStop(0, cuerpoC[2]); bg.addColorStop(0.4, cuerpoC[0]); bg.addColorStop(1, cuerpoC[2]);
  g.fillStyle = bg; g.beginPath(); g.ellipse(0, 0.08, 0.12, 0.25, 0, 0, 6.2832); g.fill();
  // las alas
  for (const s of [-1, 1]) {
    g.save();
    const abre = alas * (0.7 + 0.3 * Math.sin(t * 70 + s));
    g.translate(s * 0.07, -0.16); g.rotate(s * (0.12 + abre * 1.1));
    g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(s * 0.2, 0.05, s * 0.2, 0.55, s * 0.04, 0.78); g.quadraticCurveTo(-s * 0.03, 0.74, -s * 0.03, 0.6); g.bezierCurveTo(-s * 0.03, 0.3, -s * 0.03, 0.1, 0, 0); g.closePath();
    g.globalAlpha *= alas > 0.1 ? 0.55 : 1;
    const wg = g.createLinearGradient(0, 0, s * 0.2, 0.6); wg.addColorStop(0, "rgba(255,255,255,0.35)"); wg.addColorStop(0.5, "rgba(200,225,255,0.14)"); wg.addColorStop(1, "rgba(255,255,255,0.3)");
    g.fillStyle = wg; g.fill(); g.strokeStyle = vena; g.lineWidth = 0.014; g.stroke();
    // las venas
    g.lineWidth = 0.009;
    for (const [a, b, c, d] of [[0.01, 0.05, 0.1, 0.62], [0.02, 0.1, 0.05, 0.7], [0.0, 0.08, -0.0, 0.62], [0.03, 0.2, 0.15, 0.45]]) { g.beginPath(); g.moveTo(s * a, b); g.quadraticCurveTo(s * (a + c) * 0.7, (b + d) / 2, s * c, d); g.stroke(); }
    g.beginPath(); g.moveTo(s * 0.06, 0.55); g.quadraticCurveTo(s * 0.1, 0.6, s * 0.12, 0.56); g.stroke();
    if (!tipo) { g.fillStyle = "rgba(40,30,20,0.75)"; for (const [a, b, r] of [[0.08, 0.5, 0.016], [0.1, 0.58, 0.014], [0.05, 0.62, 0.013], [0.12, 0.42, 0.012]]) { g.beginPath(); g.arc(s * a, b, r, 0, 6.2832); g.fill(); } }
    k.reflejo(g, s > 0 ? 0.04 : -0.08, 0.1, 0.03, 0.4, 0.22);
    g.restore();
  }
  // el tórax: dos piezas, con su dibujo
  const tg = g.createRadialGradient(-0.04, -0.27, 0.01, 0, -0.22, 0.2); tg.addColorStop(0, cuerpoC[0]); tg.addColorStop(0.55, cuerpoC[1]); tg.addColorStop(1, cuerpoC[2]);
  g.fillStyle = tg;
  g.beginPath(); g.moveTo(-0.16, -0.31); g.quadraticCurveTo(0, -0.36, 0.16, -0.31); g.quadraticCurveTo(0.18, -0.24, 0.12, -0.2); g.lineTo(-0.12, -0.2); g.quadraticCurveTo(-0.18, -0.24, -0.16, -0.31); g.fill();
  g.beginPath(); g.moveTo(-0.12, -0.21); g.lineTo(0.12, -0.21); g.quadraticCurveTo(0.11, -0.1, 0, -0.07); g.quadraticCurveTo(-0.11, -0.1, -0.12, -0.21); g.fill();
  g.strokeStyle = tipo ? "rgba(255,120,40,0.7)" : "rgba(40,30,20,0.6)"; g.lineWidth = 0.01;
  g.beginPath(); g.moveTo(-0.06, -0.19); g.lineTo(-0.03, -0.12); g.lineTo(0, -0.16); g.lineTo(0.03, -0.12); g.lineTo(0.06, -0.19); g.stroke();
  // la cabeza, ancha, con los ojos a los lados
  const hg = g.createLinearGradient(0, -0.4, 0, -0.32); hg.addColorStop(0, cuerpoC[0]); hg.addColorStop(1, cuerpoC[2]);
  g.fillStyle = hg; g.beginPath(); g.ellipse(0, -0.355, 0.15, 0.05, 0, 0, 6.2832); g.fill();
  for (const s of [-1, 1]) {
    const og = g.createRadialGradient(s * 0.165, -0.37, 0.004, s * 0.17, -0.355, 0.05);
    og.addColorStop(0, "#fff"); og.addColorStop(0.3, `rgb(${ojo})`); og.addColorStop(1, `rgb(${ojo.split(",").map((c) => Math.round(+c * 0.3)).join(",")})`);
    g.fillStyle = og; g.beginPath(); g.ellipse(s * 0.17, -0.355, 0.048, 0.042, 0, 0, 6.2832); g.fill();
  }
  // los tres ocelos, como joyitas
  g.fillStyle = tipo ? "rgba(255,90,60,0.9)" : "rgba(255,140,90,0.8)";
  for (const [a, b] of [[0, -0.375], [-0.02, -0.36], [0.02, -0.36]]) { g.beginPath(); g.arc(a, b, 0.007, 0, 6.2832); g.fill(); }
  // el brillo
  g.globalCompositeOperation = "screen";
  g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.ellipse(-0.05, -0.29, 0.05, 0.012, -0.1, 0, 6.2832); g.fill();
  g.restore();
}

// El canto: ondas que salen de la cigarra (anillos suaves de luz cálida, que se abren y se apagan).
export function canto(g, x, y, t, al = 1, R = 600) {
  if (al <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 4; i++) {
    const u = ((t * 1.6 + i / 4) % 1), r = 80 + u * R;
    g.strokeStyle = `rgba(255,236,170,${al * 0.24 * (1 - u)})`; g.lineWidth = 9 * (1 - u) + 2;
    g.beginPath(); g.arc(x, y, r, -Math.PI * 0.8, -Math.PI * 0.2); g.stroke();
    g.beginPath(); g.arc(x, y, r, Math.PI * 0.2, Math.PI * 0.8); g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- las marcas de la cuenta
// Rayas grabadas en la pared de tierra, de cinco en cinco (la quinta, cruzada). n: cuántas (puede ir a medias).
// brillo: cuánto relucen.
export function marcas(g, x, y, n, tam = 90, brillo = 0, color = "255,200,120") {
  g.save(); g.lineCap = "round";
  const total = Math.ceil(n);
  for (let i = 0; i < total; i++) {
    const u = Math.min(1, n - i), grupo = Math.floor(i / 5), j = i % 5;
    const gx = x + grupo * tam * 0.95, cruz = j === 4;
    const ax = cruz ? gx - tam * 0.08 : gx + j * tam * 0.16, ay = cruz ? y + tam * 0.15 : y - tam * 0.38;
    const bx = cruz ? gx + tam * 0.72 : ax + tam * 0.03, by = cruz ? y - tam * 0.15 : y + tam * 0.38;
    const ex = mez(ax, bx, u), ey = mez(ay, by, u);
    g.strokeStyle = "rgba(20,10,4,0.9)"; g.lineWidth = tam * 0.1; g.beginPath(); g.moveTo(ax, ay); g.lineTo(ex, ey); g.stroke();
    g.strokeStyle = `rgba(${color},${0.55 + 0.45 * brillo})`; g.lineWidth = tam * 0.05; g.beginPath(); g.moveTo(ax, ay); g.lineTo(ex, ey); g.stroke();
    if (brillo > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(${color},${0.35 * brillo})`; g.lineWidth = tam * 0.2; g.beginPath(); g.moveTo(ax, ay); g.lineTo(ex, ey); g.stroke(); g.restore(); }
  }
  g.restore();
}

// ---------------------------------------------------------------- terrones que saltan
// Un estallido de tierra en (x, y), u segundos después de que pase; hacia arriba (dir -1) o en todas direcciones.
const azT = azar(55);
const TERRONES = Array.from({ length: 90 }, () => ({ a: -Math.PI / 2 + (azT() - 0.5) * 2.6, v: 500 + azT() * 1700, r: 6 + Math.pow(azT(), 2) * 34, gi: (azT() - 0.5) * 8, c: azT() }));
export function terrones(g, x, y, u, esc = 1, sem = 0) {
  if (u < 0 || u > 1.6) return;
  for (let i = 0; i < TERRONES.length; i++) {
    const p = TERRONES[(i + sem * 7) % TERRONES.length];
    const px = x + Math.cos(p.a + sem) * p.v * u * esc, py = y + Math.sin(p.a) * p.v * u * esc + 1800 * u * u * esc;
    const r = p.r * esc;
    g.save(); g.translate(px, py); g.rotate(p.gi * u);
    const tg = g.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    tg.addColorStop(0, k.mezColor("#a8743f", "#7a4d26", p.c)); tg.addColorStop(1, "#2a160a");
    g.fillStyle = tg; g.globalAlpha *= Math.min(1, (0.95 - u) * 3);
    if (u > 0.95) { g.restore(); continue; }
    g.beginPath(); g.moveTo(-r, -r * 0.3); g.lineTo(-r * 0.2, -r); g.lineTo(r * 0.9, -r * 0.5); g.lineTo(r, r * 0.4); g.lineTo(0, r); g.lineTo(-r * 0.8, r * 0.6); g.closePath(); g.fill();
    g.restore();
  }
}

// ---------------------------------------------------------------- el mundo del árbol entero
// Dibuja con la cámara (Z, cx, cy) el árbol, el cielo, el suelo, las raíces y las cámaras de las ninfas. op: qué más
// (flor, verde). Las ninfas y la cigarra las pone cada plano encima.
export function mundoArbol(g, t, Z, cx, cy, { flor = 0, verde = 1, tono = 0, savia = null, huecos = true } = {}) {
  const [x0, y0, x1, y1] = ventana(Z, cx, cy);
  sinVista(g); g.fillStyle = "#1a0d06"; g.fillRect(0, 0, 1080, 1920);
  vista(g, Z, cx, cy);
  if (y0 < 0) {
    cielo(g, x0, y0, x1, y1, t, tono);
    // el sol, arriba a la izquierda
    k.brillo(g, -900, -2700, 2600, "255,235,170", 0.9);
    ramas(g);
    tronco(g, t);
    copa(g, t, verde, flor);
  }
  if (y1 > 0) {
    tierra(g, x0, y0, x1, y1, t);
    // la base del tronco y las raíces
    if (huecos) { hueco(g, NINFA_A[0] + 20, NINFA_A[1] + 10, LA * 0.68, LA * 0.42); hueco(g, NINFA_B[0] + 30, NINFA_B[1] + 10, LB * 0.68, LB * 0.42); }
    for (const R of RAICES) {
      const ys = R.puntos.map((p) => p[1]), xs = R.puntos.map((p) => p[0]);
      if (Math.max(...ys) + 60 < y0 || Math.min(...ys) - 60 > y1 || Math.max(...xs) + 60 < x0 || Math.min(...xs) - 60 > x1) continue;
      dibujaRaiz(g, R);
    }
    if (savia) savia(g);
    if (y0 < 120) {
      // el borde del suelo: la hierba y la sombra del tronco
      const bg = g.createLinearGradient(0, -10, 0, 60); bg.addColorStop(0, "#3e6a1c"); bg.addColorStop(1, "rgba(62,40,20,0)");
      g.fillStyle = bg; g.fillRect(x0, -10, x1 - x0, 70);
      tronco(g, t, -95, 95, -400, 40);
      hierba(g, x0, x1, t);
    }
  }
}
