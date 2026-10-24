// «Only then do you flip the breaker back on.»
import * as k from "#kit";
import { v } from "#voz";
import { cuadro, tanque } from "../cosas.js";
import { camara, cuarto, guante, rutaCam, suelo, velo, viñeta } from "../mundo.js";

export const desde = (voz) => voz.frase(12).inicio;
export const entrada = "corte";

const f = v.frase(12);
const Tf = f.t("flip");
const fin = v.frase(13).inicio;
const CAM = [
  [f.inicio, { x: -60, y: 40, s: 1.48 }],
  [Tf, { x: 700, y: 0, s: 1.9 }],
  [fin, { x: 710, y: -10, s: 1.92 }],
];

export function dibuja(g, t) {
  const on = k.suave(k.tramo(t, Tf, f.t("on")));
  const mano = k.suave(k.tramo(t, f.t("then"), Tf));
  g.save();
  camara(g, rutaCam(t, CAM));
  cuarto(g, "servicio");
  suelo(g, 560, "#1a120c");
  tanque(g, -80, 40, { calor: 0, nivel: 1, esc: 0.95 });
  cuadro(g, 700, 0, on);
  guante(g, 760, k.mez(70, -100, on), 0.35 - on * 0.7, 1.15, mano);
  g.restore();
  viñeta(g, 0.4);
  velo(g, 0.7);
}
