// Otra apertura: el pico ya está frenado y el hueco llena la pantalla, sin el viaje por el cristal.
import * as k from "#kit";
import { v } from "#voz";
import { pintarLab } from "../mundo.js";

export const desde = 0;

export function dibuja(g, t) {
  pintarLab(g, t);
  const Talc = v.frase(1).t("alcanza");
  const u = 1 - k.suave(k.tramo(t, 0, Math.min(0.45, Talc)));
  if (u > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(255,255,255,${0.55 * u})`;
    g.lineWidth = 10;
    g.beginPath();
    g.arc(540, 980, 220 + (1 - u) * 180, 0, 6.28);
    g.stroke();
    g.restore();
  }
}
