// «Pero a la nada, no.» El pasillo vacío se llena del pitido que tú no oyes.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(12).inicio;
const f = v.frase(12);
const fin = f.t("oye");

export function dibuja(g, t) {
  const no = k.suave(k.tramo(t, f.t("nada"), f.t("no") + 0.2));
  const c = {
    Z: k.claves([[f.inicio, 4.2], [f.t("no"), 4.8], [fin - 0.06, 4.85]])(t),
    cx: 460,
    cy: -76,
  };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.tabique(g, 600, no);
  m.lado(g, 360, t, { dir: 1, pitch: 0.04 });
  m.ondas(g, 470, -64, t, { radio: 20 + no * 40, fuerza: 0.2 + no, color: "180,220,255", n: 5 });
  m.rellena(g, 0.4);
}
