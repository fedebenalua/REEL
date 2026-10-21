// El bar, con la cafetera y la torre de tazas: el hook (las dos aperturas) y el final.
// «taza»: el fotograma 0 pegado al chorro de café, que trae monedas y rebosa; luego las tazas se apilan y la cámara sube
// con la torre mientras el contador llega a 475 €. «torre»: desde el fotograma 0 la cámara ya sube a toda velocidad por
// una torre de tazas que se derraman monedas, hasta llegar arriba, a la cafetera, en «quinientos».
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, bar, barra, taza, cafetera, moneda, monedaTumbada, velo, vineta, ORO } from "./mundo.js";

const { suave: su, tramo: tr, mez, azar } = k;
const f1 = v.frase(1);
const Tcafe = f1.t("cafe"), Tcada = f1.t("cada"), Tman = f1.t("manana"), Tqui = f1.t("quinientos"), Teur = f1.t("euros"), Fin = v.frase(2).inicio;

const ALTO = 262;                          // lo que sube la torre por cada taza
const N = 34;                              // tazas en la torre
// cuándo cae cada taza (cada vez más deprisa); la última, en «euros»
const cae = (i) => mez(Tcada, Teur - 0.15, Math.pow(i / (N - 1), 0.75));
const caidas = Array.from({ length: N }, (_, i) => (i === 0 ? -1 : cae(i)));
const arriba = (t) => { let n = 0; for (const c of caidas) if (t > c) n++; return n; };

// las monedas que caen dentro del chorro
function chorro(g, t, x, y0, y1, al) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  const gr = g.createLinearGradient(x - 20, 0, x + 20, 0); gr.addColorStop(0, "#3a1a08"); gr.addColorStop(0.5, "#a0602a"); gr.addColorStop(1, "#3a1a08");
  for (const dx of [-28, 28]) { g.fillStyle = gr; g.beginPath(); g.moveTo(x + dx - 9, y0); g.lineTo(x + dx + 9, y0); g.lineTo(x + dx * 0.5 + 6, y1); g.lineTo(x + dx * 0.5 - 6, y1); g.closePath(); g.fill(); }
  const az = azar(17);
  for (let i = 0; i < 18; i++) { const f = az(), u = ((t * 1.3 + f) % 1), gi = az(); moneda(g, x + (az() - 0.5) * 60, mez(y0, y1 + 30, u * u), 34, gi + u * 2, Math.min(1, u * 5)); }
  g.restore();
}

// el montón de monedas que rebosa de la taza y cae a la barra
function rebosa(g, t, x, y, cuanto) {
  if (cuanto <= 0.01) return;
  const az = azar(29);
  for (let i = 0; i < 40; i++) {
    const t0 = az() * 1.2, lado = az() < 0.5 ? -1 : 1, v0 = 120 + az() * 200, gi = az(), u = ((t - t0) % 1.2 + 1.2) % 1.2;
    const xx = x + lado * (110 + v0 * u), yy = y - 230 + 600 * u * u - 150 * u;
    if (yy > y + 10) continue;
    moneda(g, xx, yy, 32, gi + u * 3, cuanto);
  }
  for (let i = 0; i < 26; i++) monedaTumbada(g, x + (az() - 0.5) * 520, y + 8 + az() * 30, 36, cuanto * Math.min(1, (t - 0.2 * i / 26) * 2));
}

export function escenaCafe(g, t, variante) {
  bar(g, t);
  const n = arriba(t);
  let Z, cx, cy;
  if (variante === "torre") {
    // sube por la torre ya hecha, a toda velocidad, y frena arriba en «quinientos»
    const u = k.entra(tr(t, 0, Tqui + 0.3));
    Z = mez(1.15, 0.85, u); cx = 0; cy = mez(-ALTO * 3, -ALTO * (N - 1) - 300, u);
  } else {
    const sube = su(tr(t, Tcada - 0.2, Tcada + 0.4)), top = -ALTO * Math.max(0, n - 1);
    Z = mez(1.65, 0.85, sube); cx = 0; cy = mez(-260, top - 380, sube);
    cy = Math.min(cy, mez(-260, 0, 0));
  }
  vista(g, Z, cx, cy);
  barra(g, 0);
  // la torre de tazas
  const hechas = variante === "torre" ? N : n;
  for (let i = 0; i < hechas; i++) taza(g, t, { lleno: 1 }), g.translate(0, -ALTO);
  g.translate(0, ALTO * hechas);
  if (variante !== "torre") {
    // la taza que está cayendo
    const i = n; if (i < N) { const c = caidas[i], u = tr(t, c - 0.25, c); if (u > 0) { g.save(); g.translate(0, -ALTO * i - (1 - u * u) * 900); taza(g, t, { lleno: 1 }); g.restore(); } }
  }
  // la cafetera, encima de la última taza, echando café con monedas
  const yTop = -ALTO * Math.max(0, hechas - 1);
  g.save(); g.translate(0, yTop - 340); cafetera(g); g.restore();
  const vierte = variante === "torre" ? su(tr(t, Tqui - 0.6, Tqui)) * (1 - su(tr(t, Fin - 0.8, Fin - 0.4))) : 1 - su(tr(t, Fin - 0.8, Fin - 0.4));
  chorro(g, t, 0, yTop - 340, yTop - 230, vierte);
  if (variante !== "torre") rebosa(g, t, 0, 0, 1 - su(tr(t, Tcada, Tcada + 0.5)));
  // en la torre, las monedas que se derraman por los lados al pasar
  if (variante === "torre") {
    const az = azar(3);
    for (let i = 0; i < 60; i++) { const fila = Math.floor(az() * N), lado = az() < 0.5 ? -1 : 1, u = (t * (0.8 + az()) + az()) % 1; moneda(g, lado * (170 + u * 160), -ALTO * fila - 220 + u * 300, 30, az() + u * 2, Math.sin(Math.PI * u) * (1 - su(tr(t, Tqui, Fin - 0.3)))); }
  }
  sinVista(g);
  // el contador: corre de 0 a 475 € con las tazas
  const cuenta = variante === "torre" ? su(tr(t, 0.1, Teur)) : (n / N);
  const al = su(tr(t, Tcada - 0.1, Tcada + 0.2)) * (variante === "torre" ? 1 : 1) + (variante === "torre" ? 1 : 0);
  const fin = 1 - su(tr(t, Fin - 0.35, Fin - 0.1));
  if (Math.min(1, al) * fin > 0.01) { const s = 1 + 0.2 * k.pulso(t, Teur + 0.05, 0.15); g.save(); g.translate(540, 1300); g.scale(s, s); k.pastilla(g, 0, 0, `${Math.round(475 * Math.min(1, cuenta))} €`, "al año", ORO, Math.min(1, al) * fin, 120); g.restore(); }
  vineta(g, 0.5);
  velo(g, 0.5);
}
