// «Open the sink. If that blasts, the clog is in the showerhead.»
import * as k from "#kit";
import { v } from "#voz";
import { camara, rutaCam, velo, viñeta } from "../mundo.js";
import { pila } from "../piezas.js";

export const desde = "Open";
export const entrada = "corte";

const f = v.frase(3);
const Tblast = f.t("blasts");
const fin = v.frase(4).inicio;
const CAM = [
  [f.inicio, { x: 120, y: 40, s: 1.55 }],
  [Tblast, { x: 80, y: 80, s: 1.15 }],
  [fin, { x: 60, y: 100, s: 1.05 }],
];

export function dibuja(g, t) {
  const corona = k.suave(k.tramo(t, Tblast - 0.08, Tblast + 0.28));
  g.save();
  camara(g, rutaCam(t, CAM));
  pila(g, t, corona);
  g.restore();
  viñeta(g, 0.36);
  velo(g, 0.66);
}
