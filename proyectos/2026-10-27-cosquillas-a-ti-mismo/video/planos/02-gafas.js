// «Ni siquiera si te cambias de cuerpo con otra persona.» «Lo probaron con unas gafas que te hacían ver por los ojos
// de otro.»
// - «Ni»: unas gafas de realidad virtual llegan girando hasta llenar la pantalla; en sus lentes, tu palma (manga azul)
//   sobre una mesa.
// - «cuerpo»: las dos imágenes giran como un remolino y salen la mano y la manga roja del otro.
// - «gafas»: un brillo recorre la carcasa.
// - «ver por los ojos de otro»: la cámara entra por la lente derecha hasta que lo que ve el otro llena la pantalla
//   (sigue en 03-vista).
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, LENTES, RL, ROJO, gafas, vista, fondoMorado, vineta, velo } from "../mundo.js";

export const desde = (v) => v.frase(2).inicio;
export const entrada = "corte";

const { suave: su, tramo: tr, mez, entra } = k;
const f2 = v.frase(2), f3 = v.frase(3);
const T0 = f2.inicio, Tcue = f2.t("cuerpo"), Tgaf = f3.t("gafas"), Tver = f3.t("ver"), Tfin = v.frase(4).inicio;
export const zoom = (t) => su(tr(t, Tver - 0.45, Tfin - 0.2));

export function dibuja(g, t) {
  fondoMorado(g, t);
  const llega = entra(tr(t, T0 - 0.05, T0 + 0.75));
  const u = zoom(t);
  const acerca = mez(1, 1.12, su(tr(t, T0 + 0.8, Tver - 0.45)));
  const sG = Math.exp(mez(Math.log(mez(0.45, 1, llega) * acerca), Math.log(7), u));
  const c = Math.exp(mez(Math.log(0.32 * acerca), 0, u)), q = c / sG, ancla = mez(1250, 960, su(u));
  const [lx, ly] = LENTES[1];
  const Lx = mez(540 + lx, 540, u), Ly = mez(980 + ly, 960, u);
  const ang = (mez(0.5, 0, llega) + 0.05 * Math.sin((t - T0) * 1.4) * llega) * (1 - u);
  const gx = Lx - lx * sG, gy = Ly - ly * sG;
  // el remolino del cambio de cuerpo
  const giro = su(tr(t, Tcue - 0.35, Tcue + 0.45)), cambio = t > Tcue + 0.05;
  const estilo = cambio ? ROJO : AZUL;
  gafas(g, gx, gy, sG, ang, t, (gc, i) => {
    gc.save();
    gc.translate(LENTES[i][0], LENTES[i][1]);
    gc.rotate(giro * 6.2832 * (i ? 1 : -1));
    gc.scale(q, q); gc.translate(-540, -ancla);
    vista(gc, t, { estilo, mueve: mez(0.6, 0.15, u), mano: 1 });
    gc.restore();
    const destello = k.pulso(t, Tcue + 0.05, 0.12);
    if (destello > 0.01) k.brillo(gc, LENTES[i][0], LENTES[i][1], RL * 2.2, "255,255,255", 0.8 * destello);
  }, 1 - u);
  // «gafas»: un brillo que recorre la carcasa
  const b = tr(t, Tgaf - 0.1, Tgaf + 0.5);
  if (b > 0 && b < 1 && u < 0.3) {
    g.save(); g.globalCompositeOperation = "lighter";
    const x = mez(gx - 600 * sG, gx + 600 * sG, b);
    const gr = g.createLinearGradient(x - 120, 0, x + 120, 0);
    gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.5, `rgba(255,255,255,${0.35 * Math.sin(Math.PI * b)})`); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, gy - 300 * sG, 1080, 600 * sG);
    g.restore();
  }
  vineta(g, 0.5 * (1 - u)); velo(g, mez(0.4, 0.7, u));
}
