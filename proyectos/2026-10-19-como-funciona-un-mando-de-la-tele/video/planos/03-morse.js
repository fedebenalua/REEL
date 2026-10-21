// «Con pausas cortas y largas: ceros y unos, como un morse de luz.»
// El aire entre el mando y la tele, a oscuras. Se entra con un corte en «Con».
// - Fotograma 0: un tren de destellos morados cruza la pantalla de izquierda a derecha, despacio.
// - «cortas»: se marcan en azul las pausas cortas; «largas»: en amarillo las largas.
// - «ceros»: bajo cada pausa corta, un 0; «unos»: bajo cada larga, un 1. Es el mismo número del chip.
// - «morse»: la cámara se aleja y se ve el tren entero, largo, como puntos y rayas, viajando hacia la tele.
import * as k from "#kit";
import { v } from "#voz";
import { CODIGO, ROJO } from "../mundo.js";

const { suave: su, tramo: tr, mez, azar } = k;
const f6 = v.frase(6);
export const desde = (vz) => vz.frase(6).inicio;
const T0 = f6.inicio, Tcor = f6.t("cortas"), Tlar = f6.t("largas"), Tcer = f6.t("ceros"), Tuno = f6.t("unos"), Tmor = f6.t("morse"), Fin = v.frase(7).inicio;

// el tren: cada cifra es un destello igual y una pausa (corta = 0, larga = 1); se repite el número tres veces
const DEST = 60, CORTA = 62, LARGA = 190;
const TREN = []; let x0 = 0;
for (let r = 0; r < 3; r++) for (const b of CODIGO) { TREN.push({ x: x0, b, r }); x0 += DEST + (b ? LARGA : CORTA); }
const LARGO = x0;
const azB = azar(9);
const BOKEH = Array.from({ length: 30 }, () => ({ x: azB() * 1080, y: 300 + azB() * 1300, r: 40 + azB() * 140, c: ["255,60,200", "120,90,255", "255,150,80"][Math.floor(azB() * 3)] }));

export function dibuja(g, t) {
  // el fondo: el salón a oscuras, desenfocado
  const fg = g.createLinearGradient(0, 0, 0, 1920); fg.addColorStop(0, "#0b0818"); fg.addColorStop(0.5, "#1a1030"); fg.addColorStop(1, "#0a0714");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "lighter";
  for (const b of BOKEH) { const gr = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r); gr.addColorStop(0, `rgba(${b.c},0.13)`); gr.addColorStop(1, `rgba(${b.c},0)`); g.fillStyle = gr; g.fillRect(b.x - b.r, b.y - b.r, 2 * b.r, 2 * b.r); }
  g.restore();
  // la cámara: de cerca (el primer número) a lejos (el tren entero)
  const lejos = su(tr(t, Tmor - 0.35, Fin - 0.3));
  const z = mez(0.76, 0.42, lejos), Y = 900;
  const viaje = (t - T0) * 22;                                       // el tren avanza despacio hacia la derecha
  const W8 = TREN[8].x - CORTA;
  const xIni = mez(540 - W8 * 0.76 / 2, 540 - LARGO * 0.42 / 2, lejos);  // dónde empieza el tren en pantalla
  const sx = (x) => xIni + (x + viaje) * z;
  const h = 330 * z;
  // el haz: una franja tenue por donde viaja la luz
  const hz = g.createLinearGradient(0, Y - h, 0, Y + h); hz.addColorStop(0, `rgba(${ROJO},0)`); hz.addColorStop(0.5, `rgba(${ROJO},0.12)`); hz.addColorStop(1, `rgba(${ROJO},0)`);
  g.fillStyle = hz; g.fillRect(0, Y - h, 1080, 2 * h);
  const mCor = su(tr(t, Tcor - 0.1, Tcor + 0.2)), mLar = su(tr(t, Tlar - 0.1, Tlar + 0.2));
  const nCer = su(tr(t, Tcer - 0.1, Tcer + 0.25)), nUno = su(tr(t, Tuno - 0.1, Tuno + 0.25));
  const marcas = 1 - su(tr(t, Tmor + 0.4, Fin - 0.4)) * 0.0;
  const brilla = su(tr(t, Tmor - 0.1, Tmor + 0.3));
  for (const d of TREN) {
    const xa = sx(d.x), xb = sx(d.x + DEST), xp = sx(d.x + DEST + (d.b ? LARGA : CORTA));
    if (xp < -100 || xa > 1180) continue;
    const enfoque = d.r === 0 ? 1 : mez(0.35, 1, lejos);              // el primer número, el que se lee
    // la pausa, marcada
    const m = d.b ? mLar : mCor, col = d.b ? "255,215,90" : "90,200,255";
    if (m > 0 && d.r === 0) {
      g.save(); g.globalAlpha = m * marcas * (1 - lejos * 0.6);
      k.redondo(g, xb + 8 * z, Y - 120 * z, xp - xb - 16 * z, 240 * z, 20 * z); g.fillStyle = `rgba(${col},0.16)`; g.fill();
      g.strokeStyle = `rgba(${col},0.85)`; g.lineWidth = 4 * z; g.stroke();
      g.restore();
    }
    // la cifra debajo
    const n = d.b ? nUno : nCer;
    if (n > 0 && d.r === 0) {
      g.save(); g.globalAlpha = n * (1 - lejos * 0.6);
      g.font = `800 ${Math.round(110 * z)}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
      g.shadowColor = `rgba(${col},0.9)`; g.shadowBlur = 30 * z; g.fillStyle = `rgb(${col})`;
      g.fillText(String(d.b), (xb + xp) / 2, Y + (300 + 40 * (1 - k.entra(n))) * z);
      g.restore();
    }
    // el destello: un bloque de luz
    const al = enfoque * (0.85 + 0.15 * Math.sin(t * 20 + d.x));
    g.save(); g.globalCompositeOperation = "lighter";
    const bg = g.createLinearGradient(0, Y - 200 * z, 0, Y + 200 * z);
    bg.addColorStop(0, `rgba(${ROJO},0)`); bg.addColorStop(0.3, `rgba(${ROJO},${0.6 * al})`); bg.addColorStop(0.5, `rgba(255,220,250,${al})`); bg.addColorStop(0.7, `rgba(${ROJO},${0.6 * al})`); bg.addColorStop(1, `rgba(${ROJO},0)`);
    g.fillStyle = bg; k.redondo(g, xa, Y - 200 * z, xb - xa, 400 * z, 18 * z); g.fill();
    g.restore();
    k.brillo(g, (xa + xb) / 2, Y, 600 * z, ROJO, 0.45 * al * (1 + brilla * 0.4));
  }
}

export const momentos = { cortas: Tcor, largas: Tlar, morse: Tmor };
