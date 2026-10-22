// «Y otro perro lo nota: si el meneo va más a la izquierda, se le acelera el corazón.»
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(8).t("otro") - 0.04;
export const entrada = "corte";

const f = v.frase(8);
const Tizq = f.t("izquierda");
const Tcor = f.t("corazon");
const Tcorte = v.frase(9).t("simple");

export function dibuja(g, t) {
  m.anochecer(g, t);
  const sesgo = k.claves([
    [f.inicio, -0.4],
    [Tizq, -1],
    [Tcorte, -1],
  ]);
  const calma = k.suave(k.tramo(t, Tcorte - 0.48, Tcorte - 0.16));
  const ang = k.mez(m.angulo(t, sesgo(t)), -m.extension(-1).izq * 0.9, calma);

  m.perroLado(g, 180, 1180, 1.35, t);
  m.perroDetras(g, 820, 1040, 1.15, {
    ang,
    giro: 0,
    rastro: calma > 0.5 ? [] : m.rastro(t, sesgo(t)),
    t,
  });
  m.arcos(g, 820, 1040, 300, sesgo(t), k.suave(k.tramo(t, Tizq - 0.15, Tizq + 0.3)) * (1 - calma));

  const late = k.suave(k.tramo(t, Tcor - 0.25, Tcor + 0.15));
  const apaga = 1 - k.suave(k.tramo(t, Tcorte - 0.5, Tcorte - 0.18));
  const hz = k.mez(1.3, 3.4, late);
  const pulso = 0.5 + 0.5 * Math.sin(t * hz * Math.PI * 2);
  const s = (1.05 + late * 0.55) * (0.86 + 0.14 * pulso) * apaga;
  m.corazon(g, 300, 1040, s, apaga);
  m.velo(g, 0.4);
}
