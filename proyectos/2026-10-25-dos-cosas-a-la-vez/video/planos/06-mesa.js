// «Era una, y luego la otra.»
// La misma mesa del principio: primero la boca, después la mano.
import * as k from "#kit";
import { v } from "#voz";
import { anillos, boca, manoEscribe, sala, velo } from "../mundo.js";

export const desde = "era";

const f15 = v.frase(15), f16 = v.frase(16);
const Tluego = f15.t("luego");
const Tvarias = f16.t("varias");
const fin = v.duracion;

export function dibuja(g, t) {
  sala(g, "#14081f", "#07060f", 540, 900, 900);
  const paso = k.suave(k.tramo(t, Tluego - 0.05, Tluego + 0.45));
  const abre = k.mez(0.7 + 0.3 * Math.max(0, Math.sin(t * 8)), 0.08, paso);
  const z = k.curva([
    [f15.inicio, 1.2],
    [Tluego, 1.15],
    [f16.inicio, 1.35],
    [Tvarias, 0.86],
    [fin, 0.84],
  ], undefined, 0);
  const cx = k.mez(320, 540, k.suave(k.tramo(t, f15.inicio, Tluego + 0.55)));
  g.save();
  g.translate(540, 980);
  g.scale(z, z);
  g.translate(-cx, -1000);
  g.fillStyle = "#1a1224";
  g.beginPath();
  g.ellipse(540, 1380, 620, 120, 0, 0, 6.2832);
  g.fill();
  boca(g, 300, 860, 1.25, Math.max(0.06, abre));
  anillos(g, 300, 980, t, "80,220,255", (1 - paso) * abre);
  const trazo = k.suave(k.tramo(t, Tluego, Tluego + 0.7));
  manoEscribe(g, 800, 1120, 1, trazo, (1 - trazo) * 0.8);
  g.restore();
  const viaja = k.suave(k.tramo(t, f16.inicio + 0.15, Tvarias + 0.2));
  const lx = k.mez(360, 760, viaja), ly = k.mez(860, 1120, viaja);
  if (viaja > 0.02 && viaja < 0.98) k.brillo(g, lx, ly, 380, "255,220,140", 0.7 * Math.sin(viaja * Math.PI));
  // al final, quieto: sin anillos ya
  void fin;
  velo(g, 0.62);
}
