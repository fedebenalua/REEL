// «...avisa a las suyas a unos veintidós mil.» El chillido sale del hueco, con su cifra.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(7).t("avisa");
const f = v.frase(7);
const fin = v.frase(8).inicio;

export function dibuja(g, t) {
  const sale = k.suave(k.tramo(t, f.t("avisa"), f.t("veintidos")));
  const cifra = k.suave(k.tramo(t, f.t("veintidos") - 0.08, f.t("mil") + 0.25));
  const c = {
    Z: k.claves([[f.t("avisa"), 5.4], [f.t("veintidos"), 4.6], [fin - 0.08, 4.5]])(t),
    cx: k.claves([[f.t("avisa"), 560], [f.t("mil"), 500], [fin - 0.08, 490]])(t),
    cy: -90,
  };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.tabique(g, 520, 1);
  const boca = 0.4 + 0.6 * m.ladrido(t, 0.4, 0.1);
  m.rata(g, 628, -118, t, boca, 1.35);
  m.ondas(g, 560, -120, t, { radio: 24 + sale * 50, fuerza: 1, color: "210,160,255", n: 5 });
  m.lado(g, 340, t, { dir: 1, pitch: 0.08 });
  m.cifra(g, c, 460, -24, "22 mil", cifra);
  m.rellena(g, 0.45);
}
