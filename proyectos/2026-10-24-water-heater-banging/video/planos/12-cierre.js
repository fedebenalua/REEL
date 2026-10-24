// «Send this to that friend whose water heater sounds like a kettle.»
import * as k from "#kit";
import { v } from "#voz";
import { interior } from "../cosas.js";
import { estadoInterior } from "./01-hook.js";
import { camara, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = (voz) => voz.frase(15).inicio;
export const entrada = "corte";

const f = v.frase(15);
const Tk = f.t("kettle");
const fin = v.duracion;
const CAM = [
  [f.inicio, { x: 0, y: 240, s: 0.98 }],
  [Tk, { x: 0, y: 80, s: 1.16 }],
  [fin, { x: 0, y: 30, s: 1.2 }],
];

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.inicio + 0.15, Tk + 0.15));
  const local = k.mez(2.4, 0, u);
  const est = estadoInterior(local);
  g.save();
  camara(g, rutaCam(t, CAM));
  interior(g, local, est);
  g.restore();
  viñeta(g, 0.42);
  velo(g, 0.74);
}
