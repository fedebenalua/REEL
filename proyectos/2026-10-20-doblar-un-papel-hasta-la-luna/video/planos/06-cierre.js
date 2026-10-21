// «Envíaselo a ese amigo que dice que un papel no se puede doblar más de siete veces.»
// La columna de la Tierra a la Luna otra vez (corte en «Envíaselo»): desde el primer fotograma, la Luna grande junto a
// la columna, que sigue hacia arriba. La cámara se aleja despacio hasta verla entera, con la Tierra abajo.
// - «doblar»: junto a la Tierra, «7 dobleces»; «siete»: una raya roja lo tacha, y el contador de la columna, 42, late.
import * as k from "#kit";
import { v } from "#voz";
import { mundo, alto, anchoColumna, viaje } from "../mundo.js";
import { XT } from "./03-subida.js";

export const desde = "enviaselo";

const { suave: su, tramo: tr, entra } = k;
const f12 = v.frase(12), T0 = f12.inicio, Tdoblar = f12.t("doblar"), Tsiete = f12.t("siete");
const H = alto(42), sFin = (1430 - 600) / H;
const cam = viaje([[T0 - 0.1, 3.3e8, 2.4e8], [Tdoblar, (1430 - 960) / sFin, 1920 / sFin], [v.duracion + 0.5, ((1430 - 960) / sFin) * 1.15, (1920 / sFin) * 1.3]]);

export function dibuja(g, t) {
  const c = cam(t);
  mundo(g, t, c, XT, H, anchoColumna(c));
  // «7 dobleces», tachado en «siete»
  const al7 = entra(tr(t, Tdoblar - 0.15, Tdoblar + 0.15));
  if (al7 > 0) {
    k.pastilla(g, 760, 1150, "7", "dobleces", "255,236,200", al7, 96);
    const raya = su(tr(t, Tsiete, Tsiete + 0.25));
    if (raya > 0) { g.save(); g.strokeStyle = "rgba(255,70,70,0.95)"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(640, 1185); g.lineTo(640 + 250 * raya, 1185 - 70 * raya); g.stroke(); g.restore(); }
  }
  const late = k.pulso(t, Tsiete + 0.3, 0.25);
  k.pastilla(g, 250, 1300, "42", "dobleces", "255,236,170", tr(t, T0 + 0.2, T0 + 0.6), 96 * (1 + 0.08 * late));
}
