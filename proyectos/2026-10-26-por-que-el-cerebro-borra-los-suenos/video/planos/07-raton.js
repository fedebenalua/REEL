// «En ratones, apagar unas neuronas de esa fase hizo que guardaran mejor lo aprendido.»
// «Que hagan eso con tus sueños, todavía no se ha visto en personas.»
// El ratón duerme. Dentro, las neuronas se apagan y lo aprendido se queda.
// La canica del sueño, al lado, se queda a medias.
import * as k from "#kit";
import { v } from "#voz";
import { canica, neuronas, raton, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(8).t("en");

const f8 = v.frase(8), f9 = v.frase(9);
const Tneu = f8.t("neuronas");
const Tguarda = f8.t("guardaran");
const Tapr = f8.t("aprendido");
const Tque = f9.t("que");
const Tvisto = f9.t("visto");

export function dibuja(g, t) {
  const bg = g.createLinearGradient(0, 0, 1080, 1920);
  bg.addColorStop(0, "#3a2414");
  bg.addColorStop(0.4, "#1a100c");
  bg.addColorStop(1, "#0c0808");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);

  // mesa
  const mesa = g.createLinearGradient(0, 1280, 0, 1920);
  mesa.addColorStop(0, "#a86a3c");
  mesa.addColorStop(1, "#4a2814");
  g.fillStyle = mesa;
  g.fillRect(0, 1320, 1080, 600);
  g.strokeStyle = "rgba(60,30,10,0.35)";
  g.lineWidth = 3;
  for (let i = 0; i < 14; i++) {
    g.beginPath(); g.moveTo(0, 1360 + i * 40); g.bezierCurveTo(300, 1350 + i * 40, 700, 1380 + i * 40, 1080, 1365 + i * 40); g.stroke();
  }
  // lámpara
  k.brillo(g, 240, 420, 900, "255,190,110", 0.55);
  g.fillStyle = "#f2d7a4";
  g.beginPath(); g.ellipse(240, 430, 70, 28, 0, 0, 6.2832); g.fill();
  g.strokeStyle = "#6b5030"; g.lineWidth = 6;
  g.beginPath(); g.moveTo(240, 430); g.lineTo(180, 180); g.stroke();

  const dentro = k.suave(k.tramo(t, Tneu - 0.35, Tneu + 0.35));
  const apagadas = k.suave(k.tramo(t, Tneu - 0.05, Tneu + 0.55));
  const seQueda = k.suave(k.tramo(t, Tguarda - 0.1, Tapr + 0.2));
  const alLado = k.suave(k.tramo(t, Tque, Tque + 0.6));
  // el parpadeo de «no se ha visto» se apaga antes del corte
  // se queda a medias, sin parpadear: la duda no es un fallo de la imagen
  const alSueno = alLado * k.mez(0.72, 0.38, k.suave(k.tramo(t, Tvisto - 0.2, Tvisto + 0.45)));

  if (dentro < 0.92) {
    g.save();
    g.globalAlpha = 1 - dentro;
    raton(g, 520, 1180, k.mez(2.15, 2.6, dentro * 0.3), t);
    g.restore();
  }

  if (dentro > 0.08) {
    g.save();
    g.globalAlpha = dentro;
    g.fillStyle = "rgba(8,4,12,0.55)";
    g.fillRect(0, 500, 1080, 1200);
    neuronas(g, k.mez(540, 360, alLado), 1040, t, apagadas);
    const alCamino = k.mez(0.4, 1, seQueda);
    canica(g, k.mez(540, 320, alLado), 1180, k.mez(150, 210, seQueda), t, "camino", alCamino);
    if (alLado > 0.05) canica(g, 760, 1220, 200, t, "pez", Math.max(0.12, alSueno));
    g.restore();
  }
  velo(g, 0.5);
}
