// El lavabo del amigo, lleno y saltando el borde, igual que al empezar.
import * as k from "#kit";
import { v } from "#voz";
import { lavabo } from "../lavabo.js";
import { camara, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = "send";

const f11 = v.frase(11);
const Tsend = f11.t("send"), Tfriend = f11.t("friend"), Tdrain = f11.t("drain");

const CAM = [
  [Tsend, { x: 540, y: 1180, s: 1.02 }],
  [Tfriend, { x: 540, y: 1320, s: 1.2 }],
  [Tdrain, { x: 540, y: 1520, s: 1.6 }],
  [v.duracion, { x: 540, y: 1580, s: 1.75 }],
];

export function dibuja(g, t) {
  g.save();
  camara(g, rutaCam(t, CAM));
  lavabo(g, t, { nivel: 1, derrame: 1, grifo: 1, dentro: 0 });
  g.restore();
  velo(g, 0.6);
  viñeta(g, 0.36);
}
