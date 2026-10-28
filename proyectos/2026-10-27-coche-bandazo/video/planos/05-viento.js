// En la calle, el viento se lleva la escarcha.
import * as k from "#kit";
import { v } from "#voz";
import { calle, camFinal, cintasDeAire, estadoFinal, faroles, puntoTermometro, velo } from "../mundo.js";

export const desde = "sopla";
export const entrada = "corte";

const f7 = v.frase(7);

export function dibuja(g, t) {
  const c = camFinal(t);
  const e = estadoFinal(t);
  calle(g, c, { ...e, conTermometro: true });
  faroles(g, c);
  cintasDeAire(g, c, t, f7.t("sopla") + 0.05, f7.fin - 0.35);
  const p = puntoTermometro(c);
  if (p) k.pastilla(g, Math.max(240, Math.min(800, p.x)), Math.max(700, Math.min(1180, p.y)), "+2", "°C", "255,90,90", 1, 72);
  velo(g, 0.4);
}
