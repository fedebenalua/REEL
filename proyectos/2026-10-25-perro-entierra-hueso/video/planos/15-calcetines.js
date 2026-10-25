// «...le entierra los calcetines detrás del sofá.»
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vz) => vz.frase(12).t("calcetines");
export const entrada = "corte";

const f = v.frase(12);

export function dibuja(g, t) {
  const u = k.suave(k.tramo(t, f.t("calcetines"), f.t("sofa") - 0.05));
  const cam = { Z: k.mez(5.6, 6.2, u), cx: k.mez(450, 500, u), cy: -40 };
  m.salon(g, cam, t, 0.2);
  m.ponVista(g, cam, 0.72);
  m.persona(g, { x: 180, paso: 0, recto: 1, t, fase: 0.2 });
  m.ponVista(g, cam);
  const info = m.perro(g, {
    x: 420, fase: 0.05, marcha: 0, t, cola: 0.75, cuelloBaja: 0.25 + 0.45 * u,
    cabeza: { ang: 0.1 + 0.4 * u, abre: 0.1, oreja: 0.3 },
  });
  m.calcetin(g, k.mez(info.nariz[0] + 8, 530, u), -2, 0.5 - u * 0.8, 1);
  m.cojin(g, 490, 8, 140, 74);
  m.cierra(g, 0.4);
}
