// «Ese chillido a ti te pasa de largo. A él, no.» Atraviesa a la persona y se queda en el perro.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(8).inicio;
const f = v.frase(8);
const fin = v.frase(9).inicio;

export function dibuja(g, t) {
  const pasa = k.suave(k.tramo(t, f.t("ti"), f.t("largo") + 0.1));
  const el = k.suave(k.tramo(t, f.t("el") - 0.05, f.fin - 0.15));
  const c = {
    Z: k.claves([[f.inicio, 3.6], [f.t("largo"), 3.5], [f.t("el"), 4.3], [fin - 0.1, 4.5]])(t),
    cx: k.claves([[f.inicio, 280], [f.t("largo"), 300], [f.t("no"), 520], [fin - 0.1, 540]])(t),
    cy: -78,
  };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.tabique(g, 640, 0.35 + 0.65 * el);
  m.rata(g, 740, -118, t, 0.5 + 0.4 * m.ladrido(t, 0.4, 0), 1.1);
  m.dueno(g, 250, t, { dir: 1, oreja: 1 });
  m.lado(g, 480, t, { dir: 1 });
  m.ondas(g, k.mez(300, 500, el), -90, t, { radio: 40, fuerza: 0.3 + pasa, color: "210,160,255", n: 4 });
  m.cinta(g, 620, k.mez(400, 500, Math.max(pasa, el)), -100, t, pasa);
  m.rellena(g, 0.42);
}
