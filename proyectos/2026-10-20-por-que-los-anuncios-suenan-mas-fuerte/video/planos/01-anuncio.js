// «¿Por qué cuando llegan los anuncios, la tele suena más fuerte?»
// El salón de noche, desde detrás del sofá. Una sola cámara.
// - Fotograma 0: pegados a la tele, que estalla en un anuncio («¡OFERTA!») con ondas de sonido enormes y la barra del
//   volumen al rojo; la cámara sale disparada hacia atrás.
// - «anuncios»: se ve quien mira, desde atrás, que da un bote: se le pone el pelo de punta y saltan las palomitas.
// - «suena más fuerte»: otra ola de sonido cruza el salón.
// (El creador eligió esta apertura; la otra, que empezaba con el bote de quien mira, se quitó.)
import * as k from "#kit";
import { v } from "#voz";
import { CAM0, TELE, camara, mezCam, ondasSonido, salon, sofa } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra } = k;
const f1 = v.frase(1);
const Tanu = f1.t("anuncios"), Tsue = f1.t("suena"), Tfue = f1.t("fuerte"), Fin = v.frase(2).inicio;
export const bote = Tanu + 0.1;

export function escena(g, t, cam) {
  g.save(); camara(g, cam);
  salon(g, t, { anuncio: 1, volumen: 0.95, volAl: 1 - su(tr(t, Tfue + 0.3, Fin - 0.1)) });
  const fuerza = mez(0.9, 0.55, su(tr(t, 1, Tsue))) + 0.4 * k.pulso(t, Tfue, 0.25);
  ondasSonido(g, TELE.x, TELE.y, t, Math.min(1, fuerza) * (1 - 0.6 * su(tr(t, Tfue + 0.4, Fin))));
  sofa(g, t, k.pulso(t, bote + 0.12, 0.18) + 0.5 * k.pulso(t, Tfue + 0.1, 0.12));
  g.restore();
  k.fogonazo(g, TELE.x, TELE.y, t * 1.4, 1300, "255,200,120");
  const vg = g.createLinearGradient(0, 200, 0, 600); vg.addColorStop(0, "rgba(8,6,16,0.55)"); vg.addColorStop(1, "rgba(8,6,16,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 600);
}

export function camaraEn(t, inicio = { Z: 2.6, F: { x: TELE.x, y: TELE.y } }) {
  return mezCam(inicio, { Z: 1.15, F: { x: 540, y: 1100 } }, entra(tr(t, 0.05, Tanu + 0.15)));
}
export function dibuja(g, t) { escena(g, t, camaraEn(t)); }

export const momentos = { bote };
