// «That black line...» «A wipe...» «Water sits in the seam...»
// Fotograma 0: el cordón enorme, el moho ya grande. Luego la esponja, el núcleo negro y el corte.
import * as k from "#kit";
import { v } from "#voz";
import { escenaCostura, estadoCero, rutaCam, velo, viñeta } from "../mundo.js";
import { esponja } from "../utiles.js";

export const desde = 0;
export const entrada = "corte";

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tmold = f1.t("mold");
const Twipe = f2.t("wipe");
const Tsurf = f2.t("surface");
const Tinside = f2.t("inside");
const Tstays = f2.finDe("stays");
const Twater = f3.t("water");
const Tgrows = f3.t("grows");
const Tdown = f3.t("down");
const Tthru = f3.finDe("it");
const Tfin = v.frase(4).inicio;

const CAM = [
  [0, { x: 20, y: 20, s: 1.72 }],
  [0.7, { x: -30, y: 10, s: 2.05 }],
  [Tmold, { x: 10, y: 16, s: 1.92 }],
  [Twipe, { x: -80, y: 6, s: 1.7 }],
  [Tsurf, { x: 60, y: 0, s: 1.74 }],
  [Tinside, { x: 0, y: 8, s: 1.9 }],
  [Twater, { x: 140, y: 10, s: 1.24 }],
  [Tgrows, { x: 150, y: 20, s: 1.32 }],
  [Tdown, { x: 110, y: 150, s: 1.7 }],
  [Tthru + 0.05, { x: 100, y: 190, s: 1.78 }],
  [Tfin, { x: 100, y: 190, s: 1.78 }],
];

export function dibuja(g, t) {
  const cero = estadoCero();
  const e = {
    ...cero,
    cam: rutaCam(t, CAM),
    moho: k.mez(cero.moho, 1, k.entra(k.tramo(t, 0, Tmold))),
    gota: k.tramo(t, 0.08, 0.7),
    limpio: k.suave(k.tramo(t, Twipe + 0.05, Tsurf + 0.35)),
    abierto: k.suave(k.tramo(t, Tinside + 0.02, Tstays + 0.45)),
    seccion: k.suave(k.tramo(t, Tstays + 0.15, Twater + 0.9)),
    raices: k.suave(k.tramo(t, Tgrows - 0.08, Tdown + 0.5)),
  };
  const uEsp = k.tramo(t, Twipe - 0.28, Tinside + 0.22);
  const alEsp = uEsp <= 0 ? 0 : uEsp < 0.12 ? uEsp / 0.12 : uEsp > 0.78 ? Math.max(0, 1 - (uEsp - 0.78) / 0.22) : 1;
  if (alEsp > 0.02 && e.seccion < 0.35) {
    e.extra = (gg) => esponja(gg, k.mez(-780, 820, k.entra(Math.min(1, uEsp))), -24, -0.15, 1.45, alEsp);
  }
  escenaCostura(g, t, e);
  viñeta(g, 0.4);
  velo(g, 0.8);
}
