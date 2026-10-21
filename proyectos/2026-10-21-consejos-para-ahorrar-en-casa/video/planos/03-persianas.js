// «Dos: por la noche, cierra persianas y cortinas…»
import * as k from "#kit";
import { v } from "#voz";
import {
  vista, camino2D, pared, ventanaNoche, velo, vineta,
} from "../mundo.js";

const { suave: su, tramo: tr } = k;
const F = v.frase(4);
export const desde = "Dos";
export const entrada = "corte";

const cam = camino2D([
  [F.inicio, [1.0, 0, 40]],
  [F.t("persianas"), [1.2, 0, 0]],
  [F.t("escapa"), [1.35, 0, -20]],
  [F.fin, [1.25, 0, 0]],
]);

export function dibuja(g, t) {
  // noche más fría
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#0a0e1c"); bg.addColorStop(0.5, "#141a2e"); bg.addColorStop(1, "#080a14");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);

  const cierra = su(tr(t, F.t("persianas") - 0.15, F.t("persianas") + 0.7));
  const cortina = su(tr(t, F.t("cortinas") - 0.1, F.t("cortinas") + 0.55));
  const calorSale = 0.85 * (1 - cierra * 0.75) * (1 - cortina * 0.5)
    + 0.55 * su(tr(t, F.t("escapa") - 0.1, F.t("escapa") + 0.4)) * (1 - cierra);

  ventanaNoche(g, t, {
    w: 480, h: 580,
    persiana: cierra,
    cortina: Math.max(cortina, cierra * 0.4),
    calorSale: Math.max(0.05, calorSale),
  });

  velo(g, 0.5);
  vineta(g, 0.45);
}
