// «Te han dicho que en la cabeza te caben siete cosas a la vez. Como si tuvieras siete cajones, y ni uno más.»
// Fotograma 0: la cabeza ya llena la pantalla y las cosas entran desde fuera, enormes, cada una a su sitio.
import * as k from "#kit";
import { v } from "#voz";
import { cabeza, cajon, cosa, fondo, octava, velo, RGB } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra, proyecta, tamano, ruta, deLejosACerca, fogonazo, F } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tcab = f1.t("cabeza"), Tsie = f1.t("siete"), Tcaj = f2.t("cajones"), Tmas = f2.t("mas"), Fin = f2.fin;

const SLOTS = [
  [-0.95, 0.62, 0.02],
  [0, 0.78, 0.12],
  [0.95, 0.62, 0.02],
  [-1.2, -0.22, 0],
  [-0.4, -0.38, 0.1],
  [0.4, -0.38, 0.1],
  [1.2, -0.22, 0],
];
const llega = (i) => 0.05 + i * 0.25;

function posCosa(i, t) {
  const d = SLOTS[i];
  const lado = d[0] === 0 ? 0 : Math.sign(d[0]);
  const o = [d[0] + lado * 2.4, d[1] + 1.35, 1.7];
  const u = entra(tr(t, -0.2, llega(i)));
  const caj = su(tr(t, Tcaj + 0.05, Tcaj + 0.62));
  return [mez(o[0], d[0], u), mez(o[1], d[1] - caj * 0.22, u), mez(o[2], d[2] - caj * 0.25, u)];
}

function posCajon(i, t) {
  const d = SLOTS[i];
  const sube = entra(tr(t, Tcaj - 0.28, Tcaj + 0.28));
  return [d[0], mez(d[1] - 1.6, d[1] - 0.28, sube), 0.28];
}

function posZapato(t) {
  const u = entra(tr(t, Tmas - 0.48, Tmas + 0.02));
  const reb = su(tr(t, Tmas + 0.02, Tmas + 0.48));
  return [mez(2.6, 0.55, u) + reb * 2.2, mez(0.9, -0.15, u) - reb * 0.2 + Math.sin(u * Math.PI) * 0.25, mez(1.1, 0.35, u)];
}

const cam = ruta([
  [0, { pos: [0, 0.15, 4.5], mira: [0, 0.12, 0] }],
  [Tcab, { pos: [0, 0.1, 3.35], mira: [0, 0.08, 0] }],
  [Tsie + 0.3, { pos: [0, 0.05, 3.05], mira: [0, 0.05, 0] }],
  [Tcaj, { pos: [0, -0.02, 3.25], mira: [0, 0.02, 0] }],
  [Fin + 0.15, { pos: [0, 0.0, 3.3], mira: [0, 0.02, 0] }],
]);

export function dibuja(g, t) {
  fondo(g, t);
  const c = cam(t);
  const centro = proyecta(c, [0, 0.05, -0.55]);
  if (centro) cabeza(g, centro.x, centro.y + 40, (F * 2.15) / centro.z, 1);
  const capas = [];
  const cajonesYa = su(tr(t, Tcaj - 0.28, Tcaj + 0.2));
  for (let i = 0; i < 7; i++) {
    if (cajonesYa > 0.02) {
      const pc = proyecta(c, posCajon(i, t));
      if (pc) {
        const sc = tamano(0.34, pc.z);
        const abierto = 1 - su(tr(t, Tcaj + 0.15, Tcaj + 0.55));
        capas.push({ z: pc.z, dibuja: () => cajon(g, pc.x, pc.y, sc, RGB[i], abierto * 0.85) });
      }
    }
    const p = proyecta(c, posCosa(i, t));
    if (!p) continue;
    const trago = su(tr(t, Tcaj + 0.2, Tcaj + 0.62));
    const s = tamano(0.3, p.z) * (1 - trago * 0.72);
    const j = i;
    if (s > 10) capas.push({ z: p.z - 0.04, dibuja: () => cosa(g, j, p.x, p.y, s) });
    const golpe = k.pulso(t, llega(i), 0.06);
    if (golpe > 0.08) capas.push({ z: p.z - 0.2, dibuja: () => fogonazo(g, p.x, p.y, golpe * 0.7, 280, RGB[i]) });
  }
  if (t > Tmas - 0.5 && t < Tmas + 0.62) {
    const p = proyecta(c, posZapato(t));
    if (p) {
      const s = tamano(0.34, p.z);
      capas.push({ z: p.z - 0.08, dibuja: () => octava(g, p.x, p.y, s) });
      const golpe = k.pulso(t, Tmas + 0.02, 0.07);
      if (golpe > 0.08) capas.push({ z: 0.01, dibuja: () => fogonazo(g, p.x, p.y, golpe, 420, "255,90,190") });
    }
  }
  deLejosACerca(capas);
  velo(g);
}
