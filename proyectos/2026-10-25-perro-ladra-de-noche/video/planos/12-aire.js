// «Puede que le ladre a la pared, no al aire.» El aire de al lado está vacío. El pitido sale de la pared.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(10).inicio;
const f = v.frase(10);
const fin = v.frase(11).inicio;

export function dibuja(g, t) {
  const alAire = k.suave(k.tramo(t, f.t("no") - 0.05, f.t("aire") + 0.1));
  const c = {
    Z: k.claves([[f.inicio, 4.4], [f.t("pared"), 4.8], [f.t("aire"), 3.9], [fin - 0.08, 4]])(t),
    cx: k.claves([[f.inicio, 480], [f.t("pared"), 520], [f.t("aire"), 700], [fin - 0.08, 690]])(t),
    cy: -74,
  };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.tabique(g, 500, 1);
  m.rata(g, 610, -120, t, 0.45 + 0.4 * m.ladrido(t, 0.38, 0.1), 1.15);
  m.lado(g, 340, t, { dir: 1, pitch: 0.05 });
  m.ondas(g, 470, -70, t, { radio: 32, fuerza: 1 - alAire * 0.2, color: "210,160,255" });
  m.rellena(g, 0.4);
}
