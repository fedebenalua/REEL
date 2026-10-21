// «Son las once de la noche, empieza tu serie… y el mando no funciona.»
// El salón de noche, con una sola cámara.
// - «once»: en el mueble, un reloj rojo con las 23:00.
// - Fotograma 0: dentro de la tele, la serie a punto de empezar («T1 · Episodio 4»); la cámara sale disparada hacia
//   atrás y se ve el salón con el mando delante. (El creador eligió esta apertura; la otra, pegada al botón rojo, se
//   quitó.)
// - «el mando no funciona»: el botón se hunde una y otra vez, deprisa, y de la punta no sale nada; la tele, igual.
import * as k from "#kit";
import { v } from "#voz";
import { CAM0, MANDO, SERIE, enMando, mando, mezCam, pr, salon, velo } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra } = k;
const f1 = v.frase(1);
const Tman = f1.t("mando"), Tfun = f1.t("funciona"), Fin = v.frase(2).inicio;
export const GOLPES = [Tman - 0.05, Tman + 0.3, Tman + 0.6, Tfun + 0.15, Tfun + 0.4];

export function escena(g, t, cam) {
  salon(g, cam, t, { encendida: 1, canal: SERIE });
  // el reloj del mueble: las 23:00
  const r = pr(cam, 330, -10, 10.3);
  if (r) k.pastilla(g, r.x, r.y - 40 * r.s, "23:00", "", "255,90,90", su(tr(t, f1.t("once") - 0.1, f1.t("once") + 0.15)), 70 * r.s);
  const p = GOLPES.reduce((m, te) => Math.max(m, k.pulso(t, te + 0.05, 0.08)), 0);
  mando(g, cam, t, { pulsa: p });
  velo(g, 0.45);
}

const DENTRO = { x: 0, y: -240, z: 7.4 };
export function camara(t, inicio = DENTRO) {
  const e = entra(tr(t, 0.05, 1.5));
  const m = (a, b, u) => ({ x: mez(a.x, b.x, u), y: mez(a.y, b.y, u), z: mez(a.z, b.z, u) });
  // al final, un poco más cerca del mando que no va
  return m(m(inicio, CAM0, e), { x: 20, y: 60, z: 0.9 }, su(tr(t, Tman - 0.4, Tfun)));
}

export function dibuja(g, t) { escena(g, t, camara(t)); }

export const momentos = { golpes: GOLPES };
