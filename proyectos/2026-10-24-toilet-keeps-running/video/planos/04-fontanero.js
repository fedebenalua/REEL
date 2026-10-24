// «If the wall valve won't turn, stop and call a plumber.»
// La mano empuja y la llave no se mueve. La suelta. Entra el teléfono.
import * as k from "#kit";
import { v } from "#voz";
import { velo, viñeta, bano, guante, gradH, CROMO } from "../mundo.js";

export const desde = (vx) => vx.frase(10).inicio - 2 / 60;
export const entrada = "corte";

const f = v.frase(10);
const Tturn = f.t("turn"), Tstop = f.t("stop"), Tplumb = f.t("plumber");
const { suave: su, tramo: tr } = k;
const u = (t, a, b) => su(tr(t, a, b));

export function dibuja(g, t) {
  const empuja = u(t, Tturn - 0.25, Tturn + 0.12) * (1 - u(t, Tturn + 0.18, Tstop));
  const suelta = u(t, Tstop - 0.05, Tstop + 0.4);
  const tel = u(t, Tplumb - 0.25, Tplumb + 0.3);
  g.save();
  g.translate(540, 1080);
  g.scale(1.35, 1.35);
  g.translate(0, -40);
  bano(g, 520);
  // cuerpo de la llave, grande
  g.beginPath();
  k.redondo(g, -70, -120, 140, 250, 28);
  g.fillStyle = gradH(g, -70, 70, CROMO);
  g.fill();
  g.save();
  g.rotate(empuja * 0.08);
  g.beginPath();
  g.arc(0, 0, 96, 0, 6.28);
  g.fillStyle = gradH(g, -96, 96, [[0, "#f8fcff"], [0.5, "#c9d3dc"], [1, "#667480"]]);
  g.fill();
  g.strokeStyle = "rgba(20,30,40,0.5)";
  g.lineWidth = 8;
  for (let i = 0; i < 4; i++) {
    g.rotate(Math.PI / 2);
    g.beginPath();
    g.moveTo(0, 16);
    g.lineTo(0, -88);
    g.stroke();
  }
  g.restore();
  // anilla roja: no gira
  g.save();
  g.globalAlpha = 0.35 + 0.65 * empuja;
  g.strokeStyle = "#ff4d3a";
  g.lineWidth = 12;
  g.beginPath();
  g.arc(0, 0, 118, 0, 6.28);
  g.stroke();
  g.restore();
  const alM = u(t, f.inicio - 0.05, f.inicio + 0.25) * (1 - suelta);
  guante(g, k.mez(220, 90, u(t, f.inicio, Tturn)), 70, 0.35 + empuja * 0.9, 2.15, alM);
  // teléfono
  if (tel > 0.02) {
    g.save();
    g.globalAlpha = tel;
    g.translate(k.mez(260, 0, tel), 340);
    k.redondo(g, -70, -130, 140, 250, 28);
    g.fillStyle = gradH(g, -70, 70, [[0, "#1a2430"], [0.4, "#3d4c5e"], [1, "#121820"]]);
    g.fill();
    g.fillStyle = "#0c2420";
    k.redondo(g, -52, -100, 104, 180, 12);
    g.fill();
    const pulso = 0.45 + 0.55 * Math.sin(t * 7);
    g.fillStyle = `rgba(70,230,130,${0.4 + 0.5 * pulso})`;
    g.beginPath();
    g.arc(0, 0, 36, 0, 6.28);
    g.fill();
    g.strokeStyle = "#f4fff8";
    g.lineWidth = 7;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(-16, -4);
    g.quadraticCurveTo(0, 18, 16, -4);
    g.stroke();
    g.restore();
  }
  g.restore();
  viñeta(g, 0.4);
  velo(g, 0.6);
}
