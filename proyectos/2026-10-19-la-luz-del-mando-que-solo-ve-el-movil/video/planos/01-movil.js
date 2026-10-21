// «¿Sabías que tu mando de la tele lanza una luz que solo ve la cámara de tu móvil?» y «Apúntalo a la cámara, pulsa
// un botón… y ahí está.»
// El mando y el móvil, de frente, en el salón a oscuras. Una sola cámara.
// - Fotograma 0: la punta del mando de verdad, enorme, que se pulsa y no se ve nada (solo un temblor del aire); en
//   «mando» entra el móvil volando por la derecha y en su pantalla la misma punta se enciende morada; los dos se
//   colocan: el mando arriba a la izquierda, el móvil abajo a la derecha. (El creador eligió esta apertura; la otra,
//   que empezaba dentro de la pantalla del móvil, se quitó.)
// - «Apúntalo a la cámara»: los golpes paran y la cámara se acerca al móvil; «pulsa un botón»: el botón rojo baja
//   despacio; «ahí está»: se hunde y la pantalla se llena de luz.
import * as k from "#kit";
import { v } from "#voz";
import { camaraDelMovil, fondoOscuro, movil, puntaDeFrente, temblor } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tapu = f2.t("apuntalo"), Tpul = f2.t("pulsa"), Tahi = f2.t("ahi"), Fin = v.frase(3).inicio;
export const GOLPES = []; for (let te = 0.0; te < Tapu - 0.4; te += 0.55) GOLPES.push(te);
export const ahi = Tahi - 0.04;
const golpe = (t) => Math.max(GOLPES.reduce((m, te) => Math.max(m, k.pulso(t, te + 0.06, 0.09)), 0), 0.25 * su(tr(t, Tpul, ahi - 0.05)) * (1 - su(tr(t, ahi + 0.6, Fin))), k.pulso(t, ahi, 0.12));

export const MANDO = { x: 330, y: 790, w: 560 }, MOVIL = { x: 720, y: 1200, w: 500, ang: 0.07 };
export const PANTALLA = { x: 718, y: 1168 };

// La escena con la cámara { Z, F } (zoom alrededor del punto F) y, si hace falta, otro sitio para el mando y el móvil.
export function escena(g, t, cam, lay = {}) {
  const M = lay.mando ?? MANDO, P = lay.movil ?? MOVIL;
  fondoOscuro(g);
  g.save(); g.translate(540, 960); g.scale(cam.Z, cam.Z); g.translate(-cam.F.x, -cam.F.y);
  const p = golpe(t);
  puntaDeFrente(g, M.x, M.y + 6 * Math.sin(t * 1.3), M.w, 0, p);
  temblor(g, M.x, M.y, M.w, t, [...GOLPES, ahi]);
  const led = Math.min(1, p * 1.1) + 0.6 * k.pulso(t, ahi + 0.1, 0.35);
  movil(g, P.x, P.y, P.w, P.ang, camaraDelMovil(led, p), lay.alMovil ?? 1);
  g.restore();
  // «ahí está»: la luz llena la pantalla
  k.brillo(g, 540, 1000, 1700, "200,110,255", 0.6 * k.pulso(t, ahi + 0.06, 0.2));
}

export function camara(t) {
  let Z = 1, F = { x: 540, y: 960 };
  const a = su(tr(t, Tapu, ahi + 0.1));
  Z = mez(Z, 1.45, a); F = { x: mez(F.x, PANTALLA.x - 60, a), y: mez(F.y, PANTALLA.y - 120, a) };
  return { Z, F };
}

const Tman = f1.t("mando"), Tsit = Tman + 1.3;
export function dibuja(g, t) {
  if (t >= Tsit) return escena(g, t, camara(t));
  const en = entra(tr(t, Tman - 0.3, Tman + 0.2)), sit = su(tr(t, Tman + 0.3, Tsit));
  const mando = { x: mez(540, MANDO.x, sit), y: mez(980, MANDO.y, sit), w: mez(1000, MANDO.w, sit) };
  const movil = { x: mez(mez(1600, 760, en), MOVIL.x, sit), y: mez(mez(1500, 1180, en), MOVIL.y, sit), w: MOVIL.w, ang: mez(mez(0.5, 0.1, en), MOVIL.ang, sit) };
  escena(g, t, camara(t), { mando, movil, alMovil: en > 0 ? 1 : 0 });
}

export const momentos = { golpes: GOLPES, ahi };
