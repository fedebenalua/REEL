// «Quien siguió sacándolas, cerca de ocho de cada diez.»
// Diez fichas grandes. Se encienden ocho y se quedan así.
import * as k from "#kit";
import { v } from "#voz";
import { cuarto, mesa, carta, velo } from "../mundo.js";

export const desde = "quien#2";

const DIEZ = Array.from({ length: 10 }, (_, i) => ({
  x: 150 + (i % 5) * 185,
  y: 780 + Math.floor(i / 5) * 380,
  icono: i % 10,
  vive: i < 8,
}));

export function dibuja(g, t) {
  const f = v.frase(10);
  const T0 = f.inicio, fin = v.frase(11).inicio - 0.04;
  cuarto(g, t, 0.85);
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 540, 1100, 900, "255,180,70", 0.18);
  g.restore();
  mesa(g, 1380);

  const quieto = k.suave(k.tramo(t, fin - 0.3, fin - 0.02));
  DIEZ.forEach((c, i) => {
    const cuando = T0 + 0.12 + i * 0.26;
    const enciende = c.vive ? k.entra(k.tramo(t, cuando, cuando + 0.18)) : 0;
    const salto = c.vive ? k.pulso(t, cuando + 0.08, 0.07) : 0;
    carta(g, c.x, c.y - salto * 55, 170 * (1 + salto * 0.3), {
      icono: c.icono,
      check: c.vive ? enciende : 0,
      olvido: c.vive ? 0 : 0.8,
      fuego: c.vive ? (0.25 + salto) * enciende * (1 - quieto * 0.4) : 0,
      brilloColor: "255,200,80",
    });
  });
  velo(g, 0.68);
}
