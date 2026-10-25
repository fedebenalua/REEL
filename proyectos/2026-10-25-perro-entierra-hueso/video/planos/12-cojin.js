// «Y si no hay tierra, lo empuja bajo el cojín.»
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vz) => vz.frase(10).inicio;
export const entrada = "corte";

const f = v.frase(10);
const fin = v.frase(11).inicio;

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.t("empuja") - 0.05, f.fin - 0.2));
  const cam = { Z: 5.4, cx: k.mez(420, 470, u), cy: -46 };
  const x = 360;
  m.salon(g, cam, t, 0.15);
  m.ponVista(g, cam);
  const info = m.perro(g, {
    x, fase: 0.1, marcha: 0, t, cola: 0.7, cuelloBaja: 0.35 + 0.4 * u,
    cabeza: { ang: 0.15 + 0.35 * u, abre: 0.05, oreja: 0.2 },
  });
  const bx = k.mez(info.nariz[0] + 10, 500, u);
  m.hueso(g, bx, -4, 1, -0.15 + u * 0.4, 1.15);
  m.cojin(g, 470, 6, 130, 72);
  void fin;
  m.cierra(g, 0.4);
}
