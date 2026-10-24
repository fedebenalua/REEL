// «Shut the cold valve on the inlet pipe.»
import * as k from "#kit";
import { v } from "#voz";
import { valvula } from "../cosas.js";
import { camara, cuarto, guante, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = (voz) => voz.frase(5).inicio;
export const entrada = "corte";

const f = v.frase(5);
const Tv = f.t("valve");
const fin = v.frase(6).inicio;
const CAM = [
  [f.inicio, { x: 0, y: 10, s: 1.9 }],
  [Tv, { x: 0, y: 0, s: 2.15 }],
  [fin, { x: 0, y: 0, s: 2.1 }],
];

export function dibuja(g, t) {
  const u = 1 - k.suave(k.tramo(t, f.inicio + 0.05, f.t("pipe")));
  g.save();
  camara(g, rutaCam(t, CAM));
  cuarto(g, "servicio");
  valvula(g, 0, 40, u, "#1f8cff");
  const mano = k.suave(k.tramo(t, f.inicio, Tv));
  guante(g, 150, k.mez(160, 20, 1 - u), 0.9 - u * 1.4, 1.25, mano);
  g.restore();
  viñeta(g, 0.4);
  velo(g, 0.7);
}
