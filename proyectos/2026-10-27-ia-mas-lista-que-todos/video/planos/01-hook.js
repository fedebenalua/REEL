// «¿Podría una inteligencia artificial llegar a ser más inteligente que todos los humanos juntos?»
// Un solo mundo: el chip de la IA flota sobre el mar de luces de la humanidad.
// - Fotograma 0: la cámara vuela a ras del chip, entre pistas por las que corren pulsos de luz cian, hacia el núcleo.
// - «llegar a ser»: sube y se aleja hasta ver el chip entero; «más inteligente»: el núcleo estalla de luz.
// - «que todos los humanos»: la cámara sube más y se aleja: debajo, un mar de luces doradas hasta el horizonte
//   («+8.000 millones»). «juntos»: las luces suben en ríos y forman un cerebro de oro enorme, frente al chip.
import * as k from "#kit";
import { v } from "#voz";
import { CEREBRO, CIELO, MAR, cerebro, chip, enCerebro, mar, velo } from "../mundo.js";

export const desde = 0;

const { suave, tramo } = k;
const f1 = v.frase(1);
const Tlle = f1.t("llegar"), Tint = f1.t("inteligente"), Tque = f1.t("que"), Ttod = f1.t("todos"), Thum = f1.t("humanos"), Tjun = f1.t("juntos");

export const C = [0, 0, 0], B = [0, 12, -100], RB = 40;
export const angB = (t) => 1.5 - 0.05 * t;

const camara = k.ruta([
  [0, { pos: [0.6, 0.45, 9.8], mira: [0.2, -0.15, 3] }],
  [Tlle - 0.1, { pos: [0, 1.9, 7.6], mira: [0, -0.1, 0] }],
  [Tint + 0.1, { pos: [0, 11, 15], mira: [0, -0.5, 0] }],
  [Tjun + 0.1, { pos: [0, 38, 70], mira: [0, -2, -60] }],
  [f1.fin + 0.4, { pos: [0, 39, 72], mira: [0, -2, -60] }],
]);

// cada punto del cerebro sale de una luz del mar que se ve desde la cámara final
const VISIBLES = MAR.filter((s) => s.p[2] > -420 && s.p[2] < 30 && Math.abs(s.p[0]) < 260);
const az = k.azar(5150);
const VUELO = CEREBRO.map(() => ({ s: VISIBLES[Math.floor(az() * VISIBLES.length)].p, d: az() * 0.6, h: 25 + az() * 35 }));
const T0 = Ttod - 0.3, DUR = 0.9;
export function posVuelo(i, t) {
  const fv = VUELO[i], u = tramo(t, T0 + fv.d, T0 + fv.d + DUR), e = suave(u), dest = enCerebro(CEREBRO[i].p, B, RB, angB(t));
  return [k.mez(fv.s[0], dest[0], e), k.mez(fv.s[1], dest[1], e) + Math.sin(Math.PI * u) * fv.h, k.mez(fv.s[2], dest[2], e)];
}

export function dibuja(g, t) {
  const cam = camara(t);
  k.fondo(g, cam);
  k.estrellas(g, cam, null, CIELO, 0.8);
  mar(g, cam, t);
  // el cerebro de la humanidad, que se forma con las luces que suben
  if (t > T0) cerebro(g, cam, B, RB, angB(t), t, { pos: (i) => posVuelo(i, t), enlaces: suave(tramo(t, Tjun - 0.1, Tjun + 0.4)), nucleo: suave(tramo(t, Tjun - 0.2, Tjun + 0.5)) });
  // el chip
  const luz = 1 + 1.6 * suave(tramo(t, Tint - 0.1, Tint + 0.15)) * (1 - 0.6 * suave(tramo(t, Tint + 0.3, Tque + 0.3)));
  chip(g, cam, C, t, { luz });
  const N = k.proyecta(cam, C);
  if (N) k.fogonazo(g, N.x, N.y, t - Tint + 0.02, 900, "150,230,255");
  // la cifra de la humanidad
  k.pastilla(g, 540, 1350, "+8.000", "millones", "255,205,120", suave(tramo(t, Thum - 0.1, Thum + 0.2)), 88);
  velo(g);
}
