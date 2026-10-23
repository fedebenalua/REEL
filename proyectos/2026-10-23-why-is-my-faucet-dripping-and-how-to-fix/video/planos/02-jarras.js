// «One drip a second wastes over three thousand gallons a year.» (desde «wastes»)
// Una lluvia de garrafas de agua que cae y se amontona; el contador sube hasta 3.000 en «gallons».
import * as k from "#kit";
import { v } from "#voz";
import { gradV, velo, viñeta } from "../mundo.js";
import { pila } from "../jarras.js";

export const desde = (vz) => vz.frase(2).t("wastes") - 0.04;
export const FIN = v.frase(3).inicio - 0.04;
const { suave: su, tramo: tr } = k;
const Tgal = v.frase(2).t("gallons"), Tw = v.frase(2).t("wastes");

export function dibuja(g, t) {
  g.fillStyle = gradV(g, 0, 1920, [[0, "#0b3a55"], [0.5, "#0d5a78"], [1, "#062c42"]]); g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 300, 300, 1800, "170,236,255", 0.22);
  k.brillo(g, 800, 1300, 1400, "90,200,255", 0.14);
  // el suelo
  g.fillStyle = gradV(g, 1420, 1920, [[0, "#0a2c44"], [1, "#03111c"]]); g.fillRect(0, 1420, 1080, 500);
  g.fillStyle = "rgba(190,240,255,0.5)"; g.fillRect(0, 1418, 1080, 4);
  pila(g, t, { t0: Tw - 0.2, dur: 2.2, base: 1418, filas: 7, w: 128, h: 142, x0: 540 });
  const n = Math.round(3000 * su(tr(t, Tw + 0.15, Tgal + 0.15)));
  const a = su(tr(t, Tw - 0.05, Tw + 0.2));
  k.pastilla(g, 540, 700, n.toLocaleString("en-US"), "gallons", "150,225,255", a, 128);
  velo(g, 0.3); viñeta(g, 0.4);
}
