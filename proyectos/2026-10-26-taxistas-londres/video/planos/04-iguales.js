// «El hipocampo… era igual… Ni el tamaño ni la memoria… Tres años después… seguía igual.»
// Una pieza. Llegan otras dos y coinciden. Pasan los años y no crece.
import * as k from "#kit";
import { v } from "#voz";
import { fondoPieza, pieza, velo } from "../mundo.js";

export const desde = (vx) => vx.frase(6).inicio;

export function dibuja(g, t) {
  const f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8);
  const Tigual = f6.t("igual"), Tfin = v.frase(9).inicio;
  const llegan = k.suave(k.tramo(t, f6.t("pieza"), Tigual + 0.15));
  const anios = k.suave(k.tramo(t, f8.inicio, f8.t("despues") + 0.35));
  const cam = k.ruta([
    [f6.inicio, { pos: [0.15, 0.45, 2.15], mira: [0, 0.28, 0] }],
    [Tigual, { pos: [-0.35, 0.4, 1.95], mira: [0, 0.32, 0.05] }],
    [f7.t("tamano"), { pos: [0.05, 0.55, 2.05], mira: [0, 0.3, 0] }],
    [f8.inicio, { pos: [0.4, 0.42, 2.1], mira: [0, 0.3, 0] }],
    [f8.t("igual"), { pos: [0.15, 0.48, 2.0], mira: [0, 0.3, 0] }],
    [Tfin - 0.05, { pos: [0.15, 0.48, 2.0], mira: [0, 0.3, 0] }],
  ])(t);

  fondoPieza(g);
  // las dos que llegan, desde los lados, y caen encima
  for (const lado of [-1, 1]) {
    const ox = (1 - llegan) * lado * 1.6;
    const oy = (1 - llegan) * 0.8;
    pieza(g, cam, { al: 0.35 + llegan * 0.45, origen: [ox, oy, 0], tono: "180,140,220" });
  }
  pieza(g, cam, { tono: "232,168,96", al: 1 });

  // un arco de medida que les vale a las tres y se queda
  const mide = k.suave(k.tramo(t, f7.inicio, f7.t("tamano") + 0.2));
  if (mide > 0.02) {
    const q = k.proyecta(cam, [0, 0.35, 0]);
    if (q) {
      const r = k.tamano(0.72, q.z);
      g.save();
      g.globalAlpha = mide;
      g.strokeStyle = "rgba(255,220,140,0.9)";
      g.lineWidth = 8;
      g.beginPath();
      g.arc(q.x, q.y, r, Math.PI * 1.05, Math.PI * 1.95);
      g.stroke();
      g.restore();
    }
  }

  // los años dan una vuelta y la pieza no cambia de grosor
  if (anios > 0.02) {
    const q = k.proyecta(cam, [0, 0.3, 0]);
    if (q) {
      const ang = -Math.PI / 2 + anios * Math.PI * 2;
      const r = k.tamano(0.95, q.z);
      g.save();
      g.strokeStyle = "rgba(255,170,80,0.35)";
      g.lineWidth = 6;
      g.beginPath();
      g.arc(q.x, q.y, r, 0, 6.2832);
      g.stroke();
      k.brillo(g, q.x + Math.cos(ang) * r, q.y + Math.sin(ang) * r, 80, "255,186,80", 1 - k.suave(k.tramo(t, Tfin - 0.55, Tfin - 0.28)));
      g.restore();
    }
  }
  velo(g);
}
