// «Uno siguió mirando las que ya se sabía.»
// Cuatro fichas enormes, ya con el tic, y un haz de la lámpara que las recorre.
// El haz pasa y no las deja más brillantes.
import * as k from "#kit";
import { v } from "#voz";
import { cuarto, mesa, carta, velo } from "../mundo.js";

export const desde = "uno";

const CARDS = [
  { x: 300, y: 860, icono: 0 },
  { x: 760, y: 820, icono: 3 },
  { x: 340, y: 1260, icono: 5 },
  { x: 780, y: 1240, icono: 1 },
];

export function dibuja(g, t) {
  const f = v.frase(6);
  const T0 = f.inicio, Tfin = f.fin;
  const hasta = v.frase(7).t("otro") - 0.04;
  cuarto(g, t, 1.25);
  mesa(g, 1280);

  const u = k.suave(k.tramo(t, T0 + 0.05, Math.min(Tfin, hasta - 0.28)));
  const px = k.mez(280, 800, u);
  const py = k.mez(860, 1220, u * 0.85);

  g.save();
  g.globalCompositeOperation = "lighter";
  const haz = g.createRadialGradient(px, py, 20, px, py, 280);
  haz.addColorStop(0, "rgba(255,214,140,0.55)");
  haz.addColorStop(1, "rgba(255,180,80,0)");
  g.fillStyle = haz;
  g.beginPath(); g.arc(px, py, 280, 0, 6.2832); g.fill();
  g.restore();

  // el cono, desde la lámpara hasta el punto
  g.save();
  g.globalCompositeOperation = "lighter";
  g.globalAlpha = 0.35;
  g.beginPath();
  g.moveTo(150, 250);
  g.lineTo(px - 90, py);
  g.lineTo(px + 90, py);
  g.closePath();
  const cg = g.createLinearGradient(150, 250, px, py);
  cg.addColorStop(0, "rgba(255,200,120,0.15)");
  cg.addColorStop(1, "rgba(255,200,120,0.55)");
  g.fillStyle = cg;
  g.fill();
  g.restore();

  for (const c of CARDS) {
    const d = Math.hypot(c.x - px, c.y - py);
    const bajo = Math.max(0, 1 - d / 260);
    carta(g, c.x, c.y, 250, {
      icono: c.icono,
      check: 1,
      fuego: 0.12 + bajo * 0.2,
      brilloColor: "255,210,140",
    });
  }
  velo(g, 0.7);
}
