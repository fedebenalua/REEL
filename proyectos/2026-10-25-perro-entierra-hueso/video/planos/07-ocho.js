// «Lo filmaron en ocho lobos...»
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vz) => vz.frase(6).inicio;
export const entrada = "corte";

const f = v.frase(6);
const fin = f.t("ciento");

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.inicio, fin));
  const cam = { Z: k.mez(6.6, 7.4, u), cx: 490, cy: k.mez(-38, -30, u) };
  const fuerza = 1 - k.suave(k.tramo(t, fin - 0.28, fin - 0.06));
  m.parque(g, cam, t, 0.88);
  m.ponVista(g, cam);
  m.lecho(g, 530);
  m.hoyo(g, 528, 0.55 + 0.3 * u);
  const info = m.cavando(g, 460, t, 2.8);
  m.tierra(g, info.pataDel[0], info.pataDel[1], t, fuerza);
  m.ambiente(g, 0.75);
  m.cierra(g, 0.4);
}
