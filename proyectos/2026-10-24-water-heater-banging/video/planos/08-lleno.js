// «Upstairs, the faucet stops spitting and runs steady.»
import * as k from "#kit";
import { v } from "#voz";
import { grifo } from "../cosas.js";
import { camara, cuarto, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = (voz) => voz.frase(11).inicio;
export const entrada = "corte";

const f = v.frase(11);
const Ts = f.t("steady");
const fin = v.frase(12).inicio;
const CAM = [
  [f.inicio, { x: 170, y: 50, s: 1.55 }],
  [f.t("stops"), { x: 200, y: 70, s: 1.7 }],
  [Ts, { x: 210, y: 80, s: 1.68 }],
  [fin, { x: 210, y: 80, s: 1.64 }],
];

export function dibuja(g, t) {
  const escupe = 1 - k.suave(k.tramo(t, f.t("stops"), Ts));
  g.save();
  camara(g, rutaCam(t, CAM));
  cuarto(g, "bano");
  grifo(g, -10, 40, t, { abierto: 1, calido: 0.35, escupe });
  g.restore();
  viñeta(g, 0.38);
  velo(g, 0.68);
}
