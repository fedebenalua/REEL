// «Envíaselo a ese amigo que mete dos camisetas y pone carga completa.»
// El tambor enorme con dos camisetas. En «completa» el mando gira hasta el tope.
import * as k from "#kit";
import { v } from "#voz";
import { camara, cuarto, cuerpo, mando, tambor, velo } from "../mundo.js";

export const desde = "enviaselo";
const f = v.frase(10);

function camiseta(g, x, y, s, ang, tono) {
  g.save();
  g.translate(x, y); g.rotate(ang); g.scale(s, s);
  const osc = k.mezColor(tono, "#1a1028", 0.4);
  const cla = k.mezColor(tono, "#ffffff", 0.35);
  const gr = g.createLinearGradient(-40, -50, 30, 60);
  gr.addColorStop(0, cla); gr.addColorStop(0.5, tono); gr.addColorStop(1, osc);
  g.fillStyle = gr;
  k.redondo(g, -36, -16, 72, 90, 16); g.fill();
  g.beginPath(); g.moveTo(-36, -4); g.quadraticCurveTo(-84, 2, -70, 38); g.quadraticCurveTo(-38, 28, -28, 6); g.fill();
  g.beginPath(); g.moveTo(36, -4); g.quadraticCurveTo(84, 2, 70, 38); g.quadraticCurveTo(38, 28, 28, 6); g.fill();
  g.restore();
}

export function dibuja(g, t) {
  const tope = k.suave(k.tramo(t, f.t("completa") - 0.12, f.t("completa") + 0.38));
  const acerca = k.suave(k.tramo(t, f.t("camisetas") - 0.1, f.finDe("completa") - 0.15));
  const pala = 1.15 + Math.sin(t * 1.6) * 0.08;
  const cam = {
    x: k.mez(540, 540, acerca),
    y: k.mez(1000, 1120, acerca),
    z: k.mez(1.02, 1.38, acerca),
  };
  camara(g, cam, (gg) => {
    cuarto(gg);
    cuerpo(gg, 150, 560, 780, 1000);
    mando(gg, 760, 650, 78, tope, 0);
    const est = { pala, vel: 0, carga: 0, agua: 0, tm: t, corriente: 0 };
    // tambor vacío: se dibuja y, encima, solo dos camisetas
    tambor(gg, 540, 1100, 250, { ...est, sinRopa: true });
    gg.save();
    gg.beginPath(); gg.arc(540, 1100, 220, 0, 6.3); gg.clip();
    const bal = Math.sin(t * 1.6) * 10;
    camiseta(gg, 450, 1140 + bal, 2.5, -0.35, "#ff3b5c");
    camiseta(gg, 630, 1210 - bal, 2.3, 0.45, "#ffd23f");
    gg.restore();
    gg.strokeStyle = "#2a3038"; gg.lineWidth = 28;
    gg.beginPath(); gg.arc(540, 1100, 268, 0, 6.3); gg.stroke();
    k.reflejo(gg, 430, 960, 28, 150, 0.28);
  });
  velo(g);
}
