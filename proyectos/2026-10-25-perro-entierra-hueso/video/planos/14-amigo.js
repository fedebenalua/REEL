// «Envíaselo a ese amigo al que su perro...»
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vz) => vz.frase(12).inicio;
export const entrada = "corte";

const f = v.frase(12);

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.inicio, f.t("perro")));
  const cam = { Z: k.mez(4.6, 5.1, u), cx: k.mez(430, 470, u), cy: -64 };
  m.salon(g, cam, t, 0.2);
  m.ponVista(g, cam, 0.7);
  m.persona(g, { x: 280, paso: 0, recto: 1, t, fase: 0.15 });
  m.ponVista(g, cam);
  m.perro(g, {
    x: 470, fase: t * 0.4, marcha: 0.15, t, cola: 0.85,
    cabeza: { abre: 0.25, oreja: 0.35, ang: -0.04 },
  });
  m.cojin(g, 560, 6, 120, 64);
  m.cierra(g, 0.38);
}
