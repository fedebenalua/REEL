// «El teléfono igual: nueve cifras, dichas de tres en tres.»
// Nueve cifras enormes, sueltas, que se cierran en tres filas.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, numero, velo } from "../mundo.js";

export const desde = "telefono";

const f7 = v.frase(7);
const Tnueve = f7.t("nueve"), Ttres = f7.t("tres");
const DIG = ["6", "1", "2", "3", "4", "5", "6", "7", "8"];
const SUELTO = [
  [180, 700], [540, 560], [900, 740],
  [240, 1040], [620, 980], [880, 1180],
  [200, 1420], [520, 1360], [860, 1500],
];
const FILA = [700, 1000, 1300];

export function dibuja(g, t) {
  fondo(g, t, "rio");
  const grupo = k.suave(k.tramo(t, Ttres - 0.08, Ttres + 0.42));
  const entra = k.entra(k.tramo(t, f7.inicio - 0.2, Tnueve + 0.15));
  DIG.forEach((d, i) => {
    const col = i % 3, fil = Math.floor(i / 3);
    const x1 = 220 + col * 320, y1 = FILA[fil];
    const x = k.mez(SUELTO[i][0] + (1 - entra) * (i - 4) * 80, x1, grupo);
    const y = k.mez(k.mez(SUELTO[i][1] - 420, SUELTO[i][1], entra), y1, grupo);
    numero(g, x, y, d, fil === 0 ? "255,214,90" : fil === 1 ? "120,220,255" : "255,150,190", 150);
  });
  if (grupo > 0.4) {
    g.save();
    g.globalAlpha = grupo;
    g.strokeStyle = "rgba(255,220,140,0.85)";
    g.lineWidth = 8;
    for (const y of FILA) {
      k.redondo(g, 90, y - 130, 900, 250, 40);
      g.stroke();
    }
    g.restore();
  }
  velo(g);
}
