// El cubo, las tuercas a la izquierda, el tubo fuera, y a mano otra vez.
import * as k from "#kit";
import { v } from "#voz";
import { armario } from "../armario.js";
import { camara, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = "bucket";

const f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8);
const Tbucket = f6.t("bucket"), Tturn = f6.t("turn"), Tleft = f6.t("left");
const Toff = f7.t("off"), Thair = f7.t("hair"), Tdrop = f7.t("drop");
const Twash = f8.t("washers"), Thand = f8.t("hand"), Tdrip = f8.t("drips");

const CAM = [
  [Tbucket, { x: 500, y: 980, s: 0.98 }],
  [Tleft, { x: 480, y: 760, s: 1.22 }],
  [Toff, { x: 520, y: 900, s: 1.05 }],
  [Tdrop, { x: 460, y: 1100, s: 1.08 }],
  [Twash, { x: 480, y: 780, s: 1.24 }],
  [Tdrip, { x: 430, y: 760, s: 1.32 }],
  [f8.fin, { x: 430, y: 760, s: 1.32 }],
];

export function dibuja(g, t) {
  const cubo = k.suave(k.tramo(t, Tbucket - 0.2, Tbucket + 0.45));
  const giro = k.suave(k.tramo(t, Tturn - 0.05, Tleft + 0.25));
  const fuera = k.suave(k.tramo(t, Toff - 0.15, Toff + 0.4));
  const vuelve = k.suave(k.tramo(t, Twash - 0.15, Twash + 0.45));
  const bajaPx = 250 * fuera * (1 - vuelve);
  const cae = k.suave(k.tramo(t, Thair - 0.1, Tdrop + 0.55));
  const aran = k.suave(k.tramo(t, Twash - 0.05, Twash + 0.4));
  const aprieta = k.suave(k.tramo(t, Thand - 0.1, Thand + 0.55));
  const extra = k.suave(k.tramo(t, Tdrip + 0.15, Tdrip + 0.55));
  const goteo = k.tramo(t, Tdrip - 0.05, Tdrip + 0.7) * (1 - extra);
  const mano = k.suave(k.tramo(t, Tturn - 0.3, Tturn + 0.2)) * (1 - k.suave(k.tramo(t, Toff - 0.1, Toff + 0.2)));
  g.save();
  camara(g, rutaCam(t, CAM));
  armario(g, t, {
    cubo, giro, bajaPx, cae, aran,
    aprieta: Math.min(1, aprieta + extra * 0.35),
    goteo, mano, peloTubo: 1 - cae, verde: 0, tel: 0,
  });
  g.restore();
  velo(g, 0.48);
  viñeta(g, 0.4);
}
