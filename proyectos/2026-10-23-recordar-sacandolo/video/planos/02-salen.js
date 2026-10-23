// «Al acabar, casi todas les salían. Y creían que recordarían la mitad.»
// Ocho fichas grandes se encienden. La última se queda a medias. Luego un marco
// dorado cierra la mitad de la izquierda: eso es lo que creen que van a recordar.
import * as k from "#kit";
import { v } from "#voz";
import { cuarto, mesa, carta, velo } from "../mundo.js";

export const desde = "al";

const POS = Array.from({ length: 8 }, (_, i) => ({
  x: 160 + (i % 4) * 210,
  y: 740 + Math.floor(i / 4) * 340,
  icono: i,
}));

export function dibuja(g, t) {
  const f4 = v.frase(4), f5 = v.frase(5);
  const Tini = f4.inicio, Tsal = f4.t("salian"), Tmit = f5.t("mitad");
  cuarto(g, t, 1.05);
  mesa(g, 1320);

  // La mitad se adelanta durante toda la frase, y llega en «mitad».
  const mitad = k.suave(k.tramo(t, f5.inicio, Tmit + 0.18));

  POS.forEach((p, i) => {
    const enciende = k.entra(k.tramo(t, Tini + i * 0.2, Tini + 0.22 + i * 0.2));
    const salto = k.pulso(t, Tini + 0.12 + i * 0.2, 0.07);
    const casi = i === 7;
    const luz = casi ? Math.min(0.35, enciende) : enciende;
    const dentro = i % 4 < 2;
    const empuja = dentro ? mitad : 0;
    carta(g, p.x - empuja * 30, p.y - salto * 70 - empuja * 90, 200 * (1 + salto * 0.28 + empuja * 0.22), {
      icono: p.icono,
      giro: salto * 0.08,
      check: luz,
      fuego: (casi ? 0.1 : 0.35) * luz + (dentro ? empuja * 0.45 : 0),
      brilloColor: dentro ? "255,200,80" : "120,255,170",
      olvido: casi ? 0.5 : (dentro ? 0 : mitad * 0.45),
    });
  });

  // la última no llega: se queda corta, a la vista
  const duda = 1 - k.suave(k.tramo(t, Tsal - 0.1, Tsal + 0.25));
  if (duda > 0.05 && t < Tmit) {
    k.brillo(g, POS[7].x, POS[7].y, 220, "255,80,80", 0.25 * duda);
  }

  velo(g, 0.66);
}
