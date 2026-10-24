// «Dicen que mira alrededor, por si hay peligro.» El parque y los ojos en el arbusto.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(2).inicio;

const f = v.frase(2);
const fin = v.frase(3).inicio;

export function dibuja(g, t) {
  const u = k.tramo(t, f.inicio, fin - 0.3);
  const quieto = m.asienta(t, fin);
  const s = m.giro(u, 1.6, 430, 70);
  const ojos = k.suave(k.tramo(t, f.t("alrededor") - 0.05, f.t("peligro") + 0.05));
  const Z = k.claves([[f.inicio, 4.3], [f.t("alrededor"), 4.6], [f.t("peligro"), 5.6], [fin, 5.7]])(t);
  const c = { Z, cx: k.mez(s.x, 520, ojos * 0.45), cy: -64 };
  m.parque(g, c, t, 0.25);
  m.ponVista(g, c);
  m.hierba(g, t, false, s.x);
  m.arbusto(g, 690);
  m.ojos(g, 700, -78, t, ojos * (1 - quieto * 0.2));
  m.surco(g, 430, u, 1.6, 70, "rgba(30,70,20,0.4)", 6);
  m.perro(g, {
    x: s.x, dir: s.dir, fase: s.fase, marcha: 1 - quieto * 0.85, t,
    cola: 0.55, escala: s.escala, cuelloBaja: 0.15 * ojos,
    cabeza: { abre: 0.15, ang: 0.12, oreja: 0.2, ojo: 0 },
  });
  m.hierba(g, t, true, s.x);
  m.rellena(g, 0.36);
}
