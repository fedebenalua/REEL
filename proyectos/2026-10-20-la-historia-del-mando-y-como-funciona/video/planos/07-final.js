// «La tele lo lee y obedece. Más de setenta años de inventos para no levantarte del sofá.»
// «Envíaselo a ese amigo que nunca suelta el mando.»
// El salón de ahora. Se entra con un corte en «La».
// - «La tele lo lee y obedece»: del mando salen destellos, el ojito de la tele se enciende y en «obedece» cambia de
//   canal.
// - «Más de setenta años de inventos»: por arriba pasan en fila los mandos de la historia, con su año: 1950, 1955,
//   1956 y hoy.
// - «no levantarte del sofá»: la cámara se aleja. «Envíaselo a ese amigo»: otro destello, otro canal.
import * as k from "#kit";
import { v } from "#voz";
import { MANDO, destello, mando, ojito, punta, salon, velo } from "../mundo.js";
import { mando1950, mandoHoy } from "../gala.js";
import { linterna, martillito } from "../hist.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f9 = v.frase(9), f10 = v.frase(10);
export const desde = (vz) => vz.frase(9).inicio;
const T0 = f9.inicio, Tlee = f9.t("lee"), Tobe = f9.t("obedece"), Tmas = f9.t("mas"), Tinv = f9.t("inventos"), Tlev = f9.t("levantarte");
const T10 = f10.inicio, Tami = f10.t("amigo"), Tman = f10.t("mando"), Fin = v.duracion;
const SALIDAS = []; for (let te = T0 - 0.1; te < Tobe - 0.2; te += 0.13) SALIDAS.push(te); for (let te = Tami - 0.4; te < Tami + 0.1; te += 0.13) SALIDAS.push(te); for (let te = Tman - 0.5; te < Tman; te += 0.13) SALIDAS.push(te);

export function dibuja(g, t) {
  const lejos = su(tr(t, Tlev - 0.3, T10 + 0.3));
  const cerca = su(tr(t, Tmas - 0.2, Tinv)) * (1 - su(tr(t, Tlev, Tlev + 0.5)));
  const cam = { x: 0, y: mez(0, 40, lejos) - 220 * cerca, z: mez(0.3, -0.8, lejos) + 3.2 * cerca + 0.25 * su(tr(t, T10, Fin)) };
  salon(g, cam, t, { encendida: 1, canal: 1 + su(tr(t, Tobe, Tobe + 0.4)) + su(tr(t, Tami + 0.2, Tami + 0.6)) + su(tr(t, Tman + 0.1, Tman + 0.5)), ojito: Math.max(su(tr(t, Tlee - 0.2, Tlee)) * (1 - su(tr(t, Tobe + 0.2, Tobe + 0.5))), k.pulso(t, Tami + 0.1, 0.2)) });
  const led = SALIDAS.reduce((m, te) => Math.max(m, k.pulso(t, te, 0.03)), 0);
  mando(g, cam, t, { led });
  const a = punta(cam), b = ojito(cam);
  if (a && b) for (const te of SALIDAS) destello(g, a, b, (t - te) / 0.5, 100);
  // los mandos de la historia, en fila
  const FILA = [
    ["1950", (x, y) => mando1950(g, x, y, 90, -0.1)],
    ["1955", (x, y) => { g.save(); g.translate(x, y); g.scale(-1, 1); linterna(g, 0, 0, 0.22, -0.9); g.restore(); }],
    ["1956", (x, y) => martillito(g, x, y, 100, t)],
    ["hoy", (x, y) => mandoHoy(g, x, y, 60, 0)],
  ];
  const fila = su(tr(t, Tmas - 0.2, Tinv + 0.2)) * (1 - su(tr(t, Tami + 0.6, Fin - 0.3)));
  if (fila > 0) {
    g.save(); g.globalAlpha = fila;
    k.redondo(g, 40, 560, 1000, 330, 30); g.fillStyle = "rgba(10,8,20,0.6)"; g.fill();
    FILA.forEach(([ano, dib], i) => {
      const ap = entra(tr(t, Tmas - 0.2 + i * 0.25, Tmas + 0.15 + i * 0.25)), x = 160 + i * 253, y = 700 + 200 * (1 - ap) - 16 * Math.abs(Math.sin(t * 4 + i));
      g.save(); g.globalAlpha = fila * ap; dib(x, y); g.restore();
      k.pastilla(g, x, 840, ano, "", "255,215,140", fila * ap, 44);
    });
    g.restore();
  }
  velo(g, 0.5);
}

export const momentos = { obedece: Tobe, amigo: Tami };
