// «...más de ciento cincuenta veces.»
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vz) => vz.frase(6).t("ciento");
export const entrada = "corte";

const f = v.frase(6);
const fin = v.frase(7).inicio;

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.t("ciento"), f.t("veces")));
  const cam = { Z: k.mez(7.2, 7.8, u), cx: k.mez(490, 520, u), cy: -30 };
  const fuerza = 1 - k.suave(k.tramo(t, fin - 0.32, fin - 0.08));
  m.parque(g, cam, t, 0.88);
  m.ponVista(g, cam);
  m.lecho(g, 545);
  m.hoyo(g, 548, 0.9);
  const info = m.cavando(g, 470, t, 3.6);
  m.tierra(g, info.pataDel[0], info.pataDel[1], t, fuerza);
  m.ambiente(g, 0.7);
  m.cierra(g, 0.42);
}
