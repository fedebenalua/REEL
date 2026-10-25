// «Eso sí: no cada ladrido es una rata.» La rata se apaga. Él sigue ahí, sin el hueco.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(11).inicio;
const f = v.frase(11);
const fin = f.t("tambien");

export function dibuja(g, t) {
  const seVa = k.suave(k.tramo(t, f.t("no"), f.t("rata") + 0.15));
  const c = {
    Z: k.claves([[f.inicio, 4.6], [f.t("rata"), 5.1], [fin - 0.08, 5.05]])(t),
    cx: 480,
    cy: -80,
  };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.tabique(g, 540, 1 - seVa);
  if (seVa < 0.92) {
    g.save();
    g.globalAlpha = 1 - seVa;
    m.rata(g, 650, -118, t, 0.3, 1.2);
    g.restore();
  }
  m.lado(g, 360, t, { dir: 1 });
  m.ondas(g, 470, -68, t, { radio: 30, fuerza: 1 - seVa * 0.85, color: "210,160,255" });
  m.rellena(g, 0.42);
}
