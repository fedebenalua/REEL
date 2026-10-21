// «Cuatro: usa la olla a presión. Mantener el agua hirviendo le cuesta casi seis veces menos que a una olla abierta.»
// Otro sitio: la cocina, el fuego y la olla. Corte en «Cuatro».
// - Al empezar: una olla abierta hirviendo sobre un fuego enorme; el vapor se lleva monedas.
// - «olla a presión»: la olla abierta sube y se va; baja la olla a presión, se cierra y el fuego se queda en una llama
//   pequeña y azul; por la válvula sale un hilito de vapor.
// - «casi seis veces menos»: «850 W» (en rojo, la abierta) frente a «150 W» (en verde, la de presión).
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, moneda, vapor, velo, vineta, VERDE, ROJO } from "../mundo.js";

export const desde = (v) => v.frase(6).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f6 = v.frase(6);
const T0 = f6.inicio, Tusa = f6.t("usa"), Tpre = f6.t("presion"), Tman = f6.t("mantener"), Thir = f6.t("hirviendo"), Tcasi = f6.t("casi"), Tseis = f6.t("seis"), Tmen = f6.t("menos"), Tabi = f6.t("abierta"), Fin = v.frase(7).inicio;

const FUEGO = [0, 470];
const cam = camino2D([[T0, [1.0, 0, 120]], [Tpre - 0.2, [1.02, 0, 140]], [Tman, [1.1, 0, 180]], [Tcasi, [1.0, 0, 120]], [Fin, [1.0, 0, 120]]]);
const sale = (t) => k.sale(tr(t, Tusa, Tpre - 0.15));          // la abierta sube y se va
const baja = (t) => k.entra(tr(t, Tpre - 0.25, Tpre + 0.2));    // la de presión baja
const llama = (t) => mez(1, 0, su(tr(t, Tpre - 0.1, Tpre + 0.5)));

const azulejo = (() => { const l = k.lienzo(256), c = l.getContext("2d"); c.fillStyle = "#f6c64a"; c.fillRect(0, 0, 256, 256); c.strokeStyle = "rgba(150,90,10,0.45)"; c.lineWidth = 5; c.strokeRect(0, 0, 128, 128); c.strokeRect(128, 0, 128, 128); c.strokeRect(0, 128, 128, 128); c.strokeRect(128, 128, 128, 128); c.globalCompositeOperation = "multiply"; c.globalAlpha = 0.2; c.drawImage(k.manchas, 0, 0, 256, 256); return l; })();
function cocina(g, t, fuerte) {
  for (let x = -1536; x < 1536; x += 256) for (let y = -2048; y < 360; y += 256) g.drawImage(azulejo, x, y, 256, 256);
  const lg = g.createRadialGradient(0, 300, 50, 0, 300, 1200); lg.addColorStop(0, `rgba(255,140,40,${0.2 + 0.25 * fuerte})`); lg.addColorStop(1, "rgba(40,10,0,0.55)");
  g.fillStyle = lg; g.fillRect(-1600, -2100, 3200, 2500);
  // la encimera y la placa
  const eg = g.createLinearGradient(0, 360, 0, 1700); eg.addColorStop(0, "#3a3e48"); eg.addColorStop(0.08, "#1c1f26"); eg.addColorStop(1, "#08090c"); g.fillStyle = eg; g.fillRect(-1600, 360, 3200, 1400);
  g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(-1600, 360, 3200, 6);
  // las parrillas del quemador
  g.strokeStyle = "#0a0a0c"; g.lineWidth = 18; g.lineCap = "round";
  for (const a of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) { g.beginPath(); g.moveTo(FUEGO[0] + Math.cos(a) * 120, FUEGO[1] + Math.sin(a) * 34); g.lineTo(FUEGO[0] + Math.cos(a) * 330, FUEGO[1] + Math.sin(a) * 92); g.stroke(); }
}
// una olla de acero: el cuerpo de (cx, base) hacia arriba, ancho w, alto h
function cuerpoOlla(g, cx, base, w, h) {
  g.beginPath(); g.moveTo(cx - w / 2, base - h); g.lineTo(cx - w / 2, base); g.ellipse(cx, base, w / 2, w * 0.12, 0, Math.PI, 0, true); g.lineTo(cx + w / 2, base - h); g.closePath();
  k.metal(g, cx - w / 2, cx + w / 2, ["#5a606a", "#f2f4f8", "#a2a9b4", "#ffffff", "#4e545e"]);
}
function ollaAbierta(g, t, cx, base) {
  const w = 600, h = 360;
  // las asas
  for (const s of [-1, 1]) { k.redondo(g, cx + s * (w / 2 + 10) - 45, base - h + 60, 90, 36, 18); g.fillStyle = "#2a2c32"; g.fill(); }
  cuerpoOlla(g, cx, base, w, h);
  // la boca, con el agua hirviendo
  g.beginPath(); g.ellipse(cx, base - h, w / 2, w * 0.12, 0, 0, 6.2832); g.fillStyle = "#cfd4dc"; g.fill();
  g.beginPath(); g.ellipse(cx, base - h + 6, w / 2 - 18, w * 0.1, 0, 0, 6.2832); g.fillStyle = "#7ac8f0"; g.fill();
  const az = azar(12);
  for (let i = 0; i < 30; i++) { const a = az() * 6.28, r = az(), u = (t * (1 + az()) + az()) % 1; g.strokeStyle = `rgba(255,255,255,${0.8 * (1 - u)})`; g.lineWidth = 3; g.beginPath(); g.ellipse(cx + Math.cos(a) * r * (w / 2 - 40), base - h + 6 + Math.sin(a) * r * w * 0.08, 10 + u * 14, (10 + u * 14) * 0.4, 0, 0, 6.2832); g.stroke(); }
}
function ollaPresion(g, t, cx, base) {
  const w = 560, h = 340;
  // el mango largo
  k.redondo(g, cx + w / 2 - 20, base - h - 30, 330, 52, 26); g.fillStyle = "#1a1b20"; g.fill(); g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(cx + w / 2, base - h - 24, 300, 8);
  cuerpoOlla(g, cx, base, w, h);
  // la tapa abombada, con su válvula
  g.beginPath(); g.ellipse(cx, base - h, w / 2 + 10, w * 0.13, 0, 0, 6.2832); g.fillStyle = "#9aa1ac"; g.fill();
  g.beginPath(); g.ellipse(cx, base - h - 18, w / 2 - 10, w * 0.12, 0, Math.PI, 0); g.lineTo(cx + w / 2 - 10, base - h - 18); g.ellipse(cx, base - h - 18, w / 2 - 10, w * 0.05, 0, 0, Math.PI); g.closePath();
  k.metal(g, cx - w / 2, cx + w / 2, ["#6a707a", "#ffffff", "#b4bac4", "#ffffff", "#5a606a"]);
  k.redondo(g, cx - 30, base - h - 110, 60, 70, 14); g.fillStyle = "#e0402a"; g.fill();
  g.beginPath(); g.arc(cx, base - h - 115, 18, 0, 6.2832); g.fillStyle = "#ffcc30"; g.fill();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const L = llama(t);
  cocina(g, t, L);
  // el fuego: grande y anaranjado con la abierta; pequeño y azul con la de presión
  const alto = mez(55, 240, L), rx = mez(150, 270, L);
  k.anilloDeLlamas(g, FUEGO[0], FUEGO[1], rx, rx * 0.28, t, mez(0, 0.75, L), false, 30, alto);
  // las ollas
  const yA = mez(FUEGO[1] - 40, -1600, sale(t)), yP = mez(-1600, FUEGO[1] - 40, baja(t));
  if (sale(t) < 1) ollaAbierta(g, t, 0, yA);
  if (baja(t) > 0) ollaPresion(g, t, 0, yP);
  k.anilloDeLlamas(g, FUEGO[0], FUEGO[1], rx, rx * 0.28, t, mez(0, 0.75, L), true, 30, alto);
  k.brillo(g, FUEGO[0], FUEGO[1], mez(400, 1100, L), L > 0.5 ? "255,150,50" : "100,150,255", mez(0.35, 0.6, L));
  // el vapor de la abierta, con monedas; el hilito de la válvula
  vapor(g, t, 0, yA - 380, 520, 1 - sale(t), { alto: 900, sem: 6, n: 26, tam: 1.4 });
  const az = azar(81);
  for (let i = 0; i < 14; i++) { const t0 = T0 - 1.2 + i * 0.16, u = tr(t, t0, t0 + 1.4); const gi = az(), dx = (az() - 0.5) * 420; if (u <= 0 || u >= 1) continue; moneda(g, dx, yA - 380 - u * 700, 40, gi + u, Math.sin(Math.PI * u) * (1 - sale(t0 + 0.7))); }
  if (baja(t) > 0.95) vapor(g, t, 0, yP - 470, 30, su(tr(t, Tpre + 0.3, Tman)) * (1 - su(tr(t, Fin - 0.6, Fin - 0.25))), { alto: 400, sem: 9, n: 8, tam: 0.5 });
  sinVista(g);
  // 850 W frente a 150 W
  const p1 = su(tr(t, Tcasi - 0.1, Tcasi + 0.2)) * (1 - su(tr(t, Fin - 0.5, Fin - 0.2)));
  const p2 = su(tr(t, Tmen - 0.15, Tmen + 0.15)) * (1 - su(tr(t, Fin - 0.5, Fin - 0.2)));
  if (p1 > 0) k.pastilla(g, 290, 640, "850", "W", ROJO, p1 * mez(1, 0.55, p2), 96);
  if (p2 > 0) { g.save(); g.translate(790, 640); const s = 1 + 0.2 * k.pulso(t, Tmen + 0.05, 0.12); g.scale(s, s); k.pastilla(g, 0, 0, "150", "W", VERDE, p2, 110); g.restore(); }
  vineta(g, 0.45);
  velo(g, 0.45, "40,20,5");
}
