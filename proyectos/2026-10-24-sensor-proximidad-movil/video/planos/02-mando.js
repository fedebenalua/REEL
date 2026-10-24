// Otro sitio: el salón. La misma luz que no se ve, la del mando de la tele.
// El cono sale en «luz» y llega a la tele en «mando». Se apaga antes del corte, en «sale».
import * as k from "#kit";
import { v } from "#voz";
import { cono, mando, televisor, velo } from "../mundo.js";

export const desde = "lo";

const { suave: su, tramo: tr } = k;
const f4 = v.frase(4);
const Tluz = f4.t("luz"), Tmando = f4.t("mando");
const AX = 640, AY = 1280, ANG = -0.55;

export function dibuja(g, t) {
  const pared = g.createLinearGradient(0, 0, 0, 1920);
  pared.addColorStop(0, "#16324a");
  pared.addColorStop(0.55, "#1d4a62");
  pared.addColorStop(1, "#3a2618");
  g.fillStyle = pared;
  g.fillRect(0, 0, 1080, 1920);
  g.fillStyle = "#6a4328";
  g.fillRect(0, 1500, 1080, 420);
  g.fillStyle = "#8a5a34";
  for (let i = 0; i < 8; i++) g.fillRect(0, 1520 + i * 48, 1080, 8);
  const lam = g.createRadialGradient(160, 360, 0, 160, 360, 520);
  lam.addColorStop(0, "rgba(255,196,120,0.55)");
  lam.addColorStop(1, "rgba(255,196,120,0)");
  g.fillStyle = lam;
  g.fillRect(0, 0, 1080, 1100);
  const sube = k.entra(tr(t, f4.inicio, Tluz + 0.15));
  const ay = k.mez(1540, AY, sube);
  const ang = k.mez(-0.15, ANG, sube);
  televisor(g, 540, 760, 820, 460, t);
  const viaje = su(tr(t, Tluz - 0.08, Tluz + 0.55));
  const al = viaje * (1 - su(tr(t, Tmando + 0.05, Tmando + 0.34)));
  const pulsa = su(tr(t, Tluz + 0.15, Tluz + 0.45)) * (1 - su(tr(t, Tmando + 0.02, Tmando + 0.25)));
  g.save();
  g.translate(AX - 50, ay + 60);
  g.rotate(ang);
  k.redondo(g, -110, -20, 260, 320, 90);
  const mg = g.createLinearGradient(-110, 0, 150, 240);
  mg.addColorStop(0, "#e7b098");
  mg.addColorStop(1, "#c4846c");
  g.fillStyle = mg;
  g.fill();
  g.restore();
  mando(g, AX, ay, ang, pulsa, al);
  const lx = AX + 168 * Math.sin(ang), ly = ay - 168 * Math.cos(ang);
  const tx = 540, ty = 760 + 214;
  cono(g, lx, ly, k.mez(lx, tx, viaje), k.mez(ly, ty, viaje), al, 160);
  k.brillo(g, tx, ty, 780, "255,30,130", al * 0.85);
  k.brillo(g, 540, 700, 1200, "255,30,130", al * 0.28);
  velo(g, 0.8);
}
