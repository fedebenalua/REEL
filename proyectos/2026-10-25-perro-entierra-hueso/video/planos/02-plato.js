// «El plato está lleno, y él sigue cavando.»
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vz) => vz.frase(2).inicio;
export const entrada = "corte";

const f = v.frase(2);
const fin = v.frase(3).inicio;

export function dibuja(g, t) {
  const llega = k.entra(k.tramo(t, f.inicio, f.t("lleno") + 0.05));
  const x = 500;
  const cam = { Z: k.mez(6.3, 5.9, k.suave(k.tramo(t, f.inicio, fin - 0.2))), cx: k.mez(470, 440, k.suave(k.tramo(t, f.t("lleno"), f.fin))), cy: -32 };
  const fuerza = 1 - k.suave(k.tramo(t, fin - 0.42, fin - 0.1));
  m.parque(g, cam, t, 0.08);
  m.ponVista(g, cam);
  m.lecho(g, x + 48);
  m.hoyo(g, x + 50, 0.85);
  m.plato(g, k.mez(390, 355, llega), 1);
  const info = m.cavando(g, x, t, 3.1);
  m.tierra(g, info.pataDel[0], info.pataDel[1], t, fuerza);
  m.cierra(g, 0.42);
}
