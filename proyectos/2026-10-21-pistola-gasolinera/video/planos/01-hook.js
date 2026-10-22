// «¿Cómo sabe la pistola de la gasolinera que tu depósito está lleno, si no tiene ni un cable?»
// «Y si sigues apretando cuando salta, lo paga tu coche.»
// Apertura «inundación»: desde el fotograma 0, dentro del cuello del depósito (el coche, de cristal), la punta de la
// pistola echa un chorro y la gasolina sube a toda prisa, con burbujas, hacia la cámara, que sube con ella. En «lleno»
// tapa la punta: clac. Luego la cámara se aleja hasta la pistola entera, que se vuelve de cristal (lo demás, en
// ../hook.js). La otra apertura, aperturas/01-viaje.js.
import * as k from "#kit";
import * as m from "../mundo.js";
import * as h from "../hook.js";

export const desde = 0;

const { suave: su, tramo: tr } = k;
const camDentro = (t) => {
  const u = tr(t, 0, h.Tclac), s = h.nivel(t), sup = m.enCuello(s), p = m.PUNTA;
  const w = Math.pow(u, 0.7);
  return [Math.exp(k.mez(Math.log(5.2), Math.log(6.5), su(u))), k.mez((sup.x + p.x) / 2, p.x + 10, w), k.mez((sup.y + p.y) / 2, p.y + 30, w)];
};
export function camara(t) {
  let c = t < h.Tsi - 0.1 ? camDentro(Math.min(t, h.Tclac)) : m.mezCam(camDentro(h.Tclac), h.CAM_PISTOLA, su(tr(t, h.Tsi - 0.1, h.Tcab + 0.15)));
  return h.camDespues(t, c);
}
export function dibuja(g, t) {
  const rayos = 1 - 0.65 * su(tr(t, h.Tlo - 0.1, h.Tcoc + 0.2));
  const cristal = su(tr(t, h.Tsi, h.Tcab + 0.05));
  h.escena(g, t, camara(t), { rayos, cristal, filtroRojo: 0.9 * su(tr(t, h.Tcoc - 0.05, h.Tcoc + 0.25)) });
}
