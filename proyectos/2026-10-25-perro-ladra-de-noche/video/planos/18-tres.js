// «...ladra al pasillo a las tres de la mañana.» Se acerca. La hora se queda.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(13).t("pasillo");
const f = v.frase(13);

export function dibuja(g, t) {
  const hora = k.suave(k.tramo(t, f.t("tres") - 0.05, f.t("tres") + 0.35));
  const c = {
    Z: k.claves([[f.t("pasillo"), 4.5], [f.t("tres"), 5.6], [f.fin + 0.5, 6.2]])(t),
    cx: k.claves([[f.t("pasillo"), 480], [f.t("manana"), 470], [f.fin + 0.45, 460]])(t),
    cy: -72,
  };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.tabique(g, 640, 0.4);
  m.lado(g, 430, t, { dir: 1, pitch: 0.05 });
  m.ondas(g, 500, -62, t, { radio: 36, fuerza: 1, color: "190,220,255", n: 5 });
  m.cifra(g, c, 300, -30, "3:00", hora);
  m.rellena(g, 0.45);
}
