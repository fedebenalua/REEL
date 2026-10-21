// «En tu salón hay mucha más luz: la lámpara, la ventana, el sol.»
// «Pero la tele solo hace caso a la luz que parpadea a ese ritmo, y el resto lo ignora.»
// «Por eso encender la lámpara no te cambia de canal.»
// El salón de noche, con una sola cámara. Se entra con un corte en «En».
// - «lámpara»: la lámpara se enciende fuerte; «ventana»: por la ventana se hace de día; «sol»: entran los rayos.
// - «Pero la tele»: la cámara entra hasta el ojito de la tele. Le llega la luz amarilla de la lámpara y del sol y
//   rebota; «parpadea»: llegan los destellos morados y el ojito se enciende; «ignora»: la amarilla sigue rebotando.
// - «Por eso»: la cámara sale; la lámpara se apaga y en «lámpara» se enciende de golpe; la tele sigue igual.
import * as k from "#kit";
import { v } from "#voz";
import { TV, destello, ojito, pr, salon, velo } from "../mundo.js";

const { suave: su, tramo: tr, mez, azar } = k;
const f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8);
export const desde = (vz) => vz.frase(6).inicio;
const Tlam = f6.t("lampara"), Tven = f6.t("ventana"), Tsol = f6.t("sol");
const T7 = f7.inicio, Tpar = f7.t("parpadea"), Trit = f7.t("ritmo"), Tign = f7.t("ignora");
const T8 = f8.inicio, Tenc = f8.t("encender"), Tlam2 = f8.t("lampara"), Fin = v.frase(9).inicio;
export const enciende = Tlam2 - 0.05;

const LEJOS = { x: 40, y: -40, z: -1.2 }, CERCA = { x: 0, y: TV.Y + TV.H / 2 - 60, z: 7.4 }, SALIDA = { x: -120, y: -60, z: 0.2 };
function camara(t) {
  const a = su(tr(t, T7 - 0.05, T7 + 0.95)), b = su(tr(t, T8 - 0.05, Tenc + 0.2));
  const m = (p, q, u) => ({ x: mez(p.x, q.x, u), y: mez(p.y, q.y, u), z: mez(p.z, q.z, u) });
  return m(m(LEJOS, CERCA, a), SALIDA, b);
}

// la luz amarilla: corre hacia el ojito, choca y rebota
const azL = azar(55);
const AMARILLA = Array.from({ length: 34 }, (_, i) => ({ te: T7 + 0.6 + i * 0.13, desde: azL() < 0.5 ? -1 : 1, dy: azL() - 0.5, col: azL() < 0.5 ? "255,200,90" : "255,235,160" }));
function amarilla(g, o, t) {
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (const p of AMARILLA) {
    const u = (t - p.te) / 0.55; if (u < 0 || u > 2) continue;
    const ax = o.x + p.desde * 700, ay = o.y - 300 + p.dy * 500;
    let x, y, al;
    if (u < 1) { x = mez(ax, o.x, u); y = mez(ay, o.y, u); al = Math.min(1, u * 5); }
    else { const w = u - 1; x = o.x + p.desde * 380 * w; y = o.y - 120 * w - 300 * w * w + p.dy * 200 * w; al = 1 - w; }
    k.brillo(g, x, y, 130, p.col, 0.9 * al);
  }
  g.restore();
}
const MORADOS = []; for (let te = Tpar - 0.5; te < T8 - 0.6; te += 0.13) MORADOS.push(te);

export function dibuja(g, t) {
  const cam = camara(t);
  const lampara = Math.max(mez(0.45, 1.4, su(tr(t, Tlam - 0.1, Tlam + 0.2))) * (1 - su(tr(t, T8, T8 + 0.25))), 1.2 * su(tr(t, enciende, enciende + 0.08)));
  const ventana = su(tr(t, Tven - 0.1, Tven + 0.3)) * (1 - su(tr(t, T7 + 0.8, T8 - 0.2)));
  salon(g, cam, t, { encendida: 1, canal: 0, lampara, ventana, ojito: 0 });
  // el sol: rayos que entran en diagonal
  const sol = su(tr(t, Tsol - 0.1, Tsol + 0.35)) * (1 - su(tr(t, T7, T7 + 0.6)));
  if (sol > 0) { k.rayos(g, t, 1920, sol * 1.4, 7, "255,225,150"); k.brillo(g, 1000, 300, 1600, "255,220,150", 0.35 * sol); }
  // «encender la lámpara»: un golpe de luz
  const la = pr(cam, -470, -120, 12);
  if (la) k.fogonazo(g, la.x, la.y, (t - enciende) * 1.4, 900, "255,200,120");
  // cerca del ojito: la amarilla rebota, la morada entra
  const o = ojito(cam);
  if (o && t < T8 + 0.6) {
    amarilla(g, o, t);
    for (const te of MORADOS) destello(g, { x: 540, y: 2000 }, o, (t - te) / 0.6, 140);
    const enc = su(tr(t, Tpar - 0.05, Tpar + 0.15)) * (1 - su(tr(t, T8 - 0.6, T8 - 0.3)));
    if (enc > 0) k.brillo(g, o.x, o.y, 200 * o.s, "255,60,200", enc * (0.7 + 0.3 * Math.sin(t * 30)));
  }
  velo(g, 0.45);
}

export const momentos = { lampara: Tlam, ventana: Tven, sol: Tsol, enciende };
