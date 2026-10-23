// «under the sink» … «Call a plumber.»
// El tubo curvo dentro del armario. Si ya hay químico, la mano se para.
import * as k from "#kit";
import { v } from "#voz";
import { armario } from "../armario.js";
import { camara, rutaCam, velo, viñeta } from "../mundo.js";

export const desde = "under";

const f3 = v.frase(3), f4 = v.frase(4);
const Tstop = f4.t("stop"), Topen = f4.t("open"), Tplom = f4.t("plumber");
const Tcleaner = f4.t("cleaner");

const CAM = [
  [f3.t("under"), { x: 560, y: 860, s: 1.05 }],
  [Tstop, { x: 460, y: 720, s: 1.28 }],
  [Topen, { x: 520, y: 800, s: 1.12 }],
  [Tplom, { x: 640, y: 980, s: 0.98 }],
  [f4.fin, { x: 640, y: 980, s: 0.98 }],
];

export function dibuja(g, t) {
  const verde = k.suave(k.tramo(t, Tcleaner - 0.1, Tcleaner + 0.45));
  const mano = k.suave(k.tramo(t, Tstop - 0.55, Tstop + 0.05));
  const atras = k.suave(k.tramo(t, Topen - 0.05, Topen + 0.45));
  const tel = k.suave(k.tramo(t, Tplom - 0.1, Tplom + 0.35));
  g.save();
  camara(g, rutaCam(t, CAM));
  armario(g, t, { verde, mano, atras, tel, peloTubo: 1, cubo: 0 });
  g.restore();
  velo(g, 0.5);
  viñeta(g, 0.45);
}
