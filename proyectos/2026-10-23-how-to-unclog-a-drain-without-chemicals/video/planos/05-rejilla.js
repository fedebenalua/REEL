// La rejilla para el pelo que viene después.
import * as k from "#kit";
import { v } from "#voz";
import { lavabo } from "../lavabo.js";
import { camara, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = "strainer";

const f9 = v.frase(9);
const Tstr = f9.t("strainer"), Tcatch = f9.t("catches"), Thair = f9.t("hair");

const CAM = [
  [Tstr, { x: 540, y: 1080, s: 1.28 }],
  [Tcatch, { x: 540, y: 1160, s: 1.55 }],
  [f9.fin, { x: 540, y: 1180, s: 1.62 }],
];

export function dibuja(g, t) {
  const colador = k.suave(k.tramo(t, Tstr - 0.12, Tstr + 0.4));
  const mechón = k.suave(k.tramo(t, Tcatch - 0.05, Thair + 0.15));
  g.save();
  camara(g, rutaCam(t, CAM));
  lavabo(g, t, { nivel: 0.28, derrame: 0, grifo: 0.4, colador, mechón, dentro: 0 });
  g.restore();
  velo(g, 0.55);
  viñeta(g, 0.32);
}
