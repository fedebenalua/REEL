// «¿Sabías que tu móvil puede ser el mando de la tele?» y «Sin pilas, y sin buscarlo por todo el salón.»
// El salón de noche, con el móvil delante de la tele.
// - Fotograma 0: muy cerca de la pantalla del móvil, en la app de mando; en «móvil» se toca el botón rojo y la tele,
//   al fondo, se enciende de golpe mientras la cámara sale disparada hacia atrás y se ve el salón entero; en «mando»,
//   otro toque y la tele cambia de canal. (El creador eligió esta apertura; la otra, el mando volando y la linterna,
//   se quitó.)
// - «Sin pilas»: a la izquierda aparece el mando de siempre y le saltan dos pilas vacías que caen.
// - «sin buscarlo por todo el salón»: el mando sale girando hacia el fondo del salón y se pierde.
import * as k from "#kit";
import { v } from "#voz";
import { MANDO, appMando, mando, movil, pila, salon, velo } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra, sale } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tmov = f1.t("movil"), Tman = f1.t("mando"), Tpil = f2.t("pilas"), Tbus = f2.t("buscarlo"), Tsal = f2.t("salon"), Fin = v.frase(3).inicio;
export const toque = Tmov + 0.05, enciende = toque + 0.08;

export const CAM = { x: 0, y: 20, z: 0.6 };
export const MOVIL = { x: 560, y: 1270, w: 470, ang: -0.12 };
export const BOTON = { x: 533, y: 1044 };                               // el botón rojo de la app, en pantalla
export const MANDO_IZQ = { X: -170, Y: 60, Z: 4.6, ang: -0.1 };
// el mando: perdido (lejos, girando) o en su sitio; ida de 0 a 1
export const mandoEn = (ida, base = MANDO_IZQ) => ({ X: base.X + 300 * ida, Y: base.Y - 330 * ida, Z: mez(base.Z, 40, ida * ida), ang: base.ang + 7 * ida });

// El salón con la tele encendida desde «enc», el móvil con la app (toque: un golpe de luz) y, si se pasa, el mando.
export function escena(g, t, op) {
  salon(g, CAM, t, { encendida: su(tr(t, op.enc, op.enc + 0.3)), flash: t - op.enc, canal: op.canal ?? 1, lampara: op.lampara ?? 1 });
  if (op.mando) mando(g, CAM, t, { al: op.mando.al ?? 1, pulsa: op.mando.pulsa ?? 0 }, op.mando.M);
  if (op.antes) op.antes(g);
  const M = op.movil ?? MOVIL;
  if (M) movil(g, M.x, M.y, M.w, M.ang, appMando(0.8 * Math.max(k.pulso(t, op.toque, 0.12), op.toque2 != null ? k.pulso(t, op.toque2, 0.12) : 0)), M.al ?? 1);
  // la tele se enciende: su luz llega a todo
  const fl = t - op.enc;
  if (fl > -0.05 && fl < 1.5) k.fogonazo(g, 540, 700, fl * 0.9, 1500, "255,220,240");
  velo(g, 0.45);
}

export function dibuja(g, t) {
  // la cámara: de la pantalla del móvil al salón entero
  const e = entra(tr(t, 0.1, toque + 0.75));
  const Z = Math.exp(mez(Math.log(2.5), 0, e)), F = { x: mez(BOTON.x, 540, e), y: mez(BOTON.y, 960, e) };
  g.save(); g.translate(540, 960); g.scale(Z, Z); g.translate(-F.x, -F.y);
  // el mando de siempre: llega, le saltan las pilas y se pierde
  const llega = entra(tr(t, Tpil - 0.45, Tpil - 0.05)), ida = su(tr(t, Tbus - 0.1, Tsal + 0.3));
  const base = { ...MANDO_IZQ, Y: MANDO_IZQ.Y + 900 * (1 - llega) };
  escena(g, t, {
    enc: enciende, toque, toque2: Tman, canal: su(tr(t, Tman + 0.1, Tman + 0.5)),
    mando: llega > 0 ? { M: mandoEn(ida, base), al: Math.min(1, 1.3 - ida) } : null,
    antes: (g2) => {
      const u = t - Tpil, nivel = mez(0.4, 0.06, su(tr(t, Tpil, Tpil + 0.3)));
      if (u > 0 && u < 1.6) {
        pila(g2, 300 - 160 * u, 1100 - 900 * u + 1500 * u * u, 380, -0.4 - 3 * u, nivel, t);
        pila(g2, 360 + 120 * u, 1150 - 700 * u + 1500 * u * u, 380, 0.3 + 2.5 * u, nivel, t);
      }
    },
  });
  g.restore();
}

export const momentos = { toque, enciende, pilas: Tpil };
