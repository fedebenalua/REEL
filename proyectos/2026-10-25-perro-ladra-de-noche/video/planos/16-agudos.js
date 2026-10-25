// «Oye agudos que tú no puedes oír.» Primer plano de la oreja, con el pitido entrando.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(12).t("oye");
const f = v.frase(12);
const fin = v.frase(13).inicio;

export function dibuja(g, t) {
  const quieto = k.suave(k.tramo(t, fin - 0.36, fin - 0.12));
  const tt = k.mez(t, fin - 0.36, quieto);
  const c = {
    Z: k.claves([[f.t("oye"), 8.4], [f.t("oir") - 0.1, 9.4], [fin - 0.3, 9.4], [fin, 9.4]])(t),
    cx: m.PX + 18,
    cy: -104,
  };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.cara(g, m.PX, t, { ladea: 0.18, mira: -0.15, ladra: k.mez(m.ladrido(tt, 0.34, 0.08), 0.85, quieto) });
  m.ondas(g, m.PX - 20, -108, tt, { radio: 34, fuerza: 1, color: "180,230,255", n: 5, cada: 0.4 });
  m.rellena(g, 0.55);
}
