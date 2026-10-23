// «That's a hundred and eighty showers, lost to one tiny rubber washer.» (hasta «tiny»)
// Una alcachofa enorme echa agua; el contador llega a 180; el agua baja al desagüe y la cámara se traga por él hasta
// quedarse a oscuras.
import * as k from "#kit";
import { v } from "#voz";
import { dibujaDucha } from "../ducha.js";
import { rutaCam, velo, viñeta } from "../mundo.js";

export const desde = (vz) => vz.frase(3).inicio - 0.04;
export const FIN = v.frase(3).t("tiny") - 0.04;
const { suave: su, tramo: tr } = k;
const F = v.frase(3), T0 = F.inicio, Thund = F.t("hundred"), Teighty = F.t("eighty"), Tlost = F.t("lost");

const CAMS = [[T0, { x: 40, y: 400, s: 0.84 }], [Tlost - 0.1, { x: 40, y: 400, s: 0.84 }], [Tlost + 0.5, { x: 40, y: 1160, s: 1.2 }], [FIN - 0.02, { x: 40, y: 1296, s: 5 }]];

export function dibuja(g, t) {
  dibujaDucha(g, t, { cam: rutaCam(t, CAMS), giro: tr(t, Tlost - 0.2, FIN) * 1.2 });
  const n = Math.round(180 * su(tr(t, Thund - 0.05, Teighty + 0.3)));
  const a = su(tr(t, T0 + 0.1, Thund)) * (1 - su(tr(t, Tlost - 0.1, Tlost + 0.3)));
  k.pastilla(g, 540, 1020, String(n), "showers", "150,235,255", a, 140);
  velo(g, 0.34); viñeta(g, 0.4);
  const neg = su(tr(t, FIN - 0.4, FIN));
  if (neg > 0) { g.fillStyle = `rgba(2,6,10,${neg})`; g.fillRect(0, 0, 1080, 1920); }
}
