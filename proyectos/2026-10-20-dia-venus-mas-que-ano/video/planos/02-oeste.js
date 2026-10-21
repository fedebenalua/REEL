// «Y que allí el Sol sale por el oeste.»
// Un sitio nuevo: el suelo de Venus, bajo su cielo espeso y naranja. Una cámara fija que se acerca un poco.
// - de «Y» a «sale»: el Sol sube por la izquierda, que es el oeste.
// - «oeste»: se enciende el rótulo «OESTE» con su flecha, junto al Sol, y el «ESTE» queda apagado en el otro lado.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, superficie, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(2).inicio;

const { suave: su, tramo: tr } = k;
const f = v.frase(2);
const T0 = f.inicio, Toes = f.t("oeste"), FIN = v.frase(3).inicio;
const cam = camino2D([[T0, [1.0, 0, 20]], [FIN, [1.08, -60, 10]]]);

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const u = 0.03 + 0.15 * su(tr(t, T0, FIN - 0.3));
  const s = superficie(g, t, u);
  // los rótulos en el suelo
  const a = su(tr(t, Toes - 0.05, Toes + 0.25));
  g.save();
  g.font = "800 120px Figtree"; g.textBaseline = "middle"; g.textAlign = "center";
  g.fillStyle = "rgba(255,255,255,0.16)"; g.fillText("ESTE →", 250, 640);
  g.shadowColor = "rgba(255,150,40,0.95)"; g.shadowBlur = 40 * a; g.fillStyle = `rgba(255,${Math.round(240 - 70 * a)},${Math.round(200 - 140 * a)},${0.35 + 0.65 * a})`;
  g.font = `800 ${Math.round(120 + 26 * a)}px Figtree`; g.fillText("← OESTE", -230, 640);
  g.restore();
  // un fogonazo de luz al decir oeste
  const ff = k.pulso(t, Toes + 0.12, 0.16);
  if (ff > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, s.x, s.y, 1300, "255,200,110", 0.5 * ff); g.restore(); }
  sinVista(g);
  velo(g, 0.35);
  vineta(g, 0.45);
}

export const momentos = { oeste: Toes };
