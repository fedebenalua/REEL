// El primer sitio: la superficie de una neurona vista de cerca. Seis receptores (los huecos donde encaja la adenosina),
// la adenosina (gemas azules), la cafeína (pepitas naranjas que tapan el hueco), un depósito de adenosina, otro de
// cafeína y la cara de quien lo siente. Todo sale de t.
import * as k from "#kit";
import { v } from "#voz";
import { TAU, rs, lin, rad, disco, texto, rotulo, gema, pepita, tanque, cara, taza } from "./utiles.js";

const { tramo: tr, suave: su, entra, mez, redondo, claves } = k;
const F = (n) => v.frase(n);

export const SX = [0, 1, 2, 3, 4, 5].map((i) => 215 + 130 * i), SY = 1060;
const CARA = [540, 690, 118];

// ------------------------------------------------------------------ cuándo pasa cada cosa (cada hueco tiene su guion)
const KH = [-0.6, -0.25, 0.2, -0.4, 0.05, 0.45];                       // el hook: la adenosina ya se está pegando
const PL1 = [1.25, 1.42, 1.6, 1.78, 1.96, 2.14];                      // el hook: el café tapa cada hueco
export const REW = 6.95;                                  // «rebobinar»: todo vuelve atrás para empezar desde cero
const K3 = [0, 1, 2, 3, 4, 5].map((i) => 8.1 + i * 0.5);                           // «acumulando adenosina»
const PL5 = [0, 1, 2, 3, 4, 5].map((i) => F(5).t("tapa") + 0.05 + i * 0.2);  // el café tapa los huecos
const REL = { 1: 25.95, 3: 26.15, 5: 26.35 };  // se va la mitad de la cafeína
const EV = SX.map((_, i) => {
  const e = [{ t: KH[i], k: "key" }, { t: PL1[i], k: "plug" }, { t: REW + 0.04 * i, k: "none" }, { t: K3[i], k: "key" }, { t: PL5[i], k: "plug" }];
  if (i % 2) e.push({ t: REL[i], k: "none" }, { t: REL[i] + 0.45, k: "key" });
  return e;
});
function ocupa(i, t) {
  let a = null, b = null, n = null;
  for (const ev of EV[i]) { if (ev.t <= t) { b = a; a = ev; } else { n = ev; break; } }
  return { ev: a, prev: b, next: n };
}

// ------------------------------------------------------------------ cuánto hay de cada cosa
export const L = claves([[0, 0.4], [1.2, 0.5], [2.3, 0.58], [3.8, 0.65], [REW, 0.92], [REW + 0.55, 0], [8.0, 0], [11.1, 0.52], [13.5, 0.62], [15.3, 0.66], [18.6, 0.72], [20.6, 0.94], [22.5, 1.0], [31, 1.0]]);
export const Cf = claves([[0, 0], [1.25, 0], [2.3, 1.0], [REW, 1.0], [REW + 0.55, 0], [15.2, 0], [16.4, 1.0], [22.7, 1.0], [26.4, 0.5], [31, 0.5]]);
function presencia(i, t) {
  const { ev, prev } = ocupa(i, t);
  if (!ev) return 0;
  if (ev.k === "key") return su(tr(t - ev.t, -0.05, 0.25));
  if (ev.k === "plug" && prev && prev.k === "key") return 1 - su(tr(t - ev.t, 0, 0.3));
  return 0;
}
export const llave = (t) => SX.reduce((s, _, i) => s + presencia(i, t), 0) / SX.length;
export const sueno = (t) => Math.min(1, L(t) * llave(t) * 1.1);

// ------------------------------------------------------------------ la cámara
const nodos = [
  [0, 1.4, 540, 940], [0.7, 1.4, 540, 940], [3.3, 1.0, 540, 960],
  [9.5, 1.0, 540, 960], [10.05, 1.55, 475, 1000], [11.05, 1.55, 475, 1000], [11.8, 1.0, 540, 960],
  [14.7, 1.0, 540, 960], [15.2, 1.4, 540, 1020], [16.6, 1.4, 540, 1020], [17.4, 1.0, 540, 960],
  [25.4, 1.0, 540, 960], [25.95, 1.35, 540, 1030], [27.0, 1.35, 540, 1030], [27.6, 1.0, 540, 960], [31, 1.0, 540, 960],
];
const cz = claves(nodos.map((n) => [n[0], Math.log(n[1])])), cx = claves(nodos.map((n) => [n[0], n[2]])), cy = claves(nodos.map((n) => [n[0], n[3]]));
export const cam = (t) => ({ Z: Math.exp(cz(t)), cx: cx(t), cy: cy(t) });

// ------------------------------------------------------------------ el fondo
const BOK = Array.from({ length: 26 }, (_, i) => [rs(i, 1) * 1080, rs(i, 2) * 1200, 18 + rs(i, 3) * 60, rs(i, 4)]);
function fondo(g, t) {
  const noche = su(tr(t, 5.4, 5.95)) * (1 - su(tr(t, REW, REW + 0.5)));
  g.fillStyle = lin(g, 0, 0, 0, 1260, [[0, "#0d0f46"], [0.55, "#1b1470"], [1, "#35187e"]]); g.fillRect(-400, -600, 1900, 2000);
  g.save(); g.globalCompositeOperation = "lighter";
  for (const [x, y, r, a] of BOK) { const q = g.createRadialGradient(x, y + Math.sin(t * 0.4 + a * 9) * 14, 0, x, y, r); q.addColorStop(0, `rgba(120,150,255,${0.10 + 0.06 * a})`); q.addColorStop(1, "rgba(120,150,255,0)"); g.fillStyle = q; g.fillRect(x - r, y - r, r * 2, r * 2); }
  g.restore();
  if (noche > 0.01) {
    g.fillStyle = `rgba(2,3,20,${0.42 * noche})`; g.fillRect(-400, -600, 1900, 2000);
    g.save(); g.globalAlpha = noche;
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,255,255,${0.35 + 0.5 * rs(i, 8)})`; disco(g, rs(i, 6) * 1080, 520 + rs(i, 7) * 520, 1 + rs(i, 9) * 2); g.fill(); }
    k.brillo(g, 860, 640, 300, "200,215,255", 0.5);
    g.fillStyle = "#f6f1d2"; disco(g, 860, 640, 56); g.fill();
    g.fillStyle = "#1a1470"; disco(g, 886, 626, 50); g.fill();
    g.restore();
  }
}
function membrana(g, t) {
  g.fillStyle = lin(g, 0, 1255, 0, 1920, [[0, "#5d1a78"], [1, "#220a38"]]); g.fillRect(-400, 1255, 1900, 900);
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.12; g.drawImage(k.manchas, -200, 1255, 1500, 900); g.restore();
  for (let i = 0; i < 4; i++) { const x = 140 + i * 280 + Math.sin(t * 0.3 + i) * 10, y = 1480 + (i % 2) * 180; g.fillStyle = "rgba(255,120,190,0.12)"; g.beginPath(); g.ellipse(x, y, 110, 54, 0.3 * (i % 3 - 1), 0, TAU); g.fill(); }
  // la doble capa de la membrana
  for (const [yy, rgb] of [[1166, "255,150,215"], [1246, "255,120,190"]]) {
    for (let x = -380; x < 1500; x += 30) { g.fillStyle = `rgb(${rgb})`; disco(g, x + (yy > 1200 ? 15 : 0), yy, 14); g.fill(); g.fillStyle = "rgba(255,255,255,0.6)"; disco(g, x - 4 + (yy > 1200 ? 15 : 0), yy - 5, 4); g.fill(); }
  }
  g.strokeStyle = "rgba(255,190,235,0.3)"; g.lineWidth = 4; for (let x = -380; x < 1500; x += 30) { g.beginPath(); g.moveTo(x, 1180); g.lineTo(x, 1232); g.moveTo(x + 15, 1180); g.lineTo(x + 15, 1232); g.stroke(); }
}

// ------------------------------------------------------------------ los receptores
function receptor(g, x, glowRgb, glow, t, i) {
  const y0 = 1160;
  g.save();
  // cuerpo
  g.fillStyle = lin(g, x - 72, 0, x + 72, 0, [[0, "#3a2a9e"], [0.35, "#8a6bff"], [0.7, "#5a3fd0"], [1, "#2a1c78"]]);
  g.beginPath(); g.moveTo(x - 66, y0 + 6); g.bezierCurveTo(x - 50, y0 - 20, x - 30, y0 - 40, x - 30, y0 - 78);
  g.bezierCurveTo(x - 30, y0 - 100, x - 74, y0 - 104, x - 72, y0 - 136); g.lineTo(x + 72, y0 - 136);
  g.bezierCurveTo(x + 74, y0 - 104, x + 30, y0 - 100, x + 30, y0 - 78); g.bezierCurveTo(x + 30, y0 - 40, x + 50, y0 - 20, x + 66, y0 + 6); g.closePath(); g.fill();
  g.strokeStyle = "rgba(210,200,255,0.55)"; g.lineWidth = 4; g.stroke();
  // el hueco
  g.fillStyle = "#0a0830"; g.beginPath(); g.ellipse(x, SY - 40, 58, 22, 0, 0, TAU); g.fill();
  g.save(); g.beginPath(); g.moveTo(x - 56, SY - 44); for (let j = 0; j < 6; j++) { const a = j / 6 * TAU + 0.52; g.lineTo(x + Math.cos(a) * 40, SY + Math.sin(a) * 40 * 0.9); } g.closePath();
  g.fillStyle = "rgba(6,4,40,0.9)"; g.fill(); g.restore();
  g.restore();
  if (glow > 0.01) k.brillo(g, x, SY - 10, 190, glowRgb, 0.5 * glow);
}
function delante(g, x) { // el borde delantero del hueco, para que lo de dentro parezca estar dentro
  g.save(); g.strokeStyle = "rgba(220,210,255,0.85)"; g.lineWidth = 6; g.lineCap = "round";
  g.beginPath(); g.ellipse(x, SY - 40, 58, 22, 0, 0.1, Math.PI - 0.1); g.stroke(); g.restore();
}

// ------------------------------------------------------------------ el enjambre de adenosina que cae
const ENJ = k.claves([[0, 1.0], [1.3, 1.0], [2.6, 0.55], [3.8, 0.2], [REW - 0.2, 0.2], [REW + 0.2, 0], [8.0, 0], [8.2, 0.5], [11.2, 0.55], [13.5, 0.5], [15.0, 0.55], [18.6, 0.9], [22.5, 0.9], [26, 0.45], [31, 0.25]]);
function enjambre(g, t) {
  const DT = 0.06, VIDA = 1.5;
  for (let i = Math.floor((t - VIDA) / DT); i <= Math.floor(t / DT); i++) {
    const ti = i * DT + rs(i, 1) * DT, u = (t - ti) / VIDA;
    if (u < 0 || u > 1 || rs(i, 2) > ENJ(ti)) continue;
    const x = 130 + rs(i, 3) * 820, y = 560 + u * (460 + rs(i, 5) * 40), r = 11 + rs(i, 4) * 12, al = Math.min(1, u * 6) * (1 - Math.pow(u, 3));
    gema(g, x + Math.sin(u * 7 + i) * 14, y, r, u * 3 + i, al * 0.85, 0.7);
  }
}

// ------------------------------------------------------------------ todo junto
export function escena(g, t, op = {}) {
  const c = op.cam || cam(t);
  g.save(); g.translate(540, 960); g.scale(c.Z, c.Z); g.translate(-c.cx, -c.cy);
  fondo(g, t);
  membrana(g, t);
  enjambre(g, t);
  // receptores, con lo que tiene dentro
  SX.forEach((x, i) => {
    const { ev, prev, next } = ocupa(i, t), plug = ev && ev.k === "plug", key = ev && ev.k === "key";
    receptor(g, x, plug ? "255,150,50" : "90,170,255", plug ? 1 : key ? su(tr(t - ev.t, -0.05, 0.3)) : 0, t, i);
    // lo que va a caer en el hueco
    if (next && next.k !== "none" && t >= next.t - 0.5) {
      const u = (t - (next.t - 0.5)) / 0.5, e = entra(Math.min(1, u)), yy = SY - 30 - 640 * (1 - e);
      if (next.k === "key") gema(g, x, yy, 26, 1.2 * (1 - e), 1, 1); else { pepita(g, x, yy, 28, 1.6 * (1 - e), 1, 1); }
    }
    // lo que hay dentro
    if (key) gema(g, x, SY - 22 + Math.sin(t * 2 + i) * 1.2, 26, 0, 1, 0.8 + 0.2 * Math.sin(t * 3 + i));
    if (plug) {
      const u = t - ev.t;
      pepita(g, x, SY - 22, 28, 0, 1, 1);
      if (u < 0.5) { k.brillo(g, x, SY - 22, 260 * (1 - u / 0.5) + 80, "255,190,100", 0.7 * (1 - u / 0.5)); }
    }
    // una cafeína que se va (la mitad de las que había)
    if (ev && ev.k === "none" && prev && prev.k === "plug") {
      const u = t - ev.t;
      if (u < 0.7) { const e = k.sale(u / 0.7); pepita(g, x, SY - 22 - 260 * e, 28, e * 3, 1 - e, 1); }
    }
    delante(g, x);
    // la adenosina que espera encima del hueco tapado
    const aTapa = plug ? 1 : (ev && ev.k === "none" && prev && prev.k === "plug" && t - ev.t < 0.55) ? 1 - (t - ev.t) / 0.55 : 0;
    if (aTapa > 0.01) {
      const n = Math.max(1, Math.floor(L(t) * 6.2 + 0.5));
      for (let j = 0; j < 6; j++) {
        const pj = su(tr(L(t) * 6.4 - j, 0, 0.7)) * aTapa;
        if (pj < 0.01 && j > 0) continue;
        let yy = SY - 98 - j * 38 + Math.sin(t * 2.4 + i * 1.7 + j) * 3, xx = x + Math.sin(t * 1.7 + j * 2.1 + i) * 6;
        let rr = 19, al = j === 0 ? aTapa : pj;
        if (j === 0 && plug && ev.t > 1.0) { const u = su(tr(t - ev.t, 0, 0.5)); yy = mez(SY - 22, yy, u); xx = mez(x, xx, u); }
        gema(g, xx, yy, rr * (0.6 + 0.4 * (j === 0 ? 1 : pj)), t + j, al, 0.9);
      }
    }
  });
  // la cafeína que cae por el aire (taza vertiendo)
  tazaVertiendo(g, t);
  // depósitos
  const gl = 0.6 + 0.4 * Math.sin(t * 2);
  tanque(g, t, 36, 560, 100, 480, L(t), "90,175,255", "20,70,200", gl);
  tanque(g, t, 944, 560, 100, 480, Cf(t), "255,170,60", "170,60,10", Cf(t) > 0.02 ? gl : 0);
  // la cara
  const S = sueno(t), alerta = Math.max(0, Cf(t) * (1 - llave(t) * 1.4));
  const cu = su(tr(t, 0.45, 0.8)) * (1 - su(tr(t, 2.7, 3.1))) + su(tr(t, F(5).t("cafe") - 0.35, F(5).t("cafe") - 0.0)) * (1 - su(tr(t, 16.6, 17.0)));
  g.save(); g.globalAlpha = 1 - 0.9 * Math.min(1, cu);
  cara(g, t, CARA[0], CARA[1], CARA[2], S, alerta);
  g.restore();
  g.restore();
}

function tazaVertiendo(g, t) {
  const t1 = F(1).t("cafe"), t5 = F(5).t("cafe");
  for (const [a, b] of [[t1 - 0.3, 3.0], [t5 - 0.15, 16.9]]) {
    if (t < a || t > b) continue;
    const e = su(tr(t, a, a + 0.5)) * (1 - su(tr(t, b - 0.5, b)));
    const incl = -0.95 * su(tr(t, a + 0.35, a + 0.85)) * (1 - su(tr(t, b - 0.9, b - 0.4)));
    g.save(); g.globalAlpha = e; taza(g, t, 540 + 60 * (1 - e), 700 - 200 * (1 - e), 1.35, incl, 1 - su(tr(t, a + 0.3, a + 0.8))); g.restore();
  }
}
