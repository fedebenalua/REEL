// «El siete no llenaba la cabeza. Contaba trozos que ya venían hechos.»
// Los cajones se abren y dentro hay fardos ya atados. Al cierre, cuatro cosas sueltas delante.
import * as k from "#kit";
import { v } from "#voz";
import { cabeza, cajon, cosa, fondo, velo, RGB } from "../mundo.js";

export const desde = (voz) => voz.frase(13).inicio;

const f13 = v.frase(13), f14 = v.frase(14);
const Ttro = f13.t("trozos"), Thec = f13.t("hechos"), Tcoc = f14.t("cociente");

const CAJ = [
  [230, 760], [540, 720], [850, 760],
  [170, 1060], [410, 1100], [690, 1100], [940, 1060],
];
const SUELTAS = [1, 3, 4, 6];
const DELANTE = [
  [180, 1320], [400, 1360], [680, 1360], [900, 1320],
];

export function dibuja(g, t) {
  fondo(g, t);
  cabeza(g, 540, 900, 820, 1);
  const abre = k.suave(k.tramo(t, Ttro - 0.08, Thec + 0.2));
  const delante = k.suave(k.tramo(t, Tcoc - 0.2, Tcoc + 0.45));
  const llegada = k.entra(k.tramo(t, f13.inicio - 0.1, f13.t("cabeza") + 0.05));
  const sube = delante * 40;
  CAJ.forEach(([x, y0], i) => {
    const s = 108;
    const hueco = k.suave(k.tramo(t, f13.t("no"), f13.t("cabeza") + 0.25));
    const x2 = x + Math.sign(x - 540) * 70 * hueco * (1 - delante);
    const y = k.mez(y0 + 640, y0, llegada) - sube + Math.sin(t * 1.8 + i) * 8;
    cajon(g, x2, y, s, RGB[i], abre * 0.95);
    if (abre > 0.08) {
      g.save();
      g.globalAlpha = abre;
      cosa(g, i % 7, x2 - 30, y - 42 * abre, 34);
      cosa(g, (i + 3) % 7, x2 + 30, y - 34 * abre, 30);
      g.strokeStyle = "rgba(255,210,80,0.95)";
      g.lineWidth = 8;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(x2 - 52, y - 6);
      g.lineTo(x2 + 52, y - 56 * abre);
      g.stroke();
      g.restore();
    }
  });
  if (delante > 0.02) {
    SUELTAS.forEach((i, n) => {
      g.save();
      g.globalAlpha = delante;
      const bob = Math.sin(t * 2.1 + n) * 10 * delante;
      cosa(g, i, DELANTE[n][0], DELANTE[n][1] + bob, 108 * (0.55 + 0.45 * delante));
      g.restore();
    });
  }
  velo(g);
}
