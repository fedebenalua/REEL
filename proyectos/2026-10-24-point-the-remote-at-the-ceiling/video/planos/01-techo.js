// «You can point your TV remote at the ceiling...»
// Fotograma 0: el mando enorme, la luz violeta ya subiendo. Luego el techo, la tele y el ojito.
import * as k from "#kit";
import { v } from "#voz";
import { APERTURA, MANDO, TECHO, camDe, canalEn, escenaRebote } from "../mundo.js";

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4);
const CORTE = v.frase(5).inicio;

const cam = camDe(
  [[-0.35, 1.7], [0, 2.15], [f1.t("remote"), 1.95], [f1.t("ceiling"), 2.05], [f1.t("changes"), 1.42], [f2.t("aimed"), 0.82], [f3.inicio, 0.82], [f3.t("paint"), 1.55], [f3.t("bounces"), 1.85], [f4.t("eye"), 2.25], [f4.t("jumps"), 1.48], [CORTE - 0.25, 1.42]],
  [[-0.35, TECHO.x + 40], [0, TECHO.x], [f1.t("remote"), MANDO.x - 30], [f1.t("ceiling"), TECHO.x], [f1.t("changes"), 600], [f2.t("aimed"), 760], [f3.inicio, 760], [f3.t("paint"), TECHO.x], [f3.t("bounces"), TECHO.x], [f4.t("eye"), 540], [f4.t("jumps"), 640], [CORTE - 0.25, 660]],
  [[-0.35, 80], [0, 210], [f1.t("remote"), 1180], [f1.t("ceiling"), 240], [f1.t("changes"), 830], [f2.t("aimed"), 1020], [f3.inicio, 1020], [f3.t("paint"), 340], [f3.t("bounces"), 220], [f4.t("eye"), 990], [f4.t("jumps"), 840], [CORTE - 0.25, 880]],
);

const saltos = [
  { t: f1.t("changes"), de: 4, a: 7 },
  { t: f4.t("jumps"), de: 7, a: 12 },
];

export const desde = 0;

export function dibuja(g, t) {
  const apaga = k.suave(k.tramo(t, f4.t("jumps") + 0.55, CORTE - 0.32));
  const haz = 1 - apaga;
  escenaRebote(g, t, cam(t), {
    tm: Math.min(t, CORTE - 0.2),
    haz,
    ojo: haz * (0.55 + 0.45 * k.pulso(t, f4.t("eye"), 0.16)),
    canal: canalEn(t, saltos, 4),
    mando: 1,
    mx: MANDO.x,
    my: MANDO.y,
    mang: MANDO.ang,
    movil: 0,
    fx: 0,
    fy: 0,
    golpesTecho: [f1.t("ceiling"), f3.t("bounces")],
    golpesOjo: [f4.t("eye"), f4.t("jumps")],
  });
}
