// «Solo ves el tuyo»: el móvil azul llena la pantalla y la otra versión se cierra.
import * as k from "#kit";
import { v } from "#voz";
import { sala, velo, telefono, pantallaConBoton } from "../mundo.js";

export const desde = (vz) => vz.frase(3).inicio;

const { suave: su, tramo: tr } = k;
const f3 = v.frase(3);
const T0 = f3.inicio, Tasi = f3.t("asi"), Tcom = f3.t("comparar");

export function dibuja(g, t) {
  sala(g, "#06101c", "#0a1830", t);
  const cierra = su(tr(t, Tasi, Tcom - 0.05));
  const empuje = 1 + 0.04 * su(tr(t, T0, f3.fin));

  k.brillo(g, 540, 1100, 1100, "60,130,255", 0.2);

  // la otra versión, asomando por la derecha, y una tapa que la cierra
  g.save();
  g.translate(860 + cierra * 280, 1180);
  g.rotate(0.08);
  telefono(g, 0, 0, 420, 860, 0, (c, x, y, w, h) => pantallaConBoton(c, x, y, w, h, t, "verde", 0.8));
  g.restore();

  telefono(g, 500, 1140, 760 * empuje, 1280 * empuje, -0.02, (c, x, y, w, h) => {
    pantallaConBoton(c, x, y, w, h, t * 0.6, "azul", 1);
  });

  // la tapa oscura que deja solo el tuyo
  if (cierra > 0.01) {
    g.save();
    g.globalAlpha = Math.min(1, cierra * 1.3);
    const tapa = g.createLinearGradient(700, 0, 1080, 0);
    tapa.addColorStop(0, "rgba(6,10,20,0)");
    tapa.addColorStop(0.35, "rgba(6,10,20,0.92)");
    tapa.addColorStop(1, "#050814");
    g.fillStyle = tapa;
    g.fillRect(640, 500, 500, 1300);
    g.restore();
  }
  velo(g, 0.82);
}
