// Bajo el tejadillo el calor rebota y la escarcha no cuaja.
import * as k from "#kit";
import { v } from "#voz";
import { bajoTejado, velo } from "../mundo.js";

export const desde = "aparcas";
export const entrada = "corte";

const f6 = v.frase(6);

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f6.t("aparcas"), f6.t("escarcha")));
  const pos = k.mezV([-2.1, 1.55, -3.4], [-1.15, 1.7, -2.5], u);
  const mira = k.mezV([0.1, 1.0, 0.1], [0.05, 1.35, -0.2], u);
  const asoma = k.suave(k.tramo(t, f6.t("escarcha") - 0.1, f6.t("no")));
  const seVa = k.suave(k.tramo(t, f6.t("no"), f6.t("sale") + 0.15));
  const intento = asoma * (1 - seVa) * 0.55;
  const sube = k.suave(k.tramo(t, f6.t("tejado"), f6.t("devuelve") + 0.15));
  const reposa = 1 - k.suave(k.tramo(t, f6.fin - 0.5, f6.fin - 0.15));
  bajoTejado(g, k.mira(pos, mira), { rebote: sube * reposa, intento });
  velo(g, 0.48);
}
