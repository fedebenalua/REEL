// La otra apertura del hook: «viaje». Desde el fotograma 0, la pantalla del surtidor con los euros corriendo; la cámara
// se lanza por la manguera (con la gasolina dorada corriendo dentro) hasta la pistola metida en el coche. En «lleno»,
// clac: el gatillo salta. En «cable», la pistola y el coche se vuelven de cristal. Lo demás, en ../hook.js.
import * as k from "#kit";
import * as m from "../mundo.js";
import * as h from "../hook.js";

export const desde = 0;

const { suave: su, tramo: tr } = k;
const P = m.PANTALLA, cP = [(P.x0 + P.x1) / 2, (P.y0 + P.y1) / 2];
const T1 = 0.45, T2 = 1.9;
function camViaje(t) {
  if (t < T1) { const u = su(tr(t, 0, T1)), a = m.puntoManguera(0); return m.mezCam([1.25, cP[0], cP[1] + 150], [2.3, a.x, a.y], u); }
  if (t < T2) { const u = tr(t, T1, T2), w = 0.5 - 0.5 * Math.cos(Math.PI * u), p = m.puntoManguera(w); return [2.3, p.x, p.y]; }
  const e = m.puntoManguera(1); return m.mezCam([2.3, e.x, e.y], h.CAM_PISTOLA, su(tr(t, T2, T2 + 0.6)));
}
export function camara(t) {
  let c = camViaje(Math.min(t, T2 + 0.6));
  return h.camDespues(t, c);
}
export function dibuja(g, t) {
  const rayos = su(tr(t, h.Tsi, h.Tcab + 0.05)) * (1 - 0.65 * su(tr(t, h.Tlo - 0.1, h.Tcoc + 0.2)));
  const cristal = su(tr(t, h.Tsi, h.Tcab + 0.05));
  h.escena(g, t, camara(t), { rayos, cristal, oro: 1 - cristal, filtroRojo: 0.9 * su(tr(t, h.Tcoc - 0.05, h.Tcoc + 0.25)) });
}
