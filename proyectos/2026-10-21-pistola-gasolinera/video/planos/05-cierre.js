// «Envíaselo a ese amigo que siempre redondea hasta los cincuenta euros.»
// El surtidor de noche, grande (corte en «Envíaselo»): la pantalla con los euros parados en 47,83; en «redondea»
// suben a tirones, y en «cincuenta» llegan a 50,00 y se encienden en verde.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (vz) => vz.frase(11).inicio;

const { suave: su, tramo: tr, mez } = k;
const f = v.frase(11);
const T0 = f.inicio, Tred = f.t("redondea"), Tcin = f.t("cincuenta"), Fin = v.duracion;
const P = m.PANTALLA, cP = [(P.x0 + P.x1) / 2, (P.y0 + P.y1) / 2];
// los tirones del gatillo: cada uno sube un poco los euros
const TIRONES = [[Tred - 0.05, 47.83, 48.62], [Tred + 0.35, 48.62, 49.41], [Tcin - 0.15, 49.41, 50.0]];

export function dibuja(g, t) {
  let euros = 47.83;
  for (const [t0, a, b] of TIRONES) if (t > t0) euros = mez(a, b, su(tr(t, t0, t0 + 0.28)));
  euros = Math.round(euros * 100) / 100;
  const verde = su(tr(t, Tcin + 0.1, Tcin + 0.35));
  const Z = mez(0.95, 1.18, su(tr(t, T0, Fin))), cy = mez(cP[1] + 80, cP[1] + 10, su(tr(t, T0, Fin)));
  m.fondo(g, t, 0, cy * Z);
  m.vista(g, Z, cP[0] + 120, cy);
  m.suelo(g, t, 0);
  m.surtidor(g, t, { euros, litros: euros / 1.619, verde });
  m.manguera(g, t, {});
  m.sinVista(g);
  m.destello(g, 540, 960 + (P.y0 + 200 - cy) * Z, 0.35 * k.pulso(t, Tcin + 0.2, 0.12), "120,255,150");
  m.vineta(g, 0.5);
  m.velo(g, 0.55);
}
