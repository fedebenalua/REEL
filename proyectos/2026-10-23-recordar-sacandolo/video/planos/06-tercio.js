// «Siete días después, quien dejó de probarse recuerda en torno a un tercio.»
// Pasan siete hojas. Luego nueve fichas: se apagan seis y se quedan tres.
import * as k from "#kit";
import { v } from "#voz";
import { cuarto, mesa, carta, velo } from "../mundo.js";

export const desde = "siete";

const COLORES = ["#ff5a3c", "#ffb703", "#3d8bfd", "#14b8a6", "#c77dff", "#ff4d6d", "#22d3ee"];
const NUEVE = Array.from({ length: 9 }, (_, i) => ({
  x: 230 + (i % 3) * 280,
  y: 700 + Math.floor(i / 3) * 280,
  icono: i % 10,
  seQueda: i === 0 || i === 4 || i === 8,
}));

export function dibuja(g, t) {
  const f = v.frase(9);
  const T0 = f.inicio, Td = f.t("despues"), Tter = f.t("tercio");
  const fin = v.frase(10).inicio - 0.04;
  cuarto(g, t, 0.7);
  // la luz del día corre durante «siete días»
  const dia = k.tramo(t, T0, Td + 0.15);
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, k.mez(120, 960, dia), k.mez(1500, 700, dia), 800, dia < 0.5 ? "255,170,80" : "140,180,255", 0.35 * (1 - k.suave(k.tramo(t, Td, Td + 0.4))));
  g.restore();
  mesa(g, 1400);

  // siete hojas que se van
  for (let i = 0; i < 7; i++) {
    const sale = k.suave(k.tramo(t, T0 + i * 0.08, Td + 0.05));
    if (sale > 0.98) continue;
    const x = 540 + (i - 3) * 18 + sale * (i - 3) * 110;
    const y = k.mez(980, 480, sale);
    g.save();
    g.translate(x, y);
    g.rotate((i - 3) * 0.05 + sale * (i - 3) * 0.2);
    g.globalAlpha = 1 - sale;
    k.redondo(g, -120, -150, 240, 300, 18);
    g.fillStyle = "#fff6e8";
    g.fill();
    g.fillStyle = COLORES[i];
    g.fillRect(-120, -150, 240, 42);
    g.restore();
  }

  const aparecen = k.entra(k.tramo(t, Td - 0.05, Td + 0.4));
  const crecen = k.entra(k.tramo(t, Tter - 0.15, Tter + 0.2));
  const quieto = k.suave(k.tramo(t, fin - 0.28, fin - 0.02));
  const caen = [1, 2, 3, 5, 6, 7];

  NUEVE.forEach((c, i) => {
    const cual = caen.indexOf(i);
    const cae = cual < 0 ? 0 : k.entra(k.tramo(t, f.t("dejo") + cual * 0.22, f.t("dejo") + 0.28 + cual * 0.22));
    const tam = (c.seQueda ? 210 + crecen * 50 : 200) * aparecen;
    carta(g, c.x + (c.seQueda ? (c.x - 540) * crecen * 0.08 : 0), c.y + cae * 780 - (c.seQueda ? crecen * 20 : 0), tam, {
      icono: c.icono,
      al: aparecen * (1 - cae),
      olvido: cae * 0.6,
      check: c.seQueda ? 1 : 1 - cae,
      fuego: c.seQueda ? 0.35 + crecen * 0.35 * (1 - quieto * 0.5) : 0,
      brilloColor: "255,196,90",
      giro: cae * (cual % 2 ? 0.4 : -0.35),
    });
  });
  velo(g, 0.7);
}
