// «Encienden dos señales muy pegadas.»
// Dos lámparas y dos manos. La segunda espera lo que las lámparas se han acercado.
import * as k from "#kit";
import { v } from "#voz";
import { lampara, manoGolpe, sala, velo } from "../mundo.js";

export const desde = "encienden";

const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8);
const Tpeg = f5.t("pegadas"), Tresp = f5.t("respondes");
const Tllega = f6.t("llega"), Taire = f6.t("aire");
const Tacerca = f7.t("acercas"), Thecho = f7.t("acercado");
const Tsola = f8.t("sola"), Trapida = f8.t("rapida");
const corte = v.frase(9).inicio - 0.04;

const XI = 360, XD = 740, Y = 1180, R = 150;

export function dibuja(g, t) {
  sala(g, "#0c1024", "#070814", 540, 900, 980);
  const junta0 = k.suave(k.tramo(t, f5.inicio, Tpeg));
  const junta = k.suave(k.tramo(t, Tacerca, Thecho));
  const sep = k.mez(k.mez(280, 200, junta0), 40, junta);
  const xI = 540 - sep, xD = 540 + sep;
  const sola = k.suave(k.tramo(t, Tsola, Tsola + 0.35));
  const fuerzaI = (0.55 + 0.45 * k.pulso(t, Tllega, 0.12)) * (1 - sola);
  const fuerzaD = 0.55 + 0.45 * k.pulso(t, Trapida, 0.1);

  // mesa
  g.fillStyle = "#12141c";
  g.beginPath();
  g.ellipse(540, 1460, 520, 90, 0, 0, 6.2832);
  g.fill();

  lampara(g, xI, Y, R, "255,176,64", fuerzaI);
  lampara(g, xD, Y, R, "70,220,255", fuerzaD);

  // manos
  const bajaI = k.suave(k.tramo(t, Tresp, Tllega));
  const yI = k.mez(280, Y - 180, bajaI);
  const aplastaI = k.pulso(t, Tllega, 0.08);
  if (sola < 0.98) {
    g.globalAlpha = 1 - sola;
    manoGolpe(g, xI, yI, 1.45, aplastaI, "#ffe0c2");
    g.globalAlpha = 1;
  }
  // la derecha baja y se queda; al acercarlas, la barra de espera crece
  const bajaD = k.suave(k.tramo(t, Tresp + 0.05, Taire));
  const cuelga = k.mez(0.62, 0.28, junta); // más juntas, más alta se queda
  const rapida = k.suave(k.tramo(t, Tsola + 0.15, Trapida));
  const prog = k.mez(bajaD * cuelga, 1, rapida);
  const yD = k.mez(260, Y - 180, prog);
  manoGolpe(g, xD, yD, 1.45, k.pulso(t, Trapida, 0.08), "#d9f6ff");

  // la barra: el trozo que han perdido de separación, entre el dedo y la lámpara
  const barra = junta * (1 - rapida);
  if (barra > 0.04) {
    const y0 = yD + 40, y1 = k.mez(y0, Y - R * 0.2, 0.15 + 0.85 * barra);
    g.save();
    g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(255,210,120,${0.85 * barra})`;
    g.lineWidth = 18;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(xD + 120, y0);
    g.lineTo(xD + 120, y1);
    g.stroke();
    g.restore();
  }

  if (t < corte - 0.35) k.fogonazo(g, xI, Y, t - Tllega, 700, "255,190,90");
  const uR = t - Trapida;
  if (uR > 0 && uR < 0.7) k.fogonazo(g, xD, Y, uR, 780, "140,230,255");
  velo(g, 0.55);
}
