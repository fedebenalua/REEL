// El mismo toque, en el brazo: la mano se aparta y el guante se queda.
import * as k from "#kit";
import { v } from "#voz";
import { guante, velo } from "../mundo.js";

export const desde = "brazo";
const Tret = v.frase(11).t("retirar");

export function dibuja(g, t) {
  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#1c2832");
  fondo.addColorStop(0.55, "#3e5362");
  fondo.addColorStop(1, "#12181e");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);
  const luz = g.createRadialGradient(540, 800, 30, 540, 1000, 760);
  luz.addColorStop(0, "rgba(255,214,170,0.4)");
  luz.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = luz;
  g.fillRect(0, 0, 1080, 1920);

  const seVa = k.entra(k.tramo(t, Tret - 0.04, Tret + 0.36));
  g.save();
  g.translate(seVa * 80, seVa * 520);
  const pg = g.createLinearGradient(200, 700, 900, 1300);
  pg.addColorStop(0, "#f3c2a4");
  pg.addColorStop(0.5, "#e39a78");
  pg.addColorStop(1, "#c47a58");
  g.strokeStyle = pg;
  g.lineWidth = 150;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(180, 1280);
  g.quadraticCurveTo(480, 1100, 760, 860);
  g.stroke();
  // mano
  g.fillStyle = "#f0b090";
  g.beginPath();
  g.ellipse(820, 780, 90, 110, -0.5, 0, 6.28);
  g.fill();
  for (let i = 0; i < 4; i++) {
    g.save();
    g.translate(800 + i * 18, 680);
    g.rotate(-0.8 + i * 0.18);
    k.redondo(g, -16, -130, 32, 140, 16);
    g.fill();
    g.restore();
  }
  g.restore();
  guante(g, 560, 980, 170, seVa > 0.15 ? 0 : 16);
  if (seVa > 0.2 && seVa < 0.85) k.fogonazo(g, 620, 1000, (seVa - 0.2) / 0.6, 300, "255,190,150");
  velo(g, 0.6);
}
