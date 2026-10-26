// Se desenchufa antes de tocar el agua.
import * as k from "#kit";
import { v } from "#voz";
import { camara, enchufePared, quieto, velo, viñeta } from "../mundo.js";

export const desde = "first";
const fin = v.t("pull") - 0.04;
const f5 = v.frase(5);

export function dibuja(g, t) {
  const tq = quieto(t, fin);
  const fuera = k.suave(k.tramo(tq, f5.t("unplug") - 0.05, f5.t("unplug") + 0.38));
  camara(g, { x: 140, y: 40, s: 1.35 });
  enchufePared(g, fuera, tq);
  velo(g, 0.86);
  viñeta(g, 0.3);
}
