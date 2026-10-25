// «Tu perro hace ese gesto, aunque ya esté lleno.»
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio;
export const entrada = "corte";

const f = v.frase(9);
const fin = v.frase(10).inicio;

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.inicio, f.t("gesto") + 0.2));
  const cam = { Z: k.mez(5.6, 6.15, u), cx: k.mez(430, 475, u), cy: -32 };
  m.parque(g, cam, t, 0.1);
  m.ponVista(g, cam);
  m.lecho(g, 545);
  m.hoyo(g, 548, 0.75);
  m.hueso(g, 552, 0, 0.85, 0.15, 1);
  m.plato(g, 375, 1);
  const info = m.tapando(g, 470, t);
  const golpe = Math.pow(Math.max(0, Math.sin((t * 2.6) % 1 * Math.PI)), 8);
  m.tierra(g, info.nariz[0], 0, t * 0.45, golpe * (t < fin - 0.22 ? 0.55 : 0));
  m.cierra(g, 0.4);
}
