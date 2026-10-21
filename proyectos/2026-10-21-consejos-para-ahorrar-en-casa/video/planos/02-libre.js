// «Uno: deja el radiador libre…» — la ropa sale volando; el calor sube libre.
import * as k from "#kit";
import { v } from "#voz";
import {
  vista, camino2D, pared, suelo, radiador, prenda, velo, vineta,
} from "../mundo.js";

const { suave: su, tramo: tr } = k;
const F = v.frase(3);
export const desde = "Uno";
export const entrada = "corte";

const cam = camino2D([
  [F.inicio, [1.2, 0, 20]],
  [F.t("libre"), [1.35, 0, 0]],
  [F.t("tapas"), [1.25, 0, 10]],
  [F.t("circula"), [1.15, 0, -20]],
  [F.fin, [1.1, 0, -40]],
]);

const items = [
  ["camiseta", -80, -30, 0.1],
  ["pantalon", 40, -10, -0.2],
  ["camiseta", 120, 10, 0.3],
  ["calcetin", -40, 20, -0.5],
  ["pantalon", -160, 0, 0.15],
  ["calcetin", 180, -20, 0.8],
];

export function dibuja(g, t) {
  pared(g, "255,140,80");
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  suelo(g);

  const libre = su(tr(t, F.t("libre") - 0.1, F.t("libre") + 0.5));
  const tapa = 1 - libre;
  const mal = su(tr(t, F.t("tapas") - 0.05, F.t("tapas") + 0.4)) * (1 - libre * 0.3);

  radiador(g, t, {
    calor: 0.7 + 0.25 * libre + 0.08 * Math.sin(t * 4),
    bloqueado: Math.max(tapa * 0.9, mal * 0.7),
    w: 560, h: 300,
  });
  // después de libre: la cámara late un poco con el calor
  if (libre > 0.7) {
    g.save();
    g.globalCompositeOperation = "lighter";
    k.brillo(g, 0, -180, 180 + 40 * Math.sin(t * 5), "255,160,80", 0.35 * libre);
    g.restore();
  }

  for (let i = 0; i < items.length; i++) {
    const [tipo, x0, y0, rot0] = items[i];
    const vuela = su(tr(t, F.t("libre") - 0.05 + i * 0.04, F.t("libre") + 0.55 + i * 0.05));
    const ang = (i - 2.5) * 0.35;
    const x = x0 + Math.cos(ang - 0.4) * vuela * (420 + i * 40);
    const y = y0 - vuela * (500 + i * 60) + Math.sin(t * 3 + i) * 10 * vuela;
    const rot = rot0 + vuela * (1.2 + i * 0.3);
    const al = 1 - su(tr(t, F.t("libre") + 0.35 + i * 0.04, F.fin - 0.1));
    prenda(g, tipo, x, y, rot, 1.1, Math.max(0, al));
  }

  // flash de «tapas»: ropa vuelve un instante
  if (mal > 0.05 && libre < 0.85) {
    prenda(g, "camiseta", -40, -50, 0.2, 1.2, mal * 0.7);
  }

  velo(g, 0.45);
  vineta(g, 0.4);
}
