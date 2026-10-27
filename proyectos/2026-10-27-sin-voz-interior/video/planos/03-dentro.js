// «En su cabeza había imágenes, sensaciones o ideas sin palabras.»
// - «En su cabeza»: la cámara atraviesa la cabeza azul y entra.
// - Dentro de una cabeza en silencio: un espacio azul con motas que pasan despacio (la cámara avanza).
// - «imágenes»: llegan flotando tres cuadros con luz (el mar al atardecer, una montaña, una casa de noche) y se quedan.
// - «sensaciones»: una ola de color cálido lo cruza todo y los cuadros se tiñen.
// - «ideas»: unas letras de oro bajan; «sin palabras»: se deshacen y en su lugar se enciende un cristal de luz.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, CRANEO, ORO, cabeza, caminoCabeza, cuadro, fondo, frena, palabra, polvo, silencio, velo, vineta } from "../mundo.js";

export const desde = (v) => v.frase(8).inicio;
export const entrada = "sigue";

const { suave: su, tramo: tr, mez, entra, pulso } = k;
const f8 = v.frase(8);
const T0 = f8.inicio, Timg = f8.t("imagenes"), Tsen = f8.t("sensaciones"), Tide = f8.t("ideas"), Tsin = f8.t("sin"), Tpal = f8.t("palabras");
const Tfin = v.frase(9).inicio;

const MOTAS = (() => { const az = k.azar(3030); return Array.from({ length: 160 }, () => ({ x: (az() - 0.5) * 2600, y: (az() - 0.5) * 4200, z: 0.2 + az() * 3, r: 2 + az() * 4, f: az() * 6 })); })();
const CUADROS = [
  { tipo: "mar", x: 290, y: 700, w: 400, h: 290, ang: -0.08, t: Timg - 0.35 },
  { tipo: "montana", x: 830, y: 820, w: 370, h: 270, ang: 0.07, t: Timg - 0.1 },
  { tipo: "casa", x: 320, y: 1300, w: 380, h: 280, ang: 0.05, t: Timg + 0.15 },
];

// Un cristal de luz (un octaedro que gira), centrado en (x, y), de radio r. al: 0-1.
const V = [[0, -1.25, 0], [0, 1.25, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]];
const CARAS = [[0, 2, 4], [0, 4, 3], [0, 3, 5], [0, 5, 2], [1, 4, 2], [1, 3, 4], [1, 5, 3], [1, 2, 5]];
function cristal(g, x, y, r, ang, al) {
  if (al <= 0.01) return;
  const ca = Math.cos(ang), sa = Math.sin(ang), inc = 0.35;
  const P = V.map(([a, b, c]) => { const X = a * ca + c * sa, Z = -a * sa + c * ca; const Y = b * Math.cos(inc) - Z * Math.sin(inc), Z2 = b * Math.sin(inc) + Z * Math.cos(inc); return [x + X * r, y + Y * r, Z2]; });
  g.save(); g.globalAlpha *= al;
  g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, x, y, r * 5, "120,220,255", 0.6); g.restore();
  const caras = CARAS.map((f) => ({ f, z: (P[f[0]][2] + P[f[1]][2] + P[f[2]][2]) / 3 })).sort((a, b) => a.z - b.z);
  for (const { f, z } of caras) {
    const [A, B, C] = f.map((i) => P[i]);
    const nx = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
    const luz = 0.5 + 0.5 * Math.max(-1, Math.min(1, -z));
    g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.lineTo(C[0], C[1]); g.closePath();
    g.fillStyle = `rgba(${Math.round(mez(60, 210, luz))},${Math.round(mez(140, 245, luz))},255,${nx > 0 ? 0.85 : 0.35})`; g.fill();
    g.strokeStyle = "rgba(230,250,255,0.9)"; g.lineWidth = 3; g.stroke();
  }
  g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, x - r * 0.25, y - r * 0.35, r * 1.2, "255,255,255", 0.7); g.restore();
  g.restore();
}

export function dibuja(g, t) {
  const tf = frena(t, Tfin - 0.8, Tfin - 0.2);
  // el fondo: el azul de dentro, más claro en el centro
  const bg = g.createRadialGradient(540, 1050, 50, 540, 1050, 1300);
  bg.addColorStop(0, "#1c3a8a"); bg.addColorStop(0.5, "#0e1c52"); bg.addColorStop(1, "#050a24");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  // la ola de color de las sensaciones: una banda cálida que cruza de izquierda a derecha y deja el fondo tibio
  const ola = tr(t, Tsen - 0.35, Tsen + 0.9), tibio = su(tr(t, Tsen - 0.1, Tsen + 0.6)) * (1 - 0.6 * su(tr(t, Tide - 0.2, Tsin + 0.3)));
  g.save(); g.globalCompositeOperation = "lighter";
  if (tibio > 0.01) { const tg = g.createRadialGradient(540, 1050, 100, 540, 1050, 1100); tg.addColorStop(0, `rgba(255,120,150,${0.35 * tibio})`); tg.addColorStop(1, `rgba(255,140,80,${0.12 * tibio})`); g.fillStyle = tg; g.fillRect(0, 0, 1080, 1920); }
  if (ola > 0 && ola < 1) {
    const xo = mez(-700, 1780, ola);
    const og = g.createLinearGradient(xo - 500, 0, xo + 500, 0);
    og.addColorStop(0, "rgba(255,90,160,0)"); og.addColorStop(0.45, "rgba(255,110,150,0.55)"); og.addColorStop(0.6, "rgba(255,190,90,0.5)"); og.addColorStop(1, "rgba(255,190,90,0)");
    g.fillStyle = og; g.fillRect(0, 0, 1080, 1920);
  }
  // las motas: la cámara avanza despacio
  const avance = tf * 0.35;
  for (const m of MOTAS) {
    const z = ((m.z - avance) % 3 + 3) % 3 + 0.2;
    const x = 540 + m.x / z * 0.5, y = 1050 + m.y / z * 0.5;
    if (x < -20 || x > 1100 || y < -20 || y > 1940) continue;
    const a = Math.min(1, (3.2 - z) * 0.8) * (0.4 + 0.3 * Math.sin(t * 2 + m.f));
    g.fillStyle = `rgba(150,220,255,${a})`; g.beginPath(); g.arc(x, y, m.r / z, 0, 6.2832); g.fill();
  }
  g.restore();
  // los cuadros: llegan de lejos, frenan y se quedan flotando; con las sensaciones, se tiñen
  const idea = su(tr(t, Tsin - 0.2, Tpal + 0.4));
  for (const c of CUADROS) {
    const u = entra(tr(t, c.t, c.t + 0.6));
    if (u <= 0.01) continue;
    const s = mez(0.2, 1, u) * mez(1, 0.92, idea);
    const x = mez(540, c.x, u) + (c.x - 540) * 0.08 * idea, y = mez(1050, c.y, u) + Math.sin(t * 1.4 + c.x) * 10 + (c.y - 1050) * 0.08 * idea;
    cuadro(g, c.tipo, x, y, c.w * s, c.h * s, tf, { ang: c.ang * u, al: Math.min(1, u * 2), borde: tibio > 0.3 ? "255,150,170" : AZUL });
    if (tibio > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, x, y, c.w * 1.4 * s, "255,140,120", 0.2 * tibio + 0.25 * pulso(t, Tsen + 0.1, 0.25)); g.restore(); }
  }
  // «ideas»: las letras de oro bajan al centro; «sin palabras»: se deshacen y nace el cristal
  const cx = 560, cy = 1110;
  const baja = entra(tr(t, Tide - 0.35, Tide + 0.3)), deshace = su(tr(t, Tsin - 0.05, Tsin + 0.3));
  if (baja > 0.01 && deshace < 1) {
    const letras = ["i", "d", "e", "a"];
    letras.forEach((l, i) => {
      const x = cx - 120 + i * 80 + Math.sin(i * 2 + deshace * 4) * 30 * deshace, y = mez(cy - 420, cy, baja) + i * 6;
      palabra(g, l, x, y, 140, (1 - deshace) * baja, ORO);
    });
  }
  polvo(g, cx, cy, tr(t, Tsin - 0.05, Tsin + 0.8), 200, ORO);
  const nace = entra(tr(t, Tsin + 0.05, Tpal + 0.45));
  cristal(g, cx, cy, 165 * nace, tf * 1.4, nace);
  if (nace > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, cx, cy, 900, "120,220,255", 0.6 * pulso(t, Tsin + 0.25, 0.25)); g.restore(); }
  // «En su cabeza»: se entra atravesando la cabeza azul
  const pasa = tr(t, T0 - 0.05, T0 + 0.6);
  if (pasa < 1) {
    const s = mez(0.95, 7, k.sale(pasa)), hx = 540 - CRANEO.x * s, hy = 1020 - CRANEO.y * s;
    // fuera de la cabeza, el fondo violeta del plano de antes (con un hueco con su forma)
    const fuera = k.lienzo(1080, 1920), fc = fuera.getContext("2d");
    fondo(fc, t, { cal: 0, noche: 1, dx: 81, dy: -11 });
    // (borrar con "destination-out" y una forma trasladada solo borra un cuarto: se borra con una máscara ya dibujada)
    const masc = k.lienzo(1080, 1920), mc = masc.getContext("2d");
    mc.translate(hx, hy); mc.scale(s, s); caminoCabeza(mc); mc.fillStyle = "#000"; mc.fill();
    fc.globalCompositeOperation = "destination-out"; fc.drawImage(masc, 0, 0);
    g.drawImage(fuera, 0, 0);
    cabeza(g, hx, hy, s, t, { tono: "azul", al: 1 - su(tr(pasa, 0.45, 1)), dentro: (c) => silencio(c, t, 1) });
  }
  vineta(g, mez(0.45, 0.6, su(tr(t, T0, T0 + 0.6))));
  velo(g, 0.45);
}
