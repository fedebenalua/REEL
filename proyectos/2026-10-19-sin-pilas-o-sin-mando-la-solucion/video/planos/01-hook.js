// «Si te quedas sin pilas o siempre pierdes el mando de la tele, tengo la solución.» y «Pero primero, mira cómo
// funciona tu mando.» (el hook es del creador, con sus palabras)
// El salón de noche, con una sola cámara.
// - Fotograma 0: el salón a oscuras y una linterna que busca deprisa; en «pilas» se para sobre dos pilas tiradas en
//   el suelo, vacías (la marca roja late); en «pierdes el mando» busca en el mueble y en el suelo y no hay nada.
// - «tengo la solución»: se encienden las luces y sube un móvil con la app de mando; en «solución», un golpe de luz.
// (El creador eligió esta apertura; la otra, con las pilas cayendo y el mando volando, se quitó.)
// - «Pero primero»: el móvil se va; «mira»: el mando vuelve girando desde el fondo a su sitio; «funciona»: la cámara
//   se lanza hacia su botón del + (por ahí se entra, con un corte en «Al», dentro del mando).
import * as k from "#kit";
import { v } from "#voz";
import { CAM0, MANDO, appMando, enMando, mando, movil, pila, salon, velo } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra, sale } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tpil = f1.t("pilas"), Tpie = f1.t("pierdes"), Tman = f1.t("mando"), Tten = f1.t("tengo"), Tsol = f1.t("solucion");
const T2 = f2.inicio, Tmir = f2.t("mira"), Tfun = f2.t("funciona"), Fin = v.frase(3).inicio;
export const solucion = Tsol + 0.05;

// el mando: perdido (lejos, girando) o en su sitio
const MAS = enMando(-36, 264);
export function mandoEn(t, ida, vuelta) {
  const u = ida * (1 - vuelta);                                          // 0 en su sitio, 1 perdido al fondo
  return { X: MANDO.X + 260 * u, Y: MANDO.Y - 260 * u, Z: mez(MANDO.Z, 40, u * u), ang: MANDO.ang + 6 * u };
}
export function camara(t) {
  const z = su(tr(t, Tfun - 0.15, Fin - 0.25));
  const sFin = 14;
  return { x: mez(0, MAS[0], z), y: mez(0, MAS[1], z), z: mez(0, MANDO.Z - 10 / sFin, z * z * (3 - 2 * z)) };
}

// lo común de las dos aperturas: del móvil en adelante
export function despues(g, t, cam, op = {}) {
  const ida = op.ida ?? 1, vuelta = entra(tr(t, Tmir - 0.45, Tmir + 0.3));
  salon(g, cam, t, { encendida: 1, canal: 0, lampara: op.lampara ?? 1 });
  if (op.antes) op.antes(g);
  const M = mandoEn(t, ida, vuelta);
  mando(g, cam, t, { al: Math.min(1, 1.2 - ida * (1 - vuelta) * 0.9), pulsaVol: k.pulso(t, Fin - 0.35, 0.12) }, M);
  // el móvil con la app
  const sube = entra(tr(t, Tten - 0.25, Tsol - 0.05)), va = sale(tr(t, T2, Tmir - 0.1));
  if (sube > 0 && va < 1) {
    const br = k.pulso(t, solucion, 0.15);
    movil(g, mez(540, 1500, va), mez(2400, 1150, sube) - 400 * va, 470, mez(0.12, -0.06, sube) + 0.5 * va, appMando(br));
    k.brillo(g, 540, 1150, 1500, "200,110,255", 0.55 * br);
  }
  velo(g, 0.45);
}

const luz = k.lienzo(1080, 1920);
const HAZ = [[0, [150, 1650]], [0.45, [900, 800]], [Tpil - 0.05, [520, 1330]], [Tpil + 0.6, [540, 1320]], [Tpie, [220, 1040]], [Tpie + 0.45, [760, 1050]], [Tten - 0.35, [920, 1500]]];
const hx = k.claves(HAZ.map(([a, p]) => [a, p[0]])), hy = k.claves(HAZ.map(([a, p]) => [a, p[1]]));
const haz = (t) => [hx(t), hy(t)];

export function dibuja(g, t) {
  const on = su(tr(t, Tten - 0.2, Tten + 0.25));
  if (on >= 1) return despues(g, t, camara(t), { ida: 1 });
  // el salón con la luz encendida, en otro lienzo
  const c = luz.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  const nivel = mez(0.4, 0.06, su(tr(t, Tpil - 0.1, Tpil + 0.3)));
  despues(c, t, CAM0, { ida: 1, lampara: 0.3, antes: (c2) => { pila(c2, 470, 1300, 440, 0.25, nivel, t); pila(c2, 640, 1380, 440, -0.35, nivel, t); } });
  g.drawImage(luz, 0, 0);
  // la oscuridad, con el agujero de la linterna
  const [x, y] = haz(t), R = 300;
  const al = 0.93 * (1 - on);
  g.save();
  g.beginPath(); g.rect(0, 0, 1080, 1920); g.arc(x, y, R * 1.6, 0, 6.2832, true); g.fillStyle = `rgba(4,3,10,${al})`; g.fill();
  const rg = g.createRadialGradient(x, y, R * 0.7, x, y, R * 1.6); rg.addColorStop(0, "rgba(4,3,10,0)"); rg.addColorStop(1, `rgba(4,3,10,${al})`);
  g.fillStyle = rg; g.beginPath(); g.arc(x, y, R * 1.6, 0, 6.2832); g.fill();
  g.restore();
  k.brillo(g, x, y, R * 2.4, "255,235,190", 0.35 * (1 - on));
}

export const momentos = { pilas: Tpil, pierde: Tpie, solucion };
