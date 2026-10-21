// «¿Sabías que cada mes se te escapan hasta cien euros por cinco agujeros que ni ves?» · «¿Dónde están?»
// El cubo de monedas visto muy de cerca, con los chorros saliendo hacia la cámara; se aleja y se ven los cinco
// agujeros, cada uno con su color; luego ya no se ven y los chorros se agotan.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, cubo, chorro, fondo, velo, CUBO, COL } from "../mundo.js";

export const desde = 0;

const F1 = v.frase(1), F2 = v.frase(2);
const Tcinco = F1.t("cinco"), Tni = F1.t("ni"), Tcien = F1.t("cien"), Tdonde = F2.t("donde"), Tfin = F2.fin;
const { tramo: tr, suave: su } = k;

const cam = camino2D([[0, [3.0, 540, 1130]], [2.95, [0.95, 540, 1075]], [Tdonde, [0.95, 540, 1075]], [Tfin, [1.1, 540, 1110]]]);

// cada agujero se enciende en su momento («cinco agujeros»), y se apaga cuando la voz dice «ni ves»
const brilla = (i, t) => {
  const t0 = Tcinco - 0.02 + i * 0.14;
  const base = 0.55, sube = su(tr(t, t0, t0 + 0.2)), apaga = su(tr(t, Tni + 0.05, Tni + 0.55));
  return Math.max(0, (base + (1 - base) * sube) * (1 - apaga));
};

export function dibuja(g, t) {
  fondo(g, "255,196,90", 1, 1000);
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  cubo(g, t, { brillo: CUBO.agujeros.map((_, i) => brilla(i, t)), monton: 1 });
  // los chorros: del primer fotograma ya salen; se agotan con «ni ves», para que todo repose antes del corte
  const env = (tn) => 1 - su(tr(tn, Tni - 0.1, Tni + 0.7));
  CUBO.agujeros.forEach((h, i) => chorro(g, t, h, { semilla: i + 1, rate: 20, r0: 30, env, color: COL[h.col], fuerza: 1.15 }));
  sinVista(g);
  velo(g, 0.7);
  // «−100 €» cuando la voz dice «cien»
  const a = su(tr(t, Tcien - 0.1, Tcien + 0.15)) * (1 - su(tr(t, Tni - 0.1, Tni + 0.25)));
  k.pastilla(g, 540, 640, "−100", "€", "255,120,110", a, 100);
}
