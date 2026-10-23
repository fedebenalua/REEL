// «So here's the fix. First, shut off the water under the sink, then open the faucet to drain it.» (hasta «open»)
// Bajo el fregadero: la cámara entra en el armario; el agua azul sube por los tubos; en «shut» las dos llaves giran y el
// agua se corta.
import * as k from "#kit";
import { v } from "#voz";
import { dibujaBajo, VALVULA } from "../bajo.js";
import { rutaCam, velo, viñeta } from "../mundo.js";

export const desde = (vz) => vz.frase(6).inicio - 0.04;
export const FIN = v.frase(6).t("open") - 0.04;
const { suave: su, tramo: tr } = k;
const F = v.frase(6), T0 = desde(v), Tshut = F.t("shut"), Twater = F.t("water");

const CAMS = [[T0, { x: 0, y: 40, s: 0.6 }], [Tshut - 0.55, { x: 235, y: 330, s: 1.45 }], [FIN, { x: 235, y: 330, s: 1.45 }]];

export function dibuja(g, t) {
  const cam = rutaCam(t, CAMS);
  const giro = 4 * Math.PI * su(tr(t, Tshut, Tshut + 0.85));
  const flujo = 1 - su(tr(t, Tshut + 0.35, Tshut + 1.25));
  dibujaBajo(g, t, { cam, giro, flujo, resalta: k.pulso(t, Tshut + 0.15, 0.2) });
  const off = su(tr(t, Tshut + 1.1, Tshut + 1.35));
  k.etiqueta(g, 70, 1330, "water OFF", "255,120,110", off, 60);
  velo(g, 0.45); viñeta(g, 0.45);
}
