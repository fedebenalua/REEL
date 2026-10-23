// «...turn the water on slowly»
// Bajo el fregadero otra vez: la llave gira despacio y el agua azul vuelve a subir por los tubos.
import * as k from "#kit";
import { v } from "#voz";
import { dibujaBajo } from "../bajo.js";
import { velo, viñeta } from "../mundo.js";

const F10 = v.frase(10);
export const desde = F10.t("turn") - 0.14;
export const FIN = F10.t("and") - 0.04;
const { suave: su, tramo: tr } = k;
const Tturn = F10.t("turn"), Tslow = F10.t("slowly");
const CAM = { x: 235, y: 330, s: 1.45 };

export function dibuja(g, t) {
  const giro = -4 * Math.PI * su(tr(t, Tturn - 0.05, Tslow + 0.55));
  const flujo = su(tr(t, Tturn + 0.35, Tslow + 0.55));
  dibujaBajo(g, t, { cam: CAM, giro, flujo, resalta: k.pulso(t, Tturn + 0.1, 0.2) });
  const on = su(tr(t, Tturn + 0.5, Tturn + 0.75));
  k.etiqueta(g, 70, 1330, "water ON", "150,255,190", on, 60);
  velo(g, 0.45); viñeta(g, 0.45);
}
