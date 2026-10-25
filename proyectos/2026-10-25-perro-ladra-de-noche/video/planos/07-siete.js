// «El que más, a cuarenta y siete.» El otro extremo, en la oreja del perro.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(6).t("el", 2);
const f = v.frase(6);
const fin = v.frase(7).inicio;

export function dibuja(g, t) {
  const llega = k.suave(k.tramo(t, f.t("cuarenta", 2) - 0.08, f.t("siete") + 0.2));
  const quieto = k.suave(k.tramo(t, fin - 0.36, fin - 0.12));
  const tt = k.mez(t, fin - 0.36, quieto);
  const c = {
    Z: k.claves([[f.t("el", 2), 6.4], [f.t("siete"), 7.1], [fin - 0.28, 7.1], [fin, 7.1]])(t),
    cx: 610,
    cy: -88,
  };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.cinta(g, 360, 620, -96, tt, 1);
  m.lado(g, 700, tt, { dir: -1 });
  m.ondas(g, 640, -78, tt, { radio: 30, fuerza: 1, color: "170,230,255", n: 4 });
  m.cifra(g, c, 560, -20, "47 mil", llega);
  m.rellena(g, 0.5);
}
