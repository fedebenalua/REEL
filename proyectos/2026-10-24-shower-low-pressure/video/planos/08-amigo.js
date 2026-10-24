// «Send this to that friend whose shower barely dribbles.»
// Acaba en el mismo tubo del fotograma 0.
import * as k from "#kit";
import { v } from "#voz";
import { ducha, tubo } from "../ducha.js";
import { camara, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = "Send";
export const entrada = "corte";

const f = v.frase(13);
const Tfriend = f.t("friend");
const Tdrib = f.t("dribbles");
const fin = v.duracion;
const CAM = [
  [f.inicio, { x: 0, y: 20, s: 1.2 }],
  [Tfriend, { x: 0, y: 10, s: 1.45 }],
  [Tdrib, { x: 40, y: 30, s: 2.4 }],
  [fin, { x: 70, y: 40, s: 3.1 }],
];

export function dibuja(g, t) {
  const dentro = k.suave(k.tramo(t, Tfriend + 0.05, Tdrib + 0.15));
  const acerca = k.mez(0.72, 0.5, k.suave(k.tramo(t, Tdrib, Math.min(fin - 0.15, Tdrib + 0.7))));
  if (dentro < 0.995) {
    g.save();
    g.globalAlpha = 1 - dentro;
    camara(g, rutaCam(t, CAM));
    ducha(g, t, { costra: 1, goteo: 1, palanca: 1 });
    g.restore();
  }
  if (dentro > 0.02) {
    g.save();
    g.globalAlpha = dentro;
    tubo(g, t, acerca);
    g.restore();
  }
  viñeta(g, 0.42);
  velo(g, 0.7);
}
