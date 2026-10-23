// El prado otra vez: cuanto más grande es el otro número, más clara es la elección.
import * as k from "#kit";
import { v } from "#voz";
import { FLORES, abeja, carta, flor, prado, velo } from "../mundo.js";

export const desde = "cuanto";
export const entrada = "corte";

const { suave: su, tramo: tr, mez, proyecta, tamano } = k;
const f8 = v.frase(8);
const f9 = v.frase(9);
const f10 = v.frase(10);
const Tgran = f8.t("grande");
const Tnum = f8.t("numero");
const Tclara = f8.t("clara");
const Tense = f9.t("ensenado");
const Tnueva = f10.t("nueva");
const Tmir = f10.t("miraron");
const Fin = f10.fin;

const cam = k.ruta([
  [f8.inicio - 0.2, { pos: [0.15, 0.35, 5.6], mira: [0.1, 0.05, 0] }],
  [Tclara, { pos: [0.55, 0.2, 4.2], mira: [0.7, 0, 0] }],
  [Tense, { pos: [0.1, 0.45, 6.4], mira: [0, 0.15, 0] }],
  [Fin - 0.2, { pos: [0.15, 0.4, 6.1], mira: [0.05, 0.1, 0] }],
]);

export function dibuja(g, t) {
  const c = cam(t);
  prado(g, t, 0.9);
  const cosas = [];
  for (const f of FLORES) {
    if (f.z < 2 || f.z > 12) continue;
    const p = proyecta(c, [f.x, f.y - 0.4, f.z]);
    if (!p) continue;
    const r = tamano(f.r * 0.8, p.z);
    if (r < 10 || r > 900) continue;
    cosas.push({ z: p.z, dibuja: () => flor(g, p.x, p.y, r, f.tono, f.fase) });
  }

  const crece = su(tr(t, Tgran, Tnum + 0.45));
  const nPuntos = Math.round(mez(1, 6, crece));
  const duda = 1 - su(tr(t, Tclara - 0.15, Tclara + 0.4));
  const ox = Math.sin(t * 7) * 0.18 * duda;

  // mazo de entrenamiento, detrás
  const mazo = su(tr(t, f9.inicio, Tense + 0.15));
  const mazos = [2, 3, 4, 5];
  mazos.forEach((n, i) => {
    const x = -1.55 + i * 0.72;
    const z = 1.4;
    const p = proyecta(c, [x, 0.85, z]);
    if (!p || mazo < 0.02) return;
    const w = tamano(0.85, p.z);
    cosas.push({
      z: p.z,
      dibuja: () => carta(g, p.x, p.y, w, w * 1.3, n, { al: mazo, rot: (i - 1.5) * 0.06, forma: 1 }),
    });
  });

  const pV = proyecta(c, [0.85, 0, 0]);
  const pN = proyecta(c, [-0.7 - crece * 0.15, 0, 0]);
  if (pN) {
    const w = tamano(1.35 + crece * 0.25, pN.z);
    cosas.push({ z: pN.z, dibuja: () => carta(g, pN.x, pN.y, w, w * 1.32, nPuntos, { forma: 0 }) });
  }
  if (pV) {
    const w = tamano(1.45, pV.z);
    cosas.push({ z: pV.z - 0.01, dibuja: () => carta(g, pV.x, pV.y, w, w * 1.32, 0, {}) });
  }

  const bx = mez(-0.05, 0.85, 1 - duda) + ox;
  const bz = 0.7;
  const pb = proyecta(c, [bx, 0.15, bz]);
  if (pb) {
    const largo = tamano(1.05, pb.z);
    const vuelo = duda > 0.2 ? 1 : 0.12;
    cosas.push({
      z: pb.z,
      dibuja: () => abeja(g, pb.x, pb.y, largo, t, { vuelo, rumbo: duda > 0.2 ? Math.sin(t * 6) * 0.4 : 0.05, mira: 1 }),
    });
  }

  k.deLejosACerca(cosas);

  // el brillo de «carta nueva» que se apaga: no es por eso
  const br = k.pulso(t, Tnueva + 0.12, 0.16) * (1 - su(tr(t, Tmir - 0.05, Tmir + 0.25)));
  if (br > 0.02 && pV) {
    g.save();
    g.globalCompositeOperation = "lighter";
    k.brillo(g, pV.x, pV.y, tamano(2.2, pV.z), "255,255,255", br);
    g.restore();
  }
  velo(g, 0.68);
}
