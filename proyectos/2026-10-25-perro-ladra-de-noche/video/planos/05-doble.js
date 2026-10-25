// «En cinco perros, un pitido fuerte llegaba a más del doble.» La cinta rompe el tope y llega mucho más lejos.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = (voz) => voz.frase(5).inicio;
const f = v.frase(5);
const fin = v.frase(6).inicio;

export function dibuja(g, t) {
  const rompe = k.suave(k.tramo(t, f.t("pitido") - 0.05, f.t("doble") + 0.15));
  const x1 = k.mez(250, 640, rompe);
  const c = {
    Z: k.claves([[f.inicio, 3.5], [f.t("fuerte"), 3.4], [f.t("doble"), 4.8], [fin - 0.1, 5.1]])(t),
    cx: k.claves([[f.inicio, 320], [f.t("doble"), 560], [fin - 0.1, 600]])(t),
    cy: -78,
  };
  m.salon(g, c, t, m.NOCHE);
  m.ponVista(g, c);
  m.dueno(g, 200, t, { dir: -1, oreja: 1 - rompe });
  m.cinta(g, 40, x1, -112, t, 1);
  g.save();
  g.globalAlpha = 0.35 * (1 - rompe * 0.4);
  g.strokeStyle = "rgba(255,255,255,0.8)";
  g.lineWidth = 2;
  g.setLineDash([4, 6]);
  g.beginPath();
  g.moveTo(250, -150);
  g.lineTo(250, -70);
  g.stroke();
  g.restore();
  m.lado(g, 690, t, { dir: -1, escala: 0.92 });
  m.ondas(g, x1, -112, t, { radio: 18 + rompe * 28, fuerza: 0.4 + rompe, color: "160,230,255" });
  if (rompe > 0.2) k.fogonazo(g, 250, -112, (t - f.t("pitido")) * 0.9, 70, "200,230,255");
  m.rellena(g, 0.42);
}
