// El segundo sitio: la noche. Un reloj con el último café a las 17:00 y la luna a las 23:00, la barra de sueño
// con la hora que se pierde sin notarlo, y al final la taza que se toma después de cenar.
import * as k from "#kit";
import { v } from "#voz";
import { TAU, rs, lin, rad, disco, texto, rotulo, cara, taza } from "./utiles.js";

const { tramo: tr, suave: su, entra, mez, redondo } = k;
const F = (n) => v.frase(n);
const ang = (h) => (h / 12) * TAU - Math.PI / 2;

// ------------------------------------------------------------------ momentos de la voz
export const M = {
  chico: () => F(9).inicio, dosis: () => F(9).t("dosis"), seis: () => F(9).t("seis"), acostarte: () => F(9).t("acostarte"),
  quita: () => F(9).t("quita"), hora: () => F(9).t("hora"), sueno: () => F(9).t("sueno"), notas: () => F(9).t("ni"),
  f10: () => F(10).inicio, ultimo: () => F(10).t("ultimo"), seis2: () => F(10).t("seis"), dormir: () => F(10).t("dormir"),
  f11: () => F(11).inicio, enviaselo: () => F(11).t("enviaselo"), cenar: () => F(11).t("cenar"),
};

function cielo(g, t) {
  g.fillStyle = lin(g, 0, 0, 0, 1920, [[0, "#070a2e"], [0.6, "#150f5a"], [1, "#27146e"]]); g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 18; i++) { const x = rs(i, 1) * 1080, y = 500 + rs(i, 2) * 1000, r = 40 + rs(i, 3) * 90; const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, "rgba(110,130,255,0.10)"); q.addColorStop(1, "rgba(110,130,255,0)"); g.fillStyle = q; g.fillRect(x - r, y - r, r * 2, r * 2); }
  g.restore();
  for (let i = 0; i < 70; i++) { const tw = 0.45 + 0.5 * Math.sin(t * (0.8 + rs(i, 5)) + i * 3); g.fillStyle = `rgba(255,255,255,${tw * (0.35 + 0.5 * rs(i, 6))})`; disco(g, rs(i, 7) * 1080, 520 + rs(i, 8) * 980, 1 + rs(i, 9) * 2.2); g.fill(); }
}

function luna(g, x, y, r, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al; k.brillo(g, x, y, r * 5, "200,215,255", 0.6);
  g.fillStyle = "#f6f1d2"; disco(g, x, y, r); g.fill();
  g.fillStyle = "#e1dbb4"; disco(g, x - r * 0.3, y + r * 0.2, r * 0.18); g.fill(); disco(g, x + r * 0.25, y - r * 0.3, r * 0.12); g.fill();
  g.fillStyle = "#1b1470"; disco(g, x + r * 0.5, y - r * 0.18, r * 0.9); g.fill();
  g.restore();
}

// ------------------------------------------------------------------ el reloj
function reloj(g, t, cx, cy, R, o) {
  g.save();
  g.fillStyle = "rgba(0,0,0,0.35)"; disco(g, cx + 6, cy + 14, R); g.fill();
  g.fillStyle = lin(g, cx - R, cy - R, cx + R, cy + R, [[0, "#232b78"], [1, "#0f1448"]]); disco(g, cx, cy, R); g.fill();
  g.strokeStyle = "#cfd6ff"; g.lineWidth = R * 0.05; g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.22)"; g.lineWidth = 3; disco(g, cx, cy, R * 0.9); g.stroke();
  for (let h = 1; h <= 12; h++) {
    const a = ang(h); g.strokeStyle = "rgba(220,228,255,0.6)"; g.lineWidth = R * 0.02; g.beginPath();
    g.moveTo(cx + Math.cos(a) * R * 0.86, cy + Math.sin(a) * R * 0.86); g.lineTo(cx + Math.cos(a) * R * 0.78, cy + Math.sin(a) * R * 0.78); g.stroke();
    texto(g, String(h), cx + Math.cos(a) * R * 0.68, cy + Math.sin(a) * R * 0.68, R * 0.15, "rgba(230,236,255,0.8)", 700);
  }
  // el arco de las seis horas, del 5 al 11
  if (o.arc > 0.001) {
    g.lineCap = "round"; g.lineWidth = R * 0.1; g.strokeStyle = lin(g, cx - R, cy + R, cx + R, cy - R, [[0, "#ff9a3a"], [1, "#ff5a5a"]]);
    g.beginPath(); g.arc(cx, cy, R * 0.47, ang(5), ang(5) + Math.PI * o.arc); g.stroke();
    texto(g, "6 h", cx, cy + R * 0.02, R * 0.3, "#ffd9a8", 900);
  }
  // la aguja de la hora
  const hr = 5 + 6 * o.arc, a = ang(hr);
  g.strokeStyle = "#fff"; g.lineWidth = R * 0.045; g.lineCap = "round"; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * R * 0.3, cy + Math.sin(a) * R * 0.3); g.stroke();
  g.fillStyle = "#fff"; disco(g, cx, cy, R * 0.045); g.fill();
  g.restore();
  // iconos fuera del reloj
  const rr = R * 1.2;
  if (o.cup > 0.01) {
    const e = entra(o.cup), x = cx + Math.cos(ang(5)) * rr, y = cy + Math.sin(ang(5)) * rr - 340 * (1 - e) * R / 200;
    g.save(); g.globalAlpha = Math.min(1, o.cup * 2);
    taza(g, t, x, y, R * 0.0026 * (1 + 0.18 * o.pulso), 0, 0.8);
    g.restore();
  }
  if (o.moon > 0.01) { const x = cx + Math.cos(ang(11)) * rr, y = cy + Math.sin(ang(11)) * rr; luna(g, x, y, R * 0.2 * (0.6 + 0.4 * entra(o.moon)), o.moon); }
}

// ------------------------------------------------------------------ la barra de sueño
function barra(g, t, y, al) {
  if (al <= 0.01) return;
  const t0 = M.chico() + 3.5, W = 100, G = 8, x0 = (1080 - (8 * W + 7 * G)) / 2;
  g.save(); g.globalAlpha *= al;
  for (let i = 0; i < 8; i++) {
    const u = su(tr(t, t0 + i * 0.05, t0 + 0.35 + i * 0.05)), x = x0 + i * (W + G);
    let yy = y, rot = 0, dim = 0, rx = x;
    if (i === 7) {
      const b = su(tr(t, M.quita(), M.hora())), sh = Math.sin(t * 60) * 5 * tr(t, M.quita() - 0.1, M.quita() + 0.3) * (1 - b);
      yy = y + 150 * entra(b); rot = 0.25 * b; rx = x + sh + 30 * b; dim = b;
    }
    const pul = i < 7 ? 0.5 + 0.5 * Math.sin(t * 3 + i * 0.6) : 0;
    g.save(); g.translate(rx + W / 2, yy); g.rotate(rot); g.scale(u, u);
    redondo(g, -W / 2, -62, W, 124, 26);
    g.fillStyle = dim > 0.5 ? mezRgb("#4a82e8", "#e84a5a", (dim - 0.5) * 2) : "#4a82e8"; g.fill();
    g.fillStyle = "rgba(255,255,255,0.25)"; redondo(g, -W / 2 + 8, -54, W - 16, 22, 11); g.fill();
    if (i < 7 && pul > 0.97) { g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 4; redondo(g, -W / 2, -62, W, 124, 26); g.stroke(); }
    g.restore();
  }
  g.restore();
  const pm = su(tr(t, M.hora() - 0.05, M.hora() + 0.25));
  rotulo(g, 540, y + 195, "−1 hora", "255,110,110", pm, 44);
}
function mezRgb(a, b, u) {
  const h = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const A = h(a), B = h(b); return `rgb(${A.map((x, i) => Math.round(mez(x, B[i], u))).join(",")})`;
}

// ------------------------------------------------------------------ el final: la taza después de cenar
function cena(g, t, al) {
  if (al <= 0.01) return;
  const u0 = M.f11(), e = entra(tr(t, u0, u0 + 0.5));
  g.save(); g.globalAlpha *= al;
  luna(g, 830, 640, 62, e);
  // mesa
  g.fillStyle = lin(g, 0, 1010, 0, 1100, [[0, "#6b3d21"], [1, "#3b200f"]]); g.fillRect(0, 1010, 1080, 120);
  g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(0, 1010, 1080, 6);
  // plato con tenedor
  const p = entra(tr(t, M.cenar() - 0.55, M.cenar() - 0.15));
  if (p > 0.01) {
    g.save(); g.globalAlpha *= p; g.translate(200, 1000 - 60 * (1 - p));
    g.fillStyle = "rgba(0,0,0,0.3)"; g.beginPath(); g.ellipse(6, 14, 120, 24, 0, 0, TAU); g.fill();
    g.fillStyle = "#f4f6fb"; g.beginPath(); g.ellipse(0, 0, 120, 26, 0, 0, TAU); g.fill();
    g.fillStyle = "#dde3f0"; g.beginPath(); g.ellipse(0, -2, 82, 15, 0, 0, TAU); g.fill();
    g.strokeStyle = "#dde3f0"; g.lineWidth = 9; g.lineCap = "round"; g.beginPath(); g.moveTo(150, -2); g.lineTo(150, -120); g.stroke();
    g.beginPath(); g.moveTo(138, -120); g.lineTo(138, -80); g.moveTo(162, -120); g.lineTo(162, -80); g.stroke();
    g.restore();
  }
  taza(g, t, 560, 905 + 60 * (1 - e) * -1 + (1 - e) * 80, 1.55, 0, e);
  g.restore();
}

function avion(g, t) {
  const u = tr(t, M.enviaselo() + 1.9, v.duracion - 0.05);
  if (u <= 0 || u >= 1) return;
  const e = su(u), P = (s) => [560 + 640 * s, 720 - 330 * s - 150 * Math.sin(Math.PI * s * 0.9)];
  const [x, y] = P(e), [x2, y2] = P(Math.min(1, e + 0.02)), a = Math.atan2(y2 - y, x2 - x);
  g.save(); g.lineCap = "round";
  for (let i = 1; i <= 16; i++) { const s = Math.max(0, e - i * 0.018), [tx, ty] = P(s); g.fillStyle = `rgba(255,255,255,${0.7 * (1 - i / 16)})`; g.beginPath(); g.arc(tx, ty, 6 - i * 0.25, 0, TAU); g.fill(); }
  g.translate(x, y); g.rotate(a); g.scale(2.0, 2.0);
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 14; g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(62, 0); g.lineTo(-48, -34); g.lineTo(-22, 0); g.closePath(); g.fill(); g.shadowBlur = 0;
  g.fillStyle = "#cfe3ff"; g.beginPath(); g.moveTo(62, 0); g.lineTo(-48, 30); g.lineTo(-22, 0); g.closePath(); g.fill();
  g.fillStyle = "#9db9ee"; g.beginPath(); g.moveTo(-22, 0); g.lineTo(-48, 30); g.lineTo(-34, 6); g.closePath(); g.fill();
  g.restore();
}

// ------------------------------------------------------------------ todo junto
export function escena(g, t) {
  cielo(g, t);
  const t9 = M.chico(), f10 = M.f10(), f11 = M.f11();
  const peq = su(tr(t, M.quita() - 0.2, M.quita() + 0.4)) * (1 - su(tr(t, f10 - 0.15, f10 + 0.45)));
  const R = mez(205, 138, peq), cy = mez(790, 690, peq), cx = 540;
  const fuera = 1 - su(tr(t, f11 - 0.1, f11 + 0.4));
  const entrada = entra(tr(t, t9, t9 + 0.45));
  const fase2 = t >= f10;
  const arc = fase2 ? su(tr(t, M.seis2(), M.seis2() + 0.85)) : su(tr(t, M.seis(), M.seis() + 0.95));
  const moon = fase2 ? su(tr(t, M.dormir() - 0.05, M.dormir() + 0.4)) : su(tr(t, M.acostarte(), M.acostarte() + 0.4));
  const cupT = t < f10 ? tr(t, t9 + 0.15, t9 + 0.65) : 1;
  const pulso = Math.max(Math.exp(-(t - M.ultimo()) * 5) * (t > M.ultimo() ? 1 : 0), Math.exp(-(t - M.dosis()) * 5) * (t > M.dosis() ? 1 : 0));
  if (fuera > 0.01) {
    g.save(); g.globalAlpha = fuera; g.translate(cx, cy); g.scale(entrada, entrada); g.translate(-cx, -cy);
    reloj(g, t, cx, cy, R, { arc, cup: cupT, moon, pulso });
    // etiquetas del reloj
    const rr = R * 1.2, cxp = cx + Math.cos(ang(5)) * rr, cyp = cy + Math.sin(ang(5)) * rr;
    rotulo(g, cxp, cyp + R * 0.55, "dosis alta", "255,170,60", su(tr(t, M.dosis() - 0.05, M.dosis() + 0.25)) * (t < f10 ? 1 : 0) * (1 - peq), 34);
    rotulo(g, cxp + 10, cyp + R * 0.55, "17:00", "255,170,60", su(tr(t, M.ultimo(), M.ultimo() + 0.3)) * (1 - su(tr(t, f11 - 0.1, f11 + 0.3))), 38);
    const mxp = cx + Math.cos(ang(11)) * rr, myp = cy + Math.sin(ang(11)) * rr;
    rotulo(g, mxp + 12, myp - R * 0.55, "23:00", "190,205,255", moon * (1 - peq), 38);
    g.restore();
  }
  barra(g, t, 1010, su(tr(t, t9 + 3.4, t9 + 3.7)) * (1 - su(tr(t, f10 - 0.1, f10 + 0.3))));
  const fa = su(tr(t, M.notas() - 0.3, M.notas() + 0.1)) * (1 - su(tr(t, f10 - 0.1, f10 + 0.3)));
  if (fa > 0.01) { g.save(); g.globalAlpha = fa; const s = entra(tr(t, M.notas() - 0.3, M.notas() + 0.2)); g.translate(540, 1290); g.scale(s, s); cara(g, t, 0, 0, 92, 0, 0); g.restore(); rotulo(g, 540, 1415, "ni lo notas", "190,205,255", fa, 36); }
  cena(g, t, 1 - fuera);
  avion(g, t);
}
