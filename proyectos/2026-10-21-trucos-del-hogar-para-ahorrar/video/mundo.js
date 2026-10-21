// La casa abierta por la mitad (como una casa de muñecas), con sus seis habitaciones, el tejado, el cielo y los
// billetes que se escapan. Todos los planos dibujan esto mismo y solo cambian la cámara y lo que ponen encima.
import * as k from "#kit";
import { T, FIJO, W } from "./tiempos.js";
import { RW, RH, rs, dormitorio, salon, bano, lavadero, cocina, contador } from "./cuartos.js";

export { T, FIJO, W };
const { tramo: tr, suave: su, mez, redondo, claves } = k;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------ el plano de la casa
export const CELDA = { luz: [0, 0], calor: [RW, 0], ducha: [2 * RW, 0], lavadora: [2 * RW, RH], nevera: [RW, RH], contador: [0, RH] };
export const centro = (n) => [CELDA[n][0] + RW / 2, CELDA[n][1] + RH / 2 + 50 / 1.95 * 0 + 52];
export const COL = { luz: "255,205,90", calor: "255,110,80", ducha: "90,225,255", lavadora: "160,150,255", nevera: "150,255,190", contador: "255,150,60", ok: "140,255,170" };
const CUARTOS = [["luz", dormitorio], ["calor", salon], ["ducha", bano], ["lavadora", lavadero], ["nevera", cocina], ["contador", contador]];
const CASA = { x0: 0, x1: 3 * RW, y0: 0, y1: 2 * RH };

// ------------------------------------------------------------------ la cámara (un solo recorrido por la casa)
const ZR = 1.95, ZG = 0.64, ZC = 2.6;
const [lx, ly] = centro("luz"), [cx2, cy2] = centro("calor"), [dx, dy] = centro("ducha"), [wx, wy] = centro("lavadora"), [nx, ny] = centro("nevera");
const GX = 780, GY = 470;                           // el centro de la casa entera
const MX = 232, MY = RH + 190;                      // el contador de cerca
const f = T.f;
const nodos = [
  // [segundo, zoom, x, y]
  [0, ZC, MX, MY], [1.9, ZC, MX, MY], [3.7, ZG, GX, GY], [6.45, ZG, GX, GY],
  [f[3].t("bombillas") - 0.05, ZR, lx, ly], [f[3].fin - 0.15, ZR, lx, ly],
  [f[4].t("termostato") - 0.05, ZR, cx2, cy2], [f[4].fin - 0.1, ZR, cx2, cy2],
  [f[5].t("ducha") - 0.05, ZR, dx, dy], [f[5].fin - 0.05, ZR, dx, dy],
  [f[6].t("lavadora") - 0.05, ZR, wx, wy], [f[6].fin - 0.05, ZR, wx, wy],
  [f[7].t("nevera") - 0.05, ZR, nx, ny], [f[7].fin - 0.05, ZR, nx, ny],
  [f[8].t("pasar") + 0.9, ZG, GX, GY], [f[9].inicio + 0.1, ZG, GX, GY], [f[9].t("factura") + 0.2, ZC, MX, MY],
];
const cz = claves(nodos.map((n) => [n[0], Math.log(n[1])])), cxk = claves(nodos.map((n) => [n[0], n[2]])), cyk = claves(nodos.map((n) => [n[0], n[3]]));
export const cam = (t) => ({ Z: Math.exp(cz(t)), cx: cxk(t), cy: cyk(t) });
export const aPantalla = (c, x, y) => [540 + (x - c.cx) * c.Z, 960 + (y - c.cy) * c.Z];

// ------------------------------------------------------------------ los billetes que se escapan
let _bsp = null;
const bspF = () => _bsp || (_bsp = (() => {
  const l = k.lienzo(128, 70), c = l.getContext("2d");
  c.fillStyle = "#1c6b3a"; redondo(c, 2, 2, 124, 66, 9); c.fill();
  const gr = c.createLinearGradient(0, 0, 0, 70); gr.addColorStop(0, "#9ff0a8"); gr.addColorStop(1, "#43b36a"); c.fillStyle = gr; redondo(c, 6, 6, 116, 58, 7); c.fill();
  c.strokeStyle = "rgba(10,80,40,0.55)"; c.lineWidth = 3; redondo(c, 13, 13, 102, 44, 5); c.stroke();
  c.fillStyle = "#e9ffe9"; c.beginPath(); c.arc(64, 35, 20, 0, TAU); c.fill(); c.strokeStyle = "#1f8a4c"; c.lineWidth = 3; c.stroke();
  c.fillStyle = "#1f8a4c"; c.font = "800 26px Figtree"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("€", 64, 37);
  c.fillStyle = "rgba(255,255,255,0.7)"; c.font = "700 14px Figtree"; c.fillText("20", 24, 22); c.fillText("20", 104, 50);
  return l;
})());
const FUENTES = [
  { n: "luz", x: 0, y: 0, ox: 262, oy: 200, w: (t) => 1 - FIJO.luz(t), r: 0.5 },
  { n: "calor", x: RW, y: 0, ox: 150, oy: 330, w: (t) => 1 - FIJO.calor(t) * 0.7, r: 0.5 },
  { n: "ducha", x: 2 * RW, y: 0, ox: 150, oy: 300, w: (t) => 1 - FIJO.ducha(t), r: 0.5 },
  { n: "lavadora", x: 2 * RW, y: RH, ox: 260, oy: 300, w: (t) => 1 - FIJO.lavadora(t), r: 0.5 },
  { n: "nevera", x: RW, y: RH, ox: 290, oy: 420, w: (t) => 1 - FIJO.nevera(t), r: 0.55 },
  { n: "contador", x: 0, y: RH, ox: 232, oy: 250, w: (t) => (W(t) - 0.1) / 0.9, r: 1.1, dt: 0.09, gran: (t) => 1 + 0.9 * (1 - su(tr(t, 1.6, 3.4))), mas: (t) => 1 + 3 * (1 - su(tr(t, 1.4, 3.4))) },
];
function billetes(g, t, fuentes = FUENTES) {
  const VIDA = 2.6;
  fuentes.forEach((s, si) => {
    const DT = s.dt || 0.3;
    for (let i = Math.floor((t - VIDA) / DT); i <= Math.floor(t / DT); i++) {
      const ti = i * DT + rs(i, si) * DT * 0.8, u = (t - ti) / VIDA;
      if (u < 0 || u > 1) continue;
      if (rs(i, si + 40) > s.w(ti) * s.r * (s.mas ? s.mas(ti) : 1) * (DT / 0.3)) continue;
      const x = s.x + s.ox + (rs(i, si + 7) - 0.5) * 90 + Math.sin(u * 5 + i) * 34 * u + (rs(i, si + 9) - 0.5) * 120 * u, y = s.y + s.oy - 210 * k.entra(u) - 20 * u;
      const al = Math.min(1, u * 8) * (1 - Math.pow(u, 3)), sc = (0.36 + 0.2 * rs(i, si + 5)) * (s.gran ? s.gran(ti) : 1), ang = Math.sin(u * 7 + i) * 0.7 + (rs(i, si + 2) - 0.5);
      g.save(); g.globalAlpha = al; g.translate(x, y); g.rotate(ang); g.scale(sc * (0.9 + 0.1 * Math.cos(u * 9 + i)), sc);
      g.drawImage(bspF(), -64, -35); g.restore();
    }
  });
}

// ------------------------------------------------------------------ el cielo, el suelo y el aura de la casa
const ESTR = Array.from({ length: 90 }, (_, i) => [rs(i, 1) * 1080, rs(i, 2) * 1500, 0.6 + rs(i, 3) * 1.8, rs(i, 4)]);
export function cielo(g, t) {
  const w = (W(t) - 0.1) / 0.9;
  const q = g.createLinearGradient(0, 0, 0, 1920); q.addColorStop(0, "#080c2c"); q.addColorStop(0.55, "#2a1858"); q.addColorStop(1, mezCol(w)); g.fillStyle = q;
  g.fillRect(0, 0, 1080, 1920);
  for (const [x, y, r, a] of ESTR) { g.fillStyle = `rgba(255,255,255,${0.25 + 0.5 * a * (0.7 + 0.3 * Math.sin(t * 0.8 + a * 9))})`; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
}
const mezCol = (w) => k.mezColor("#1d6b73", "#7a2a4e", w);

function estructura(g, t, c) {
  const { x0, x1, y0, y1 } = CASA, w = (W(t) - 0.1) / 0.9;
  // suelo
  const gq = g.createLinearGradient(0, y1, 0, y1 + 900); gq.addColorStop(0, "#1f8556"); gq.addColorStop(0.5, "#0f3d33"); gq.addColorStop(1, "#070b1c"); g.fillStyle = gq; g.fillRect(-1200, y1, 5400, 900);
  g.fillStyle = "#14472f"; g.fillRect(-1200, y1, 5400, 10);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.red, -1200, y1, 5400, 900); g.restore();
  for (const [bx, sc] of [[-170, 1.1], [1730, 1.25], [-300, 0.8], [1880, 0.9]]) { g.fillStyle = "#17704a"; g.beginPath(); g.ellipse(bx, y1 + 6, 100 * sc, 74 * sc, 0, Math.PI, TAU); g.fill(); g.fillStyle = "#2da36a"; g.beginPath(); g.ellipse(bx - 18 * sc, y1 - 12 * sc, 62 * sc, 44 * sc, 0, Math.PI, TAU); g.fill(); }
  // sombra de la casa
  g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse((x0 + x1) / 2, y1 + 16, 880, 36, 0, 0, TAU); g.fill();
  // marco
  g.fillStyle = "#2b1e44"; redondo(g, x0 - 26, y0 - 6, x1 - x0 + 52, y1 - y0 + 34, 6); g.fill();
}

function marcos(g) {
  const { x0, x1, y0, y1 } = CASA;
  g.fillStyle = "#33265a";
  for (const x of [x0, RW, 2 * RW, x1]) g.fillRect(x - 8, y0, 16, y1 - y0);
  g.fillRect(x0 - 26, y1 - 8, x1 - x0 + 52, 34);
  g.fillRect(x0 - 8, RH - 12, x1 - x0 + 16, 24);
  g.fillRect(x0 - 8, y0 - 8, x1 - x0 + 16, 16);
  g.fillStyle = "rgba(255,255,255,0.12)"; for (const x of [x0, RW, 2 * RW, x1]) g.fillRect(x - 8, y0, 3, y1 - y0); g.fillRect(x0 - 8, RH - 12, x1 - x0 + 16, 3);
  g.fillStyle = "#47397a"; g.fillRect(x0 - 26, y1 + 10, x1 - x0 + 52, 14);
}

function tejado(g, t) {
  const w = (W(t) - 0.1) / 0.9;
  const ap = [780, -300];
  // chimenea
  g.fillStyle = lin3(g, 1160, 1260, [["#b04a3a", 0], ["#8a3226", 1]]); g.fillRect(1160, -250, 90, 150);
  g.fillStyle = "rgba(0,0,0,0.25)"; for (let r = 0; r < 6; r++) { g.fillRect(1160, -245 + r * 25, 90, 3); }
  g.fillStyle = "#5a1f1a"; g.fillRect(1150, -262, 110, 20);
  // tejado
  const q = g.createLinearGradient(0, -300, 0, 6); q.addColorStop(0, "#d4553a"); q.addColorStop(1, "#7d2528");
  g.fillStyle = q; g.beginPath(); g.moveTo(-90, 10); g.lineTo(ap[0], ap[1]); g.lineTo(1650, 10); g.closePath(); g.fill();
  g.save(); g.beginPath(); g.moveTo(-90, 10); g.lineTo(ap[0], ap[1]); g.lineTo(1650, 10); g.closePath(); g.clip();
  g.strokeStyle = "rgba(60,10,20,0.4)"; g.lineWidth = 4;
  for (let r = 0; r < 11; r++) { const y = -290 + r * 29; for (let x = -100 + (r % 2) * 30; x < 1680; x += 60) { g.beginPath(); g.arc(x, y, 30, 0, Math.PI); g.stroke(); } }
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3; g.drawImage(k.red, -100, -300, 1800, 320);
  g.restore();
  g.strokeStyle = "#ffb199"; g.lineWidth = 8; g.lineCap = "round"; g.beginPath(); g.moveTo(-90, 10); g.lineTo(ap[0], ap[1]); g.lineTo(1650, 10); g.stroke();
  g.fillStyle = "#3a1d2a"; g.fillRect(-100, 6, 1760, 14);
  // ventana redonda del desván
  g.fillStyle = "#f3ecff"; g.beginPath(); g.arc(780, -112, 54, 0, TAU); g.fill();
  g.fillStyle = k.mezColor("#ffb347", "#8affc4", 1 - w); g.beginPath(); g.arc(780, -112, 44, 0, TAU); g.fill();
  g.strokeStyle = "#f3ecff"; g.lineWidth = 6; g.beginPath(); g.moveTo(736, -112); g.lineTo(824, -112); g.moveTo(780, -156); g.lineTo(780, -68); g.stroke();
  k.brillo(g, 780, -112, 260, k.mezRgb("255,180,80", "140,255,190", 1 - w), 0.6);
}
const lin3 = (g, a, b, st) => { const q = g.createLinearGradient(a, 0, b, 0); st.forEach(([c, o]) => q.addColorStop(o, c)); return q; };

function aura(g, t) {
  const w = (W(t) - 0.1) / 0.9, col = k.mezRgb("140,255,190", "255,90,50", w);
  g.save(); g.globalCompositeOperation = "lighter";
  const r = 1400, q = g.createRadialGradient(780, 520, 200, 780, 520, r);
  q.addColorStop(0, `rgba(${col},${0.12 + 0.34 * w})`); q.addColorStop(0.5, `rgba(${col},${0.05 + 0.13 * w})`); q.addColorStop(1, `rgba(${col},0)`);
  g.fillStyle = q; g.fillRect(-900, -900, 3300, 3300);
  g.restore();
}

// Chispas que salen por el tejado cuando la casa está al rojo.
function chispas(g, t) {
  const w = (W(t) - 0.1) / 0.9;
  if (w < 0.03) return;
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 46; i++) {
    const u = (((t * 0.33 + rs(i, 1)) % 1) + 1) % 1, x = 340 + rs(i, 2) * 880 + Math.sin(t + i) * 30 * u, y = 10 - u * (260 + rs(i, 3) * 420);
    if (rs(i, 5) > w) continue;
    const a = Math.sin(Math.PI * u) * 0.9;
    k.brillo(g, x, y, 30 + 26 * rs(i, 4), "255,150,70", a);
  }
  g.restore();
}

// Cuando la cámara está dentro de una habitación, lo de alrededor se oscurece (así se ve de qué habitación se habla).
function foco(g, c) {
  const f = su(tr(c.Z, 1.0, 1.7));
  if (f < 0.01) return;
  g.save(); g.fillStyle = `rgba(5,3,18,${0.78 * f})`;
  g.beginPath(); g.rect(-1500, -1200, 6000, 4400);
  for (const n in CELDA) g.rect(CELDA[n][0], CELDA[n][1], RW, RH);
  g.fill("evenodd");
  for (const n in CELDA) {
    const [x, y] = CELDA[n], d = Math.hypot(x + RW / 2 - c.cx, y + RH / 2 + 52 - c.cy), kk = 1 - su(tr(d, 80, 620));
    g.fillStyle = `rgba(5,3,18,${0.78 * f * (1 - kk)})`; g.fillRect(x, y, RW, RH);
  }
  g.restore();
}

// ------------------------------------------------------------------ la escena entera
// op.cam: una cámara distinta de la normal (las aperturas); op.billetes: false para no dibujar los billetes.
export function escena(g, t, op = {}) {
  const c = op.cam || cam(t);
  cielo(g, t);
  g.save(); g.translate(540, 960); g.scale(c.Z, c.Z); g.translate(-c.cx, -c.cy);
  aura(g, t);
  estructura(g, t, c);
  const vx0 = c.cx - 540 / c.Z - 20, vx1 = c.cx + 540 / c.Z + 20, vy0 = c.cy - 960 / c.Z - 20, vy1 = c.cy + 960 / c.Z + 20;
  for (const [n, fn] of CUARTOS) {
    const [x, y] = CELDA[n];
    if (x + RW < vx0 || x > vx1 || y + RH < vy0 || y > vy1) continue;
    g.save(); g.translate(x, y); g.beginPath(); g.rect(0, 0, RW, RH); g.clip();
    fn(g, t);
    g.restore();
  }
  marcos(g);
  tejado(g, t);
  foco(g, c);
  chispas(g, t);
  if (op.billetes !== false) billetes(g, t);
  g.restore();
}

// Un aro de luz que late sobre una cosa de la casa (para marcar las cinco cosas del hook).
export function aro(g, c, nombre, ox, oy, u, tam = 360, color = COL[nombre]) {
  if (u < 0 || u > 1.4) return;
  const [x, y] = [CELDA[nombre][0] + ox, CELDA[nombre][1] + oy], [px, py] = aPantalla(c, x, y), e = k.entra(Math.min(1, u));
  g.save(); g.globalCompositeOperation = "lighter";
  const a = Math.max(0, 1 - u / 1.4);
  g.strokeStyle = `rgba(${color},${0.95 * a})`; g.lineWidth = 12 * a + 2; g.beginPath(); g.arc(px, py, (40 + tam * e) * c.Z * 0.9, 0, TAU); g.stroke();
  g.restore();
  k.brillo(g, px, py, 320 * c.Z * (0.6 + 0.6 * e), color, 0.8 * a);
}
export { billetes };
