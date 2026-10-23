// «No las graba mirarlas. Las graba volver a buscarlas.»
// Una ficha enorme se apaga mientras la mira la lámpara. Luego sale de una ranura oscura, encendida.
import * as k from "#kit";
import { v } from "#voz";
import { cuarto, mesa, carta, velo } from "../mundo.js";

export const desde = "no";

export function dibuja(g, t) {
  const f = v.frase(11);
  const Tmir = f.t("mirarlas"), Tbus = f.t("buscarlas");
  const fin = v.frase(12).inicio - 0.04;
  cuarto(g, t, 1);
  mesa(g, 1260);

  const mira = 1 - k.suave(k.tramo(t, Tmir - 0.15, Tmir + 0.45));
  const cae = k.suave(k.tramo(t, Tmir + 0.15, Tbus - 0.35));
  const sube = k.suave(k.tramo(t, Tbus - 0.35, Tbus + 0.2));
  const quieto = k.suave(k.tramo(t, fin - 0.3, fin - 0.02));

  // la ranura
  g.save();
  g.translate(540, 1280);
  k.redondo(g, -220, -30, 440, 70, 16);
  g.fillStyle = "#120a1c";
  g.fill();
  g.strokeStyle = "rgba(255,196,120,0.4)";
  g.lineWidth = 4;
  g.stroke();
  g.restore();

  const y = k.mez(980, 1240, cae * (1 - sube)) - sube * 80;
  const olvido = (1 - mira) * (1 - sube);
  const x = 540;

  // haz de mirar, solo mientras se mira
  if (mira > 0.05) {
    g.save();
    g.globalCompositeOperation = "lighter";
    g.globalAlpha = mira * (1 - quieto);
    g.beginPath();
    g.moveTo(160, 240);
    g.lineTo(x - 120, y);
    g.lineTo(x + 120, y);
    g.closePath();
    g.fillStyle = "rgba(255,200,120,0.35)";
    g.fill();
    g.restore();
  }

  carta(g, x, y, 280 + sube * 160, {
    icono: 0,
    olvido: Math.min(1, olvido * 1.15),
    check: sube,
    fuego: sube * 0.7 * (1 - quieto * 0.35),
    brilloColor: "255,210,90",
    al: 0.35 + 0.65 * (1 - olvido * 0.7),
  });
  velo(g, 0.72);
}
