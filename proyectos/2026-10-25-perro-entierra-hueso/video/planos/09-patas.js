// «El hoyo, siempre con las patas de delante.»
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio;
export const entrada = "corte";

const f = v.frase(7);
const fin = v.frase(8).inicio;

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.t("patas") - 0.1, f.t("delante")));
  const cam = { Z: k.mez(7.3, 7.9, u), cx: k.mez(500, 530, u), cy: -26 };
  const fuerza = 1 - k.suave(k.tramo(t, fin - 0.34, fin - 0.08));
  m.parque(g, cam, t, 0.2);
  m.ponVista(g, cam);
  m.lecho(g, 560);
  m.hoyo(g, 568, 0.95);
  const info = m.cavando(g, 455, t, 3.3);
  m.tierra(g, info.pataDel[0], info.pataDel[1], t, fuerza);
  m.cierra(g, 0.46);
}
