// «Lo guarda para comérselo luego.»
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vz) => vz.frase(11).inicio;
export const entrada = "corte";

const f = v.frase(11);
const fin = v.frase(12).inicio;

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.inicio + 0.05, f.t("luego") - 0.05));
  const cam = { Z: k.mez(7.4, 6.8, u), cx: k.mez(500, 460, u), cy: -32 };
  const x = 450;
  m.parque(g, cam, t, 0.12);
  m.ponVista(g, cam);
  m.lecho(g, x + 60);
  m.hoyo(g, x + 62, 1 - 0.35 * u);
  const info = m.perro(g, {
    x, fase: 0.2, marcha: 0, t, cola: 0.5 + 0.4 * u, cuelloBaja: 0.7 * (1 - u),
    cabeza: { ang: 0.35 * (1 - u) - 0.05 * u, abre: 0.15 + 0.2 * u, oreja: 0.2 + 0.3 * u, ojo: 0.1 },
  });
  m.hueso(g, k.mez(x + 70, info.nariz[0] + 6, u), k.mez(6, info.nariz[1] + 4, u), 1, k.mez(0.2, -0.5, u), 1.15);
  void fin;
  m.cierra(g, 0.4);
}
