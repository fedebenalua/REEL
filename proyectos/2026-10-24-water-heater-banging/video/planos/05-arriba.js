// «Open a hot faucet upstairs, and leave it running.»
import * as k from "#kit";
import { v } from "#voz";
import { grifo } from "../cosas.js";
import { camara, cuarto, guante, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = (voz) => voz.frase(6).inicio;
export const entrada = "corte";

const f = v.frase(6);
const Tu = f.t("upstairs");
const fin = v.frase(7).inicio;
const CAM = [
  [f.inicio, { x: 120, y: 30, s: 1.5 }],
  [Tu, { x: 180, y: 60, s: 1.68 }],
  [fin, { x: 190, y: 70, s: 1.64 }],
];

export function dibuja(g, t) {
  const abierto = k.suave(k.tramo(t, f.inicio, Tu + 0.15));
  const mano = 1 - k.suave(k.tramo(t, f.t("leave"), f.t("running")));
  g.save();
  camara(g, rutaCam(t, CAM));
  cuarto(g, "bano");
  grifo(g, -20, 60, t, { abierto, calido: 1, escupe: 0 });
  guante(g, -120, k.mez(80, -20, abierto), -0.5, 1.15, mano);
  g.restore();
  viñeta(g, 0.38);
  velo(g, 0.68);
}
