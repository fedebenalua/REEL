// «Antes de empezar, escanearon a setenta y nueve aprendices y a gente que no estudiaba.»
// El anillo de la resonancia, enorme, y la cama que entra.
import * as k from "#kit";
import { v } from "#voz";
import { velo } from "../mundo.js";

export const desde = (vx) => vx.frase(5).inicio;

export function dibuja(g, t) {
  const f = v.frase(5);
  const Tscan = f.t("escanearon"), Tfin = v.frase(6).inicio;
  const entra = k.suave(k.tramo(t, Tscan - 0.05, f.t("aprendices") + 0.15));
  const zoom = k.claves([
    [f.inicio, 1], [Tscan, 1.08], [f.t("nueve"), 1.28], [Tfin - 0.28, 1.55], [Tfin, 1.55],
  ]);
  const giro = k.claves([
    [f.inicio, 0], [Tfin - 0.35, Math.PI * 1.4], [Tfin, Math.PI * 1.4],
  ]);

  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#061018");
  fondo.addColorStop(0.55, "#0c2438");
  fondo.addColorStop(1, "#07140f");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);

  g.save();
  g.translate(540, 1040);
  g.scale(zoom(t), zoom(t));
  g.translate(-540, -1040);

  // la cama que se mete en el aro
  const camaX = k.mez(980, 430, entra);
  g.save();
  k.redondo(g, camaX, 980, 620, 90, 20);
  g.fillStyle = "#d5dde8";
  g.fill();
  // la persona, de lado, sin cara: cabeza y cuerpo bajo la sábana
  g.fillStyle = "#f2d2b0";
  g.beginPath();
  g.ellipse(camaX + 90, 930, 54, 46, 0, 0, 6.28);
  g.fill();
  g.fillStyle = "#3a6ea8";
  k.redondo(g, camaX + 130, 900, 420, 120, 40);
  g.fill();
  g.restore();

  // el aro
  g.save();
  g.translate(540, 1040);
  g.strokeStyle = "#d7e6f2";
  g.lineWidth = 78;
  g.beginPath();
  g.ellipse(0, 0, 300, 390, 0, 0, 6.28);
  g.stroke();
  g.strokeStyle = "rgba(120,230,255,0.9)";
  g.lineWidth = 10;
  g.beginPath();
  g.ellipse(0, 0, 250, 330, 0, 0, 6.28);
  g.stroke();
  const a = giro(t);
  for (let i = 0; i < 10; i++) {
    const ang = a + (i / 10) * 6.2832;
    const x = Math.cos(ang) * 300, y = Math.sin(ang) * 390;
    k.brillo(g, x, y, 70, "120,230,255", 0.9);
  }
  g.restore();
  g.restore();

  k.pastilla(g, 540, 1320, "79", "", "120,230,255", k.suave(k.tramo(t, f.t("setenta") - 0.05, f.t("nueve") + 0.1)) * (1 - k.suave(k.tramo(t, Tfin - 0.7, Tfin - 0.3))), 96);
  velo(g, 0.82);
}
