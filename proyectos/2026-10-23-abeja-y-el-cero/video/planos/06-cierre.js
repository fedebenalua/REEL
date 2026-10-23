// El cierre: otra vez el prado, la carta del cero, y ella echa a volar.
import * as k from "#kit";
import { v } from "#voz";
import { FLORES, abeja, carta, flor, prado, velo } from "../mundo.js";

export const desde = "enviaselo";
export const entrada = "corte";

const { proyecta, tamano, suave: su, tramo: tr, mez } = k;
const f15 = v.frase(15);
const Tpiensa = f15.t("piensa");
const Fin = v.duracion;

const cam = k.ruta([
  [f15.inicio - 0.2, { pos: [0.12, 0.12, 2.9], mira: [0.12, 0, 0] }],
  [Tpiensa - 0.15, { pos: [0.08, 0.16, 3.5], mira: [0.1, 0.02, 0] }],
  [Fin, { pos: [0, 0.5, 8.5], mira: [0.15, 0.08, 1.5] }],
]);

export function dibuja(g, t) {
  const c = cam(t);
  prado(g, t, 1);
  const despega = su(tr(t, Tpiensa - 0.08, Tpiensa + 0.45));
  const cosas = [];
  for (const f of FLORES) {
    const p = proyecta(c, [f.x, f.y, f.z]);
    if (!p) continue;
    const r = tamano(f.r, p.z);
    if (r < 8 || r > 1200) continue;
    cosas.push({ z: p.z, dibuja: () => flor(g, p.x, p.y, r, f.tono, f.fase + t * 0.2) });
  }
  const pC = proyecta(c, [0.15, 0, 0]);
  if (pC) {
    const w = tamano(1.8, pC.z);
    cosas.push({
      z: pC.z + 0.2,
      dibuja: () => carta(g, pC.x, pC.y, w, w * 1.28, 0, { cero: 1 }),
    });
  }
  const bz = mez(0.55, 4.2, despega);
  const by = mez(0.02, 0.45, despega);
  const pb = proyecta(c, [0.15, by, bz]);
  if (pb) {
    const largo = tamano(1.1, pb.z);
    cosas.push({
      z: pb.z,
      dibuja: () => abeja(g, pb.x, pb.y, Math.max(40, largo), t, { vuelo: 0.15 + despega * 0.85, rumbo: -0.5 * despega, mira: 1 }),
    });
  }
  k.deLejosACerca(cosas);
  velo(g, 0.7);
}
