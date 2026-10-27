// «¿Por qué septiembre significa siete si es el noveno mes del año?» «Y no es el único: octubre es ocho, noviembre
// nueve y diciembre diez.» «Todos fallan justo por dos, y la culpa es de los...»
// El calendario de la pared, con una sola cámara.
// - Fotograma 0: las hojas (ENERO, FEBRERO...) arrancan y salen volando hacia la cámara, girando; en «septiembre»
//   queda SEPTIEMBRE, enorme. «significa siete»: SEPT se enciende en oro y salta la moneda del 7.
// - «noveno»: la cámara se aleja y las otras once hojas vuelan a su sitio en la pared, cada una con su puesto; el 9
//   de septiembre salta en rojo.
// - Frase 2: en «ocho», «nueve» y «diez», la moneda de octubre, noviembre y diciembre, y su puesto en rojo.
// - «dos»: las cuatro monedas saltan dos hojas atrás y caen sobre el 7, el 8, el 9 y el 10: ahí sí cuadran.
import * as k from "#kit";
import { v } from "#voz";
import { MESES, DORSO, PW, PH, hoja, moneda, chapa } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra } = k;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tsig = f1.t("significa"), Tsiete = f1.t("siete"), Tnov = f1.t("noveno");
const T8 = f2.t("ocho"), T9 = f2.t("nueve"), T10 = f2.t("diez"), Toct = f2.t("octubre"), Tnoviembre = f2.t("noviembre"), Tdic = f2.t("diciembre");
const Tdos = f3.t("dos"), Troma = f3.t("romanos");

const GAP = 70, SEP = 8;
const slot = (i) => [(i % 4) * (PW + GAP), Math.floor(i / 4) * (PH + GAP)];
const COIN = [600, 330], CHAPA = [PW / 2, 600];
const YC = 990;

// la cámara: pegada a SEPTIEMBRE → se aleja hasta ver el año → se acerca a la fila de abajo
const [sx, sy] = slot(SEP);
const CERCA = { s: 1.06, x: sx + PW / 2, y: sy + PH / 2 - 20 };
const ANO = { s: 0.3, x: (4 * PW + 3 * GAP) / 2, y: (3 * PH + 2 * GAP) / 2 - 20 };
const FILA = { s: 0.5 };
const FINAL = { s: 0.325, x: ANO.x, y: sy - GAP / 2 + 120 };
function cam(t) {
  const a = su(tr(t, Tnov - 0.45, Tnov + 0.5));
  let c = { s: Math.exp(mez(Math.log(CERCA.s), Math.log(ANO.s), a)), x: mez(CERCA.x, ANO.x, a), y: mez(CERCA.y, ANO.y, a) };
  // frase 2: la cámara va a cada mes que se nombra, por la fila de abajo
  const b = su(tr(t, Toct - 0.45, Toct + 0.25));
  if (b > 0) {
    const cx = (i) => slot(i)[0] + PW / 2;
    const fx = cx(9) + (cx(10) - cx(9)) * su(tr(t, Tnoviembre - 0.35, Tnoviembre + 0.25)) + (cx(11) - cx(10)) * su(tr(t, Tdic - 0.35, Tdic + 0.25));
    const F = { s: FILA.s, x: fx, y: sy + PH / 2 - 60 };
    c = { s: Math.exp(mez(Math.log(c.s), Math.log(F.s), b)), x: mez(c.x, F.x, b), y: mez(c.y, F.y, b) };
  }
  const d = su(tr(t, T10 + 0.55, Tdos - 0.25));
  if (d > 0) c = { s: Math.exp(mez(Math.log(c.s), Math.log(FINAL.s), d)), x: mez(c.x, FINAL.x, d), y: mez(c.y, FINAL.y, d) };
  // «la culpa es de los...»: se acerca despacio a las monedas que ya cuadran, y para antes del corte
  c.s *= 1 + 0.1 * su(tr(t, salto(3) + SALTO + 0.1, Troma - 0.25));
  return c;
}
const aPant = (c, X, Y) => [540 + c.s * (X - c.x), YC + c.s * (Y - c.y)];

// la pared de la cocina: yeso cálido con su textura, que se aleja con la cámara
// (la textura se pone en espejo en las cuatro esquinas para que se repita sin costuras)
function espejo(src, n) {
  const c = k.lienzo(n * 2, n * 2), x = c.getContext("2d");
  for (const [fx, fy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) { x.save(); x.translate(n, n); x.scale(fx, fy); x.drawImage(src, 0, 0, n, n); x.restore(); }
  return c;
}
const yeso = (() => {
  const c = k.lienzo(1024, 1024), x = c.getContext("2d");
  x.fillStyle = "#d9774a"; x.fillRect(0, 0, 1024, 1024);
  x.globalAlpha = 0.22; x.globalCompositeOperation = "multiply"; x.drawImage(espejo(k.manchas, 512), 0, 0);
  x.globalAlpha = 0.1; x.drawImage(espejo(k.red, 512), 0, 0);
  return c;
})();
function pared(g, c) {
  g.save();
  g.setTransform(c.s, 0, 0, c.s, 540 - c.s * c.x, YC - c.s * c.y);
  g.fillStyle = g.createPattern(yeso, "repeat");
  g.fillRect(c.x - 600 / c.s, c.y - 1100 / c.s, 1200 / c.s, 2200 / c.s);
  g.restore();
  const lg = g.createRadialGradient(260, 380, 80, 420, 760, 1500);
  lg.addColorStop(0, "rgba(255,226,170,0.55)"); lg.addColorStop(0.5, "rgba(255,190,120,0.12)"); lg.addColorStop(1, "rgba(60,15,5,0.55)");
  g.fillStyle = lg; g.fillRect(0, 0, 1080, 1920);
}

// una hoja colgada en la pared, con su anilla
function colgada(g, c, i, X, Y, rot, extra) {
  const [px, py] = aPant(c, X, Y);
  g.save();
  g.translate(px + (c.s * PW) / 2, py); g.rotate(rot); g.scale(c.s, c.s); g.translate(-PW / 2, 0);
  g.save(); g.shadowColor = "rgba(50,10,0,0.45)"; g.shadowBlur = 40; g.shadowOffsetX = 16; g.shadowOffsetY = 26;
  k.redondo(g, 0, 0, PW, PH, 26); g.fillStyle = "#f4efe6"; g.fill(); g.restore();
  extra.debajo?.(g);
  hoja(g, i, extra.oro ?? 0);
  // la anilla de metal
  for (let j = 0; j < 9; j++) {
    const ax = 80 + j * 75;
    g.strokeStyle = "#5d636b"; g.lineWidth = 9; g.beginPath(); g.arc(ax, 14, 20, Math.PI * 1.05, Math.PI * 2.0); g.stroke();
    g.strokeStyle = "#dfe3e8"; g.lineWidth = 4; g.beginPath(); g.arc(ax - 2, 12, 19, Math.PI * 1.15, Math.PI * 1.7); g.stroke();
  }
  extra.encima?.(g);
  g.restore();
}

// las hojas que salen volando del taco
const VUELA = 0.5, SUELTA = (i) => -0.76 + i * 0.1;
function volando(g, c, i, t) {
  const u = (t - SUELTA(i)) / VUELA;
  if (u <= 0 || u >= 1) return;
  const lado = i % 2 ? 1 : -1;
  const [px, py] = aPant(c, sx + PW / 2, sy + PH / 2);
  const S = c.s * (1 + 0.4 * u * u), inc = 1 - 0.3 * Math.sin(Math.PI * Math.min(1, u * 1.4));
  g.save();
  g.globalAlpha = 1 - su(tr(u, 0.75, 1));
  g.translate(px + lado * 1300 * Math.pow(u, 1.3), py + 120 * u - 380 * u * u);
  g.rotate(lado * (0.3 * u + 0.5 * u * u));
  g.scale(S, S * inc);
  g.translate(-PW / 2, -PH / 2);
  g.save(); g.shadowColor = "rgba(40,10,0,0.4)"; g.shadowBlur = 50; g.shadowOffsetY = 40;
  k.redondo(g, 0, 0, PW, PH, 26); g.fillStyle = "#f4efe6"; g.fill(); g.restore();
  hoja(g, i);
  g.fillStyle = `rgba(30,10,0,${0.25 * (1 - inc) / 0.3})`; k.redondo(g, 0, 0, PW, PH, 26); g.fill();
  g.restore();
}

// las once hojas que llegan a la pared al alejarse
const azL = k.azar(909);
const LLEGA = MESES.map((_, i) => {
  if (i === SEP) return null;
  const [x, y] = slot(i), d = Math.hypot(x - sx, y - sy);
  return { d, dx: (x - sx) / (d || 1), dy: (y - sy) / (d || 1), rot: (azL() - 0.5) * 1.2 };
});
const orden = LLEGA.map((l, i) => [l ? l.d : -1, i]).filter((a) => a[0] >= 0).sort((a, b) => a[0] - b[0]).map((a) => a[1]);
const tLlega = {}; orden.forEach((i, r) => { tLlega[i] = Tnov - 0.4 + r * 0.045; });

// las monedas: lo que dice el nombre de cada mes
const MON = { 8: { n: 7, t: Tsiete - 0.08 }, 9: { n: 8, t: T8 - 0.05 }, 10: { n: 9, t: T9 - 0.05 }, 11: { n: 10, t: T10 - 0.05 } };
const ROJO = { 8: Tnov, 9: T8, 10: T9, 11: T10 };
const NOMBRE = { 9: Toct, 10: Tnoviembre, 11: Tdic };
const salto = (j) => Tdos - 0.2 + j * 0.08;
const SALTO = 0.5;

export function dibuja(g, t) {
  const c = cam(t);
  pared(g, c);
  // el resto del taco, debajo de SEPTIEMBRE, mientras está en el taco
  const taco = 1 - su(tr(t, Tnov - 0.45, Tnov - 0.1));
  // las hojas de la pared
  for (let i = 0; i < 12; i++) {
    const [X, Y] = slot(i);
    let px = X, py = Y, rot = 0;
    if (i !== SEP) {
      const u = entra(tr(t, tLlega[i], tLlega[i] + 0.42));
      if (u <= 0) continue;
      const L = LLEGA[i], lejos = 2600 * (1 - u);
      px = X + L.dx * lejos; py = Y + L.dy * lejos - 400 * (1 - u); rot = L.rot * (1 - u);
    } else if (t > 0.15) {
      // la hoja se queda columpiándose en su clavo después del tirón
      const e = t - 0.15; rot = 0.07 * Math.exp(-e * 2.2) * Math.sin(e * 8.5);
    }
    const tm = i === SEP && t < SUELTA(SEP - 1) ? SEP - 1 : i;
    const posicion = i + 1;
    const nace = i === SEP ? su(tr(t, Tnov - 0.12, Tnov + 0.12)) : su(tr(t, tLlega[i] + 0.3, tLlega[i] + 0.5));
    const rojo = ROJO[i] !== undefined ? su(tr(t, ROJO[i] - 0.05, ROJO[i] + 0.2)) * (1 - su(tr(t, salto(i - 8) + SALTO, salto(i - 8) + SALTO + 0.3))) : 0;
    const pop = ROJO[i] !== undefined ? k.pulso(t, ROJO[i] + 0.12, 0.12) : 0;
    const lev = NOMBRE[i] !== undefined ? k.pulso(t, NOMBRE[i] + 0.25, 0.35) : 0;
    const oro = MON[i] ? su(tr(t, (i === SEP ? Tsig : NOMBRE[i]) - 0.05, MON[i].t + 0.1)) : 0;
    // la moneda que cae aquí al saltar
    const llegaAqui = [6, 7, 8, 9].indexOf(i);
    const flash = llegaAqui >= 0 ? k.pulso(t, salto(llegaAqui) + SALTO, 0.12) : 0;
    colgada(g, c, tm, px, py - lev * 40, rot, {
      oro,
      debajo: i === SEP && taco > 0 ? (gg) => {
        for (let j = 5; j >= 1; j--) { gg.globalAlpha = taco; k.redondo(gg, 0, j * 7, PW, PH, 26); gg.fillStyle = j % 2 ? "#e2dacb" : "#cfc5b3"; gg.fill(); }
        gg.globalAlpha = 1;
      } : null,
      encima: (gg) => {
        chapa(gg, CHAPA[0], CHAPA[1], 150, posicion, rojo, nace, pop);
        if (flash > 0.01) { gg.save(); gg.globalCompositeOperation = "lighter"; k.brillo(gg, COIN[0], COIN[1], 520, "255,200,80", 0.8 * flash); gg.restore(); }
      },
    });
  }
  // las monedas, encima de todo (saltan de una hoja a otra)
  for (const i of [8, 9, 10, 11]) {
    const m = MON[i], u = tr(t, m.t, m.t + 0.35);
    if (u <= 0) continue;
    const [X, Y] = slot(i), [X2, Y2] = slot(i - 2);
    const h = tr(t, salto(i - 8), salto(i - 8) + SALTO), hs = su(h);
    const wx = mez(X, X2, hs) + COIN[0], wy = mez(Y, Y2, hs) + COIN[1] - 700 * Math.sin(Math.PI * hs);
    const [mx, my] = aPant(c, wx, wy);
    moneda(g, mx, my, 120 * c.s * (1 + 0.25 * Math.sin(Math.PI * hs)), m.n, u);
  }
  // las hojas que vuelan, de la de abajo a la de arriba
  for (let i = SEP - 1; i >= 0; i--) volando(g, c, i, t);
  // velo arriba para el subtítulo
  const vg = g.createLinearGradient(0, 240, 0, 620); vg.addColorStop(0, "rgba(40,10,0,0.5)"); vg.addColorStop(1, "rgba(40,10,0,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
