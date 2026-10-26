// El desescarche baja al agujero, el hielo lo tapa y el agua sale por la puerta.
import * as k from "#kit";
import { v } from "#voz";
import { agujero, bobinas, cajaFria, camara, quieto, rutaCam, tuboBajada, velo, viñeta } from "../mundo.js";

export const desde = "defrost";
const fin = v.t("first") - 0.04;
const f3 = v.frase(3), f4 = v.frase(4);

export function dibuja(g, t) {
  const tq = quieto(t, fin);
  const derretido = k.suave(k.tramo(tq, f3.t("defrost"), f3.t("hole") - 0.15));
  const baja = k.suave(k.tramo(tq, f3.t("slip"), f3.t("hole")));
  const alPan = k.suave(k.tramo(tq, f3.t("into"), f3.t("under") + 0.25));
  const tapado = k.suave(k.tramo(tq, f4.t("ice"), f4.t("plugs") + 0.25));
  const sale = k.suave(k.tramo(tq, f4.t("spills") - 0.1, f4.t("instead") - 0.15));
  const cam = rutaCam(tq, [
    [f3.t("defrost"), { x: 0, y: -500, s: 1.7 }],
    [f3.t("slip"), { x: 20, y: -80, s: 1.55 }],
    [f3.t("hole"), { x: 0, y: 300, s: 2.35 }],
    [f3.t("pan"), { x: 0, y: 820, s: 1.45 }],
    [f4.t("ice"), { x: 0, y: 280, s: 2.15 }],
    [f4.t("spills"), { x: 30, y: 160, s: 1.25 }],
    [fin - 0.22, { x: 40, y: 140, s: 1.15 }],
  ]);
  camara(g, cam);
  cajaFria(g);
  bobinas(g, tq, derretido);
  g.fillStyle = "rgba(200, 230, 245, 0.35)";
  g.fillRect(-480, 220, 960, 80);
  agujero(g, 0, 300, 1.8, tapado);
  if (baja > 0.02 && tapado < 0.85 && alPan < 0.95) {
    const gy = k.mez(-360, 280, baja);
    g.fillStyle = "#e7f8ff";
    g.beginPath();
    g.ellipse(10, gy, 28, 44, 0, 0, Math.PI * 2);
    g.fill();
  }
  if (alPan > 0.05 && tapado < 0.5) {
    tuboBajada(g, alPan);
    g.save();
    g.translate(0, 860);
    g.fillStyle = "#14181e";
    g.beginPath();
    g.ellipse(0, 40, 340, 78, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = `rgba(120, 210, 245, ${0.35 + alPan * 0.6})`;
    g.beginPath();
    g.ellipse(0, 30, 300, 56, 0, 0, Math.PI * 2);
    g.fill();
    if (alPan > 0.72) k.brillo(g, 0, 10, 260, "cian", (alPan - 0.72) * 2);
    g.restore();
  }
  if (sale > 0.02) {
    g.save();
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalAlpha = sale;
    const gr = g.createLinearGradient(200, 700, 980, 1500);
    gr.addColorStop(0, "rgba(180, 240, 255, 0)");
    gr.addColorStop(0.4, "rgba(80, 200, 255, 0.75)");
    gr.addColorStop(1, "rgba(230, 250, 255, 0.15)");
    g.fillStyle = gr;
    g.beginPath();
    g.moveTo(40, 620);
    g.quadraticCurveTo(480, 860, 1040, 1500);
    g.lineTo(1080, 1920);
    g.lineTo(0, 1920);
    g.lineTo(120, 980);
    g.closePath();
    g.fill();
    k.brillo(g, 540, 1200, 520, "cian", 0.4 * sale);
    g.restore();
  }
  velo(g, 0.72);
  viñeta(g, 0.4);
}
