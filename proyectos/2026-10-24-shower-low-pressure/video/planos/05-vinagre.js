// El bol de vinagre, la noche, el oro y el cepillo.
import * as k from "#kit";
import { v } from "#voz";
import { camara, rutaCam, velo, viñeta } from "../mundo.js";
import { vinagre } from "../piezas.js";

export const desde = "Soak";
export const entrada = "corte";

const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9);
const Tdown = f7.t("down");
const Thour = f7.t("hour");
const Tthick = f8.t("thick");
const Tnight = f8.t("overnight");
const Tgold = f8.t("gold");
const Tthirty = f8.t("thirty");
const Tonly = f8.t("only");
const Tbrush = f9.t("toothbrush");
const Trinse = f9.t("rinse");
const fin = v.frase(10).inicio;

const xFn = k.claves([
  [f7.inicio, 0],
  [Tonly, 0],
  [Tbrush - 0.15, 220],
  [fin, 220],
]);
const yFn = k.claves([
  [f7.inicio, -460],
  [Tdown + 0.12, 36],
  [Tthirty - 0.08, 36],
  [Tonly + 0.05, -90],
  [Tbrush - 0.1, -30],
  [fin, -20],
]);
const costraFn = k.claves([
  [f7.inicio, 1],
  [Thour, 0.62],
  [Tgold, 0.08],
  [Tbrush, 0.12],
  [Trinse, 0],
  [fin, 0],
]);
const oroFn = k.claves([
  [f7.inicio, 0],
  [Tgold - 0.05, 0],
  [Tthirty, 1],
  [fin, 1],
]);
const nocheFn = k.claves([
  [f7.inicio, 0],
  [Tnight - 0.1, 0],
  [Tgold - 0.15, 1],
  [f9.inicio, 0.85],
  [Tbrush, 0],
  [fin, 0],
]);
const CAM = [
  [f7.inicio, { x: 0, y: -40, s: 1.12 }],
  [Tdown, { x: 0, y: 30, s: 1.32 }],
  [Tthick, { x: 10, y: 70, s: 1.7 }],
  [Tnight, { x: 0, y: 20, s: 1.28 }],
  [Tthirty, { x: 40, y: -40, s: 1.3 }],
  [Tbrush, { x: 220, y: -10, s: 1.45 }],
  [Trinse, { x: 220, y: -40, s: 1.4 }],
  [fin, { x: 210, y: -20, s: 1.32 }],
];

export function dibuja(g, t) {
  const y = yFn(t);
  const sumergido = k.suave(k.tramo(t, Tdown - 0.2, Tthirty - 0.05)) * (1 - k.suave(k.tramo(t, Tthirty, Tonly)));
  const cepillo = k.suave(k.tramo(t, Tbrush - 0.25, Tbrush + 0.1)) * (1 - k.suave(k.tramo(t, Trinse - 0.05, Trinse + 0.15)));
  const enjuague = k.suave(k.tramo(t, Trinse - 0.05, Trinse + 0.2)) * (1 - k.suave(k.tramo(t, fin - 0.35, fin - 0.12)));
  const guanteAl = k.suave(k.tramo(t, Tthirty - 0.12, Tthirty + 0.12)) * (1 - k.suave(k.tramo(t, Tonly + 0.15, f9.inicio + 0.1)));
  g.save();
  camara(g, rutaCam(t, CAM));
  vinagre(g, t, {
    x: xFn(t), y, esc: 1.55,
    costra: costraFn(t), oro: oroFn(t), noche: nocheFn(t),
    burbujas: sumergido,
    cepillo, cx: xFn(t), cy: y,
    enjuague, guante: guanteAl,
  });
  g.restore();
  viñeta(g, 0.38);
  velo(g, 0.66);
}
