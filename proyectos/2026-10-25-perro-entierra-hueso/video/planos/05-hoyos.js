// «Y dos hoyos de carne ya masticada...»
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio;
export const entrada = "corte";

const f = v.frase(5);

export function dibuja(g, t) {
  const u = k.entra(k.tramo(t, f.inicio, f.t("masticada")));
  const paso = k.suave(k.tramo(t, f.t("carne"), f.t("medio") - 0.15));
  const xPerro = k.mez(430, 500, paso);
  const cam = { Z: 5.7, cx: xPerro + 8, cy: -30 };
  m.parque(g, cam, t, 0.55);
  m.ponVista(g, cam);
  m.lecho(g, 390);
  m.lecho(g, 560);
  m.hoyo(g, 385, u);
  m.hoyo(g, 565, u);
  m.monton(g, 385, u);
  m.monton(g, 568, k.suave(k.tramo(t, f.t("dos"), f.t("carne"))));
  m.perro(g, {
    x: xPerro, fase: t * 1.7, marcha: 0.9 * (1 - paso), t, cola: 0.75, cuelloBaja: 0.25 + 0.35 * u,
    cabeza: { ang: 0.15 * u, oreja: 0.2, ojo: 0.1 },
  });
  m.ambiente(g, 0.45);
  m.cierra(g, 0.4);
}
