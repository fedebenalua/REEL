// «Una persona se queda cerca de los veinte mil hercios.» El pitido choca y se para en su oreja.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(4).inicio;
const f = v.frase(4);
const fin = v.frase(5).inicio;

export function dibuja(g, t) {
  const crece = k.suave(k.tramo(t, f.inicio + 0.05, f.t("veinte") + 0.05));
  const para = k.suave(k.tramo(t, f.t("mil") - 0.12, f.t("hercios") + 0.2));
  const x1 = k.mez(80, 250, crece);
  const c = {
    Z: k.claves([[f.inicio, 3.5], [f.t("veinte"), 4.05], [fin - 0.1, 4.1]])(t),
    cx: k.claves([[f.inicio, 220], [f.t("mil"), 250], [fin - 0.1, 250]])(t),
    cy: -86,
  };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.dueno(g, 230, t, { dir: -1 });
  m.cinta(g, 40, x1, -120, t, 1);
  if (para > 0.05) k.fogonazo(g, x1, -120, (t - (f.t("mil") - 0.05)) * 1.4, 90, "180,220,255");
  m.ondas(g, x1, -120, t, { radio: 22, fuerza: para, color: "190,220,255", n: 3 });
  m.cifra(g, c, 250, -40, "20 mil", para);
  m.rellena(g, 0.48);
}
