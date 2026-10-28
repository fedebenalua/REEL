// A través del parabrisas: el calor se va al cielo, el cristal baja de cero y se hiela.
import * as k from "#kit";
import { v } from "#voz";
import { bocanadas, calle, enVidrio, velo } from "../mundo.js";

export const desde = "noche";
export const entrada = "corte";

const f3 = v.frase(3);
const f4 = v.frase(4);

function cam(t) {
  const u = k.suave(k.tramo(t, f3.t("cristal"), f3.t("espacio")));
  const cerca = k.suave(k.tramo(t, f4.t("queda"), f4.t("helarse")));
  const pos = k.mezV([0.04, 0.62, -1.7], [0.1, 0.78, -1.42], u);
  const pos2 = k.mezV(pos, [0.02, 0.9, -1.22], cerca);
  const mira = k.mezV([0, 1.7, -0.15], [0.02, 1.25, -0.4], u * 0.5 + cerca * 0.5);
  return k.mira(pos2, mira);
}

export function dibuja(g, t) {
  const c = cam(t);
  const hielo = k.suave(k.tramo(t, f4.t("helarse") - 0.05, f4.fin - 0.55));
  calle(g, c, { calor: 0, escarcha: hielo, dia: 0, conTermometro: false });
  bocanadas(g, c, t, f3.t("calor") - 0.05, f3.t("poco") + 0.35, true);
  bocanadas(g, c, t, f3.t("devuelve"), f3.finDe("poco") + 0.15, false);
  const aire = k.suave(k.tramo(t, f4.t("dos"), f4.t("dos") + 0.3));
  const baja = k.suave(k.tramo(t, f4.t("grados"), f4.t("aire") + 0.15));
  const p = k.proyecta(c, enVidrio(0.72, 0.42));
  if (aire > 0.05) k.pastilla(g, 250, 760, "+2", "°C", "255,90,90", aire, 84);
  if (p && baja > 0.05) {
    const grados = baja < 0.98 ? Math.round(k.mez(2, -1, baja)) : -1;
    const texto = (grados > 0 ? "+" : "−") + Math.abs(grados);
    k.pastilla(g, Math.max(180, Math.min(820, p.x)), Math.max(860, Math.min(1280, p.y)), texto, "°C", "186,230,255", Math.min(1, baja + 0.15), 96);
  }
  velo(g, 0.5 + hielo * 0.25);
}
