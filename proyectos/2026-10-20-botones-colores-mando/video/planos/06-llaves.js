// «Así que no son un adorno: son las llaves del internet de antes.»
// Vuelven los cuatro botones enormes del principio, limpios. Una cámara.
// - «Así que no son un… adorno»: los botones saltan uno a uno; cuelga una bola de adorno y se tacha.
// - «son las llaves»: de cada botón sube una llave de luz.
// - «del internet de antes»: las cuatro llaves se unen con hilos de luz a un globo y todo late una vez.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta } from "../mundo.js";
import { macro, X, R, rgb } from "../botones.js";

export const desde = (vz) => vz.frase(10).inicio;

const { suave: su, tramo: tr, mez } = k;
const f = v.frase(10);
const T0 = f.inicio, Tado = f.t("adorno"), Tson = f.t("llaves") - 0.4, Tlla = f.t("llaves"), Tint = f.t("internet"), Tant = f.t("antes");
const FIN = v.frase(11).inicio;

const cam = camino2D([[T0, [0.95, 0, -120]], [FIN, [1.02, 0, -150]]]);
const SALTOS = [T0 + 0.15, T0 + 0.4, T0 + 0.65, T0 + 0.9];

function llave(g, x, y, ang, al, esc = 1) {
  g.save(); g.translate(x, y); g.rotate(ang); g.scale(esc, esc); g.globalAlpha = al;
  k.brillo(g, 20, 0, 220, "255,215,90", 0.8);
  g.strokeStyle = "#ffe27a"; g.lineWidth = 16; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath(); g.arc(-70, 0, 38, 0, 6.2832); g.stroke(); g.beginPath(); g.moveTo(-32, 0); g.lineTo(110, 0); g.moveTo(80, 0); g.lineTo(80, 36); g.moveTo(108, 0); g.lineTo(108, 28); g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 5; g.beginPath(); g.arc(-70, 0, 38, 0, 6.2832); g.moveTo(-32, 0); g.lineTo(110, 0); g.stroke();
  g.restore();
}

function bola(g, t) {
  const a = su(tr(t, Tado - 0.2, Tado + 0.2)) * (1 - su(tr(t, Tson, Tson + 0.4)));
  if (a <= 0.01) return;
  const caida = su(tr(t, Tson - 0.05, Tson + 0.4));
  g.save(); g.globalAlpha = a; g.translate(0, -380 + 500 * caida); { const s = 1.25 * (0.6 + 0.4 * su(tr(t, Tado - 0.2, Tado + 0.25))); g.scale(s, s); } g.rotate(0.15 * Math.sin(t * 5) * (1 - caida));
  g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 5; g.beginPath(); g.moveTo(0, -300); g.lineTo(0, -80); g.stroke();
  k.brillo(g, 0, 0, 260, "255,70,80", 0.4);
  const gr = g.createRadialGradient(-30, -30, 10, 0, 0, 90); gr.addColorStop(0, "#ff9a90"); gr.addColorStop(0.5, "#e01c28"); gr.addColorStop(1, "#6a0a14");
  g.beginPath(); g.arc(0, 0, 90, 0, 6.2832); g.fillStyle = gr; g.fill();
  g.fillStyle = "#e8c860"; g.fillRect(-22, -108, 44, 26);
  g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.ellipse(-34, -38, 20, 10, -0.7, 0, 6.2832); g.fill();
  // el tachón
  const x = su(tr(t, Tado + 0.15, Tado + 0.4));
  if (x > 0.01) { g.strokeStyle = `rgba(255,255,255,${x})`; g.lineWidth = 26; g.lineCap = "round"; g.beginPath(); g.moveTo(-130, -130); g.lineTo(-130 + 260 * Math.min(1, x * 2), -130 + 260 * Math.min(1, x * 2)); g.stroke(); if (x > 0.5) { g.beginPath(); g.moveTo(130, -130); g.lineTo(130 - 260 * (x - 0.5) * 2, -130 + 260 * (x - 0.5) * 2); g.stroke(); } }
  g.restore();
}

function globo(g, cx, cy, r, t, al) {
  g.save(); g.translate(cx, cy); g.globalAlpha = al; k.brillo(g, 0, 0, r * 3, "90,200,255", 0.55);
  g.strokeStyle = "#bfeaff"; g.lineWidth = 9; g.lineCap = "round";
  g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.stroke();
  g.beginPath(); g.moveTo(-r, 0); g.lineTo(r, 0); g.stroke();
  g.beginPath(); g.ellipse(0, 0, r * 0.45, r, 0, 0, 6.2832); g.stroke();
  for (const dy of [-0.5, 0.5]) { g.beginPath(); const w = Math.sqrt(1 - dy * dy) * r; g.moveTo(-w, dy * r); g.lineTo(w, dy * r); g.stroke(); }
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const bote = [0, 1, 2, 3].map((i) => Math.sin(Math.PI * tr(t, SALTOS[i], SALTOS[i] + 0.45)));
  macro(g, t, { lit: [1, 1, 1, 1], bote, polvo: [0, 0, 0, 0], web: 0, aranaY: null, preg: [1, 1, 1, 1], fondo: 1 });
  bola(g, t);
  // las llaves suben de cada botón
  const sube = [0, 1, 2, 3].map((i) => su(tr(t, Tlla + 0.1 * i, Tlla + 0.1 * i + 0.55)));
  const pul = k.pulso(t, Tant + 0.1, 0.25);
  const ky = (i) => mez(-30, -240, sube[i]) - 14 * Math.sin(t * 3 + i) * sube[i];
  const alg = su(tr(t, Tint - 0.1, Tint + 0.5));
  // los hilos entre las llaves y el globo
  if (alg > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    const Gy = -560;
    for (let i = 0; i < 4; i++) {
      const u = su(tr(t, Tint + 0.05 * i, Tint + 0.05 * i + 0.5));
      const x0 = X[i], y0 = ky(i) - 120, x1 = mez(x0, 0, u), y1 = mez(y0, Gy + 100, u);
      for (const [col, w2] of [[`rgba(${rgb(i)},0.35)`, 34], [`rgba(${rgb(i)},0.95)`, 12], ["rgba(255,255,255,0.9)", 4]]) { g.strokeStyle = col; g.lineWidth = w2; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
    }
    g.restore();
    globo(g, 0, -560, 105 + 12 * pul, t, alg);
  }
  for (let i = 0; i < 4; i++) if (sube[i] > 0.01) llave(g, X[i], ky(i), -Math.PI / 2, sube[i], 0.9 + 0.12 * pul);
  sinVista(g);
  velo(g, 0.5);
  vineta(g, 0.45);
}

export const momentos = { adorno: Tado, llaves: Tlla, internet: Tint, antes: Tant };
