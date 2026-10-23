// «Cheaper remotes, from companies people already knew, sold instead.»
// Otro sitio: los dos mandos baratos, enormes, caen y se quedan. El largo se apaga detrás.
import * as k from "#kit";
import { v } from "#voz";
import { mando, velo } from "../mundo.js";

export const desde = "cheaper";

const f = v.frase(8);
const Tfrom = f.t("from"), Tsold = f.t("sold");

export function dibuja(g, t) {
  g.fillStyle = "#120c18"; g.fillRect(0, 0, 1080, 1920);
  const techo = g.createRadialGradient(540, 280, 20, 540, 900, 1100);
  techo.addColorStop(0, "rgba(255,210,140,0.45)"); techo.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = techo; g.fillRect(0, 0, 1080, 1920);

  const caen = k.entra(k.tramo(t, f.inicio - 0.05, f.inicio + 0.5));
  const y1 = k.mez(860, 1040, caen);
  const y2 = k.mez(980, 1240, k.entra(k.tramo(t, f.inicio, f.inicio + 0.62)));
  const atras = 1 - k.suave(k.tramo(t, Tsold - 0.2, Tsold + 0.45));
  mando(g, 540, 1280, 420, "core", { al: 0.35 + 0.65 * atras, lcd: atras, aprende: atras, ang: 0.04 });
  mando(g, 340, y1, 780, "tv", { aprende: 1, ang: -0.06 });
  mando(g, 760, y2, 700, "barato", { aprende: 1, ang: 0.08 });
  k.brillo(g, 540, 1000, 800, "amarilla", 0.35 * k.pulso(t, Tsold + 0.05, 0.16));
  velo(g, 0.5);
}
