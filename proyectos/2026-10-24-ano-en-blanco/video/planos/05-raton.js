// «En crías de ratón, neuronas nuevas deshacen las huellas viejas.»
import * as k from "#kit";
import { v } from "#voz";
import { fondoCueva, neuronas, raton, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio;
const f7 = v.frase(7);
const Tn = f7.t("neuronas"), Th = f7.t("huellas"), Fin = v.frase(8).inicio;

export function dibuja(g, t) {
  fondoCueva(g, ["#4a2060", "#1a0830", "#080410"]);
  const entra = k.suave(k.tramo(t, Tn - 0.15, Tn + 0.55));
  const esc = k.mez(1, 2.35, entra);
  g.save();
  g.translate(540, 1080);
  g.scale(esc, esc);
  g.translate(-540, -1080);
  g.globalAlpha = 1 - entra;
  raton(g, 500, 1100, 1.05, t);
  g.restore();

  if (entra > 0.02) {
    g.save();
    g.globalAlpha = entra;
    fondoCueva(g, ["#5a2870", "#220838", "#0c0614"]);
    // aro de pelo: seguimos dentro del ratón
    g.save();
    g.beginPath();
    g.rect(0, 0, 1080, 1920);
    g.arc(540, 1040, 700, 0, 6.2832, true);
    const pg = g.createLinearGradient(0, 0, 1080, 1920);
    pg.addColorStop(0, "#e8b890");
    pg.addColorStop(0.5, "#c08050");
    pg.addColorStop(1, "#6a3828");
    g.fillStyle = pg;
    g.fill();
    g.restore();
    const rotura = k.suave(k.tramo(t, Th - 0.08, Math.min(Th + 0.7, Fin - 0.28)));
    const chispa = t < Fin - 0.22 ? rotura : rotura;
    neuronas(g, t < Fin - 0.22 ? t : Fin - 0.22, chispa);
    g.restore();
  }
  veloArriba(g, 0.7);
}
