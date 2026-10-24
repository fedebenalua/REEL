// «Eso, que se sepa, no se ha medido.» Los ojos se apagan.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(3).inicio;

const f = v.frase(3);
const fin = v.frase(4).inicio;

export function dibuja(g, t) {
  const apaga = k.suave(k.tramo(t, f.t("no") - 0.05, f.t("medido") + 0.15));
  const mira = k.suave(k.tramo(t, f.inicio, f.t("sepa")));
  const Z = k.claves([[f.inicio, 5.8], [f.t("medido"), 7.4], [fin, 7.2]])(t);
  const c = { Z, cx: k.mez(500, 640, apaga * 0.35), cy: -78 };
  m.parque(g, c, t, 0.25);
  m.ponVista(g, c);
  m.hierba(g, t, false, 470);
  m.arbusto(g, 690);
  m.ojos(g, 700, -78, t, 1 - apaga);
  m.perro(g, {
    x: k.mez(500, 470, mira), dir: 1, fase: t * 0.4, marcha: 0.15 * (1 - mira), t,
    cola: 0.25 + 0.2 * (1 - apaga),
    cabeza: { ang: 0.22 * mira, abre: 0.05, oreja: 0.35, ojo: 0 },
  });
  m.hierba(g, t, true, 470);
  m.rellena(g, 0.4);
}
