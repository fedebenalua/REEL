// El mundo entero dibujado con una cámara: la gasolinera, el coche y la pistola, con lo que toque de cada cosa.
// Lo usan los planos que no son el hook.
import * as k from "#kit";
import * as m from "./mundo.js";

export function escena(g, t, cam, e = {}) {
  const { rayos = 1, cristal = 1, euros = 0, flujoSurt = 0, tanque = {}, manguera = {}, cuello = {}, chorro = 0, deposito = {}, tubo = {}, filtro = {}, pistola = {}, despues = null, velo = 0.55 } = e;
  const [Z, cx, cy] = cam;
  m.fondo(g, t, rayos, cy * Z);
  m.vista(g, Z, cx, cy);
  m.suelo(g, t, rayos);
  m.tanque(g, t, { al: rayos, ...tanque });
  m.surtidor(g, t, { euros, litros: euros / 1.619, flujo: flujoSurt });
  m.coche(g, t, { rayos });
  if (rayos > 0.01) {
    m.deposito(g, t, { al: rayos, nivel: 0.86, hueco: 1, ...deposito });
    m.tuboVapor(g, t, { al: rayos, vapor: 0.6, ...tubo });
    m.filtro(g, t, { al: rayos, vapor: 0.6, ...filtro });
    m.cuello(g, t, { al: rayos, nivel: 380, agita: 0.3 + 0.7 * chorro, ...cuello });
    m.chorro(g, t, { fuerza: chorro, nivel: cuello.nivel ?? 380 });
  }
  m.manguera(g, t, { rayos: cristal, lleno: 1, ...manguera });
  m.pistola(g, t, { cristal, ...pistola });
  if (despues) despues(g);
  m.sinVista(g);
  m.vineta(g, 0.5);
  m.velo(g, velo);
}
