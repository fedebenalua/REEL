// «If only the hot side is weak, leave the water heater alone.»
import * as k from "#kit";
import { v } from "#voz";
import { camara, rutaCam, velo, viñeta } from "../mundo.js";
import { caliente } from "../piezas.js";

export const desde = (voz) => voz.frase(4).inicio;
export const entrada = "corte";

const f = v.frase(4);
const Tleave = f.t("leave");
const Theat = f.t("heater");
const Talone = f.t("alone");
const fin = v.frase(5).inicio;
const CAM = [
  [f.inicio, { x: 0, y: 80, s: 1.35 }],
  [Tleave, { x: 0, y: 60, s: 1.28 }],
  [Theat, { x: 1360, y: 40, s: 1.02 }],
  [fin, { x: 1420, y: 80, s: 1.05 }],
];

export function dibuja(g, t) {
  const retro = k.suave(k.tramo(t, Theat + 0.05, Talone + 0.2));
  g.save();
  camara(g, rutaCam(t, CAM));
  caliente(g, t, retro);
  g.restore();
  viñeta(g, 0.42);
  velo(g, 0.7);
}
