// «Parece poco, pero cada grado de más gasta un siete por ciento más. Es como si, de cada catorce euros de calefacción,
//  te ahorraras uno. Y eso pasa todo el invierno, cada día y cada noche. En una casa media de España, son unos treinta
//  euros al año por cada grado.»
// Un sitio: la mesa de madera. Dos torres de monedas (a 21 y a 22 grados), la de más es un 7 % más; esa moneda va a la hucha.
// Luego la hucha crece delante de una ventana con sus días y sus noches, y entran monedas todo el rato; al final «30 € al año».
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, billete, moneda, monedaCanto, hucha, ventana, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(4).inicio;

const { suave: su, tramo: tr, mez, entra, mezColor } = k;
const F4 = v.frase(4), F5 = v.frase(5), F6 = v.frase(6), F7 = v.frase(7);
const T0 = F4.inicio, FIN = F7.fin + 0.04;
const Tsiete = F4.t("siete"), Tcat = F5.t("catorce"), Tahorr = F5.t("ahorraras"), Tuno = F5.t("uno");
const Tinv = F6.inicio, Ttre = F7.t("treinta");
const TSAL = Tinv + 0.02;                           // las torres se van
const cam = camino2D([[T0, [1.25, 0, 60]], [Tinv - 0.1, [1.25, 0, 60]], [Tinv + 0.7, [1.0, 0, 100]], [FIN, [1.18, 0, 120]]]);

const CW = 250, CH = 34, BASE = 300, XL = -230, XR = 230;
const yMon = (i) => BASE - CH / 2 - CH * i;

function fondo(g) {
  const gr = g.createLinearGradient(0, -1100, 0, 400); gr.addColorStop(0, "#0e7a9a"); gr.addColorStop(1, "#2146a8");
  g.fillStyle = gr; g.fillRect(-900, -1300, 1800, 1700);
  const w = g.createLinearGradient(0, 312, 0, 1500); w.addColorStop(0, "#c98648"); w.addColorStop(1, "#6f4120");
  g.fillStyle = w; g.fillRect(-900, 312, 1800, 1400);
  g.fillStyle = "#e5a566"; g.fillRect(-900, 312, 1800, 14);
  g.strokeStyle = "rgba(60,30,10,0.25)"; g.lineWidth = 3;
  for (let i = 0; i < 9; i++) { const y = 380 + i * 90; g.beginPath(); g.moveTo(-900, y); g.lineTo(900, y + (i % 2 ? 6 : -6)); g.stroke(); }
}

function torre(g, t, x, n, t0, dt, opts = {}) {
  const { sinUltima = false, rojoUltima = 0 } = opts;
  for (let i = 0; i < n; i++) {
    if (sinUltima && i === n - 1) continue;
    const ts = i < 8 ? -9 : t0 + (i - 8) * dt, u = i < 8 ? 1 : tr(t, ts, ts + 0.32);
    if (u <= 0) continue;
    const yy = yMon(i) - (1 - u * u) * 760;
    const ult = i === n - 1;
    monedaCanto(g, x, yy, CW, CH, { arriba: i === n - 1 || u < 1, rojo: ult ? rojoUltima : 0 });
  }
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  fondo(g);
  k.brillo(g, 0, 0, 1500, "120,220,255", 0.22);
  const desliza = su(tr(t, TSAL, TSAL + 0.6));
  const dx = 900 * desliza;
  // la torre de más se escapa en billetes que suben
  if (t > Tsiete && t < Tcat + 0.3) {
    const a0 = su(tr(t, Tsiete, Tsiete + 0.4)) * (1 - su(tr(t, Tcat - 0.2, Tcat + 0.3)));
    for (let i = 0; i < 6; i++) {
      const p = ((t - Tsiete) * 0.5 + i / 6) % 1, x = XR + (i % 2 ? 1 : -1) * (30 + 60 * p) + Math.sin(p * 8 + i) * 22, y = -230 - p * 340;
      billete(g, x, y, Math.sin(p * 5 + i) * 0.6, 0.55 + 0.35 * p, a0 * Math.min(1, p * 8) * (1 - tr(p, 0.65, 1)));
    }
  }
  // --- las torres
  if (desliza < 0.999) {
    const lift = su(tr(t, Tcat, Tcat + 0.5));
    const rojo = su(tr(t, 10.75, 11.05)) * (1 - lift);
    g.save(); g.translate(-dx, 0); torre(g, t, XL, 14, T0 + 0.05, 0.13); g.restore();
    g.save(); g.translate(dx, 0); torre(g, t, XR, 15, 9.55, 0.12, { sinUltima: t >= Tcat, rojoUltima: rojo }); g.restore();
    // las etiquetas de abajo
    g.save(); g.translate(-dx, 0); k.pastilla(g, XL, 395, "21", "°C", "130,215,255", 1, 70); g.restore();
    g.save(); g.translate(dx, 0); k.pastilla(g, XR, 395, "22", "°C", "255,150,90", 1, 70); g.restore();
    // «+7 %»
    const aSiete = su(tr(t, Tsiete, Tsiete + 0.3)) * (1 - su(tr(t, Tcat - 0.4, Tcat - 0.1)));
    g.save(); g.translate(dx, 0); k.pastilla(g, XR, -290, "+7", "%", "255,120,100", aSiete, 80); g.restore();
    // «14 €» y «15 €»
    const aEu = su(tr(t, Tcat, Tcat + 0.3));
    g.save(); g.translate(-dx, 0); k.pastilla(g, XL, -250, "14", "€", "255,226,120", aEu, 80); g.restore();
    g.save(); g.translate(dx, 0); k.pastilla(g, XR, -250, "14", "€", "255,226,120", aEu, 80); g.restore();
  }
  // la moneda de más late en rojo mientras la voz sigue
  if (t > 10.9 && t < Tcat) { const lat = 0.5 + 0.5 * Math.sin(t * 7); k.brillo(g, XR, yMon(14), 420, "255,80,60", 0.55 * lat * su(tr(t, 10.9, 11.3))); }
  // --- la hucha y la moneda que va a ella
  const entra1 = su(tr(t, Tahorr - 0.85, Tahorr - 0.2));
  const sube = su(tr(t, TSAL + 0.1, TSAL + 0.9));
  const hx = mez(1000, 0, entra1), hy = mez(600, 440, sube), hs = mez(0.8, 1.25, sube);
  const slot = [hx, hy - 188 * hs];
  const ven = su(tr(t, Tinv + 0.2, Tinv + 0.9));
  // la ventana, detrás de la hucha
  if (ven > 0.01) {
    const tc = Math.min(t, 24.0), fase = (tc - Tinv) / 2.4;
    const dim = 1 - 0.65 * su(tr(t, 22.4, 23.3));
    g.save(); g.translate(0, -70); ventana(g, tc, { fase, al: ven * dim }); g.restore();
  }
  // las monedas que caen del invierno
  let aplasta = 0;
  if (t > Tinv + 0.3) {
    for (let j = 0; j < 20; j++) {
      const ti = Tinv + 0.45 + j * 0.34, dur = 0.5;
      if (ti > 24.0) break;
      const u = tr(t, ti, ti + dur);
      if (u > 0 && u < 1) moneda(g, slot[0] + (j % 3 - 1) * 10, mez(-330, slot[1] + 14, u * u), 44, u * 9 + j, { al: 1 });
      aplasta = Math.max(aplasta, 0.55 * k.pulso(t, ti + dur, 0.07));
    }
  }
  // la moneda extra: sale de la torre, espera, y entra en la hucha
  let guino = 0;
  if (t >= Tcat && t < Tuno + 0.05) {
    const lift = su(tr(t, Tcat, Tcat + 0.55)), vuelo = tr(t, Tahorr, Tuno);
    const P0 = [XR, yMon(14) - 70];
    let x = XR, y = mez(yMon(14), P0[1], lift);
    if (vuelo > 0) { const e = su(vuelo); x = mez(P0[0], slot[0], e); y = mez(P0[1], slot[1], e) - 300 * Math.sin(Math.PI * e); }
    const giro = mez(Math.PI / 2, 0, lift) + (vuelo > 0 ? vuelo * 12 : 0);
    const r = mez(CW * 0.5, 70, lift) * mez(1, 0.7, su(vuelo));
    moneda(g, x, y, r, giro, { brilla: lift * (1 - su(vuelo)), rojo: 1 - su(tr(t, Tcat, Tcat + 0.4)) });
  }
  if (t >= Tuno) { aplasta = Math.max(aplasta, 0.9 * k.pulso(t, Tuno + 0.06, 0.1)); guino = t > Tuno + 0.1 && t < Tuno + 0.7 ? 1 : 0; }
  // la hucha
  g.save(); g.translate(hx, hy); g.scale(hs, hs); hucha(g, t, { aplasta, guino }); g.restore();
  if (t >= Tuno && t < Tuno + 0.6) k.brillo(g, slot[0], slot[1], 520 * (1 - tr(t, Tuno, Tuno + 0.6) * 0.5), "255,230,130", 0.8 * (1 - tr(t, Tuno, Tuno + 0.6)));
  // «30 € al año»
  const aTre = su(tr(t, Ttre, Ttre + 0.3));
  if (aTre > 0.01) {
    const val = Math.round(30 * su(tr(t, Ttre, Ttre + 0.7)));
    k.pastilla(g, 0, -20, String(val), "€ al año", "255,226,120", aTre, 150);
  }
  sinVista(g);
  velo(g, 0.4);
  vineta(g, 0.45);
}
export const momentos = { siete: Tsiete, catorce: Tcat, uno: Tuno, treinta: Ttre };
