// «Keep bleach tablets out of the tank. They warp that rubber.»
// La pastilla cae, el guante la saca, y la goma se deforma un instante.
import * as k from "#kit";
import { v } from "#voz";
import { velo, viñeta, guante, gradH, GOMA } from "../mundo.js";

export const desde = (vx) => vx.frase(9).inicio - 2 / 60;
export const entrada = "corte";

const f = v.frase(9);
const Tout = f.t("out"), Twarp = f.t("warp");
const { suave: su, tramo: tr } = k;
const u = (t, a, b) => su(tr(t, a, b));

export function dibuja(g, t) {
  const cae = u(t, f.inicio, Tout);
  const fuera = u(t, Tout - 0.05, Tout + 0.35);
  const deforma = u(t, Twarp - 0.15, Twarp + 0.25) * (1 - u(t, Twarp + 0.45, Twarp + 0.85));
  const yTab = k.mez(-520, 40, cae);
  const xTab = k.mez(0, 280, fuera);
  const yTab2 = k.mez(yTab, -80, fuera);

  g.save();
  g.translate(540, 1040);
  // agua
  const ag = g.createLinearGradient(0, -700, 0, 700);
  ag.addColorStop(0, "#123a62");
  ag.addColorStop(0.5, "#1c6ec4");
  ag.addColorStop(1, "#0a2a55");
  g.fillStyle = ag;
  g.fillRect(-800, -1200, 1600, 2400);
  // brillos del agua
  g.globalAlpha = 0.35;
  g.fillStyle = "rgba(200,240,255,0.5)";
  for (let i = 0; i < 5; i++) {
    const yy = -400 + ((t * 80 + i * 140) % 900);
    g.fillRect(-360, yy, 720, 10);
  }
  g.globalAlpha = 1;
  // goma, grande
  g.save();
  g.translate(0, 220);
  g.scale(1 + deforma * 0.08, 1 - deforma * 0.22);
  g.rotate(deforma * 0.18);
  g.beginPath();
  g.ellipse(0, 0, 280, 150, 0, 0, 6.28);
  g.fillStyle = gradH(g, -280, 280, GOMA);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.4)";
  g.beginPath();
  g.ellipse(-80, -40, 70, 28, -0.4, 0, 6.28);
  g.fill();
  if (deforma > 0.05) {
    g.strokeStyle = `rgba(255,80,40,${deforma})`;
    g.lineWidth = 8;
    g.beginPath();
    g.moveTo(-40, -20);
    g.quadraticCurveTo(20, 30, 90, -10);
    g.stroke();
  }
  g.restore();
  // pastilla
  g.save();
  g.translate(xTab, yTab2);
  g.rotate(cae * 2);
  g.beginPath();
  g.ellipse(0, 0, 90, 48, 0, 0, 6.28);
  g.fillStyle = gradH(g, -90, 90, [[0, "#e8e8ea"], [0.45, "#ffffff"], [1, "#b7b8bc"]]);
  g.fill();
  g.fillStyle = "rgba(80,190,120,0.85)";
  g.beginPath();
  g.arc(-20, -6, 14, 0, 6.28);
  g.fill();
  g.restore();
  const alM = u(t, Tout - 0.25, Tout) * (1 - u(t, f.fin - 0.35, f.fin - 0.05));
  guante(g, k.mez(360, 200, fuera), k.mez(-200, yTab2, u(t, Tout - 0.3, Tout + 0.15)), -0.6, 1.8, alM);
  g.restore();
  viñeta(g, 0.4);
  velo(g, 0.62);
}
