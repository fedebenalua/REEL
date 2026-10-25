// «Envíaselo a ese amigo...» El salón a las tres. Él, al fondo del pasillo, ladrando.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(13).inicio;
const f = v.frase(13);
const fin = f.t("pasillo");

export function dibuja(g, t) {
  const c = {
    Z: k.claves([[f.inicio, 3.35], [f.t("perro"), 3.6], [fin - 0.06, 3.65]])(t),
    cx: k.claves([[f.inicio, 340], [fin - 0.06, 400]])(t),
    cy: -70,
  };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.dueno(g, 230, t, { dir: 1, oreja: 0.3 });
  m.tabique(g, 640, 0);
  m.lado(g, 470, t, { dir: 1 });
  m.ondas(g, 530, -60, t, { radio: 30, fuerza: 0.9, color: "180,220,255" });
  m.rellena(g, 0.4);
}
