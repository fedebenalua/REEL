// «How do you unclog a sink full of water, without chemicals?»
// Fotograma 0: la lámina de agua salta el borde cercano del lavabo. Luego el lavabo
// entero, y por dentro del tubo el químico solo abre un agujero.
import * as k from "#kit";
import { v } from "#voz";
import { lavabo } from "../lavabo.js";
import { camara, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tagua = f1.t("water"), Tfin1 = f1.fin;
const Tquema = f2.t("burns"), Thoyo = f2.t("hole"), Tqueda = f2.t("stays");
const Tpelo = f3.t("wad"), Tcurva = f3.t("curved");

const CAM = [
  [0.04, { x: 540, y: 1560, s: 1.72 }],
  [Tagua, { x: 540, y: 1140, s: 1.02 }],
  [Tfin1, { x: 560, y: 1220, s: 1.12 }],
  [Tquema, { x: 540, y: 980, s: 1.08 }],
  [Thoyo, { x: 540, y: 1020, s: 1.14 }],
  [Tpelo, { x: 540, y: 1060, s: 1.26 }],
  [Tcurva - 0.28, { x: 540, y: 1100, s: 1.4 }],
  [Tcurva, { x: 540, y: 1100, s: 1.4 }],
];

export function dibuja(g, t) {
  const dentro = k.suave(k.tramo(t, Tfin1, Tquema - 0.15));
  const botella = k.suave(k.tramo(t, Tfin1 + 0.15, Tquema));
  const chorroQ = k.suave(k.tramo(t, Tquema - 0.08, Thoyo)) * (1 - k.suave(k.tramo(t, Tqueda + 0.25, Tqueda + 0.55)));
  const agujero = k.suave(k.tramo(t, Thoyo - 0.08, Thoyo + 0.4));
  g.save();
  camara(g, rutaCam(t, CAM));
  lavabo(g, t, {
    nivel: 1,
    derrame: 1,
    dentro,
    agujero,
    chorroQ,
    botella,
    grifo: 1,
  });
  g.restore();
  velo(g, 0.62);
  viñeta(g, 0.38);
}
