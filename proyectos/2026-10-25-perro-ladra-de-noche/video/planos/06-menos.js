// «El que menos, a cuarenta y un mil.» El extremo corto del pitido, quieto, con la cifra.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(6).inicio;
const f = v.frase(6);
const fin = f.t("el", 2);

export function dibuja(g, t) {
  const llega = k.suave(k.tramo(t, f.t("cuarenta") - 0.05, f.t("mil") + 0.15));
  const c = {
    Z: k.claves([[f.inicio, 5.2], [f.t("un"), 5.8], [fin - 0.08, 5.8]])(t),
    cx: 500,
    cy: -96,
  };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.cinta(g, 280, 520, -100, t, 1);
  m.ondas(g, 520, -100, t, { radio: 26, fuerza: 0.9, color: "255,210,120", n: 3 });
  m.lado(g, 690, t, { dir: -1, escala: 0.9, ladra: 0.15 });
  m.cifra(g, c, 500, -28, "41 mil", llega);
  m.rellena(g, 0.5);
}
