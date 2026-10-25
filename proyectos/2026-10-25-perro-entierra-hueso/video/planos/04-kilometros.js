// «Una loba escondió una pata a más de dos kilómetros.»
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vz) => vz.frase(4).inicio;
export const entrada = "corte";

const f = v.frase(4);
const fin = v.frase(5).inicio;

export function dibuja(g, t) {
  const corre = k.suave(k.tramo(t, f.inicio + 0.05, f.t("dos")));
  const para = k.suave(k.tramo(t, f.t("dos"), f.t("kilometros") + 0.05));
  const x = k.mez(160, 980, k.mez(corre, 1, para));
  const cam = { Z: 6.9, cx: x, cy: -34 };
  m.parque(g, cam, t, 0.95);
  m.ponVista(g, cam);
  const anda = 1 - para;
  const info = m.perro(g, {
    x, fase: t * (2.2 + anda * 4), marcha: anda, t, cola: 0.8,
    cabeza: { abre: 0.4, ang: -0.08, oreja: 0.45 },
  });
  m.pata(g, info.nariz[0] + 2, info.nariz[1] + 8, 1, -1.0, 1.1);
  m.ambiente(g, 0.9);
  m.sinVista(g);
  const al = k.suave(k.tramo(t, f.t("kilometros") - 0.05, f.t("kilometros") + 0.28));
  k.pastilla(g, 540, 1180, "2,3", "km", "255,214,110", al, 128);
  m.cierra(g, 0.36);
  void fin;
}
