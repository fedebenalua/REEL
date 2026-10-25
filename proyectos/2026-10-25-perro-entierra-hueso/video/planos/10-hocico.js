// «Taparlo, siempre con el hocico.»
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;
export const entrada = "corte";

const f = v.frase(8);
const fin = v.frase(9).inicio;

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.inicio, f.t("hocico")));
  const cam = { Z: k.mez(6.8, 7.5, k.suave(k.tramo(t, f.inicio, fin - 0.15))), cx: k.mez(500, 555, k.suave(k.tramo(t, f.inicio, f.t("hocico") + 0.3))), cy: -30 };
  m.parque(g, cam, t, 0.15);
  m.ponVista(g, cam);
  m.lecho(g, 590);
  m.hoyo(g, 600, 0.8);
  m.hueso(g, 604, 2, 0.9, 0.1, 0.9);
  const info = m.tapando(g, 500, t);
  const golpe = Math.pow(Math.max(0, Math.sin((t * 2.6) % 1 * Math.PI)), 8);
  m.tierra(g, info.nariz[0], info.nariz[1], t * 0.5, golpe * (t < fin - 0.2 ? 0.7 : 0));
  m.cierra(g, 0.44);
}
