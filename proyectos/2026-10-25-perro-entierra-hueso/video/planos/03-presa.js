// «Eso lo hacen los lobos, cuando les sobra la presa.»
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vz) => vz.frase(3).inicio;
export const entrada = "corte";

const f = v.frase(3);
const fin = v.frase(4).inicio;

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.inicio, f.t("presa")));
  const x = k.mez(400, 490, u);
  const cam = { Z: 6.3, cx: x - 24, cy: -36 };
  m.parque(g, cam, t, 0.92);
  m.ponVista(g, cam);
  const queda = 1 - k.suave(k.tramo(t, f.t("sobra"), f.t("presa") + 0.1));
  if (queda > 0.04) m.pata(g, 300, -6, queda, 0.15, 1.45);
  const info = m.perro(g, {
    x, fase: t * 1.6, marcha: 1 - k.suave(k.tramo(t, fin - 0.45, fin - 0.12)), t,
    cola: 0.7, cabeza: { abre: 0.45, ang: -0.08, oreja: 0.3 },
  });
  m.pata(g, info.nariz[0] + 4, info.nariz[1] + 8, 1, -1.05, 1.15);
  m.ambiente(g, 0.85);
  m.cierra(g, 0.38);
}
