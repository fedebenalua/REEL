// «Una rata, de noche...» Dentro de la pared, la rata ya está chillando.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(7).inicio;
const f = v.frase(7);
const fin = f.t("avisa");

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.inicio, fin - 0.2));
  const c = { Z: k.mez(9.2, 8.2, u), cx: 630, cy: k.mez(-130, -120, u) };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.tabique(g, 520, 1);
  const boca = 0.35 + 0.65 * m.ladrido(t, 0.42, 0.2);
  m.rata(g, 628, -118, t, boca, 1.55);
  m.ondas(g, 575, -128, t, { radio: 28, fuerza: 1, color: "210,160,255", n: 4, cada: 0.4 });
  m.rellena(g, 0.42);
}
