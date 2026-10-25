// «...de más de medio kilo cada uno.»
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vz) => vz.frase(5).t("medio");
export const entrada = "corte";

const f = v.frase(5);
const fin = v.frase(6).inicio;

export function dibuja(g, t) {
  const cam = { Z: 5.5, cx: k.mez(440, 500, k.suave(k.tramo(t, f.t("medio"), f.t("uno")))), cy: -26 };
  m.parque(g, cam, t, 0.55);
  m.ponVista(g, cam);
  m.lecho(g, 390);
  m.lecho(g, 575);
  m.hoyo(g, 385, 1);
  m.hoyo(g, 575, 1);
  m.monton(g, 388, 1);
  m.monton(g, 572, 1);
  m.perro(g, {
    x: 470, fase: 0.15, marcha: 0, t, cola: 0.55, cuelloBaja: 0.35,
    cabeza: { ang: 0.1, oreja: 0.15 },
  });
  m.ambiente(g, 0.4);
  m.sinVista(g);
  const al = k.suave(k.tramo(t, f.t("kilo") - 0.08, f.t("kilo") + 0.22));
  const p1 = m.pantalla(cam, 388, 8);
  const p2 = m.pantalla(cam, 572, 8);
  k.pastilla(g, p1[0], 1280, "650", "g", "255,196,120", al, 78);
  k.pastilla(g, Math.min(780, p2[0]), 1280, "660", "g", "255,196,120", al, 78);
  void fin;
  m.cierra(g, 0.34);
}
