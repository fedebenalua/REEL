// «Aún así, no queda demostrado que sea la única razón.» De frente, y el peligro se apaga.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(9).inicio;

const f = v.frase(9);
const fin = v.frase(10).inicio;

export function dibuja(g, t) {
  const duda = k.suave(k.tramo(t, f.t("queda"), f.t("unica") + 0.15));
  const apaga = k.suave(k.tramo(t, f.t("unica") - 0.05, f.fin - 0.12));
  const Z = k.claves([[f.inicio, 6.8], [f.t("unica"), 8.2], [fin, 7.8]])(t);
  const c = { Z, cx: m.CX - 10, cy: -88 };
  m.salon(g, c, t, 0.55);
  m.ponVista(g, c);
  g.save();
  g.translate(m.CX + 150, -20);
  g.scale(0.72, 0.72);
  m.arbusto(g, 0);
  m.ojos(g, 10, -78, t, (0.9 - apaga) * k.suave(k.tramo(t, f.inicio, f.t("asi") + 0.15)));
  g.restore();
  m.perroFrente(g, {
    x: m.CX, t, cola: 0.55,
    cabeza: { ladea: 0.46 * duda, oreja: 0.2, ojo: 0, mira: 0.2 },
  });
  m.rellena(g, 0.5);
}
