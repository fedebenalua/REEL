// Si todos los desagües van lentos, el atasco es la bajante.
import * as k from "#kit";
import { v } from "#voz";
import { casa } from "../casa.js";
import { camara, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = "every";

const f10 = v.frase(10);
const Tev = f10.t("every"), Tslow = f10.t("slow"), Tmain = f10.t("main"), Tplom = f10.t("plumber");

const CAM = [
  [Tev, { x: 400, y: 560, s: 1.7 }],
  [Tslow, { x: 520, y: 900, s: 0.92 }],
  [Tmain, { x: 620, y: 1040, s: 1.05 }],
  [Tplom, { x: 480, y: 980, s: 0.95 }],
  [f10.fin, { x: 480, y: 980, s: 0.95 }],
];

export function dibuja(g, t) {
  const tel = k.suave(k.tramo(t, Tplom - 0.08, Tplom + 0.35));
  g.save();
  camara(g, rutaCam(t, CAM));
  casa(g, t, { tel });
  g.restore();
  velo(g, 0.5);
  viñeta(g, 0.4);
}
