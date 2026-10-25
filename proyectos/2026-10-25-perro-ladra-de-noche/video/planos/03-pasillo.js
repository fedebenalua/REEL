// «Se planta en el pasillo y ladra a la pared vacía.» La pared, lisa, y él ya plantado.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(3).inicio;
const f = v.frase(3);
const fin = v.frase(4).inicio;

export function dibuja(g, t) {
  const llega = k.suave(k.tramo(t, f.t("pared") - 0.08, f.t("vacia") + 0.15));
  const Z = k.claves([[f.inicio, 4.8], [f.t("pared"), 5.6], [fin - 0.12, 5.7]])(t);
  const cx = k.claves([[f.inicio, 430], [f.t("pared"), 500], [fin - 0.12, 510]])(t);
  const c = { Z, cx, cy: -70 };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.tabique(g, 560, 0);
  m.lado(g, 390, t, { dir: 1, pitch: 0.06 });
  m.ondas(g, 455, -58, t, { radio: 34 + llega * 20, fuerza: 1, color: "170,220,255", rot: -0.2 });
  m.rellena(g, 0.4);
}
