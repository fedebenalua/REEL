// El desierto de noche: una bandeja de agua que se hiela mirando al cielo.
import * as k from "#kit";
import { v } from "#voz";
import { desierto, velo } from "../mundo.js";

export const desde = "persia";
export const entrada = "corte";

const f5 = v.frase(5);

export function dibuja(g, t) {
  const u = k.entra(k.tramo(t, f5.t("persia"), f5.t("bandeja")));
  const pos = k.mezV([0.35, 2.1, -1.35], [0.1, 0.95, -0.35], u);
  const hielo = k.suave(k.tramo(t, f5.t("hielo") - 0.05, f5.finDe("cielo") - 0.2));
  desierto(g, k.mira(pos, [0, 0.42, 0.55]), Math.min(1, hielo));
  velo(g, 0.42);
}
