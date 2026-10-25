// «Send this to that friend whose toilet is clogged, with no plunger.»
import * as k from "#kit";
import { v } from "#voz";
import { rutaCam, camara, fondo, taza, velo, viñeta } from "../mundo.js";

const f12 = v.frase(12);
const Tfriend = f12.t("friend");
const Tplug = f12.t("plunger");

export const desde = (voz) => voz.frase(12).inicio - 0.04;
export const entrada = "corte";

const CAMS = [
  [f12.inicio, { x: 55, y: 50, s: 1.05 }],
  [Tfriend, { x: 60, y: 60, s: 1.4 }],
  [Tplug, { x: 60, y: 70, s: 2.15 }],
  [v.duracion, { x: 60, y: 78, s: 2.85 }],
];

export function dibuja(g, t) {
  const cam = rutaCam(t, CAMS);
  g.save();
  camara(g, cam);
  fondo(g);
  taza(g, t, 60, 10, 1, { nivel: 0.34, rebose: 0, quieto: 1, maneta: 0 });
  g.restore();
  viñeta(g, 0.38);
  velo(g, 0.72);
}
