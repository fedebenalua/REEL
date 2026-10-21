// «¿Y si no te quedan pilas en casa? Tranquilo, que el móvil tiene otro truco.»
// El cajón de las cosas, visto desde arriba. Se entra con un corte en «¿Y».
// - «¿Y si no te quedan pilas en casa?»: el cajón abierto, lleno de cosas (cinta, tijeras, llaves, gomas...) que se
//   remueven buscando; ni una pila.
// - «Tranquilo, que el móvil»: entra el móvil y se posa encima; «truco»: su pantalla se enciende.
import * as k from "#kit";
import { v } from "#voz";
import { appMando, cajon, movil } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f4 = v.frase(4);
export const desde = (vz) => vz.frase(4).inicio;
const T0 = f4.inicio, Tpil = f4.t("pilas"), Tcas = f4.t("casa"), Ttra = f4.t("tranquilo"), Tmov = f4.t("movil"), Ttru = f4.t("truco"), Fin = v.frase(5).inicio;

export function dibuja(g, t) {
  const fg = g.createLinearGradient(0, 0, 0, 1920); fg.addColorStop(0, "#2a1a10"); fg.addColorStop(1, "#140c06");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  // una luz de cocina, cálida, desde arriba
  k.brillo(g, 540, 700, 1800, "255,200,140", 0.35);
  // el cajón se abre hacia la cámara y se remueve
  const abre = entra(tr(t, T0 - 0.05, T0 + 0.5)), busca = Math.sin(t * 14) * 10 * su(tr(t, Tpil - 0.2, Tpil)) * (1 - su(tr(t, Tcas + 0.2, Tcas + 0.5)));
  g.save(); g.translate(540 + busca, mez(700, 1040, abre)); g.rotate(busca * 0.002);
  cajon(g, 0, 0, 760, t);
  g.restore();
  // el móvil entra y se posa
  const en = entra(tr(t, Ttra - 0.1, Tmov + 0.1));
  if (en > 0) {
    const luz = su(tr(t, Ttru - 0.2, Ttru + 0.1));
    movil(g, mez(1500, 620, en), mez(1700, 1060, en), 420, mez(0.8, 0.18, en), (c, W, H) => { c.fillStyle = "#000"; c.fillRect(0, 0, W, H); c.save(); c.globalAlpha = luz; appMando(0.5 * k.pulso(t, Ttru + 0.1, 0.2))(c, W, H); c.restore(); });
    k.brillo(g, 620, 1060, 1100, "200,110,255", 0.45 * luz);
  }
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(10,6,3,0.7)"); vg.addColorStop(1, "rgba(10,6,3,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}

export const momentos = { busca: Tpil, truco: Ttru };
