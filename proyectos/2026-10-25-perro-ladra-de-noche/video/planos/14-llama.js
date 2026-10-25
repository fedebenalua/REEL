// «También avisa, o te llama.» Se gira hacia ti y ladra. Sin rata.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(11).t("tambien");
const f = v.frase(11);
const fin = v.frase(12).inicio;

export function dibuja(g, t) {
  const aTi = k.suave(k.tramo(t, f.t("te") - 0.05, f.t("llama") + 0.1));
  const c = {
    Z: k.claves([[f.t("tambien"), 5.6], [f.t("llama"), 6.6], [fin - 0.08, 6.5]])(t),
    cx: m.PX,
    cy: k.mez(-86, -98, aTi),
  };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.dueno(g, 250, t, { dir: 1, oreja: 0.2 });
  m.cara(g, m.PX + 40, t, { mira: -0.4 * (1 - aTi) - 0.2, ladea: -0.12 });
  m.ondas(g, m.PX + 40, -80, t, { radio: 36, fuerza: 1, color: "255,196,120", n: 4 });
  m.rellena(g, 0.48);
}
